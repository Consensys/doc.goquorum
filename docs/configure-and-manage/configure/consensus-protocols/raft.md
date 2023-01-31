---
title: Raft
description: Configuring Raft consensus
sidebar_position: 3
---

# Configure Raft consensus

GoQuorum implements the Raft proof of authority [consensus protocol](../../../concepts/consensus-index.md). To enable Raft consensus, specify the [`--raft`](../../../reference/cli-syntax.md#raft) command line option when starting GoQuorum. You can [create a private network using Raft](../../../tutorials/private-network/create-a-raft-network.md).

:::caution

Raft is not suitable for production environments. Use only in development environments. You can [migrate a Raft network to another consensus protocol](#migrate-from-raft-to-another-consensus-protocol).

:::

Raft requires that all initial nodes in the cluster are configured as [static peers](https://github.com/ethereum/go-ethereum/wiki/connecting-to-the-network#static-nodes). The order of the enode IDs in the `static-nodes.json` file must be the same across all peers.

The enode IDs must include a `raftport` querystring parameter specifying the Raft port for each peer.

```bash title="Example"
enode://abcd@127.0.0.1:30400?raftport=50400
```

For the Raft network to work, 51% of the peers must be up and running. We recommend having an odd number of at least 3 peers in the network.

## Minting frequency

By default, blocks are minted no more frequently than every 50ms. When transactions arrive:

- If it has been at least 50ms since the last block, a new block is minted immediately.
- If it has been less that 50ms, a new block is minted 50ms after the previous block was minted. Waiting prevents Raft being flooded with blocks.

The rate limiting achieves a balance between transaction throughput and latency.

Configure the minting frequency using the [`--raftblocktime`](../../../reference/cli-syntax.md#raftblocktime) command line option when starting GoQuorum.

## Raft transport layer

Blocks are communicated over the HTTP transport layer built into [etcd Raft](https://github.com/coreos/etcd).

By default, GoQuorum listens on port 50400 for the Raft transport. Use the [`--raftport`](../../../reference/cli-syntax.md#raftport) command line option to change the port.

By default, the number of peers is 25. Use the `--maxpeers N` command line option to configure the maximum number of peers where N is expected size of the cluster.

## Migrate from Raft to another consensus protocol

To migrate a network using Raft to a consensus protocol suitable for production such as [QBFT](qbft.md), do one of the following:

- Stop the Raft network and start the new network with the state at the time of migration. Historical transactions and state history are lost.

- Replay the historical transactions on the new network. The historical transactions are at different block heights on the new network, but the transactions and state history are the same on the new network as on the Raft network.

If you want enterprise support to migrate a Raft network, contact [support](https://consensys.net/quorum/contact-us/).
