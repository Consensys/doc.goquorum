---
description: Privacy
---

# Privacy

In GoQuorum, privacy refers to the ability to keep transactions private between the involved participants.
Other participants cannot access the transaction content.

## Private transaction manager

[Tessera](https://docs.tessera.consensys.net) is private transaction manager for GoQuorum. Tessera stores and allows access
to encrypted transaction data, and exchanges encrypted payloads with other Tessera nodes but does not
have access to any sensitive private keys. Tessera uses the enclave for cryptographic functionality.
The enclave can optionally be hosted by the private transaction manager itself.

Tessera is restful/stateless and can be load balanced easily.

## Enclave

Distributed ledger protocols leverage cryptographic techniques for transaction authenticity, participant
authentication, and historical data preservation (that is, through a chain of cryptographically hashed data).
To achieve a separation of concerns and to provide performance improvements through parallelization
of certain crypto-operations, much of the cryptographic work including symmetric key generation and data
encryption/decryption is delegated to the enclave.

The enclave works with the private transaction manager to strengthen privacy by managing the encryption
and decryption in isolation. The enclave holds private keys and is essentially a _virtual HSM_ isolated
from other components.

## Public and private state

GoQuorum supports two states:

- Public state: accessible by all nodes within the network
- Private state: only accessible by nodes with the correct permissions

The difference is made through the use of transactions with encrypted (private) and non-encrypted payloads (public).
Nodes can determine if a transaction is private by looking at the `v` value of the signature.
Public transactions have a `v` value of `27` or `28`, private transactions have a value of `37` or `38`.

If the transaction is private, the node can only execute the transaction if it has the ability to access and decrypt the payload. Nodes who are not involved in the transaction do not have the private payload at all. As a result all nodes share a common public state which is created through public transactions and have a local unique private state.

This model imposes a restriction in the ability to modify state in private transactions.
Since it's a common use case for a (private) contract to read data from a public contract the virtual machine has the ability to jump into read only mode.
For each call from a private contract to a public contract the virtual machine will change to read only mode.
If the virtual machine is in read only mode and the code tries to make a state change the virtual machine stops execution and throws an exception.

The following transactions are allowed:

```text
1. S -> A -> B
2. S -> (A) -> (B)
3. S -> (A) -> [B -> C]
```

and the following transaction are unsupported:

```text
1. (S) -> A
2. (S) -> (A)
```

where:

- `S` = sender
- `(X)` = private
- `X` = public
- `->` = direction
- `[]` = read only mode

### State verification

To determine if nodes are in sync, the public state root hash is included in the block.
Private transactions are only processed by participating nodes, so it's impossible to obtain global consensus on the
private state.

To validate that the private state change from a private transaction is the same across all participants, use
[`eth_storageRoot`](../../Reference/API-Methods.md#eth_storageroot), specifying the private smart contract address and
block height.
If the state is in sync across all participating nodes, the same root hash is returned by all participating nodes.

#### Privacy enhancements - private state validation

Automatic verification of a contract(s) state across party nodes is performed by the GoQuorum node when privacy enhancements are enabled and PSV transactions are used.
For more details please see [Privacy Enhancements](PrivacyEnhancements.md).

*[PSV]: Private State Validation
