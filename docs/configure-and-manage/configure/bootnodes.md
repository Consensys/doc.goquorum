---
title: Bootnodes
description: how to configure bootnodes
sidebar_position: 4
---

# Configure bootnodes

You can use bootnodes in GoQuorum to initially discover peers. Bootnodes are regular nodes used to discover other nodes.

!!! tip Bootnodes and [static nodes](static-nodes.md) are parallel methods for finding peers. Depending on your use case, you can use only bootnodes, only static nodes, or both.

    To find peers, configure one or more bootnodes as described on this page.
    To configure a specific set of peer connections, use [static nodes](static-nodes.md).

## Development and testing networks

In private GoQuorum networks for development or testing purposes, specify at least one bootnode.

In production networks, [configure two or more nodes as bootnodes](#production-networks).

### Specifying a bootnode

To start a node, specify a bootnode [enode URL](https://eth.wiki/en/fundamentals/enode-url-format) for P2P discovery, using the [`--bootnodes`](https://geth.ethereum.org/docs/interface/command-line-options) option.

!!! example

    ```bash
    geth --datadir nodeDataPath --bootnodes enode://c35c3ec90a8a51fd5703594c6303382f3ae6b2ecb99bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f@127.0.0.1:30303
    ```

The default host and port advertised to other peers for P2P discovery is `127.0.0.1:30303`. To specify a different host or port, use the [`--discovery.dns`](https://geth.ethereum.org/docs/interface/command-line-options) and [`--port`](https://geth.ethereum.org/docs/interface/command-line-options) options.

## Production networks

A GoQuorum network must have at least one operating bootnode. To allow for continuity in the event of failure, configure two or more bootnodes.

We recommend putting bootnodes on the network itself and not behind a [load balancer](high-availability.md) because the [enode URL](https://eth.wiki/en/fundamentals/enode-url-format) relates to the node public key, IP address, and discovery ports. Any changes to a bootnode enode prevents other nodes from being able to establish a connection with the bootnode.

To ensure that a bootnode enode does not change when recovering from a complete bootnode failure:

1. Create the node key pair (the private and public key) before starting the bootnode.
1. When creating bootnodes in the cloud (for example, AWS or Azure), attempt to assign a static private IP address to them, and record this IP address.

We recommend that you store the bootnode configuration under source control.

### Specifying multiple bootnodes

To allow for continuity in the event of failure, specify all bootnodes in a comma-separated list using the [`--bootnodes`](https://geth.ethereum.org/docs/interface/command-line-options) option for each node, including the bootnodes.

!!! example

    If your network has two bootnodes, pass the following parameter to all nodes, including the bootnodes.

    ```bash
    --bootnodes=enode://<publicKeyBootnode1>@<ipBootnode1>:30303,<publicKeyBootnode2>@<ipBootnode2>:30303
    ```

!!! tip

    Having each bootnode include the other bootnodes increases the speed of discovery.
    Nodes ignore their own enode in the bootnodes list so you can use the same bootnode list for all bootnodes.

### Adding and removing bootnodes

Adding new bootnodes is a similar process to creating bootnodes. After creating the bootnodes and adding them to the network, update the `--bootnodes` command line option for each node to include the new bootnodes.

When adding bootnodes, you don't need to restart running nodes. By updating the `--bootnodes` option, the next time you restart the nodes, the nodes connect to the new bootnodes.

To remove bootnodes, remove them from the `--bootnodes` option for each node.
