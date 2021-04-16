---
description: Lifecycle of a transaction when using Raft consensus
---

# Lifecycle of a transaction in Raft

## On any node (minter, follower, or learner)

1. The transaction is submitted using an RPC call to GoQuorum.
1. Using the P2P protocol, the transaction is announced
to all peers. Raft clusters use static nodes so every transaction
is sent to all peers in the cluster.

## On the minter

1. When the transaction reaches the minter, the transaction is included in the next block (see `mintNewBlock`)
via the transaction pool.
1. Block creation triggers a [`NewMinedBlockEvent`](https://godoc.org/github.com/ConsenSys/quorum/core#NewMinedBlockEvent).
The Raft protocol manager receives the new block event via subscription to `minedBlockSub`. The `minedBroadcastLoop` (in `raft/handler.go`)
puts the new block to the `ProtocolManager.blockProposalC` channel.
1. `serveLocalProposals` is waiting at the other end of the channel. `serveLocalProposals` RLP-encodes
blocks and proposes the blocks to Raft. Once the block flows through Raft, this block most likely becomes
the new head of the blockchain (on all nodes).

## On every node

<!-- vale off -->
1. Raft reaches consensus and appends the log entry containing the block to the Raft
log. At the Raft layer, the leader sends an `AppendEntries` to all
followers, and all followers acknowledge receipt of the message. Once the leader has received a quorum of
acknowledgements, the leader notifies each node that the new entry has been committed permanently to the log.

<!-- vale on -->
1. Having crossed the network through Raft, the block reaches the `eventLoop`. `eventLoop` processes Raft
log entries. The block arrives from the leader through `pm.transport`, an instance of `rafthttp.Transport`.

1. The block is handled by `applyNewChainHead`. `applyNewChainHead` checks whether the block extends the
chain (that is, whether the block parent is the current head of the chain). If the block does not extend
the chain, the block is ignored as a no-op. If the block does extend the chain, the block is validated and
written as the new head of the chain by [`InsertChain`](https://godoc.org/github.com/ConsenSys/quorum/core#BlockChain.InsertChain).

1. A [`ChainHeadEvent`](https://godoc.org/github.com/ConsenSys/quorum/core#ChainHeadEvent) is posted to
notify listeners that a new block has been accepted. `ChainHeadEvent`:
    - Removes the relevant transaction from the transaction pool.
    - Removes the relevant transaction from the [proposed transactions on this speculative chain](Raft-implementation.md#speculative-minting).
    - Triggers `requestMinting` in (`minter.go`) to schedule the minting of a new block if more transactions are pending.

The transaction is now available on all nodes in the cluster with finality. Raft guarantees
a single ordering of log entries. Everything that is committed is guaranteed
to remain so there is no forking of a blockchain built on Raft.
