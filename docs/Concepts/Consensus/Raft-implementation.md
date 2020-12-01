---
description: Raft implementation details
---

# Raft implementation in Ethereum

In GoQuorum, Raft is integrated via an implementation of the
[`Service`](https://godoc.org/github.com/ConsenSys/quorum/node#Service) interface in
[`node/service.go`](https://github.com/ConsenSys/quorum/blob/master/node/service.go). The Service
interface implements an individual protocol that can be registered into a node. [`Ethereum`](https://godoc.org/github.com/ConsenSys/quorum/eth#Ethereum)
is also implemented using the Service interface.

## Chain extension and races

Raft is responsible for reaching consensus on which blocks should be accepted into the chain. In the
simplest scenario, every block that passes through Raft becomes the new head of the chain.

Occasionally a new block passes through Raft that
cannot be the new head of the chain. If Raft encounters a block whose parent is not the
head of the chain when applying the Raft log ordering, the log entry is skipped as a no-op.

In Raft, the leader of the Raft cluster is the only Ethereum node that mints new blocks.
During leadership changes, it is possible for two nodes to be minting blocks for a short period of time.
If two nodes are minting at once, there is a race and the first block that successfully extends the
chain wins. The losing block is ignored.

### Race example

Raft entries attempting to extend the chain are denoted as:

`[ 0xbeda Parent: 0xacaa ]`

Where:

* `0xbeda` is the ID of new block
* `0xacaa` is the ID of the parent of the new block.

The initial minter (node 1) is partitioned, and node 2 takes over as the minter.

```text
 time                   block submissions
                   node 1                node 2
  |    [ 0xbeda Parent: 0xacaa ]
  |
  |   -- 1 is partitioned; 2 takes over as leader/minter --
  |
  |    [ 0x2c52 Parent: 0xbeda ] [ 0xf0ec Parent: 0xbeda ]
  |                              [ 0x839c Parent: 0xf0ec ]
  |
  |   -- 1 rejoins --
  |
  v                              [ 0x8b37 Parent: 0x839c ]
```

Once the partition heals, node 1 resubmits block `0x2c52` at the Raft layer. The resulting serialized
log is:

```text
[ 0xbeda Parent: 0xacaa - Extends! ]  (due to node 1)
[ 0xf0ec Parent: 0xbeda - Extends! ]  (due to node 2, the winner)
[ 0x839c Parent: 0xf0ec - Extends! ]  (due to node 2)
[ 0x2c52 Parent: 0xbeda - NO-OP.   ]  (due to node 1, the loser)
[ 0x8b37 Parent: 0x839c - Extends! ]  (due to node 2)
```

Because `0x2c52` (the loser) is serialized after `0xf0ec` (the winner), `0x2c52` does not extend the
chain. The parent of `0x2c52` is not the head of the chain when the entry is applied. `0xf0ec`
extended the same parent (`0xbeda`) and extended the chain again with ` 0x839c`.

Each block is accepted by Raft and serialized in the log. The `Extends` or `No-op`
designation occurs at a higher level in the implementation. For Raft, each log entry
is valid. In the GoQuorum Raft implementation, not all entries are used to extend the chain.
The chain extension logic is deterministic. That is, the same exact behavior occurs on
every node in the cluster, keeping the blockchain in sync.

Unlike Proof of Work, the state of a blockchain using Raft consensus is consistent and does not fork.
When a block is added at the new chain head, the block is added for the entire cluster and is permanent.

## Speculative minting

Speculative minting is an optimization that provides lower latency between blocks (that is, faster
transaction finality).

Waiting synchronously for a block to become the new chain head before creating the next
block increases the time it takes for transactions to make it into the chain.

In speculative minting, a new block is created and proposed to Raft before the parent block
has made it all the way through Raft and into the blockchain. The speculative blocks
can be created repeatedly and form a speculative chain.

When a speculative chain forms, the subset of transactions in the pool that have been included in blocks
in the speculative chain that have not yet made it into the blockchain are tracked. The subset of transactions
are called proposed transactions (see `speculative_chain.go`).

When the proposed transactions make it into the chain, a [`core.ChainHeadEvent`](https://godoc.org/github.com/ConsenSys/quorum/core#ChainHeadEvent)
occurs.

Due to [races](#race-example), a block in a speculative chain is not always included in the chain. When
a block in the speculative chain does not make it into the chain, an
[`InvalidRaftOrdering`](https://godoc.org/github.com/ConsenSys/quorum/raft#InvalidRaftOrdering) event
occurs. When a [`InvalidRaftOrdering`](https://godoc.org/github.com/ConsenSys/quorum/raft#InvalidRaftOrdering) event
occurs, the state of the speculative chain is updated.

!!! note
    Speculative chains have no length limit. A minter can create an arbitrary number of blocks back-to-back in a
    scenario where Raft stops making progress.

### State in a speculative chain

* `head`: The last-created speculative block. Is `nil` if the last-created block is already included in the blockchain.
* `proposedTxes`: The set of transactions that have been proposed to Raft in some block, but not yet included in the blockchain.
* `unappliedBlocks`: A queue of blocks which have been proposed to Raft but not yet committed to the blockchain.
    * When minting a new block, we enqueue it at the end of this queue.
    * `accept` is called to remove the oldest speculative block when it's accepted into the blockchain.
    * When an [`InvalidRaftOrdering`](https://godoc.org/github.com/ConsenSys/quorum/raft#InvalidRaftOrdering) event
    occurs, the queue is unwound by popping the most recent blocks from the new end of the queue until we find the invalid block.
    The newer speculative blocks are repeatedly removed because they are all dependent on a block that
    has not been included in the chain.
* `expectedInvalidBlockHashes`: The set of blocks that build on an invalid block, but haven't yet passed
through Raft. When the non-extending blocks come back through Raft, they are removed them from the
speculative chain. `expectedInvalidBlockHashes` is a guard against trying to trim the speculative chain
when it shouldn't be.
