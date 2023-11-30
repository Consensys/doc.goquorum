---
title: Use QBFT
description: Creating a network with QBFT consensus
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a private network using the QBFT consensus protocol

A private network provides a configurable network for testing. This tutorial walks you through creating an [QBFT](../../configure-and-manage/configure/consensus-protocols/qbft.md) private network with five nodes.

:::warning

The steps in this tutorial create an isolated, but not protected or secure, Ethereum private network. We recommend running the private network behind a properly configured firewall.

:::

## Prerequisites

- [Node.js version 15 or later](https://nodejs.org/en/download/).
- [GoQuorum](../../deploy/install/binaries.md#release-binaries). Ensure that `PATH` contains `geth` and `bootnode`.

:::tip

GoQuorum is a fork of [geth](https://geth.ethereum.org/). GoQuorum uses the `geth` command to start GoQuorum nodes.

:::

## Steps

### 1. Create directories

Create directories for your private network and five nodes:

```bash
cd QBFT-Network
mkdir -p Node-0/data/keystore Node-1/data/keystore Node-2/data/keystore Node-3/data/keystore Node-4/data/keystore
```

The following is the folder structure of the directories:

```bash
QBFT-Network/
├── Node-0
│    └── data
│        └── keystore
├── Node-1
│    └── data
│        └── keystore
├── Node-2
│    └── data
│        └── keystore
├── Node-3
│    └── data
│        └── keystore
├── Node-4
│    └── data
│        └── keystore
```

### 2. Run the Quorum Genesis Tool

Run the [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool) interactively or by using CLI options. The following example uses CLI options to create the genesis file and node keys:

```bash
npx quorum-genesis-tool --consensus qbft --chainID 1337 --blockperiod 5 --requestTimeout 10 --epochLength 30000 --difficulty 1 --gasLimit '0xFFFFFF' --coinbase '0x0000000000000000000000000000000000000000' --validators 5 --members 0 --bootnodes 0 --outputPath 'artifacts'
```

This command generates node keys for five nodes, `static-nodes.json`, `permissioned-nodes.json`, `disallowed-nodes.json`, and `genesis.json`.

```bash title="Output"
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
QBFT-Network
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
        │         ├── accountKeystore
        │         ├── accountPassword
        │         ├── accountPrivateKey
        │         ├── address
        │         ├── nodekey
        │         └── nodekey.pub
        ├── validator2
        │         ├── accountAddress
        │         ├── accountKeystore
        │         ├── accountPassword
        │         ├── accountPrivateKey
        │         ├── address
        │         ├── nodekey
        │         └── nodekey.pub
        ├── validator3
        │         ├── accountAddress
        │         ├── accountKeystore
        │         ├── accountPassword
        │         ├── accountPrivateKey
        │         ├── address
        │         ├── nodekey
        │         └── nodekey.pub
        └── validator4
            ├── accountAddress
            ├── accountKeystore
            ├── accountPassword
            ├── accountPrivateKey
            ├── address
            ├── nodekey
            └── nodekey.pub
```

Move all the keys into the `artifacts` folder directly, for ease of use in the next steps:

```bash
cd QBFT-Network
mv artifacts/2022-02-23-12-34-35/* artifacts
```

### 3. Update IP and port numbers

Go to the `goQuorum` directory of the artifacts:

```bash
cd artifacts/goQuorum
```

Update the IP and port numbers for all initial validator nodes in `static-nodes.json` and `permissioned-nodes.json` (if applicable).

```json title="static-nodes.json"
[
  "enode://1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147@127.0.0.1:30300?discport=0&raftport=53000",
  "enode://0e6f7fff39188535b6084fa57fe0277d022a4beb988924bbb58087a43dd24f5feb78ca9d1cd880e26dd5162b8d331eeffee777386a4ab181528b3817fa39652c@127.0.0.1:30301?discport=0&raftport=53001",
  "enode://d40a766cb6fe75f052fe21f61bc84ca3851abb6f999d73f97dd76e14fc2dea175d4cf554ccbcc2c7c639a0901932775b523554cb73facdfab08def975208f8e6@127.0.0.1:30302?discport=0&raftport=53002",
  "enode://80a98f66d243c6604cda0e1c722eed3d9e080591c81710eec70794e0909e58661f4863e29a7a63bf7fb9387afc8609df37bacbf3d5c523d97bf598c3470840f5@127.0.0.1:30303?discport=0&raftport=53003",
  "enode://7fa183662285993efaf7a59e303ec5543bbcd09cb2883e7611d9576ed90f3bcf0400b70af11c5266e5110eebe8afd4e817437bde574d686f440df1ec85822add@127.0.0.1:30304?discport=0&raftport=53004"
]
```

:::info

For MacOS users, we recommend using `localhost` instead of `127.0.0.1`.

:::

If you use permissions, replace `permissioned-nodes.json` with a copy of `static-nodes.json`.

```bash
cp static-nodes.json permissioned-nodes.json
```

### 4. Copy the static nodes file and node keys to each node

Copy `static-nodes.json`, `genesis.json`, and `permissioned-nodes.json` (if applicable) to the data directory for each node:

```bash
cp static-nodes.json genesis.json ../../Node-0/data/
cp static-nodes.json genesis.json ../../Node-1/data/
cp static-nodes.json genesis.json ../../Node-2/data/
cp static-nodes.json genesis.json ../../Node-3/data/
cp static-nodes.json genesis.json ../../Node-4/data/
```

In each validator directory, copy the `nodekey` files and `address` to the data directory:

```bash
cd validator0; cp nodekey* address ../../Node-0/data
cd ../validator1; cp nodekey* address ../../Node-1/data
cd ../validator2; cp nodekey* address ../../Node-2/data
cd ../validator3; cp nodekey* address ../../Node-3/data
cd ../validator4; cp nodekey* address ../../Node-4/data
```

Copy the individual account keys to the keystore directory for each node:

```bash
cd ../validator0; cp account* ../../Node-0/data/keystore
cd ../validator1; cp account* ../../Node-1/data/keystore
cd ../validator2; cp account* ../../Node-2/data/keystore
cd ../validator3; cp account* ../../Node-3/data/keystore
cd ../validator4; cp account* ../../Node-4/data/keystore
```

### 5. Initialize nodes

In each node directory (`Node-0`, `Node-1`, `Node-2`, `Node-3`, and `Node-4`), initialize the node:

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
    --syncmode full \
    --istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22000 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32000 --ws.origins "*" \
    --http.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --ws.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30300
```

The `PRIVATE_CONFIG` environment variable starts GoQuorum without privacy enabled.

### 7. Start nodes 1, 2, 3, and 4

In a new terminal for each node in each node directory, start the remaining nodes using the same command except specifying different ports for DevP2P and RPC.

:::caution

The DevP2P port numbers must match the port numbers in [`static-nodes.json`](#4-update-ip-and-port-numbers).

:::

<Tabs>
  <TabItem value="Node 1" label="Node 1" default>

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full \
    --istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22001 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32001 --ws.origins "*" \
    --http.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --ws.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30301
```

  </TabItem>
  <TabItem value="Node 2" label="Node 2" default>

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full \
    --istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22002 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32002 --ws.origins "*" \
    --http.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --ws.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30302
```

  </TabItem>
  <TabItem value="Node 3" label="Node 3" default>

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full \
    --istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22003 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32003 --ws.origins "*" \
    --http.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --ws.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30303
```

  </TabItem>
  <TabItem value="Node 4" label="Node 4" default>

```bash
export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
export PRIVATE_CONFIG=ignore
geth --datadir data \
    --networkid 1337 --nodiscover --verbosity 5 \
    --syncmode full \
    --istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints \
    --http --http.addr 127.0.0.1 --http.port 22004 --http.corsdomain "*" --http.vhosts "*" \
    --ws --ws.addr 127.0.0.1 --ws.port 32004 --ws.origins "*" \
    --http.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --ws.api admin,eth,debug,miner,net,txpool,personal,web3,istanbul \
    --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
    --port 30304
```


  </TabItem>
</Tabs>

### 8. Attach to node 0

In another terminal in the `Node-0` directory, attach to node 0:

```bash
geth attach data/geth.ipc
```

### 9. Check peer count

Use the JavaScript console to check the peer count:

<Tabs>
  <TabItem value="Command" label="Command" default>

```bash
net.peerCount
```

  </TabItem>
  <TabItem value="Result" label="Result" default>

```bash
4
```


  </TabItem>
</Tabs>

:::tip

If the peer count is 0, check the [`static-nodes.json` was updated with the correct port numbers](#4-update-ip-and-port-numbers) and [copied to the `data` directory for each node](#5-copy-static-nodes-file-and-node-keys-to-each-node).

The enode ID displayed in the logs on startup must match the enode listed in `static-nodes.json` for each node including the port number specified using [`--port` on startup](#8-start-node-1-2-3-and-4).

The log message is:

```
INFO [12-08|10:44:55.044] Started P2P networking   self="enode://1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147@127.0.0.1:30301?discport=0"
```

:::

### 10. List current validators

Use [`istanbul.getValidators`](../../reference/api-methods.md#istanbul_getvalidators) to view the validator addresses.

<Tabs>
  <TabItem value="Command" label="Command" default>

```bash
istanbul.getValidators("latest")
```

  </TabItem>
  <TabItem value="Result" label="Result" default>

```bash
["e1a8d6a6866a6c8f25ed853e3f957b0ed06a8f1c", "6028d68da1df3c54d5f0949de6082fb69a7239d1", "c1ed779faf6975399c5bdb90b40e2f324185bad0", "6480d9bf06fc8ba9a0393976386e47a5c4f014de", "da4d64ac5fea8aaf2943680241ce9ca4befed870"]
```

  </TabItem>
</Tabs>

### Next steps

You can [add and remove validators](adding-removing-qbft-validators.md).
