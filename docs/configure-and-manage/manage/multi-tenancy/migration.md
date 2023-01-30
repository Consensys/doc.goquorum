---
title: Multiple private states migration
description: Enabling multiple private states migration (MPS)
sidebar_position: 2
---

# Multiple private states migration

If running GoQuorum version `21.4.1` or earlier or Tessera version `21.1.1` or earlier, you can upgrade your existing nodes to enable [multiple private states (MPS)](../../../concepts/multi-tenancy.md#multiple-private-states) to run as multi-tenant or single-tenant nodes.

If you upgrade GoQuorum without upgrading Tessera, GoQuorum continues to operate in legacy mode on a single private state. In this case, GoQuorum can't be run in MPS mode since Tessera isn't upgraded.

## GoQuorum multi-tenant node upgrade

You can enable MPS for GoQuorum to run as a multi-tenant node by re-syncing the node after [upgrading Tessera](#tessera-multi-tenant-node-upgrade).

## GoQuorum single-tenant node upgrade (`mpsdbupgrade`)

You can enable MPS on a single-tenant GoQuorum node by executing the `mpsdbupgrade` command after [upgrading Tessera](#tessera-single-tenant-node-upgrade). It's faster than a normal sync from block 0 (especially if the network has reached a significant number of blocks).

The `mpsdbupgrade` command upgrades the existing database to an MPS-enabled database with a single private state (and sets `isMPS` to `true` in the configuration). Once the upgrade completes, you can introduce additional private states from the current block height.

You must specify the directory containing the GoQuorum node database using the [`--datadir`](https://geth.ethereum.org/docs/interface/command-line-options) command line option.

!!! important - The node must be offline during the upgrade process (we recommend backing up the node data directory before upgrading). - You can't use `mpsdbupgrade` to combine multiple GoQuorum databases/private states into a single GoQuorum database.

!!! example "`mpsdbupgrade` command"

    === "Syntax"

        ```bash
        geth mpsdbupgrade --datadir <DATA-DIRECTORY>
        ```

    === "Example"

        ```bash
        geth mpsdbupgrade --datadir data
        ```

    === "Example result"

        ```bash
        Processing block 1 with hash 0xf668e8b8320040a0cabd1b6ec963a79a08536409d82b9ccaa31f62b0a1a4dc10
        ...
        Processing block 1232739 with hash 0x2423b5d0f4c2883172f657f08d7d359b81f144b8cb8393ee24ef285058d55ce8
        MPS DB upgrade finished successfully.
        ```

After execution, the node database contains the `empty` state and the `private` state (corresponding to the single private state that existed before the upgrade).

## Tessera multi-tenant node upgrade

You can enable MPS for Tessera to run as a multi-tenant node by rebuilding from the privacy managers of the single-tenant nodes your Tessera node now supports.

You must [merge all transactions from the privacy managers into the new Tessera storage](https://docs.tessera.consensys.net/en/stable/HowTo/Migrate/Migration-Multitenancy/).

Update your Tessera [`residentGroups`](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/Multiple-private-state/#resident-groups) configuration so that each tenant has its own private state. This provides a user experience similar to the tenants running separate nodes.

After upgrading Tessera, [re-sync your GoQuorum node](#goquorum-multi-tenant-node-upgrade).

## Tessera single-tenant node upgrade

You can enable MPS for Tessera but continue running as a single-tenant node.

Upgrade the Tessera version to `21.4.0` or later and configure [`residentGroups`](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/Multiple-private-state/#resident-groups) to define a single resident group named "private" containing all the tenant's Tessera keys.

You can [upgrade your GoQuorum node to support MPS as a single-tenant node](#goquorum-single-tenant-node-upgrade-mpsdbupgrade).
