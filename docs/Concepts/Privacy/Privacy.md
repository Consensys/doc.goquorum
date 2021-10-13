---
description: Privacy overview
---

# Privacy

In GoQuorum, privacy refers to the ability to keep transactions private between the involved participants.
Other participants cannot access the transaction content.

## Private transaction manager

GoQuorum uses a private transaction manager, [Tessera](https://docs.tessera.consensys.net), to implement private transactions.
Tessera stores and allows access to encrypted transaction data, and exchanges encrypted payloads with other Tessera nodes,
but does not have access to any private keys.

Tessera uses the [enclave](#enclave) for cryptographic functionality.
The enclave can optionally be hosted by the private transaction manager itself.

Tessera is restful/stateless and can be load balanced easily.

You can [configure a connection to the private transaction manager](../../HowTo/Configure/ConfigurePTM.md) to
enable private transactions.

## Enclave

Distributed ledger protocols use cryptographic techniques for transaction authenticity, participant authentication, and
historical data preservation.
To achieve a separation of concerns and provide performance improvements through parallelization of certain
crypto-operations, much of the cryptographic work, including symmetric key generation and data encryption and decryption,
is delegated to the enclave.

The enclave works with the [private transaction manager](#private-transaction-manager) to strengthen privacy by managing
the encryption and decryption in isolation.
The enclave holds private keys and is essentially a virtual HSM isolated from other components.

## Public and private state

GoQuorum supports two states:

- Public state, which is accessible by all nodes within the network
- Private state, which is only accessible by nodes with the correct permissions

[Public state transactions](PrivateAndPublic.md#public-transactions) have non-encrypted payloads, while
[private state transactions](PrivateAndPublic.md#private-transactions) have encrypted payloads.
Nodes can determine if a transaction is private by looking at the `v` value of the signature.
Public transactions have a `v` value of `27` or `28`, and private transactions have a value of `37` or `38`.

If the transaction is private, the node can only execute the transaction if it has the ability to access and decrypt the payload.
Nodes that are involved in the transaction don't have the private payload at all.
As a result, all nodes share a common public state created through public transactions and have a local unique private state.

### State verification

To determine if nodes are in sync, the public state root hash is included in the block.
Private transactions are only processed by participating nodes, so it's impossible to obtain global consensus on the
private state.

To validate that the private state change from a private transaction is the same across all participants, use
[`eth_storageRoot`](../../Reference/API-Methods.md#eth_storageroot), specifying the private smart contract address and
block height.
If the state is in sync across all participating nodes, the same root hash is returned by all participating nodes.

### Privacy enhancements and private state validation

When [privacy enhancements](PrivacyEnhancements.md) are enabled and private state validation (PSV) transactions are used,
the GoQuorum node automatically verifies a contract's state across participating nodes.

*[HSM]: Hardware security module
