---
description: `debug` namespace APIs
---

# Debug APIs

## APIs

### `debug_dumpAddress`

Retrieves the state of an address at a given block.

#### Parameters

* `address`: Account address of the state to retrieve.

* `blockNumber`: Integer representing a block number or one of the string tags `latest` (the last block mined) or `pending`
  (the last block mined plus pending transactions).

#### Returns

* state of the account address

!!! Example

    === "JSON RPC"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"debug_dumpAddress","params":["0xfff7ac99c8e4feb60c9750054bdc14ce1857f181", 10],"id":15}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result": {
            "balance": "49358640978154672",
            "code": "",
            "codeHash": "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
            "nonce": 2,
            "root": "56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
            "storage": {}
          }
        }
        ```

### `debug_privateStateRoot`

Returns the private state root hash at the specified block height.

#### Parameters

* `blockNumber`: Integer representing a block number or one of the string tags `latest` (the last block mined) or `pending`
  (the last block mined plus pending transactions).

#### Returns

* private state root hash at the specified block height

!!! Example

    === "JSON RPC"

        ```bash
        curl -X POST http://localhost:8545 --data '{"jsonrpc":"2.0","method":"debug_privateStateRoot","params":["latest"],"id":1}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":1,
          "result": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
        }
        ```

    === "geth console command"

        ```js
        > debug.privateStateRoot("latest")
        ```

    === "geth console result"

        ```js
        "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
        ```
