---
description: GoQuorum JSON-RPC API methods reference
---

# GoQuorum API methods

This reference describes the GoQuorum JSON-RPC API methods.

!!! important

    GoQuorum is based on [Geth Go Ethereum client](https://geth.ethereum.org/) but only the GoQuorum-specific API methods are listed here. Visit the
    [Go Ethereum documentation](https://geth.ethereum.org/docs/rpc/server) to view the Geth API methods.

## Contract Extension methods

### `quorumExtension_extendContract`

Starts the process of extending an existing private contract to a new participant by deploying a new extension
management contract to the blockchain.

#### Parameters

* `toExtend`: *string* - address of the private contract to extend

* `newRecipientPtmPublicKey`: *string* - new participant's Tessera public key

* `recipientAddress`: *string* - new participant's Ethereum address; the participant must later approve the extension using
  this address.

* `txArgs`: *object* - arguments for the transaction that deploys the extension management contract; `privateFor` must contain
  only the `newRecipientPtmPublicKey`.

#### Returns

`result`: *data* - hash of the creation transaction for the new extension management contract

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"quorumExtension_extendContract","params":["0x9aff347f193ca4560276c3322193224dcdbbe578","BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=","0xed9d02e382b34818e88b88a309c7fe71e65f419d",{"from":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","value":"0x0","privateFor":["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="],"privacyFlag":1}],"id":15}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"0xceffe8051d098920ac84e33b8a05c48180ed9b26581a6a06ce9874a1bf1502bd"
        }
        ```

    === "geth console request"

        ```javascript
        quorumExtension.extendContract("0x9aff347f193ca4560276c3322193224dcdbbe578", "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=", "0xed9d02e382b34818e88b88a309c7fe71e65f419d",{from: "0xca843569e3427144cead5e4d5999a3d0ccf92b8e", privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
        ```

    === "geth console result"

        ```json
        "0xceffe8051d098920ac84e33b8a05c48180ed9b26581a6a06ce9874a1bf1502bd"
        ```

!!! error "Frequent issues"

    * If you attempt to extend a contract in the process of being extended, the following error is returned:

          ```text
          Error: contract extension in progress for the given contract address
          ```

    * You must execute `quorumExtension_extendContract` from the node that initially created the contract.

    * If the network is using
      [enhanced network permissioning](../Concepts/Permissioning/Enhanced/EnhancedPermissionsOverview.md), then both
      initiator (the `from` address in `txArgs`) and receiver (`recipientAddress`) of the extension must be network or
      org admin accounts.

### `quorumExtension_approveExtension`

Submits an approval/denial vote to the specified extension management contract.

#### Parameters

* `addressToVoteOn`: *string* - address of the contract extension's management contract (this can be found using
  [`quorumExtension_activeExtensionContracts`](#quorumextension_activeextensioncontracts))

* `vote`: *boolean* - `true` approves the extension process, `false` cancels the extension process

* `txArgs`: *object* - arguments for the vote submission transaction; `privateFor` must contain the public key of the node that
  initiated the contract extension.

#### Returns

`result`: *data* - hash of the vote submission transaction

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_approveExtension","params":["0xb1c57951a2f3006910115eadf0f167890e99b9cb",true,{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","privateFor":["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"0x8d34a594b286087f45029daad2d5a8fd42f70abb0ae2492429a256a2ba4cb0dd"
        }
        ```

    === "geth console request"

        ```javascript
        quorumExtension.approveExtension("0xb1c57951a2f3006910115eadf0f167890e99b9cb",true,{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","privateFor":["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]})
        ```

    === "geth console result"

        ```json
        "0x8d34a594b286087f45029daad2d5a8fd42f70abb0ae2492429a256a2ba4cb0dd"
        ```

!!! error "Frequent issues"

    * If you attempt to extend a contract in the process of being extended, the following error is returned:

        ```text
        Error: contract extension in progress for the given contract address
        ```

    * The recipient can approve the extension only once.
      Executing `quorumExtension.approveExtension` once the extension process is completed results in the
      following error:

        ```text
        Error: contract extension process complete. nothing to accept
        ```

    * The approver (the `from` address in `txArgs`) must be the receiver of the extension (`recipientAddress` from
      `quorumExtension_extendContract`):

        ```text
        Error: account is not acceptor of this extension request
        ```

### `quorumExtension_cancelExtension`

Cancels the specified active contract extension.
This can only be invoked by the initiator of the extension process.

#### Parameters

* `extensionContract`: *string* - address of the contract extension's management contract

* `txArgs`: *object* - arguments for the cancellation transaction

#### Returns

`result`: *data* - hash of the cancellation transaction

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"quorumExtension_cancelExtension","params":["0x622aff909c081783613c9d3f5f4c47be78b310ac",{"from":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","value":"0x0","privateFor":["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="],"privacyFlag":1}],"id":63}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"0xb43da7dbeae5347df86c6933786b8c536b4622463b577a990d4c87214845d16a"
        }
        ```

    === "geth console request"

        ```javascript
        quorumExtension.cancelExtension("0x622aff909c081783613c9d3f5f4c47be78b310ac",{"from":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","value":"0x0","privateFor":["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
        ```

    === "geth console result"

        ```json
        "0xb43da7dbeae5347df86c6933786b8c536b4622463b577a990d4c87214845d16a"
        ```

!!! error "Frequent issues"

    * The canceller (`from` address in `txArgs`) must be the same as the initiator of the extension (the `from` address
      in `txArgs` for the [`quorumExtension_extendContract`](#quorumextension_extendcontract) call) or the following
      error is returned:

        ```text
        Error: account is not the creator of this extension request
        ```

### `quorumExtension_activeExtensionContracts`

Lists all active contract extensions involving this node (either as initiator or receiver).

#### Parameters

None

#### Returns

`result`: *array* of *objects* - list of contract extension objects with the following fields:

* `managementContractAddress`: *string* - address of the extension management contract

* `contractExtended`: *string* - address of the private contract getting extended

* `creationData`: *data* - Tessera hash of creation data for extension management contract

* `initiator`: *string* - contract extension initiator's Ethereum address

* `recipient`: *string* - new participant's Ethereum address; the participant must later approve the extension using this address.

* `recipientPtmKey`: *string* - new participant's Tessera public key

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_activeExtensionContracts","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result": [{
            "managementContractAddress":"0xc4e9de0bd5e0a5fd55ef5d6f2b46eba930a694a3",
            "contractExtended":"0x027692c7ebdc81c590250e615ab571a0d14eff2d",
            "creationData":"Zvo1Rnrfq4phIJbzKObyCBWSXTbEJGPOq5+jDCWccnPpA7K6OvIssCMLJ54f32uuEeczeVNC46QMk52lCOWbtg==",
            "initiator":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
            "recipient":"0x0fbdc686b912d7722dc86510934589e0aaf3b55a",
            "recipientPtmKey":"1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="
          }]
        }
        ```

    === "geth console request"

        ```javascript
        quorumExtension.activeExtensionContracts
        ```

    === "geth console result"

        ```json
        [{
          "managementContractAddress":"0xc4e9de0bd5e0a5fd55ef5d6f2b46eba930a694a3",
          "contractExtended":"0x027692c7ebdc81c590250e615ab571a0d14eff2d",
          "creationData":"Zvo1Rnrfq4phIJbzKObyCBWSXTbEJGPOq5+jDCWccnPpA7K6OvIssCMLJ54f32uuEeczeVNC46QMk52lCOWbtg==",
          "initiator":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
          "recipient":"0x0fbdc686b912d7722dc86510934589e0aaf3b55a",
          "recipientPtmKey":"1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="
        }]
        ```

### `quorumExtension_getExtensionStatus`

Retrieves the status of the specified contract extension.

#### Parameters

`managementContractAddress`: *string* - address of the extension management contract

#### Returns

`result`: *string* - status of contract extension (`ACTIVE` or `DONE`)

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_getExtensionStatus","params":["0x1349f3e1b8d71effb47b840594ff27da7e603d17"],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"DONE"
        }
        ```

    === "geth console request"

        ```javascript
        quorumExtension.getExtensionStatus("0x1349f3e1b8d71effb47b840594ff27da7e603d17")
        ```

    === "geth console result"

        ```json
        "DONE"
        ```

## Debug methods

### `debug_dumpAddress`

Retrieves the state of an address at the specified block number.

#### Parameters

* `address`: *string* - account address of the state to retrieve

* `blockNumber`: *number* - integer representing a block number or one of the string tags `latest` (the last block mined) or `pending`
  (the last block mined plus pending transactions)

#### Returns

`result`: *object* - state of the account address

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"debug_dumpAddress","params":["0xfff7ac99c8e4feb60c9750054bdc14ce1857f181",10],"id":15}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result": {
            "balance":"49358640978154672",
            "code":"",
            "codeHash":"c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
            "nonce":2,
            "root":"56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
            "storage":{}
          }
        }
        ```

### `debug_privateStateRoot`

Returns the private state root hash at the specified block number.

#### Parameters

* `blockNumber`: *number* - integer representing a block number or one of the string tags `latest` (the last block
  mined) or `pending` (the last block mined plus pending transactions).

#### Returns

`result`: *data* - private state root hash

!!! Example

    === "curl HTTP request"

        ```bash
        curl -X POST http://localhost:8545 --data '{"jsonrpc":"2.0","method":"debug_privateStateRoot","params":["latest"],"id":1}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":1,
          "result":"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
        }
        ```

    === "geth console command"

        ```js
        debug.privateStateRoot("latest")
        ```

    === "geth console result"

        ```js
        "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
        ```

## IBFT methods

To use the IBFT API:

1. Run Istanbul `geth` with `--rpcapi "istanbul"`.

2. Run `geth attach`.

### `istanbul.candidates`

Returns the current candidates which the node tries to vote in or out.

#### Parameters

None

#### Returns

`result`: *map* of *strings* to *booleans* - current candidates map

!!! example "`geth` console request"

        ```js
        istanbul.candidates
        ```

### `istanbul.discard`

Drops a currently running candidate, stopping the validator from casting further votes (either for or against).

#### Parameters

`address`: *string* - address of the candidate

!!! example "`geth` console request"

        ```js
        istanbul.discard(address)
        ```

### `istanbul.getSnapshot`

Retrieves the state snapshot at the specified block number.

#### Parameters

`blockNumber`: *number* or *string* - integer representing a block number, the string tag `latest` (the last block
mined), or `nil` (same as `latest`)

#### Returns

`result`: *object* - snapshot object

!!! example "`geth` console request"

    ```js
    istanbul.getSnapshot(blockNumber)
    ```

### `istanbul.getSnapshotAtHash`

Retrieves the state snapshot at the specified block hash.

#### Parameters

`blockHash`: *string* - block hash

#### Returns

`result`: *object* - snapshot object

!!! example "`geth` console request"

    ```js
    istanbul.getSnapshotAtHash(blockHash)
    ```

### `istanbul.getValidators`

Retrieves the list of authorized validators at the specified block number.

#### Parameters

`blockNumber`: *number* or *string* - integer representing a block number, the string tag `latest` (the last block
mined), or `nil` (same as `latest`)

#### Returns

`result`: *array* of *strings* - list of validator addresses

!!! example "`geth` console request"

    ```js
    istanbul.getValidators(blockNumber)
    ```

### `istanbul.getValidatorsAtHash`

Retrieves the list of authorized validators at the specified block hash.

#### Parameters

`blockHash`: *string* - block hash

#### Returns

`result`: *array* of *strings* - list of validator addresses

!!! example "`geth` console request"

    ```js
    istanbul.getValidatorsAtHash(blockHash)
    ```

### `istanbul.propose`

Injects a new authorization candidate that the validator attempts to push through.
If a majority of the validators vote the candidate in/out, the candidate is added/removed in the validator set.

#### Parameters

* `address`: *string* - address of candidate

* `auth`: *boolean* - `true` votes the candidate in and `false` votes out

!!! example "`geth` console request"

    ```js
    istanbul.propose(address, auth)
    ```

### `istanbul.nodeAddress`

Retrieves the public address that is used to sign proposals, which is derived from the node's `nodekey`.

#### Parameters

None

#### Returns

`result`: *string* - node's public signing address

!!! example "`geth` console request"

    ```js
    istanbul.nodeAddress()
    ```

### `istanbul.getSignersFromBlock`

Retrieves the public addresses whose seals are included in the specified block number.
This means that they participated in the consensus for this block and attested to its validity.

#### Parameters

`blockNumber`: *number* - (optional) block number to retrieve; defaults to current block

#### Returns

`result`: *object* - result object with the following fields:

* `number`: *number* - retrieved block's number

* `hash`: *string* - retrieved block's hash

* `author`: *string* - address of the block proposer

* `committers`: *array* of *strings* - list of all addresses whose seal appears in this block

!!! example "`geth` console request"

    ```js
    istanbul.getSignersFromBlock(blockNumber)
    ```

### `istanbul.getSignersFromBlockByHash`

Retrieves the public addresses whose seals are included in the specified block number.
This means that they participated in the consensus for this block and attested to its validity.

#### Parameters

`blockHash`: *string* - hash of the block to retrieve (required)

#### Returns

`result`: *object* - result object with the following fields:

* `number`: *number* - retrieved block's number

* `hash`: *string* - retrieved block's hash

* `author`: *string* - address of the block proposer

* `committers`: *array* of *strings* - list of all addresses whose seal appears in this block

!!! example "`geth` console request"

    ```js
    istanbul.getSignersFromBlockByHash(blockHash)
    ```

### `istanbul.status`

Returns the signing status of blocks for the specified block range.

#### Parameters

* `startBlockNumber`: *number* - start block number

* `endBlockNumber`: *number* - end block number

If the start block and end block numbers are not provided, the status of the last 64 blocks is returned.

#### Returns

`result`: *object* - result object with the following fields:

* `numBlocks`: *number* - number of blocks for which sealer activity is retrieved

* `sealerActivity`: *map* of *strings* to *numbers* - key is the validator and value is the number of blocks sealed by
  the validator

!!! example "`geth` console request"

    ```js
    istanbul.status(startBlockNumber,endBlockNumber)
    ```

### `istanbul.isValidator`

Indicates if this node is the validator for the specified block number.

#### Parameters

`blockNumber`: *number* - (optional) block number; defaults to latest block number

#### Returns

`result`: *boolean* - `true` if this node is the validator for the given `blockNumber`, otherwise `false`

!!! example "`geth` console request"

    ```js
    istanbul.isValidator(blockNumber)
    ```

## Permission methods

### `quorumPermission_orgList`

Returns a list of all organizations with the status of each organization in the network.

#### Parameters

None

#### Returns

`result`: *array* of *objects* - list of organization objects with the following fields:

* `fullOrgId`: *string* - complete organization ID including the all parent organization IDs separated by `.`

* `level`: *number* - level of the organization in the organization hierarchy

* `orgId`: *string* - organization ID

* `parentOrgId`: *string* - immediate parent organization ID

* `status`: *number* - [organization status](Permissioning-Types.md#organization-status-types)

* `subOrgList`: *array* of *strings* - list of sub-organizations linked to the organization

* `ultimateParent`: *string* - master organization under which the organization falls

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_orgList","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":51,
          "result": [{
            "fullOrgId":"INITORG",
            "level":1,
            "orgId":"INITORG",
            "parentOrgId":"",
            "status":2,
            "subOrgList":null,
            "ultimateParent":"INITORG"
          }]
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.orgList
        ```

    === "geth console result"

        ```json
        [{
          "fullOrgId":"INITORG",
          "level":1,
          "orgId":"INITORG",
          "parentOrgId":"",
          "status":2,
          "subOrgList":null,
          "ultimateParent":"INITORG"
        }]
        ```

### `quorumPermission_acctList`

Returns a list of permissioned accounts in the network.

#### Parameters

None

#### Returns

`result`: *array* of *objects* - list of permissioned account objects with the following fields:

* `acctId`: *string* - account ID

* `isOrgAdmin`: *boolean* - indicates if the account is admin account for the organization

* `orgId`: *string* - organization ID

* `roleId`: *string* - role assigned to the account

* `status`: *number* - [account status](Permissioning-Types.md#account-status-types)

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_acctList","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":53,
          "result": [{
            "acctId":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
            "isOrgAdmin":true,
            "orgId":"INITORG",
            "roleId":"NWADMIN",
            "status":2
          }, {
            "acctId":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
            "isOrgAdmin":true,
            "orgId":"INITORG",
            "roleId":"NWADMIN",
            "status":2
          }]
        }
        ```

        === "geth console request"

        ```javascript
        quorumPermission.acctList
        ```

        === "geth console result"

        ```json
        [{
          "acctId":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
          "isOrgAdmin":true,
          "orgId":"INITORG",
          "roleId":"NWADMIN",
          "status":2
        }, {
          "acctId":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
          "isOrgAdmin":true,
          "orgId":"INITORG",
          "roleId":"NWADMIN",
          "status":2
        }]
        ```

### `quorumPermission_nodeList`

Returns a list of permissioned nodes in the network.

#### Parameters

None

#### Returns

`result`: *array* of *objects* - list of permissioned node objects with the following fields:

* `orgId`: *string* - organization ID to which the node belongs

* `status`: *number* - [node status](Permissioning-Types.md#node-status-types)

* `url`: *string* - complete enode ID

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_nodeList","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":53,
          "result": [{
            "orgId":"INITORG",
            "status":2,
            "url":"enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0"
          }, {
            "orgId":"INITORG",
            "status":2,
            "url":"enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0"
          }, {
            "orgId":"INITORG",
            "status":2,
            "url":"enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0"
          }, {
            "orgId":"INITORG",
            "status":2,
            "url":"enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
          }]
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.nodeList
        ```

    === "geth console result"

        ```json
        [{
          "orgId":"INITORG",
          "status":2,
          "url":"enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0"
        }, {
          "orgId":"INITORG",
          "status":2,
          "url":"enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0"
        }, {
          "orgId":"INITORG",
          "status":2,
          "url":"enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0"
        }, {
          "orgId":"INITORG",
          "status":2,
          "url":"enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
        }]
        ```

### `quorumPermission_roleList`

Returns a list of roles in the network.

#### Parameters

None

#### Returns

`result`: *array* of *objects* - list of role objects with the following fields:

* `access`: *number* - [account access](Permissioning-Types.md#account-access-types)

* `active`: *boolean* - indicates if the role is active or not

* `isAdmin`: *boolean* - indicates if the role is organization admin role

* `isVoter`: *boolean* - indicates if the role is enabled for voting - applicable only for network admin role

* `orgId`: *string* - organization ID to which the role is linked

* `roleId`: *string* - unique role ID

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_roleList","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":1,
          "result": [{
            "access":3,
            "active":true,
            "isAdmin":true,
            "isVoter":true,
            "orgId":"INITORG",
            "roleId":"NWADMIN"
          }]
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.roleList
        ```

    === "geth console result"

        ```json
        [{
          "access":3,
          "active":true,
          "isAdmin":true,
          "isVoter":true,
          "orgId":"INITORG",
          "roleId":"NWADMIN"
        }]
        ```

### `quorumPermission_getOrgDetails`

Returns lists of accounts, nodes, roles, and sub-organizations linked to the specified organization.

#### Parameters

`orgId`: *string* - organization or sub-organization ID

#### Returns

`result`: *object* - result object with the following fields:

* `acctList`: *array* of *objects* - list of account objects

* `nodeList`: *array* of *objects* - list of node objects

* `roleList`: *array* of *objects* - list of role objects

* `subOrgList`: *array* of *objects* - list of sub-organization objects

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_getOrgDetails","params":["INITORG"],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc":"2.0",
            "id":1,
            "result": {
              "acctList": [{
                  "acctId":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
                  "isOrgAdmin":true,
                  "orgId":"INITORG",
                  "roleId":"NWADMIN",
                  "status":2
              }, {
                  "acctId":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
                  "isOrgAdmin":true,
                  "orgId":"INITORG",
                  "roleId":"NWADMIN",
                  "status":2
              }],
              "nodeList": [{
                  "orgId":"INITORG",
                  "status":2,
                  "url":"enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0"
              }, {
                  "orgId":"INITORG",
                  "status":2,
                  "url":"enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0"
              }, {
                  "orgId":"INITORG",
                  "status":2,
                  "url":"enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0"
              }, {
                  "orgId":"INITORG",
                  "status":2,
                  "url":"enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
              }],
              "roleList": [{
                  "access":3,
                  "active":true,
                  "isAdmin":true,
                  "isVoter":true,
                  "orgId":"INITORG",
                  "roleId":"NWADMIN"
              }],
              "subOrgList":null
            }
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission_getOrgDetails("INITORG")
        ```

    === "geth console result"

        ```json
        {
          "acctList": [{
              "acctId":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
              "isOrgAdmin":true,
              "orgId":"INITORG",
              "roleId":"NWADMIN",
              "status":2
          }, {
              "acctId":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
              "isOrgAdmin":true,
              "orgId":"INITORG",
              "roleId":"NWADMIN",
              "status":2
          }],
          "nodeList": [{
              "orgId":"INITORG",
              "status":2,
              "url":"enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0"
          }, {
              "orgId":"INITORG",
              "status":2,
              "url":"enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0"
          }, {
              "orgId":"INITORG",
              "status":2,
              "url":"enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0"
          }, {
              "orgId":"INITORG",
              "status":2,
              "url":"enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
          }],
          "roleList": [{
              "access":3,
              "active":true,
              "isAdmin":true,
              "isVoter":true,
              "orgId":"INITORG",
              "roleId":"NWADMIN"
          }],
          "subOrgList":null
        }
        ```

### `quorumPermission_addOrg`

Proposes a new organization into the network.
This method can be called by a network admin account.

If there are any pending items for approval, proposal of any new organization fails.
Also, the enode ID and account ID can only be linked to one organization.

#### Parameter

* `orgId`: *string* - unique organization ID

* `enodeId`: *string* - complete enode ID

* `accountId`: *string* - account to be the organization admin account

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addOrg","params":["ABC","enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404","0x0638e1574728b6d862dd5d3a3e0942c3be47d996",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.addOrg("ABC","enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404","0x0638e1574728b6d862dd5d3a3e0942c3be47d996",{from: eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveOrg`

Approves the specified proposed organization into the network.
This method can be called by a network admin account.

#### Parameters

* `orgId`: *string* - unique organization ID

* `enodeId`: *string* - complete enode ID

* `accountId`: *string* - account to be the organization admin account

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveOrg","params":["ABC","enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404","0x0638e1574728b6d862dd5d3a3e0942c3be47d996",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.approveOrg("ABC","enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404","0x0638e1574728b6d862dd5d3a3e0942c3be47d996",{"from":eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_updateOrgStatus`

Temporarily suspends the specified organization or re-activates the specified suspended organization.
This method can be called by a network admin account.
This can only be performed for the master organization and requires the majority of network admins to
[approve](#quorumpermission_approveorgstatus).

#### Parameters

* `orgId`: *string* - organization ID

* `action`: *number* -

    * 1 - for suspending the organization

    * 2 - for activating the suspended organization

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_updateOrgStatus","params":["ABC",1,{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.updateOrgStatus("ABC",1,{"from":eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveOrgStatus`

Approves an organization status change proposal.
This method can be called by a network admin account.
Once a majority of the network admins approve the status update, the organization status is updated.

When an organization is in suspended status, no transactions or contract deployment activities are allowed from any
nodes linked to the organization and sub-organizations under it.
Similarly, no transactions are allowed from any accounts linked to the organization.

#### Parameters

* `orgId`: *string* - organization ID

* `action`: *number* -

    * 1 - for approving organization suspension

    * 2 - for approving activation of the suspended organization

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveOrgStatus","params":["ABC",1,{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.approveOrgStatus("ABC",1,{"from":eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_addSubOrg`

Creates a sub-organization under the master organization.
This method can be called by an organization admin account.

#### Parameters

* `parentOrgId`: *string* - parent organization ID under which the sub-organization is being added

!!! note

    The parent organization ID should contain the complete organization hierarchy from master organization ID to the
    immediate parent.
    The organization hierarchy is separated by `.`.
    For example, if master organization `ABC` has a sub-organization `SUB1`, then while creating the sub-organization at
    `SUB1` level, the parent organization should be given as `ABC.SUB1`.

* `subOrgId`: *string* - sub-organization ID

* `enodeId`: *string* - complete enode ID of the node linked to the sub-organization ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addSubOrg","params":["ABC","SUB1","",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.addSubOrg("ABC","SUB1","",{"from":eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_addNewRole`

Creates a new role for the organization.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: *string* - organization ID for which the role is being created

* `roleId`: *string* - unique role ID

* `accountAccess`: *number* - [account level access](Permissioning-Types.md#account-access-types)

* `isVoter`: *boolean* - indicates if the role is a voting role

* `isAdminRole`: *boolean* - indicates if the role is an admin role

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addNewRole","params":["ABC","TRANSACT",1,false,false,{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.addNewRole("ABC","TRANSACT",1,false,false,{"from":eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_removeRole`

Removes the specified role from an organization.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the role belongs

* `roleId`: *string* - role ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_removeRole","params":["ABC","TRANSACT",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.removeRole("ABC.SUB1.SUB2.SUB3","TRANSACT",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_addAccountToOrg`

Adds an account to an organization and assigns a role to the account.
This method can be called by an organization admin account.

The account can only be linked to a single organization or sub-organization.

#### Parameters

* `acctId`: *string* - organization or sub-organization ID to which the role belongs

* `orgId`: *string* - organization ID

* `roleId`: *string* - role ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addAccountToOrg","params":["0xf017976fdf1521de2e108e63b423380307f501f8","ABC","TRANSACT",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.addAccountToOrg("0xf017976fdf1521de2e108e63b423380307f501f8","ABC","TRANSACT",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_changeAccountRole`

Assigns a role to the specified account.
This method can be called by an organization admin account.

#### Parameters

* `acctId`: *string* - account ID

* `orgId`: *string* - organization ID

* `roleId`: *string* - new role ID to be assigned to the account

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_changeAccountRole","params":["0xf017976fdf1521de2e108e63b423380307f501f8","ABC","TRANSACT",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.changeAccountRole("0xf017976fdf1521de2e108e63b423380307f501f8","ABC","TRANSACT",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_updateAccountStatus`

Updates the status of the specified account.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the account belongs

* `acctId`: *string* - account ID

* `action`: *number* -

    * 1 - for suspending the account

    * 2 - for activating the suspended account

    * 3 - for denylisting the account

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_updateAccountStatus","params":["ABC","0xf017976fdf1521de2e108e63b423380307f501f8",1,{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.updateAccountStatus("ABC","0xf017976fdf1521de2e108e63b423380307f501f8",1,{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_recoverBlackListedAccount`

Initiates the recovery of the specified denylisted (blacklisted) account.
This method can be called by a network admin account.
Once a majority of the network admins [approve](#quorumpermission_approveblacklistedaccountrecovery), the denylisted
account is marked as active.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the node belongs

* `acctId`: *string* - denylisted account ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_recoverBlackListedAccount","params":["ABC.SUB1.SUB2.SUB3","0xf017976fdf1521de2e108e63b423380307f501f8",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.recoverBlackListedAccount("ABC.SUB1.SUB2.SUB3","0xf017976fdf1521de2e108e63b423380307f501f8",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveBlackListedAccountRecovery`

Approves the recovery of the specified denylisted (blacklisted) account.
This method can be called by a network admin account.
Once a majority of the network admins approve, the account is marked as active.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the node belongs

* `acctId`: *string* - denylisted account ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveBlackListedNodeRecovery","params":["ABC.SUB1.SUB2.SUB3","0xf017976fdf1521de2e108e63b423380307f501f8",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.approveBlackListedNodeRecovery("ABC.SUB1.SUB2.SUB3","0xf017976fdf1521de2e108e63b423380307f501f8",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_assignAdminRole`

Adds a new account as network admin or changes the organization admin account for an organization.
This method can be called by a network admin account.

#### Parameters

* `orgId`: *string* - organization ID to which the account belongs

* `acctId`: *string* - account ID

* `roleId`: *string* - new role ID to be assigned to the account; this can be the network admin role or an organization
  admin role only.

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_assignAdminRole","params":["ABC","0xf017976fdf1521de2e108e63b423380307f501f8","NWADMIN",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.assignAdminRole("ABC","0xf017976fdf1521de2e108e63b423380307f501f8","NWADMIN",{"from":eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveAdminRole`

Approves the organization admin or network admin role assignment to the specified account.
This method can be called by a network admin account.
The role is approved once the majority of network admins approve.

#### Parameters

* `orgId`: *string* - organization ID to which the account belongs

* `acctId`: *string* - account ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveAdminRole","params":["ABC","0xf017976fdf1521de2e108e63b423380307f501f8",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.approveAdminRole("ABC","0xf017976fdf1521de2e108e63b423380307f501f8",{"from":eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_addNode`

Adds a node to the specified organization or sub-organization.
This method can be called by an organization admin account.
A node cannot be part of multiple organizations.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the node belongs

* `enodeId`: *string* - complete enode ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addNode","params":["ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.addNode("ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_updateNodeStatus`

Updates the status of the specified node.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the node belongs

* `enodeId`: *string* - complete enode ID

* `action`: *number* -

    * 1 - for deactivating the node

    * 2 - for activating the deactivated node

    * 3 - for denylisting the node

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_updateNodeStatus","params":["ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",1,{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.updateNodeStatus("ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",3,{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_recoverBlackListedNode`

Initiates the recovery of the specified denylisted (blacklisted) node.
This method can be called by a network admin account.
Once the majority of network admins [approve](#quorumpermission_approveblacklistednoderecovery), the denylisted node is
marked as active.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the node belongs

* `enodeId`: *string* - complete enode ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_recoverBlackListedNode","params":["ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.recoverBlackListedNode("ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveBlackListedNodeRecovery`

Approves the recovery of the specified denylisted (blacklisted) node.
This method can be called by a network admin account.
Once the majority of network admins approve, the denylisted node is marked as active.

#### Parameters

* `orgId`: *string* - organization or sub-organization ID to which the node belongs

* `enodeId`: *string* - complete enode ID

#### Returns

`result`: *string* - response message

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveBlackListedNodeRecovery","params":["ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.approveBlackListedNodeRecovery("ABC.SUB1.SUB2.SUB3","enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",{"from":eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_transactionAllowed`

Checks if the account initiating the specified transaction has sufficient permissions to execute the transaction.

#### Parameters

* `txArgs`: *object* - transaction arguments object

#### Returns

`result`: *boolean* - indicates if transaction is allowed or not

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_transactionAllowed","params":[{"from":"0xf2cd20ed7904c103ce2ca0ef73fb77539930c59f"}],"id":50}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":true
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.transactionAllowed({"from":eth.accounts[0]}
        ```

    === "geth console result"

        ```json
        true
        ```

### `quorumPermission_connectionAllowed`

Checks if the specified node is allowed to join the network.

#### Parameters

* `enodeId`: *string* - enode ID

* `ipAddress`: *string* - IP address of the node

* `portNum`: *number* - port number

#### Returns

`result`: *boolean* - indicates if the connection is allowed or not

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_connectionAllowed","params":["239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf","127.0.0.1",21006],"id":50}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":true
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.connectionAllowed("579f786d4e2830bbcc02815a27e8a9bacccc9605df4dc6f20bcc1a6eb391e7225fff7cb83e5b4ecd1f3a94d8b733803f2f66b7e871961e7b029e22c155c3a778","127.0.0.1",21003)
        ```

    === "geth console result"

        ```json
        true
        ```

## Privacy methods

### `eth_sendTransaction`

!!! note

    To support private transactions in GoQuorum, the
    [`web3.eth.sendTransaction(object)`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#sendtransaction) API
    method has been modified.

Sends the specified transaction to the network.

If the transaction is a contract creation, use
[`web3.eth.getTransactionReceipt()`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#gettransactionreceipt) to get
the contract address after the transaction is mined.

#### Parameters

* `transaction`: *object* - transaction object to send, with the following fields:

    * `from`: *string* - address for the sending account; defaults to `web3.eth.defaultAccount`

    * `to`: *string* - (optional) destination address of the message; defaults to `undefined`

    * `value`: *number* - (optional) value transferred for the transaction in Wei, also the endowment if it's a contract-creation
      transaction

    * `gas`: *number* - (optional) amount of gas to use for the transaction (unused gas is refunded)

    * `data`: *data* - (optional) either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI)
      containing the associated data of the message, or in the case of a contract-creation transaction, the
      initialization code

    * `input`: *data* - (optional) either a
      [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) containing the associated data of the
      message, or in the case of a contract-creation transaction, the initialization code

    !!! note

        `input` cannot co-exist with `data` if they are set to different values.

    * `nonce`: *number* - (optional) integer of a nonce; allows you to overwrite your own pending transactions that use
      the same nonce

    * `privateFrom`: *string* - (optional) when sending a private transaction, the sending party's base64-encoded public key to use;
      if not present *and* passing `privateFor`, use the default key as configured in the
      `TransactionManager`.

    * `privateFor`: *array* of *strings* - (optional) when sending a private transaction, an array of the recipients'
      base64-encoded public keys

    * `privacyFlag`: *number* - (optional)

        * 0 - for standard private (default if not provided)

        * 1 - for counterparty protection

        * 3 - for private state validation

* `callback`: *function* - (optional) callback function; if you pass a callback, the HTTP request is made asynchronous.

#### Returns

`result`: *string* - 32-byte transaction hash as a hex string

!!! example

    === "Syntax"

        ```js
        web3.eth.sendTransaction(transactionObject [, callback])
        ```

    === "Example"

        ```js
        // compiled solidity source code using https://chriseth.github.io/cpp-ethereum/
        var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";

        web3.eth.sendTransaction({
            data: code,
            privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
          },
          function(err, address) {
            if (!err) {
              console.log(address); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
            }
          }
        });
        ```

### `eth_sendRawPrivateTransaction`

Sends the specified pre-signed transaction, for example using
[`SilentCicero/ethereumjs-accounts`](https://github.com/SilentCicero/ethereumjs-accounts).

If the transaction is a contract creation, use
[`web3.eth.getTransactionReceipt()`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#gettransactionreceipt) to get
the contract address after the transaction is mined.

!!! important

    Before calling this method, [`storeraw`](https://consensys.github.io/tessera/#operation/encryptAndStoreVersion)
    needs to be called to Tessera.

#### Parameters

* *string* - signed transaction data in hex format

* *object* - private data to send, with the following fields:

    * `privateFor`: *array* of *strings* - when sending a private transaction, an array of the recipients' base64-encoded
    public keys

    * `privacyFlag`: *number* - (optional)

        * 0 - for standard private (default if not provided)

        * 1 - for counterparty protection

        * 3 - for private state validation

* `callback`: *function* - (optional) callback function; if you pass a callback, the HTTP request is made asynchronous.

#### Returns

`result`: *string* - 32-byte transaction hash as a hex string

!!! example

    === "Syntax"

        ```js
        web3.eth.sendRawPrivateTransaction(signedTransactionData [, privateData] [, callback])
        ```

    === "Example"

        ```js
        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
        var rawTx = {
          nonce: '0x00',
          gasPrice: '0x09184e72a000',
          gasLimit: '0x2710',
          to: '0x0000000000000000000000000000000000000000',
          value: '0x00',
          // This data should be the hex value of the hash returned by Tessera after invoking storeraw api
          data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
        }
        var tx = new Tx(rawTx);
        tx.sign(privateKey);
        var serializedTx = tx.serialize();
        //console.log(serializedTx.toString('hex'));
        //f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
        web3.eth.sendRawPrivateTransaction('0x' + serializedTx.toString('hex'), {privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]}, function(err, hash) {
        if (!err)
          console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
        });
        ```

### `eth_fillTransaction`

Supports offline signing of the specified transaction.
This can be used to fill and sign both public and private transactions.
Defaults to `RLP` plus `json`.

#### Parameters

`transaction`: *object* - transaction object to send, with the following fields:

* `from`: *string* - address for the sending account

* `to`: *string* - (optional) destination address of the message

* `value`: *number* - (optional) value transferred for the transaction in Wei, also the endowment if it's a contract-creation
  transaction

* `data`: *data* - (optional) either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) containing the
  associated data of the message, or in the case of a contract-creation transaction, the initialization code

* `privateFor`: *array* of *strings* - (optional) when sending a private transaction, an array of the recipients' base64-encoded public keys

#### Returns

`result`: *object* - result object with the following fields:

* `raw`: *data* - `RLP`-encoded bytes for the passed transaction object

* `tx`: *object* - transaction object

The following example uses `geth` console for signing and sending a private transaction.

!!! example

    The following transaction deploys a simple storage contract with an initial value of 42.

    === "geth console request"

        ```javascript
        a = eth.fillTransaction({"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","data":"0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029000000000000000000000000000000000000000000000000000000000000002a","gas":0x47b760,"privateFor":["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]})
        ```

    === "geth console result"

        ```json
        {
          "raw":"0xf84d02808347b7608080b84075902a24f8f3248a8c6d342506f018b2ef735bca0badecbaf7dc98b5799b3c8db4cc65f1a9294f29f018ce603cf93a212ebdde4a8f2d83d44a98eb97ffa690d6258080",
          "tx": {
            "gas":"0x47b760",
            "gasPrice":"0x0",
            "hash":"0xc0bbb6326ebafb7b0b18cf85d7b93e73ec8ae72b1c8d043d77d7ac5fecd9ccb5",
            "input":"0x75902a24f8f3248a8c6d342506f018b2ef735bca0badecbaf7dc98b5799b3c8db4cc65f1a9294f29f018ce603cf93a212ebdde4a8f2d83d44a98eb97ffa690d6",
            "nonce":"0x2",
            "r":"0x0",
            "s":"0x0",
            "to":null,
            "v":"0x25",
            "value":"0x0"
          }
        }
        ```

    Once the transaction object is returned, set `tx.from`:

    === "geth console request"

        ```javascript
        a.tx.from = "0xed9d02e382b34818e88b88a309c7fe71e65f419d"
        ```

    === "geth console result"

        ```json
        "0xed9d02e382b34818e88b88a309c7fe71e65f419d"
        ```

    Set `tx.privatefor`:

    === "geth console request"

        ```javascript
        a.tx.privateFor = ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
        ```

    === "geth console result"

        ```json
        ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
        ```

    Sign the transaction:

    === "geth console request"

        ```javascript
        b = eth.signTransaction(a.tx)
        ```

    === "geth console result"

        ```json
        {
          "raw":"0xf88d02808347b7608080b84075902a24f8f3248a8c6d342506f018b2ef735bca0badecbaf7dc98b5799b3c8db4cc65f1a9294f29f018ce603cf93a212ebdde4a8f2d83d44a98eb97ffa690d637a04ff24fa99cdf3cfbaec698857c006240aa79331432d7ddb86209ec7b0010097da071f42224ee42a35872ca13fa6ffa3f7f6e550f1edecc750cc0a3ea638bf05ed9",
          "tx": {
            "gas":"0x47b760",
            "gasPrice":"0x0",
            "hash":"0x1fa98e808d711ffadfce90c4db088057e3d5efd668883be0755f158349dc274b",
            "input":"0x75902a24f8f3248a8c6d342506f018b2ef735bca0badecbaf7dc98b5799b3c8db4cc65f1a9294f29f018ce603cf93a212ebdde4a8f2d83d44a98eb97ffa690d6",
            "nonce":"0x2",
            "r":"0x4ff24fa99cdf3cfbaec698857c006240aa79331432d7ddb86209ec7b0010097d",
            "s":"0x71f42224ee42a35872ca13fa6ffa3f7f6e550f1edecc750cc0a3ea638bf05ed9",
            "to":null,
            "v":"0x37",
            "value":"0x0"
          }
        }
        ```

    Call [`eth.sendRawPrivateTransaction`](#ethsendrawprivatetransaction) to send the transaction to intended recipients:

    === "geth console request"

        ```javascript
        eth.sendRawPrivateTransaction(b.raw,{"privateFor":["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]})
        ```

    === "geth console result"

        ```json
        "0xcd8ab3f6dbdb8535a44d47df9c7d8a3862fe9fb4257a2d377bdd8bface016928"
        ```

### `eth_storageRoot`

Returns the storage root hash of the specified address.
If the contract is a [private contract](../Concepts/Privacy/Privacy.md#state-verification), returns the storage root
hash from the private state database.

#### Parameters

* `address`: *String* - address to fetch the storage root from in hex

* `block`: *string* - (optional) block number to fetch the storage root from in hex; defaults to the latest block

#### Returns

`result`: *string* - 32-byte storage root hash as a hex string

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"eth_storageRoot","params":["0x1349f3e1b8d71effb47b840594ff27da7e603d17","0x1"],"id":67}'
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0"
          "id":67,
          "result":"0x81d1fa699f807735499cf6f7df860797cf66f6a66b565cfcda3fae3521eb6861"
        }
        ```

### `eth_getQuorumPayload`

Returns the unencrypted payload from Tessera.

#### Parameters

`id`: *string* - the generated SHA3-512 hash of the encrypted payload from the Private Transaction Manager, in hex;
this is seen in the transaction as the `input` field.

#### Returns

`result`: *string* - unencrypted transaction payload in hex format

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"eth_getQuorumPayload","params":["0x5e902fa2af51b186468df6ffc21fd2c26235f4959bf900fc48c17dc1774d86d046c0e466230225845ddf2cf98f23ede5221c935aac27476e77b16604024bade0"],"id":67}'
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":67,
          "result":"0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029000000000000000000000000000000000000000000000000000000000000002a"
        }
        ```

### `eth_sendTransactionAsync`

Sends the specified transaction to the network asynchronously.
This returns immediately, potentially before the transaction has been submitted to the transaction pool.
A callback can be provided to receive the result of submitting the transaction; a server must be set up to receive POST
requests at the given URL.

If the transaction is a contract creation, use
[`web3.eth.getTransactionReceipt()`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#gettransactionreceipt) to get
the contract address after the transaction is mined.

#### Parameters

`transaction`: *object* - transaction object to send, with the following fields:

* `from`: *string* - address for the sending account; defaults to `web3.eth.defaultAccount`

* `to`: *string* - (optional) destination address of the message; defaults to `undefined`

* `value`: *number* - (optional) value transferred for the transaction in Wei, also the endowment if it's a contract-creation
  transaction

* `gas`: *number* - (optional) amount of gas to use for the transaction (unused gas is refunded)

* `data`: *data* - (optional) either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI)
  containing the associated data of the message, or in the case of a contract-creation transaction, the
  initialization code

* `input`: *data* - (optional) either a
  [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) containing the associated data of the
  message, or in the case of a contract-creation transaction, the initialization code

!!! note

    `input` cannot co-exist with `data` if they are set to different values.

* `nonce`: *number* - (optional) integer of a nonce; allows you to overwrite your own pending transactions that use the
  same nonce

* `privateFrom`: *string* - (optional) when sending a private transaction, the sending party's base64-encoded public key
  to use; if not present *and* passing `privateFor`, use the default key as configured in the `TransactionManager`.

* `privateFor`: *array* of *strings* - (optional) when sending a private transaction, an array of the recipients'
  base64-encoded public keys

* `privacyFlag`: *number* - (optional)

    * 0 - for standard private (default if not provided)

    * 1 - for counterparty protection

    * 3 - for private state validation

* `callbackUrl`: *string* - (optional) URL to perform a POST request to post the result of submitting the transaction

#### Returns

* `result`: *string* - empty hash, defined as `0x0000000000000000000000000000000000000000000000000000000000000000`

The callback URL receives the following object:

* `result`: *object* - result object with the following fields:

    * `id`: *string* - ID in the original RPC call, used to match this result to the request

    * `txHash`: *string* - transaction hash that was generated, if successful

    * `error`: *string* - error that occurred while submitting the transaction

!!! example

    The call and the immediate response:

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"eth_sendTransactionAsync","params":[{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","data":"0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029000000000000000000000000000000000000000000000000000000000000002a","gas":"0x47b760","privateFor":["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]}],"id":67}'
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":67,
          "result":"0x0000000000000000000000000000000000000000000000000000000000000000"
        }
        ```

    If you provide the callback URL, you receive the following response after submitting the transaction.
    This example assumes a webserver that can be accessed by calling http://localhost:8080 has been set up to accept
    POST requests:

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"eth_sendTransactionAsync","params":[{"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","data":"0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029000000000000000000000000000000000000000000000000000000000000002a","gas":"0x47b760","privateFor":["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="],"callbackUrl":"http://localhost:8080"}],"id":67}'
        ```

    === "JSON result"

        ```json
        {
          "id":67,
          "txHash":"0x75ebbf4fbe29355fc8a4b8d1e14ecddf0228b64ef41e6d2fce56047650e2bf17"
        }
        ```

### `getContractPrivacyMetadata`

Queries the privacy metadata for the specified contract account address.

#### Parameter

*string* - contract address

#### Returns

`result`: *object* - result object with the following fields:

* `creationTxHash`: *data* - affected contract's original transaction's encrypted payload hash

* `privacyFlag`: *number* - unsigned integer with 1 for counterparty protection and 3 for private state validation contracts

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"eth_getContractPrivacyMetadata","params":["0x1932c48b2bf8102ba33b4a6b545c32236e342f34"],"id":15}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":15,
          "result": {
            "creationTxHash":[246,124,116,139,190,217,33,16,203,102,81,13,65,58,249,145,68,180,67,79,163,37,119,27,99,35,247,240,12,53,25,45,47,134,16,118,246,128,97,237,45,50,79,97,78,221,47,1 89,11,165,238,36,8,187,66,64,42,135,108,75,41,85,152,183],
            "privacyFlag":3
          }
        }
        ```

    === "geth console request"

        ```javascript
        eth.getContractPrivacyMetadata("0x1932c48b2bf8102ba33b4a6b545c32236e342f34");
        ```

    === "geth console result"

        ```json
        {
          "creationTxHash":[246,124,116,139,190,217,33,16,203,102,81,13,65,58,249,145,68,180,67,79,163,37,119,27,99,35,247,240,12,53,25,45,47,134,16,118,246,128,97,237,45,50,79,97,78,221,47,1 89,11,165,238,36,8,187,66,64,42,135,108,75,41,85,152,183],
          "privacyFlag":3
        }
        ```

## Raft methods

### `raft_cluster`

Returns the details of all nodes part of the Raft cluster.

#### Parameters

None

#### Returns

`result`: *array* - list of node objects with the following fields:

* `hostName`: *string* - DNS name or the host IP address

* `nodeActive`: *boolean* - indicates if the node is active in the Raft cluster

* `nodeId`: *string* - enode ID of the node

* `p2pPort`: *number* - p2p port

* `raftId`: *string* - Raft ID of the node

* `raftPort`: *number* - Raft port

* `role`: *string* - role of the node in the Raft cluster (minter/verifier/learner); `""` if there is no leader at the network level

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"raft_cluster","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result": [{
            "raftId":1,
            "nodeId":"ac6b1096ca56b9f6d004b779ae3728bf83f8e22453404cc3cef16a3d9b96608bc67c4b30db88e0a5a6c6390213f7acbe1153ff6d23ce57380104288ae19373ef",
            "p2pPort":21000,
            "raftPort":50401,
            "hostname":"127.0.0.1",
            "role":"minter",
            "nodeActive":true
          }, {
            "raftId":3,
            "nodeId":"579f786d4e2830bbcc02815a27e8a9bacccc9605df4dc6f20bcc1a6eb391e7225fff7cb83e5b4ecd1f3a94d8b733803f2f66b7e871961e7b029e22c155c3a778",
            "p2pPort":21002,
            "raftPort":50403,
            "hostname":"127.0.0.1",
            "role":"verifier",
            "nodeActive":true
          }, {
            "raftId":2,
            "nodeId":"0ba6b9f606a43a95edc6247cdb1c1e105145817be7bcafd6b2c0ba15d58145f0dc1a194f70ba73cd6f4cdd6864edc7687f311254c7555cc32e4d45aeb1b80416",
            "p2pPort":21001,
            "raftPort":50402,
            "hostname":"127.0.0.1",
            "role":"verifier",
            "nodeActive":true
          }]
        }
        ```

    === "geth console request"

        ```javascript
        raft.cluster
        ```

    === "geth console result"

        ```json
        [{
          "hostname":"127.0.0.1",
          "nodeActive":true,
          "nodeId":"0ba6b9f606a43a95edc6247cdb1c1e105145817be7bcafd6b2c0ba15d58145f0dc1a194f70ba73cd6f4cdd6864edc7687f311254c7555cc32e4d45aeb1b80416",
          "p2pPort":21001,
          "raftId":2,
          "raftPort":50402,
          "role":"verifier"
        }, {
          "hostname":"127.0.0.1",
          "nodeActive":true,
          "nodeId":"579f786d4e2830bbcc02815a27e8a9bacccc9605df4dc6f20bcc1a6eb391e7225fff7cb83e5b4ecd1f3a94d8b733803f2f66b7e871961e7b029e22c155c3a778",
          "p2pPort":21002,
          "raftId":3,
          "raftPort":50403,
          "role":"verifier"
        }, {
          "hostname":"127.0.0.1",
          "nodeActive":true,
          "nodeId":"ac6b1096ca56b9f6d004b779ae3728bf83f8e22453404cc3cef16a3d9b96608bc67c4b30db88e0a5a6c6390213f7acbe1153ff6d23ce57380104288ae19373ef",
          "p2pPort":21000,
          "raftId":1,
          "raftPort":50401,
          "role":"minter"
        }]
        ```

### `raft_role`

Returns the role of the current node in the Raft cluster.

#### Parameters

None

#### Returns

`result`: *string* - role of the node in the Raft cluster (minter/verifier/learner); `""` if there is no leader at the
network level

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"raft_role","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"verifier"
        }
        ```

    === "geth console request"

        ```javascript
        raft.role
        ```

    === "geth console result"

        ```json
        "minter"
        ```

### `raft_leader`

Returns the enode ID of the leader node.

#### Parameters

None

#### Returns

`result`: *string* - enode ID of the leader, or an error message if there is no leader

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"raft_leader","id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":"ac6b1096ca56b9f6d004b779ae3728bf83f8e22453404cc3cef16a3d9b96608bc67c4b30db88e0a5a6c6390213f7acbe1153ff6d23ce57380104288ae19373ef"
        }
        ```

    === "geth console request"

        ```javascript
        raft.leader
        ```

    === "geth console result"

        ```json
        "ac6b1096ca56b9f6d004b779ae3728bf83f8e22453404cc3cef16a3d9b96608bc67c4b30db88e0a5a6c6390213f7acbe1153ff6d23ce57380104288ae19373ef"
        ```

### `raft_addPeer`

Adds a new peer to the network.

#### Parameters

`enodeId`: *string* - enode ID of the node to be added to the network

#### Returns

`result`: *string* - Raft ID for the node being added, or an error message if the node is already part of the network

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"raft_addPeer","params":["enode://3701f007bfa4cb26512d7df18e6bbd202e8484a6e11d387af6e482b525fa25542d46ff9c99db87bd419b980c24a086117a397f6d8f88e74351b41693880ea0cb@127.0.0.1:21004?discport=0&raftport=50405"],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":5
        }
        ```

    === "geth console request"

        ```javascript
        raft.addPeer("enode://3701f007bfa4cb26512d7df18e6bbd202e8484a6e11d387af6e482b525fa25542d46ff9c99db87bd419b980c24a086117a397f6d8f88e74351b41693880ea0cb@127.0.0.1:21004?discport=0&raftport=50405")
        ```

    === "geth console result"

        ```json
        5
        ```

### `raft_removePeer`

Removes the specified peer from the Raft cluster.

#### Parameters

`raftId`: *string* - Raft ID of the peer to be removed from the cluster

#### Returns

`result`: `null`

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"raft_removePeer","params":[4],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":null
        }
        ```

    === "geth console request"

        ```javascript
        raft.removePeer(4)
        ```

    === "geth console result"

        ```json
        null
        ```

### `raft_addLearner`

Adds a new node to the network as a learner node.
The learner node syncs with the network and can transact, but isn't part of the Raft cluster and doesn't provide block
confirmation to the minter node.

#### Parameters

`enodeId`: *string* - enode ID of the node to add

#### Returns

`result`: *string* - Raft ID for the node being added

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"raft_addLearner","params":["enode://3701f007bfa4cb26512d7df18e6bbd202e8484a6e11d387af6e482b525fa25542d46ff9c99db87bd419b980c24a086117a397f6d8f88e74351b41693880ea0cb@127.0.0.1:21004?discport=0&raftport=50405"],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":5
        }
        ```

    === "geth console request"

        ```javascript
        raft.addLearner("enode://3701f007bfa4cb26512d7df18e6bbd202e8484a6e11d387af6e482b525fa25542d46ff9c99db87bd419b980c24a086117a397f6d8f88e74351b41693880ea0cb@127.0.0.1:21004?discport=0&raftport=50405")
        ```

    === "geth console result"

        ```json
        5
        ```

### `raft_promoteToPeer`

Promotes the specified learner node to peer and thus to be part of the Raft cluster.

#### Parameters

`raftId`: *string* - Raft ID of the node to be promoted

#### Returns

`result`: *boolean* - indicates if the node is promoted

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"raft_promoteToPeer","params":[4],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result":true
        }
        ```

    === "geth console request"

        ```javascript
        raft.promoteToPeer(4)
        ```

    === "geth console result"

        ```json
        true
        ```
