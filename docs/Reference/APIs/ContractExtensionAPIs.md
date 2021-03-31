# Contract Extension APIs

## APIs

### `quorumExtension_extendContract`

Start the process of extending an existing private contract to a new participant by deploying a new extension management contract to the blockchain

#### Parameters

* `toExtend`: address of the private contract to extend
* `newRecipientPtmPublicKey`: the new participant's Private Transaction Manager (PTM) (for example, Tessera) public key
* `recipientAddress`: the new participant's Ethereum address - the participant will later need to approve the extension using this address
* `txArgs`: arguments for the transaction that deploys the extension management contract - `privateFor` must contain only the `newRecipientPtmPublicKey`

#### Returns

* hash of the creation transaction for the new extension management contract

!!!examples

    === "JSON RPC"
        Command:

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"quorumExtension_extendContract","params":["0x9aff347f193ca4560276c3322193224dcdbbe578","BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=","0xed9d02e382b34818e88b88a309c7fe71e65f419d",{"from":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","value":"0x0","privateFor":["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="],"privacyFlag":1}],"id":15}' --header "Content-Type: application/json"
        ```

        Response:

        ```json
        {"jsonrpc":"2.0","id":10,"result":"0xceffe8051d098920ac84e33b8a05c48180ed9b26581a6a06ce9874a1bf1502bd"}
        ```

    === "geth console"
        Command:

        ```javascript
        quorumExtension.extendContract("0x9aff347f193ca4560276c3322193224dcdbbe578", "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=", "0xed9d02e382b34818e88b88a309c7fe71e65f419d",{from: "0xca843569e3427144cead5e4d5999a3d0ccf92b8e", privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
        ```

        Response:

        ```json
        "0x9e0101dd215281b33989b3ae093147e9009353bb63f531490409a628c6e87310"
        ```

!!!error "Frequent issues"
    * It's impossible to extend a contract already being extended, the following error will be returned:

          ```text
          Error: contract extension in progress for the given contract address
          ```

    * You must execute `quorumExtension_extendContract` from the node who created the contract initially.
    * If the network is using [enhanced network permissioning](../../Concepts/Permissioning/Enhanced/EnhancedPermissionsOverview.md),
        then both initiator (the `from` address in `txArgs`) and receiver (`recipientAddress`)
        of the extension must be network or org admin accounts.

### `quorumExtension_approveExtension`

Submit an approval/denial vote to the specified extension management contract.

#### Parameters

* `addressToVoteOn`: address of the contract extension's management contract (this can be found using `quorumExtension_activeExtensionContracts`)
* `vote`: bool - `true` approves the extension process, `false` cancels the extension process.
* `txArgs`: arguments for the vote submission transaction - `privateFor` must contain the public key of the node that initiated the contract extension

#### Returns

* hash of the vote submission transaction

!!!examples

    === "JSON RPC"
        Command:

        ```js
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_approveExtension", "params":["0xb1c57951a2f3006910115eadf0f167890e99b9cb", true, {"from": "0xed9d02e382b34818e88b88a309c7fe71e65f419d", "privateFor":["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]}], "id":10}' --header "Content-Type: application/json"
        ```

        Response:

        ```json
        {"jsonrpc":"2.0","id":10,"result":"0x8d34a594b286087f45029daad2d5a8fd42f70abb0ae2492429a256a2ba4cb0dd"}
        ```

    === "geth console"
        Command:

        ```javascript
        quorumExtension.approveExtension("0xb1c57951a2f3006910115eadf0f167890e99b9cb", true ,{from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d", privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]})
        ```

        Response:

        ```json
        "0x9e0101dd215281b33989b3ae093147e9009353bb63f531490409a628c6e87310"
        ```

!!!error "Frequent issues"

    * If the contract is already under the process of extension, api call to extend it again will fail:

        ```text
        Error: contract extension in progress for the given contract address
        ```

    * The recipient can approve the extension only once.

        Executing `quorumExtension.approveExtension` once extension process is completed will result in the following error:

        ```text
        Error: contract extension process complete. nothing to accept
        ```

    * The approver (the `from` address in `txArgs`) must be the receiver of the extension (`recipientAddress` from `quorumExtension_extendContract`):

        ```text
        Error: account is not acceptor of this extension request
        ```

### `quorumExtension_cancelExtension`

Cancel an active contract extension. Can only be invoked by the initiator of the extension process.

#### Parameters

* `extensionContract`: address of the contract extension's management contract
* `txArgs`: arguments for the cancellation transaction

#### Returns

* hash of the cancellation transaction

!!!examples

    === "JSON RPC"
        Command:

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"quorumExtension_cancelExtension","params":["0x622aff909c081783613c9d3f5f4c47be78b310ac",{"from":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","value":"0x0","privateFor":["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="],"privacyFlag":1}],"id":63}' --header "Content-Type: application/json"
        ```

        Response:

        ```json
        {"jsonrpc":"2.0","id":10,"result":"0xb43da7dbeae5347df86c6933786b8c536b4622463b577a990d4c87214845d16a"}
        ```

    === "geth console"
        Command:

        ```javascript
        quorumExtension.cancelExtension("0x622aff909c081783613c9d3f5f4c47be78b310ac",{"from":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","value":"0x0","privateFor": ["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
        ```

        Response:

        ```json
        "0x9e0101dd215281b33989b3ae093147e9009353bb63f531490409a628c6e87310"
        ```

!!!error "Frequent issues"

    * The canceller must be the same as the initiator of the extension:

        `from` address in `txArgs` must be the same as the address of the initiator of the extension
        (the `from` address in `txArgs` for the `quorumExtension_extendContract` call)
        or it will result in the following error:

        ```text
        Error: account is not the creator of this extension request
        ```

### `quorumExtension_activeExtensionContracts`

List all active contract extensions involving this node (either as initiator or receiver).

#### Parameters

None

#### Returns

* `managementContractAddress`: address of the extension management contract
* `contractExtended`: address of the private contract getting extended
* `creationData`: PTM hash of creation data for extension management contract
* `initiator`: the contract extension initiator's Ethereum address
* `recipient`: the new participant's Ethereum address - the participant will later need to approve the extension using this address
* `recipientPtmKey`: the new participant's PTM public key

!!!examples

    === "JSON RPC"
        Command:

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_activeExtensionContracts", "id":10}' --header "Content-Type: application/json"
        ```

        Response:

        ```json
        "jsonrpc":"2.0","id":10,"result":[{"contractExtended":"0x027692c7ebdc81c590250e615ab571a0d14eff2d","initiator":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","recipient":"0x0fbdc686b912d7722dc86510934589e0aaf3b55a","managementContractAddress":"0xc4e9de0bd5e0a5fd55ef5d6f2b46eba930a694a3","RecipientPtmKey":"1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg=","creationData":"Zvo1Rnrfq4phIJbzKObyCBWSXTbEJGPOq5+jDCWccnPpA7K6OvIssCMLJ54f32uuEeczeVNC46QMk52lCOWbtg=="}]}
        ```

    === "geth console"
        Command:

        ```js
        quorumExtension.activeExtensionContracts
        ```

        Response:

        ```json
        [{
            RecipientPtmKey: "1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg=",
            contractExtended: "0x027692c7ebdc81c590250e615ab571a0d14eff2d",
            creationData: "Zvo1Rnrfq4phIJbzKObyCBWSXTbEJGPOq5+jDCWccnPpA7K6OvIssCMLJ54f32uuEeczeVNC46QMk52lCOWbtg==",
            initiator: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
            managementContractAddress: "0xc4e9de0bd5e0a5fd55ef5d6f2b46eba930a694a3",
            recipient: "0x0fbdc686b912d7722dc86510934589e0aaf3b55a"
        }]
        ```

### `quorumExtension_getExtensionStatus`

Get the status of a specific contract extension

#### Parameters

* address of extension management contract

#### Returns

* status of contract extension (`ACTIVE` or `DONE`)

!!!examples

    === "JSON RPC"
        Command:

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_getExtensionStatus", "params":["0x1349f3e1b8d71effb47b840594ff27da7e603d17"], "id":10}' --header "Content-Type: application/json"
        ```

        Response:

        ```json
        {"jsonrpc":"2.0","id":10,"result":"DONE"}
        ```

    === "geth console"
        Command:

        ```javascript
        quorumExtension.getExtensionStatus("0x1349f3e1b8d71effb47b840594ff27da7e603d17")
        ```

        Response:

        ```json
        "DONE"
        ```

*[PTM]: Private Transaction Manager (for example, Tessera)
