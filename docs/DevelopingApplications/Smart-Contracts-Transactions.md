---
description: smart contracts and transactions
---

# Transactions

A blockchain is a shared, immutable electronic ledger (or digital database) that keeps a record of transactional data,
otherwise referred to as *transactions*. The *block* in *blockchain* refers to a block of transactions that has been
broadcast to the network. The *chain* refers to a string of these blocks in chronological order.

When a new block of transactions is securely validated by the network, it is attached to the end of an existing chain.
This chain of blocks is an ever-growing ledger of transactions, each of which can be traced, providing
accountability and transparency unavailable on traditional ledgers.

![Blockchain](../images/blockchain.png)

# Smart contracts

*Smart contracts* provide controlled access and a range of functions (such as querying, transacting, and updating state)
to blockchain users. Smart contracts encapsulate data and keep it consistent across the network.
They can allow or restrict participants from executing certain functions, and can restrict access to the network itself.
Smart contracts are written in Solidity (the most popular smart contract language), Vyper, and Serpent.

![Contracts](../images/smart-contract-tx.png)

Smart contracts work on the general conditional principle (if/then) of programming, written into code on the blockchain.
When conditions defined in the contract are met and verified, it is submitted as a *transaction* onto the chain where a network
of peers validate and execute it. When the transaction is complete, the chain is then updated and its new state is immutable,
meaning that you cannot change the state once it is written to the chain.

Transactions can be public or private. The contents of a puublic transaction are visible to all participants on the
blockchain network, and the contents of private transactions can only be seen by parties of the transaction, or those that
have been granted access to view it.

Typically transactions are used to [deploy contracts](../Tutorials/Contracts/Deploying-Contracts.md ),
[interact with contracts](../Tutorials/Contracts/Calling-Contract-Functions.md) or
[transfer funds](../Tutorials/Contracts/Account-Funds-Transfers.md) and the links provide tutorials of each.

# Dapps

*Decentralized applications (dapps)* are just like any other software application can be on a website or mobile app.
Dapps are built on a decentralized network (Ethereum) and interact with smart contracts deployed to the network.
They can be thought of as a GUI (front end) for a smart contract (back end), and can be written in any language (for example,
JavaScript).

If using the [Dev Quickstart](../Tutorials/Quorum-Dev-Quickstart/Getting-Started.md), or existing blockchain, you can
use a demo dapp called [Pet Shop](https://docs.goquorum.consensys.net/en/latest/Tutorials/Quorum-Dev-Quickstart/Using-the-Quickstart/#smart-contract-and-dapp-usage),
provided by [Truffle](https://trufflesuite.com/tutorial)
