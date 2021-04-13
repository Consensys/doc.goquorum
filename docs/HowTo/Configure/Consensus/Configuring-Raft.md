---
description: Configuring Raft consensus
---

# Configuring Raft consensus

To enable Raft consensus, specify the [`--raft`](../../../Reference/CLI-Syntax.md#raft) command line option when starting GoQuorum.

Raft requires that all initial nodes in the cluster are configured as [static peers](https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network#static-nodes).
The order of the enode IDs in the `static-nodes.json` file must be the same across all peers.

The enode IDs must include a `raftport` querystring parameter specifying the Raft port for each peer.

!!! example
    ```bash
    `enode://abcd@127.0.0.1:30400?raftport=50400`
    ```

## Adding Raft members

To add a verifier node to the cluster, attach to a JS console and issue `raft.addPeer(enodeId)`.

To add a learner node to the cluster, attach to a JS console and issue `raft.addLearner(enodeId)`.

To promote a learner to a verifier in the cluster, attach to a JS console of a leader or verifier node
and issue `raft.promoteToPeer(raftId)`.

The enode ID must include a `raftport` querystring parameter like the [enode IDs in the `static-nodes.json`
file](#configuring-raft-consensus).

The `addPeer` and `addLearner` calls allocate and return a Raft ID not already in use.
After `addPeer` or `addLearner`, start the new GoQuorum node with the
[`--raftjoinexisting`](../../../Reference/CLI-Syntax.md#raftjoinexisting) and
[`--raft`](../../../Reference/CLI-Syntax.md#raft) command line options.
Use the Raft ID returned by `addPeer` or `addLearner` as the argument for `--raftjoinexisting`.

## Removing Raft members

To remove a node from the cluster, attach to a JS console and issue `raft.removePeer(raftId)`. `raftId`
is the number of the node to be removed. For initial nodes in the cluster, `raftId` number
is the 1-indexed position of the enode ID for the node in the static peers list. Once a node is removed
from the cluster, it is permanent. The Raft ID cannot reconnect to the cluster in the future. If rejoining,
the node must specify a new Raft ID returned by `addPeer` or `addLearner`.

## Minting frequency

By default, blocks are minted no more frequently than every 50ms. When transactions arrive:

* If it has been at least 50ms since the last block, a new block is minted immediately.
* If it has been less that 50ms, a new block is minted 50ms after the previous block was minted. Waiting
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
