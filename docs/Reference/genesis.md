---
description: Configuration items specified in the GoQuorum genesis file
---

# Genesis file items

The [GoQuorum genesis file](../HowTo/Configure/GenesisOptions.md) contains [network configuration items](#configuration-items)
and [genesis block parameters](#genesis-block-parameters).

## Configuration items

Network configuration items are specified in the genesis file in the `config` object.

| Item                | Description                                                                                                                                                                                 |
|---------------------|-:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Milestone blocks    | [Milestone blocks for the network](#milestone-blocks).                                                                                                                                      |
| `chainId`           | [Chain ID for the network](../Concepts/NetworkAndChainID.md).                                                                                                                               |
| `istanbul`          | Specifies network uses [IBFT](../HowTo/Configure/Consensus-Protocols/IBFT.md) or [QBFT](../HowTo/Configure/Consensus-Protocols/QBFT.md) and contains [IBFT](../HowTo/Configure/Consensus-Protocols/IBFT.md#genesis-file) or [QBFT](../HowTo/Configure/Consensus-Protocols/QBFT.md#genesis-file) configuration items, respectively. |
| `clique`            | Specifies network uses [Clique](../HowTo/Configure/Consensus-Protocols/Clique.md) and contains Clique configuration items.                                                                  |
| `txnSizeLimit`      | Maximum transaction size. The default is `64` (kilobytes), increased from Ethereum's default `32`. This is configurable up to `128`.                                                        |
| `maxCodeSize`       | Maximum smart contract code size. The default is `32` (kilobytes), increased from Ethereum's default `24`. This is configurable up to `128`.                                                |
| `isQuorum`          | Set to `true` to enable `geth` to work as GoQuorum and make additional checks, for example, ensure the gas fee is zero.                                                                     |

!!! note

    Using the [Raft consensus protocol](../HowTo/Configure/Consensus-Protocols/Raft.md) doesn't require a specific item in the `config` object.

## Genesis block parameters

The purpose of some genesis block parameters varies depending on the consensus protocol ([IBFT](../HowTo/Configure/Consensus-Protocols/IBFT.md),
[QBFT](../HowTo/Configure/Consensus-Protocols/QBFT.md), [Raft](../HowTo/Configure/Consensus-Protocols/Raft.md),or
[Clique](../HowTo/Configure/Consensus-Protocols/Clique.md)).
These parameters include:

* `difficulty`.
* `extraData`.
* `mixHash`.

The following table describes the genesis block parameters with the same purpose across all
consensus protocols.

| Item                | Description                                                                                                                             |
|---------------------|-:---------------------------------------------------------------------------------------------------------------------------------------|
| `coinbase`          | Address to pay mining rewards to. Can be any value in the genesis block (commonly set to `0x0000000000000000000000000000000000000000`). |
| `gasLimit`          | Block gas limit. Total gas limit for all transactions in a block.                                                                       |
| `nonce`             | Used in block computation. Can be any value in the genesis block (commonly set to `0x0`).                                               |
| `timestamp`         | Creation date and time of the block. Must be before the next block so we recommend specifying `0x0` in the genesis file.                |
| `alloc`             | Defines [accounts with balances](Accounts-for-Testing.md) or [contracts](../HowTo/Configure/Contracts-in-Genesis.md).                   |

## Milestone blocks

In public networks, the milestone blocks specify the blocks at which the network changed protocol.

!!! example "Ethereum MainNet milestone blocks"

    ```json
    {
      "config": {
        ...
        "homesteadBlock": 1150000,
        "daoForkBlock": 1920000,
        "daoForkSupport": true,
        "eip150Block": 2463000,
        "eip150Hash": "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
        "eip155Block": 2675000,
        "eip158Block": 2675000,
        "byzantiumBlock": 4370000,
        "constantinopleBlock": 7280000,
        "constantinopleFixBlock": 7280000,
        ...
      },
    }
    ```

In private networks, the milestone block defines the protocol version for the network.

!!! example "Private network milestone blocks"

    ```json
    {
      "config": {
        ...
        "constantinopleFixBlock": 0,
        ...
      },
    }
    ```

!!! tip

    When specifying the milestone block for private networks, you only need to specify the latest milestone.
    It is implied this includes the preceding milestones.
