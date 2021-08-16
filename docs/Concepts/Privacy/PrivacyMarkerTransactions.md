---
title: Privacy Marker Transactions
description: Privacy Marker Transactions are an alternative method of processing private transactions.
---

# Privacy Marker Transactions

## Overview

GoQuorum v21.??.? introduces a new method for processing private transactions, which can be used instead of the normal private transaction flow.
This makes use of a new type of public transaction referred to as a *privacy marker transaction (PMT)*.
Only the public privacy marker transaction is added to the chain. The private transaction is stored in the [Privacy Manager (Tessera)](PrivateTransactionManager.md) and is only available to the participants.

This functionality is enabled using a new command line flag and genesis flag (see [How To Use]).

The advantages of using a Privacy Marker Transaction over a normal Private Transaction are as follows:

* The contract address is hidden from public view.
* The private transaction receipt is only visible to participants of the private transaction.
* The private transaction itself is stored in the private transaction manager and is only visible to participants.

The Privacy Marker Transaction makes use of a new precompiled contract held in GoQuorum.

## Concepts

### Privacy Marker Transaction

A public transaction with the following properties:

* `to` = [privacy precompile] address
* `input`/`data` = sender address + Tessera hash of encrypted [internal private transaction]
* `from` = must be the same signing acount as the [internal private transaction]
* `contractAddress` (in receipt, if contract creation transaction) = null
* `logs` & `logsBloom` (in receipt) = empty

```json
> eth.getTransaction("0x5b7f615e47a8a607ba2b11598f3eccb9be7ac43875f50abd54bdbbcfaeccbb79")
{
  ...
  blockNumber: 121,
  hash: "0x5b7f615e47a8a607ba2b11598f3eccb9be7ac43875f50abd54bdbbcfaeccbb79",
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
  to: "0x000000000000000000000000000000000000007a",
  input: "0xd174e0b4ddc86936479655ec5c218530c0270afcff1c337caa81e12610f2182d95c642bf297d65592078d7c5509dc0cb0d3c01ea1a5bc4110c004603702d3d8c",
  nonce: 2,
  r: "0x35ea14362403065174863c07d8de5e9f85c365f19ddde7f907f44ebacba6f63a",
  s: "0x1d3c2a8b8342fc086501a9e95361430b221d80e2f4076b6c37f52dac47fff0f0",
  v: "0x38",
  transactionIndex: 0,
  ...
}
> eth.getTransactionReceipt("0x5b7f615e47a8a607ba2b11598f3eccb9be7ac43875f50abd54bdbbcfaeccbb79")
{
  ...
  blockNumber: 121,
  transactionHash: "0x5b7f615e47a8a607ba2b11598f3eccb9be7ac43875f50abd54bdbbcfaeccbb79",
  contractAddress: null,
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
  to: "0x000000000000000000000000000000000000007a",
  logs: [],
  logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  status: "0x1",
  transactionIndex: 0,
  ...
}
```

### Internal Private Transaction

Each privacy marker transaction has a corresponding internal private transaction.
The content of this private transaction is the same as the content of a normal private transaction, however it will have the same `from` and `nonce` values as the privacy marker transaction.

Only the hash of the encrypted internal private transaction is stored on chain (as part of the `data` field of the privacy marker transaction).  The internal private transaction is stored, encrypted, in each participant's Tessera. As a result, the internal private transaction is only available to participants of the private transaction.

At execution time, GoQuorum retrieves the internal private transaction from Tessera. See [Flows] for more information.

[New API Methods] have been added to enable clients to retrieve the decrypted internal private transaction and corresponding receipt.

```json
> eth.getPrivateTransaction("0x5b7f615e47a8a607ba2b11598f3eccb9be7ac43875f50abd54bdbbcfaeccbb79")
{
  ...
  blockNumber: 121,
  hash: "0xbf71ea018f64b6449319b733baa188f5f1e6093306604004cf30d1688c940865",
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
  to: null,
  input: "0x15b446504790aec35713ebf947490e8674a018958ced63841ebe1ffc447ce52f2c8654f6affb907d5a744606293f6e9f4cf4a210a44041b5ec3696e01d917f3a",
  nonce: 3,
  r: "0x32d982ba0a48083821c0ff013119dce988205a2699485e7a4019911030bddabc",
  s: "0x41870f25243701e4187bb24b69d71b711de6cac742445e0cef501d0705119f1a",
  v: "0x25",
  transactionIndex: 0,
  ...
}
> eth.getPrivateTransactionReceipt("0x5b7f615e47a8a607ba2b11598f3eccb9be7ac43875f50abd54bdbbcfaeccbb79")
{
  blockNumber: 121,
  transactionHash: "0x5b7f615e47a8a607ba2b11598f3eccb9be7ac43875f50abd54bdbbcfaeccbb79",
  contractAddress: "0xd9d64b7dc034fafdba5dc2902875a67b5d586420",
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
  to: null,
  logs: [{
    ...,
    address: "0xd9d64b7dc034fafdba5dc2902875a67b5d586420",
    blockNumber: 121,
    data: "0x000000000000000000000000000000000000000000000000000000000000000a",
    logIndex: 0,
    topics: ["0x6c2b4666ba8da5a95717621d879a77de725f3d816709b9cbe9f059b8f875e284"],
    transactionHash: "0xbf71ea018f64b6449319b733baa188f5f1e6093306604004cf30d1688c940865",
    transactionIndex: 0,
    ...
  }],
  logsBloom: "0x00000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000400000000000000000000000001000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  status: "0x1",
  transactionIndex: 0,
  ...
}
```

### Privacy Precompile Contract

!!! info "Precompile Address"
    The [eth_getPrivacyPrecompileAddress] can be used by clients to get the address of the privacy precompile.

A precompile contract that retrieves the internal private transaction from Tessera and executes it.

## Flows

### Normal private transactions

#### Transaction submission

!!! note
    See [private transaction lifecycle] for a complete flow

![private txn current flow](../../images/PrivateTxn_CurrentFlow.png)

1. Private transaction sent to GoQuorum, to be signed on the node.
2. Private transaction `data` value serialised to JSON and sent to Tessera with details of participant parties.
3. `data` encrypted and distributed to participants.
4. Hash of encrypted `data` returned to GoQuorum. Private transaction `data` value replaced with hash. Private transaction signed by GoQuorum. `v` value changed to `37`/`38` to mark it as private.
5. Private transaction distributed throughout the network.
6. All nodes can see the transaction. Only participants are able to obtain the decrypted `data` from Tessera and execute the transaction.

### Privacy marker transactions

#### Transaction submission

![private txn current flow](../../images/PrivateTxn_NewFlow.png)

1. Private transaction sent to GoQuorum, to be signed on the node. (Steps 1 to 4 in [Normal private transactions] are carried out as before)
2. Signed private transaction serialised to JSON and sent to Tessera with details of participant parties.
3. Private transaction encrypted and distributed to participants.
4. Hash of encrypted private transaction returned to GoQuorum. Privacy marker transaction is created, with `data` field set to hash. Privacy marker transaction signed by GoQuorum.
5. Privacy marker transaction is distributed throughout the network.
6. All nodes can see the privacy marker transaction. Only participants are able to obtain the decrypted private transaction from Tessera and execute it.

#### Transaction processing

![privacy marker txn processing flow](../../images/PrivacyMarkerTxn_ProcessingFlow.png)

The privacy marker transaction is processed in the same way as a standard public transaction.
Since the `to` value in the privacy marker transaction is the address of the privacy precompile contract, that contract will be called.

1. Public privacy marker transaction is processed.
2. Privacy precompile is called with the transaction data, which is the hash of the encrypted private transaction.
3. The decrypted private transaction is retrieved from Tessera.
4. Action depends on whether the node is a participant:
    1. Participant node: recursive call to `ApplyTransaction`, this time to process the private transaction. The decrypted `data` of the private transaction is retrieved from Tessera, and the private transaction executed.
    2. Non participant: no private transaction found, so return immediately.
5. If the node is a participant, write the private transaction receipt directly to the database.

## Externally signed private transactions

This diagram shows the key differences when creating an externally signed private transaction using privacy marker transactions.
Non-green boxes show the new steps required.

![creating privacy marker txn comparison](../../images/CreatingExternallySignedPrivateTxn_Comparison.png)

Note that the final step of retrieving the private transaction receipt uses the new API method [eth_getPrivateTransactionReceipt].

## New API Methods

The following API methods have been added to support Privacy Marker Transactions:

* [eth_distributePrivateTransaction]
* [eth_getPrivacyPrecompileAddress]
* [eth_getPrivateTransactionByHash]
* [eth_getPrivateTransactionReceipt]

## How To Use

### Genesis Configuration

The `genesis.json` file has been modified to support the `privacyPrecompileBlock` flag.
This flag defines the fork block at which the privacy precompile contract is enabled and made available. Once the fork block is reached the node can process and use privacy marker transactions.

The value for this flag should be set to an appropriate future block number, by when the entire network is expected to have been upgraded to GoQuorum versions that support the privacy precompile.

The flag should be initialised with same value across all the nodes.

!!! example

    To enable the flag from block 10000:

    ```json
    "config": {
        "privacyPrecompileBlock": 10000
    }
    ```

### Command Line Flag

The command line flag `--privacymarker.enable` is needed in order to enable the creation of privacy marker transactions.

If this flag is specified, then whenever a private transaction is submitted to GoQuorum, it will lead to the creation of a privacy marker transaction.

!!! note
    Once the `privacyPrecompileBlock` has been reached, a node without the `--privacymarker.enable` CLI flag can still receive and correctly process privacy marker transactions sent from other nodes.

### Notes for clients/dApps

The privacy marker transaction and internal private transaction are separate transactions and consequently have separate transaction receipts.

Clients should be aware of this and make sure they are using the new [eth_getPrivateTransactionReceipt] API method where appropriate.

### Examples

#### Send unsigned private transaction

Use the same APIs as usual, such as `eth_sendTransaction`.  If `privateFor` is provided ,  the `privacyPrecompileBlock` has been reached, and the GoQuorum node was started with the `--privacymarker.enable` flag, then the private transaction will be created as a privacy marker transaction and internal private transaction.

#### Send signed private transaction

1. Use `eth_fillTransaction` or Tessera's ThirdParty `/storeraw` API to encrypt the private transaction payload.
1. Create the private transaction, replacing the `data` value with the hash of the encrypted private transaction payload from Tessera.
1. Externally sign the private transaction.
1. Use `eth_distributePrivateTransaction` (see [eth_distributePrivateTransaction] for more details) to encrypt the signed private transaction and share with all participants.
1. Create the privacy marker transaction, with `data` value set to the hash returned by `eth_distributePrivateTransaction`. The `from` and `nonce` values must also be the same as the private transaction.
1. Send the privacy marker transaction using the same APIs as usual, such as `eth_sendTransaction`.

<!--links-->
[How To Use]: #how-to-use
[New API Methods]: #new-api-methods
[eth_distributePrivateTransaction]: ../../Reference/API-Methods.md#eth_distributeprivatetransaction
[eth_getPrivacyPrecompileAddress]: ../../Reference/API-Methods.md#eth_getprivacyprecompileaddress
[eth_getPrivateTransactionByHash]: ../../Reference/API-Methods.md#eth_getprivatetransactionbyhash
[eth_getPrivateTransactionReceipt]: ../../Reference/API-Methods.md#eth_getprivatetransactionreceipt
[private transaction lifecycle]: PrivateTransactionLifecycle.md
[privacy precompile]: #privacy-precompile-contract
[internal private transaction]: #internal-private-transaction
[Flows]: #flows
[Normal private transactions]: #normal-private-transactions
