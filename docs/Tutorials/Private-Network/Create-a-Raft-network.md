---
description: Creating a network using Raft consensus
---

# Create a private network using the Raft consensus protocol

A private network provides a configurable network for testing. This private network uses the
[Raft consensus protocol](../../HowTo/Configure/Consensus-Protocols/Raft.md).

!!!important

    The steps in this tutorial create an isolated, but not protected or secure, Ethereum private
    network. We recommend running the private network behind a properly configured firewall.

## Prerequisites

* [GoQuorum](../../GetStarted/Install.md#as-release-binaries). Ensure that `PATH` contains `geth`
  and `bootnode`.

!!! tip
    GoQuorum is a fork of [geth](https://geth.ethereum.org/). GoQuorum uses the `geth` command to start
    GoQuorum nodes.

## Steps

Listed on the right-hand side of the page are the steps to create a private network using Raft
with two nodes.

### 1. Create directories

Create directories for your private network and two nodes:

```bash
Raft-Network/
├── Node-1
│   ├── data
├── Node-2
│   ├── data
```

### 2. Create genesis file

Copy the following configuration file definition to a file called `raftGenesis.json` and save it
in the `Raft-Network` directory:

``` json
{
  "alloc": {
    "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
      "privateKey": "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
      "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
      "balance": "0xad78ebc5ac6200000"
    },
    "627306090abaB3A6e1400e9345bC60c78a8BEf57": {
      "privateKey": "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
      "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
      "balance": "90000000000000000000000"
    },
    "f17f52151EbEF6C7334FAD080c5704D77216b732": {
      "privateKey": "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
      "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
      "balance": "90000000000000000000000"
    }
  },
  "coinbase": "0x0000000000000000000000000000000000000000",
  "config": {
    "homesteadBlock": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "chainId": 10,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip158Block": 0,
    "maxCodeSizeConfig": [
      {
        "block": 0,
        "size": 35
      }
    ],
    "isQuorum": true
  },
  "difficulty": "0x0",
  "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0xE0000000",
  "mixhash": "0x00000000000000000000000000000000000000647572616c65787365646c6578",
  "nonce": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "0x00"
}
```

### 3. Generate node key

In the `Node-1` directory, generate a node key and copy the key into the data directory.

```bash
bootnode --genkey=nodekey
cp nodekey data/
```

### 4. Add node to static nodes file

In the `Node-1` directory, display the enode ID for node 1.

```bash
bootnode --nodekey=nodekey --writeaddress
```

Copy the following to a file called `static-nodes.json` in the `Node-1/data` directory.

=== "static-nodes.json"
    ```bash
    [
      "enode://<EnodeID>@127.0.0.1:21000?discport=0&raftport=50000"
    ]
    ```

Replace the `<EnodeID>` placeholder with the enode ID returned by the `bootnode` command.

=== "Example"
    ```bash
    [
      "enode://212655378f4f48ec6aa57648f9bd4ab86b596553a0825d68ae34ad55176920b0ae06bf68fd682633b0ef3662cbe68a06166aa3053077b93fd4afa9cf8855ea0b@127.0.0.1:21000?discport=0&raftport=50000"
    ]
    ```

### 5. Initialize node 1

In the `Node-1` directory, initialize node 1.

```bash
geth --datadir data init ../raftGenesis.json
```

### 6. Start node 1

In the `Node-1` directory, start node 1.

```bash
PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50000 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft --emitcheckpoints --port 21000
```

The `PRIVATE_CONFIG` environment variable starts GoQuorum without privacy enabled.

### 7. Attach to node 1

In another terminal in the `Node-1` directory, attach to your node.

```bash
geth attach data/geth.ipc
```

Use the Raft `cluster` command to view the cluster details.

=== "Command"
    ```bash
    raft.cluster
    ```

=== "Result"
    ```bash
    [{
        hostname: "127.0.0.1",
        nodeActive: true,
        nodeId: "212655378f4f48ec6aa57648f9bd4ab86b596553a0825d68ae34ad55176920b0ae06bf68fd682633b0ef3662cbe68a06166aa3053077b93fd4afa9cf8855ea0b",
        p2pPort: 21000,
        raftId: 1,
        raftPort: 50000,
        role: "minter"
    }]
    ```

### 8. Generate node key for node 2

In another terminal in the `Node-2` directory, generate a node key for node 2 and copy the key to the
data directory.

```bash
bootnode --genkey=nodekey
cp nodekey data/
```

### 9. Create and update static nodes file for node 2

Copy the `static-nodes.json` file from the `Node-1` directory to `Node-2`.

```bash
cp ../Node-1/data/static-nodes.json data/
```

In the `Node-2` directory, display the enode ID for node 2.

```bash
bootnode --nodekey=nodekey --writeaddress
```

Add the node 2 enode ID to `static-nodes.json` with a different host port and Raft port.

=== "static-nodes.json"
    ```bash
    [
      "enode://<Node1-EnodeID>@127.0.0.1:21000?discport=0&raftport=50000",
      "enode://<Node2-EnodeID>@127.0.0.1:21001?discport=0&raftport=50001"
    ]
    ```

=== "Example"
    ```bash
    [
      "enode://212655378f4f48ec6aa57648f9bd4ab86b596553a0825d68ae34ad55176920b0ae06bf68fd682633b0ef3662cbe68a06166aa3053077b93fd4afa9cf8855ea0b@127.0.0.1:21000?discport=0&raftport=50000",
      "enode://104e72fd6f1a747c0b61c225a80d76ea66283b9eb04049286b525161913e343f8f6954fe41c3a3047d1115f52f01fe1c82561861f6554ffac189925097ea3dee@127.0.0.1:21001?discport=0&raftport=50001"
    ]
    ```

!!! tip "GoQuorum peers and Raft peers"

    The  `static-nodes.json` file defines the GoQuorum peers only. The node must also be added as a
    member of the Raft cluster using the Raft `addPeer` command.

### 10. Initialize node 2

In the `Node-2` directory, initialize node 2.

```bash
geth --datadir data init ../raftGenesis.json
```

### 11. Add node 2 as a Raft peer to node 1

In the terminal attached to node 1, use the Raft `addPeer` command to add node 2.

=== "Command"
    ```bash
    raft.addPeer('enode://<Node2-EnodeID>@127.0.0.1:21001?discport=0&raftport=50001')
    ```

=== "Example"
    ```bash
    raft.addPeer('enode://104e72fd6f1a747c0b61c225a80d76ea66283b9eb04049286b525161913e343f8f6954fe41c3a3047d1115f52f01fe1c82561861f6554ffac189925097ea3dee@127.0.0.1:21001?discport=0&raftport=50001')
    ```

=== "Result of Raft ID"
    ```bash
    2
    ```

!!! important
    The Raft ID is returned by `addPeer` must be specified when starting node 2.

Use the Raft `cluster` command to confirm cluster now has two nodes.

=== "Command"
    ```bash
    raft.cluster
    ```

=== "Result"
    ```bash
    [{
       ip: "127.0.0.1",
       nodeId: "104e72fd6f1a747c0b61c225a80d76ea66283b9eb04049286b525161913e343f8f6954fe41c3a3047d1115f52f01fe1c82561861f6554ffac189925097ea3dee",
       p2pPort: 21001,
       raftId: 2,
       raftPort: 50001
      }, {
       ip: "127.0.0.1",
       nodeId: "212655378f4f48ec6aa57648f9bd4ab86b596553a0825d68ae34ad55176920b0ae06bf68fd682633b0ef3662cbe68a06166aa3053077b93fd4afa9cf8855ea0b",
       p2pPort: 21000,
       raftId: 1,
       raftPort: 50000
     }]
    ```

### 12. Start node 2

In the `Node-2` directory, start node 2 using the same command as for node 1 except:

* Specify different ports for DevP2P, RPC, and Raft.
* Specify the Raft ID using the `--raftjoinexisting` option.

```bash
PRIVATE_CONFIG=ignore geth  --datadir data --nodiscover --verbosity 5 --networkid 31337 --raft --raftjoinexisting 2 --raftport 50001 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft --emitcheckpoints --port 21001
```

Node 2 connects to node 1.

!!! important

    For a Raft network to work, 51% of the peers must be up and running.
    We recommend having an odd number of at least 3 peers in a network.
