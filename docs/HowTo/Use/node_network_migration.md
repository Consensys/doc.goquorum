---
description: Migrate a node to a new IP network
---

# Migrate nodes to a new IP network

Use the following instructions to update a node's network configuration while ensuring the consensus protocol
continues to work as expected.
These instructions apply when using a static configuration through the `static-nodes.json` file.

The following instructions use a three-node network, A, B, and C, as an example, where Node A is being migrated.
You can apply these instructions to any number of migrated nodes on any network with any number of nodes.

!!! important

    Before migrating a node to a new network, [create a backup of each node's data directory].

## Prerequisites

- [GoQuorum installed](../GetStarted/Install.md)
- A running [Raft network](../../Tutorials/Private-Network/Create-a-Raft-network.md) or [IBFT network](../../Tutorials/Private-Network/Create-IBFT-Network.md)

## Raft

### Peers with same networking configuration

In this scenario, the migrated node has a new network configuration, but its peers keep the same IP addresses and ports.
For example:

- Node A's public IP address and port are changed, and Nodes B and C keep the same public IP addresses and ports.
- Node A migrates from one private sub-network `10.1.X.X` to another sub-network `10.2.X.X`, but can still connect to
      Nodes B and C using the same IP addresses as before, by routing across the sub-networks.

#### Steps

1. Stop Node A.

1. On Node B or C, obtain Node A's Raft ID (GoQuorum Raft node ID in the network):

    === "geth console request"

        ```bash
        raft.cluster
        ```

    === "JSON result"

        ```js
        {
            "jsonrpc": "2.0",
            "id": 10,
            "result": [{
                "raftId": 1,
                "nodeId": "<enodeId>",
                ...
            }, ...]
        }
        ```

    In this example Node A's Raft ID is 1.

1. On Node B or C, remove Node A from the network using its Raft ID:

    ```bash
    raft.removePeer(<RAFT-ID>)
    ```

1. Update the network configuration in Node A's `static-nodes.json` file.

    !!! note

        Even if this file isn't specified with [`--raftjoinexisting`](../../Reference/CLI-Syntax.md#raftjoinexisting),
        it should be updated to keep in sync with the current cluster configuration.

1. [Add Node A back to the Raft network](add_node_examples.md#raft) with its new network configuration.

1. The nodes can now connect with their peers, and [`raft.cluster`](../../Reference/API-Methods.md#raft_cluster)
   shows the updated information and network configuration.

### Peers need a new networking configuration

In this scenario, the migrated node must update the IP addresses and ports of its peers.

For example, Nodes A, B, and C are in the same private sub-network, and Node A migrates to another sub-network, or
to the internet. NAT is used to translate the IP addresses from the public to private sub-network and vice versa,
requiring the nodes to use their peers' public IPs.

This requires updating the configuration of Node A to use the public IP addresses of Nodes B and C, and updating the
configurations of Nodes B and C to use the public IP address of Node A.

#### Steps

1. Stop all nodes.

1. Clean the cached Raft data.

    In the data folder of each node, run:

    ```bash
    rm quorum-raft-state raft-*
    ```

    This forces Raft to refresh the cluster state based on the latest information in the `static-nodes.json` without
    losing any of the blockchain data.

1. Migrate Node A's data to the new location.

1. Update the network configuration in the `static-nodes.json` file of each node with its peers' accessible IP addresses and ports.

1. Start all nodes.
   The nodes can now connect with their peers, and [`raft.cluster`](../../Reference/API-Methods.md#raft_cluster) shows
   the updated information and network configuration.

## IBFT

1. Stop Node A.

1. Update the network configuration in Node A's `static-nodes.json` file with its peers' accessible IP addresses and ports.

1. Start Node A.
   The nodes can now connect with their peers, and [`admin.peers`](https://geth.ethereum.org/docs/rpc/ns-admin#admin_peers)
   returns the current connections between the nodes.

[create a backup of each node's data directory]: https://geth.ethereum.org/docs/install-and-build/backup-restore#data-directory
