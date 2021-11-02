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

The next way to connect to a running node is by making HTTP REST requests on the RPC endpoint which is typically exposed on port 8545.  

To enable the RPC interface, a GoQuorum needs to be started with the following parameters:

```bash
   --http                           # Enable the HTTP-RPC server endpoint
   --http.addr localhost            # HTTP-RPC server listening interface (default: "localhost")
   --http.port 8545                 # HTTP-RPC server listening port (default: 8545)
   --http.corsdomain "localhost"    # Comma separated list of domains from which to accept cross origin requests (browser enforced)
   --http.vhosts "localhost"        # Comma separated list of virtual hostnames from which to accept requests (server enforced). Accepts '*' wildcard. 
   --http.api admin,db,...          # API's offered over the HTTP-RPC interface
```

GoQuorum supports the [standard web3 JSON-RPC API's](https://geth.ethereum.org/docs/rpc/server) as well as [custom methods](../../Reference/API-Methods.md)


For example to make a request to give you the list of validators at a given block:
!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://localhost:8545 --data '{"jsonrpc":"2.0","method":"istanbul_getValidators","params":[10],"id":1}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```JSON
        {
          "jsonrpc":"2.0",
          "id":1,
          "result": [
            "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7",
            "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
            "0xdc25ef3F5b8a186998338a2ada83795fba2d695"
          ]
        }
        ```

You can use your choice of tooling to make the request such as [curl](https://curl.se/), [Postman](https://www.postman.com/), [Web3](https://web3js.readthedocs.io/en/latest/) or equivalent. 


#### Securing JSON-RPC

JSON-RPC servers are secured using a [security plugin interface](../../Reference/Plugins/security/interface.md). The
[official implementation](https://github.com/ConsenSys/quorum-security-plugin-enterprise) enables the GoQuorum client to protect JSON-RPC APIs.

Security can be done via native Transport Layer Security (TLS) or via Enterprise authorization protocol integration eg
[OAuth 2.0](https://tools.ietf.org/html/rfc6749) or [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519). Please refer to the
[examples](../../HowTo/Use/JSON-RPC-API-Security.md) for connfiguration and usage details 


### 3. Using the Websocket interface 

Another way to connect to a running node is by making Websocket endpoint which is typically exposed on port 8546.  

To enable the WS interface, a GoQuorum needs to be started with the following parameters:

```bash
   --ws                           # Enable the WS-RPC server endpoint
   --ws.addr localhost            # WS-RPC server listening interface (default: "localhost")
   --ws.port 8545                 # WS-RPC server listening port (default: 8545)
   --ws.origins "localhost"       # Comma separated list of virtual hostnames from which to accept requests (server enforced). Accepts '*' wildcard. 
   --ws.api admin,db,...          # API's offered over the WS interface
   --ws.rpcprefix "/"             # Path prefix on which WS-RPC is served. Use '/' to serve on all paths.

```
Where the APIs supported are the same as that of the JSON-RPC API's above

For example to connecto to an endpoint and get logs you would run something similar to:
!!! example2

```javascript
    const Web3 = require('web3')
    var web3 = new Web3('wss://localhost:8546');
    var subscription = web3.eth.subscribe('logs', {
        address: '0x123456..',
        topics: ['0x12345...']
    }, function(error, result){
        if (!error)
            console.log(result);
    });
```
