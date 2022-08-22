---
description: Privacy overview
---

# Privacy

Privacy refers to the ability to keep transactions private between the involved participants.
Other participants can't access the transaction content.

## Private transaction manager

GoQuorum uses Tessera as the private transaction manager to implement private transactions.

Tessera:

- Stores and allows access to encrypted transaction data.
- Exchanges encrypted payloads with other Tessera nodes.
- Doesn't have access to any private keys.
- Uses an [enclave](#enclave) for cryptographic functionality.
  The private transaction manager itself can optionally host an enclave.
- Is restful/stateless and can be load balanced.

[Configure a connection to the private transaction manager](../../configure-and-manage/configure/private-transaction-manager.md) to
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

[Public state transactions](private-and-public.md#public-transactions) have non-encrypted payloads, while
[private state transactions](private-and-public.md#private-transactions) have encrypted payloads.

Nodes can only execute private transactions if they can access and decrypt the payload.
All nodes share a common public state created through public transactions and have a local unique private state.

### Privacy enhancements and private state validation

When [privacy enhancements](privacy-enhancements.md) are enabled and
[private state validation (PSV)](privacy-enhancements.md#private-state-validation) transactions are used, the GoQuorum
node automatically verifies a contract's state across participating nodes.

## Privacy marker transactions

[Privacy marker transactions (PMTs)](privacy-marker-transactions.md) creates public PMTs and internal private transactions, and is an alternative to normal private transactions.
A PMT allows for the corresponding internal private transaction to be kept off chain, with its contents and receipt
hidden from public view.

## Contract state extension

[Contract state extension](contract-extension.md) allows you to extend access to a private contract beyond its
initial set of participants.

*[HSM]: Hardware security module
