---
description: Creating a network using Raft consensus
---

# Create a private network using the Raft consensus protocol

A private network provides a configurable network for testing. This private network uses the
[Raft consensus protocol](../../configure-and-manage/configure/consensus-protocols/raft.md).

!!! warning

    Raft is not suitable for production environments.
    Use only in development environments.
    You can [migrate a network using Raft to another consensus protocol](../../configure-and-manage/configure/consensus-protocols/raft.md).

!!! important

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
Raft-Network/
├── Node-0
│   └── data
│        └── keystore
├── Node-1
│   └── data
|        └── keystore
```

### 2. Run the Quorum Genesis Tool

Run the [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool) interactively or by using CLI options.
The following example uses CLI options to create the genesis file and node keys:

```bash
npx quorum-genesis-tool --consensus raft --chainID 1337 --blockperiod 5 --requestTimeout 10 --epochLength 30000 --difficulty 1 --gasLimit '0xFFFFFF' --coinbase '0x0000000000000000000000000000000000000000' --validators 2 --members 0 --bootnodes 0 --outputPath 'artifacts'
```

Node keys for two nodes, along with `static-nodes.json`, `permissioned-nodes.json`, `disallowed-nodes.json`, `genesis.json` are generated.

!!! example "Example output"

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
```

Move all the keys into the `artifacts` folder directly, for ease of use in the next steps:

```bash
cd Raft-Network
mv artifacts/2022-02-23-12-34-35/* artifacts
```

### 3. Update IP and port numbers

Go to the `goQuorum` directory of the artifacts:

```bash
cd artifacts/goQuorum
```

Update the IP and port numbers for all initial validator nodes in `static-nodes.json` and `permissioned-nodes.json` (if applicable).

!!! example "`static-nodes.json`"

    ```json
    [
      "enode://1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147@127.0.0.1:30300?discport=0&raftport=50000",
      "enode://0e6f7fff39188535b6084fa57fe0277d022a4beb988924bbb58087a43dd24f5feb78ca9d1cd880e26dd5162b8d331eeffee777386a4ab181528b3817fa39652c@127.0.0.1:30301?discport=0&raftport=53001"
    ]
    ```

### 4. Copy the static nodes file and node keys to each node

Copy `static-nodes.json`, `genesis.json`, and `permissioned-nodes.json` (if applicable) to the data directory for each node:

```bash
cp static-nodes.json genesis.json ./../Node-0/data/
cp static-nodes.json genesis.json ./../Node-1/data/
```

In each validator directory, copy the `nodekey` files and `address` to the data directory:

```bash
cp nodekey* address ../../Node-0/data
cp nodekey* address ../../Node-1/data
```

Copy the individual account keys to the keystore directory for each node:

```bash
cp account* ../../Node-0/data/keystore
cp account* ../../Node-1/data/keystore
```

### 5. Initialize node 1

In the `Node-1` directory, initialize node 1:

```bash
geth --datadir data init data/genesis.json
```

### 6. Start node 0

In the `Node-0` directory, start the first node:

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full --nousb \
    --raft --raftport 53000 --raftblocktime 300 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22000 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32000 --ws.origins "*" \
    --http.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --ws.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30300
```

The `PRIVATE_CONFIG` environment variable starts GoQuorum without privacy enabled.

### 7. Start node 1

In a new terminal in the `Node-1` directory, start the remaining node using the same command except
specifying different ports for DevP2P and RPC:

!!! important

    The DevP2P port numbers must match the port numbers in [`static-nodes.json`](#4-update-ip-and-port-numbers).

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full --nousb \
    --raft --raftport 53001 --raftblocktime 300 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22001 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32001 --ws.origins "*" \
    --http.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --ws.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30301
```

### 8. Attach to node 1

In another terminal in the `Node-1` directory, attach to your node:

```bash
geth attach data/geth.ipc
```

Use the Raft `cluster` command to confirm the cluster now has two nodes:

=== "Command"

    ```js
    raft.cluster
    ```

=== "Result"

    ```js
    [{
        ip: "127.0.0.1",
        nodeId: "1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147",
        p2pPort: 30300,
        raftId: 2,
        raftPort: 53000
      }, {
        ip: "127.0.0.1",
        nodeId: "0e6f7fff39188535b6084fa57fe0277d022a4beb988924bbb58087a43dd24f5feb78ca9d1cd880e26dd5162b8d331eeffee777386a4ab181528b3817fa39652c",
        p2pPort: 30301,
        raftId: 1,
        raftPort: 53001
    }]
    ```

### 9. Add more nodes

The process to add more nodes to a Raft network is exactly the same as the previous steps, except:

* Specify different ports for DevP2P, RPC, and Raft.
* Specify the Raft ID using the `--raftjoinexisting` option.

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full --nousb \
    --raft --raftport 53001 --raftblocktime 300 --raftjoinexisting 2 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22002 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32002 --ws.origins "*" \
    --http.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --ws.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30302
```

!!! important

    For a Raft network to work, 51% of the peers must be up and running.
    We recommend having an odd number of at least 3 peers in a network.
