---
description: Configuring IBFT consensus
---

# Configuring IBFT consensus

GoQuorum implements the [IBFT](../../../Concepts/Consensus/IBFT.md) Proof-of-Authority (PoA)
consensus protocol. Private networks can use IBFT. Blocks in Istanbul BFT protocol are final,
which means that there are no forks and any valid block must be somewhere in the main chain.
To prevent a faulty node from generating a totally different chain from the main chain,
each validator appends ceil(2N/3) of received COMMIT signatures to extraData field in the
header before inserting it into the chain. Thus all blocks are self-verifiable.

!!! warning

    Configure your network to ensure you never lose 1/3 or more of your validators. If more
    than 1/3 of validators stop participating, new blocks are no longer created, and the
    network stalls. It may take significant time to recover once nodes are restarted.

In IBFT networks, approved accounts also known as validators, validate transactions and blocks.
Validators take turns to create the next block. Before inserting the block onto the chain, a
super-majority (greater than 66%) of validators must first sign the block.

Existing validators propose and vote to
[add or remove validators](#add-or-remove-validators). Adding or removing a validator
requires a majority vote (greater than 50%) of validators.

## Minimum number of validators

IBFT requires four validators to be Byzantine fault tolerant. Byzantine fault tolerance is the
ability for a blockchain network to function correctly and reach consensus despite nodes failing or
propagating incorrect information to peers.

## Genesis file

To use IBFT, GoQuorum requires an IBFT genesis file. The genesis file defines properties
specific to IBFT and to your specific network.

!!! example "Sample IBFT Genesis File"

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

* `epoch` - Specifies the number of blocks that should pass before pending validator votes
  are reset.
* `policy` - Refers to the prosper selection policy, which is 0 (Round Robin) or 1 (Sticky).
  'Round robin' is where validators take turns in proposing blocks, 'Sticky' is where a single
  validator proposes blocks until they go offline or unreachable
* `ceil2Nby3Block` - Sets the block number from which to use an updated formula for
  calculating the number of faulty nodes. For new networks, it is recommended to set this
  value to 0 to use the updated formula immediately.
* `extraData` - RLP encoded string with a list of validtors
  `RLP([32 bytes Vanity, List<Validators>, No Vote, Round=Int(0), 0 Seals])`. RLP encoding
  is a space efficient object serialization scheme used in Ethereum.

### Block time

This is the minimum time between two consecutive IBFT blocks’ timestamps in seconds. Setting the
block period determines how quickly blocks should be minted by the validators. The default is 1.
This is set on each GoQuorum node with the cli option

```bash
--istanbul.blockperiod <INTEGER>
```

In addition to this you also need to set a `requesttimeout` by using the cli option

```bash
--istanbul.requesttimeout <INTEGER>
```

!!! warning

    If more than 1/3 of validators stop participating, new blocks can no longer be created and
    `requesttimeoutseconds` doubles with each round change. The quickest method
    to resume block production is to restart all validators, which resets `requesttimeoutseconds` to
    its genesis value.

## Add or Remove Validators

The approach to adding or removing validators is typically done via API's or the Geth CLI, and the
thing to note is that the process of adding or removing a validator must be done on greater than
50% of the existing validator pool

1. The first thing to do is to add the node's enode to the `static-nodes.json` file, which will allow
other nodes to peer with it. This needs to be done on every validator node in the network, and
ideally on every node in the network depending on your permissions policy.

2. The next thing to obtain the validator's address which can be obtained via the
[istanbul_nodeAddress](../../../Reference/API-Methods.md/#istanbul_nodeAddress) API call.

3. To add a validator you can then make an API call from greater than 50% of the existing validator
pool like so:

```bash
istanbul.propose(NODE_ADDRESS, ENABLED)
```

where:

* NODE_ADDRESS - is your node's address in hex and,
* ENABLED - is a boolean representing whether the node should be a validaotr or not. To set
  the node as a validator, set the value of ENABLED to `true` and to remove the node from
  the validator pool, set it to `false`

More information and a
[tutorial](../../../Tutorials/Private-Network/Adding-removing-IBFT-validators.md) is also
available.

## Add or Remove Non-Validator Nodes

A normal node (non-validator) follows the exact same process as above but ends at step 1.

More information and a
[tutorial](../../../Tutorials/Private-Network/Adding-removing-IBFT-validators.md/) is also
available.
