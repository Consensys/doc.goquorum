---
description: Gas enabled networks
---

# Gas-enabled networks

By default, GoQuorum is a [free gas network](free-gas-network.md), which means gas is priced at zero and is not consumed when transactions are processed.
However, gas price can be enabled if required.

Transactions use computational resources, so they have associated costs.
*Gas* is the cost unit and *gas price* is the price per gas unit.
The transaction cost is the gas used multiplied by the gas price.

If gas is enabled, then similar to public Ethereum networks, the account submitting the transaction pays the transaction cost, in Ether.
The miner (or validator, in [proof of authority networks](consensus/comparing-poa.md)) that includes the transaction in a block receives the
transaction cost.

## Enable gas price

To enable gas price in GoQuorum, set `enableGasPriceBlock` in the GoQuorum
[genesis file](../configure-and-manage/configure/genesis-file/genesis-options.md) `config` object to a future block,
when the entire network is ready to transact with gas-enabled transactions.
All GoQuorum nodes in the network must be initialized with the same `enableGasPriceBlock` value.

!!! note

    You need to re-run `geth init` when you update the genesis file to incorporate the changes.
    This doesn't delete or modify any current sync process or saved blocks.

## Nuances of gas price in GoQuorum

The following sections describe some nuances around gas price and the rewarded account,
which vary depending on which consensus mechanism is selected.
These impact how a gas-enabled GoQuorum network is set up.

### Private transactions

The amount of gas consumed by a private transaction is only the `intrinsic gas` value,
and this is based on the private transaction hash held in the `data` field (rather than the entire private payload).
The actual cost of creating or executing a private contract can't be used.
Members who aren't party to the transaction can't calculate the private gas cost and the network doesn't reach a consensus.

Also, the amount of gas used by a private transaction is not shown in the transaction receipt.
This is to avoid leakage of details about the private transaction.

### Privacy marker transactions

The (public) privacy marker transaction consumes gas as normal.
However, the inner private transaction isn't available to non-participants,
therefore members who aren't party to the transaction can't calculate the intrinsic gas.
Therefore, the private transaction doesn't consume any gas.

### IBFT

Standard geth behavior is that if a transaction has less gas than the accepted minimum
(set using `--miner.gasprice`) then it is not mined by remote miner nodes.
On IBFT, it means the transaction is only processed when the current node becomes voted in as minter.

The IBFT block signer is rewarded for creating the block, using the account number derived from the node key of the miner.

Note that `miner.SetEtherbase()`, and the command line flag `--miner.etherbase` have no effect for IBFT.

### Clique

Standard geth behavior is that if a transaction has less gas than the accepted minimum
(set using `--miner.gasprice`) then it is not mined by remote miner nodes.
On Clique, it means the transaction is only processed when the current node becomes voted in as minter.

The Clique block signer is rewarded for creating the block through the coinbase account of the miner.
The account is in the `extraData` field of the genesis block or has been added using `clique.propose()`
Otherwise an `unauthorized signer` error occurs.

Note that `miner.SetEtherbase()`, and the command line flag `--miner.etherbase` have no effect for Clique.

### Raft

The transaction cost is rewarded to the etherbase account (aka coinbase account), which is the default primary local account.
The etherbase account can be set on startup using the command line flag `--miner.etherbase`.
Note that for technical reasons the etherbase account can't be changed at runtime using `miner.SetEtherbase()`.

If `--mine` is not provided on the command line then the (leader) node still mints blocks,
but `--miner.gasprice` is ignored.
Also, the transaction pool default `gasPrice` won’t be set to `1000000000`.
Therefore, we suggest starting all raft nodes with `--mine`.

Standard geth behavior is that if a transaction has less gas than the accepted minimum
(set using `--miner.gasprice`) then it is not mined by remote miner nodes.
On Raft, there is no rotation of miners, so if the local node is not the minter then the transaction remains pending
until it is resubmitted with an above minimum gas value (or until the local node becomes the miner).

Raft inherits the static block reward that is awarded to miners on upstream geth.
The static block reward amount varies according to the current release, with the following values currently defined:

- `FrontierBlockReward`           = big.NewInt(5e+18) // Block reward in wei for successfully mining a block
- `ByzantiumBlockReward`          = big.NewInt(3e+18) // Block reward in wei for successfully mining a block upward from Byzantium
- `ConstantinopleBlockReward`     = big.NewInt(2e+18) // Block reward in wei for successfully mining a block upward from Constantinople

!!! info

    The block `miner` field is now populated with the rewarded account.

### QBFT

QBFT consensus protocol has its own specific way to reward the validated blocks, compatible with besu or with other modes.
For more information, see the [block reward section](../configure-and-manage/configure/consensus-protocols/qbft.md#block-reward) in QBFT protocol.