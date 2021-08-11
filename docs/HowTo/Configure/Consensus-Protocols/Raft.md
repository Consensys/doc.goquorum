---
description: Configuring Raft consensus
---

# Configuring Raft consensus

GoQuorum implements the Raft Proof-of-Authority (PoA) consensus protocol.
To enable Raft consensus, specify the [`--raft`](../../../Reference/CLI-Syntax.md#raft) command line option when starting GoQuorum.
You can [create a private network using Raft](../../../Tutorials/Private-Network/Create-a-Raft-network.md).

Raft requires that all initial nodes in the cluster are configured as
[static peers](https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network#static-nodes).
The order of the enode IDs in the `static-nodes.json` file must be the same across all peers.

The enode IDs must include a `raftport` querystring parameter specifying the Raft port for each peer.

!!! example

    ```bash
    enode://abcd@127.0.0.1:30400?raftport=50400
    ```

For the Raft network to work, 51% of the peers must be up and running.
We recommend having an odd number of at least 3 peers in the network.

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
