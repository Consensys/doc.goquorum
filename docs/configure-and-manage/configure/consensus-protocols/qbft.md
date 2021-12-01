---
description: Configuring QBFT consensus
---

# Configuring QBFT consensus

GoQuorum implements the QBFT Proof-of-Authority (PoA) consensus protocol.
You can [create a private network using QBFT](../../../tutorials/private-network/create-qbft-network.md).

!!! warning
    QBFT is currently an early access feature. It is not recommended for production networks with business critical impact.

In QBFT networks, approved accounts known as validators validate transactions and blocks.
Validators take turns to create the next block.
Before inserting a block onto the chain, a super-majority (greater than 66%) of validators must first sign the block.

Existing validators propose and vote to add or remove validators.
Adding or removing a validator requires a majority vote (greater than 50%) of validators.

!!! important
    Configure your network to ensure you never lose 1/3 or more of your validators.
    If more than 1/3 of validators stop participating, new blocks are no longer created, and the network stalls.
    It may take significant time to recover once nodes are restarted.

Blocks in QBFT are final, meaning there are no forks, and valid blocks must be in the main chain.

To prevent a faulty node from generating a different chain from the main chain, each validator appends `ceil(2N/3)` of
received `COMMIT` signatures to the `extraData` field in a block's header before inserting it into the chain.
Therefore, all blocks are self-verifiable.

## Minimum number of validators

QBFT requires four validators to be Byzantine fault tolerant.
Byzantine fault tolerance is the ability for a blockchain network to function correctly and reach consensus despite nodes
failing or propagating incorrect information to peers.

## Genesis file

To use QBFT, GoQuorum requires a [genesis file](../genesis-file/genesis-options.md).
The genesis file defines properties specific to QBFT and to your specific network.

!!! example "Example QBFT genesis file"

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
            "ceil2Nby3Block": 0,
            "testQBFTBlock": 0
          },
          "txnSizeLimit": 64,
          "maxCodeSize": 0,
          "isQuorum": true
        },
        "nonce": "0x0",
        "timestamp": "0x5f1663fc",
        "extraData": "0xf87aa00000000000000000000000000000000000000000000000000000000000000000f8549493917cadbace5dfce132b991732c6cda9bcc5b8a9427a97c9aaf04f18f3014c32e036dd0ac76da5f1894ce412f988377e31f4d0ff12d74df73b51c42d0ca9498c1334496614aed49d2e81526d089f7264fed9cc080c0",
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

The properties specific to QBFT are in the `istanbul` section:

* `epoch` - Number of blocks that should pass before pending validator votes are reset.
* `policy` - Proposer selection policy, which is 0 (Round Robin) or 1 (Sticky).
  'Round Robin' is where validators take turns in proposing blocks, and 'Sticky' is where a single validator proposes
  blocks until they go offline or are unreachable.
* `ceil2Nby3Block` - Sets the block number from which to use an updated formula for calculating the number of faulty nodes.
  For new networks, we recommended setting this to 0 to use the updated formula immediately.
* `extraData` - RLP encoded string with a list of validators.
  RLP encoding is a space-efficient object serialization scheme used in Ethereum.
* `testQBFTBlock` - QBFT fork block. QBFT is used once the network reaches this block number.

## Block time

The block time is the minimum time between two consecutive QBFT blocks’ timestamps in seconds.
Setting the block time determines how quickly blocks should be minted by the validators.
The default is 1 second.

You can set the block time on each GoQuorum node with the
[`istanbul.blockperiod`](../../../reference/cli-syntax.md#istanbulblockperiod) option:

```bash
--istanbul.blockperiod <INTEGER>
```

You can also set a `requesttimeout` by using the
[`istanbul.requesttimeout`](../../../reference/cli-syntax.md#istanbulrequesttimeout) option:

```bash
--istanbul.requesttimeout <INTEGER>
```

!!! important
    If more than 1/3 of validators stop participating, new blocks can no longer be created and `requesttimeoutseconds`
    doubles with each round change.
    The quickest method to resume block production is to restart all validators, which resets `requesttimeoutseconds` to
    its genesis value.

## Migrating from IBFT to QBFT

You can migrate an existing [IBFT](ibft.md) network to a QBFT network with the following steps:

1. Stop the network.
1. Update the IBFT genesis file with a non-zero `testQBFTBlock` fork block.
   For example, if the current block number in your IBFT network is 100, set `testQBFTBlock` to any block greater than
   100, and once that fork block is reached, QBFT consensus will be used instead of IBFT.

    !!! example "Sample QBFT genesis file"

        ```json
        ...
        "istanbul": {
            "epoch": 30000,
            "policy": 0,
            "ceil2Nby3Block": 0,
            "testQBFTBlock": 120
          },
        ...
        ```

1. Restart the network with the updated genesis file.
