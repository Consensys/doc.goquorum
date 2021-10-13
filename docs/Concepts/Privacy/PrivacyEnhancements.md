---
title: Privacy Enhancements
description: Privacy Enhancements feature prevents nodes from modifying contracts they are not party with.
---

# Privacy enhancements

In addition to [standard private (SP) transactions](PrivateAndPublic.md#private-transactions), GoQuorum provides three
different kinds of privacy enhancements:

* [Counter-party protection (PP) transactions](#counter-party-protection)
* [Mandatory party protection (MPP) transactions](#mandatory-party-protection)
* [Private state validation (PSV) transactions](#private-state-validation)

## Counter-party protection

Counter-party protection prevents non-participants from sending a transaction to a private contract.
For example, a private contract is deployed between nodes 1 and 2.
Without counter-party protection, if node 3 discovers the private contract address, node 3 can send a transaction with
`privateFor` set to node 2.
The transaction isn't applied on node 3 because it isn't a participant in the private transaction.
The transaction submitted by non-participating node 3 is applied to the private state on node 2.

Use counter-party protection instead of access controls on private contract implementations to protect against other
network participants from updating the state.
Counter-party protection prevents non-participants from interacting with the private contract without additional access
controls.

When using [`send` API methods](../../Reference/API-Methods.md#privacy-methods), set `privacyFlag` to 1 to enable
counter-party protection.

## Mandatory party protection

Mandatory party protection inherits all features of counter-party protection (including state divergence), but allows
for one or more recipient(s) to be defined as "mandatory" for the contract.
The mandatory recipient is included in all subsequent transactions to the contract, and therefore has full private state
while normal recipients may only have partial state of the contract.

Use mandatory party protection if you need "governing" or "central" nodes to have full private state view at the contract
level for all or selective contracts deployed in the network.

When using [`send` API methods](../../Reference/API-Methods.md#privacy-methods), set `privacyFlag` to 2 to enable
mandatory party protection.
Set the `mandatoryFor` parameter to a list of mandatory recipients for the contract.

## Private state validation

Private state validation prevents state divergence by ensuring that any private transaction for the contract is always
sent to all participants.
For example, a private contract is deployed between node 1 and 2.
Without private state validation, node 1 can send a transaction to the private contract with a `privateFor` of `[]`.
The transaction changes the private state of node 1 but not node 2 and the private states of 1 and 2 no longer match.
With private state validation, a transaction from node 1 with a `privateFor` of `[]` is rejected and the transaction is
processed only when `privateFor` contains both 1 and 2.

When using private state validation, the full participant list is shared among all participants and validated against
all subsequent transactions.
Transactions sent to a subset of participants fail.

In standard privacy or when only using counter-party protection, only the sender knows the full participant list.

When using [`send` API methods](../../Reference/API-Methods.md#privacy-methods), set `privacyFlag` to 3 to enable
private state validation.

## Using privacy enhancements

### Limitations

Depending on the complexity of the contracts and the throughput of the network, the state at simulation time may differ
from the chain state at the time the proposed transaction is published.
If the state at publishing time is changed from simulation time, the corresponding PP, MPP, and PSV transactions are
marked as failed on all the participants.
Furthermore, since state divergence is expected in PP and MPP contracts, it's possible (depending on contract design)
for PP and MPP transactions to fail on some participants.

Concurrency may also present a problem for PSV contracts.
The execution hash calculation is based on the chain state at simulation time.
Submitting multiple transactions to the same PSV contract from multiple nodes concurrently may result in most of the
transactions failing.

!!! important

    Because of these limitations, users should choose privacy-enhanced transactions **only** when the enhanced privacy
    is necessary (and the extra privacy benefits outweigh the potential shortfalls).

### Transaction interactions

No interactions are allowed between the different types of private transactions.
The only allowed interaction is for private contracts (SP, PP, MPP, and PSV) to read from public contracts.

![Contract interaction matrix](../../images/PrivacyEnhancements_Contract_Interaction_Matrix.png)

The privacy enhancements feature only performs its checks on published transactions.
None of the [limitations](#limitations) apply to calls (read only transactions); calls are contract method invocations
executed locally and don't result in published transactions.

### Enabling privacy enhancements

To enable privacy enhancements in Tessera, set the `enablePrivacyEnhancements` parameter in the
[Tessera configuration file](https://docs.tessera.consensys.net/en/stable/Reference/SampleConfiguration/) to `true`.
To enable privacy enhancements in GoQuorum, set the `privacyEnhancementsBlock` in the GoQuorum
[genesis file](../../HowTo/Configure/GenesisOptions.md) `config` object to a future block, by when the entire network is
ready to transact with privacy-enhanced transactions.
All GoQuorum nodes in the network should be initialized with the same `privacyEnhancementsBlock` value.

If a node wants to upgrade Tessera to the privacy enhancements release (or further) to benefit from other features and
fixes, but isn't ready to upgrade GoQuorum, it can disable `enablePrivacyEnhancements` in the Tessera configuration.
This allows the node to reject PP, MPP, and PSV transactions from other nodes until the node is ready to support
privacy-enhanced transactions.

### Backward compatibility

An upgraded GoQuorum node can coexist on a network where other nodes are running on lower versions of GoQuorum.
But it can't support privacy-enhanced contracts until all interested nodes are upgraded and enable privacy.

If an upgraded but non-privacy-enabled GoQuorum node receives a PP, MPP, or PSV transaction, the node logs a `BAD BLOCK` error.
If the consensus algorithm is Raft, the node stops.
If the consensus algorithm is IBFT or QBFT, the node keeps trying to add the bad block, and reprints the errors.
It won't catch up with rest of nodes until restarted and reinitialized with the correct `privacyEnhancementsBlock`.

If you enable `enablePrivacyEnhancements` flag in Tessera without enabling privacy in GoQuorum, the node can crash, as
the Tessera node accepts PP, MPP, and PSV transactions.

An upgraded Tessera node can continue to communicate with Tessera nodes running on previous versions using SP transactions.

*[PP]: Counter-Party Protection
*[MPP]: Mandatory Party Protection
*[PSV]: Private State Validation
*[SP]: Standard Private
