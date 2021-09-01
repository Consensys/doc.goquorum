---
description: Overview of GoQuorum architecture
---

# Architecture

![GoQuorum Architecture diagram](../images/Quorum%20Design.png)

## Differences from geth

GoQuorum is a lightweight fork of geth to take advantage of the R&D within the Ethereum community.
GoQuorum is updated as geth releases occur.

GoQuorum includes the following modifications to geth:

* Consensus is achieved with the Raft or Istanbul BFT consensus algorithms instead of Proof-of-Work.
* The P2P layer is modified to only allow connections between permissioned nodes.
* The block generation logic is modified to replace the `global state root` check with a `global public state root` check.
* The block validation logic is modified to replace the ‘global state root’ in the block header with the ‘global public state root’
* The State Patricia trie has been split into two: a public state trie and a private state trie.
* Block validation logic is modified to handle private transactions.
* Transaction creation is modified to allow for transaction data to be replaced by encrypted hashes
    to preserve private data where required.
* The pricing of gas is removed. Gas itself remains.
