---
description: Creating a network using Raft consensus 
---

# Create a private network using the Raft consensus protocol

A private network provides a configurable network for testing. This private network uses the
[Raft consensus protocol](../Concepts/Consensus/Raft.md).

!!!important

    The steps in this tutorial create an isolated, but not protected or secure, Ethereum private
    network. We recommend running the private network behind a properly configured firewall.

## Prerequisites

* [GoQuorum](../HowTo/GetStarted/Install.md#as-release-binaries). Ensure that `PATH` contains `geth`
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
    "0xed9d02e382b34818e88b88a309c7fe71e65f419d": {
      "balance": "1000000000000000000000000000"
    },
    "0xca843569e3427144cead5e4d5999a3d0ccf92b8e": {
      "balance": "1000000000000000000000000000"
    },
    "0x0fbdc686b912d7722dc86510934589e0aaf3b55a": {
      "balance": "1000000000000000000000000000"
    },
    "0x9186eb3d20cbd1f5f992a950d808c4495153abd5": {
      "balance": "1000000000000000000000000000"
    },
    "0x0638e1574728b6d862dd5d3a3e0942c3be47d996": {
      "balance": "1000000000000000000000000000"
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
