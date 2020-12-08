---
description: Creating a network using IBFT consensus
---

# Create a private network using the IBFT consensus protocol

A private network provides a configurable network for testing. This private network uses the
[IBFT consensus protocol](../Concepts/Consensus/IBFT.md).

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

Listed on the right-hand side of the page are the steps to create a private network using IBFT
with 5 nodes.

### 1. Install Istanbul tools

The [`istanbul-tools`](https://github.com/ConsenSys/istanbul-tools) repository contains tools for
configuring IBFT networks.

```bash
git clone https://github.com/ConsenSys/istanbul-tools.git
cd istanbul-tools
make
```

### 2. Create directories

Create directories for your private network and 5 nodes.

```bash
IBFT-Network/
├── Node-0
│   ├── data
├── Node-1
│   ├── data
├── Node-2
│   ├── data
├── Node-3
│   ├── data
├── Node-4
│   ├── data
```

### 3. Generate keys and configuration

In the `IBFT-Network` directory, generate keys and configuration for 5 nodes.  

```bash
<path to istanbul-tools>/istanbul-tools/build/bin/istanbul setup --num 5 --nodes --quorum --save --verbose
```

Node keys for 5 nodes, a `static-nodes.json` files, and a `genesis.json` files are generated.

!!! example "Result"

    ```bash
    validators
    {
     "Address": "0x66f976d16c906b1b7e0e110d6950b109f146120f",
     "Nodekey": "25c125f25955a6e026fb9fa97dddebcb6aa180edf440a16df282e50f3ee18168",
     "NodeInfo": "enode://1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147@0.0.0.0:30303?discport=0"
    }
    {
     "Address": "0xc20f68dfb6b3707ec2ee5b4c1f5ca9e10e560d7b",
     "Nodekey": "8cb0683ecdd533ba51e7802271652c73a37ac3daeb58db6f991d1dd77ae58d9d",
     "NodeInfo": "enode://0e6f7fff39188535b6084fa57fe0277d022a4beb988924bbb58087a43dd24f5feb78ca9d1cd880e26dd5162b8d331eeffee777386a4ab181528b3817fa39652c@0.0.0.0:30303?discport=0"
    }
    {
     "Address": "0x85ceceb205c67da0029d6852f0fc486b4324b5dc",
     "Nodekey": "6dc8c9e6163a55bbf512f690f0fc375e4bde313c3d9dbf5307033dfb50789920",
     "NodeInfo": "enode://d40a766cb6fe75f052fe21f61bc84ca3851abb6f999d73f97dd76e14fc2dea175d4cf554ccbcc2c7c639a0901932775b523554cb73facdfab08def975208f8e6@0.0.0.0:30303?discport=0"
    }
    {
     "Address": "0x608e7dfbbb6ebcc24fabeb67b3597b166b114142",
     "Nodekey": "78cb7974f759cd790d14923adc8614fdac204a31627dcb8b9337b1317b47ce7e",
     "NodeInfo": "enode://80a98f66d243c6604cda0e1c722eed3d9e080591c81710eec70794e0909e58661f4863e29a7a63bf7fb9387afc8609df37bacbf3d5c523d97bf598c3470840f5@0.0.0.0:30303?discport=0"
    }
    {
     "Address": "0xc5db99d2cd30fd3ab58fe2738a3513c6ccdb0d2b",
     "Nodekey": "dfdda5e2c8cedaa4468baaa46b619f5e227a7f07c4b6163edaf197991461490d",
     "NodeInfo": "enode://7fa183662285993efaf7a59e303ec5543bbcd09cb2883e7611d9576ed90f3bcf0400b70af11c5266e5110eebe8afd4e817437bde574d686f440df1ec85822add@0.0.0.0:30303?discport=0"
    }

    static-nodes.json
    [
     "enode://1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147@0.0.0.0:30303?discport=0",
     "enode://0e6f7fff39188535b6084fa57fe0277d022a4beb988924bbb58087a43dd24f5feb78ca9d1cd880e26dd5162b8d331eeffee777386a4ab181528b3817fa39652c@0.0.0.0:30303?discport=0",
     "enode://d40a766cb6fe75f052fe21f61bc84ca3851abb6f999d73f97dd76e14fc2dea175d4cf554ccbcc2c7c639a0901932775b523554cb73facdfab08def975208f8e6@0.0.0.0:30303?discport=0",
     "enode://80a98f66d243c6604cda0e1c722eed3d9e080591c81710eec70794e0909e58661f4863e29a7a63bf7fb9387afc8609df37bacbf3d5c523d97bf598c3470840f5@0.0.0.0:30303?discport=0",
     "enode://7fa183662285993efaf7a59e303ec5543bbcd09cb2883e7611d9576ed90f3bcf0400b70af11c5266e5110eebe8afd4e817437bde574d686f440df1ec85822add@0.0.0.0:30303?discport=0"
    ]

    genesis.json
    {
        "config": {
            "chainId": 10,
            "homesteadBlock": 0,
            "eip150Block": 0,
            "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eip155Block": 0,
            "eip158Block": 0,
            "byzantiumBlock": 0,
            "constantinopleBlock": 0,
            "istanbul": {
                "epoch": 30000,
                "policy": 0,
                "ceil2Nby3Block": 0
            },
            "txnSizeLimit": 64,
            "maxCodeSize": 0,
            "isQuorum": true
        },
        "nonce": "0x0",
        "timestamp": "0x5fc06d3d",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000f8aff8699466f976d16c906b1b7e0e110d6950b109f146120f94c20f68dfb6b3707ec2ee5b4c1f5ca9e10e560d7b9485ceceb205c67da0029d6852f0fc486b4324b5dc94608e7dfbbb6ebcc24fabeb67b3597b166b11414294c5db99d2cd30fd3ab58fe2738a3513c6ccdb0d2bb8410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0",
        "gasLimit": "0xe0000000",
        "difficulty": "0x1",
        "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": {
            "608e7dfbbb6ebcc24fabeb67b3597b166b114142": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "66f976d16c906b1b7e0e110d6950b109f146120f": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "85ceceb205c67da0029d6852f0fc486b4324b5dc": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "c20f68dfb6b3707ec2ee5b4c1f5ca9e10e560d7b": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "c5db99d2cd30fd3ab58fe2738a3513c6ccdb0d2b": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            }
        },
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
    ```

Directory structure after generating keys and configuration files.

```bash
IBFT-Network/
├── 0
│   ├── nodekey
├── 1
│   ├── nodekey
├── 2
│   ├── nodekey
├── 3
│   ├── nodekey
├── 4
│   ├── nodekey
├── genesis.json
├── Node-0
│   ├── data
├── Node-1
│   ├── data
├── Node-2
│   ├── data
├── Node-3
│   ├── data
├── Node-4
│   ├── data
├── static-nodes.json
```

### 4. Update IP and port numbers

Update the IP and port numbers for all initial validator nodes in `static-nodes.json`.

!!! example

    ```json
    [
      "enode://1647ade9de728630faff2a69d81b2071eac873d776bfdf012b1b9e7e9ae1ea56328e79e34b24b496722412f4348b9aecaf2fd203fa56772a1a5dcdaa4a550147@127.0.0.1:30300?discport=0",
      "enode://0e6f7fff39188535b6084fa57fe0277d022a4beb988924bbb58087a43dd24f5feb78ca9d1cd880e26dd5162b8d331eeffee777386a4ab181528b3817fa39652c@127.0.0.1:30301?discport=0",
      "enode://d40a766cb6fe75f052fe21f61bc84ca3851abb6f999d73f97dd76e14fc2dea175d4cf554ccbcc2c7c639a0901932775b523554cb73facdfab08def975208f8e6@127.0.0.1:30302?discport=0",
      "enode://80a98f66d243c6604cda0e1c722eed3d9e080591c81710eec70794e0909e58661f4863e29a7a63bf7fb9387afc8609df37bacbf3d5c523d97bf598c3470840f5@127.0.0.1:30303?discport=0",
      "enode://7fa183662285993efaf7a59e303ec5543bbcd09cb2883e7611d9576ed90f3bcf0400b70af11c5266e5110eebe8afd4e817437bde574d686f440df1ec85822add@127.0.0.1:30304?discport=0"
    ]
    ```

### 5. Copy static nodes file and node keys to each node

Copy the `static-nodes.json` to the data directory for each node.

```bash
cp static-nodes.json Node-0/data/
cp static-nodes.json Node-1/data/
cp static-nodes.json Node-2/data/
cp static-nodes.json Node-3/data/
cp static-nodes.json Node-4/data/
```

Copy the `nodekey` file for each node to the data directory for each node.

```bash
cp 0/nodekey Node-0/data
cp 1/nodekey Node-1/data
cp 2/nodekey Node-2/data
cp 3/nodekey Node-3/data
cp 4/nodekey Node-4/data
```

### 6. Initialize nodes

In each node directory (that is, `Node-0`, `Node-1`, `Node-2`, `Node-3`, and `Node-4`), initalize each node.

```bash
geth --datadir data init ../genesis.json
```

### 7. Start node 0

In the `Node-0` directory, start the first node.  

```bash
PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 127.0.0.1 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30300
```

The `PRIVATE_CONFIG` environment variable starts GoQuorum without privacy enabled.

### 8. Start nodes 1, 2, 3, and 4

In new terminal for each node in each node directory, start the remaining nodes using the same command
except specifying different ports for DevP2P and RPC.  

!!!important
    The DevP2P port numbers must match the port numbers in [`static-nodes.json`](#4-update-ip-and-port-numbers).

=== "Node 1"
    ```bash
    PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 127.0.0.1 --rpcport 22001 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30301
    ```

=== "Node 2"
    ```bash
    PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 127.0.0.1 --rpcport 22002 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30302
    ```

=== "Node 3"
    ```bash
    PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 127.0.0.1 --rpcport 22003 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30303
    ```

=== "Node 4"
    ```bash
    PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 127.0.0.1 --rpcport 22004 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30304
    ```

### 9. Attach to node 0

In another terminal in the `Node-0` directory, attach to node 0.

```bash
geth attach data/geth.ipc
```

### 10. Check peer count

Use the JavaScript console to check the peer count.

=== "Command"
    ```bash
    net.peerCount
    ```

=== "Result"
    ```bash
    4
    ```

!!! tip
    If the peer count is 0, check the [`static-nodes.json` was updated with the correct port numbers](#4-update-ip-and-port-numbers)
    and [copied to the `data` directory for each node](#5-copy-static-nodes-file-and-node-keys-to-each-node).

    The enode ID displayed in the logs on startup must match the enode listed in `static-nodes.json`
    for each node including the port number specified using [`--port` on startup](#8-start-node-1-2-3-and-4).
    The log message is:    
    
    ```
    INFO [12-08|10:44:55.044] Started P2P networking   self="enode://a54bc6e32febe789f9d2da61b370c1cd269ef7a6fdb0ea26b7c3767f56265c4e40e81bfb6e4e1aff56d2a9a8bcae5bfc168f106c2ca81b8eb3dfe09445718629@127.0.0.1:30301?discport=0"
    ```

### 11. List current validators

Use the Istanbul [`getValidators`](../Reference/Consensus/IBFT-RPC-API.md#istanbulgetvalidators) command to
view the validator addresses.

=== "Command"
    ```bash
    istanbul.getValidators("latest")
    ```

=== "Result"
    ```bash
    ["0x608e7dfbbb6ebcc24fabeb67b3597b166b114142", "0x66f976d16c906b1b7e0e110d6950b109f146120f", "0x85ceceb205c67da0029d6852f0fc486b4324b5dc", "0xc20f68dfb6b3707ec2ee5b4c1f5ca9e10e560d7b", "0xc5db99d2cd30fd3ab58fe2738a3513c6ccdb0d2b"]
    ```

### Next

[Add and remove validators](Adding-removing-IBFT-validators.md).
