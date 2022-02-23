---
description: Creating a network using Raft consensus
---

# Create a private network using the Raft consensus protocol

A private network provides a configurable network for testing. This private network uses the
[Raft consensus protocol](../../configure-and-manage/configure/consensus-protocols/raft.md).

!!!important
    The steps in this tutorial create an isolated, but not protected or secure, Ethereum private
    network. We recommend running the private network behind a properly configured firewall.

## Prerequisites


* [Node.js version 15 or later](https://nodejs.org/en/download/).
* [GoQuorum](../../deploy/install/binaries.md#release-binaries). Ensure that `PATH` contains `geth`
  and `bootnode`.

!!! tip
    GoQuorum is a fork of [geth](https://geth.ethereum.org/). GoQuorum uses the `geth` command to start
    GoQuorum nodes.

## Steps

Listed on the right-hand side of the page are the steps to create a private network using Raft
with two nodes.

### 1. Create directories

Create directories for your private network and two nodes:

```text

Create directories for your private network and 5 nodes.

```bash
Raft-Network/
├── Node-0
│   └── data
│        └── keystore
├── Node-1
│   └── data
         └── keystore

```

### 2. Run the [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool)

This can be done either interactively or by cli args. Below we will use cli args to create the genesis file and node keys

```bash
npx quorum-genesis-tool --consensus raft --chainID 1337 --blockperiod 5 --requestTimeout 10 --epochLength 30000 --difficulty 1 --gasLimit '0xFFFFFF' --coinbase '0x0000000000000000000000000000000000000000' --validators 2 --members 0 --bootnodes 0 --outputPath 'artifacts'
```

Node keys for two nodes, along with `static-nodes.json`, `permissioned-nodes.json`, `disallowed-nodes.json` and the `genesis.json` files are generated.

!!! example "output"

    ```bash
    Need to install the following packages:
    quorum-genesis-tool
    Ok to proceed? (y) y
    Creating bootnodes...
    Creating members...
    Creating validators...
    Artifacts in folder: artifacts/2022-02-23-12-34-35
    ```

The following is the folder structure of the artifacts generated:

```bash
Raft-Network
├── artifacts
    └──2022-02-23-12-34-35
        ├── goQuorum
        │         ├── disallowed-nodes.json
        │         ├── genesis.json
        │         ├── permissioned-nodes.json
        │         └── static-nodes.json
        ├── README.md
        ├── userData.json
        ├── validator0
        │         ├── accountAddress
        │         ├── accountKeystore
        │         ├── accountPassword
        │         ├── accountPrivateKey
        │         ├── address
        │         ├── nodekey
        │         └── nodekey.pub
        ├── validator1
        │         ├── accountAddress
                  ├── accountKeystore
                  ├── accountPassword
                  ├── accountPrivateKey
                  ├── address
                  ├── nodekey
                  └── nodekey.pub

Move all the keys into the `artifacts` folder directly, for ease of use in the next steps

```bash
cd Raft-Network
mv artifacts/2022-02-23-12-34-35/* artifacts
```

### 3. Update IP and port numbers

Change directory into the `goQuorum` folder of the artifacts

```bash
cd artifacts/goQuorum
```

Update the IP and port numbers for all initial validator nodes in `static-nodes.json` and `permissioned-nodes.json` (if applicable)

!!! example static-nodes.json

    ```json
    [
      "enode://1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147@127.0.0.1:30300?discport=0&raftport=50000",
      "enode://0e6f7fff39188535b6084fa57fe0277d022a4beb988924bbb58087a43dd24f5feb78ca9d1cd880e26dd5162b8d331eeffee777386a4ab181528b3817fa39652c@127.0.0.1:30301?discport=0&raftport=53001"
    ]
    ```

### 4. Copy the static nodes file and node keys to each node

Copy the `static-nodes.json`, `genesis.json` and `permissioned-nodes.json` (if applicable) to the data directory for each node:

```bash
cp static-nodes.json genesis.json ./../Node-0/data/
cp static-nodes.json genesis.json ./../Node-1/data/
```

Change directory to each of the validator folders and copy the `nodekey` files and `address` for each node to the data directory for each node:

```bash
cp nodekey* address ../../Node-0/data
cp nodekey* address ../../Node-1/data
```

Copy the individual account keys to the keystore folder for each node:
```bash
cp account* ../../Node-0/data/keystore
cp account* ../../Node-1/data/keystore
```

### 5. Initialize node 1

In the `Node-1` directory, initialize node 1.

```bash
geth --datadir data init data/genesis.json
```

### 6. Start node 0

In the `Node-0` directory, start the first node:

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full --nousb \
    --raft --raftport 50000 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22000 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32000 --ws.origins "*" \
    --http.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --ws.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --unlock ${ADDRESS} --allow-insecure-unlock --password /data/keystore/accountPassword \
     --port 30300
```

The `PRIVATE_CONFIG` environment variable starts GoQuorum without privacy enabled.


### 7. Start node 1

In a new terminal for node-1 in the node-1 directory, start the remaining node using the same command except
specifying different ports for DevP2P and RPC.

!!! important

    The DevP2P port numbers must match the port numbers in [`static-nodes.json`](#4-update-ip-and-port-numbers).

=== "Node 1"

    ```bash
    export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
    export PRIVATE_CONFIG=ignore
    geth --datadir data \
        --networkid 1337 --nodiscover --verbosity 5 \
        --syncmode full --nousb \
        --raft --raftport 50000 --emitcheckpoints \
        --http --http.addr 127.0.0.1 --http.port 22001 --http.corsdomain "*" --http.vhosts "*" \
        --ws --ws.addr 127.0.0.1 --ws.port 32001 --ws.origins "*" \
        --http.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
        --ws.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
        --unlock ${ADDRESS} --allow-insecure-unlock --password /data/keystore/accountPassword \
        --port 30300
    ```


#####################################################3


### 7. Attach to node 1

In another terminal in the `Node-1` directory, attach to your node.

```bash
geth attach data/geth.ipc
```

Use the Raft `cluster` command to view the cluster details.

=== "Command"

    ```js
    raft.cluster
    ```

=== "Result"

    ```js
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

    ```json
    [
      "enode://<Node1-EnodeID>@127.0.0.1:21000?discport=0&raftport=50000",
      "enode://<Node2-EnodeID>@127.0.0.1:21001?discport=0&raftport=50001"
    ]
    ```

=== "Example"

    ```json
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

    ```js
    raft.addPeer('enode://<Node2-EnodeID>@127.0.0.1:21001?discport=0&raftport=50001')
    ```

=== "Example"

    ```js
    raft.addPeer('enode://104e72fd6f1a747c0b61c225a80d76ea66283b9eb04049286b525161913e343f8f6954fe41c3a3047d1115f52f01fe1c82561861f6554ffac189925097ea3dee@127.0.0.1:21001?discport=0&raftport=50001')
    ```

=== "Result of Raft ID"

    ```js
    2
    ```

!!! important
    The Raft ID is returned by `addPeer` must be specified when starting node 2.

Use the Raft `cluster` command to confirm cluster now has two nodes.

=== "Command"

    ```js
    raft.cluster
    ```

=== "Result"

    ```js
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
PRIVATE_CONFIG=ignore geth  --datadir data --nodiscover --verbosity 5 --networkid 31337 --raft --raftjoinexisting 2 --raftport 50001 --http --http.addr 127.0.0.1 --http.port 22001 --http.api admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft --emitcheckpoints --port 21001
```

Node 2 connects to node 1.

!!! important
    For a Raft network to work, 51% of the peers must be up and running.
    We recommend having an odd number of at least 3 peers in a network.
