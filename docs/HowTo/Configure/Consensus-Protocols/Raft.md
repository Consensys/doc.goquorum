---
description: Configuring Raft consensus
---

# Configuring Raft consensus

GoQuorum implements the Raft Proof-of-Authority (PoA) consensus protocol.
To enable Raft consensus, specify the [`--raft`](../../../Reference/CLI-Syntax.md#raft) command line option when starting GoQuorum.

Raft requires that all initial nodes in the cluster are configured as
[static peers](https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network#static-nodes).
The order of the enode IDs in the `static-nodes.json` file must be the same across all peers.

The enode IDs must include a `raftport` querystring parameter specifying the Raft port for each peer.

!!! example

    ```bash
    enode://abcd@127.0.0.1:30400?raftport=50400
    ```

You can follow a [tutorial to create a private network using Raft](../../../Tutorials/Private-Network/Create-a-Raft-network.md)
and [add nodes to a Raft network](../../Use/adding_nodes.md#raft).

## Terminology

In Raft, a node can be one of the following:

- Leader:
    - Mints blocks and sends the blocks to the verifier and learner nodes.
    - Can vote during re-election and become a verifier if it doesn't win a majority of the votes.
    - Can add and remove learners and verifiers, and promote learners to verifiers.
    - The network triggers re-election if the leader node dies.
- Verifier:
    - Follows the leader.
    - Applies the blocks minted by the leader.
    - Can vote during re-election and become the leader if it wins a majority of the votes.
    - Sends confirmation to the leader.
    - Can add and remove learners and verifiers, and promote learners to verifiers.
- Learner:
    - Follows the leader.
    - Applies the blocks minted by the leader.
    - Can't vote during re-election.
    - Can't become a verifier on its own.
      Must be promoted by a leader or verifier.
    - Can't add learners or verifiers, or promote learners to verifiers.
    - Can't remove other learners or verifiers but can remove itself.

When a node is added or removed as a verifier, it impacts the Raft quorum.
Therefore, when [adding a new node](../../Use/adding_nodes.md#raft) to a long-running Raft network, we recommend adding
the node as a learner.
Once the learner node fully synchronizes with the network, it can then be promoted to verifier.

## Number of nodes

For the Raft network to work, 51% of the nodes must be up and running.
Therefore, a cluster of two nodes can't tolerate any failures, three nodes can tolerate one, and five nodes can tolerate two.

Typically, Raft clusters have an odd number of nodes, since an even number provides no failure tolerance benefit.
We recommend having an odd number of at least three nodes in the network.

## Minting frequency

By default, blocks are minted no more frequently than every 50ms. When transactions arrive:

- If it has been at least 50ms since the last block, a new block is minted immediately.
- If it has been less that 50ms, a new block is minted 50ms after the previous block was minted. Waiting
prevents Raft being flooded with blocks.

The rate limiting achieves a balance between transaction throughput and latency.

Configure the minting frequency using the [`--raftblocktime`](../../../Reference/CLI-Syntax.md#raftblocktime)
command line option when starting GoQuorum.

## Raft transport layer

Blocks are communicated over the HTTP transport layer built into [etcd Raft](https://github.com/coreos/etcd).

By default, GoQuorum listens on port 50400 for the Raft transport. Use the
[`--raftport`](../../../Reference/CLI-Syntax.md#raftport) command line option to change the port.

By default, the number of peers is 25. Use the `--maxpeers N` command line option to configure the
maximum number of peers where N is expected size of the cluster.

## Notes

- Raft produces far more than one block per second, which standard Ethereum implicitly prohibits (since the default
  timestamp resolution is in seconds and every block must have a timestamp greater than its parent).
  Raft stores the timestamp in nanoseconds and ensures it is incremented by at least one nanosecond per block.

    As a result, the timestamp is too large to be held as a number in JavaScript.
    You may need to modify your code to take account of this.
    For example, see the [quorum.js source code](https://github.com/ConsenSys/quorum.js/blob/master/lib/index.js#L35).

- The Geth command line option `--existwhensynced` can't be used with Raft consensus.

- The Geth subcommand `geth removedb` can't be used with Raft consensus.
