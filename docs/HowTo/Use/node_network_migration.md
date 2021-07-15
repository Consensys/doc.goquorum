---
description: Migrate node to a new IP network
---

# Migrate node to a new IP network

When changing the network configuration of a node, it's recommended to follow specific steps so the new configuration it's applied and the consensus protocol continues to work as expected.

This documentation applies when using static configuratoin through the `static-nodes.json` file.

!!!important
    Before starting the migration, create a backup of your data directory of all Nodes.

## Prerequisites

- [GoQuorum installed](../GetStarted/Install.md)
- A running [Raft network](../../Tutorials/Create-a-Raft-network.md) or [IBFT network](../../Tutorials/Create-IBFT-Network.md)

## Example setup for steps

*Assume a 3 node network A, B, C, where Node A is the node being migrated.*

!!!tip
    This can apply to any number of migrated Nodes on any network with any number of nodes.

## Raft

### Peers with same networking configuration

This applies when the node has a new networking configuration but the peers keep the same IP/Ports as before.

For example:

- Node A's public IP is changed to another public IP and Node B/C keep the same public IP (same applies for public ports).

- Node A migrates from one private sub-net 10.1.X.X to another subnet 10.2.X.X but is still able to connect to Node B and C using the same IPs as before
    This applies both when Node of B and C are public or are private but continue to be accessible using routing across the sub-nets.

!!!tip
    Before any step, create a backup of your data directory in all Nodes.

#### Steps

1. Stop Node A

1. On node B or C, obtain the Raft ID (_Quorum Raft node ID in the network_) of Node A.

    In the `geth` console, run:

    ```js
    raft.cluster
    ```

    With the result:

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

    Obtain the Raft ID assigned to the Node A (which in the example above is `1`).

1. On node B or C, remove Node A using the obtained Raft ID previously

    In the `geth` console, run:

    ```js
    raft.removePeer(<Raft ID>)
    ```

    This will remove the Node A from the network

1. Update networking configuration in the `static-nodes.json` used by Node A.
    Even that this file isn't read when using `--raftjoinexisting <raftId>`, the file should be updated to keep it in sync with the current cluster configuration.

1. Follow the steps on [`Adding GoQuorum nodes`](./add_node_examples.md#raft) to add back the peer with the new network configuration to the Raft network

1. The nodes should be able to connect with their peers and the `raft.cluster` [command](../../Reference/API-Methods.md#raft_cluster) should show the updated information and IP/Port configuration.

### Peers need a new networking configuration

In this scenario, the Node won't be able to communicate after the migration with the peers using the same IP/Port as before and requires updating the IP/Ports of the peers on the Node side.

For example:

- Node A/B/C were in the same private sub-net and Node A is migrating to another sub-net or to the internet. NAT is used to transte IP from public to private sub-net and viceversa, requiring the Nodes to use their peer's public IPs.
    This will require updating configuration of Node A to use the public IP of Node B and C.
    Same applies for the configuration of Node B and C.

#### Steps

1. Stop all nodes.

1. Clean the cached Raft data

    In the data folder of each node, run:

    ```js
    rm quorum-raft-state raft-*
    ```

    This will force Raft to refresh the cluster state based on the latest information in the `static-nodes.json` without losing any of the blockchain history/data.

1. Migrate Node A's data to the new location

1. Update networking configuration in the `static-nodes.json` of all Nodes with the right accessible IP and Ports for each Node.

1. Start all nodes again. The nodes should be able to connect with their peers
     and the `raft.cluster` command should show the updated information and IP/Port configuration.
    In the `geth` console, run:

    ```js
    raft.cluster
    ```

    It will return the Raft cluster with the updated IP and Ports for each Node.

## IBFT

For all scenarios, it's a matter of updating the right information in the `static-nodes.json` of the migrated Node.

### Steps

1. Stop the Node A.

1. Update networking configuration in the `static-nodes.json` of all Nodes with the right accessible IP and Ports for each node.

1. Start Node A. The nodes should be able to connect with the peers.

    In the `geth` console, run:

    ```js
    admin.peers
    ```

    It will return the current connections between the Node A and Node B/C.
