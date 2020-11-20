---
description: Creating a network from scratch tutorial
---

# Creating a network from scratch

This section details easy to follow step by step instructions of how to setup one or more GoQuorum nodes from scratch.

Let's go through step by step instructions to setup a GoQuorum node with Raft consensus.

## GoQuorum with Raft consensus

1. On each machine build GoQuorum as described in the [Installing](../HowTo/GetStarted/Install.md) section. Ensure that PATH contains geth and bootnode

    ```bash
     git clone https://github.com/ConsenSys/quorum.git
     cd quorum
     make all
     export PATH=$(pwd)/build/bin:$PATH
    ```

1. Create a working directory which will be the base for the new node(s) and change into it

    ```bash
     mkdir fromscratch
     cd fromscratch
     mkdir new-node-1
    ```

1. Generate one or more accounts for this node and take down the account address. A funded account may be required depending what you are trying to accomplish

    ```bash
     geth --datadir new-node-1 account new
    ```

    Result:

    ```text
    INFO [06-07|14:52:18.742] Maximum peer count                       ETH=25 LES=0 total=25
    Your new account is locked with a password. Please give a password. Do not forget this password.
    Passphrase:
    Repeat passphrase:
    Address: {679fed8f4f3ea421689136b25073c6da7973418f}

    Please note the keystore file generated inside new-node-1 includes the address in the last part of its filename.

    ls new-node-1/keystore
    UTC--2019-06-17T09-29-06.665107000Z--679fed8f4f3ea421689136b25073c6da7973418f
    ```

    !!! note
        You could generate multiple accounts for a single node, or any number of accounts for additional nodes and pre-allocate them with funds in the genesis.json file (see below)

1. Copy the [sample `genesis.json`](../Reference/genesis.md) and change accounts with accounts
    generated at the previous step to the `alloc` field and pre-fund them.

    !!!example
        Fragment example of funding the accounts 679fed8f4f3ea421689136b25073c6da7973418f and c5c7b431e1629fb992eb18a79559f667228cd055 with the specified balance.

        ```json
        {
          "alloc": {
            "0x679fed8f4f3ea421689136b25073c6da7973418f": {
              "balance": "1000000000000000000000000000"
            },
            "0xc5c7b431e1629fb992eb18a79559f667228cd055": {
              "balance": "2000000000000000000000000000"
            }
          },
          ...
        }
        ```

1. Generate node key and copy it into datadir

    ```bash
     bootnode --genkey=nodekey
     cp nodekey new-node-1/
    ```

1. Execute below command to display enode id of the new node

    ```bash
     bootnode --nodekey=new-node-1/nodekey --writeaddress > new-node-1/enode
     cat new-node-1/enode
    ```

    Result:

    ```text
    70399c3d1654c959a02b73acbdd4770109e39573a27a9b52bd391e5f79b91a42d8f2b9e982959402a97d2cbcb5656d778ba8661ec97909abc72e7bb04392ebd8
    ```

1. Copy [`static-nodes.json`](permissioned-nodes.md).
    Your file should contain a single line for your node with your enode's ID and the ports you are going to use for devp2p and Raft.
    Ensure that this file is in your node `new-node-1` data directory.

    Paste the following fragment below lines with enode generated in previous step, port 21000;IP 127.0.0.1 and raft port set as 50000:

    ```json
    [
      "enode://70399c3d1654c959a02b73acbdd4770109e39573a27a9b52bd391e5f79b91a42d8f2b9e982959402a97d2cbcb5656d778ba8661ec97909abc72e7bb04392ebd8@127.0.0.1:21000?discport=0&raftport=50000"
    ]
    ```

1. Initialize new node with below command.

    ```bash
     geth --datadir new-node-1 init genesis.json
    ```

    Result:

    ```text
    INFO [06-07|15:45:17.508] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-07|15:45:17.516] Allocated cache and file handles         database=/Users/username/new-node-1/geth/chaindata cache=16 handles=16
    INFO [06-07|15:45:17.524] Writing custom genesis block
    INFO [06-07|15:45:17.524] Persisted trie from memory database      nodes=1 size=152.00B time=75.344µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-07|15:45:17.525] Successfully wrote genesis state         database=chaindata                              hash=ec0542…9665bf
    INFO [06-07|15:45:17.525] Allocated cache and file handles         database=/Users/username/new-node-1/geth/lightchaindata cache=16 handles=16
    INFO [06-07|15:45:17.527] Writing custom genesis block
    INFO [06-07|15:45:17.527] Persisted trie from memory database      nodes=1 size=152.00B time=60.76µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-07|15:45:17.527] Successfully wrote genesis state         database=lightchaindata                              hash=ec0542…9665bf
    ```

1. Start your node by first creating a `startnode1.sh` script as the following:

    ```bash
    #!/bin/bash
    PRIVATE_CONFIG=ignore nohup geth --datadir new-node-1 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50000 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft --emitcheckpoints --port 21000 >> node.log 2>&1 &
    ```

    then make it executable and start it:

    ```bash
    chmod +x startnode1.sh
    ./startnode1.sh
    ```

    !!! note
        This configuration starts GoQuorum without privacy support as could be evidenced in prefix `PRIVATE_CONFIG=ignore`, please see below sections on [how to enable privacy with privacy transaction managers](#adding-privacy-transaction-manager).

    Your node is now operational.

    Attach a Geth console to it with the following command:

    ```bash
     geth attach new-node-1/geth.ipc
    ```

    Result:

    ```text
    Welcome to the Geth JavaScript console!

    instance: Geth/v1.8.18-stable-bb88608c(quorum-v2.2.3)/darwin-amd64/go1.10.2
    coinbase: 0xedf53f5bf40c99f48df184441137659aed899c48
    at block: 0 (Thu, 01 Jan 1970 01:00:00 BST)
     datadir: /Users/username/fromscratch/new-node-1
     modules: admin:1.0 debug:1.0 eth:1.0 ethash:1.0 miner:1.0 net:1.0 personal:1.0 raft:1.0 rpc:1.0 txpool:1.0 web3:1.0
    ```

    The `>` character in the console indicates the prompt. You can type commands after this character.

    Run the following commands:

    ```javascript
    raft.cluster
    ```

    Result:

    ```json
    [{
        ip: "127.0.0.1",
        nodeId: "a5596803caebdc9c5326e1a0775563ad8e4aa14aa3530f0ae16d3fd8d7e48bc0b81342064e22094ab5d10303ab5721650af561f2bcdc54d705f8b6a8c07c94c3",
        p2pPort: 21000,
        raftId: 1,
        raftPort: 50000
    }]
    ```

    Command:

    ```javascript
    raft.leader
    ```

    Result:

    ```json
    "a5596803caebdc9c5326e1a0775563ad8e4aa14aa3530f0ae16d3fd8d7e48bc0b81342064e22094ab5d10303ab5721650af561f2bcdc54d705f8b6a8c07c94c3"
    ```

    Command:

    ```javascript
    raft.role
    ```

    Result:

    ```json
    "minter"
    ```

    Exit the console:

    ```javascript
    exit
    ```

### Adding additional node

1. Complete steps 1, 2, 5, and 6 from the previous guide

    ```bash
    mkdir new-node-2
    bootnode --genkey=nodekey2
    cp nodekey2 new-node-2/nodekey
    bootnode --nodekey=new-node-2/nodekey --writeaddress
    ```

    Node ID is displayed:

    ```text
    56e81550db3ccbfb5eb69c0cfe3f4a7135c931a1bae79ea69a1a1c6092cdcbea4c76a556c3af977756f95d8bf9d7b38ab50ae070da390d3abb3d7e773099c1a9
    ```

1. Retrieve current chains `genesis.json` and `static-nodes.json`.
    `static-nodes.json` should be placed into new nodes data dir

    ```bash
     cp static-nodes.json new-node-2
    ```

1. Edit `static-nodes.json` and add new entry for the new node you are configuring (should be last)

    Append new-node-2's enode generated in step 1, port 21001;IP 127.0.0.1 and raft port set as 50001:

    ```json
    [
     "enode://70399c3d1654c959a02b73acbdd4770109e39573a27a9b52bd391e5f79b91a42d8f2b9e982959402a97d2cbcb5656d778ba8661ec97909abc72e7bb04392ebd8@127.0.0.1:21000?discport=0&raftport=50000",
     "enode://56e81550db3ccbfb5eb69c0cfe3f4a7135c931a1bae79ea69a1a1c6092cdcbea4c76a556c3af977756f95d8bf9d7b38ab50ae070da390d3abb3d7e773099c1a9@127.0.0.1:21001?discport=0&raftport=50001"
    ]
    ```

1. Initialize new node as given below:

    ```bash
     geth --datadir new-node-2 init genesis.json
    ```

    Result:

    ```text
    INFO [06-07|16:34:39.805] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-07|16:34:39.814] Allocated cache and file handles         database=/Users/username/fromscratch/new-node-2/geth/chaindata cache=16 handles=16
    INFO [06-07|16:34:39.816] Writing custom genesis block
    INFO [06-07|16:34:39.817] Persisted trie from memory database      nodes=1 size=152.00B time=59.548µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-07|16:34:39.817] Successfully wrote genesis state         database=chaindata                                          hash=f02d0b…ed214a
    INFO [06-07|16:34:39.817] Allocated cache and file handles         database=/Users/username/fromscratch/new-node-2/geth/lightchaindata cache=16 handles=16
    INFO [06-07|16:34:39.819] Writing custom genesis block
    INFO [06-07|16:34:39.819] Persisted trie from memory database      nodes=1 size=152.00B time=43.733µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-07|16:34:39.819] Successfully wrote genesis state         database=lightchaindata                                          hash=f02d0b…ed214a
    ```

1. Connect to an already running node of the chain and execute Raft `addPeer` command.

    ```bash
    geth attach new-node-1/geth.ipc
    ```

    Result:

    ```text
    Welcome to the Geth JavaScript console!

    instance: Geth/v1.8.18-stable-bb88608c(quorum-v2.2.3)/darwin-amd64/go1.10.2
    coinbase: 0xedf53f5bf40c99f48df184441137659aed899c48
    at block: 0 (Thu, 01 Jan 1970 01:00:00 BST)
     datadir: /Users/username/fromscratch/new-node-1
     modules: admin:1.0 debug:1.0 eth:1.0 ethash:1.0 miner:1.0 net:1.0 personal:1.0 raft:1.0 rpc:1.0 txpool:1.0 web3:1.0
    ```

    The `>` character in the console indicates the prompt. You can type commands after this character.

    Run the following commands:

    ```javascript
    raft.addPeer('enode://56e81550db3ccbfb5eb69c0cfe3f4a7135c931a1bae79ea69a1a1c6092cdcbea4c76a556c3af977756f95d8bf9d7b38ab50ae070da390d3abb3d7e773099c1a9@127.0.0.1:21001?discport=0&raftport=50001')
    ```

    Result:

    ```json
    2
    ```

    Command:

    ```javascript
    raft.cluster
    ```

    Result:

    ```json
    [{
        ip: "127.0.0.1",
        nodeId: "56e81550db3ccbfb5eb69c0cfe3f4a7135c931a1bae79ea69a1a1c6092cdcbea4c76a556c3af977756f95d8bf9d7b38ab50ae070da390d3abb3d7e773099c1a9",
        p2pPort: 21001,
        raftId: 2,
        raftPort: 50001
    }, {
        ip: "127.0.0.1",
        nodeId: "70399c3d1654c959a02b73acbdd4770109e39573a27a9b52bd391e5f79b91a42d8f2b9e982959402a97d2cbcb5656d778ba8661ec97909abc72e7bb04392ebd8",
        p2pPort: 21000,
        raftId: 1,
        raftPort: 50000
    }]
    ```

    Exit the console:

    ```javascript
    exit
    ```

1. Start your node by first creating a script as previous step and changing the ports you are going to use for Devp2p and Raft.

    ```bash
     cp startnode1.sh startnode2.sh
    ```

    Edit file like the following:

    ```bash
    #!/bin/bash
    PRIVATE_CONFIG=ignore nohup geth --datadir new-node-2 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50001 --raftjoinexisting 2 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft --emitcheckpoints --port 21001 2>>node2.log &
    ```

    Run the node:

    ```bash
     ./startnode2.sh
    ```

1. Optional: share new `static-nodes.json` with all other chain participants

    ```bash
     cp new-node-2/static-nodes.json new-node-1
    ```

    Your additional node is now operational and is part of the same chain as the previously set up node.

### Removing node

1. Connect to an already running node of the chain and execute `raft.cluster` and get the `RAFT_ID` corresponding to the node that needs to be removed
1. Run `raft.removePeer(RAFT_ID)`
1. Stop the `geth` process corresponding to the node that was removed:

    ```bash
    geth attach new-node-1/geth.ipc
    ```

    Result:

    ```text
    Welcome to the Geth JavaScript console!

    instance: Geth/v1.8.18-stable-bb88608c(quorum-v2.2.3)/darwin-amd64/go1.10.2
    coinbase: 0xedf53f5bf40c99f48df184441137659aed899c48
    at block: 0 (Thu, 01 Jan 1970 01:00:00 BST)
     datadir: /Users/username/fromscratch/new-node-1
     modules: admin:1.0 debug:1.0 eth:1.0 ethash:1.0 miner:1.0 net:1.0 personal:1.0 raft:1.0 rpc:1.0 txpool:1.0 web3:1.0
    ```

    The `>` character in the console indicates the prompt. You can type commands after this character.

    Run the following commands:

    ```javascript
    raft.cluster
    ```

    Result:

    ```json
    [{
        ip: "127.0.0.1",
        nodeId: "56e81550db3ccbfb5eb69c0cfe3f4a7135c931a1bae79ea69a1a1c6092cdcbea4c76a556c3af977756f95d8bf9d7b38ab50ae070da390d3abb3d7e773099c1a9",
        p2pPort: 21001,
        raftId: 2,
        raftPort: 50001
    }, {
        ip: "127.0.0.1",
        nodeId: "a5596803caebdc9c5326e1a0775563ad8e4aa14aa3530f0ae16d3fd8d7e48bc0b81342064e22094ab5d10303ab5721650af561f2bcdc54d705f8b6a8c07c94c3",
        p2pPort: 21000,
        raftId: 1,
        raftPort: 50000
    }]
    ```

    Command:

    ```javascript
    raft.removePeer(2)
    ```

    Result:

    ```json
    null
    ```

    Command:

    ```javascript
    raft.cluster
    ```

    Result:

    ```json
    [{
        ip: "127.0.0.1",
        nodeId: "a5596803caebdc9c5326e1a0775563ad8e4aa14aa3530f0ae16d3fd8d7e48bc0b81342064e22094ab5d10303ab5721650af561f2bcdc54d705f8b6a8c07c94c3",
        p2pPort: 21000,
        raftId: 1,
        raftPort: 50000
    }]
    ```

    Exit the console:

    ```javascript
    exit
    ```

    Run the following shell commands:

    ```bash
    ps | grep geth
    ```

    Result:

    ```text
      PID TTY           TIME CMD
    10554 ttys000    0:00.01 -bash
     9125 ttys002    0:00.50 -bash
    10695 ttys002    0:31.42 geth --datadir new-node-1 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50000 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpoo
    10750 ttys002    0:01.94 geth --datadir new-node-2 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50001 --raftjoinexisting 2 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,db,eth,debu
    ```

    Kill the geth process:

    ```bash
    kill 10750
    ```

    Check that the process is gone:

    ```bash
    ps
    ```

    Result:

    ```text
      PID TTY           TIME CMD
    10554 ttys000    0:00.01 -bash
     9125 ttys002    0:00.51 -bash
    10695 ttys002    0:31.76 geth --datadir new-node-1 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50000 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpoo
    ```

    PID 10750 is gone.

## GoQuorum with Istanbul BFT consensus

1. On each machine build GoQuorum as described in the [Installing](../HowTo/GetStarted/Install.md) section. Ensure that PATH contains geth and boot node:

    ```bash
    git clone https://github.com/ConsenSys/quorum.git
    cd quorum
    make all
    export PATH=$(pwd)/build/bin:$PATH
    ```

1. Install [istanbul-tools](https://github.com/ConsenSys/istanbul-tools)

    ```bash
    mkdir fromscratchistanbul
    cd fromscratchistanbul
    git clone https://github.com/ConsenSys/istanbul-tools.git
    cd istanbul-tools
    make
    ```

1. Create a working directory for each of the X number of initial validator nodes

    ```bash
    mkdir node0 node1 node2 node3 node4
    ```

1. Change into the lead (whichever one you consider first) node's working directory.
    Generate the setup files for X initial validator nodes by executing `istanbul setup --num X --nodes --quorum --save --verbose`.
    **only execute this instruction once, that is not X times**.
    This command will generate several items of interest: `static-nodes.json`, `genesis.json`,
    and nodekeys for all the initial validator nodes which will sit in numbered directories from 0 to X-1

    ```bash
     cd node0
     ../istanbul-tools/build/bin/istanbul setup --num 5 --nodes --quorum --save --verbose
    validators
    ```

    Result:

    ```json
    {
        "Address": "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d",
        "Nodekey": "fe2725c4e8f7617764b845e8d939a65c664e7956eb47ed7d934573f16488efc1",
        "NodeInfo": "enode://dd333ec28f0a8910c92eb4d336461eea1c20803eed9cf2c056557f986e720f8e693605bba2f4e8f289b1162e5ac7c80c914c7178130711e393ca76abc1d92f57@0.0.0.0:30303?discport=0"
    }
    {
        "Address": "0x189d23d201b03ae1cf9113672df29a5d672aefa3",
        "Nodekey": "3434f9efd184f2255f8acc9f4408a5068bd5ae920548044087578ab97ef22f3a",
        "NodeInfo": "enode://1bb6be462f27e56f901c3fcb2d53a9273565f48e5d354c08f0c044405b29291b405b9f5aa027f3a75f9b058cb43e2f54719f15316979a0e5a2b760fff4631998@0.0.0.0:30303?discport=0"
    }
    {
        "Address": "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6",
        "Nodekey": "8183051c9976200d245c59a80ae004f20c3f66e1aa1b8f17458931de91576e05",
        "NodeInfo": "enode://0df02e94a3befc0683780d898119d3b675e5942c1a2f9ad47d35b4e6ccaf395cd71ec089fcf1d616748bf9871f91e5e3d29c1cf6f8f81de1b279082a104f619d@0.0.0.0:30303?discport=0"
    }
    {
        "Address": "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52",
        "Nodekey": "de415c5dbbb9ff0a34dbd3bf871ee41b230f431925e1f4cc1dd225ef47cc066f",
        "NodeInfo": "enode://3fe0ff0dd2730eaac7b6b379bdb51215b5831f4f48fa54a24a0298ad5ba8c2a332442948d53f4cd4fd28f373089a35e806ef722eb045659910f96a1278120516@0.0.0.0:30303?discport=0"
    }
    {
        "Address": "0x7ae555d0f6faad7930434abdaac2274fd86ab516",
        "Nodekey": "768b87473ba96fcfa272f958fc95a3cefdf9aa82110cde6f2f34aa5855eb39db",
        "NodeInfo": "enode://e53e92e5a51ac2685b0406d0d3c62288b53831c3b0f492b9dc4bc40334783702cfa74c49b836efa2761edde33a3282704273b2453537b855e7a4aeadcccdb43e@0.0.0.0:30303?discport=0"
    }


    static-nodes.json
    [
        "enode://dd333ec28f0a8910c92eb4d336461eea1c20803eed9cf2c056557f986e720f8e693605bba2f4e8f289b1162e5ac7c80c914c7178130711e393ca76abc1d92f57@0.0.0.0:30303?discport=0",
        "enode://1bb6be462f27e56f901c3fcb2d53a9273565f48e5d354c08f0c044405b29291b405b9f5aa027f3a75f9b058cb43e2f54719f15316979a0e5a2b760fff4631998@0.0.0.0:30303?discport=0",
        "enode://0df02e94a3befc0683780d898119d3b675e5942c1a2f9ad47d35b4e6ccaf395cd71ec089fcf1d616748bf9871f91e5e3d29c1cf6f8f81de1b279082a104f619d@0.0.0.0:30303?discport=0",
        "enode://3fe0ff0dd2730eaac7b6b379bdb51215b5831f4f48fa54a24a0298ad5ba8c2a332442948d53f4cd4fd28f373089a35e806ef722eb045659910f96a1278120516@0.0.0.0:30303?discport=0",
        "enode://e53e92e5a51ac2685b0406d0d3c62288b53831c3b0f492b9dc4bc40334783702cfa74c49b836efa2761edde33a3282704273b2453537b855e7a4aeadcccdb43e@0.0.0.0:30303?discport=0"
    ]


    genesis.json
    {
        "config": {
            "chainId": 10,
            "eip150Block": 1,
            "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eip155Block": 1,
            "eip158Block": 1,
            "byzantiumBlock": 1,
            "istanbul": {
                "epoch": 30000,
                "policy": 0
            },
            "isQuorum": true
        },
        "nonce": "0x0",
        "timestamp": "0x5cffc201",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000f8aff869944c1ccd426833b9782729a212c857f2f03b7b4c0d94189d23d201b03ae1cf9113672df29a5d672aefa39444b07d2c28b8ed8f02b45bd84ac7d9051b3349e694c1056df7c02b6f1a353052eaf0533cc7cb743b52947ae555d0f6faad7930434abdaac2274fd86ab516b8410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0",
        "gasLimit": "0xe0000000",
        "difficulty": "0x1",
        "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": {
            "189d23d201b03ae1cf9113672df29a5d672aefa3": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "4c1ccd426833b9782729a212c857f2f03b7b4c0d": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "7ae555d0f6faad7930434abdaac2274fd86ab516": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "c1056df7c02b6f1a353052eaf0533cc7cb743b52": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            }
        },
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
    ```

    Check directory content:

    ```bash
    ls -l
    ```

    Result:

    ```text
    total 16
    drwxr-xr-x  9 username  staff   288 11 Jun 16:00 .
    drwxr-xr-x  8 username  staff   256 11 Jun 15:58 ..
    drwxr-xr-x  3 username  staff    96 11 Jun 16:00 0
    drwxr-xr-x  3 username  staff    96 11 Jun 16:00 1
    drwxr-xr-x  3 username  staff    96 11 Jun 16:00 2
    drwxr-xr-x  3 username  staff    96 11 Jun 16:00 3
    drwxr-xr-x  3 username  staff    96 11 Jun 16:00 4
    -rwxr-xr-x  1 username  staff  1878 11 Jun 16:00 genesis.json
    -rwxr-xr-x  1 username  staff   832 11 Jun 16:00 static-nodes.json
    ```

1. Update `static-nodes.json` to include the intended IP and port numbers of all initial validator nodes.
    In `static-nodes.json`, you will see a line for each node.
    For the rest of the installation guide, line N refers to node N and first line is the lead node 0:

    ```bash
     cat static-nodes.json
    ```

    Result:

    ```json
    [
        "enode://dd333ec28f0a8910c92eb4d336461eea1c20803eed9cf2c056557f986e720f8e693605bba2f4e8f289b1162e5ac7c80c914c7178130711e393ca76abc1d92f57@127.0.0.1:30300?discport=0",
        "enode://1bb6be462f27e56f901c3fcb2d53a9273565f48e5d354c08f0c044405b29291b405b9f5aa027f3a75f9b058cb43e2f54719f15316979a0e5a2b760fff4631998@127.0.0.1:30301?discport=0",
        "enode://0df02e94a3befc0683780d898119d3b675e5942c1a2f9ad47d35b4e6ccaf395cd71ec089fcf1d616748bf9871f91e5e3d29c1cf6f8f81de1b279082a104f619d@127.0.0.1:30302?discport=0",
        "enode://3fe0ff0dd2730eaac7b6b379bdb51215b5831f4f48fa54a24a0298ad5ba8c2a332442948d53f4cd4fd28f373089a35e806ef722eb045659910f96a1278120516@127.0.0.1:30303?discport=0",
        "enode://e53e92e5a51ac2685b0406d0d3c62288b53831c3b0f492b9dc4bc40334783702cfa74c49b836efa2761edde33a3282704273b2453537b855e7a4aeadcccdb43e@127.0.0.1:30304?discport=0"
    ]
    ```

1. In each node's working directory, create a data directory called `data`, and inside `data` create the `geth` directory

    ```bash
    cd ..
    mkdir -p node0/data/geth
    mkdir -p node1/data/geth
    mkdir -p node2/data/geth
    mkdir -p node3/data/geth
    mkdir -p node4/data/geth
    ```

1. Now we will generate initial accounts for any of the nodes in the required node's working directory.
    The resulting public account address printed in the terminal should be recorded.
    Repeat as many times as necessary. A set of funded accounts may be required depending what you are trying to accomplish:

    ```bash
    geth --datadir node0/data account new
    ```

    Result:

    ```text
    INFO [06-11|16:05:53.672] Maximum peer count                       ETH=25 LES=0 total=25
    Your new account is locked with a password. Please give a password. Do not forget this password.
    Passphrase:
    ```

    Type in a passphrase.

    ```text
    Repeat passphrase:
    ```

    Type in the same passphrase again.

    New account address is displayed:

    ```text
    Address: {8fc817d90f179b0b627c2ecbcc1d1b0fcd13ddbd}
    ```

    Repeat the process for node 1:

    ```bash
    geth --datadir node1/data account new
    ```

    Result:

    ```text
    Address: {dce8adeef16a45d94be5e7804df6d35db834d94a}
    ```

    Repeat the process for node 2:

    ```bash
    geth --datadir node2/data account new
    ```

    Result:

    ```text
    Address: {65a3ab6d4cf23395f544833831fc5d42a0b2b43a}
    ```

1. To add accounts to the initial block, edit the `node0/genesis.json` file in the lead node's working directory and update the `alloc` field with the account(s) that were generated at previous step:

    ```json
    {
        "config": {
            "chainId": 10,
            "eip150Block": 1,
            "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eip155Block": 1,
            "eip158Block": 1,
            "byzantiumBlock": 1,
            "istanbul": {
                "epoch": 30000,
                "policy": 0
            },
            "isQuorum": true
        },
        "nonce": "0x0",
        "timestamp": "0x5cffc201",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000f8aff869944c1ccd426833b9782729a212c857f2f03b7b4c0d94189d23d201b03ae1cf9113672df29a5d672aefa39444b07d2c28b8ed8f02b45bd84ac7d9051b3349e694c1056df7c02b6f1a353052eaf0533cc7cb743b52947ae555d0f6faad7930434abdaac2274fd86ab516b8410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0",
        "gasLimit": "0xe0000000",
        "difficulty": "0x1",
        "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": {
            "8fc817d90f179b0b627c2ecbcc1d1b0fcd13ddbd": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "dce8adeef16a45d94be5e7804df6d35db834d94a": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            },
            "65a3ab6d4cf23395f544833831fc5d42a0b2b43a": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            }
        },
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
    ```

1. Next we need to distribute the files created in part 4, which currently reside in the lead node's working directory (node 0), to all other nodes.
    1. Copy `genesis.json` in the working directory of each node:

        ```bash
        cp node0/genesis.json node1
        cp node0/genesis.json node2
        cp node0/genesis.json node3
        cp node0/genesis.json node4
        ```

    1. Copy `static-nodes.json` in the data folder of each node:

        ```bash
        cp node0/static-nodes.json node0/data/
        cp node0/static-nodes.json node1/data/
        cp node0/static-nodes.json node2/data/
        cp node0/static-nodes.json node3/data/
        cp node0/static-nodes.json node4/data/
        ```

    1. Copy `nodekey` from node 0 in each node `data/geth` directory:

        ```bash
        cp node0/0/nodekey node0/data/geth
        cp node0/1/nodekey node1/data/geth
        cp node0/2/nodekey node2/data/geth
        cp node0/3/nodekey node3/data/geth
        cp node0/4/nodekey node4/data/geth
        ```

1. Switch into working directory of lead node and initialize it.
    Repeat for every working directory created in step 3.
    *The resulting hash given by executing `geth init` must match for every node*

    ```bash
    cd node0
    geth --datadir data init genesis.json
    ```

    Result:

    ```text
    INFO [06-11|16:14:11.883] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-11|16:14:11.894] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node0/data/geth/chaindata cache=16 handles=16
    INFO [06-11|16:14:11.896] Writing custom genesis block
    INFO [06-11|16:14:11.897] Persisted trie from memory database      nodes=6 size=1.01kB time=76.665µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:11.897] Successfully wrote genesis state         database=chaindata                                                  hash=b992be…533db7
    INFO [06-11|16:14:11.897] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node0/data/geth/lightchaindata cache=16 handles=16
    INFO [06-11|16:14:11.898] Writing custom genesis block
    INFO [06-11|16:14:11.898] Persisted trie from memory database      nodes=6 size=1.01kB time=54.929µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:11.898] Successfully wrote genesis state         database=lightchaindata                                                  hash=b992be…533db7
    ```

    Command:

    ```bash
    cd ../node1
    geth --datadir data init genesis.json
    ```

    Result:

    ```text
    INFO [06-11|16:14:24.814] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-11|16:14:24.824] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node1/data/geth/chaindata cache=16 handles=16
    INFO [06-11|16:14:24.831] Writing custom genesis block
    INFO [06-11|16:14:24.831] Persisted trie from memory database      nodes=6 size=1.01kB time=82.799µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:24.832] Successfully wrote genesis state         database=chaindata                                                  hash=b992be…533db7
    INFO [06-11|16:14:24.832] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node1/data/geth/lightchaindata cache=16 handles=16
    INFO [06-11|16:14:24.833] Writing custom genesis block
    INFO [06-11|16:14:24.833] Persisted trie from memory database      nodes=6 size=1.01kB time=52.828µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:24.834] Successfully wrote genesis state         database=lightchaindata                                                  hash=b992be…533db7
    ```

    Command:

    ```bash
    cd ../node2
    geth --datadir data init genesis.json
    ```

    Result:

    ```text
    INFO [06-11|16:14:35.246] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-11|16:14:35.257] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node2/data/geth/chaindata cache=16 handles=16
    INFO [06-11|16:14:35.264] Writing custom genesis block
    INFO [06-11|16:14:35.265] Persisted trie from memory database      nodes=6 size=1.01kB time=124.91µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:35.265] Successfully wrote genesis state         database=chaindata                                                  hash=b992be…533db7
    INFO [06-11|16:14:35.265] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node2/data/geth/lightchaindata cache=16 handles=16
    INFO [06-11|16:14:35.267] Writing custom genesis block
    INFO [06-11|16:14:35.268] Persisted trie from memory database      nodes=6 size=1.01kB time=85.504µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:35.268] Successfully wrote genesis state         database=lightchaindata                                                  hash=b992be…533db7
    ```

    Command:

    ```bash
    cd ../node3
    geth --datadir data init genesis.json
    ```

    Result:

    ```text
    INFO [06-11|16:14:42.168] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-11|16:14:42.178] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node3/data/geth/chaindata cache=16 handles=16
    INFO [06-11|16:14:42.186] Writing custom genesis block
    INFO [06-11|16:14:42.186] Persisted trie from memory database      nodes=6 size=1.01kB time=124.611µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:42.187] Successfully wrote genesis state         database=chaindata                                                  hash=b992be…533db7
    INFO [06-11|16:14:42.187] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node3/data/geth/lightchaindata cache=16 handles=16
    INFO [06-11|16:14:42.189] Writing custom genesis block
    INFO [06-11|16:14:42.189] Persisted trie from memory database      nodes=6 size=1.01kB time=80.973µs  gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:42.189] Successfully wrote genesis state         database=lightchaindata                                                  hash=b992be…533db7
    ```

    Command:

    ```bash
    cd ../node4
    geth --datadir data init genesis.json
    ```

    Result:

    ```text
    INFO [06-11|16:14:48.737] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-11|16:14:48.747] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node4/data/geth/chaindata cache=16 handles=16
    INFO [06-11|16:14:48.749] Writing custom genesis block
    INFO [06-11|16:14:48.749] Persisted trie from memory database      nodes=6 size=1.01kB time=71.213µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:48.750] Successfully wrote genesis state         database=chaindata                                                  hash=b992be…533db7
    INFO [06-11|16:14:48.750] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node4/data/geth/lightchaindata cache=16 handles=16
    INFO [06-11|16:14:48.751] Writing custom genesis block
    INFO [06-11|16:14:48.751] Persisted trie from memory database      nodes=6 size=1.01kB time=53.773µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:14:48.751] Successfully wrote genesis state         database=lightchaindata                                                  hash=b992be…533db7
    ```

    Finally go one directory up:

    ```bash
    cd..
    ```

1. Start all nodes by first creating a `startall.sh` script and running it.

    Create `startall.sh` with the following content:

    !!!important
        The port numbers should match the port number for each node decided on in step 5

    ```bash
    #!/bin/bash

    cd node0
    PRIVATE_CONFIG=ignore nohup geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30300 2>>node.log &

    cd ../node1
    PRIVATE_CONFIG=ignore nohup geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30301 2>>node.log &

    cd ../node2
    PRIVATE_CONFIG=ignore nohup geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22002 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30302 2>>node.log &

    cd ../node3
    PRIVATE_CONFIG=ignore nohup geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22003 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30303 2>>node.log &

    cd ../node4
    PRIVATE_CONFIG=ignore nohup geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22004 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30304 2>>node.log &
    ```

    Go back to your terminal and check if other geth nodes are running:

    ```bash
    ps | grep geth
    ```

    Kill geth processes

    ```bash
    killall -INT geth
    ```

    Make the `startall.sh` script executable and run it:

    ```bash
    chmod +x startall.sh
    ./startall.sh
    ```

    Check all the nodes are running:

    ```bash
    ps
    ```

    Result:

    ```text
      PID TTY           TIME CMD
    10554 ttys000    0:00.11 -bash
    21829 ttys001    0:00.03 -bash
     9125 ttys002    0:00.82 -bash
    36432 ttys002    0:00.19 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,
    36433 ttys002    0:00.18 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,
    36434 ttys002    0:00.19 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22002 --rpcapi admin,
    36435 ttys002    0:00.19 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22003 --rpcapi admin,
    36436 ttys002    0:00.19 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22004 --rpcapi admin,
    ```

    !!! note
        This configuration starts GoQuorum without privacy support as could be evidenced in prefix `PRIVATE_CONFIG=ignore`, please see below sections on [how to enable privacy with privacy transaction managers](#adding-privacy-transaction-manager).
        Please note that istanbul-tools may be used to generate X number of nodes, more information is available in the [docs](https://github.com/ConsenSys/istanbul-tools).

    Your node is now operational and you can attach to it with:

    ```bash
    geth attach node0/data/geth.ipc
    ```

### Adding additional validator

1. Create a working directory for the new node that needs to be added

    ```bash
    mkdir node5
    ```

1. Change into the working directory for the new node 5 and run istanbul setup:

    ```bash
    cd node5
    ../istanbul-tools/build/bin/istanbul setup --num 1 --verbose --quorum --save
    ```

    This will generate the validator details including `Address`, `NodeInfo` and `genesis.json`:

    ```json
    validators
    {
        "Address": "0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",
        "Nodekey": "25b47a49ef08f888c04f30417363e6c6bc33e739147b2f8b5377b3168f9f7435",
        "NodeInfo": "enode://273eaf48591ce0e77c800b3e6465811d6d2f924c4dcaae016c2c7375256d17876c3e05f91839b741fe12350da0b5a741da4e30f39553fe8790f88503c64f6ef9@0.0.0.0:30303?discport=0"
    }

    genesis.json
    {
        "config": {
            "chainId": 10,
            "eip150Block": 1,
            "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eip155Block": 1,
            "eip158Block": 1,
            "byzantiumBlock": 1,
            "istanbul": {
                "epoch": 30000,
                "policy": 0
            },
            "isQuorum": true
        },
        "nonce": "0x0",
        "timestamp": "0x5cffc942",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000f85ad5942aabbc1bb9bacef60a09764d1a1f4f04a47885c1b8410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0",
        "gasLimit": "0xe0000000",
        "difficulty": "0x1",
        "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": {
            "2aabbc1bb9bacef60a09764d1a1f4f04a47885c1": {
                "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
            }
        },
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
    ```

1. Copy the address of the validator and propose it from more than half the number of current validators.

    Attach geth console to the node:

    ```bash
    cd ..
    geth attach node0/data/geth.ipc
    ```

    Result:

    ```text
    Welcome to the Geth JavaScript console!

    instance: Geth/v1.8.18-stable-bb88608c(quorum-v2.2.3)/darwin-amd64/go1.10.2
    coinbase: 0x4c1ccd426833b9782729a212c857f2f03b7b4c0d
    at block: 137 (Tue, 11 Jun 2019 16:32:47 BST)
     datadir: /Users/username/fromscratchistanbul/node0/data
     modules: admin:1.0 debug:1.0 eth:1.0 istanbul:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
    ```

    Check existing validators:

    ```javascript
    istanbul.getValidators()
    ```

    Result:

    ```json
    ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
    ```

    Propose new validator using the command `istanbul.propose(<address>, true)`
    with `<address>` replaced by the new validator candidate node address:

    ```javascript
    istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",true)
    ```

    Result:

    ```json
    null
    ```

    Exit console:

    ```jacascript
    exit
    ```

    **Repeat the proposal process for this candidate node by connecting your geth console to node 1, node2 and node 3.**

1. Verify that the new validator is now in the list of validators by running `istanbul.getValidators()` in a geth console attached to any of your nodes.

    ```javascript
    istanbul.getValidators()
    ```

    Result:

    ```json
    ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
    ```

    The list of validators contains 6 addresses now.

1. Copy `static-nodes.json` and `genesis.json` from the existing chain.
    `static-nodes.json` should be placed into new nodes data dir:

    ```bash
    cd node5
    mkdir -p data/geth
    cp ../node0/static-nodes.json data
    cp ../node0/genesis.json .
    ```

1. Edit `static-nodes.json` and add the new validators node info to the end of the file.
    New validators node info can be retrieved from the output of `istanbul setup --num 1 --verbose --quorum --save` command that was run in step 2.
    Update the IP address and port of the node info to match the IP address of the validator and port you want to use.

    Edit `data/static-nodes.json` and add new validate nodes details with correct IP and port details:

    ```json
    [
        "enode://dd333ec28f0a8910c92eb4d336461eea1c20803eed9cf2c056557f986e720f8e693605bba2f4e8f289b1162e5ac7c80c914c7178130711e393ca76abc1d92f57@127.0.0.1:30300?discport=0",
        "enode://1bb6be462f27e56f901c3fcb2d53a9273565f48e5d354c08f0c044405b29291b405b9f5aa027f3a75f9b058cb43e2f54719f15316979a0e5a2b760fff4631998@127.0.0.1:30301?discport=0",
        "enode://0df02e94a3befc0683780d898119d3b675e5942c1a2f9ad47d35b4e6ccaf395cd71ec089fcf1d616748bf9871f91e5e3d29c1cf6f8f81de1b279082a104f619d@127.0.0.1:30302?discport=0",
        "enode://3fe0ff0dd2730eaac7b6b379bdb51215b5831f4f48fa54a24a0298ad5ba8c2a332442948d53f4cd4fd28f373089a35e806ef722eb045659910f96a1278120516@127.0.0.1:30303?discport=0",
        "enode://e53e92e5a51ac2685b0406d0d3c62288b53831c3b0f492b9dc4bc40334783702cfa74c49b836efa2761edde33a3282704273b2453537b855e7a4aeadcccdb43e@127.0.0.1:30304?discport=0",
        "enode://273eaf48591ce0e77c800b3e6465811d6d2f924c4dcaae016c2c7375256d17876c3e05f91839b741fe12350da0b5a741da4e30f39553fe8790f88503c64f6ef9@127.0.0.1:30305?discport=0"
    ]
    ```

1. Copy the nodekey that was generated by `istanbul setup` command to the `geth` directory inside the working directory

    ```bash
    cp 0/nodekey data/geth
    ```

1. Generate one or more accounts for this node and take down the account address.

    ```bash
    geth --datadir data account new
    ```

    Result:

    ```text
    INFO [06-12|17:45:11.116] Maximum peer count                       ETH=25 LES=0 total=25
    Your new account is locked with a password. Please give a password. Do not forget this password.
    Passphrase:
    ```

    Input your passphrase and repeat it:

    ```text
    Repeat passphrase:
    ```

    Result:

    ```text
    Address: {37922bce824bca2f3206ea53dd50d173b368b572}
    ```

1. Initialize new node with the following command:

    ```bash
    geth --datadir data init genesis.json
    ```

    Result:

    ```text
    INFO [06-11|16:42:27.120] Maximum peer count                       ETH=25 LES=0 total=25
    INFO [06-11|16:42:27.130] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node5/data/geth/chaindata cache=16 handles=16
    INFO [06-11|16:42:27.138] Writing custom genesis block
    INFO [06-11|16:42:27.138] Persisted trie from memory database      nodes=6 size=1.01kB time=163.024µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:42:27.139] Successfully wrote genesis state         database=chaindata                                                  hash=b992be…533db7
    INFO [06-11|16:42:27.139] Allocated cache and file handles         database=/Users/username/fromscratchistanbul/node5/data/geth/lightchaindata cache=16 handles=16
    INFO [06-11|16:42:27.141] Writing custom genesis block
    INFO [06-11|16:42:27.142] Persisted trie from memory database      nodes=6 size=1.01kB time=94.57µs   gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
    INFO [06-11|16:42:27.142] Successfully wrote genesis state         database=lightchaindata                                                  hash=b992be…533db7
    ```

1. Copy `startall.sh` to a new `start5.sh` and execute it to start the node:

    ```bash
    cd ..
    cp startall.sh start5.sh
    ```

    Edit `start5.sh` with the following:

    ```bash
    #!/bin/bash
    cd node5
    PRIVATE_CONFIG=ignore nohup geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22005 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30305 2>>node.log &
    ```

    !!!important
        Update IP and port number matching for this node decided on step 6

    Run node 5:

    ```bash
    ./start5.sh
    ```

    Check that the node is started:

    ```bash
    ps
    ```

    Result:

    ```text
      PID TTY           TIME CMD
    10554 ttys000    0:00.11 -bash
    21829 ttys001    0:00.03 -bash
     9125 ttys002    0:00.93 -bash
    36432 ttys002    0:24.48 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,
    36433 ttys002    0:23.36 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,
    36434 ttys002    0:24.32 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22002 --rpcapi admin,
    36435 ttys002    0:24.21 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22003 --rpcapi admin,
    36436 ttys002    0:24.17 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22004 --rpcapi admin,
    36485 ttys002    0:00.15 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22005 --rpcapi admin,
    36455 ttys003    0:00.04 -bash
    36467 ttys003    0:00.32 geth attach node3/data/geth.ipc
    ```

### Removing validators

1. Attach Geth console to a running validator and run `istanbul.getValidators()` and identify the address of the validator that needs to be removed:

    ```bash
    geth attach node0/data/geth.ipc
    ```

    Result:

    ```text
    Welcome to the Geth JavaScript console!

    instance: Geth/v1.8.18-stable-bb88608c(quorum-v2.2.3)/darwin-amd64/go1.10.2
    coinbase: 0xc1056df7c02b6f1a353052eaf0533cc7cb743b52
    at block: 181 (Tue, 11 Jun 2019 16:36:27 BST)
     datadir: /Users/username/fromscratchistanbul/node0/data
     modules: admin:1.0 debug:1.0 eth:1.0 istanbul:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
    ```

    Run command:

    ```javascript
    istanbul.getValidators()
    ```

    Result:

    ```json
    ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
    ```

    We will remove `0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1` from the validator in this tutorial.

1. Run `istanbul.propose(<address>, false)` by passing the address of the validator that needs to be removed from more than half current validators:

    ```javascript
    istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",false)
    ```

    Result:

    ```json
    null
    ```

    **Repeat the `istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",false)` for node 1, node 2 and node 3.**

1. Verify that the validator has been removed by running `istanbul.getValidators()`

    In one for the node's attached geth console, run:

    ```javascript
    istanbul.getValidators()
    ```

    Result:

    ```json
    ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
    ```

    The validators list now only have 5 addresses and the validator `0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1` was removed.

1. Stop the `geth` process corresponding to the validator that was removed.

    ```bash
    ps
    ```

    Result:

    ```text
      PID TTY           TIME CMD
    10554 ttys000    0:00.11 -bash
    21829 ttys001    0:00.03 -bash
     9125 ttys002    0:00.94 -bash
    36432 ttys002    0:31.93 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,
    36433 ttys002    0:30.75 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,
    36434 ttys002    0:31.72 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22002 --rpcapi admin,
    36435 ttys002    0:31.65 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22003 --rpcapi admin,
    36436 ttys002    0:31.63 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22004 --rpcapi admin,
    36485 ttys002    0:06.86 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --rpc --rpcaddr 0.0.0.0 --rpcport 22005 --rpcapi admin,
    36455 ttys003    0:00.05 -bash
    36493 ttys003    0:00.22 geth attach node4/data/geth.ipc
    ```

    Kill the geth process that uses port `22005`, corresponding to node 5 as indicated in `start5.sh`:

    ```bash
    kill 36485
    ```

### Adding non-validator node

Same instructions as adding validator node **excluding** step 3 which proposes the node as validator.

### Removing non-validator node

Just execute **step 4** instruction from removing a validator node.

## Adding privacy transaction manager

### Tessera

1. Build GoQuorum and install [Tessera](https://github.com/ConsenSys/tessera/releases) as described in the [Installing](../HowTo/GetStarted/Install.md) section. Ensure that PATH contains geth and bootnode. Be aware of the location of the `tessera.jar` release file.

    ```bash
    git clone https://github.com/ConsenSys/quorum.git
    cd quorum
    make all
    export PATH=$(pwd)/build/bin:$PATH
    cd ..
    ```

    Copy Tessera jar to your desired destination and rename it as `tessera.jar`:

    ```bash
    mv tessera-app-0.9.2-app.jar tessera.jar
    ```

1. Generate new keys using `java -jar /path-to-tessera/tessera.jar -keygen -filename new-node-1`

    ```bash
    mkdir new-node-1t
    cd new-node-1t
    java -jar ../tessera.jar -keygen -filename new-node-1
    ```

    Result:

    ```text
    Enter a password if you want to lock the private key or leave blank
    ```

    Enter a password.

    ```text
    Please re-enter the password (or lack of) to confirm
    ```

    Enter it again.

    Result:

    ```text
    10:32:51.256 [main] INFO  com.quorum.tessera.nacl.jnacl.Jnacl - Generating new keypair...
    10:32:51.279 [main] INFO  com.quorum.tessera.nacl.jnacl.Jnacl - Generated public key PublicKey[pnesVeDgs805ZPbnulzC5wokDzpdN7CeYKVUBXup/W4=] and private key REDACTED
    10:32:51.624 [main] INFO  c.q.t.k.generation.FileKeyGenerator - Saved public key to /Users/username/fromscratch/new-node-1t/new-node-1.pub
    10:32:51.624 [main] INFO  c.q.t.k.generation.FileKeyGenerator - Saved private key to /Users/username/fromscratch/new-node-1t/new-node-1.key
    ```

1. Create a new `new-node-1t/config.json` configuration file with newly generated keys referenced:

    ```json
    {
       "useWhiteList": false,
       "jdbc": {
           "username": "sa",
           "password": "",
           "url": "jdbc:h2:/yourpath/new-node-1t/db1;MODE=Oracle;TRACE_LEVEL_SYSTEM_OUT=0",
           "autoCreateTables": true
       },
       "serverConfigs":[
           {
               "app":"ThirdParty",
               "enabled": true,
               "serverAddress": "http://localhost:9081",
               "communicationType" : "REST"
           },
           {
               "app":"Q2T",
               "enabled": true,
                "serverAddress":"unix:/yourpath/new-node-1t/tm.ipc",
               "communicationType" : "REST"
           },
           {
               "app":"P2P",
               "enabled": true,
               "serverAddress":"http://localhost:9001",
               "sslConfig": {
                   "tls": "OFF"
               },
               "communicationType" : "REST"
           }
       ],
       "peer": [
           {
               "url": "http://localhost:9001"
           },
           {
               "url": "http://localhost:9003"
           }
       ],
       "keys": {
           "passwords": [],
           "keyData": [
               {
                   "privateKeyPath": "/yourpath/new-node-1t/new-node-1.key",
                   "publicKeyPath": "/yourpath/new-node-1t/new-node-1.pub"
               }
           ]
       },
       "alwaysSendTo": []
    }
    ```

1. Create another Tessera node, repeat step 2 & step 3

    Create a `new-node-2t` directory alongside `new-node-1t`

    Create a new `new-node-2t/config.json` configuration file with newly generated keys referenced and
    updated ports for this second node:

    ```json
    {
       "useWhiteList": false,
       "jdbc": {
           "username": "sa",
           "password": "",
           "url": "jdbc:h2:/yourpath/new-node-2t/db1;MODE=Oracle;TRACE_LEVEL_SYSTEM_OUT=0",
           "autoCreateTables": true
       },
       "serverConfigs":[
           {
               "app":"ThirdParty",
               "enabled": true,
               "serverAddress": "http://localhost:9083",
               "communicationType" : "REST"
           },
           {
               "app":"Q2T",
               "enabled": true,
                "serverAddress":"unix:/yourpath/new-node-2t/tm.ipc",
               "communicationType" : "REST"
           },
           {
               "app":"P2P",
               "enabled": true,
               "serverAddress":"http://localhost:9003",
               "sslConfig": {
                   "tls": "OFF"
               },
               "communicationType" : "REST"
           }
       ],
       "peer": [
           {
               "url": "http://localhost:9001"
           },
           {
               "url": "http://localhost:9003"
           }
       ],
       "keys": {
           "passwords": [],
           "keyData": [
               {
                   "privateKeyPath": "/yourpath/new-node-2t/new-node-2.key",
                   "publicKeyPath": "/yourpath/new-node-2t/new-node-2.pub"
               }
           ]
       },
       "alwaysSendTo": []
    }
    ```

1. Start your two Tessera nodes as background processes:

    ```bash
    java -jar ../tessera.jar -configfile config.json >> tessera.log 2>&1 &
    ```

    Resulting process ID (PID):

    ```text
    [1] 38072
    ```

    ```bash
    cd ../new-node-1t
    java -jar ../tessera.jar -configfile config.json >> tessera.log 2>&1 &
    ```

    Resulting process ID (PID):

    ```text
    [2] 38076
    ```

    Check that the two processes are started:

    ```bash
    ps
    ```

    Result:

    ```text
      PID TTY           TIME CMD
    10554 ttys000    0:00.12 -bash
    21829 ttys001    0:00.18 -bash
     9125 ttys002    0:01.52 -bash
    38072 ttys002    1:18.42 /usr/bin/java -jar ../tessera.jar -configfile config.json
    38076 ttys002    1:15.86 /usr/bin/java -jar ../tessera.jar -configfile config.json
    ```

    PIDs `38072` and `38076` are running.

1. Start GoQuorum nodes attached to running Tessera nodes as background processes:

    Update the GoQuorum node 1 `startnode1.sh` script to include `PRIVATE_CONFIG`:

    ```bash
    #!/bin/bash
    PRIVATE_CONFIG=/yourpath/new-node-1t/tm.ipc nohup geth --datadir new-node-1 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50000 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft --emitcheckpoints --port 21000 >> node.log 2>&1 &
    ```

    Update `startnode2.sh` the same way but with Tessera node 2 IPC path:

    ```bash
    #!/bin/bash
    PRIVATE_CONFIG=/yourpath/new-node-2t/tm.ipc nohup geth --datadir new-node-2 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50001 --raftjoinexisting 2 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft --emitcheckpoints --port 21001 2>>node2.log &
    ```

    Run GoQuorum nodes

    ```bash
    ./startnode1.sh && ./startnode2.sh
    ```

    Check all nodes are started, 2 Tessera nodes and 2 GoQuorum geth nodes:

    ```bash
    ps
    ```

    Result:

    ```text
      PID TTY           TIME CMD
    10554 ttys000    0:00.12 -bash
    21829 ttys001    0:00.18 -bash
     9125 ttys002    0:01.49 -bash
    38072 ttys002    0:48.92 /usr/bin/java -jar ../tessera.jar -configfile config.json
    38076 ttys002    0:47.60 /usr/bin/java -jar ../tessera.jar -configfile config.json
    38183 ttys002    0:08.15 geth --datadir new-node-1 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50000 --rpc --rpcaddr 0.0.0.0 --rpcport 22000 --rpcapi admin,db,eth,debug,miner,net,shh,txpoo
    38204 ttys002    0:00.19 geth --datadir new-node-2 --nodiscover --verbosity 5 --networkid 31337 --raft --raftport 50001 --raftjoinexisting 2 --rpc --rpcaddr 0.0.0.0 --rpcport 22001 --rpcapi admin,db,eth,debu
    36455 ttys003    0:00.15 -bash
    ```

    !!! note
        Tessera IPC bridge uses the file defined in `config.json`, usually named `tm.ipc` and then used as `PRIVATE_CONFIG` value.

    Your node is now able to send and receive private transactions.

    Advertised public node key will be in the `new-node-1.pub` file.

    Tessera offers a lot of configuration flexibility, please refer to the [Configuration](../../Privacy/Tessera/Configuration/Configuration%20Overview) section under Tessera for complete and up to date configuration options.

    Your node is now operational and you can attach to it with `geth attach new-node-1/geth.ipc` to send private transactions.

    Let's create a simple private contract to send transaction from new-node-1 private to new-node-2's tessera public key created in step 4.

    !!!example "private-contract.js"

        ```javascript
        a = eth.accounts[0]
        web3.eth.defaultAccount = a;

        // abi and bytecode generated from simplestorage.sol:
        // > solcjs --bin --abi simplestorage.sol
        var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"payable":false,"type":"constructor"}];

        var bytecode = "0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029";

        var simpleContract = web3.eth.contract(abi);
        var simple = simpleContract.new(42, {from:web3.eth.accounts[0], data: bytecode, gas: 0x47b760, privateFor: ["AeggpVlVsi+rxD6h9tcq/8qL/MsjyipUnkj1nvNPgTU="]}, function(e, contract) {
            if (e) {
                console.log("err creating contract", e);
            } else {
                if (!contract.address) {
                    console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
                } else {
                    console.log("Contract mined! Address: " + contract.address);
                    console.log(contract);
                }
            }
        });
        ```

    !!! attention "Unlock account"
        Geth accounts are locked by default. Unlock the account first before sending the transaction:

        ```bash
        geth attach new-node-1/geth.ipc
        ```

        Once connected in geth console, run:

        ```javascript
        eth.accounts
        ```

        List of the existing accounts is displayed:

        ```json
        ["0x23214cd88f46865207fa1d2a69971a37cdbf526a"]
        ```

        Unlock the account:

        ```javascript
        personal.unlockAccount("0x23214cd88f46865207fa1d2a69971a37cdbf526a");
        ```

        Type in your passphrase when asked for:

        ```text
        Unlock account 0x23214cd88f46865207fa1d2a69971a37cdbf526a
        Passphrase:
        ```

        If operation succeeded, result is:

        ```text
        true
        ```

    Load the contract script, deploy it on the blockain:

    ```javascript
    loadScript("private-contract.js")
    ```

    Result:

    ```text
    Contract transaction send: TransactionHash: 0x7d3bf7612ef10c71f752e881648b7c8c4eee3223acab151ee0652447790836a6 waiting to be mined...
    true
    Contract mined! Address: 0xe975e1e11c5268b1efcbf39b7ee3cf7b8dc85fd7
    ```

    Congratulations! You **successfully** sent a private transaction from node 1 to node 2!

    !!! note
        if you do not have a valid public key in the array in private-contract.js, you will see the following error when the script in loaded.

        ```text
        err creating contract Error: Non-200 status code: &{Status:400 Bad Request StatusCode:400 Proto:HTTP/1.1 ProtoMajor:1      ProtoMinor:1 Header:map[Date:[Mon, 17 Jun 2019 15:23:53 GMT] Content-Type:[text/plain] Content-Length:[73] Server:[Jetty(9.4.z-SNAPSHOT)]] Body:0xc01997a580 ContentLength:73 TransferEncoding:[] Close:false Uncompressed:false Trailer:map[] Request:0xc019788200 TLS:<nil>}
        ```

## Enabling permissioned configuration

GoQuorum ships with a permission system based on a custom whitelist.

Detailed documentation is available in [Network Permissioning](../Concepts/Permissioning/PermissionsOverview.md).
