---
title: Accounts for testing
description: Ethereum accounts used for Consensys GoQuorum testing only on private networks
sidebar_position: 6
---

import TestAccounts from '../global/\_test_accounts.md';

# Accounts for testing

You can use existing accounts for testing by including them in the genesis file for a private network.

The genesis files in the [IBFT network tutorial](../tutorials/private-network/create-ibft-network.md) and [Raft network tutorial](../tutorials/private-network/create-a-raft-network.md) define the following accounts used for testing.

<TestAccounts />

## Genesis file

To use existing test accounts, specify the accounts and balances in a genesis file for your test network, as in [this example](genesis.md).
