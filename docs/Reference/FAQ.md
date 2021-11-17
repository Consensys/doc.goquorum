---
description: FAQ
---

## Tessera FAQ

??? question "What does enabling 'disablePeerDiscovery' mean?"
    It means the node will only communicate with the nodes defined in the configuration file. Upto version 0.10.2, the nodes still accepts transactions from undiscovered nodes. From version 0.10.3 the node blocks all communication with undiscovered nodes.

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
