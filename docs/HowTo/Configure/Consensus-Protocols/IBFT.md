---
description: Configuring IBFT consensus
---

# Configuring IBFT consensus

GoQuorum implements the [IBFT](../../../Concepts/Consensus/IBFT.md) Proof-of-Authority (PoA)
consensus protocol.
Private networks can use IBFT.
Blocks in IBFT protocol are final, which means that there are no forks and any valid block must be somewhere in the main chain.

To prevent a faulty node from generating a different chain from the main chain, each validator appends `ceil(2N/3)` of
received `COMMIT` signatures to the `extraData` field in a block's header before inserting it into the chain.
Therefore, all blocks are self-verifiable.

In IBFT networks, approved accounts known as validators validate transactions and blocks.
Validators take turns to create the next block.
Before inserting a block onto the chain, a super-majority (greater than 66%) of validators must first sign the block.

Existing validators propose and vote to [add or remove validators](#add-or-remove-validators).
Adding or removing a validator requires a majority vote (greater than 50%) of validators.

!!! important

    Configure your network to ensure you never lose 1/3 or more of your validators.
    If more than 1/3 of validators stop participating, new blocks are no longer created, and the network stalls.
    It may take significant time to recover once nodes are restarted.

## Minimum number of validators

IBFT requires four validators to be Byzantine fault tolerant.
Byzantine fault tolerance is the ability for a blockchain network to function correctly and reach consensus despite nodes
failing or propagating incorrect information to peers.

## Genesis file

To use IBFT, GoQuorum requires a genesis file.
The genesis file defines properties specific to IBFT and to your specific network.

!!! example "Sample IBFT genesis file"

    Example genesis file for a 4 nodes IBFT2 network.

    ```json
      {
        "config": {
          "chainId": 1337,
          "homesteadBlock": 0,
          "eip150Block": 0,
          "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "eip155Block": 0,
          "eip158Block": 0,
          "byzantiumBlock": 0,
          "constantinopleBlock": 0,
          "istanbul": {
            "epoch": 30000,
            "policy": 0,
            "ceil2Nby3Block": 0
          },
          "txnSizeLimit": 64,
          "maxCodeSize": 0,
          "isQuorum": true
        },
        "nonce": "0x0",
        "timestamp": "0x5f1663fc",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000f89af8549493917cadbace5dfce132b991732c6cda9bcc5b8a9427a97c9aaf04f18f3014c32e036dd0ac76da5f1894ce412f988377e31f4d0ff12d74df73b51c42d0ca9498c1334496614aed49d2e81526d089f7264fed9cb8410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0",
        "gasLimit" : "0xf7b760",
        "difficulty": "0x1",
        "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": {},
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
      }
    ```

The properties specific to IBFT are in the `istanbul` section:

* `epoch` - Number of blocks that should pass before pending validator votes are reset.
* `policy` - Proposer selection policy, which is 0 (Round Robin) or 1 (Sticky).
  'Round Robin' is where validators take turns in proposing blocks, and 'Sticky' is where a single validator proposes
  blocks until they go offline or are unreachable.
* `ceil2Nby3Block` - Sets the block number from which to use an updated formula for calculating the number of faulty nodes.
  For new networks, we recommended setting this to 0 to use the updated formula immediately.
* `extraData` - RLP encoded string with a list of validators.
  RLP encoding is a space-efficient object serialization scheme used in Ethereum.

## Block time

The block time is the minimum time between two consecutive IBFT blocks’ timestamps in seconds.
Setting the block time determines how quickly blocks should be minted by the validators.
The default is 1 second.

You can set the block time on each GoQuorum node with the
[`istanbul.blockperiod`](../../../Reference/CLI-Syntax.md#istanbulblockperiod) option:

```bash
--istanbul.blockperiod <INTEGER>
```

You can also set a `requesttimeout` by using the
[`istanbul.requesttimeout`](../../../Reference/CLI-Syntax.md#istanbulrequesttimeout) option:

```bash
--istanbul.requesttimeout <INTEGER>
```

!!! important

    If more than 1/3 of validators stop participating, new blocks can no longer be created and `requesttimeoutseconds`
    doubles with each round change.
    The quickest method to resume block production is to restart all validators, which resets `requesttimeoutseconds` to
    its genesis value.

## Add or remove validators

You can [add or remove IBFT validators](../../../Tutorials/Private-Network/Adding-removing-IBFT-validators.md#adding-a-validator).
To add a validator:

1. Add the node's enode to the `static-nodes.json` file, which allows other nodes to peer with it.
   Repeat on every validator node in the network, and ideally on every node in the network depending on your permissions policy.

2. Obtain the validator's address by calling [istanbul_nodeAddress](../../../Reference/API-Methods.md#istanbul_nodeAddress).

3. Call [istanbul_propose](../../../Reference/API-Methods.md#istanbul_propose) from greater than 50% of the existing validator pool.

## Add or remove non-validator nodes

You can [add or remove IBFT non-validator nodes](../../../Tutorials/Private-Network/Adding-removing-IBFT-validators.md#adding-a-non-validator-node).
Adding a non-validator node is simply step 1 of [adding a validator](#add-or-remove-validators).
