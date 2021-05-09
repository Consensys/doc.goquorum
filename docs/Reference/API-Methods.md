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

* `toExtend`: address of the private contract to extend

* `newRecipientPtmPublicKey`: the new participant's Private Transaction Manager (PTM) (for example, Tessera) public key

* `recipientAddress`: the new participant's Ethereum address - the participant will later need to approve the extension
  using this address

* `txArgs`: arguments for the transaction that deploys the extension management contract - `privateFor` must contain
  only the `newRecipientPtmPublicKey`

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

!!!error "Frequent issues"

    * It's impossible to extend a contract already being extended, the following error will be returned:

          ```text
          Error: contract extension in progress for the given contract address
          ```

    * You must execute `quorumExtension_extendContract` from the node who created the contract initially.

    * If the network is using
      [enhanced network permissioning](../../Concepts/Permissioning/Enhanced/EnhancedPermissionsOverview.md), then both
      initiator (the `from` address in `txArgs`) and receiver (`recipientAddress`) of the extension must be network or
      org admin accounts.

### `quorumExtension_approveExtension`

Submits an approval/denial vote to the specified extension management contract.

#### Parameters

* `addressToVoteOn`: address of the contract extension's management contract (this can be found using
  [`quorumExtension_activeExtensionContracts`](#quorumextension_activeextensioncontracts))

* `vote`: *boolean* - `true` approves the extension process, `false` cancels the extension process

* `txArgs`: arguments for the vote submission transaction - `privateFor` must contain the public key of the node that
  initiated the contract extension

#### Returns

`result`: *data* - hash of the vote submission transaction

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_approveExtension", "params":["0xb1c57951a2f3006910115eadf0f167890e99b9cb", true, {"from": "0xed9d02e382b34818e88b88a309c7fe71e65f419d", "privateFor":["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]}], "id":10}' --header "Content-Type: application/json"
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
        quorumExtension.approveExtension("0xb1c57951a2f3006910115eadf0f167890e99b9cb", true ,{from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d", privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]})
        ```

    === "geth console result"

        ```json
        "0x8d34a594b286087f45029daad2d5a8fd42f70abb0ae2492429a256a2ba4cb0dd"
        ```

!!!error "Frequent issues"

    * If the contract is already under the process of extension, a call to extend it again will fail:

        ```text
        Error: contract extension in progress for the given contract address
        ```

    * The recipient can approve the extension only once.

        Executing `quorumExtension.approveExtension` once the extension process is completed will result in the
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

Cancels an active contract extension. This can only be invoked by the initiator of the extension process.

#### Parameters

* `extensionContract`: address of the contract extension's management contract

* `txArgs`: arguments for the cancellation transaction

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
        quorumExtension.cancelExtension("0x622aff909c081783613c9d3f5f4c47be78b310ac",{"from":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e","value":"0x0","privateFor": ["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
        ```

    === "geth console result"

        ```json
        "0xb43da7dbeae5347df86c6933786b8c536b4622463b577a990d4c87214845d16a"
        ```

!!!error "Frequent issues"

    * The canceller (`from` address in `txArgs`) must be the same as the initiator of the extension (the `from` address
      in `txArgs` for the [`quorumExtension_extendContract`](#quorumextension_extendcontract) call) or it will result in
      the following error:

        ```text
        Error: account is not the creator of this extension request
        ```

### `quorumExtension_activeExtensionContracts`

Lists all active contract extensions involving this node (either as initiator or receiver).

#### Parameters

None

#### Returns

`result`: *array* - list of contract extension objects with the following fields:

* `managementContractAddress`: address of the extension management contract

* `contractExtended`: address of the private contract getting extended

* `creationData`: PTM hash of creation data for extension management contract

* `initiator`: the contract extension initiator's Ethereum address

* `recipient`: the new participant's Ethereum address - the participant will later need to approve the extension using
  this address

* `recipientPtmKey`: the new participant's PTM public key

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_activeExtensionContracts", "id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id":10,
          "result": [
            {
              "managementContractAddress":"0xc4e9de0bd5e0a5fd55ef5d6f2b46eba930a694a3",
              "contractExtended":"0x027692c7ebdc81c590250e615ab571a0d14eff2d",
              "creationData":"Zvo1Rnrfq4phIJbzKObyCBWSXTbEJGPOq5+jDCWccnPpA7K6OvIssCMLJ54f32uuEeczeVNC46QMk52lCOWbtg==",
              "initiator":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
              "recipient":"0x0fbdc686b912d7722dc86510934589e0aaf3b55a",
              "recipientPtmKey":"1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="
            }
          ]
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

`managementContractAddress`: address of the extension management contract

#### Returns

`result`: status of contract extension (`ACTIVE` or `DONE`)

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumExtension_getExtensionStatus", "params":["0x1349f3e1b8d71effb47b840594ff27da7e603d17"], "id":10}' --header "Content-Type: application/json"
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

Retrieves the state of an address at a given block.

#### Parameters

* `address`: account address of the state to retrieve

* `blockNumber`: integer representing a block number or one of the string tags `latest` (the last block mined) or `pending`
  (the last block mined plus pending transactions)

#### Returns

`result`: state of the account address

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22001 --data '{"jsonrpc":"2.0","method":"debug_dumpAddress","params":["0xfff7ac99c8e4feb60c9750054bdc14ce1857f181", 10],"id":15}' --header "Content-Type: application/json"
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
            "storage": {}
          }
        }
        ```

## Permission methods

### `quorumPermission_orgList`

Returns a list of all organizations with the status of each organization in the network.

#### Parameters

None

#### Returns

`result`: *array* - list of organization objects with the following fields:

* `fullOrgId`: complete organization ID including the all parent organization IDs separated by `.`

* `level`: level of the organization in the organization hierarchy

* `orgId`: organization ID

* `parentOrgId`: immediate parent organization ID

* `status`: [organization status](Permissioning-Types.md#organization-status-types)

* `subOrgList`: list of sub-organizations linked to the organization

* `ultimateParent`: master organization under which the organization falls

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
          "result": [
            {
              "fullOrgId":"INITORG",
              "level":1,
              "orgId":"INITORG",
              "parentOrgId":"",
              "status":2,
              "subOrgList":null,
              "ultimateParent":"INITORG"
            }
          ]
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

`result`: *array* - list of permissioned account objects with the following fields:

* `acctId`: account UD

* `isOrgAdmin`: indicates if the account is admin account for the organization

* `orgId`: organization ID

* `roleId`: role assigned to the account

* `status`: [account status](Permissioning-Types.md#account-status-types)

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
          "result": [
            {
              "acctId":"0xed9d02e382b34818e88b88a309c7fe71e65f419d",
              "isOrgAdmin":true,
              "orgId":"INITORG",
              "roleId":"NWADMIN",
              "status":2
            },
            {
              "acctId":"0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
              "isOrgAdmin":true,
              "orgId":"INITORG",
              "roleId":"NWADMIN",
              "status":2
            }
          ]
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

`result`: *array* - list of permissioned node objects with the following fields:

* `orgId`: organization ID to which the node belongs

* `status`: [node status](Permissioning-Types.md#node-status-types)

* `url`: complete enode ID

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
          "result": [
            {
              "orgId":"INITORG",
              "status":2,
              "url":"enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0"
            },
            {
              "orgId":"INITORG",
              "status":2,
              "url":"enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0"
            },
            {
              "orgId":"INITORG",
              "status":2,
              "url":"enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0"
            },
            {
              "orgId":"INITORG",
              "status":2,
              "url":"enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
            }
          ]
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

`result`: *array* - list of role objects with the following fields:

* `access`: [account access](Permissioning-Types.md#account-access-types)

* `active`: indicates if the role is active or not

* `isAdmin`: indicates if the role is organization admin role

* `isVoter`: indicates if the role is enabled for voting - applicable only for network admin role

* `orgId`: organization ID to which the role is linked

* `roleId`: unique role ID

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
          "result": [
            {
              "access":3,
              "active":true,
              "isAdmin":true,
              "isVoter":true,
              "orgId":"INITORG",
              "roleId":"NWADMIN"
            }
          ]
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

`orgId`: organization or sub-organization ID

#### Returns

`result`: *objects* - the following lists:

* `acctList`: list of accounts

* `nodeList`: list of nodes

* `roleList`: list of roles

* `subOrgList`: list of sub-organizations

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

If there are any pending items for approval, proposal of any new organization will fail.
Also, the enode ID and account ID can only be linked to one organization.

#### Parameter

* `orgId`: unique organization ID

* `enodeId`: complete enode ID

* `accountId`: account which will be the organization admin account

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addOrg","params":["ABC", "enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.addOrg("ABC", "enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", {from: eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

    === "geth console pending error"

        ```text
        Error: Pending approvals for the organization. Approve first
            at web3.js:3143:20
            at web3.js:6347:15
            at web3.js:5081:36
            at <anonymous>:1:1
        ```

    === "geth console enode ID error"

        ```text
        Error: EnodeId already part of network.
            at web3.js:3143:20
            at web3.js:6347:15
            at web3.js:5081:36
            at <anonymous>:1:1
        ```

    === "geth console account error"

        ```text
        Error: Account already in use in another organization
            at web3.js:3143:20
            at web3.js:6347:15
            at web3.js:5081:36
            at <anonymous>:1:1
        ```

### `quorumPermission_approveOrg`

Approves the specified proposed organization into the network.
This method can be called by a network admin account.

#### Parameters

* `orgId`: unique organization ID

* `enodeId`: complete enode ID

* `accountId`: account which will be the organization admin account

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveOrg","params":["ABC", "enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.approveOrg("ABC", "enode://3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6ede3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5@127.0.0.1:21003?discport=0&raftport=50404", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", {from: eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_updateOrgStatus`

Temporarily suspends the specified organization or re-enables the specified suspended organization.
This method can be called by a network admin account.
This can only be performed for the master organization and requires majority approval from network admins.

#### Parameters

* `orgId`: organization ID

* `action`:
  * 1 - for suspending an organization
  * 2 - for activating a suspended organization

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_updateOrgStatus","params":["ABC", 1, {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.updateOrgStatus("ABC", 1, {from:eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveOrgStatus`

Approves an organization status change proposal.
This method can be called by a network admin account.
Once majority approval is received from network admins, the organization status is updated.

When an organization is in suspended status, no transactions or contract deployment activities are allowed from any
nodes linked to the organization and sub-organizations under it.
Similarly, no transactions will be allowed from any accounts linked to the organization.

#### Parameters

* `orgId`: organization ID

* `action`:
  * 1 - for approving organization suspension
  * 2 - for approving activation of a suspended organization

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveOrgStatus","params":["ABC", 1, {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.approveOrgStatus("ABC", 1, {from: eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_addSubOrg`

Creates a sub-organization under the master organization.
This method can be called by an organization admin account.

#### Parameters

* `parentOrgId`: parent organization ID under which the sub-organization is being added

!!! note

    The parent organization ID should contain the complete organization hierarchy from master organization ID to the
    immediate parent.
    The organization hierarchy is separated by `.`.
    For example, if master organization `ABC` has a sub-organization `SUB1`, then while creating the sub-organization at
    `SUB1` level, the parent organization should be given as `ABC.SUB1`.

* `subOrgId`: sub-organization ID
* `enodeId`: complete enode ID of the node linked to the sub-organization ID

#### Returns

* `msg`: response message
* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addSubOrg","params":["ABC", "SUB1","", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.addSubOrg("ABC", "SUB1", "", {from: eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_addNewRole`

Creates a new role for the organization.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: organization ID for which the role is being created

* `roleId`: unique role ID

* `accountAccess`: [account level access](Permissioning-Types.md#account-access-types)

* `isVoter`: `boolean` - indicates if the role is a voting role

* `isAdminRole`: `boolean` - indicates if the role is an admin role

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addNewRole","params":["ABC", "TRANSACT",1,false,false, {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.addNewRole("ABC", "TRANSACT", 1, false, false,{from: eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_removeRole`

Removes the specified role from an organization.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: organization or sub-organization ID to which the role belongs

* `roleId`: role ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_removeRole","params":["ABC", "TRANSACT", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.removeRole("ABC.SUB1.SUB2.SUB3", "TRANSACT", {from: eth.accounts[1]})
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

* `acctId`: organization or sub-organization ID to which the role belongs

* `orgId`: organization ID

* `roleId`: role ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addAccountToOrg","params":["0xf017976fdf1521de2e108e63b423380307f501f8", "ABC", "TRANSACT", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.addAccountToOrg("0xf017976fdf1521de2e108e63b423380307f501f8", "ABC", "TRANSACT", {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

    === "geth console error"

        ```text
        Error: Account already in use in another organization
          at web3.js:3143:20
          at web3.js:6347:15
          at web3.js:5081:36
          at <anonymous>:1:1
        ```

### `quorumPermission_changeAccountRole`

Assigns a role to the specified account.
This method can be called by n organization admin account.

#### Parameters

* `acctId`: account ID

* `orgId`: organization ID

* `roleId`: new role ID to be assigned to the account

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_changeAccountRole","params":["0xf017976fdf1521de2e108e63b423380307f501f8", "ABC", "TRANSACT", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.changeAccountRole("0xf017976fdf1521de2e108e63b423380307f501f8", "ABC", "TRANSACT", {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_updateAccountStatus`

Updates the status of the specified account.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: organization or sub-organization ID to which the account belongs

* `acctId`: account ID

* `action`:
  * 1 - for suspending the account
  * 2 - for activating a suspended account
  * 3 - for denylisting an account

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_updateAccountStatus","params":["ABC", "0xf017976fdf1521de2e108e63b423380307f501f8", 1, {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.updateAccountStatus("ABC", "0xf017976fdf1521de2e108e63b423380307f501f8", 1, {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_recoverBlackListedAccount`

Initiates the recovery of the specified denylisted (blacklisted) account.
This method can be called by a network admin account.
Once majority approval from network admin accounts is received, the denylisted account is marked as active.

#### Parameters

* `orgId`: organization or sub-organization ID to which the node belongs

* `acctId`: denylisted account ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_recoverBlackListedAccount","params":["ABC.SUB1.SUB2.SUB3", "0xf017976fdf1521de2e108e63b423380307f501f8", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.recoverBlackListedAccount("ABC.SUB1.SUB2.SUB3", "0xf017976fdf1521de2e108e63b423380307f501f8", {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveBlackListedAccountRecovery`

Approves the recovery of the specified denylisted (blacklisted) account.
This method can be called by a network admin account.
Once majority approval from network admin accounts is received, the account is marked as active.

#### Parameters

* `orgId`: organization or sub-organization ID to which the node belongs

* `acctId`: denylisted account ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveBlackListedNodeRecovery","params":["ABC.SUB1.SUB2.SUB3", "0xf017976fdf1521de2e108e63b423380307f501f8", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.approveBlackListedNodeRecovery("ABC.SUB1.SUB2.SUB3", "0xf017976fdf1521de2e108e63b423380307f501f8", {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_assignAdminRole`

Adds a new account as network admin or changes the organization admin account for an organization.
This method can be called by a network admin account.

#### Parameters

* `orgId`: organization ID to which the account belongs

* `acctId`: account ID

* `roleId`: new role ID to be assigned to the account - this can be the network admin role or an organization admin role only

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_assignAdminRole","params":["ABC", "0xf017976fdf1521de2e108e63b423380307f501f8", "NWADMIN", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc":"2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.assignAdminRole("ABC", "0xf017976fdf1521de2e108e63b423380307f501f8", "NWADMIN", {from: eth.accounts[0]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveAdminRole`

Approves the organization admin or network admin role assignment to an account.
This method can be called by a network admin account.
The role is approved once majority approval is received.

#### Parameters

* `orgId`: organization ID to which the account belongs

* `acctId`: account ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveAdminRole","params":["ABC", "0xf017976fdf1521de2e108e63b423380307f501f8", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.approveAdminRole("ABC", "0xf017976fdf1521de2e108e63b423380307f501f8",  {from: eth.accounts[0]})
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

* `orgId`: organization or sub-organization ID to which the node belongs

* `enodeId`: complete enode ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_addNode","params":["ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id": 10,
          "result":"Action completed successfully"
        }
        ```

    === "geth console request"

        ```javascript
        quorumPermission.addNode("ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407", {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_updateNodeStatus`

Updates the status of the specified node.
This method can be called by an organization admin account.

#### Parameters

* `orgId`: organization or sub-organization ID to which the node belongs

* `enodeId`: complete enode ID

* `action`:
  * 1 - for deactivating the node
  * 2 - for activating a deactivated node
  * 3 - for denylisting a node

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_updateNodeStatus","params":["ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",1, {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.updateNodeStatus("ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407",3, {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_recoverBlackListedNode`

Initiates the recovery of the specified denylisted (blacklisted) node.
This method can be called by a network admin account.
Once majority approval from network admin accounts is received, the denylisted node is marked as active.

#### Parameters

* `orgId`: organization or sub-organization ID to which the node belongs

* `enodeId`: complete enode ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_recoverBlackListedNode","params":["ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.recoverBlackListedNode("ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407", {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_approveBlackListedNodeRecovery`

Approves the recovery of the specified denylisted (blacklisted) node.
This method can be called by a network admin account.
Once majority approval from network admin accounts is received, the denylisted node is marked as active.

#### Parameters

* `orgId`: organization or sub-organization ID to which the node belongs

* `enodeId`: complete enode ID

#### Returns

* `msg`: response message

* `status`: `boolean` - indicates if the operation was a success or failure

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_approveBlackListedNodeRecovery","params":["ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407", {"from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}],"id":10}' --header "Content-Type: application/json"
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
        quorumPermission.approveBlackListedNodeRecovery("ABC.SUB1.SUB2.SUB3", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0&raftport=50407", {from: eth.accounts[1]})
        ```

    === "geth console result"

        ```json
        "Action completed successfully"
        ```

### `quorumPermission_transactionAllowed`

Checks if the account initiating the transaction has sufficient permissions to execute the transaction.

#### Parameters

* `txArgs`: transaction arguments object

#### Returns

* `status`: `boolean` - indicates if transaction is allowed or not

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_transactionAllowed", "params":[ {"from":"0xf2cd20ed7904c103ce2ca0ef73fb77539930c59f"}],"id":50}' --header "Content-Type: application/json"
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
        quorumPermission.transactionAllowed({from: eth.accounts[0]}
        ```

    === "geth console result"

        ```json
        true
        ```

### `quorumPermission_connectionAllowed`

Checks if the specified node is allowed to join the network.

#### Parameters

* `enodeId`: enode ID

* `ipAddress`: IP address of the node

* `portNum`: port number

#### Returns

* `status`: `boolean` - indicating if the connection is allowed or not

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST http://127.0.0.1:22000 --data '{"jsonrpc":"2.0","method":"quorumPermission_connectionAllowed", "params":[ "239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf", "127.0.0.1", 21006],"id":50}' --header "Content-Type: application/json"
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
        quorumPermission.connectionAllowed("579f786d4e2830bbcc02815a27e8a9bacccc9605df4dc6f20bcc1a6eb391e7225fff7cb83e5b4ecd1f3a94d8b733803f2f66b7e871961e7b029e22c155c3a778", "127.0.0.1", 21003)
        ```

    === "geth console result"

        ```json
        true
        ```

### `eth_getUncleCountByBlockNumber`

Returns the number of uncles in a block matching the specified block number.

#### Parameters

`QUANTITY|TAG` - Integer representing either the index of the block within the blockchain, or one
of the string tags `latest`, `earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

#### Returns

`result` : *QUANTITY* - Integer representing the number of uncles in the specified block.

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleCountByBlockNumber","params":["0xe8"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"eth_getUncleCountByBlockNumber","params":["0xe8"],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : "0x1"
        }
        ```

    === "curl GraphQL"

        ```bash
        curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block(number:\"0x59fd\"){ommerCount}}"}' http://localhost:8547/graphql
        ```

    === "GraphQL"

        ```bash
        {
          block(number: "0x59fd") {
            ommerCount
          }
        }
        ```

    === "GraphQL result"

        ```bash
        {
          "data" : {
            "block" : {
              "ommerCount" : 0
            }
          }
        }
        ```

## `CLIQUE` methods

The `CLIQUE` API methods provide access to the [Clique](../HowTo/Configure/Consensus-Protocols/Clique.md) consensus engine.

!!! note

    The `CLIQUE` API methods are not enabled by default for JSON-RPC. To enable the `CLIQUE` API
    methods use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `clique_discard`

Discards a proposal to [add or remove a signer with the specified address].

#### Parameters

`data` - 20-byte address of proposed signer.

#### Returns

`result: boolean` - `true`

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"clique_discard","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"clique_discard","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : true
        }
        ```

### `clique_getSigners`

Lists [signers for the specified block].

#### Parameters

`quantity|tag` - Integer representing a block number or one of the string tags `latest`,
`earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

#### Returns

`result: array of data` - List of 20-byte addresses of signers.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"clique_getSigners","params":["latest"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"clique_getSigners","params":["latest"], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : [ "0x42eb768f2244c8811c63729a21a3569731535f06", "0x7ffc57839b00206d1ad20c69a1981b489f772031", "0xb279182d99e65703f0076e4812653aab85fca0f0" ]
        }
        ```

### `clique_getSignerMetrics`

Provides validator metrics for the specified range:

* Number of blocks from each validator.
* Block number of the last block proposed by each validator (if any proposed in the specified
  range).
* All validators present in the last block.

#### Parameters

`fromBlockNumber` - Integer representing a block number or the string tag `earliest`, as described
in [Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

`toBlockNumber` - Integer representing a block number or one of the string tags `latest` or
`pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter)

If you specify:

* No parameters, the call provides metrics for the last 100 blocks, or all blocks if there are less
  than 100 blocks.
* Only the first parameter, the call provides metrics for all blocks from the block specified to
  the latest block.

#### Returns

`result`: _object_ - List of validator objects.

!!! note

    The proposer of the genesis block has address `0x0000000000000000000000000000000000000000`.

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"clique_getSignerMetrics","params":["1", "100"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"clique_getSignerMetrics","params":["1", "100"], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "address": "0x7ffc57839b00206d1ad20c69a1981b489f772031",
                    "proposedBlockCount": "0x21",
                    "lastProposedBlockNumber": "0x61"
                },
                {
                    "address": "0x42eb768f2244c8811c63729a21a3569731535f06",
                    "proposedBlockCount": "0x21",
                    "lastProposedBlockNumber": "0x63"
                },
                {
                    "address": "0xb279182d99e65703f0076e4812653aab85fca0f0",
                    "proposedBlockCount": "0x21",
                    "lastProposedBlockNumber": "0x62"
                }
            ]
        }
        ```

### `clique_getSignersAtHash`

Lists signers for the specified block.

#### Parameters

`data` - 32-byte block hash.

#### Returns

`result: array of data` - List of 20-byte addresses of signers.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"clique_getSignersAtHash","params":["0x98b2ddb5106b03649d2d337d42154702796438b3c74fd25a5782940e84237a48"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"clique_getSignersAtHash","params":["0x98b2ddb5106b03649d2d337d42154702796438b3c74fd25a5782940e84237a48"], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : [ "0x42eb768f2244c8811c63729a21a3569731535f06", "0x7ffc57839b00206d1ad20c69a1981b489f772031", "0xb279182d99e65703f0076e4812653aab85fca0f0" ]
        }
        ```

### `clique_propose`

Propose to [add or remove a signer with the specified address].

#### Parameters

`data` - 20-byte address.

`boolean` -  `true` to propose adding signer or `false` to propose removing signer.

#### Returns

`result: boolean` - `true`

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"clique_propose","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73", true], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"clique_propose","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73", true], "id":1}
        ```

    === "JSON result"

        ```json
        {
         "jsonrpc" : "2.0",
         "id" : 1,
         "result" : true
        }
        ```

### `clique_proposals`

Returns
[current proposals](../HowTo/Configure/Consensus-Protocols/Clique.md#adding-and-removing-signers).

#### Parameters

None

#### Returns

`result`:_object_ - Map of account addresses to corresponding boolean values indicating the
proposal for each account.

If the boolean value is `true`, the proposal is to add a signer. If `false`, the proposal is to
remove a signer.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"clique_proposals","params":[], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"clique_proposals","params":[], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "0x42eb768f2244c8811c63729a21a3569731535f07": false,
                "0x12eb759f2222d7711c63729a45c3585731521d01": true
            }
        }
        ```

## `DEBUG` methods

The `DEBUG` API methods allow you to inspect and debug the network.
The `DEBUG` API is a more verbose alternative to the [`TRACE` API](#trace-methods), and its main purpose is
compatibility with tools such as [Remix](https://remix.ethereum.org/).
We recommend using the [`TRACE` API](#trace-methods) for production use over the `DEBUG` API.

!!! note

    The `DEBUG` API methods are not enabled by default for JSON-RPC. To enable the `DEBUG` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `debug_accountRange`

[Retesteth](https://github.com/ethereum/retesteth/wiki/Retesteth-Overview) uses
`debug_accountRange` to implement debugging.

Returns the accounts for a specified block.

#### Parameters

`blockHashOrNumber` : `data` - Block hash or number.

`txIndex` : `integer` - Transaction index from which to start.

`address` : `data` - Address hash from which to start.

`limit` : `integer` - Maximum number of account entries to return.

#### Returns

`result`:`object` - Account details:

* `addressMap`:`object` - List of address hashes and account addresses.
* `nextKey`:`data` - Hash of the next address if any addresses remain in the state, otherwise
  zero.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_accountRange","params":["12345", 0, "0", 5],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_accountRange","params":["12345", 0, "0", 5],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "addressMap": {
              "0x005e5...86960": "0x0000000000000000000000000000000000000000",
              "0x021fe...6ffe3": "0x0000000000000000000000000000000000000000",
              "0x028e6...ab776": "0x0000000000000000000000000000000000000000",
              "0x02cb5...bc4d8": "0x0000000000000000000000000000000000000000",
              "0x03089...23fd5": "0x0000000000000000000000000000000000000000"
            },
            "nextKey": "0x04242954a5cb9748d3f66bcd4583fd3830287aa585bebd9dd06fa6625976be49"
          }
        }
        ```

### `debug_batchSendRawTransaction`

Sends a list of [signed transactions](../HowTo/Send-Transactions/Transactions.md).
This is used to quickly load a network with a lot of transactions.
This does the same thing as calling [`eth_sendRawTransaction`](#eth_sendRawTransaction) multiple times.

#### Parameters

`data` -  The signed transaction data array.

#### Returns

`result` : *array* of *objects* - Object returned for each transaction.

Properties of the transaction result object are:

* `index` - The index of the transaction in the request parameters array.
* `success` - A boolean indicating whether or not the transaction has been added to the transaction pool.
* `errorMessage` - An optional error message.

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_batchSendRawTransaction","params":["0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ba0ac74ecfa0e9b85785f042c143ead4780931234cc9a032fce99fab1f45e0d90faa02fd17e8eb433d4ca47727653232045d4f81322619c0852d3fe8ddcfcedb66a43","0x416","0xf868018203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ca0b24ea1bee8fe36984c36acbf80979a4509f23fc17141851e08d505c0df158aa0a00472a05903d4cd7a811bd4d5c59cc105d93f5943f3393f253e92e65fc36e7ce0","0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef5787470de4df820000801ca0f7936b4de04792e3c65095cfbfd1399d231368f5f05f877588c0c8509f6c98c9a01834004dead527c8da1396eede42e1c60e41f38a77c2fd13a6e495479c729b99"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"debug_batchSendRawTransaction","params":["0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ba0ac74ecfa0e9b85785f042c143ead4780931234cc9a032fce99fab1f45e0d90faa02fd17e8eb433d4ca47727653232045d4f81322619c0852d3fe8ddcfcedb66a43","0x416","0xf868018203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ca0b24ea1bee8fe36984c36acbf80979a4509f23fc17141851e08d505c0df158aa0a00472a05903d4cd7a811bd4d5c59cc105d93f5943f3393f253e92e65fc36e7ce0","0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef5787470de4df820000801ca0f7936b4de04792e3c65095cfbfd1399d231368f5f05f877588c0c8509f6c98c9a01834004dead527c8da1396eede42e1c60e41f38a77c2fd13a6e495479c729b99"],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": [
            {
              "index": 0,
              "success": true
            },
            {
              "index": 1,
              "success": false,
              "errorMessage": "Invalid raw transaction hex"
            },
            {
              "index": 2,
              "success": true
            },
            {
              "index": 3,
              "success": false,
              "errorMessage": "TRANSACTION_REPLACEMENT_UNDERPRICED"
            }
          ]
        }
        ```

### `debug_getBadBlocks`

Returns a list of invalid blocks.
This is used to detect and analyze consensus flaws.

#### Parameters

None

#### Returns

`result` : *array* of [block objects](API-Objects.md#block-object)

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_getBadBlocks","params":[],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"debug_getBadBlocks","params":[],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": [
            {
              "block": {
                "number": "0xd",
                "hash": "0x85c2edc1ca74b4863cab46ff6ed4df514a698aa7c29a9bce58742a33af07d7e6",
                "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "parentHash": "0x544a2f7a4c8defc0d8da44aa0c0db7c36b56db2605c01ed266e919e936579d31",
                "nonce": "0x0000000000000000",
                "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "transactionsRoot": "0x02c387e001cbe2a8296bfa2e18afbc3480d0e49588b05556148b0bf7c17dec41",
                "stateRoot": "0x861ab7e868e3c23f84b7c4ed86b52a6a4f063633bc45ef29212c33459df84ea5",
                "receiptsRoot": "0xccd2d33763dc0ac3fe02d4ecbbcd7d2bdc6f57db635ba31007184679303721d7",
                "miner": "0x0000000000000000000000000000000000000000",
                "difficulty": "0x1",
                "totalDifficulty": "0x1",
                "extraData": "0x00000000000000000000000000000000000000000000000000000000000000008c6a091f07e4ba3930f2f5fabbfc5b1c70986319096760ba200a6abc0d30e33c2d501702d1b58d7f75807bdbf981044557628611319121170b96466ec06bb3fd01",
                "size": "0x3a0",
                "gasLimit": "0xffffffffffff",
                "gasUsed": "0x1a488",
                "timestamp": "0x5f5b6824",
                "uncles": [],
                "transactions": [
                  {
                    "blockHash": "0x85c2edc1ca74b4863cab46ff6ed4df514a698aa7c29a9bce58742a33af07d7e6",
                    "blockNumber": "0xd",
                    "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
                    "gas": "0x1a49e",
                    "gasPrice": "0x3e8",
                    "hash": "0xdd8cf045113754c306ba9ac8ac8786235e33bc5c087678084ef260a2a583f127",
                    "input": "0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033",
                    "nonce": "0x0",
                    "to": null,
                    "transactionIndex": "0x0",
                    "value": "0x0",
                    "v": "0xf9d",
                    "r": "0xa7a15050302ca4b7d3842d35cdd3cbf25b2c48c0c37f96d78beb6a6a6bc4f1c7",
                    "s": "0x130d29294b2b6a2b7e89f501eb27772f7abf37bfa28a1ce300daade975589fca"
                  }
                ]
              },
              "hash": "0x85c2edc1ca74b4863cab46ff6ed4df514a698aa7c29a9bce58742a33af07d7e6",
              "rlp": "0xf9039df9025ca0544a2f7a4c8defc0d8da44aa0c0db7c36b56db2605c01ed266e919e936579d31a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0861ab7e868e3c23f84b7c4ed86b52a6a4f063633bc45ef29212c33459df84ea5a002c387e001cbe2a8296bfa2e18afbc3480d0e49588b05556148b0bf7c17dec41a0ccd2d33763dc0ac3fe02d4ecbbcd7d2bdc6f57db635ba31007184679303721d7b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010d86ffffffffffff8301a488845f5b6824b86100000000000000000000000000000000000000000000000000000000000000008c6a091f07e4ba3930f2f5fabbfc5b1c70986319096760ba200a6abc0d30e33c2d501702d1b58d7f75807bdbf981044557628611319121170b96466ec06bb3fd01a00000000000000000000000000000000000000000000000000000000000000000880000000000000000f9013af90137808203e88301a49e8080b8e6608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033820f9da0a7a15050302ca4b7d3842d35cdd3cbf25b2c48c0c37f96d78beb6a6a6bc4f1c7a0130d29294b2b6a2b7e89f501eb27772f7abf37bfa28a1ce300daade975589fcac0"
            },
            {
              "block": {
                "number": "0x8",
                "hash": "0x601a3ae9b6eceb2476d249e1cffe058ba3ff2c9c1b28b1ec7a0259fdd1d90121",
                "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "parentHash": "0x98ae440cd7b904d842daa6c263608969a3c8ce6a9acd6bd1f99b394f5f28a207",
                "nonce": "0x0000000000000000",
                "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "transactionsRoot": "0x8ee998cc699a1f9310a1079458780b3ebee8756f96a0905f5224b89d0eb17486",
                "stateRoot": "0x140a9783291704223eb759e3a0db5471a520d349fc17ac2f77ff8582472e3bac",
                "receiptsRoot": "0x2b5c77f6e7764d2468178fab7253346b9b8bb6a34b63946f6bdc2f5ad398bfc3",
                "miner": "0x0000000000000000000000000000000000000000",
                "difficulty": "0x2",
                "totalDifficulty": "0x2",
                "extraData": "0x00000000000000000000000000000000000000000000000000000000000000004d04551bdd9ae08af1fd661e49d4ab662c98c532c7ec0e4656a27e4de7d330af578ab1e4f5e49e085ff1d78673c7388ed9ccf017fbe89e53066bfa4018142c0701",
                "size": "0x3a0",
                "gasLimit": "0xffffffffffff",
                "gasUsed": "0x1a4c9",
                "timestamp": "0x5f5b6b80",
                "uncles": [],
                "transactions": [
                  {
                    "blockHash": "0x601a3ae9b6eceb2476d249e1cffe058ba3ff2c9c1b28b1ec7a0259fdd1d90121",
                    "blockNumber": "0x8",
                    "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
                    "gas": "0x1a4c9",
                    "gasPrice": "0x3e8",
                    "hash": "0x675e336a4281b29c619dfd4ccfbd2f930f3728b20caf9e0067284aa3224e6758",
                    "input": "0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033",
                    "nonce": "0x0",
                    "to": null,
                    "transactionIndex": "0x0",
                    "value": "0x0",
                    "v": "0xf9d",
                    "r": "0x2e30624c0305e64812e1d9e325ba6e50410314634b008edcb50f45be71fa0d4",
                    "s": "0x50e205faed23c219ba15610de2451d458cbd4221207b2168344cfc972a7973c0"
                  }
                ]
              },
              "hash": "0x601a3ae9b6eceb2476d249e1cffe058ba3ff2c9c1b28b1ec7a0259fdd1d90121",
              "rlp": "0xf9039df9025ca098ae440cd7b904d842daa6c263608969a3c8ce6a9acd6bd1f99b394f5f28a207a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0140a9783291704223eb759e3a0db5471a520d349fc17ac2f77ff8582472e3baca08ee998cc699a1f9310a1079458780b3ebee8756f96a0905f5224b89d0eb17486a02b5c77f6e7764d2468178fab7253346b9b8bb6a34b63946f6bdc2f5ad398bfc3b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020886ffffffffffff8301a4c9845f5b6b80b86100000000000000000000000000000000000000000000000000000000000000004d04551bdd9ae08af1fd661e49d4ab662c98c532c7ec0e4656a27e4de7d330af578ab1e4f5e49e085ff1d78673c7388ed9ccf017fbe89e53066bfa4018142c0701a00000000000000000000000000000000000000000000000000000000000000000880000000000000000f9013af90137808203e88301a4c98080b8e6608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033820f9da002e30624c0305e64812e1d9e325ba6e50410314634b008edcb50f45be71fa0d4a050e205faed23c219ba15610de2451d458cbd4221207b2168344cfc972a7973c0c0"
            }
          ]
        }
        ```

### `debug_standardTraceBlockToFile`

Generates files containing the block trace. A separate file is generated for each
transaction in the block.

You can also specify a trace file for a specific transaction in a block.

Use [`debug_standardTraceBadBlockToFile`](#debug_standardtracebadblocktofile) to view the trace for
an invalid block.

#### Parameters

`blockHash` : `data` - Block hash.

`txHash` : `data` - The transaction hash. Optional. If omitted, then a trace file is generated for each
transaction in the block.

`disableMemory` : `boolean` - Specify whether to capture EVM memory during the trace.
Defaults to `true`.

#### Returns

`result` : `data` - Location of the generated trace files.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_standardTraceBlockToFile","params":["0x2dc0b6c43144e314a86777b4bd4f987c0790a6a0b21560671d221ed81a23f2dc", {
        "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6", "disableMemory": false}], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_standardTraceBlockToFile","params":["0x2dc0b6c43144e314a86777b4bd4f987c0790a6a0b21560671d221ed81a23f2dc", {
        "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6", "disableMemory": false}], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
           "result": [
             "/Users/me/mynode/goerli/data/traces/block_0x2dc0b6c4-4-0x4ff04c4a-1612820117332"
           ]
        }
        ```

### `debug_standardTraceBadBlockToFile`

Generates files containing the block trace of invalid blocks. A separate file is generated for each
transaction in the block.

Use [`debug_standardTraceBlockToFile`](#debug_standardtraceblocktofile) to view the trace for a
valid block.

#### Parameters

`blockHash` : `data` - Block hash.

#### Returns

`result` : `data` - Location of the generated trace files.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_standardTraceBadBlockToFile","params":["0x53741e9e94791466d117c5f9e41a2ed1de3f73d39920c621dfc2f294e7779baa"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_standardTraceBadBlockToFile","params":["0x53741e9e94791466d117c5f9e41a2ed1de3f73d39920c621dfc2f294e7779baa"], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
           "result": [
             "/Users/me/mynode/goerli/data/traces/block_0x53741e9e-0-0x407ec43d-1600951088172"
           ]
        }
        ```

### `debug_storageRangeAt`

[Remix](https://remix.ethereum.org/) uses `debug_storageRangeAt` to implement debugging. Use the
_Debugger_ tab in Remix instead of calling `debug_storageRangeAt` directly.

Returns the contract storage for the specified range.

#### Parameters

`blockHash` : `data` - Block hash.

`txIndex` : `integer` - Transaction index from which to start.

`address` : `data` - Contract address.

`startKey` : `hash` - Start key.

`limit` : `integer` - Number of storage entries to return.

#### Returns

`result`:`object` - [Range object](API-Objects.md#range-object).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_storageRangeAt","params":["0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c",0,"0x0e0d2c8f7794e82164f11798276a188147fbd415","0x0000000000000000000000000000000000000000000000000000000000000000",1], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_storageRangeAt","params":["0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c",0,"0x0e0d2c8f7794e82164f11798276a188147fbd415","0x0000000000000000000000000000000000000000000000000000000000000000",1], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "storage": {
                    "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563": {
                        "key": null,
                        "value": "0x0000000000000000000000000000000000000000000000000000000000000001"
                    }
                },
                "nextKey": "0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6"
            }
        }
        ```

### `debug_metrics`

Returns metrics providing information on the internal operation of Besu.

The available metrics might change over time. The JVM metrics might vary based on the JVM
implementation used.

The metric types are:

* Timer
* Counter
* Gauge.

#### Parameters

None

#### Returns

`result`:`object`

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_metrics","params":[],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_metrics","params":[],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "jvm": {
                    "memory_bytes_init": {
                        "heap": 268435456,
                        "nonheap": 2555904
                    },
                    "threads_current": 41,
                    "memory_bytes_used": {
                        "heap": 696923976,
                        "nonheap": 63633456
                    },
                    "memory_pool_bytes_used": {
                        "PS Eden Space": 669119360,
                        "Code Cache": 19689024,
                        "Compressed Class Space": 4871144,
                        "PS Survivor Space": 2716320,
                        "PS Old Gen": 25088296,
                        "Metaspace": 39073288
                    },
                    ...
                },
                "process": {
                    "open_fds": 546,
                    "cpu_seconds_total": 67.148992,
                    "start_time_seconds": 1543897699.589,
                    "max_fds": 10240
                },
                "rpc": {
                    "request_time": {
                        "debug_metrics": {
                            "bucket": {
                                "+Inf": 2,
                                "0.01": 1,
                                "0.075": 2,
                                "0.75": 2,
                                "0.005": 1,
                                "0.025": 2,
                                "0.1": 2,
                                "1.0": 2,
                                "0.05": 2,
                                "10.0": 2,
                                "0.25": 2,
                                "0.5": 2,
                                "5.0": 2,
                                "2.5": 2,
                                "7.5": 2
                            },
                            "count": 2,
                            "sum": 0.015925392
                        }
                    }
                },
                "blockchain": {
                    "difficulty_total": 3533501,
                    "announcedBlock_ingest": {
                        "bucket": {
                            "+Inf": 0,
                            "0.01": 0,
                            "0.075": 0,
                            "0.75": 0,
                            "0.005": 0,
                            "0.025": 0,
                            "0.1": 0,
                            "1.0": 0,
                            "0.05": 0,
                            "10.0": 0,
                            "0.25": 0,
                            "0.5": 0,
                            "5.0": 0,
                            "2.5": 0,
                            "7.5": 0
                        },
                        "count": 0,
                        "sum": 0
                    },
                    "height": 1908793
                },
                "peers": {
                    "disconnected_total": {
                        "remote": {
                            "SUBPROTOCOL_TRIGGERED": 5
                        },
                        "local": {
                            "TCP_SUBSYSTEM_ERROR": 1,
                            "SUBPROTOCOL_TRIGGERED": 2,
                            "USELESS_PEER": 3
                        }
                    },
                    "peer_count_current": 2,
                    "connected_total": 10
                }
            }
        }
        ```

### `debug_traceTransaction`

[Remix](https://remix.ethereum.org/) uses `debug_traceTransaction` to implement debugging. Use the
_Debugger_ tab in Remix instead of calling `debug_traceTransaction` directly.

Reruns the transaction with the same state as when the transaction executed.

#### Parameters

`transactionHash` : `data` - Transaction hash.

`Object` - request options (all optional and default to `false`):

* `disableStorage` : `boolean` - `true` disables storage capture.
* `disableMemory` : `boolean` - `true` disables memory capture.
* `disableStack` : `boolean` - `true` disables stack capture.

#### Returns

`result`:`object` - [Trace object](API-Objects.md#trace-object).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceTransaction","params":["0x2cc6c94c21685b7e0f8ddabf277a5ccf98db157c62619cde8baea696a74ed18e",{"disableStorage":true}],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_traceTransaction","params":["0x2cc6c94c21685b7e0f8ddabf277a5ccf98db157c62619cde8baea696a74ed18e",{"disableStorage":true}],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : {
            "gas" : 21000,
            "failed" : false,
            "returnValue" : "",
            "structLogs" : [ {
              "pc" : 0,
              "op" : "STOP",
              "gas" : 0,
              "gasCost" : 0,
              "depth" : 1,
              "stack" : [ ],
              "memory" : [ ],
              "storage" : null
            } ]
          }
        }
        ```

### `debug_traceBlock`

Returns full trace of all invoked opcodes of all transactions included in the block.

#### Parameters

`Block` : `data` - RLP of the block.

`Object` - request options (all optional and default to `false`):

* `disableStorage` : `boolean` - `true` disables storage capture.
* `disableMemory` : `boolean` - `true` disables memory capture.
* `disableStack` : `boolean` - `true` disables stack capture.

#### Returns

`result`:`object` - [Trace object](API-Objects.md#trace-object).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceBlock","params":["0xf90277f90208a05a41d0e66b4120775176c09fcf39e7c0520517a13d2b57b18d33d342df038bfca01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794e6a7a1d47ff21b6321162aea7c6cb457d5476bcaa00e0df2706b0a4fb8bd08c9246d472abbe850af446405d9eba1db41db18b4a169a04513310fcb9f6f616972a3b948dc5d547f280849a87ebb5af0191f98b87be598a0fe2bf2a941abf41d72637e5b91750332a30283efd40c424dc522b77e6f0ed8c4b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000860153886c1bbd82b44382520b8252088455c426598b657468706f6f6c2e6f7267a0b48c515a9dde8d346c3337ea520aa995a4738bb595495506125449c1149d6cf488ba4f8ecd18aab215f869f86780862d79883d2000825208945df9b87991262f6ba471f09758cde1c0fc1de734827a69801ca088ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0a045e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33ac0"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_traceBlock","params":["0xf90277f90208a05a41d0e66b4120775176c09fcf39e7c0520517a13d2b57b18d33d342df038bfca01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794e6a7a1d47ff21b6321162aea7c6cb457d5476bcaa00e0df2706b0a4fb8bd08c9246d472abbe850af446405d9eba1db41db18b4a169a04513310fcb9f6f616972a3b948dc5d547f280849a87ebb5af0191f98b87be598a0fe2bf2a941abf41d72637e5b91750332a30283efd40c424dc522b77e6f0ed8c4b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000860153886c1bbd82b44382520b8252088455c426598b657468706f6f6c2e6f7267a0b48c515a9dde8d346c3337ea520aa995a4738bb595495506125449c1149d6cf488ba4f8ecd18aab215f869f86780862d79883d2000825208945df9b87991262f6ba471f09758cde1c0fc1de734827a69801ca088ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0a045e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33ac0"],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : {
            "gas" : 21000,
            "failed" : false,
            "returnValue" : "",
            "structLogs" : [ {
              "pc" : 0,
              "op" : "STOP",
              "gas" : 0,
              "gasCost" : 0,
              "depth" : 1,
              "stack" : [ ],
              "memory" : [ ],
              "storage" : null
            } ]
          }
        }
        ```

### `debug_traceBlockByHash`

Returns full trace of all invoked opcodes of all transactions included in the block.

#### Parameters

`block hash` : `data` - Block hash.

`Object` - request options (all optional and default to `false`):

* `disableStorage` : `boolean` - `true` disables storage capture.
* `disableMemory` : `boolean` - `true` disables memory capture.
* `disableStack` : `boolean` - `true` disables stack capture.

#### Returns

`result`:`array of objects` - [Trace objects](API-Objects.md#trace-object).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceBlockByHash","params":["0xaceb3b2c9b25b0589230873921eb894b28722011b8df63977145517d754875a5"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_traceBlockByHash","params":["0xaceb3b2c9b25b0589230873921eb894b28722011b8df63977145517d754875a5"], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "gas": 21000,
                    "failed": false,
                    "returnValue": "",
                    "structLogs": [
                        {
                            "pc": 0,
                            "op": "STOP",
                            "gas": 0,
                            "gasCost": 0,
                            "depth": 1,
                            "stack": [],
                            "memory": [],
                            "storage": {},
                            "reason": null
                        }
                    ]
                }
            ]
        }
        ```

### `debug_traceBlockByNumber`

Returns full trace of all invoked opcodes of all transactions included in the block.

#### Parameters

`quantity|tag` - Integer representing a block number or one of the string tags `latest`,
`earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

`Object` - request options (all optional and default to `false`):

* `disableStorage` : `boolean` - `true` disables storage capture.
* `disableMemory` : `boolean` - `true` disables memory capture.
* `disableStack` : `boolean` - `true` disables stack capture.

#### Returns

`result`:`array of objects` - [Trace objects](API-Objects.md#trace-object).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceBlockByNumber","params":["0x7224",{"disableStorage":true}], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"debug_traceBlockByNumber","params":["0x7224",{"disableStorage":true}], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "gas": 21000,
                    "failed": false,
                    "returnValue": "",
                    "structLogs": [
                        {
                            "pc": 0,
                            "op": "STOP",
                            "gas": 0,
                            "gasCost": 0,
                            "depth": 1,
                            "stack": [],
                            "memory": [],
                            "storage": null,
                            "reason": null
                        }
                    ]
                }
            ]
        }
        ```

## `MINER` methods

The `MINER` API methods allow you to control the node’s mining operation.

!!! note

    The `MINER` API methods are not enabled by default for JSON-RPC. To enable the `MINER` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### miner_changeTargetGasLimit

Updates the target gas limit set using the [`--target-gas-limit`](CLI/CLI-Syntax.md#target-gas-limit)
command line option.

#### Parameters

`integer` : `quantity` - The target gas price in Wei.

#### Returns

`result` - `Success` or `error`.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"miner_changeTargetGasLimit","params":[800000], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"miner_changeTargetGasLimit","params":[800000], "id":1}
        ```

    === "JSON result"

        ```json
        {
           "jsonrpc" : "2.0",
           "id" : 1,
           "result" : "Success"
        }
        ```

### `miner_start`

Starts the mining process. To start mining, you must first specify a miner coinbase using the
[`--miner-coinbase`](CLI/CLI-Syntax.md#miner-coinbase) command line option.

#### Parameters

None

#### Returns

`result` :  `boolean` - `true` if mining starts, or if the node was already mining.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"miner_start","params":[],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"miner_start","params":[],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": true
        }
        ```

### `miner_stop`

Stops the mining process on the client.

#### Parameters

None

#### Returns

`result` :  `boolean` - `true` if mining stops, or if the node was not mining.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"miner_stop","params":[],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"miner_stop","params":[],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": true
        }
        ```

## `IBFT` 2.0 methods

The `IBFT` API methods provide access to the [IBFT 2.0](../HowTo/Configure/Consensus-Protocols/IBFT.md) consensus engine.

!!! note

    The `IBFT` API methods are not enabled by default for JSON-RPC. To enable the `IBFT` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `ibft_discardValidatorVote`

Discards a proposal to [add or remove a validator] with the specified address.

#### Parameters

`data` - 20-byte address of proposed validator.

#### Returns

`result: boolean` - `true`

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_discardValidatorVote","params":["0xef1bfb6a12794615c9b0b5a21e6741f01e570185"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"ibft_discardValidatorVote","params":["0xef1bfb6a12794615c9b0b5a21e6741f01e570185"], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : true
        }
        ```

### `ibft_getPendingVotes`

Returns [votes](../HowTo/Configure/Consensus-Protocols/IBFT.md#adding-and-removing-validators)
cast in the current [epoch](../HowTo/Configure/Consensus-Protocols/IBFT.md#genesis-file).

#### Parameters

None

#### Returns

`result`: `object` - Map of account addresses to corresponding boolean values indicating the vote
for each account.

If the boolean value is `true`, the vote is to add a validator. If `false`, the proposal is to
remove a validator.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getPendingVotes","params":[], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"ibft_getPendingVotes","params":[], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "0xef1bfb6a12794615c9b0b5a21e6741f01e570185": true,
                "0x42d4287eac8078828cf5f3486cfe601a275a49a5": true
            }
        }
        ```

### `ibft_getValidatorsByBlockHash`

Lists the validators defined in the specified block.

#### Parameters

`data` - 32-byte block hash.

#### Returns

`result: array of data` - List of validator addresses.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockHash","params":["0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockHash","params":["0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
                "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
                "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
            ]
        }
        ```

### `ibft_getValidatorsByBlockNumber`

Lists the validators defined in the specified block.

#### Parameters

`quantity|tag` - Integer representing a block number or one of the string tags `latest`,
`earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

#### Returns

`result: array of data` - List of validator addresses.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockNumber","params":["latest"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockNumber","params":["latest"], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
                "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
                "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
            ]
        }
        ```

### `ibft_proposeValidatorVote`

Propose to [add or remove a validator] with the specified address.

#### Parameters

`data` - Account address

`boolean` -  `true` to propose adding validator or `false` to propose removing validator.

#### Returns

`result: boolean` - `true`

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_proposeValidatorVote","params":["42d4287eac8078828cf5f3486cfe601a275a49a5",true], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"ibft_proposeValidatorVote","params":["42d4287eac8078828cf5f3486cfe601a275a49a5",true], "id":1}
        ```

    === "JSON result"

        ```json
        {
         "jsonrpc" : "2.0",
         "id" : 1,
         "result" : true
        }
        ```

### `ibft_getSignerMetrics`

Provides validator metrics for the specified range:

* Number of blocks from each validator.
* Block number of the last block proposed by each validator (if any proposed in the specified
  range).
* All validators present in the last block of the range.

#### Parameters

`fromBlockNumber` - Integer representing a block number or the string tag `earliest` as described
in [Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

`toBlockNumber` - Integer representing a block number or one of the string tags `latest` or
`pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter)

If you specify:

* No parameters, the call provides metrics for the last 100 blocks, or all blocks if there are less
  than 100 blocks.
* Only the first parameter, the call provides metrics for all blocks from the block specified to
  the latest block.

#### Returns

`result`: _object_ - List of validator objects

!!! note

    The proposer of the genesis block has address `0x0000000000000000000000000000000000000000`.

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getSignerMetrics","params":["1", "100"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"ibft_getSignerMetrics","params":["1", "100"], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "address": "0x7ffc57839b00206d1ad20c69a1981b489f772031",
                    "proposedBlockCount": "0x21",
                    "lastProposedBlockNumber": "0x61"
                },
                {
                    "address": "0x42eb768f2244c8811c63729a21a3569731535f06",
                    "proposedBlockCount": "0x21",
                    "lastProposedBlockNumber": "0x63"
                },
                {
                    "address": "0xb279182d99e65703f0076e4812653aab85fca0f0",
                    "proposedBlockCount": "0x21",
                    "lastProposedBlockNumber": "0x62"
                }
            ]
        }
        ```

## `PERM` (Permissioning) methods

The `PERM` API methods provide permissioning functionality.
Use these methods for [local permissioning](../HowTo/Limit-Access/Local-Permissioning.md) only.

!!! important

    The `PERM` API methods are not enabled by default for JSON-RPC. To enable the `PERM` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) CLI options.

### `perm_addAccountsToAllowlist`

Adds accounts (participants) to the
[accounts permission list](../HowTo/Limit-Access/Local-Permissioning.md#account-permissioning).

#### Parameters

`list of strings` - List of account addresses.

!!! note

    The parameters list contains a list which is why the account addresses are enclosed by double
    square brackets.

#### Returns

`result` - `Success` or `error`. Errors include attempting to add accounts already on the
allowlist or including invalid account addresses.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"perm_addAccountsToAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"perm_addAccountsToAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "Success"
        }
        ```

### `perm_getAccountsAllowlist`

Lists accounts (participants) in the
[accounts permissions list](../HowTo/Limit-Access/Local-Permissioning.md#account-permissioning).

#### Parameters

None

#### Returns

`result: list` - Accounts (participants) in the accounts allowlist.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"perm_getAccountsAllowlist","params":[], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"perm_getAccountsAllowlist","params":[], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                "0x0000000000000000000000000000000000000009",
                "0xb9b81ee349c3807e46bc71aa2632203c5b462033"
            ]
        }
        ```

### `perm_removeAccountsFromAllowlist`

Removes accounts (participants) from the
[accounts permissions list](../HowTo/Limit-Access/Local-Permissioning.md#account-permissioning).

#### Parameters

`list of strings` - List of account addresses.

!!! note

    The parameters list contains a list which is why the account addresses are enclosed by double
    square brackets.

#### Returns

`result` - `Success` or `error`. Errors include attempting to remove accounts not on the allowlist
or including invalid account addresses.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"perm_removeAccountsFromAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"perm_removeAccountsFromAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "Success"
        }
        ```

### `perm_addNodesToAllowlist`

Adds nodes to the
[nodes allowlist](../HowTo/Limit-Access/Local-Permissioning.md#node-allowlisting).

#### Parameters

`list of strings` - List of [enode URLs](../Concepts/Node-Keys.md#enode-url).

!!! note

    The parameters list contains a list which is why the enode URLs are enclosed by double
    square brackets.

#### Returns

`result` - `Success` or `error`. Errors include attempting to add nodes already on the allowlist or
including invalid enode URLs.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"perm_addNodesToAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"perm_addNodesToAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "Success"
        }
        ```

### `perm_getNodesAllowlist`

Lists nodes in the
[nodes allowlist](../HowTo/Limit-Access/Local-Permissioning.md#node-allowlisting).

#### Parameters

None

#### Returns

`result: list` - [Enode URLs](../Concepts/Node-Keys.md#enode-url) of nodes in the nodes allowlist.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"perm_getNodesAllowlist","params":[], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"perm_getNodesAllowlist","params":[], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                "enode://7b61d5ee4b44335873e6912cb5dd3e3877c860ba21417c9b9ef1f7e500a82213737d4b269046d0669fb2299a234ca03443f25fe5f706b693b3669e5c92478ade@127.0.0.1:30305",
                "enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"
            ]
        }
        ```

### `perm_removeNodesFromAllowlist`

Removes nodes from the
[nodes allowlist](../HowTo/Limit-Access/Local-Permissioning.md#node-allowlisting).

#### Parameters

`list of strings` - List of [enode URLs](../Concepts/Node-Keys.md#enode-url)

!!! note

    The parameters list contains a list which is why the enode URLs are enclosed by double square
    brackets.

#### Returns

`result` - `Success` or `error`. Errors include attempting to remove nodes not on the allowlist
or including invalid enode URLs.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"perm_removeNodesFromAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"perm_removeNodesFromAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "Success"
        }
        ```

### `perm_reloadPermissionsFromFile`

Reloads the accounts and nodes allowlists from the [permissions configuration file].

#### Parameters

None

#### Returns

`result` - `Success`, or `error` if the permissions configuration file is not valid.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"perm_reloadPermissionsFromFile","params":[], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"perm_reloadPermissionsFromFile","params":[], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "Success"
        }
        ```

## `TXPOOL` methods

The `TXPOOL` API methods allow you to inspect the contents of the transaction pool.

!!! note

    The `TXPOOL` API methods are not enabled by default for JSON-RPC. To enable the `TXPOOL` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `txpool_besuPendingTransactions`

Lists pending transactions that match the supplied filter conditions.

#### Parameters

* `QUANTITY` - Integer representing the maximum number of results to return.
* Object of fields used to create the filter condition.

Each field in the object corresponds to a field name containing an operator, and a value for the
operator. A field name can only be specified once, and can only contain one operator.
For example, you cannot query transactions with a gas price between 8 and 9 Gwei by using both the
`gt` and `lt` operator in the same field name instance.

All filters must be satisfied for a transaction to be returned.

| Field name   | Value                                     | Value type            | Supported operators |
|--------------|-------------------------------------------|:---------------------:|---------------------|
| **from**     | Address of the sender.                    | *Data*, 20&nbsp;bytes | `eq`                |
| **to**       | Address of the receiver, or `"contract_creation"`.| *Data*, 20&nbsp;bytes |`eq`, `action`|
| **gas**      | Gas provided by the sender.               | *Quantity*            | `eq`, `gt`, `lt`    |
| **gasPrice** | Gas price, in wei, provided by the sender.| *Quantity*            | `eq`, `gt`, `lt`    |
| **value**    | Value transferred, in wei.                | *Quantity*            | `eq`, `gt`, `lt`    |
| **nonce**    | Number of transactions made by the sender.| *Quantity*            | `eq`, `gt`, `lt`    |
|

Supported operators:

* `eq` (Equal to)
* `lt` (Less than)
* `gt` (Greater than)
* `action`

!!! note
    The only supported `action` is `"contract_creation"`.

#### Returns

`result` - Array of objects with [details of the pending transaction](API-Objects.md#pending-transaction-object).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{
           "jsonrpc":"2.0",
           "method":"txpool_besuPendingTransactions",
           "params":[
              2,
              {
                 "from":{
                    "eq":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
                 },
                 "gas":{
                    "lt":"0x5209"
                 },
                 "nonce":{
                    "gt":"0x1"
                 }
              }
           ],
           "id":1
        }' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {
           "jsonrpc":"2.0",
           "method":"txpool_besuPendingTransactions",
           "params":[
              2,
              {
                 "from":{
                    "eq":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
                 },
                 "gas":{
                    "lt":"0x5209"
                 },
                 "nonce":{
                    "gt":"0x1"
                 }
              }
           ],
           "id":1
        }
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": [
            {
              "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
              "gas": "0x5208",
              "gasPrice": "0xab5d04c00",
              "hash": "0xb7b2f4306c1c228ec94043da73b582594007091a7dfe024b1f8d6d772284e54b",
              "input": "0x",
              "nonce": "0x2",
              "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
              "value": "0x0",
              "v": "0xfe8",
              "r": "0x5beb711e652c6cf0a589d3cea904eefc4f45ce4372652288701d08cc4412086d",
              "s": "0x3af14a56e63aa5fb7dcb444a89708363a9d2c1eba1f777c67690288415080ded"
            }
          ]
        }
        ```

### `txpool_besuStatistics`

Lists statistics about the node transaction pool.

#### Parameters

None

#### Returns

`result` - Transaction pool statistics:

* `maxSize` - Maximum number of transactions kept in the transaction pool. Use the
  [`--tx-pool-max-size`](CLI/CLI-Syntax.md#tx-pool-max-size) option to configure the maximum size.
* `localCount` - Number of transactions submitted directly to this node.
* `remoteCount` - Number of transactions received from remote nodes.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_besuStatistics","params":[],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"txpool_besuStatistics","params":[],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "maxSize": 4096,
                "localCount": 1,
                "remoteCount": 0
            }
        }
        ```

### `txpool_besuTransactions`

Lists transactions in the node transaction pool.

#### Parameters

None

#### Returns

`result` - List of transactions.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_besuTransactions","params":[],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"txpool_besuTransactions","params":[],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "hash": "0x8a66830098be4006a3f63a03b6e9b67aa721e04bd6b46d420b8f1937689fb4f1",
                    "isReceivedFromLocalSource": true,
                    "addedToPoolAt": "2019-03-21T01:35:50.911Z"
                },
                {
                    "hash": "0x41ee803c3987ceb5bcea0fad7a76a8106a2a6dd654409007d9931032ea54579b",
                    "isReceivedFromLocalSource": true,
                    "addedToPoolAt": "2019-03-21T01:36:00.374Z"
                }
            ]
        }
        ```

## `TRACE` methods

The `TRACE` API is a more concise alternative to the [`DEBUG` API](#debug-methods).

!!! note

    The `TRACE` API methods are not enabled by default for JSON-RPC. To enable the `TRACE` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `trace_replayBlockTransactions`

Provides transaction processing tracing per block.

!!! important

    Your node must be an archive node (that is, synchronized without pruning or fast sync) or the
    requested block must be within [the number of pruning blocks retained](../CLI/CLI-Syntax#pruning-blocks-retained)
    (by default, 1024).

#### Parameters

`quantity|tag` - Integer representing a block number or one of the string tags `latest`,
`earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

`array of strings` - Tracing options are
[`trace`, `vmTrace`, and `stateDiff`](Trace-Types.md). Specify any
combination of the three options including none of them.

#### Returns

`result` - Array of [transaction trace objects](API-Objects.md#transaction-trace-object) containing
one object per transaction, in transaction execution order.

If revert reason is enabled with [`--revert-reason-enabled`](CLI/CLI-Syntax.md#revert-reason-enabled),
the [`trace`](Trace-Types.md#trace) list items in the returned transaction trace object include the
[revert reason](../HowTo/Send-Transactions/Revert-Reason.md).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0", "method": "trace_replayBlockTransactions","params": ["0x12",["trace","vmTrace","stateDiff"]],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc": "2.0", "method": "trace_replayBlockTransactions","params": ["0x12",["trace","vmTrace","stateDiff"]],"id": 1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result":[
              {
                "output":"0x",
                "vmTrace":{
                  "code":"0x7f3940be4289e4c3587d88c1856cc95352461992db0a584c281226faefe560b3016000527f14c4d2c102bdeb2354bfc3dc96a95e4512cf3a8461e0560e2272dbf884ef3905601052600851",
                  "ops":[
                    {
                      "cost":3,
                      "ex":{
                        "mem":null,
                        "push":[
                          "0x8"
                        ],
                        "store":null,
                        "used":16756175
                      },
                      "pc":72,
                      "sub":null
                    },
                    ...
                  ]
                },
                "trace":[
                  {
                    "action":{
                      "callType":"call",
                      "from":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
                      "gas":"0xffadea",
                      "input":"0x",
                      "to":"0x0100000000000000000000000000000000000000",
                      "value":"0x0"
                    },
                    "result":{
                      "gasUsed":"0x1e",
                      "output":"0x"
                    },
                    "subtraces":0,
                    "traceAddress":[
                    ],
                    "type":"call"
                  }
                ],
                "stateDiff":{
                  "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73":{
                    "balance":{
                      "*":{
                        "from":"0xffffffffffffffffffffffffffffffffc3e12a20b",
                        "to":"0xffffffffffffffffffffffffffffffffc3dc5f091"
                      }
                    },
                    "code":"=",
                    "nonce":{
                      "*":{
                        "from":"0x14",
                        "to":"0x15"
                      }
                    },
                    "storage":{
                    }
                  }
                },
                "transactionHash":"0x2a5079cc535c429f668f13a7fb9a28bdba6831b5462bd04f781777b332a8fcbd",
              },
              {...}
            ]
        }
        ```

### `trace_block`

Provides transaction processing of [type `trace`](Trace-Types.md#trace) for the specified block.

!!! important

    Your node must be an archive node (that is, synchronized without pruning or fast sync) or the
    requested block must be within [the number of pruning blocks retained](../CLI/CLI-Syntax#pruning-blocks-retained)
    (by default, 1024).

#### Parameters

`quantity|tag` - Integer representing a block number or one of the string tags `latest`,
`earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

#### Returns

`result` - List of [calls to other contracts](Trace-Types.md#trace) containing
one object per call, in transaction execution order.

If revert reason is enabled with [`--revert-reason-enabled`](CLI/CLI-Syntax.md#revert-reason-enabled),
the returned list items include the [revert reason](../HowTo/Send-Transactions/Revert-Reason.md).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"trace_block","params":["0x6"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"trace_block","params":["0x6"],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "result": [
              {
                "action": {
                  "callType": "call",
                  "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
                  "gas": "0xffad82",
                  "input": "0x0000000000000000000000000000000000000999",
                  "to": "0x0020000000000000000000000000000000000000",
                  "value": "0x0"
                },
                "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
                "blockNumber": 6,
                "result": {
                  "gasUsed": "0x7536",
                  "output": "0x"
                },
                "subtraces": 1,
                "traceAddress": [],
                "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
                "transactionPosition": 0,
                "type": "call"
              },
              {
                "action": {
                  "address": "0x0020000000000000000000000000000000000000",
                  "balance": "0x300",
                  "refundAddress": "0x0000000000000999000000000000000000000000"
                },
                "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
                "blockNumber": 6,
                "result": null,
                "subtraces": 0,
                "traceAddress": [
                  0
                ],
                "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
                "transactionPosition": 0,
                "type": "suicide"
              },
              {
                "action": {
                  "author": "0x0000000000000000000000000000000000000000",
                  "rewardType": "block",
                  "value": "0x1bc16d674ec80000"
                },
                "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
                "blockNumber": 6,
                "result": null,
                "subtraces": 0,
                "traceAddress": [],
                "transactionHash": null,
                "transactionPosition": null,
                "type": "reward"
              }
            ],
            "id": 1
          }
        ```

### `trace_transaction`

Provides transaction processing of [type `trace`](Trace-Types.md#trace) for the specified transaction.

!!! important

    Your node must be an archive node (that is, synchronized without pruning or fast sync) or the
    requested transaction must be contained in a block within
    [the number of pruning blocks retained](../CLI/CLI-Syntax#pruning-blocks-retained) (by default, 1024).

#### Parameters

`data` : Transaction hash

#### Returns

`result` - Array of [calls to other contracts](Trace-Types.md#trace) containing
one object per call, in the order called by the transaction.

If revert reason is enabled with [`--revert-reason-enabled`](CLI/CLI-Syntax.md#revert-reason-enabled),
the returned list items include the [revert reason](../HowTo/Send-Transactions/Revert-Reason.md).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0", "method": "trace_transaction","params": ["0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7"],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc": "2.0", "method": "trace_transaction","params": ["0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7"],"id": 1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "result": [
              {
                "action": {
                  "creationMethod": "create",
                  "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
                  "gas": "0xff2e26",
                  "init": "0x60006000600060006000732c2b9c9a4a25e24b174f26114e8926a9f2128fe45af2600060006000600060007300a00000000000000000000000000000000000005af2",
                  "value": "0x0"
                },
                "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
                "blockNumber": 19,
                "result": {
                  "address": "0x30753e4a8aad7f8597332e813735def5dd395028",
                  "code": "0x",
                  "gasUsed": "0x1c39"
                },
                "subtraces": 2,
                "traceAddress": [],
                "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
                "transactionPosition": 3,
                "type": "create"
              },
              {
                "action": {
                  "callType": "callcode",
                  "from": "0x30753e4a8aad7f8597332e813735def5dd395028",
                  "gas": "0xfb2ea9",
                  "input": "0x",
                  "to": "0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4",
                  "value": "0x0"
                },
                "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
                "blockNumber": 19,
                "result": {
                  "gasUsed": "0x138e",
                  "output": "0x"
                },
                "subtraces": 1,
                "traceAddress": [
                  0
                ],
                "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
                "transactionPosition": 3,
                "type": "call"
              },
              {
                "action": {
                  "address": "0x30753e4a8aad7f8597332e813735def5dd395028",
                  "balance": "0x0",
                  "refundAddress": "0x0000000000000000000000000000000000000000"
                },
                "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
                "blockNumber": 19,
                "result": null,
                "subtraces": 0,
                "traceAddress": [
                  0,
                  0
                ],
                "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
                "transactionPosition": 3,
                "type": "suicide"
              },
              {
                "action": {
                  "callType": "callcode",
                  "from": "0x30753e4a8aad7f8597332e813735def5dd395028",
                  "gas": "0xfb18a5",
                  "input": "0x",
                  "to": "0x00a0000000000000000000000000000000000000",
                  "value": "0x0"
                },
                "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
                "blockNumber": 19,
                "result": {
                  "gasUsed": "0x30b",
                  "output": "0x"
                },
                "subtraces": 0,
                "traceAddress": [
                  1
                ],
                "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
                "transactionPosition": 3,
                "type": "call"
              }
            ],
            "id": 1
        }
        ```

## `EEA` methods

The `EEA` API methods provide functionality for [private transactions](../Concepts/Privacy/Private-Transactions.md) and
[privacy groups](../Concepts/Privacy/Privacy-Groups.md).

!!! note

    The `EEA` API methods are not enabled by default for JSON-RPC. To enable the `EEA` API methods,
    use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `eea_sendRawTransaction`

Distributes the
[private transaction](../HowTo/Send-Transactions/Creating-Sending-Private-Transactions.md),
generates the [privacy marker transaction](../Concepts/Privacy/Private-Transaction-Processing.md)
and submits it to the transaction pool, and returns the transaction hash of the
[privacy marker transaction](../Concepts/Privacy/Private-Transaction-Processing.md).

The signed transaction passed as an input parameter includes the `privateFrom`,
[`privateFor` or `privacyGroupId`](../HowTo/Send-Transactions/Creating-Sending-Private-Transactions.md#eea-compliant-or-besu-extended-privacy),
and `restriction` fields.

The `gas` and `gasPrice` are used by the [privacy marker transaction](../Concepts/Privacy/Private-Transaction-Processing.md)
not the private transaction itself.

To avoid exposing your private key, create signed transactions offline and send the signed
transaction data using `eea_sendRawTransaction`.

!!! important

    For production systems requiring private transactions, use a network with a consensus mechanism
    supporting transaction finality to make sure the private state does not become inconsistent
    with the chain. For example, [IBFT 2.0](../HowTo/Configure/Consensus-Protocols/IBFT.md)
    provides the required finality.

    Using private transactions with [pruning](../Concepts/Pruning.md) or
    [fast sync](CLI/CLI-Syntax.md#sync-mode) is not supported.

    Besu does not implement
    [`eea_sendTransaction`](../HowTo/Send-Transactions/Account-Management.md).

    [EthSigner](https://docs.ethsigner.consensys.net/en/latest/) provides transaction signing and
    implements [`eea_sendTransaction`](https://docs.ethsigner.consensys.net/en/latest/Using-EthSigner/Using-EthSigner/#eea_sendtransaction).

#### Parameters

`data` -  Signed RLP-encoded private transaction. For example:

`params: ["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"]`

#### Returns

`result` : `data` - 32-byte transaction hash of the
[Privacy Marker Transaction](../Concepts/Privacy/Private-Transaction-Processing.md).

!!! tip

    If creating a contract, use [priv_getTransactionReceipt](#priv_gettransactionreceipt) to
    retrieve the contract address after the transaction is finalized.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"eea_sendRawTransaction","params": ["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"eea_sendRawTransaction","params": ["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "id":1,
          "jsonrpc": "2.0",
          "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
        }
        ```

## `PRIV` methods

The `PRIV` API methods provide functionality for [private transactions](../Concepts/Privacy/Private-Transactions.md) and
[privacy groups](../Concepts/Privacy/Privacy-Groups.md).

!!! note

    The `PRIV` API methods are not enabled by default for JSON-RPC. To enable the `PRIV` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `priv_call`

Invokes a private contract function locally and does not change the privacy group state.

For private contracts, `priv_call` is the same as [`eth_call`](#eth_call) for public contracts.

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`object` - [Transaction call object](API-Objects.md#transaction-call-object).

`quantity|tag` - Integer representing a block number or one of the string tags `latest`,
`earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

#### Returns

`result` : `data` - Return value of the executed contract.

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_call","params":["tb8NVyQqZnHNegf/3mYsyB+HEud4SPWn90rz3GoskRw=", {"to":"0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13","data": "0x3fa4f245"}, "latest"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"priv_call","params":["tb8NVyQqZnHNegf/3mYsyB+HEud4SPWn90rz3GoskRw=", {"to":"0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13","data": "0x3fa4f245"}, "latest"],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0x0000000000000000000000000000000000000000000000000000000000000001"
        }
        ```

    === "curl GraphQL"

        ```bash
        curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block {number call (data : {from : \"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b\", to: \"0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13\", data :\"0x12a7b914\"}){data status}}}"}' http://localhost:8547/graphql
        ```

    === "GraphQL"

        ```bash
        {
          block {
            number
            call(data: {from: "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", to: "0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13", data: "0x12a7b914"}) {
              data
              status
            }
          }
        }
        ```

    === "GraphQL result"

        ```json
        {
          "data" : {
            "block" : {
              "number" : 17449,
              "call" : {
                "data" : "0x",
                "status" : 1
              }
            }
          }
        }
        ```

### `priv_debugGetStateRoot`

Returns the state root of the specified privacy group at the specified block.

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`quantity|tag` - Integer representing a block number or one of the string tags `latest`,
`earliest`, or `pending`, as described in
[Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

#### Returns

`result` : `data` - 32-byte state root.

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_debugGetStateRoot","params":["xJdxvWOEmrs2MCkKWlgArTzWIXFfU/tmVxI3EKssVTk=","latest"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"priv_debugGetStateRoot","params":["xJdxvWOEmrs2MCkKWlgArTzWIXFfU/tmVxI3EKssVTk=","latest"],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc" : "2.0",
          "id" : 1,
          "result" : "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
        }

        ```

### `priv_distributeRawTransaction`

Distributes a signed, RLP encoded
[private transaction](../HowTo/Send-Transactions/Creating-Sending-Private-Transactions.md).

!!! tip

    If you want to sign the Privacy Marker Transaction outside of Besu,
    use [`priv_distributeRawTransaction`](..//HowTo/Send-Transactions/Creating-Sending-Private-Transactions.md#priv_distributerawtransaction)
    instead of [`eea_sendRawTransaction`](#eea_sendrawtransaction).

#### Parameters

`data` -  Signed RLP-encoded private transaction. For example:

`params: ["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"]`

#### Returns

`result` : `data` - 32-byte enclave key. The enclave key is a pointer to the private transaction in
[Orion](https://docs.orion.consensys.net/).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_distributeRawTransaction","params": ["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"priv_distributeRawTransaction","params": ["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": "0xfd0d90ab824574abc19c0776ca0210e764561d0ef6d621f2bbbea316eccfe56b"
        }
        ```

### `priv_getEeaTransactionCount`

Returns the private transaction count for the specified account and
[group of sender and recipients].

!!! important

    If sending more than one transaction to be mined in the same block (that is, you are not
    waiting for the transaction receipt), you must calculate the private transaction nonce outside
    Besu instead of using `priv_getEeaTransactionCount`.

#### Parameters

`data` - Account address.

`data` - Base64 encoded Orion address of the sender.

`array of data` - Base64 encoded Orion addresses of recipients.

#### Returns

`quantity` - Integer representing the number of private transactions sent from the address to the
specified group of sender and recipients.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_getEeaTransactionCount","params":["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "GGilEkXLaQ9yhhtbpBT03Me9iYa7U/mWXxrJhnbl1XY=", ["KkOjNLmCI6r+mICrC6l+XuEDjFEzQllaMQMpWLl4y1s=","eLb69r4K8/9WviwlfDiZ4jf97P9czyS3DkKu0QYGLjg="]], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"priv_getEeaTransactionCount","params":["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "GGilEkXLaQ9yhhtbpBT03Me9iYa7U/mWXxrJhnbl1XY=", ["KkOjNLmCI6r+mICrC6l+XuEDjFEzQllaMQMpWLl4y1s=","eLb69r4K8/9WviwlfDiZ4jf97P9czyS3DkKu0QYGLjg="]], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": "0x1"
        }
        ```

### `priv_getFilterChanges`

Polls the specified filter for a private contract and returns an array of changes that have occurred
since the last poll.

Filters for private contracts can only be created by [`priv_newFilter`](#priv_newfilter) so unlike
[`eth_getFilterChanges`](#eth_getfilterchanges), `priv_getFilterChanges` always returns an array
of log objects or an empty list.

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`data` - Filter ID.

#### Returns

`array` - [Log objects](API-Objects.md#log-object). If nothing has changed since the last poll, an
empty list.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0","method": "priv_getFilterChanges","params": ["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=","0x4a35b92809d73f4f53a2355d62125442"],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc": "2.0","method": "priv_getFilterChanges","params": ["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=","0x4a35b92809d73f4f53a2355d62125442"],"id": 1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "logIndex": "0x0",
                    "removed": false,
                    "blockNumber": "0x4d0",
                    "blockHash": "0x1c8200667a869e99b945374c37277b5ee7a7ae67943e13c82563381387553dbb",
                    "transactionHash": "0xb1966b9b372ba68952f48f3a3e78f036f5ae82ceca2de972a782d07fb88f6d88",
                    "transactionIndex": "0x0",
                    "address": "0x991cc548c154b2953cc48c02f782e1314097dfbb",
                    "data": "0x",
                    "topics": [
                        "0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }
            ]
        }
        ```

### `priv_getFilterLogs`

Returns an array of [logs](../Concepts/Events-and-Logs.md) for the specified filter for a private
contract.

For private contracts, `priv_getFilterLogs` is the same as [`eth_getFilterLogs`](#eth_getfilterlogs)
for public contracts except there is no [automatic log bloom caching](CLI/CLI-Syntax.md#auto-log-bloom-caching-enabled)
for private contracts.

!!! note

    `priv_getFilterLogs` is only used for filters created with [`priv_newFilter`](#priv_newfilter).
    To specify a filter object and get logs without creating a filter, use [`priv_getLogs`](#priv_getlogs).

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`data` - Filter ID.

#### Returns

`array` - [Log objects](API-Objects.md#log-object).

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0","method": "priv_getFilterLogs","params":["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=","0x4a35b92809d73f4f53a2355d62125442"],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc": "2.0","method": "priv_getFilterLogs","params":["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=","0x4a35b92809d73f4f53a2355d62125442"],"id": 1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "logIndex": "0x0",
                    "removed": false,
                    "blockNumber": "0x493",
                    "blockHash": "0xd9cb3a852e1e02c95f035a2e32d57f82c10cab61faa3e8f5c010adf979bb4786",
                    "transactionHash": "0x78866dc51fdf189d8cca74f6a8fe54f172348fbd2163bbe80fa8b106cfc7deb4",
                    "transactionIndex": "0x0",
                    "address": "0x991cc548c154b2953cc48c02f782e1314097dfbb",
                    "data": "0x",
                    "topics": [
                        "0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                },
                {
                    "logIndex": "0x0",
                    "removed": false,
                    "blockNumber": "0x4d0",
                    "blockHash": "0x1c8200667a869e99b945374c37277b5ee7a7ae67943e13c82563381387553dbb",
                    "transactionHash": "0xb1966b9b372ba68952f48f3a3e78f036f5ae82ceca2de972a782d07fb88f6d88",
                    "transactionIndex": "0x0",
                    "address": "0x991cc548c154b2953cc48c02f782e1314097dfbb",
                    "data": "0x",
                    "topics": [
                        "0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }
            ]
        }
        ```

### `priv_getLogs`

Returns an array of [logs](../Concepts/Events-and-Logs.md) matching a specified filter object.

For private contracts, `priv_getLogs` is the same as [`eth_getLogs`](#eth_getlogs) for public contracts
except there is no [automatic log bloom caching](CLI/CLI-Syntax.md#auto-log-bloom-caching-enabled)
for private contracts.

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`Object` - [Filter options object](API-Objects.md#filter-options-object).

#### Returns

`array` - [Log objects](API-Objects.md#log-object).

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0","method": "priv_getLogs","params":["vGy/TZgO6y8VPMVeJAQ99MF1NaTf5ohA3TFfzoEF71k=",{"fromBlock": "earliest","toBlock": "latest","addresses": ["0x630c507ff633312087dc33c513b66276abcd2fc3"],"topics": ["0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410"]}],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc": "2.0","method": "priv_getLogs","params":["vGy/TZgO6y8VPMVeJAQ99MF1NaTf5ohA3TFfzoEF71k=",{"fromBlock": "earliest","toBlock": "latest","addresses": ["0x630c507ff633312087dc33c513b66276abcd2fc3"],"topics": ["0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410"]}],"id": 1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": [
                {
                    "logIndex": "0x0",
                    "removed": false,
                    "blockNumber": "0x342",
                    "blockHash": "0xf5954f068fa2f2f7741281e8c753a8e92047e27ab3c4971836d2c89fab86d92b",
                    "transactionHash": "0xa9ba5cffde9d4ad8997c5c4352d5d49eeea0e9def8a4ea69991b8837c49d4e4f",
                    "transactionIndex": "0x0",
                    "address": "0x630c507ff633312087dc33c513b66276abcd2fc3",
                    "data": "0x",
                    "topics": [
                        "0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                },
                {
                    "logIndex": "0x0",
                    "removed": false,
                    "blockNumber": "0x383",
                    "blockHash": "0x91b73a47d53e3a88d62ed091a89a4be7557ad91b552e7ff7d86bf78977d5d45d",
                    "transactionHash": "0xc2a185faf00e87434e55b7f70cc4c38be354c2128b4b96b5f5def0b54a2173ec",
                    "transactionIndex": "0x0",
                    "address": "0x630c507ff633312087dc33c513b66276abcd2fc3",
                    "data": "0x",
                    "topics": [
                        "0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }
            ]
        }
        ```

### `priv_getPrivacyPrecompileAddress`

Returns the address of the
[privacy precompiled contract](../Concepts/Privacy/Private-Transaction-Processing.md). The address
is derived and based on the value of the [`privacy-onchain-groups-enabled`](CLI/CLI-Syntax.md#privacy-onchain-groups-enabled)
option.

#### Parameters

None

#### Returns

`result` : `data` - Address of the privacy precompile.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_getPrivacyPrecompileAddress","params":[], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"priv_getPrivacyPrecompileAddress","params":[], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0x000000000000000000000000000000000000007e"
        }
        ```

### `priv_getPrivateTransaction`

Returns the private transaction if you are a participant, otherwise, `null`.

#### Parameters

`data` - Transaction hash returned by [`eea_sendRawTransaction`](#eea_sendrawtransaction) or
[`eea_sendTransaction`](https://docs.ethsigner.consensys.net/en/latest/Using-EthSigner/Using-EthSigner/#eea_sendtransaction).

#### Returns

Object - [Private transaction object](API-Objects.md#private-transaction-object), or `null` if not
a participant in the private transaction.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_getPrivateTransaction","params":["0x623c4ce5275a87b91f4f1c521012d39ca19311c787bde405490f4c0426a71498"], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"priv_getPrivateTransaction","params":["0x623c4ce5275a87b91f4f1c521012d39ca19311c787bde405490f4c0426a71498"], "id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
                "gas": "0x2dc6c0",
                "gasPrice": "0x0",
                "hash": "0x623c4ce5275a87b91f4f1c521012d39ca19311c787bde405490f4c0426a71498",
                "input": "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610221806100606000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fa4f2451461005c5780636057361d1461008757806367e404ce146100b4575b600080fd5b34801561006857600080fd5b5061007161010b565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b260048036038101908080359060200190929190505050610115565b005b3480156100c057600080fd5b506100c96101cb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600254905090565b7fc9db20adedc6cf2b5d25252b101ab03e124902a73fcb12b753f3d1aaa2d8f9f53382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18060028190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600a165627a7a723058208efaf938851fb2d235f8bf9a9685f149129a30fe0f4b20a6c1885dc02f639eba0029",
                "nonce": "0x0",
                "to": null,
                "value": "0x0",
                "v": "0xfe8",
                "r": "0x654a6a9663ca70bb13e27cca14b3777cc92da184e19a151cdeef2ccbbd5c6405",
                "s": "0x5dd4667b020c8a5af7ae28d4c3126f8dcb1187f49dcf0de9d7a39b1651892eef",
                "privateFrom": "negmDcN2P4ODpqn/6WkJ02zT/0w0bjhGpkZ8UP6vARk=",
                "privateFor": [
                    "g59BmTeJIn7HIcnq8VQWgyh/pDbvbt2eyP0Ii60aDDw="
                ],
                "restriction": "restricted"
            }
        }
        ```

### `priv_createPrivacyGroup`

Creates a group of nodes, specified by their [Orion](https://docs.orion.consensys.net/) public key.

#### Parameters

`Object` - Request options:

* `addresses`: `array of data` - Array of nodes, specified by
  [Orion](https://docs.orion.consensys.net/) public keys.
* `name`: `string` - Privacy group name. Optional.
* `description`: `string` - Privacy group description. Optional.

#### Returns

Privacy group ID

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method": "priv_createPrivacyGroup", "params": [{"addresses":["sTZpbQhcOfd9ZaFDnC00e/N2Ofv9p4/ZTBbEeVtXJ3E=","quhb1pQPGN1w8ZSZSyiIfncEAlVY/M/rauSyQ5wVMRE="],"name":"Group A","description":"Description Group A"}],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method": "priv_createPrivacyGroup", "params": [{"addresses":["sTZpbQhcOfd9ZaFDnC00e/N2Ofv9p4/ZTBbEeVtXJ3E=","quhb1pQPGN1w8ZSZSyiIfncEAlVY/M/rauSyQ5wVMRE="],"name":"Group A","description":"Description Group A"}],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": "ewuTVoc5nlvWMwTFdRRK/wvV0dcyQo/Pauvx5bNEbTk="
        }
        ```

### `priv_deletePrivacyGroup`

Deletes the specified privacy group.

#### Parameters

`data` - Privacy group ID

#### Returns

Privacy group ID that was deleted.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_deletePrivacyGroup","params":["ewuTVoc5nlvWMwTFdRRK/wvV0dcyQo/Pauvx5bNEbTk="],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"priv_deletePrivacyGroup","params":["ewuTVoc5nlvWMwTFdRRK/wvV0dcyQo/Pauvx5bNEbTk="],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 53,
          "result": "ewuTVoc5nlvWMwTFdRRK/wvV0dcyQo/Pauvx5bNEbTk="
        }
        ```

### `priv_findPrivacyGroup`

Returns a list of privacy groups containing only the listed members. For example, if the listed
members are A and B, a privacy group containing A, B, and C is not returned.

#### Parameters

`array of data` - Members specified by [Orion](https://docs.orion.consensys.net/) public keys.

#### Returns

Privacy groups containing only the specified members. Privacy groups are
[EEA-compliant](../Concepts/Privacy/Privacy-Groups.md#enterprise-ethereum-alliance-privacy)
or [Besu-extended](../Concepts/Privacy/Privacy-Groups.md#besu-extended-privacy) with types:

* `LEGACY` for EEA-compliant groups.
* `PANTHEON` for Besu-extended groups.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0","method": "priv_findPrivacyGroup","params": [["negmDcN2P4ODpqn/6WkJ02zT/0w0bjhGpkZ8UP6vARk=", "g59BmTeJIn7HIcnq8VQWgyh/pDbvbt2eyP0Ii60aDDw="]],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc": "2.0","method": "priv_findPrivacyGroup","params": [["negmDcN2P4ODpqn/6WkJ02zT/0w0bjhGpkZ8UP6vARk=", "g59BmTeJIn7HIcnq8VQWgyh/pDbvbt2eyP0Ii60aDDw="]],"id": 1}
        ```

    === "JSON result"

        ```json
        {
         "jsonrpc": "2.0",
         "id": 1,
         "result": [
           {
             "privacyGroupId": "GpK3ErNO0xF27T0sevgkJ3+4qk9Z+E3HtXYxcKIBKX8=",
             "name": "Group B",
             "description": "Description of Group B",
             "type": "PANTHEON",
             "members": [
               "negmDcN2P4ODpqn/6WkJ02zT/0w0bjhGpkZ8UP6vARk=",
               "g59BmTeJIn7HIcnq8VQWgyh/pDbvbt2eyP0Ii60aDDw="
             ]
           }
        ]
        }
        ```

### `priv_getCode`

Returns the code of the private smart contract at the specified address. Compiled smart contract code
is stored as a hexadecimal value.

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`data` - 20-byte contract address.

`quantity|tag` - Integer representing a block number or one of the string tags `latest`, `earliest`,
or `pending`, as described in [Block Parameter](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#block-parameter).

#### Returns

`result` : `data` - Code stored at the specified address.

!!! example

    === "curl HTTP"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_getCode","params":["1lJxSIP4JOp6uRn9wYsPeWwqoOP1c4nPQjylB4FExUA=", "0xeaf1c1bd00ef0bec5e39fba81740f1c5d05aa201", "latest"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS"

        ```bash
        {"jsonrpc":"2.0","method":"priv_getCode","params":["1lJxSIP4JOp6uRn9wYsPeWwqoOP1c4nPQjylB4FExUA=", "0xeaf1c1bd00ef0bec5e39fba81740f1c5d05aa201", "latest"],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0x60806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633fa4f2458114604d57806355241077146071575b600080fd5b348015605857600080fd5b50605f6088565b60408051918252519081900360200190f35b348015607c57600080fd5b506086600435608e565b005b60005481565b60008190556040805182815290517f199cd93e851e4c78c437891155e2112093f8f15394aa89dab09e38d6ca0727879181900360200190a1505600a165627a7a723058209d8929142720a69bde2ab3bfa2da6217674b984899b62753979743c0470a2ea70029"
        }
        ```

### `priv_getTransactionCount`

Returns the private transaction count for specified account and privacy group.

!!! important

    If sending more than one transaction to be mined in the same block (that is, you are not
    waiting for the transaction receipt), you must calculate the private transaction nonce outside
    Besu instead of using `priv_getTransactionCount`.

#### Parameters

`data` - Account address.

`data` - Privacy group ID.

#### Returns

`quantity` - Integer representing the number of private transactions sent from the address to the
specified privacy group.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_getTransactionCount","params":["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "kAbelwaVW7okoEn1+okO+AbA4Hhz/7DaCOWVQz9nx5M="], "id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"priv_getTransactionCount","params":["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "kAbelwaVW7okoEn1+okO+AbA4Hhz/7DaCOWVQz9nx5M="], "id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": "0x1"
        }
        ```

### `priv_getTransactionReceipt`

Returns information about the private transaction after mining the transaction. Receipts for
pending transactions are not available.

#### Parameters

`data` - 32-byte hash of a transaction.

#### Returns

`Object` - [Private Transaction receipt object](API-Objects.md#private-transaction-receipt-object),
or `null` if no receipt found.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"priv_getTransactionReceipt","params":["0xf3ab9693ad92e277bf785e1772f29fb1864904bbbe87b0470455ddb082caab9d"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"priv_getTransactionReceipt","params":["0xf3ab9693ad92e277bf785e1772f29fb1864904bbbe87b0470455ddb082caab9d"],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "blockHash": "0xe7212a92cfb9b06addc80dec2a0dfae9ea94fd344efeb157c41e12994fcad60a",
                "blockNumber": "0x50",
                "contractAddress": "0x493b76031593402e24e16faa81f677b58e2d53f3",
                "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
                "logs": [],
                "to": "0xf17f52151ebef6c7334fad080c5704d77216b732",
                "transactionHash": "0x36219e92b5f53d4150aa9ef7d2d793118cced523de6724100da5b534e3ceb4b8",
                "transactionIndex": "0x0",
                "output": "0x6080604052600436106049576000357c010000000000000000000000000000000000000000000
                0000000000000900463ffffffff1680633fa4f24514604e57806355241077146076575b600080fd5b3480156059
                57600080fd5b50606060a0565b6040518082815260200191505060405180910390f35b348015608157600080fd5b
                50609e6004803603810190808035906020019092919050505060a6565b005b60005481565b8060008190555050560
                0a165627a7a723058202bdbba2e694dba8fff33d9d0976df580f57bff0a40e25a46c398f8063b4c00360029",
                "commitmentHash": "0x79b9e6b0856db398ad7dc208f15b1d38c0c0b0c5f99e4a443a2c5a85510e96a5",
                "status": "0x1",
                "privateFrom": "negmDcN2P4ODpqn/6WkJ02zT/0w0bjhGpkZ8UP6vARk=",
                "privacyGroupId": "cD636RZlcqVSpoxT/ExbkWQfBO7kPAZO0QlWHErNSL8=",
                "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            }
        }
        ```

### `priv_newFilter`

Creates a [log filter](../Concepts/Events-and-Logs.md) for a private contract. To poll for logs associated with the
created filter, use [`priv_getFilterChanges`](#priv_getfilterchanges). To get all logs associated with
the filter, use [`priv_getFilterLogs`](#priv_getfilterlogs).

For private contracts, `priv_newFilter` is the same as [`eth_newFilter`](#eth_newfilter)
for public contracts.

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`Object` - [Filter options object](API-Objects.md#filter-options-object).

!!! note

    `fromBlock` and `toBlock` in the filter options object default to `latest`.

#### Returns

`data` - Filter ID.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0","method": "priv_newFilter","params": ["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=",{"fromBlock": "earliest","toBlock": "latest","addresses": ["0x991cc548c154b2953cc48c02f782e1314097dfbb"],"topics": ["0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410"]}],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc": "2.0","method": "priv_newFilter","params": ["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=",{"fromBlock": "earliest","toBlock": "latest","addresses": ["0x991cc548c154b2953cc48c02f782e1314097dfbb"],"topics": ["0x85bea11d86cefb165374e0f727bacf21dc2f4ea816493981ecf72dcfb212a410"]}],"id": 1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": "0x4a35b92809d73f4f53a2355d62125442"
        }
        ```

### `priv_uninstallFilter`

Uninstalls a filter for a private contract with the specified ID. When a filter is no longer required,
call this method.

Filters time out when not requested by [`priv_getFilterChanges`](#priv_getfilterchanges) or [`priv_getFilterLogs`](#priv_getfilterlogs) for 10
minutes.

For private contracts, `priv_uninstallFilter` is the same as [`eth_uninstallFilter`](#eth_uninstallfilter)
for public contracts.

#### Parameters

`data` - 32-byte [privacy Group ID](../Concepts/Privacy/Privacy-Groups.md).

`data` - Filter ID.

#### Returns

`Boolean` - `true` if the filter was successfully uninstalled, otherwise `false`.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc": "2.0","method": "priv_uninstallFilter","params":["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=","0x4a35b92809d73f4f53a2355d62125442"],"id": 1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc": "2.0","method": "priv_uninstallFilter","params":["4rFldHM792LeP/e2WPkTXZedjwKuTr/KwCFTt6mBbkI=","0x4a35b92809d73f4f53a2355d62125442"],"id": 1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": true
        }
        ```

## `PLUGINS` methods

The `PLUGINS` API methods provide plugin-related functionality.

!!! note

    The `PLUGINS` API methods are not enabled by default for JSON-RPC. To enable the `PLUGINS` API
    methods, use the [`--rpc-http-api`](CLI/CLI-Syntax.md#rpc-http-api) or
    [`--rpc-ws-api`](CLI/CLI-Syntax.md#rpc-ws-api) options.

### `plugins_reloadPluginConfig`

Reloads specified plugin configuration.

#### Parameters

`string` - Plugin

#### Returns

`string` - `Success`

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"plugins_reloadPluginConfig","params":["tech.pegasys.plus.plugin.kafka.KafkaPlugin"],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"plugins_reloadPluginConfig","params":["tech.pegasys.plus.plugin.kafka.KafkaPlugin"],"id":1}
        ```

    === "JSON result"

        ```json
        {
          "jsonrpc": "2.0",
          "id": 1,
          "result": "Success"
        }
        ```

## Miscellaneous methods

### `rpc_modules`

Lists [enabled APIs](../HowTo/Interact/APIs/Using-JSON-RPC-API.md#api-methods-enabled-by-default)
and the version of each.

#### Parameters

None

#### Returns

Enabled APIs.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X POST --data '{"jsonrpc":"2.0","method":"rpc_modules","params":[],"id":1}' http://127.0.0.1:8545
        ```

    === "wscat WS request"

        ```bash
        {"jsonrpc":"2.0","method":"rpc_modules","params":[],"id":1}
        ```

    === "JSON result"

        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "web3": "1.0",
                "eth": "1.0",
                "net": "1.0"
            }
        }
        ```

<!-- Links -->
*[PTM]: Private Transaction Manager (for example, Tessera)
