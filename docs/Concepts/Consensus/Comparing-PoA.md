---
description: Proof of Authority consensus protocols comparison
---

# Comparing Proof of Authority consensus protocols

GoQuorum implements the [IBFT](../../HowTo/Configure/Consensus-Protocols/IBFT.md), [QBFT](../../HowTo/Configure/Consensus-Protocols/QBFT.md),
[Raft](../../HowTo/Configure/Consensus-Protocols/Raft.md), and [Clique](../../HowTo/Configure/Consensus-Protocols/Clique.md)
Proof of Authority (PoA) consensus protocols.
PoA consensus protocols work when participants know each other and there is a level of trust between them (for example,
in a permissioned consortium network).

PoA consensus protocols have faster block times and a much greater transaction throughput than the Ethash Proof of Work
consensus protocol used on Ethereum Mainnet.

In the GoQuorum PoA consensus protocols, a group of nodes in the network act as validators (IBFT and QBFT), verifiers (Raft)
or signers (Clique).
The existing nodes in the validator/verifier/signer pool vote to add nodes to or remove nodes from the pool.

!!! note

    For the rest of this page, the term "validator" is used to refer to validators, verifiers, and signers.

## Properties

Properties to consider when comparing the PoA consensus protocols are:

* Immediate finality.
* Minimum number of validators.
* Liveness.
* Speed.

### Immediate finality

QBFT and Raft have immediate finality.
When using QBFT and Raft there are no forks and all valid blocks get included in the main chain.

IBFT and Clique do not have immediate finality.
Implementations using IBFT and Clique must be aware of forks and chain reorganizations occurring.

### Minimum number of validators

To be Byzantine fault tolerant, IBFT and QBFT require a minimum of four validators.
Byzantine fault tolerance is the ability to function correctly and reach consensus despite nodes failing or propagating
incorrect information to peers.

Raft and Clique can operate with a single validator but operating with a single validator offers no redundancy if the
validator fails.

### Liveness

Raft and Clique are more fault tolerant than IBFT and QBFT.

Raft and Clique tolerate up to half of the validators failing.

!!! important

    While Clique is Byzantine fault tolerant, Raft is only crash fault tolerant because the Raft leader is assumed to
    always act correctly.

IBFT and QBFT networks require greater than or equal to two-thirds of validators to be operating to create blocks.
For example, a QBFT network of:

* Four to five validators tolerates one unresponsive validator.
* Six to eight validators tolerates two unresponsive validators.

Networks with three or fewer validators can produce blocks but do not guarantee finality when operating in adversarial environments.

!!! important

    We do not recommend using IBFT and QBFT networks with three nodes for production purposes.

### Speed

Reaching consensus and adding blocks is fastest in Raft networks, then in Clique networks.
For Clique, the probability of a fork increases as the number of validators increases.

For IBFT and QBFT, the time to add new blocks increases as the number of validators increases.
