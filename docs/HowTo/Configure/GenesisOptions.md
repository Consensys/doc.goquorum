---
description: Configuring a network using a genesis file.
---

# Creating the GoQuorum genesis file

The genesis file defines the first block in the chain, and the first block defines which chain you
want to join.

[Create a JSON genesis file](https://consensys.net/blog/quorum/hyperledger-besu-how-to-create-an-ethereum-genesis-file/),
then specify the genesis file when initalizing GoQuorum with:

```bash
geth init <PATH-TO-GENESIS-FILE>
```

The genesis file specifies the [network-wide settings](../../Reference/genesis.md), so all nodes in a network must use
the same genesis file.

!!! example "Example Raft genesis file"

    ``` json
    {
      "alloc": {
        "0xed9d02e382b34818e88b88a309c7fe71e65f419d": {
          "balance": "1000000000000000000000000000"
        },
        "0xca843569e3427144cead5e4d5999a3d0ccf92b8e": {
          "balance": "1000000000000000000000000000"
        },
        "0x0fbdc686b912d7722dc86510934589e0aaf3b55a": {
          "balance": "1000000000000000000000000000"
        },
        "0x9186eb3d20cbd1f5f992a950d808c4495153abd5": {
          "balance": "1000000000000000000000000000"
        },
        "0x0638e1574728b6d862dd5d3a3e0942c3be47d996": {
          "balance": "1000000000000000000000000000"
        }
      },
      "coinbase": "0x0000000000000000000000000000000000000000",
      "config": {
        "homesteadBlock": 0,
        "byzantiumBlock": 0,
        "constantinopleBlock": 0,
        "chainId": 10,
        "eip150Block": 0,
        "eip155Block": 0,
        "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "eip158Block": 0,
        "maxCodeSizeConfig": [
          {
            "block": 0,
            "size": 35
          }
        ],
        "isQuorum": true
      },
      "difficulty": "0x0",
      "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "gasLimit": "0xE0000000",
      "mixhash": "0x00000000000000000000000000000000000000647572616c65787365646c6578",
      "nonce": "0x0",
      "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": "0x00"
    }
    ```
