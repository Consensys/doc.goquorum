---
title: Privacy Marker Transactions
description: Privacy Marker Transactions are an alternative method of processing private transactions.
---

# Privacy Marker Transactions

## Overview

GoQuorum v21.??.? introduces a new method for processing private transactions, which can be used instead of the normal private transaction flow.
This makes use of a new type of public transaction referred to as a "Privacy Marker Transaction" (PMT).
Only the public privacy marker transaction is added to the chain.  The private transaction is stored in the [Privacy Manager (Tessera)](PrivateTransactionManager.md) and is only available to the participants.

This functionality is enabled using a new command line flag and genesis flag (see [Configuration Changes]).

The advantages of using a Privacy Marker Transaction over a normal Private Transaction are as follows:

* The contract address is hidden from public view.
* The private transaction receipt is only visible to participants of the private transaction.
* The private transaction itself is stored in the private transaction manager and is only visible to participants.

The Privacy Marker Transaction makes use of a new precompiled contract held in GoQuorum.

!!! info "Precompile Address"
    A new API method [eth_getPrivacyPrecompileAddress] has been added for retrieving the address of the precompile.

## Flows

### Normal private transactions

#### Transaction submission

!!! note
    See [private transaction lifecycle] for a complete flow

![private txn current flow](../../images/PrivateTxn_CurrentFlow.png)

1. Private transaction sent to GoQuorum, to be signed on the node.
2. Private transaction `data` value serialised to JSON and sent to Tessera with details of participant parties.
3. `data` encrypted and distributed to participants.
4. Hash of encrypted `data` returned to GoQuorum.  Private transaction `data` value replaced with hash.  Private transaction signed by GoQuorum. `v` value changed to `37`/`38` to mark it as private.
5. Private transaction distributed throughout the network.
6. All nodes can see the transaction.  Only participants are able to obtain the decrypted `data` from Tessera and execute the transaction.

### Privacy marker transactions

#### Transaction submission

![private txn current flow](../../images/PrivateTxn_NewFlow.png)

1. Signed private transaction sent to GoQuorum, to be signed on the node.
2. Entire private transaction serialised to JSON and sent to Tessera with details of participant parties.
3. Private transaction encrypted and distributed to participants.
4. Hash of encrypted private transaction returned to GoQuorum.  Privacy marker transaction is created, with `data` field set to hash. Privacy marker transaction signed by GoQuorum.
5. Privacy marker transaction is distributed throughout the network.
6. All nodes can see the privacy marker transaction. Only participants are able to obtain the decrypted private transaction from Tessera and execute it.

#### Transaction processing

![privacy marker txn processing flow](../../images/PrivacyMarkerTxn_ProcessingFlow.png)

The privacy marker transaction is processed in the same way as a standard public transaction.
Since the `to` value in the privacy marker transaction is the address of the privacy precompile contract, that contract will be called.

1. Public privacy marker transaction is processed.
2. Precompile is called with the transaction data, which is the hash of the encrypted private transaction.
3. The decrypted private transaction is retrieved from Tessera.
4. Action depends on whether the node is a participant:
    1. Participant node: recursive call to `ApplyTransaction`, this time to process the private transaction.  The decrypted `data` of the private transaction is retrieved from Tessera, and the private transaction executed.
    2. Non participant: no private transaction found, so return immediately.
5. If the node is a participant, write the private transaction receipt directly to the database.

## Externally signed private transactions

This diagram shows the key differences when creating an externally signed private transaction using privacy marker transactions.
Non-green boxes show the new steps required.

![creating privacy marker txn comparison](../../images/CreatingExternallySignedPrivateTxn_Comparison.png)

Note that the final step of retrieving the private transaction receipt uses the new API method [eth_getPrivateTransactionReceipt].

## New API Methods

See [Privacy Marker API].

## GoQuorum Configuration Changes

### Genesis Flag

The `genesis.json` file has been modified to support the `quorumPrecompilesV1Block` flag.
This flag defines the fork block at which the precompiled contract used by privacy marker transactions is enabled.  Once the fork block is reached the node can process and use privacy marker transactions.

The value for this flag should be set to an appropriate future block number, by when the entire network is expected to have been upgraded to GoQuorum versions that support the privacy precompile.

The flag should be initialised with same value across all the nodes.

!!! example

    To enable the flag from block 10000:

    ```json
    "config": {
        "quorumPrecompilesV1Block": 10000
    }
    ```

### Command Line Flag

The command line flag `--privacymarker.enable` is needed in order to enable the creation of privacy marker transactions.

If this flag is specified, then whenever a private transaction is submitted to GoQuorum, it will lead to the creation of a privacy marker transaction.

!!! note
    Once the `quorumPrecompilesV1Block` has been reached, a node without the `--privacymarker.enable` CLI flag can still receive and correctly process privacy marker transactions sent from other nodes.


<!--links-->
[Configuration Changes]: #goquorum-configuration-changes
[eth_getPrivateTransactionReceipt]: ../../Reference/APIs/PrivacyMarkerTransactionAPI.md#eth_getprivatetransactionreceipt
[eth_getPrivacyPrecompileAddress]: ../../Reference/APIs/PrivacyMarkerTransactionAPI.md#eth_getprivacyprecompileaddress
[Privacy Marker API]: ../../Reference/APIs/PrivacyMarkerTransactionAPI.md
[private transaction lifecycle]: ../PrivateTransactionLifecycle
