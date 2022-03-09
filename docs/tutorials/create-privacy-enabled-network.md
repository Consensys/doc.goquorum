---
description: Creating a network with privacy enabled
---

# Create a privacy-enabled network

This tutorial shows you how to create a privacy-enabled network.
The network uses [Tessera]({{ extra.othersites.tessera }}/), a private transaction manager,
to encrypt and distribute [private transactions](../concepts/privacy/index.md).

!!! important
    The steps in this tutorial create an isolated, but not protected or secure, Ethereum private
    network. We recommend running the private network behind a properly configured firewall.

## Prerequisites

* [Tessera](../deploy/install/binaries.md#release-binaries).
* [IBFT network as configured in IBFT tutorial](private-network/create-ibft-network.md). The nodes must not be
running.

## Steps

Listed on the right-hand side of the page are the steps to create a private network using IBFT
with 5 GoQuorum nodes and 2 Tessera nodes.

### 1. Create directories

Create directories for the 2 Tessera nodes in the `IBFT-Network` directory previously created.

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
├── Tessera-0
├── Tessera-1
```

### 2. Generate Tessera keys

In the `Tessera-0` directory, generate keys. Replace `<path-to-tessera>` with the path to Tessera.

```bash
java -jar /<path-to-tessera>/tessera.jar -keygen -filename tessera0
```

Press enter both times you are prompted for a password.

The private and public key are created in files called `tessera0.key` and `tessera0.pub`.

!!! caution
    In a production environment, ensure keys are secured appropriately.

### 3. Create configuration file

In the `Tessera-0` directory, create a configuration file called `config.json`. Copy and paste the
the configuration below into the file. On the highlighted lines, replace `<path to IBFT-network>`
with the path to your network.

```json hl_lines="6 19 44 45" linenums="1"
{
    "useWhiteList": false,
    "jdbc": {
        "username": "sa",
        "password": "",
        "url": "jdbc:h2:/<path to IBFT-network>/IBFT-network/Tessera-0/db1;MODE=Oracle;TRACE_LEVEL_SYSTEM_OUT=0",
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
            "serverAddress":"unix:/<path to IBFT-network>/IBFT-network/Tessera-0/tm.ipc",
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
                "privateKeyPath": "<path to IBFT-network>/IBFT-network/Tessera-0/tessera0.key",
                "publicKeyPath": "<path to IBFT-network>/IBFT-network/Tessera-0/tessera0.pub"
            }
        ]
    },
    "alwaysSendTo": []
}
```

### 4. Create Tessera-1 keys

In `Tessera-1`, generate keys in the same way as for `Tessera-0`. Replace `<path-to-tessera>` with
the path to Tessera.

```bash
java -jar /<path-to-tessera>/tessera.jar -keygen -filename tessera1
```

### 5. Create Tessera-1 configuration file

In the `Tessera-1` directory, create a configuration file called `config.json`. Copy and paste the
the configuration below into the file. Different ports are specified for Tessera 1. On the highlighted lines,
replace `<path to IBFT-network>` with the path to your network.

```json hl_lines="6 19 44 45" linenums="1"
{
    "useWhiteList": false,
    "jdbc": {
        "username": "sa",
        "password": "",
        "url": "jdbc:h2:/<path to IBFT-network>/IBFT-network/Tessera-1/db1;MODE=Oracle;TRACE_LEVEL_SYSTEM_OUT=0",
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
            "serverAddress":"unix:/<path to IBFT-network>/IBFT-network/Tessera-1/tm.ipc",
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
                "privateKeyPath": "<path to IBFT-network>/IBFT-network/Tessera-1/tessera1.key",
                "publicKeyPath": "<path to IBFT-network>/IBFT-network/Tessera-1/tessera1.pub"
            }
        ]
    },
    "alwaysSendTo": []
}
```

### 6. Start Tessera 0

In the `Tessera-0` directory, start Tessera 0. Replace `<path to tessera>` with the path to Tessera.

```bash
java -jar <path to Tessera>/tessera.jar -configfile config.json
```

### 7. Start Tessera 1

In the `Tessera-1` directory, start Tessera 1. Replace `<path to tessera>` with the path to Tessera.

```bash
java -jar <path to Tessera>/tessera.jar -configfile config.json
```

### 8. Start GoQuorum node 0

In the `Node-0` directory, start GoQuorum node 0 specifying the Tessera 0 node to attach to.
Replace `<path to IBFT network>` with the path to your network.

```bash
PRIVATE_CONFIG=/<path to IBFT network>/IBFT-network/Tessera-0/tm.ipc geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 127.0.0.1 --http.port 22000 --http.api admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30300 --allow-insecure-unlock
```

!!! caution
    The `--allow-insecure-unlock` option enables insecure account unlocking for educational purposes
    only. In production environments, ensure account keys are secured appropriately.

### 9. Start GoQuorum node 1

In the `Node-1` directory, start GoQuorum node 1 specifying the Tessera 1 node to attach to.
Replace `<path to IBFT network>` with the path to your network.

```bash
PRIVATE_CONFIG=/<path to IBFT network>/IBFT-network/Tessera-1/tm.ipc geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 127.0.0.1 --http.port 22001 --http.api admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30301
```

### 10. Start nodes 2, 3, and 4

In new terminal for each node in each node directory, start the remaining nodes using the same command
as in the IBFT tutorial. Nodes 2, 3, and 4 do not have an attached Tessera node.

=== "Node 2"
    ```bash
    PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 127.0.0.1 --http.port 22002 --http.api admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30302
    ```

=== "Node 3"
    ```bash
    PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 127.0.0.1 --http.port 22003 --http.api admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30303
    ```

=== "Node 4"
    ```bash
    PRIVATE_CONFIG=ignore geth --datadir data --nodiscover --istanbul.blockperiod 5 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 10 --http --http.addr 127.0.0.1 --http.port 22004 --http.api admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --emitcheckpoints --port 30304
    ```

Your node can now [send and receive private transactions](send-private-transaction.md).
