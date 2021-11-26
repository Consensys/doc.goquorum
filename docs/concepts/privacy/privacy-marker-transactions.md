---
title: Privacy Marker Transactions
description: Privacy marker transactions are an alternative method of processing private transactions.
---

# Privacy marker transactions

You can use privacy marker transactions (PMTs) instead of [normal private transactions](PrivateAndPublic.md#private-transactions).

PMTs are public transactions.
PMTs each have a corresponding [internal private transaction](#internal-private-transaction) stored in the
[private transaction manager](Privacy.md#private-transaction-manager) (Tessera) and only available to participants.

The advantages of using a PMT over a normal private transaction are:

* The contract address is hidden from public view.
* The private transaction receipt is only visible to participants of the private transaction.
* The private transaction itself is stored in the private transaction manager and is only visible to participants.

PMTs use a privacy precompile contract, which retrieves the internal private transaction from Tessera and executes it.

See the [PMT high-level lifecycle](PrivateTransactionLifecycle.md#privacy-marker-transactions).

## Privacy marker transaction

A PMT is a public transaction with the following parameters:

* `to` - privacy precompile contract address
* `input` or `data` - sender address and Tessera hash of the encrypted [internal private transaction](#internal-private-transaction)
* `from` - the same signing account as the [internal private transaction](#internal-private-transaction)
* `contractAddress` - (in receipt if the PMT is a contract creation transaction) null
* `logs` and `logsBloom` (in receipt) - empty

!!! example "Example PMT and its receipt"

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

## Internal private transaction

Each PMT has a corresponding internal private transaction.
The content of this private transaction is the same as the content of a
[normal private transaction](PrivateAndPublic.md#private-transactions), except it has the same `from` and `nonce` values
as the PMT.

Only the hash of the encrypted internal private transaction is stored on chain (as part of the `data` field of the PMT).
The internal private transaction is stored and encrypted in each participant's Tessera node.
As a result, the internal private transaction is only available to participants of the private transaction.

At execution time, GoQuorum retrieves the internal private transaction from Tessera.

!!! example "Example internal private transaction and its receipt"

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

## Using privacy marker transactions

To enable PMTs in GoQuorum, set the `privacyPrecompileBlock` in the GoQuorum
[genesis file](../../HowTo/Configure/GenesisOptions.md) `config` object to a block where the network is
ready to support the privacy precompile.
Once the fork block is reached, the node can process and use PMTs.
All GoQuorum nodes in the network should be initialized with the same `privacyPrecompileBlock` value.

Use the [`--privacymarker.enable`](../../Reference/CLI-Syntax.md#privacymarkerenable) command line option when starting
GoQuorum to enable PMTs.

!!! note

    Once the `privacyPrecompileBlock` is reached, a node without the `--privacymarker.enable` CLI flag can still receive
    and correctly process PMTs sent from other nodes.

Use the following API methods to interact with PMTs:

* [`eth_distributePrivateTransaction`](../../Reference/API-Methods.md#eth_distributeprivatetransaction)
* [`eth_getPrivacyPrecompileAddress`](../../Reference/API-Methods.md#eth_getprivacyprecompileaddress)
* [`eth_getPrivateTransactionByHash`](../../Reference/API-Methods.md#eth_getprivatetransactionbyhash)
* [`eth_getPrivateTransactionReceipt`](../../Reference/API-Methods.md#eth_getprivatetransactionreceipt)

    !!! important

        The PMT and internal private transaction are separate transactions and have separate transaction receipts.

### Sending unsigned private transactions

To send an unsigned private transaction as a PMT, use the same API methods as with normal private transactions, such as
[`eth_sendTransaction`](../../Reference/API-Methods.md#eth_sendtransaction).

If the following conditions are met, the private transaction is created as a PMT and internal private transaction:

* `privateFor` is provided.
* The `privacyPrecompileBlock` has been reached.
* The GoQuorum node is started with the [`--privacymarker.enable`](../../Reference/CLI-Syntax.md#privacymarkerenable) option.

### Sending signed private transactions

1. Use [`eth_fillTransaction`](../../Reference/API-Methods.md#eth_filltransaction) or Tessera's third party `/storeraw`
   API to encrypt the private transaction payload.
1. Create the private transaction, replacing the `data` value with the hash of the encrypted private transaction payload
   from Tessera.
1. Externally sign the private transaction.
1. Use [`eth_distributePrivateTransaction`](../../Reference/API-Methods.md#eth_distributeprivatetransaction) to encrypt
   the signed private transaction and share with all participants.
1. Create the PMT, with the `data` value set to the hash returned by `eth_distributePrivateTransaction`.
   The `from` and `nonce` values must be the same as the private transaction.
1. Send the PMT using the same APIs as with normal private transactions, such as
   [`eth_sendTransaction`](../../Reference/API-Methods.md#eth_sendtransaction).
