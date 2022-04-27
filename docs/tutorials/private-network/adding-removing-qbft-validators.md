---
description: Adding and removing QBFT validators
---

# Add and remove QBFT validators

## Prerequisites

A QBFT network as configured in the [QBFT tutorial](create-qbft-network.md).

## Add a validator

1. Create a working directory for the new node that needs to be added:

    ```bash
    mkdir -p Node-5/data/keystore
    ```

1. In the `artifacts` directory, generate one new validator using the
    [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool):

    ```bash
    npx quorum-genesis-tool \
    --validators 1 \
    --members 0 \
    --bootnodes 0 \
    --outputPath artifacts
    ```

1. Copy the latest generated artifacts:

    ```bash
    cd artifacts/2022-04-21-08-10-29/validator0
    cp nodekey* address ../../../Node-5/data
    cp account* ../../../Node-5/data/keystore
    ```

1. Copy the address of the validator and propose it from more than half the number of current validators.

    Attach a `geth` console to the node:

    === "geth attach"

        ```bash
        cd ..
        geth attach node0/data/geth.ipc
        ```

    === "Result"

        ```text
        Welcome to the Geth JavaScript console!

        instance: Geth/v1.8.18-stable-bb88608c(quorum-v2.2.3)/darwin-amd64/go1.10.2
        coinbase: 0x4c1ccd426833b9782729a212c857f2f03b7b4c0d
        at block: 137 (Tue, 11 Jun 2019 16:32:47 BST)
        datadir: /Users/username/fromscratchistanbul/node0/data
        modules: admin:1.0 debug:1.0 eth:1.0 istanbul:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
        ```

    Check existing validators:

    === "geth console request"

        ```javascript
        istanbul.getValidators()
        ```

    === "JSON result"

        ```json
        ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
        ```

    Propose the new validator using the command [`istanbul.propose(<address>, true)`](../../reference/api-methods.md#istanbul_propose)
    with `<address>` replaced by the new validator candidate node address:

    === "geth console request"

        ```javascript
        istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",true)
        ```

    === "JSON result"

        ```json
        null
        ```

    Exit the console:

    ```javascript
    exit
    ```

    Repeat the proposal process for this candidate node by connecting your `geth` console to node 1, node 2, and node 3.

    !!! note

        To drop a currently running validator candidate and stop further votes from being cast either for or against it, use
        [`istanbul.discard`](../../reference/api-methods.md#istanbul_discard).

1. Verify that the new validator is now in the list of validators by running [`istanbul.getValidators`](../../reference/api-methods.md#istanbul_getvalidators)
  in a `geth` console attached to any of your nodes:

    === "geth console request"

        ```javascript
        istanbul.getValidators()
        ```

    === "JSON result"

        ```json
        ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
        ```

    The list of validators contains six addresses now.

1. Copy `static-nodes.json` and `genesis.json` from the existing chain, placing `static-nodes.json` into the new node's
  data directory:

    ```bash
    cd node5
    cp ../node0/static-nodes.json data
    cp ../node0/genesis.json data
    ```

1. Edit `static-nodes.json` and add the new validator's node info to the end of the file.

    The new validator's node info can be retrieved from the output of `qbft setup --num 1 --verbose --quorum --save` in step 2.
    Update the IP address and port of the node info to match the IP address of the validator and port you want to use.

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

1. Initialize the new node with the following command:

    === "geth command"

        ```bash
        geth --datadir data init data/genesis.json
        ```

    === "Result"

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

1. In the `Node-5` directory, start the first node:

    ```bash
    export ADDRESS=$(grep -o '"address": *"[^"]*"' ./data/keystore/accountKeystore | grep -o '"[^"]*"$' | sed 's/"//g')
    export PRIVATE_CONFIG=ignore
    geth --datadir data \
        --networkid 1337 --nodiscover --verbosity 5 \
        --syncmode full --nousb \
        --istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints \
        --http --http.addr 127.0.0.1 --http.port 22005 --http.corsdomain "*" --http.vhosts "*" \
        --ws --ws.addr 127.0.0.1 --ws.port 32005 --ws.origins "*" \
        --http.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul,qbft \
        --ws.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul,qbft \
        --unlock ${ADDRESS} --allow-insecure-unlock --password ./data/keystore/accountPassword \
        --port 30305
    ```

1. Check that node 5 is validator:

    ```bash
    geth attach http://localhost:22005
    ```

    ```bash
    > istanbul.isValidator()
    true
    ```

## Remove a validator

1. Attach a `geth` console to a running validator, run [`istanbul.getValidators`](../../reference/api-methods.md#istanbul_getvalidators),
  and identify the address of the validator that needs to be removed:

    === "geth attach"

        ```bash
        geth attach node0/data/geth.ipc
        ```

    === "Result"

        ```text
        Welcome to the Geth JavaScript console!

        instance: Geth/v1.8.18-stable-bb88608c(quorum-v2.2.3)/darwin-amd64/go1.10.2
        coinbase: 0xc1056df7c02b6f1a353052eaf0533cc7cb743b52
        at block: 181 (Tue, 11 Jun 2019 16:36:27 BST)
        datadir: /Users/username/fromscratchistanbul/node0/data
        modules: admin:1.0 debug:1.0 eth:1.0 istanbul:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
        ```

    Run `istanbul.getValidators`:

    === "geth console request"

        ```javascript
        istanbul.getValidators()
        ```

    === "JSON result"

        ```json
        ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
        ```

    We will remove `0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1` from the validator list in this tutorial.

1. Run [`istanbul.propose(<address>, false)`](../../reference/api-methods.md#istanbul_propose) by passing
  the address of the validator that needs to be removed from more than half of the current validators:

    === "geth console request"

        ```javascript
        istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",false)
        ```

    === "JSON result"

        ```json
        null
        ```

    Repeat `istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",false)` for node 1, node 2, and node 3.

1. Verify that the validator has been removed by running [`istanbul.getValidators`](../../reference/api-methods.md#istanbul_getvalidators)
  in one of the nodes' attached `geth` console:

    === "geth console request"

        ```javascript
        istanbul.getValidators()
        ```

    === "JSON result"

        ```json
        ["0x189d23d201b03ae1cf9113672df29a5d672aefa3", "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6", "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d", "0x7ae555d0f6faad7930434abdaac2274fd86ab516", "0xc1056df7c02b6f1a353052eaf0533cc7cb743b52"]
        ```

    The validator `0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1` was removed and the validators list now only has five addresses.

1. Check that node 5 is not validator:

    ```bash
    geth attach http://localhost:22005
    ```

    ```bash
    > istanbul.isValidator()
    false
    ```

1. Stop the `geth` process corresponding to the validator that was removed:

    === "Command"

        ```bash
        ps
        ```

    === "Result"

        ```text
          PID TTY           TIME CMD
        10554 ttys000    0:00.11 -bash
        21829 ttys001    0:00.03 -bash
        9125  ttys002    0:00.94 -bash
        36432 ttys002    0:31.93 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 0.0.0.0 --http.port 22000 --http.api admin,
        36433 ttys002    0:30.75 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 0.0.0.0 --http.port 22001 --http.api admin,
        36434 ttys002    0:31.72 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 0.0.0.0 --http.port 22002 --http.api admin,
        36435 ttys002    0:31.65 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 0.0.0.0 --http.port 22003 --http.api admin,
        36436 ttys002    0:31.63 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 0.0.0.0 --http.port 22004 --http.api admin,
        36485 ttys002    0:06.86 geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 0.0.0.0 --http.port 22005 --http.api admin,
        36455 ttys003    0:00.05 -bash
        36493 ttys003    0:00.22 geth attach node4/data/geth.ipc
        ```

    Kill the `geth` process that uses port `22005`, corresponding to node 5 as indicated in `start5.sh`:

    ```bash
    kill 36485
    ```

## Add a non-validator node

Same instructions as [adding a validator](#add-a-validator) excluding step 4, which proposes the node as validator.

## Remove a non-validator node

Just execute step 5 from [removing a validator](#remove-a-validator).
