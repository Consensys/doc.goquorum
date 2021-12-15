---
description: Create a permissioned network
---

# Create a permissioned network with basic permissioning

This tutorial shows you how to create a permissioned network with [basic permissioning](../concepts/permissions-overview.md#basic-network-permissioning).

## 1. Initialize chain

The first step is to generate the genesis block.

The `7nodes` directory in the `quorum-examples` repository contains several keys (using an empty password)
that are used in the example genesis file:

```text
key1    vote key 1
key2    vote key 2
key3    vote key 3
key4    block maker 1
key5    block maker 2
```

Example genesis file (copy to `genesis.json`):

``` json
"config": {
    "homesteadBlock": 0,
    "byzantiumBlock": 0,
    "chainId": 10,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip158Block": 0,
    "isQuorum": true
  },
```

Initialize geth:

```bash
geth init genesis.json
```

## 2. Setup bootnode

Optionally you can set up a bootnode that all the other nodes will first connect to in order to find
other peers in the network. You will first need to generate a bootnode key:

1. To generate the key for the first time:

    ```bash
    bootnode -genkey tmp_file.txt  // this will start a bootnode with an enode address and generate a key inside a “tmp_file.txt” file`
    ```

1. To later restart the bootnode using the same key (and hence use the same enode url):

    ```bash
    bootnode -nodekey tmp_file.txt
    ```

    or

    ```bash
    bootnode -nodekeyhex 77bd02ffa26e3fb8f324bda24ae588066f1873d95680104de5bc2db9e7b2e510 // Key from tmp_file.txt
    ```

## 3. Start node

Starting a node is as simple as `geth`. This will start the node without any of the roles and makes the
node a spectator. If you have setup a bootnode then be sure to add the `--bootnodes` param to your startup command:

```bash
geth --bootnodes $BOOTNODE_ENODE
```

## Adding new nodes

Any additions to the `permissioned-nodes.json` file are dynamically picked up by the server when
subsequent incoming/outgoing requests are made. The node does not need to be restarted in order for the changes to take effect.

## Removing existing nodes

Removing existing connected nodes from the `permissioned-nodes.json` file does not immediately drop those
existing connected nodes.

However, if the connection is dropped for any reason, and a subsequent connect
request is made from the dropped node ids, it is rejected as part of that new request.

## Enhanced permissioning

[Enhanced network permissioning](../concepts/permissions-overview.md#enhanced-network-permissioning)
uses a smart contract permissioning model. Enhanced permissioning enables significant flexibility to
manage nodes, accounts, and account-level access controls.
