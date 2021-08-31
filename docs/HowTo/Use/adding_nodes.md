---
description: Adding new nodes to an existing network
---

# Adding nodes to the network

Adding new nodes to an existing network can range from a common occurrence to never happening.
In public blockchains such as Ethereum Mainnet, new nodes continuously join and talk to the existing network.
In permissioned blockchains, this may not happen as often, but it's still an important task to achieve as your network evolves.

When adding new nodes to the network, it's important to understand that the GoQuorum network and Tessera network are
distinct and do not overlap in any way.
Therefore, options applicable to one are not applicable to the other.
In some cases, they may have their own options to achieve similar tasks, but must be specified separately.

## Prerequisites

- [GoQuorum installed](../../GetStarted/Install.md)
- [Tessera](https://docs.tessera.consensys.net)
- [A running network](../../Tutorials/Private-Network/Create-IBFT-Network.md)

## Adding GoQuorum nodes

### Raft

Use the following Raft API methods on an existing node to add, remove, and promote Raft members:

- [raft_addPeer](../../Reference/API-Methods.md#raft_addpeer) to add a verifier node
- [raft_addLearner](../../Reference/API-Methods.md#raft_addlearner) to add a learner node
- [raft_promoteToPeer](../../Reference/API-Methods.md#raft_promotetopeer) to promote a learner to a verifier
- [raft_removePeer](../../Reference/API-Methods.md#raft_removepeer) to remove a node

If you are using permissioning or peer-to-peer discovery, see the [extra options](#extra-options).

After `addPeer` or `addLearner`:

1. Initialize the new node with the network's genesis configuration:

    ```bash
    geth --datadir <NEW-NODE-DATA-DIRECTORY> init <GENESIS-FILE>
    ```

    !!! note

        Where you get the genesis file is dependent on the network.
        You may get it from an existing peer, a network operator, or somewhere else.

1. Start the new GoQuorum node with the [`--raftjoinexisting`](../../Reference/CLI-Syntax.md#raftjoinexisting) and
   [`--raft`](../../Reference/CLI-Syntax.md#raft) command line options.
   Use the Raft ID returned by `addPeer` or `addLearner` as the argument for `--raftjoinexisting`.

    !!! example

        ```bash
         PRIVATE_CONFIG=ignore geth --datadir qdata/dd7 ... OTHER ARGS ... --raft --raftport 50407 --rpcport 22006 --port 21006 --raftjoinexisting 7
        ```

    The new node is now up and running, and will start syncing the blockchain from existing peers. Once this has
    completed, it can send new transactions just as any other peer.

!!! important

    For a Raft network to work, 51% of the peers must be up and running.
    We recommend having an odd number of at least 3 peers in a network.

### IBFT, QBFT, and Clique

Adding a non-validator node to an IBFT, QBFT, or Clique network is a bit simpler, as it only needs to configure itself
rather than be pre-allocated on the network (permissioning aside).

1. Initialize the new node with the network's genesis configuration:

    ```bash
    geth --datadir <NEW-NODE-DATA-DIRECTORY> init <GENESIS-FILE>
    ```

    !!! note

        Where you get the genesis file is dependent on the network.
        You may get it from an existing peer, a network operator, or somewhere else.

1. If you are using permissioning or peer-to-peer discovery, see the [extra options](#extra-options).

1. Start the new node, pointing either to a `bootnode` or listing an existing peer in the `static-nodes.json` file.
    Once a connection is established, the node will start syncing the blockchain, after which transactions can be sent.

Adding a validator to an IBFT or QBFT network requires using the consensus APIs outlined in the
[IBFT tutorial](../../Tutorials/Private-Network/Adding-removing-IBFT-validators.md) and the
[QBFT tutorial](../../Tutorials/Private-Network/Adding-removing-QBFT-validators.md).

### Extra options

Some options take effect regardless of the consensus mechanism used.

#### Permissioned nodes

If using the `permissioned-nodes.json` file for permissioning, then you must make sure this file is updated on all
nodes before the new node is able to communicate with existing nodes.

You do not need to restart any nodes in order for the changes to take effect.

!!! note

    You can use either DNS names or IP addresses to specify nodes in `permissioned-nodes.json`.
    Only bootnodes need to be specified with IP addresses.

#### Static node connections

If not using peer-to-peer node discovery (for example, you specify `--nodiscover`), then the node only makes connections
to peers defined in the `static-nodes.json` file.

When adding a new node, define peers in its `static-nodes.json` file.

The more peers defined here, the better the network connectivity and fault tolerance.

!!! note

    * You can use either DNS names or IP addresses to specify nodes in `static-nodes.json`.
      Only bootnodes need to be specified with IP addresses.
    * You do not need to update the existing peers static nodes for the connection to be established, although it is good practice to do so.
    * You do not need to specify every peer in your static nodes file if you do not wish to connect to every peer directly.

#### Peer-to-peer discovery

If you are using discovery, then more options *in addition* to static nodes become available.

- Any nodes that are connected to your peers, which at the start will be ones defined in the static node list, will
    then be visible by you, allowing you to connect to them; this is done automatically.

- You may specify any number of bootnodes, defined by the `--bootnodes` parameter.
    This takes a commas separated list of enode URIs, similar to the `static-nodes.json` file.
    These act in the same way as static nodes, letting you connect sto them and then find out about other peers,
    whom you then connect to.

!!! note
    If you have discovery disabled, this means you will not try to find other nodes to connect to,
    but others can still find and connect to you.

## Adding private transaction managers

In this tutorial, there will be no focus on the advanced features of adding a new private transaction manager (PTM).
This tutorial uses [Tessera](https://github.com/ConsenSys/tessera) for any examples.

Adding a new node to the PTM is relatively straight forward, but there are a lot of extra options that can be used,
which is what will be explained here.

### Adding a new PTM node

In a basic setting, adding a new PTM node is as simple as making sure you have one of the existing nodes listed in your
peer list.

In Tessera, this would equate to the following in the configuration file:

```json
{
  "peers": [
    {
      "url": "http://existingpeer1.com:8080"
    }
  ]
}
```

From there, Tessera will connect to that peer and discover all the other PTM nodes in the network, connecting to each
of them in turn.

!!! note
    You may want to include multiple peers in the peer list in case any of them are offline/unreachable.

### IP whitelisting

The IP Whitelist that Tessera provides allows you restrict connections much like the `permissioned-nodes.json` file
does for GoQuorum.

Only IP addresses/hostnames listed in your peers list will be allowed to connect to you.

See the [Tessera configuration page](https://docs.tessera.consensys.net) for details on setting it up.

In order to make sure the new node is accepted into the network:

1. You will need to add the new peer to each of the existing nodes before communication is allowed.
    Tessera provides a way to do this without needing to restart an already running node:

    ```bash
    java -jar tessera.jar admin -configfile /path/to/existing-node-config.json -addpeer http://newpeer.com:8080
    ```

1. The new peer can be started, setting the `peers` configuration to mirror the existing network.
    If there are 3 existing nodes in the network, then the new nodes configuration will
    look like the following:

    ```json
    {
      "peers": [
        {
          "url": "http://existingpeer1.com:8080"
        },
        {
          "url": "http://existingpeer2.com:8080"
        },
        {
          "url": "http://existingpeer3.com:8080"
        }
      ]
    }
    ```

    The new node will allow incoming connections from the existing peers, and then existing peers will allow incoming
    connections from the new peer!

### Discovery

Tessera discovery is similar to the IP whitelist. The difference being that the IP whitelist blocks
communications between nodes, whereas disabling discovery only affects which public keys you keep track of.

See the [Tessera configuration page](https://docs.tessera.consensys.net) for details on setting it up.

When discovery is disabled, Tessera will only allow keys that are owned by a node in its peer list to be available to
the users.

This means that if any keys are found that are owned by a node NOT in your peer list, they are discarded and
private transactions cannot be sent to that public key.

!!! note
    This does not affect incoming transactions.

    Someone not in your peer list can still send transactions to your node, unless you also enable the IP Whitelist option.

In order to make sure the new node is accepted into the network:

1. You will need to add the new peer to each of the existing nodes before they will accept public keys that are linked
    to the new peer.
    Tessera provides a way to do this without needing to restart an already running node:

    ```bash
    java -jar tessera.jar admin -configfile /path/to/existing-node-config.json -addpeer http://newpeer.com:8080
    ```

1. The new peer can be started, setting the `peers` configuration to mirror the existing network.
    Foer example, if there are 3 existing nodes in the network, then the new nodes configuration will
    look like the following:

    ```json
    {
      "peers": [
        {
          "url": "http://existingpeer1.com:8080"
        },
        {
          "url": "http://existingpeer2.com:8080"
        },
        {
          "url": "http://existingpeer3.com:8080"
        }
      ]
    }
    ```

    The new node will now record public keys belonging to the existing peers, and then existing peers will record
    public keys belonging to the new peer; this allows private transactions to be sent both directions!

*[PTM]: Private Transaction Manager
