# Multi-tenancy migration

To [use multi-tenancy](Multitenancy.md), upgrade your existing [GoQuorum](#goquorum) and [Tessera](#tessera) nodes to
have [multiple private states (MPS)](../../../Concepts/Multitenancy.md#multiple-private-states) functionality.

## GoQuorum

### Multi-tenant node upgrade

To enable MPS functionality on GoQuorum, re-sync the node after [upgrading Tessera](#tessera).

### Single-tenant node upgrade

You can enable MPS on a single-tenant node by executing the `mpsdbupgrade` command.
It's faster than a normal sync from block 0 (especially if the network has reached a significant number of blocks).

- Tessera must be upgraded to enable MPS and a single resident group named "private" must be defined (with all the
  existing locally managed Tessera keys).

The `mpsdbupgrade` command upgrades the existing database to an MPS-enabled database with a single private state (and
sets `isMPS` to `true` in the configuration).
Once the upgrade completes, you can introduce additional private states from the current block height (you can't
introduce private states at historic block heights).

In order to use the `mpsdbupgrade` command one must consider the following constraints:

- The node must be offline for the upgrade process to be executed (we recommend backing up the node data directory
  before executing the upgrade).
- The `mpsdbupgrade` command can't be used to combine multiple GoQuorum databases/private states into a single GoQuorum database.
- After successful execution, the node database contains the `empty` state and the `private` state (corresponding to the
  single private state that existed before the upgrade).

You must specify the directory containing the GoQuorum node database using the
[`--datadir`](https://geth.ethereum.org/docs/interface/command-line-options) command line option.

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

### Backwards compatibility

If you upgrade GoQuorum without upgrading Tessera, GoQuorum continues to operate in "legacy" mode on a single private state.
In this case, GoQuorum can't be run in MPS mode since Tessera isn't upgraded.

## Tessera

### Multi-tenant node upgrade

Tessera must be rebuilt from the privacy managers of the single-tenant nodes it now supports.
All transactions from the privacy managers must be
[merged into the new Tessera storage](https://docs.tessera.consensys.net/en/stable/HowTo/Migrate/Migration-Multitenancy/).

The Tessera configuration file must be updated to contain the relevant [`residentGroups`](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/Multiple-private-state/#resident-groups).
Configure the `residentGroups` so that each tenant has its own private state.
This provides a user experience similar to the tenants running their separate nodes.

### Single-tenant node upgrade

A tenant of a node may want to upgrade its Tessera node to support MPS but continue running as the only tenant.

In this case, the tenant's Tessera version must be upgraded and [`residentGroups`](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/Multiple-private-state/#resident-groups) must be configured.
Configure the `residentGroups` so that there is one private state containing all the tenant's Tessera keys.
