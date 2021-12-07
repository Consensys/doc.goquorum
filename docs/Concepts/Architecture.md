---
description: Overview of GoQuorum architecture
---

# Architecture

The following diagram outlines the GoQuorum high-level architecture.

![GoQuorum Architecture diagram](../images/Quorum%20Design.png)

## Differences from geth

GoQuorum is a lightweight fork of geth.
GoQuorum is updated as geth releases occur.

GoQuorum includes the following changes to geth:

* Consensus is achieved with the [Istanbul BFT](../HowTo/Configure/Consensus-Protocols/IBFT.md),
  [QBFT](../HowTo/Configure/Consensus-Protocols/QBFT.md), or [Raft](../HowTo/Configure/Consensus-Protocols/Raft.md)
  consensus protocols instead of proof of work.
* The P2P layer is changed to only allow connections between [permissioned](PermissionsOverview.md) nodes.
* The block generation logic is changed to replace the `global state root` check with a `global public state root` check.
* The block validation logic is changed to replace the `global state root` in the block header with the `global public state root`.
* The State Patricia trie is split into two: [a public state trie and a private state trie](Privacy/Privacy.md#public-and-private-state).
* Block validation logic is changed to handle [private transactions](Privacy/PrivateAndPublic.md#private-transactions).
* Transaction creation is changed to allow for replacing transaction data with encrypted hashes to preserve private data
  where required.
* [The pricing of gas is removed.](FreeGasNetwork.md) Gas itself remains.

For more information about the GoQuorum architecture and its differences from geth, contact us on [GoQuorum Discord](https://discord.gg/5U9Jwp7).
