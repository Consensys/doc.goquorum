---
description: Privacy overview
---

# Privacy

Privacy refers to the ability to keep transactions private between the involved participants.
Other participants can't access the transaction content.

## Private transaction manager

GoQuorum uses [Tessera](https://docs.tessera.consensys.net) as the private transaction manager to implement private transactions.

Tessera:

- Stores and allows access to encrypted transaction data.
- Exchanges encrypted payloads with other Tessera nodes.
- Doesn't have access to any private keys.
- Uses an [enclave](#enclave) for cryptographic functionality.
  The private transaction manager itself can optionally host an enclave.
- Is restful/stateless and can be load balanced.

[Configure a connection to the private transaction manager](../../HowTo/Configure/ConfigurePTM.md) to
enable private transactions.

## Enclave

The enclave provides cryptographic functionality to the [private transaction manager](#private-transaction-manager) by
managing the encryption and decryption in isolation.
The enclave holds private keys and is essentially a virtual HSM isolated from other components.

The separation of duties between the private transaction manager and enclave provide performance improvements and
strengthens privacy.

## Public and private state

GoQuorum supports two states:

- Public state, which is accessible by all nodes within the network
- Private state, which is only accessible by nodes with the correct permissions

[Public state transactions](PrivateAndPublic.md#public-transactions) have non-encrypted payloads, while
[private state transactions](PrivateAndPublic.md#private-transactions) have encrypted payloads.

Nodes can only execute private transactions if they can access and decrypt the payload.
All nodes share a common public state created through public transactions and have a local unique private state.

### State verification

To determine if nodes are in sync, the public state root hash is included in the block.
Private transactions are only processed by participating nodes, so it's impossible to reach global consensus on the
private state.

To validate that the private state change from a private transaction is the same across all participants, use
[`eth_storageRoot`](../../Reference/API-Methods.md#eth_storageroot), specifying the private smart contract address and
block height.
If the state is in sync across all participating nodes, they return the same root hash.

### Privacy enhancements and private state validation

When [privacy enhancements](PrivacyEnhancements.md) are enabled and
[private state validation (PSV)](PrivacyEnhancements.md#private-state-validation) transactions are used, the GoQuorum
node automatically verifies a contract's state across participating nodes.

## Privacy marker transactions

[Privacy marker transactions (PMTs)](PrivacyMarkerTransactions.md) creates public PMTs and internal private transactions, and is an alternative to normal private transactions.
A PMT allows for the corresponding internal private transaction to be kept off chain, with its contents and receipt
hidden from public view.

## Contract state extension

[Contract state extension](ContractExtension.md) allows you to extend access to a private contract beyond its
initial set of participants.

*[HSM]: Hardware security module
