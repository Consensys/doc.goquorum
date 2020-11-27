---
description: Creating a network with privacy enabled
---

# Create a privacy-enabled network

The private network uses [Tessera](https://docs.tessera.consensys.net/), a private transaction manager,
to encrpyt and distribute [private transactions](../Concepts/Privacy/Privacy.md).

!!!important

    The steps in this tutorial create an isolated, but not protected or secure, Ethereum private
    network. We recommend running the private network behind a properly configured firewall.

## Prerequisites

* [Tessera](../HowTo/GetStarted/Install.md#as-release-binaries).
* [IBFT network as configured in IBFT tutorial](Create-IBFT-Network.md).

### Steps

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

1. Create a `new-node-1t/config.json` configuration file with newly generated keys referenced:

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

    Create a `new-node-2t/config.json` configuration file with newly generated keys referenced and
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

    Advertised public node key is in the `new-node-1.pub` file.

    Tessera offers a lot of configuration flexibility, please refer to the [Tessera documentation site configuration section](https://docs.tessera.consensys.net/HowTo/Configure/Tessera/) for complete and up to date configuration options.

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
