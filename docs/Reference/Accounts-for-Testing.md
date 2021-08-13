---
description: Ethereum accounts used for Hyperledger Besu testing only on private networks
---

# Accounts for testing

You can use existing accounts for testing by including them in the genesis file for a private
network.

The genesis files in the [IBFT network tutorial](../Tutorials/Private-Network/Create-IBFT-Network.md) and
[Raft network tutorial](../Tutorials/Private-Network/Create-a-Raft-network.md) define the following accounts used for testing.

{!global/test_accounts.md!}

## Genesis file

To use existing test accounts, specify the accounts and balances in a genesis file for your test
network, as in [this example](genesis.md).
