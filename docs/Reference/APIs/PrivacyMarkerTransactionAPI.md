---
title: Privacy Marker Transaction  API
description: API for supporting privacy marker transactions
---

# Privacy Marker Transaction API

## APIs

### `eth_getPrivateTransactionByHash`

Retrieve the details of a private transaction that is executed by a privacy marker transaction.

!!! note
    Goes to Tessera to retrieve the private data associated with the privacy marker transaction,
    so needs Tessera online at time of transaction retrieval.

#### Parameters

* hash of the privacy marker transaction

#### Returns

* private transaction (will be nil if caller is not a participant)

#### Examples

!!! examples "JSON RPC example"

    === "Request"

        ```bash
        curl -X POST http://localhost:22000 --data '{ "jsonrpc":"2.0", "id":2, "method":"eth_getPrivateTransactionByHash", "params": ["0xcb1f39245a88d5be49dca35e1a34a11f98bcb825ea4aa70829923ff5404c8a82"]}' --header "Content-Type: application/json"
        ```

    === "Response"

        ```json
        {"jsonrpc":"2.0","id":2,"result":{"blockHash":"0x7b2b52bf505e27e8a93249c589d8e93c68b20c589f27fd98ddeb53083fcd3276","blockNumber":"0x5","from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","gas":"0x47b760","gasPrice":"0x0","hash":"0x7cb8fbda0c76632ee801e27cc3ef5445378cf65cc0c36ffaf79b738c16d6ff18","input":"0xc23a8cc005b977ff5b736f8fa670e3a68c0ce4c9609494a9d482d12b2bae9a5037fdad0164d0e6fd21527e20363507262e528eb3187a0f0a1f097eaaedc845b7","nonce":"0x3","to":null,"transactionIndex":"0x0","value":"0x0","v":"0x25","r":"0xef2562c04b2da7a90007068990b5279d6cb468e5347d40fe0aaa523485367bff","s":"0x3530a3a6188cb0a3ebcfce29ada3ff3ed59976e6c88d1557f48554dfc0c3849e"}}
        ```

!!! examples "`geth` console example"

    === "Request"

        ```javascript
        eth.getPrivateTransaction("0xcb1f39245a88d5be49dca35e1a34a11f98bcb825ea4aa70829923ff5404c8a82");
        ```

    === "Response"

        ```json
        {
          blockHash: "0x7b2b52bf505e27e8a93249c589d8e93c68b20c589f27fd98ddeb53083fcd3276",
          blockNumber: 5,
          from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
          gas: 4700000,
          gasPrice: 0,
          hash: "0x7cb8fbda0c76632ee801e27cc3ef5445378cf65cc0c36ffaf79b738c16d6ff18",
          input: "0xc23a8cc005b977ff5b736f8fa670e3a68c0ce4c9609494a9d482d12b2bae9a5037fdad0164d0e6fd21527e20363507262e528eb3187a0f0a1f097eaaedc845b7",
          nonce: 3,
          r: "0xef2562c04b2da7a90007068990b5279d6cb468e5347d40fe0aaa523485367bff",
          s: "0x3530a3a6188cb0a3ebcfce29ada3ff3ed59976e6c88d1557f48554dfc0c3849e",
          to: null,
          transactionIndex: 0,
          v: "0x25",
          value: 0
        }
        ```

### `eth_getPrivateTransactionReceipt`

Retrieve the receipt for a private transaction that is executed by a privacy marker transaction.

#### Parameters

* hash of the privacy marker transaction

#### Returns

* private transaction receipt (will be nil if caller is not a participant)

#### Examples

!!! examples "JSON RPC example"

    === "Request"

        ```bash
        curl -X POST http://localhost:22000 --data '{ "jsonrpc":"2.0", "id":2, "method":"eth_getPrivateTransactionReceipt", "params": ["0xcb1f39245a88d5be49dca35e1a34a11f98bcb825ea4aa70829923ff5404c8a82"]}' --header "Content-Type: application/json"
        ```

    === "Response"

        ```json
        {"jsonrpc":"2.0","id":2,"result":{"blockHash":"0x7b2b52bf505e27e8a93249c589d8e93c68b20c589f27fd98ddeb53083fcd3276","blockNumber":"0x5","contractAddress":"0xd9d64b7dc034fafdba5dc2902875a67b5d586420","cumulativeGasUsed":"0x0","from":"0xed9d02e382b34818e88b88a309c7fe71e65f419d","gasUsed":"0x0","logs":[],"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","status":"0x1","to":null,"transactionHash":"0xcb1f39245a88d5be49dca35e1a34a11f98bcb825ea4aa70829923ff5404c8a82","transactionIndex":"0x0"}}
        ```

!!! examples "`geth` console example"

    === "Request"

        ```javascript
        eth.getPrivateTransactionReceipt("0xcb1f39245a88d5be49dca35e1a34a11f98bcb825ea4aa70829923ff5404c8a82");
        ```

    === "Response"

        ```json
        {
          blockHash: "0x7b2b52bf505e27e8a93249c589d8e93c68b20c589f27fd98ddeb53083fcd3276",
          blockNumber: 5,
          contractAddress: "0xd9d64b7dc034fafdba5dc2902875a67b5d586420",
          cumulativeGasUsed: 0,
          from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
          gasUsed: 0,
          logs: [],
          logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: "0x1",
          to: null,
          transactionHash: "0xcb1f39245a88d5be49dca35e1a34a11f98bcb825ea4aa70829923ff5404c8a82",
          transactionIndex: 0
        }
        ```

### `eth_distributePrivateTransaction`

Send a private transaction to the local private transaction manager, for distribution to participants.
This API method is used by clients when creating externally signed private transactions.

!!! note
    Two step process:

    1. Performs the same as eth_sendRawPrivateTransaction (simulation and calling `/sendsignedtx`), but doesn’t submit private transaction to txpool.
    2. Sends the private transaction to Tessera to generate a hash, which should be placed in the privacy marker transaction.

#### Parameters

* serialised private transaction
* privacy data object:
  - `privateFor`: `List<String>`  - an array of the recipients' base64-encoded public keys.
  - `privacyFlag`: `Number` - (optional) `0` for SP (default if not provided), `1` for PP, `3` for PSV

#### Returns

* Tessera hash to be used in the privacy marker transaction.

#### Example

!!! example "Javascript"

    ```js
    const txnParams = {
        gasPrice: 0,
        gasLimit: 4300000,
        value: 0,
        data: '0x' + tesseraPayloadHash,
        from: decryptedAcc.address,
        nonce: nonceValue
    };
    const txn = new ethereumjsTx(txnParams);
    txn.sign(Buffer.from(decryptedAcc.privateKey.substring(2), "hex"))
    signedTxHex = '0x' + txn.serialize().toString('hex');
    const privateSignedTx = txnMngr.setPrivate(signedTxHex)
    const privateSignedTxHex = `0x${privateSignedTx.toString("hex")}`;

    txnMngr.distributePrivateTransaction(privateSignedTxHex, {privateFor: [PARTICIPANT1_PUBLIC_KEY, PARTICIPANT2_PUBLIC_KEY]})
        .then(tesseraPrivTxnHash => {
            console.log("Stored private transaction in local Tessera, hash: ", tesseraPrivTxnHash);
        })
        .catch(error => {
            console.log("ERROR: Could not distribute private transaction: ", error)
        });
    ```

### `eth_getPrivacyPrecompileAddress`

Get the address of the privacy precompile, to be used as the 'To' address for privacy marker transactions.

#### Parameters

None

#### Returns

* contract address for the privacy precompile

#### Examples

!!! examples "JSON RPC example"

    === "Request"

        ```bash
        curl -X POST http://localhost:22000 --data '{ "jsonrpc":"2.0", "id":2, "method":"eth_getPrivacyPrecompileAddress"}' --header "Content-Type: application/json"
        ```

    === "Response"

        ```json
        {"jsonrpc":"2.0","id":2,"result":"0x000000000000000000000000000000000000007e"}
        ```

!!! examples "`geth` console example"

    === "Request"

        ```javascript
        eth.getPrivacyPrecompileAddress();
        ```

    === "Response"

        ```json
        "0x000000000000000000000000000000000000007e"
        ```
