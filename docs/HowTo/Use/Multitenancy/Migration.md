# Multi-tenancy migration

To [use multi-tenancy](Multitenancy.md), upgrade your existing [GoQuorum](#goquorum) and [Tessera](#tessera) nodes to
have [multiple private states (MPS)](../../../Concepts/Multitenancy.md#multiple-private-states) functionality.

## GoQuorum

MPS introduces improvements to how GoQuorum handles the private state, so upgrading requires re-syncing a node (except
for specific cases where the `mpsdbupgrade` command can be used) after Tessera is upgraded.

### Backwards compatibility

In the event that a user wants to upgrade the version of GoQuorum without upgrading Tessera, GoQuorum continues to
operate in "legacy" mode on a single private state.
In this case, GoQuorum can't be run in MPS mode since Tessera has not been upgraded.

### Standalone node DB upgrade (mpsdbupgrade)

MPS can be enabled on a standalone node by executing the `mpsdbupgrade` command.
It should be significantly faster than a normal sync from block 0 (especially if the network has reached a significant
number of blocks).
The effect of the `mpsdbupgrade` command is to restructure/upgrade the existing database to present itself as an
MPS-enabled database with a single private state (and to set the chain `config.isMPS` to `true`).
Once the upgrade completes additional private states can be introduced but only from the current block height (you can't
introduce private states at historic block heights).

#### mpsdbupgrade command

In order to use the `mpsdbupgrade` command one must consider the following constraints:

- The node must be offline for the upgrade process to be executed (it is advisable to make a backup of the node data directory before executing the upgrade)
- The mpsdbupgrade command CAN NOT be used to combine multiple quorum databases/private states into a single quorum database
- Tessera must be upgraded to enable MPS and a single resident group named "private" must be defined (with all the existing locally managed tessera keys)
- After successful execution the node database contains the `empty` state and the `private` state (corresponding to the single private state that existed before the upgrade)

Command parameters:

- `--datadir` - the directory containing the GoQuorum node database

Example:

```shell
$ geth mpsdbupgrade --datadir data
Processing block 1 with hash 0xf668e8b8320040a0cabd1b6ec963a79a08536409d82b9ccaa31f62b0a1a4dc10
...
Processing block 1232739 with hash 0x2423b5d0f4c2883172f657f08d7d359b81f144b8cb8393ee24ef285058d55ce8
MPS DB upgrade finished successfully.

```

## Tessera

Tenants own one or more privacy manager key pairs.
Public keys are used to address private transactions.
Please refer to [Tessera keys configuration documentation](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/Keys/)
for more information about how Tessera manages multiple key pairs.

### MPS node upgrade

Tessera will need to be rebuilt from the privacy managers of the standalone nodes it will now support.
All transactions from the privacy managers will need to be merged into the new Tessera storage.
Learn more about [how to merge Tesseras](https://docs.tessera.consensys.net/en/stable/HowTo/Migrate/Migration-Multitenancy/).

The Tessera configuration file needs to be updated to contain the relevant `residentGroups`.
The `residentGroups` should be configured so that each Tenant has their own private state.
This will provide an equivalent experience to when the tenants were running their separate nodes.

### Standalone node upgrade

It may be the case that a tenant of a node wants to upgrade their node to support MPS but continue running as the only tenant.

In this case, the Tenant's Tessera version will need to be upgraded and `residentGroups` must be configured. In the case of a single tenant, the `residentGroups` should be configured so that there is one private state that contains all of the Tenant's Tessera keys.
