---
description: connecting to a node
---

# Connecting to a node

This tutorial shows you how to connect to a running node
Use the [Quorum Developer Quickstart](../../Tutorials/Quorum-Dev-Quickstart/Getting-Started.md) to rapidly generate a local blockchain network.

## Prerequisites

* The [quickstart](../../Tutorials/Quorum-Dev-Quickstart/Getting-Started.md) or
* A [private network](../../Tutorials/Private-Network/Create-IBFT-Network.md) or
* A [privacy-enabled network](../../Tutorials/Create-Privacy-enabled-network.md) 
    (public contracts can also be deployed on privacy-enabled networks).


## Interfaces to connect to
The Geth JavaScript console exposes the [Web3 JavaScript API](https://web3js.readthedocs.io/en/v1.2.9/) for development use, and is started
with the `console` or `attach` geth sub-commands. The `console` sub-commands starts the geth node and then opens the console, while the `attach`
subcommand attaches to the console to an already-running geth instance.

### 1. Using `geth attach`

The first way to connect to a running node is by running attach and connecting to the ipc socket

```bash
geth attach /path/to/geth.ipc
```

Other interfac methid is to connect to the RPC or Websocket API endpoint (if enabled):

```bash
geth attach http://host:8545  # connect over HTTP
geth attach ws://host:8546    # connect over websocket
```

Once connected you can execute commands as normal

    === "Result"

        ```text
        Welcome to the Geth JavaScript console!

        instance: Geth/node1-/v1.9.24-stable-d5ef77ca(quorum-v21.7.1)/linux-amd64/go1.15.5
        coinbase: 0x93917cadbace5dfce132b991732c6cda9bcc5b8a
        at block: 8 (Wed Oct 27 2021 03:36:02 GMT+0000 (UTC))
        datadir: /data
        modules: admin:1.0 debug:1.0 eth:1.0 istanbul:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

        To exit, press ctrl-d
        ```

    Check existing validators:

    === "geth console request"

        ```javascript
        istanbul.getValidators()
        ```

    === "JSON result"

        ```json
        ["0x27a97c9aaf04f18f3014c32e036dd0ac76da5f18", "0x93917cadbace5dfce132b991732c6cda9bcc5b8a", "0x98c1334496614aed49d2e81526d089f7264fed9c", "0xce412f988377e31f4d0ff12d74df73b51c42d0ca"]
        ```

    Exit the console:

    ```javascript
    exit
    ```


### 2. Using the RPC interface 

The first way to connect to


	json rpc, Authz/n of JSON-rpc, postman, curl	

### 3. Using the Websocket interface 

	Pub/sub API over ws	
