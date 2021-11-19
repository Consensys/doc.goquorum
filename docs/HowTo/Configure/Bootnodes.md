---
description: how to configure bootnodes
---

# Configure bootnodes

Using bootnodes in GoQuorum is a method for initially discovering peers.
Bootnodes are regular nodes used to discover other nodes.

!!! tip

    Bootnodes and [static nodes](StaticNoddes.md) are parallel methods for finding peers.
    Depending on your use case, you can use only bootnodes, only static nodes, or both.

    To find peers, configure one or more bootnodes as described on this page.
    To configure a specific set of peer connections, use [static nodes](StaticNodes.md).

## Development and testing networks

In private GoQuorum networks for development or testing purposes, specify at least one bootnode.

In production networks, [configure two or more nodes as bootnodes](#production-networks).

### Specifying a bootnode

To start a node, specify a bootnode [enode URL](https://eth.wiki/en/fundamentals/enode-url-format) for P2P discovery,
using the [`--bootnodes`](https://geth.ethereum.org/docs/interface/command-line-options) option.

!!! example

    ```bash
    geth --datadir nodeDataPath --bootnodes enode://c35c3ec90a8a51fd5703594c6303382f3ae6b2ecb99bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f@127.0.0.1:30303
    ```

The default host and port advertised to other peers for P2P discovery is `127.0.0.1:30303`. To
specify a different host or port, use the
[`--discovery.dns`](https://geth.ethereum.org/docs/interface/command-line-options) and
[`--port`](https://geth.ethereum.org/docs/interface/command-line-options) options.

## Production networks

A GoQuorum network must have at least one operating bootnode.
To allow for continuity in the event of failure, configure two or more bootnodes.

We don't recommend putting bootnodes behind a [load balancer](HighAvailability.md) because the
[enode URL](https://eth.wiki/en/fundamentals/enode-url-format) relates to the node public key, IP address, and discovery ports.
Any changes to a bootnode enode prevents other nodes from being able to establish a connection with the bootnode.
This is why we recommend putting more bootnodes on the network itself.

To ensure that a bootnode enode does not change when recovering from a complete bootnode failure:

1. Create the node key pair (the private and public key) before starting the bootnode.
1. When creating bootnodes in the cloud (for example, AWS or Azure), attempt to assign a static private IP address to
   them, and record this IP address.

We recommend that you store the bootnode configuration under source control.

### Specifying bootnodes

To allow for failure, specify all bootnodes in a comma-separated list using
[`--bootnodes`](https://geth.ethereum.org/docs/interface/command-line-options) (even to the bootnodes themselves).

!!! example

    If your network has two bootnodes, pass the following parameter to all nodes, including the bootnodes.

    ```bash
    --bootnodes=enode://<publicKeyBootnode1>@<ipBootnode1>:30303,<publicKeyBootnode2>@<ipBootnode2>:30303
    ```

!!! tip

    Having each bootnode list the other bootnodes increases the speed of discovery.
    Nodes ignore their own enode in the bootnodes list so it isn't required to specify different bootnode lists to the
    bootnodes themselves.

### Adding and removing bootnodes

Adding new bootnodes is a similar process to creating bootnodes.
After creating the bootnodes and adding them to the network,update the [`--bootnodes`](../../Reference/CLI/CLI-Syntax.md#bootnodes)
command line option for each node to include the new bootnodes.

When adding bootnodes, you don't need to restart running nodes.
By updating the [`--bootnodes`](../../Reference/CLI/CLI-Syntax.md#bootnodes) option, the next time you restart the
nodes, the nodes connect to the new bootnodes.
