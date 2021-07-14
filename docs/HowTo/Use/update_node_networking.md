---
description: Updating networking configuration of an existing Node
---

# Updating networking configuration of a Node

When changing the network configuration of a node, we need to follow specific steps so the new configuration it's applied and the consensus protocol continues to work as expected.

## Prerequisites

- [GoQuorum installed](../GetStarted/Install.md)
- [Tessera](https://docs.tessera.consensys.net)
- [A running network](../../Tutorials/Create-IBFT-Network.md)

## Peers with same networking configuration

This applies when the node has a new networking configuration but the peers keep the same IP/Ports as before.

For example:
* A node changes public IP/Ports and peers keep the same public IP/Ports.
* A node moves to another private network but access peers using the same IP/Ports as before.
* Node and peers are in the same private network and routing is still possible with the new networking configuration.

### Raft

1. Shutdown Node that will be moved to a new IP network, which we name *Node X* for simplification.

1. On an *existing* running node, obtain the Raft ID of *Node X*

    In the `geth` console, run:

    ```js
    raft.cluster
    ```

    Obtain the Raft ID assigned to the *Node X*

1. On an *existing* running node, remove the Node X using the obtained Raft ID previously

    In the `geth` console, run:

    ```js
    raft.removePeer(<Raft ID>)
    ```

    The result is:

    ```js
    null
    ```

    This will remove the peer from the network

1. Update networking configuration in the `static-nodes.json` used by *Node X*.

1. Follow the steps on [`Adding GoQuorum nodes`](./add_node_examples.md#raft) to add back the peer with the new network configuration to the Raft network

## Peers need a new networking configuration

On this scenario, the Node won't be able to communicate with the peers using the same IP/Port as before and requires updating the IP/Ports of the peers on the Node side.

For example:
* A node moves to a different private network and the peers are behing NAT so the node needs to use now their public IP/Ports instead of the private ones.

### Raft

1. Shutdown all nodes

1. Clean the cached Raft data

    In the data folder of each node, run:

    ```js
    rm quorum-raft-state raft-*
    ```

1. Mode the Node's data to the new location.

1. Update networking configuration in the `static-nodes.json` of all Nodes with the right accessible IP and Ports for each peer.

1. Start the network again