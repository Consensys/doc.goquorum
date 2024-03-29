---
title: GraphQL
description: Using GoQuorum GraphQL API
sidebar_position: 7
---

# GoQuorum GraphQL

## Overview

Ethereum has defined a GraphQL schema as part of [EIP 1767](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1767.md).

To support GoQuorum private transaction data, a supplement schema and implementation has been added on top of the default.

### New supplement schema for GoQuorum

```go
# Transaction is an Ethereum transaction.
type Transaction {
    ...
    # IsPrivate is an indicator of Quorum private transaction
    isPrivate: Boolean
    # PrivateInputData is the actual payload of Quorum private transaction
    privateInputData: Bytes
}
```

```bash title="Example"
curl http://localhost:8547/graphql \
-X POST -H "Content-Type: application/json" \
-d '{ "query": "{ transaction(hash:\"0x58462fa0b6074a8feb5d9b8cd0e6bb7ef4d1528471396070d9ae617c5dee40a8\") { isPrivate inputData privateInputData } }" }' {"data":{"transaction":{"isPrivate":true,"inputData":"0xe9394a3620f2ef52a2001b08a79363dd467de866ab825877234ee66af5cac620877fdb88633114dd63c3c7a8048fc623e25eaa5914f5dc8004738dc0a52b62a3","privateInputData":"0x608060405234801561001057600080fd5b506040516020806101a18339810180604052602081101561003057600080fd5b81019080805190602001909291905050508060008190555050610149806100586000396000f3fe608060405234801561001057600080fd5b506004361061005e576000357c0100000000000000000000000000000000000000000000000000000000900480632a1afcd91461006357806360fe47b1146100815780636d4ce63c146100af575b600080fd5b61006b6100cd565b6040518082815260200191505060405180910390f35b6100ad6004803603602081101561009757600080fd5b81019080803590602001909291905050506100d3565b005b6100b7610114565b6040518082815260200191505060405180910390f35b60005481565b806000819055507fefe5cb8d23d632b5d2cdd9f0a151c4b1a84ccb7afa1c57331009aa922d5e4f36816040518082815260200191505060405180910390a150565b6000805490509056fea165627a7a7230582061f6956b053dbf99873b363ab3ba7bca70853ba5efbaff898cd840d71c54fc1d0029000000000000000000000000000000000000000000000000000000000000002a"}}}
```
