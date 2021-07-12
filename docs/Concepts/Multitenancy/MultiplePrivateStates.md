# Multiple Private States

Multiple Private States is a feature that allows a GoQuorum node to manage more than one private state. The private states are separated logically in the shared database. This functionality lays the foundation for [supporting multiple tenants on a single node].

## Key Changes

### PSI

A private state is identified by a sequence of bytes, referred to as the PSI (Private State Identifier). The PSI is used to determine the specific private state a user can operate on.

### Trie of Private States

A Trie of Private States is introduced into GoQuorum to keep track of all private states managed by a node. The PSI is the key in the Trie of Private States that maps to the root hash of the corresponding private state. At each block, all affected private states are updated and their new root hashes calculated, the Trie of Private States is updated with the new private state root hashes at their PSIs, and a new root of the Trie of Private States is calculated and mapped to the public block hash.

### Private State Manager

The purpose of the Private State Manager in GoQuorum is to resolve the PSI based on input parameters.

#### Applying the Transaction

When executing a private transaction, it may be the case that the transaction is addressed to multiple locally managed parties and as a result it may be necessary to apply the transaction to multiple private states. The Private State Manager resolves each managed party tessera public key to one private state identifier.

#### User invokes an RPC API

Any RPC API call must be accompanied by a private state identifier or authorization token. From the token, the Private State Manager must be able to derive the private state the user is attempting to access.

### Tessera Resident Groups

MPS uses the concept of [Tessera Resident Groups] to map tenants to private states.
During Tessera startup, `residentGroups` are validated to check each tessera key is part of a single resident group. Every Tessera key must be in a resident group for Tessera to start.
During Quorum startup, the `residentGroups` are [retrieved from Tessera] and kept in memory in GoQuorum.

``` json
"residentGroups": [
 {
   "name": "PS1",
   "members": ["publicKey1", "publicKey2"],
   "description": "Private state 1"
 },
 {
   "name": "PS2",
   "members": ["publicKey3", "publicKey4"],
   "description": "Private State 2"
 }
]
```

The above `residentGroups` defines 2 resident groups (each with 2 members) that map to 2 GoQuorum private states.

``` text
name - the PSI used to identify the private state the group has access to
members - the public keys that have access to the private state
```

Learn how to [setup residentGroups in Tessera].

## Configuration Changes

### GoQuorum

The `genesis.json` file has been modified to include `isMPS`.  This value should be set to `true` to enable MPS and `false` to operate as a standalone node. There can be a mix of MPS enabled nodes and standalone nodes in a network.

### Tessera

A new flag `enableMultiplePrivateStates` has been added to Tessera config defaulting to `false`, and can be enabled by adding the property to the config file the same way as other features. Quorum will not start if `isMPS=true` and `enableMultiplePrivateStates=false`.

In addition, a new field `residentGroups` can be added to the Tessera config to define group access to specific private states. If `enableMultiplePrivateStates=true`, `residentGroups` must be properly configured in order for Tessera to start. View how to [setup residentGroups in Tessera] for further information. If the node is running as a standalone node (`isMPS=false`), configuration of `residentGroups` is not necessary.

## Upgrading a Node to MPS

If a user would like to upgrade an existing GoQuorum node to an node with MPS functionality, there are additional steps to follow to make sure the database is compatible with MPS.  View the [steps for migration].

## Enable Multiple Private States

MPS requires [Tessera] version `21.4.0` or later.

For any given node the privacy manager (Tessera) is started first and for that reason we allow the Tessera node to be upgraded with MPS support ahead of the GoQuorum upgrade. But when the GoQuorum node is upgraded and geth is reinitialized with `isMPS=true`, the GoQuorum node will validate the version of Tessera running and will fail to start if Tessera is not running an upgraded version. The GoQuorum node reports an appropriate error message in the console suggesting users to upgrade Tessera first.

If a node wants to upgrade it's Tessera to the MPS release (or further) to have other features and fixes but is not ready to upgrade GoQuorum, it can do so by running GoQuorum as usual. GoQuorum will continue to function as a standalone node.

If both Tessera and GoQuorum are upgraded but not configured to run MPS, the node will continue to function as a standalone node.

## Tessera Q2T Communication Changes

MPS introduces a new QT2 endpoint `/groups/resident` to return the resident groups defined in Tessera.
This endpoint is invoked at GoQuorum startup to retrieve all resident groups. These details are kept in memory in GoQuorum, so the [Private State Manager] is able to resolve these resident groups to the corresponding private state.

## Accessing a Private State

Users will need to specify the private state they wish to operate on. For backwards compatibility, if a user connects without specifying the private state, the default "private" identifier will be used. If a "private" state is not configured, the user will be operating on an empty read only private state.

In order to specify a private state to operate on the user has 3 options:

### Precedence

1. privacyGroupID in specific API calls (to be implemented)
2. HTTP Header
3. URL Parameter

### URL Parameter

PSI query param can be added to the API URI:

```shell
geth attach http://localhost:22000/?PSI=PS1
```

### HTTP Header

Every RPC request must have an HTTP Header "PSI" attached that specifies the private state to use

### IPC and inproc connections

Prepend the PSI to the ID field of the jsonrpcMessage

## Migration Guides

### GoQuorum

MPS introduces improvements to how GoQuorum handles the private state, so upgrading requires re-syncing a node (except for specific cases where the `mpsdbupgrade` command can be used) after Tessera is upgraded.

#### Backwards Compatibility

In the event that a user wants to upgrade the version of GoQuorum without upgrading Tessera, GoQuorum will continue to operate in "legacy" mode on a single private state. In this case, GoQuorum cannot be run in MPS mode since Tessera has not been upgraded.

#### Standalone Node DB Upgrade (mpsdbupgrade)

MPS can be enabled on a standalone node by executing the `mpsdbupgrade` command. It should be significantly faster than a normal sync from block 0 (especially if the network has reached a significant number of blocks).
The effect of the `mpsdbupgrade` command is to restructure/upgrade the existing database to present itself as an MPS enabled database with a single private state.
Once the upgrade completes additional private states can be introduced but only from the current block height (you can't introduce private states at historic block heights).

##### mpsdbupgrade command

In order to use the `mpsdbupgrade` command one must consider the following constraints:

- The node must be offline for the upgrade process to be executed (it is advisable to make a backup of the node data directory before executing the upgrade)
- The mpsdbupgrade command CAN NOT be used to combine multiple quorum databases/private states into a single quourm database
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

### Tessera

Tenants own one or more Privacy Manager key pairs. Public keys are used to address private transactions.
Please refer to [Tessera keys configuration documentation](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/Keys/)
for more information about how Tessera manages multiple key pairs.

#### MPS node upgrade

Tessera will need to be rebuilt from the privacy managers of the standalone nodes it will now support. All transactions from the privacy managers will need to be merged into the new Tessera storage. Learn more about [how to merge Tesseras].

The Tessera configuration file needs to be updated to contain the relevant `residentGroups`. The `residentGroups` should be configured so that each Tenant has their own private state. This will provide an equivalent experience to when the tenants were running their separate nodes.

#### Standalone node upgrade

It may be the case that a tenant of a node wants to upgrade their node to support MPS but continue running as the only tenant.

In this case, the Tenant's Tessera version will need to be upgraded and `residentGroups` must be configured. In the case of a single tenant, the `residentGroups` should be configured so that there is one private state that contains all of the Tenant's Tessera keys.

## MPS APIs

### eth_getPSI

Returns the private state the user is operating on.

<!--links-->
[supporting multiple tenants on a single node]: Overview.md
[setup residentGroups in Tessera]: ../../HowTo/Use/Multitenancy.md#tessera-setup
[steps for migration]: #migration-guides
[retrieved from Tessera]: #tessera-q2t-communication-changes
[Tessera]: https://docs.tessera.consensys.net
[Private State Manager]: #private-state-manager
[Tessera Resident Groups]: https://docs.tessera.consensys.net/en/stable/Concepts/Privacy-Groups/
[how to merge Tesseras]: https://docs.tessera.consensys.net/en/stable/HowTo/Migrate/Migration-Multitenancy/
