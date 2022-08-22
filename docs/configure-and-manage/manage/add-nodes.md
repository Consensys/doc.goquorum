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

- [GoQuorum installed](../../deploy/install/binaries.md)
- Tessera
- [A running network](../../tutorials/private-network/create-ibft-network.md)

## Adding GoQuorum nodes

### Raft

Use the following API methods on an existing node to add, remove, and promote nodes in a [Raft](../configure/consensus-protocols/raft.md)
network:

- [raft_addPeer](../../reference/api-methods.md#raft_addpeer) to add a verifier node
- [raft_addLearner](../../reference/api-methods.md#raft_addlearner) to add a learner node
- [raft_promoteToPeer](../../reference/api-methods.md#raft_promotetopeer) to promote a learner to a verifier
- [raft_removePeer](../../reference/api-methods.md#raft_removepeer) to remove a node

If you are using permissioning or peer-to-peer discovery, see the [extra options](#extra-options).

After `addPeer` or `addLearner`:

1. Initialize the new node with the network's genesis configuration:

    ```bash
    geth --datadir <NEW-NODE-DATA-DIRECTORY> init <GENESIS-FILE>
    ```

    !!! note
        Where you get the genesis file is dependent on the network.
        You may get it from an existing peer, a network operator, or somewhere else.

1. Start the new GoQuorum node with the [`--raftjoinexisting`](../../reference/cli-syntax.md#raftjoinexisting) and
   [`--raft`](../../reference/cli-syntax.md#raft) command line options.
   Use the Raft ID returned by `addPeer` or `addLearner` as the argument for `--raftjoinexisting`.

    !!! example

        ```bash
         PRIVATE_CONFIG=ignore geth --datadir qdata/dd7 ... OTHER ARGS ... --raft --raftport 50407 --http.port 22006 --port 21006 --raftjoinexisting 7
        ```

    The new node is now up and running, and will start syncing the blockchain from existing peers. Once this has
    completed, it can send new transactions just as any other peer.

!!! important
    For a Raft network to work, 51% of the peers must be up and running.
    We recommend having an odd number of at least 3 peers in a network.

### IBFT, QBFT, and Clique

Adding a non-validator node to an [IBFT](../configure/consensus-protocols/ibft.md),
[QBFT](../configure/consensus-protocols/qbft.md), or [Clique](../configure/consensus-protocols/clique.md) network is
simpler than adding a node to a Raft network, as it only needs to configure itself rather than be pre-allocated on the
network (permissioning aside).

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
[IBFT tutorial](../../tutorials/private-network/adding-removing-ibft-validators.md) and the
[QBFT tutorial](../../tutorials/private-network/adding-removing-qbft-validators.md).

!!! info

    Validator nodes require the [`--mine`](https://geth.ethereum.org/docs/interface/command-line-options) command line
    option on startup, which enables mining, while non-validator nodes do not.

### Extra options

Some options take effect regardless of the consensus mechanism used.

#### Permissioned nodes

If you have [permissioning configured](../configure/permissioning/basic-permissions.md) using the
`permissioned-nodes.json` file, make sure this file is updated on all nodes before the new node is able to communicate
with existing nodes.

You don't need to restart any nodes for the changes to take effect.

#### Static node connections

If not using peer-to-peer node discovery (for example, you specify `--nodiscover`), then the node only makes connections
to peers defined in the `static-nodes.json` file.

When adding a new node, [configure static peers](../configure/static-nodes.md) in its `static-nodes.json` file.

The more peers defined here, the better the network connectivity and fault tolerance.

!!! note

    * You don't need to update the existing peers' static nodes for the connection to be established, although it is
      good practice to do so.
    * You don't need to specify every peer in your static nodes file if you do not wish to connect to every peer directly.

#### Peer-to-peer discovery

If using discovery, more options in addition to static nodes become available.

- Any nodes connected to your peers, which at the start are your [static peers](#static-node-connections), are
  discoverable by you; you connect to these nodes automatically.

- You may [specify bootnodes](../configure/bootnodes.md) using the `--bootnodes` parameter.
  This takes a comma-separated list of enode URLs, similar to the `static-nodes.json` file.
  These act in the same way as static nodes, letting you connect to them and find out about other peers, who you then
  connect to.

!!! note

    If you have discovery disabled, you won't try to find other nodes to connect to, but others can still find and connect to you.

## Adding Tessera nodes

Add a new [Tessera](https://github.com/ConsenSys/tessera) node by ensuring you have one of the existing nodes listed in
your Tessera peer list.

!!! example "Peer configuration example"

    ```json
    {
      "peers": [
        {
          "url": "http://existingpeer1.com:8080"
        }
      ]
    }
    ```

From there, Tessera connects to that peer and discovers and connects to all the other Tessera nodes in the network.

!!! note

    You may want to include multiple peers in the peer list in case any of them are offline/unreachable.

### IP allowlisting

Tessera IP allowlisting (whitelisting) restricts connections in a way similar to using `permissioned-nodes.json` in GoQuorum.

If [allowlisting is configured]({{ extra.othersites.tessera }}/HowTo/Configure/Peer-discovery/), only IP
addresses/hostnames in your Tessera peer list can connect to you.

To add a new Tessera node with allowlisting enabled:

1. Add the new peer to each of the existing nodes.
   You can run the following command without restarting an already running node:

    ```bash
    java -jar tessera.jar admin -configfile /path/to/existing-node-config.json -addpeer http://newpeer.com:8080
    ```

1. Start the new peer, setting the `peers` configuration to mirror the existing network.

    !!! example "Peers configuration example"

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

    The new node now allows incoming connections from the existing peers, and existing peers allow incoming connections
    from the new peer.

### Discovery

You can [disable Tessera discovery]({{ extra.othersites.tessera }}/HowTo/Configure/Peer-discovery/#disable-peer-discovery)
to have Tessera only allow keys that are owned by a node in its peer list to be available to the users.

This means that if Tessera finds any keys owned by a node not in its peer list, those keys are discarded and
private transactions cannot be sent to that public key.

!!! note "Notes"

    - This does not affect incoming transactions.
      Someone not in your peer list can still send transactions to your node, unless you also enable the IP allowlist option.
    - [IP allowlisting](#ip-allowlisting) blocks communications between nodes, whereas disabling discovery only affects
      which public keys Tessera keeps track of.

To add a new Tessera node with discovery disabled:

1. Add the new peer to each of the existing nodes.
   You can run the following command without restarting an already running node:

    ```bash
    java -jar tessera.jar admin -configfile /path/to/existing-node-config.json -addpeer http://newpeer.com:8080
    ```

1. Start the new peer, setting the `peers` configuration to mirror the existing network.

    !!! example "Peers configuration example"

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

    The new node now records public keys belonging to the existing peers, and existing peers record public keys
    belonging to the new peer.
    This allows private transactions to be sent both directions.
