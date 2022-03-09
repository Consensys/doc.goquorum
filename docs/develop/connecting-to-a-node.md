---
description: connecting to a node
---

# Connect to a node

## Prerequisites

Set up a GoQuorum network using one of the following tutorials:

* The [Quorum Developer Quickstart](../tutorials/quorum-dev-quickstart/index.md)
* [Create a private network](../tutorials/private-network/create-ibft-network.md)
* [Create a privacy-enabled network](../tutorials/create-privacy-enabled-network.md)

## Use `geth attach`

The Geth JavaScript console exposes the [Web3 JavaScript API](https://web3js.readthedocs.io/en/v1.2.9/) for development
use, and can be started using the `console` or `attach` Geth subcommands.
The `console` subcommand starts the Geth node and opens the console, while the `attach` subcommand attaches an
already-running Geth instance to the console.

Run the `attach` subcommand and connect to the IPC socket, or, if enabled, to the RPC or WebSocket API endpoints:

!!! example "`geth attach`"

    === "IPC socket"

        ```bash
        geth attach /path/to/geth.ipc
        ```

    === "RPC API endpoint"

        ```bash
        geth attach http://host:8545  # connect over HTTP
        ```

    === "WebSocket API endpoint"

        ```bash
        geth attach ws://host:8546    # connect over websocket
        ```

    === "Geth console result"

        ```text
        Welcome to the Geth JavaScript console!

        instance: Geth/node1-/v1.9.24-stable-d5ef77ca(quorum-v21.7.1)/linux-amd64/go1.15.5
        coinbase: 0x93917cadbace5dfce132b991732c6cda9bcc5b8a
        at block: 8 (Wed Oct 27 2021 03:36:02 GMT+0000 (UTC))
        datadir: /data
        modules: admin:1.0 debug:1.0 eth:1.0 istanbul:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

        To exit, press ctrl-d
        ```

Once connected you can execute commands as normal.
For example, check existing validators using the following command:

!!! example "`istanbul.getValidators`"

    === "Geth console request"

        ```javascript
        istanbul.getValidators()
        ```

    === "JSON result"

        ```json
        ["0x27a97c9aaf04f18f3014c32e036dd0ac76da5f18", "0x93917cadbace5dfce132b991732c6cda9bcc5b8a", "0x98c1334496614aed49d2e81526d089f7264fed9c", "0xce412f988377e31f4d0ff12d74df73b51c42d0ca"]
        ```

Exit the console using the following command:

```javascript
exit
```

## Use the RPC interface

You can connect to a running node by making HTTP REST requests on the RPC endpoint, which is exposed on port 8545 by default.

To enable the RPC interface, start the GoQuorum node with the following parameters:

```bash
--http                           # Enable the HTTP-RPC server endpoint
--http.addr localhost            # HTTP-RPC server listening interface (default: "localhost")
--http.port 8545                 # HTTP-RPC server listening port (default: 8545)
--http.corsdomain "localhost"    # Comma-separated list of domains from which to accept cross origin requests (browser enforced)
--http.vhosts "localhost"        # Comma-separated list of virtual hostnames from which to accept requests (server enforced). Accepts '*' wildcard.
--http.api admin,db,...          # APIs offered over the HTTP-RPC interface
```

GoQuorum supports the [standard web3 JSON-RPC APIs](https://geth.ethereum.org/docs/rpc/server) and [custom methods](../reference/api-methods.md).

For example, run the following command to get the list of validators at a given block in an IBFT or QBFT network:

!!! example "`istanbul_getValidators`"

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

You can any tool to make requests, such as [curl](https://curl.se/), [Postman](https://www.postman.com/), or
[Web3](https://web3js.readthedocs.io/en/latest/).

!!! note
    Use the [security plugin](../develop/json-rpc-apis.md) to secure the JSON-RPC server.

## Use the WebSocket interface

You can connect to a running node using a WebSocket endpoint, which is exposed on port 8546 by default.

To enable the WebSocket interface, start the GoQuorum node with the following parameters:

```bash
--ws                           # Enable the WS-RPC server endpoint
--ws.addr localhost            # WS-RPC server listening interface (default: "localhost")
--ws.port 8545                 # WS-RPC server listening port (default: 8545)
--ws.origins "localhost"       # Comma separated list of virtual hostnames from which to accept requests (server enforced). Accepts '*' wildcard
--ws.api admin,db,...          # APIs offered over the WS interface
--ws.rpcprefix "/"             # Path prefix on which WS-RPC is served. Use '/' to serve on all paths.
```

For example, to connect to an endpoint and get logs, run the following JavaScript:

!!! example "`eth.subscribe`"

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
