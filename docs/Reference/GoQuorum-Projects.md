# GoQuorum Projects

The following is an incomplete list of official and unofficial projects and samples highlighting and showcasing functionality offered by GoQuorum platform. [quorum-examples](https://github.com/ConsenSys/quorum-examples.git), is the official sample repository and it provides the means to easily create pre-configured networks for testing/development.

Current examples include:

* [7nodes](https://github.com/ConsenSys/quorum-examples/tree/master/examples/7nodes): Starts up a fully-functioning GoQuorum environment consisting of 7 independent nodes. This example demonstrates consensus, privacy, and all the expected functionality of an Ethereum platform.
* [consistency-checker](https://github.com/miguelmartinezinf/consistency-checker): Consistency-checker enhances trust between parties involved in private smart contracts. This tool acts as an oracle, listening to modifications of a specific private contract on every participant node and publishing the unique state of the contract at every block height on a public contract.
* [web3j token sample](https://github.com/blk-io/quorum-sample): This project demonstrates the creation and management of a private token on a GoQuorum network. GoQuorum privacy is used, only certain members of the network are privy to the token that has been created. It is written in Java using web3j which is maintained by Web3 Labs.
* Pons [backend](https://github.com/M-Bowe/pons) | [frontend](https://github.com/M-Bowe/pons-frontend): A sample Cross-Chain Trading Bridge written to run over 2 GoQuorum Chains to safely exchange ERC-20 and ERC-721 assets.
* [Marketplace](https://github.com/lyotam/techmarketplace): Marketplace is an example application running on top of a GoQuorum network which allows users to bid for and offer virtual hackathon gear for sale in an interactive marketplace. This app is based on what was originally developed for the MLH Localhost GoQuorum workshop, which demonstrates how to run a simple Ethereum application and how to write a simple Smart Contract that interacts with the Ethereum-based network.

!!! Info
    Most of the links link out to externally maintained repos. We thank all of the authors. Please contact us for any modifications or questions about the content.

## Zero Knowledge Work

### ZSL Proof of Concept

The proof of concept (POC) implementation of ZSL for GoQuorum enables the issuance of digital assets
using ZSL-enabled public smart contracts (z-contracts). We refer to such digital assets as “z-tokens”.
Z-tokens can be shielded from public view and transacted privately. Proof that a shielded transaction
has been executed can be presented to a private contract, thereby allowing the private contract to update
its state in response to shielded transactions that are executed using public z-contracts.

This combination of Tessera private contracts with ZSL z-contracts, allows obligations that arise from
a private contract, to be settled using shielded transfers of z-tokens, while maintaining full privacy and confidentiality.

For more information, see the [ZSL repository](https://github.com/ConsenSys/quorum/wiki/ZSL).

## Anonymous Zether

This is a private payment system, an _anonymous_ extension of Bünz, Agrawal, Zamani and Boneh's
[Zether protocol](https://crypto.stanford.edu/~buenz/papers/zether.pdf).

The outlines of an anonymous approach are sketched in the authors' original manuscript. We develop an
explicit proof protocol for this extension, described in the technical note [AnonZether.pdf](https://github.com/ConsenSys/anonymous-zether/blob/master/docs/AnonZether.pdf).
We also provide a full implementation of the anonymous protocol (including a proof generator, verification contracts, and a client / front-end).

For more information, see the [Anonymous Zether repository.](https://github.com/ConsenSys/anonymous-zether/).
