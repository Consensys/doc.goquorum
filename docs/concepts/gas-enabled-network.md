---
description: Gas enabled networks
---

# Gas enabled networks

By default, GoQuorum is a [free gas network](free-gas-network.md), which means gas is not consumed by transactions.
However, gas price can be enabled if required.

Transactions use computational resources, so they have associated costs.
*Gas* is the cost unit and *gas price* is the price per gas unit.
The transaction cost is the gas used multiplied by the gas price.

If gas is enabled, then similar to public Ethereum networks, the account submitting the transaction pays the transaction cost, in Ether.
The miner (or validator, in proof of authority networks) that includes the transaction in a block receives the
transaction cost.

## Using gas in GoQuorum

### Enabling gas price

To enable gas price in GoQuorum, set `enableGasPriceBlock` in the GoQuorum
[genesis file](../configure-and-manage/configure/genesis-file/genesis-options.md) `config` object to a future block, when the entire network is
ready to transact with gas price enabled transactions.
All GoQuorum nodes in the network must be initialized with the same `enableGasPriceBlock` value.

!!! note

    You need to re-run `geth init` when you update the genesis file to incorporate the changes. This does not delete or modify any current sync process or saved blocks.

## Nuances of gas price in GoQuorum

There are some nuances around gas price and the rewarded account, which vary depending on which consensus mechanism is selected.
These will impact how a gas enabled GoQuorum network is set up, and are described below.

### Private transactions

The amount of gas consumed by a private transaction is only the `intrinsic gas` value, and this is based on the private transaction hash held in the `data` field (rather than the entire private payload).
The actual cost of creating or executing a private contract cannot be used, as the minter might not be a party to the transaction, and hence unable to calculate the real cost.

Also, the amount of gas used is by a private transaction is not show in the transaction receipt.
This is to avoid leakage of details about the private transaction.

### Raft

The transaction cost is rewarded to the etherbase account (aka coinbase account), which is the default primary local account.
The etherbase account can be set on startup using the command line flag `--miner.etherbase`.
Note that for technical reasons the etherbase account cannot be changed at runtime using `miner.SetEtherbase()`.

If `--mine` is not provided on the command line then the (leader) node will still mint blocks, but `--miner.gasprice` will be ignored.
Also, the txpool default gasPrice won’t be set to 1000000000.
Therefore we suggest starting all raft nodes with ‘--mine'.

Standard geth behaviour is that if a transaction has less gas than the accepted minimum (set using `--miner.gasprice`) then it will not be mined by remote miner nodes.
On Raft, there is no rotation of miners, therefore if the local node is not the minter then it means the transaction will remain pending until it is resubmitted with an above minimum gas value (or until the local node becomes the miner).

Raft inherits the static block reward that is awarded to miners on upstream geth. The static block reward amount varies according to the current release, with the following values currently defined:

- FrontierBlockReward           = big.NewInt(5e+18) // Block reward in wei for successfully mining a block
- ByzantiumBlockReward          = big.NewInt(3e+18) // Block reward in wei for successfully mining a block upward from Byzantium
- ConstantinopleBlockReward     = big.NewInt(2e+18) // Block reward in wei for successfully mining a block upward from Constantinople

!!! info

    The block `miner` field is now populated with the rewarded account.

### Istanbul

Standard geth behaviour is that if a transaction has less gas than the accepted minimum (set using `--miner.gasprice`) then it will not be mined by remote miner nodes.
On Istanbul, it means the transaction is only processed when the current node becomes voted in as minter.

The Istanbul block signer is rewarded for creating the block, using the account number derived from the nodekey of the miner.

Note that `miner.SetEtherbase()`, and the command line flag `--miner.etherbase` have no effect for Istanbul.

### Clique

Standard geth behaviour is that if a transaction has less gas than the accepted minimum (set using `--miner.gasprice`) then it will not be mined by remote miner nodes.
On Clique, it means the transaction is only processed when the current node becomes voted in as minter.

The Clique block signer is rewarded for creating the block, this is the coinbase account of the miner and will be present in the `extraData` field of the genesis block or have been added using `clique.propose()` (otherwise an "unathorized signer" error will occur).

Note that `miner.SetEtherbase()`, and the command line flag `--miner.etherbase` have no effect for Clique.
