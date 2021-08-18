---
description: FAQ
---

# FAQ

## GoQuorum FAQ

??? question "I've run into an issue with GoQuorum, where do I get support?"
    The [GoQuorum Slack channels](https://inviter.quorum.consensys.net/) are the best place to query the community and get immediate help.

    The GoQuorum engineering team monitors Slack and any issues raised on the GoQuorum GitHub repositories (for example [Quorum](https://github.com/ConsenSys/quorum/), [Tessera](https://github.com/ConsenSys/tessera), [Quorum-Examples](https://github.com/ConsenSys/quorum-examples), etc.).

??? question "How does GoQuorum achieve Transaction Privacy?"
    GoQuorum achieves Transaction Privacy by:

     1. Enabling transaction Senders to create a private transaction by marking who is privy to that transaction via the `privateFor` parameter
     1. Replacing the payload of a private transaction with a hash of the encrypted payload, such that the original payload is not visible to participants who are not privy to the transaction
     1. Storing encrypted private data off-chain in a separate component called the Privacy Manager (provided by [Tessera](https://github.com/ConsenSys/tessera)). The Privacy Manager distributes the encrypted data to other parties that are privy to the transaction and returns the decrypted payload to those parties

    Please see the [Transaction and Contract Privacy](../Privacy/Overview) section for more info.

??? question "How does GoQuorum achieve consensus on Private Transactions?"
    In standard Ethereum, all nodes process all transactions and so each node has the same state root. In GoQuorum, nodes process all 'public' transactions (which might include reference data or market data contracts for example) but only process the private transactions that they are party to.

    GoQuorum nodes maintain two Patricia Merkle Tries: one for private state and one for public state. As a result, block validation includes a **state** check on the new-to-GoQuorum `public state root`. Block validation also includes a check of the `global Transaction hash`, which is a hash of **all** Transactions in a block - private and public. This means that each node is able to validate that it has the same set of Transactions as other nodes. Since the EVM is provably deterministic through the synchronized public state root, and that the Private Transaction inputs are known to be in sync across nodes (global Transaction Hash), private state synchronization across nodes can be implied. In addition, GoQuorum provides an API call, `eth_storageRoot`, that returns the private state hash for a given transaction at a given block height, that can optionally be called at the application layer to specifically perform an off-chain state validation with a counterparty.

    Please see the [GoQuorum Consensus](../Consensus/Consensus) and [Transaction and Contract Privacy Overview](../Privacy/Overview) pages for more info.

??? question "Are there any restrictions on the transaction size for private transactions (since they are encrypted)?"
    The only restriction is the gas limit on the transaction.
    Constellation/Tessera does not have a size limit (although maybe it should be possible to set one).
    If anything, performing large transactions as private transactions will improve performance because most of the network only sees hash digests.
    In terms of performance of transferring large data blobs between geographically distributed nodes, it would be equivalent performance to PGP encrypting the file and as fast as transferring it over http/https.
    If you are doing sequential transactions then of course you will have to wait for those transfers, but there is no special overhead by the payload being large if you are doing separate/concurrent transactions, subject to network bandwidth limits.
     Constellation/Tessera does everything in parallel.

??? question "Should I include originating node in private transaction?"
    No. In GoQuorum, including originating node's `privateFor` results in an error.
    To create a private contract that is visible to the originating node only, use this format: `privateFor: []`.

??? question "Is it possible to run a GoQuorum node without a Transaction Manager?"
    Starting a GoQuorum node with `PRIVATE_CONFIG=ignore` (instead of `PRIVATE_CONFIG=path/to/tm.ipc`) will start the node without a Transaction Manager. The node will not broadcast matching private keys (please ensure that there is no transaction manager running for it) and will be unable to participate in any private transactions.

??? question "Are there official docker images for GoQuorum and Tessera?"
    Yes! The [official docker containers](https://hub.docker.com/u/quorumengineering/):

    `quorumengineering/quorum:latest`
    `quorumengineering/tessera:latest`

??? question "Can I create a network of GoQuorum nodes using different consensus mechanisms?"
    Unfortunately, that is not possible. GoQuorum nodes configured with Raft will only be able to work correctly with other nodes running Raft consensus. This applies to all other supported consensus algorithms.

??? info "GoQuorum version compatibility table"
    |                                     | Adding new node v2.0.x | Adding new node v2.1.x - v2.5.x |
    | ----------------------------------- | ---------------------- | ---------------------- |
    | Existing chain consisting of v2.0.x | <span style="color:green;">block sync<br /> public txn<br /> private txn</span>  | <span style="color:red;">block sync</span>  |
    | Existing chain consisting of v2.1.x - v2.5.0 | <span style="color:red;">block sync</span>  | <span style="color:green;">block sync<br /> public txn<br /> private txn</span> |

    **Note:** While every GoQuorum v2 client will be able to connect to any other v2 client, the usefullness will be severely degraded. <span style="color:red;">Red color</span> signifies that while connectivity is possible, <span style="color:red;">red colored</span> versions will be unable to send public or private txns to the rest of the net due to the EIP155 changes in the signer implemented in newer versions.

??? info "GoQuorum to geth version mapping"
    | GoQuorum v2.0.x - v2.1.1 | GoQuorum v2.2.0 - v2.2.1 | GoQuorum v2.2.2 - v2.5.0 |
    |--------------------------|--------------------------|--------------------------|
    | geth v1.7.2              | geth v1.8.12             | geth v1.8.18             |

## Tessera FAQ

??? question "What does enabling 'disablePeerDiscovery' mean?"
    It means the node will only communicate with the nodes defined in the configuration file. Upto version 0.10.2, the nodes still accepts transactions from undiscovered nodes. From version 0.10.3 the node blocks all communication with undiscovered nodes.

??? info "Upgrading to Tessera version 0.10.+ from verion 0.9.+ and below"
    Due to 'database file unable to open' issue with H2 DB upgrade from version 1.4.196 direct to version 1.4.200 as explained  [in H2 database issue #2263](https://github.com/h2database/h2database/issues/2263), our recommended mitigation strategy is to upgrade to version 1.4.199 first before upgrading to version 1.4.200, first upgrade to Tessera 0.10.0 before upgrading to higher versions.

## Raft FAQ

??? question "Could you have a single- or two-node cluster? More generally, could you have an even number of nodes?"
    A cluster can tolerate failures that leave a GoQuorum (majority) available. A cluster of two nodes can't tolerate any failures, three nodes can tolerate one, and five nodes can tolerate two. Typically Raft clusters have an odd number of nodes, since an even number provides no failure tolerance benefit.

??? question "What happens if you don't assume minter and leader are the same node?"
    There's no hard reason they couldn't be different. We just co-locate the minter and leader as an optimization.

    * It saves one network call communicating the block to the leader.
    * It provides a simple way to choose a minter. If we didn't use the Raft leader we'd have to build in "minter election" at a higher level.

    Additionally there could even be multiple minters running at the same time, but this would produce contention for which blocks actually extend the chain, reducing the productivity of the cluster (see [Raft: Chain extension, races, and correctness](../Consensus/raft/#chain-extension-races-and-correctness) above).

??? question "I thought there were no forks in a Raft-based blockchain. What's the deal with "speculative minting"?"
    "Speculative chains" are not forks in the blockchain. They represent a series ("chain") of blocks that have been sent through Raft, after which each of the blocks may or may not actually end up being included in *the blockchain*.

??? question "Can transactions be reversed? Since Raft log entries can be disregarded as _no-ops_, does this imply transaction reversal?"
    No. When a Raft log entry containing a new block is disregarded as a _no-op_, its transactions will remain in the transaction pool, and so they will be included in a future block in the chain.

??? question "What's the deal with the block timestamp being stored in nanoseconds (instead of seconds, like other consensus mechanisms)?"
    With Raft-based consensus we can produce far more than one block per second, which vanilla Ethereum implicitly disallows (as the default timestamp resolution is in seconds and every block must have a timestamp greater than its parent). For Raft, we store the timestamp in nanoseconds and ensure it is incremented by at least 1 nanosecond per block.

??? question "Why do I see "Error: Number can only safely store up to 53 bits" when using web3js with Raft?"
    As mentioned above, Raft stores the timestamp in nanoseconds, so it is too large to be held as a number in JavaScript.
    You need to modify your code to take account of this. An example can be seen in [Quorum.js source code](https://github.com/ConsenSys/quorum.js/blob/master/lib/index.js#L35).
    A future GoQuorum release will address this issue.

??? info "Known Raft consensus node misconfiguration"
    Please see <https://github.com/ConsenSys/quorum/issues/410>

??? question "Geth1.9.7 has the feature of stopping the node once sync is completed using `--exitwhensynced` flag. Will this work with Raft consensus?"
    `--existwhensycned` is not applicable for Raft consensus

??? question "Can I remove the statedb using `geth removedb` command and recover the statedb by syncing with other nodess in the network when running the node in Raft consensus"
    `geth removedb` cannot be used with Raft consensus.
