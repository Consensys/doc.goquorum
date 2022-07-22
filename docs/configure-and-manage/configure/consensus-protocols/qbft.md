---
description: Configuring QBFT consensus
---

# Configure QBFT consensus

GoQuorum implements the QBFT proof of authority [consensus protocol](../../../concepts/consensus/index.md).
QBFT is the recommended enterprise-grade consensus protocol for private networks.
You can [create a private network using QBFT](../../../tutorials/private-network/create-qbft-network.md).

In QBFT networks, approved accounts known as validators validate transactions and blocks.
Validators take turns to create the next block.
Before inserting a block onto the chain, a super-majority (greater than or equal to 2/3) of validators must first sign the block.

Existing validators propose and vote to [add or remove validators](#add-and-remove-validators).
Adding or removing a validator requires a majority vote (greater than 50%) of validators.

!!! important

    Configure your network to ensure you never lose more than 1/3 of your validators.
    If more than 1/3 of validators stop participating, new blocks are no longer created, and the network stalls.
    It may take significant time to recover once nodes are restarted.

Blocks in QBFT are final, meaning there are no forks, and valid blocks must be in the main chain.

To prevent a faulty node from generating a different chain from the main chain, each validator appends `ceil(2N/3)` of
received `COMMIT` signatures to the `extraData` field in a block's header before inserting it into the chain.
Therefore, all blocks are self-verifiable.

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

* `epochlength` - Number of blocks that should pass before pending validator votes are reset.
* `blockperiodseconds` - The minimum block time, in seconds.
* `requesttimeoutseconds` - The timeout for each consensus round before a round change, in seconds.
* `policy` - Proposer selection policy, which is 0 (Round Robin) or 1 (Sticky).
  'Round Robin' is where validators take turns in proposing blocks, and 'Sticky' is where a single validator proposes
  blocks until they go offline or are unreachable.
* `ceil2Nby3Block` - Sets the block number from which to use an updated formula for calculating the number of faulty nodes.
  For new networks, we recommended setting this to 0 to use the updated formula immediately.
* `validatorcontractaddress` - Address of the validator smart contract. Required only if using a contract validator selection.
  This option can also be used in the [transitions](#transitions) configuration item if swapping validator management methods in an existing network.
* `extraData` - RLP encoded string with a list of validators.
  RLP encoding is a space-efficient object serialization scheme used in Ethereum.

## Block time

When the protocol receives a new chain head, the block time (`blockperiodseconds`) timer starts.
When `blockperiodseconds` expires, the round timeout (`requesttimeoutseconds`)
timer starts and the protocol proposes a new block. The default is 1 second.

If `requesttimeoutseconds` expires before adding the proposed block,
a round change occurs, with the block time and timeout timers reset.
The timeout period for the new round is two times `requesttimeoutseconds`.
The timeout period continues to double each time a round fails to add a block.

Usually, the protocol adds the proposed block before reaching `requesttimeoutseconds`.
A new round then starts, resetting the block time and round timeout timers.
When `blockperiodseconds` expires, the protocol proposes the next new block.

!!! important
    If more than 1/3 of validators stop participating, new blocks can no longer be created and `requesttimeoutseconds`
    doubles with each round change.
    The quickest method to resume block production is to restart all validators, which resets `requesttimeoutseconds` to
    its genesis value.

## Add and remove validators

QBFT provides two methods to manage validators:

* [Block header validator selection](../../../tutorials/private-network/adding-removing-qbft-validators.md) - Existing validators propose and
  vote to add or remove validators using the JSON-RPC API methods.

* [Contract validator selection](#add-and-remove-validators-using-a-smart-contract) - Use a smart contract to specify
  the validators used to propose and validate blocks.

You can use [transitions](#transitions) to swap between block header validator selection and contract
validator selection in an existing network.

For block header validator selection, initial validators are configured in the genesis file's
`extraData` property, whereas the initial validators when using the contract validator selection
method are configured in the genesis file's `validatorcontractaddress` section.

### Minimum number of validators

QBFT requires four validators to be Byzantine fault tolerant.
Byzantine fault tolerance is the ability for a blockchain network to function correctly and reach consensus despite nodes
failing or propagating incorrect information to peers.

### Add and remove validators using a smart contract

Users can create their own smart contracts to add or remove validators based on their organizational requirements.
View the [example smart contract](https://github.com/ConsenSys/validator-smart-contracts) for more information on how to
create and deploy the smart contract.

You can pre-deploy the validator smart contract in a new QBFT network by specifying the contract details in the
[genesis file](#genesis-file).

!!! important

    You can't use the JSON-RPC methods to add or remove validators when using a smart contract to manage nodes.
    You must interact with the contract functions using transactions.

## Migrate from IBFT to QBFT

You can migrate an existing [IBFT](ibft.md) network to a QBFT network with the following steps:

1. Stop all nodes in the network.
1. Update the genesis file with a suitable transition block, this needs to be far enough in the future so that you can co-ordinate ahead of time.
    For example, if the current block number in your IBFT network is 100, set transiton block to any block greater than
    100, and once that fork block is reached, QBFT consensus will be used instead of IBFT.

    !!! example "Sample QBFT genesis file"

        ```json
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
1. run `geth init` with the new genesis file
1. Restart the network with the updated genesis file.

## Transitions

The `transitions` genesis configuration item allows you to specify a future block number at which to change QBFT
network configuration in an existing network.
For example, you can update the [block time](#configure-block-time-on-an-existing-network) or
[validator management method](#swap-validator-management-methods).

!!! caution

    Do not specify a transition block in the past.
    Specifying a transition block in the past could result in unexpected behavior, such as causing
    the network to fork.

### Configure block time on an existing network

To update an existing network with a new `blockperiodseconds`:

1. Stop all nodes in the network.
1. In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    * `<FutureBlockNumber>` is the upcoming block at which to change `blockperiodseconds`.
    * `<NewValue>` is the updated value for `blockperiodseconds`.

    !!! example "Transitions configuration"

        === "Syntax"

            ```bash
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

        === "Example"

            ```bash
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

1. run `geth init` with the new genesis file
1. Restart all nodes in the network using the updated genesis file.
1. To verify the changes after the transition block, call
  [`istanbul_getValidators`](../../../reference/api-methods.md#istanbul_getvalidators), specifying `latest`.

### Swap validator management methods

To swap between block header validator selection and contract validator selection methods in an existing network:

1. Stop all nodes in the network.
2. In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    * `<FutureBlockNumber>` is the upcoming block at which to change the validator selection method.
    * `<SelectionMode>` is the validator selection mode to switch to. Valid options are `contract` and `blockheader`.
    * `<ContractAddress>` is the smart contract address, if switching to the contract validator selection method.

    !!! example "Transitions configuration"

        === "Syntax"

            ```bash
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

        === "Example"

            ```bash
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

3. [Restart all nodes](../../../tutorials/private-network/create-qbft-network.md#5-initialize-nodes) in the network using the updated genesis file.
