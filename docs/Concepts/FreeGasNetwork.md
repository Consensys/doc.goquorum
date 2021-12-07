---
description: Free gas networks
---

# Free gas networks

GoQuorum is a free gas network, which means there's no gas price.

Transactions use computational resources, so they have associated costs.
*Gas* is the cost unit and *gas price* is the price per gas unit.
The transaction cost is the gas used multiplied by the gas price.

In public Ethereum networks, the account submitting the transaction pays the transaction cost, in Ether.
The miner (or validator, in proof of authority networks) that includes the transaction in a block receives the
transaction cost.

In many private networks, including GoQuorum, network participants run the validators and don't require gas as an incentive.
Networks that don't require gas as an incentive usually remove gas price or configure the gas price to be zero (that is,
free gas).
Some private networks might allocate Ether and use a non-zero gas price to limit resource use.

In free gas networks, the gas price is zero but transactions still use gas, so the transaction cost (gas used multiplied
by the gas price) is zero.

In GoQuorum, gas price is completely removed.
Gas price is not included as a transaction object parameter in [GoQuorum privacy API methods](../Reference/API-Methods.md#privacy-methods).
When using standard Ethereum JSON-RPC methods such as
[`sendSignedTransaction`](https://web3js.readthedocs.io/en/v1.3.4/web3-eth.html#sendsignedtransaction), you must set
`gasPrice` to 0.

!!! tip

    We use the term *free gas network* to refer to a network with a gas price of zero.
    A network with a gas price of zero is also known as a *zero gas network* or *no gas network*.
