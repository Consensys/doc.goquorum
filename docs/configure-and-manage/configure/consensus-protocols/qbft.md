---
title: QBFT
description: Configuring QBFT consensus
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure QBFT consensus

GoQuorum implements the QBFT proof of authority [consensus protocol](../../../concepts/consensus-index.md). QBFT is the recommended enterprise-grade consensus protocol for private networks. You can [create a private network using QBFT](../../../tutorials/private-network/create-qbft-network.md).

In QBFT networks, approved accounts known as validators validate transactions and blocks. Validators take turns to create the next block. Before inserting a block onto the chain, a super-majority (greater than or equal to 2/3) of validators must first sign the block.

Existing validators propose and vote to [add or remove validators](#add-and-remove-validators). Adding or removing a validator requires a majority vote (greater than 50%) of validators.

:::caution

Configure your network to ensure you never lose more than 1/3 of your validators. If more than 1/3 of validators stop participating, new blocks are no longer created, and the network stalls. It may take significant time to recover once nodes are restarted.

:::

Blocks in QBFT are final, meaning there are no forks, and valid blocks must be in the main chain.

To prevent a faulty node from generating a different chain from the main chain, each validator appends `ceil(2N/3)` of received `COMMIT` signatures to the `extraData` field in a block's header before inserting it into the chain. Therefore, all blocks are self-verifiable.

## Genesis file

To use QBFT, GoQuorum requires a [genesis file](../genesis-file/genesis-options.md). The genesis file defines properties specific to QBFT and to your specific network.

```json title="Example QBFT genesis file"
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
      "qbft": {
        "epochlength": 30000,
        "blockperiodseconds": 2
        "requesttimeoutseconds": 4
        "policy": 0,
        "ceil2Nby3Block": 0,
        "validatorcontractaddress": "0x0000000000000000000000000000000000007777"
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

The properties specific to QBFT are in the `qbft` section:

- `epochlength` - Number of blocks that should pass before pending validator votes are reset.
- `blockperiodseconds` - The minimum block time, in seconds.
- `requesttimeoutseconds` - The timeout for each consensus round before a round change, in seconds.
- `policy` - Proposer selection policy, which is 0 (Round Robin) or 1 (Sticky). 'Round Robin' is where validators take turns in proposing blocks, and 'Sticky' is where a single validator proposes blocks until they go offline or are unreachable.
- `ceil2Nby3Block` - Sets the block number from which to use an updated formula for calculating the number of faulty nodes. For new networks, we recommended setting this to 0 to use the updated formula immediately.
- `validatorcontractaddress` - Address of the validator smart contract. Required only if using a contract validator selection. This option can also be used in the [transitions](#transitions) configuration item if swapping validator management methods in an existing network.
- `extraData` - RLP encoded string with a list of validators. RLP encoding is a space-efficient object serialization scheme used in Ethereum.

## Block time

When the protocol receives a new chain head, the block time (`blockperiodseconds`) timer starts. When `blockperiodseconds` expires, the round timeout (`requesttimeoutseconds`) timer starts and the protocol proposes a new block. The default is 1 second.

If `requesttimeoutseconds` expires before adding the proposed block, a round change occurs, with the block time and timeout timers reset. The timeout period for the new round is two times `requesttimeoutseconds`. The timeout period continues to double each time a round fails to add a block.

Usually, the protocol adds the proposed block before reaching `requesttimeoutseconds`. A new round then starts, resetting the block time and round timeout timers. When `blockperiodseconds` expires, the protocol proposes the next new block.

:::caution

If more than 1/3 of validators stop participating, new blocks can no longer be created and `requesttimeoutseconds` doubles with each round change. The quickest method to resume block production is to restart all validators, which resets `requesttimeoutseconds` to its genesis value.

:::

## Add and remove validators

QBFT provides two methods to manage validators:

- [Block header validator selection](../../../tutorials/private-network/adding-removing-qbft-validators.md) - Existing validators propose and vote to add or remove validators using the JSON-RPC API methods.

- [Contract validator selection](#add-and-remove-validators-using-a-smart-contract) - Use a smart contract to specify the validators used to propose and validate blocks.

You can use [transitions](#transitions) to swap between block header validator selection and contract validator selection in an existing network.

For block header validator selection, initial validators are configured in the genesis file's `extraData` property, whereas the initial validators when using the contract validator selection method are configured in the genesis file's `validatorcontractaddress` section.

### Minimum number of validators

QBFT requires four validators to be Byzantine fault tolerant. Byzantine fault tolerance is the ability for a blockchain network to function correctly and reach consensus despite nodes failing or propagating incorrect information to peers.

### Add and remove validators using a smart contract

Users can create their own smart contracts to add or remove validators based on their organizational requirements. View the [example smart contract](https://github.com/ConsenSys/validator-smart-contracts) for more information on how to create and deploy the smart contract.

You can pre-deploy the validator smart contract in a new QBFT network by specifying the contract details in the [genesis file](#genesis-file).

:::caution

You can't use the JSON-RPC methods to add or remove validators when using a smart contract to manage nodes. You must interact with the contract functions using transactions.

:::

## Migrate from IBFT to QBFT

You can migrate an existing [IBFT](ibft.md) network to a QBFT network with the following steps:

1.  Stop all nodes in the network.
2.  Update the genesis file with a suitable transition block, this needs to be far enough in the future so that you can co-ordinate ahead of time. For example, if the current block number in your IBFT network is 100, set transition block to any block greater than 100, and once that fork block is reached, QBFT consensus will be used instead of IBFT.

    ```json title="Sample QBFT genesis file"
    ...
    "istanbul": {
        "epoch": 30000,
        "policy": 0,
        "ceil2Nby3Block": 0
      },
      "transitions": [{
        "block": 120,
        "algorithm": "qbft"
      }]
    ...
    ```

3.  run `geth init` with the new genesis file
4.  Restart the network with the updated genesis file.

## Transitions

The `transitions` genesis configuration item allows you to specify a future block number at which to change QBFT network configuration in an existing network. For example, you can update the [block time](#configure-block-time-on-an-existing-network), configure [rewards](#rewards), or [validator management method](#swap-validator-management-methods).

:::caution

Do not specify a transition block in the past. Specifying a transition block in the past could result in unexpected behavior, such as causing the network to fork.

:::

### Configure block time on an existing network

To update an existing network with a new `blockperiodseconds`:

1.  Stop all nodes in the network.
2.  In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change `blockperiodseconds`.
    - `<NewValue>` is the updated value for `blockperiodseconds`.

    <br />

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": [{
          "block": <FutureBlockNumber>,
          "blockperiodseconds": <NewValue>
        }]
      },
      ...
    }
    ```

  </TabItem>
  <TabItem value="Example" label="Example" >

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": [{
          "block": 1240,
          "blockperiodseconds": 4
        }]
      }
    ...
    }
    ```
  
  </TabItem>
</Tabs>

3.  run `geth init` with the new genesis file
4.  Restart all nodes in the network using the updated genesis file.
5.  To verify the changes after the transition block, call [`istanbul_getValidators`](../../../reference/api-methods.md#istanbul_getvalidators), specifying `latest`.

### Configure empty block period

A block is produced every block period, whether there are transactions or not. This can lead to your network being bloated with many empty blocks, especially if you have a low block period such as one second. Configuring `emptyBlockPeriodSeconds` helps to reduce the number of empty blocks produced in your network. You can specify `emptyBlockPeriodSeconds` using the config section or with a transition.

```json
"transitions": [{
  "block": ...,
  "blockPeriodSeconds": 2
  "emptyBlockPeriodSeconds": 60
}]
```

In the preceding example, a block is produced every two seconds if there are transactions pending to be mined. If no transactions are pending, then blocks are not produced until after 60 seconds.

The blocks produced with those settings could have timestamps similar to the following:

```yaml
block: 10
timestamp: 07:00:00
transactions: 1

block: 11
timestamp: 07:00:02
transactions: 3

block: 12
timestamp: 07:01:02
transactions: 0

block: 13
timestamp: 07:02:02
transactions: 0

block: 14
timestamp: 07:02:08
transactions: 2

block: 15
timestamp: 07:02:42
transactions: 1

block: 16
timestamp: 07:03:12
transactions: 1
```

:::note

If `emptyBlockPeriodSeconds` is less than `blockPeriodSeconds`, empty blocks continue to be produced at the rate specified in `blockPeriodSeconds`.

:::

### Rewards

When you are using a [gas-enabled network](../../../concepts/gas-enabled-network.md), you can configure who receives the rewards using a transition. There are two types of rewards: transaction cost rewards and block rewards. By default, the transaction cost rewards go to the validator and there are no additional block rewards allocated.

#### Transaction cost rewards

When sending a transaction on a gas-enabled network, the cost of the transaction is deducted from the sender. This amount is then allocated as determined by the `beneficiaryMode`.

#### Block rewards

In addition to transaction cost rewards, you can apply an optional, extra amount as a block reward at each block.

#### Configure rewards

To configure rewards, add a `transitions` configuration item and set the following:

- `blockReward` is in wei, and can be either a decimal or hexadecimal-encoded value in a string - this is optional.
- `miningBeneficiary` is a single account to receive benefits when the `miningBeneficiary` is set to `"fixed"`.
- `beneficiaryMode` is `"fixed"` for a fixed single account or `"validator"` for the validator that validates that block. This applies to both transaction cost rewards and block rewards.

<Tabs>

  <TabItem value="Single account no block reward" label="Single account no block reward" default>

```json
"transitions": [{
  "block": ...,
  "miningBeneficiary": "0x...",
  "beneficiaryMode":"fixed"
}]
```

  </TabItem>
  <TabItem value="Validators no block rewards" label="Validators no block rewards" >

```json
"transitions": [{
  "block": ...,
  "beneficiaryMode": "validator"
}]
```

  </TabItem>
</Tabs>

<Tabs>

  <TabItem value="Single account with block reward" label="Single account with block reward" default>

```json
"transitions": [{
  "block": ...,
  "blockReward": "0xc",
  "miningBeneficiary": "0x...",
  "beneficiaryMode":"fixed"
}]
```

  </TabItem>
  <TabItem value="Validators with block rewards" label="Validators with block rewards" >

```json
"transitions": [{
  "block": ...,
  "blockReward": "13",
  "beneficiaryMode": "validator"
}]
```

  </TabItem>
</Tabs>

### Swap validator management methods

To swap between block header validator selection and contract validator selection methods in an existing network:

1.  Stop all nodes in the network.
2.  In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change the validator selection method.
    - `<SelectionMode>` is the validator selection mode to switch to. Valid options are `contract` and `blockheader`.
    - `<ContractAddress>` is the smart contract address, if switching to the contract validator selection method.

    <br />

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 5,
          "epochlength": 30000,
          "requesttimeoutseconds": 10
        },
        "transitions": [{
          "block": <FutureBlockNumber>,
          "validatorselectionmode": <SelectionMode>,
          "validatorcontractaddress": <ContractAddress>
        }]
      },
      ...
    }
    ```

  </TabItem>
  <TabItem value="Example" label="Example" >

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 5,
          "epochlength": 30000,
          "requesttimeoutseconds": 10
        },
        "transitions": [{
          "block": 102885,
          "validatorselectionmode": "contract",
          "validatorcontractaddress": "0x0000000000000000000000000000000000007777"
        }]
      },
      ...
    }
    ```
    
  </TabItem>
</Tabs>

3.  [Restart all nodes](../../../tutorials/private-network/create-qbft-network.md#5-initialize-nodes) in the network using the updated genesis file.
