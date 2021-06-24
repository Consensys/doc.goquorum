---
description: GoQuorum command line interface reference
---

# GoQuorum command line options

This reference describes the syntax of the GoQuorum Command Line Interface (CLI) options.

!!! important

    GoQuorum is based on [Geth Go Ethereum client](https://geth.ethereum.org/) but only the GoQuorum specific CLI options are listed here. Visit the
    [Go Ethereum documentation](https://geth.ethereum.org/docs/interface/command-line-options) to view the CLI
    options for the `geth` command.

## Options

### `allowedfutureblocktime`

=== "Syntax"

    ```bash
    --allowedfutureblocktime <INTEGER>
    ```

=== "Command Line"

    ```bash
    --allowedfutureblocktime 1
    ```

Maximum time from current time allowed for blocks before they're considered future blocks, in seconds.
This allows nodes to be slightly out of sync without receiving "Mining too far in the future" messages.
The default is 0.

### `immutabilitythreshold`

=== "Syntax"

    ```bash
    --immutabilitythreshold <INTEGER>
    ```

=== "Command Line"

    ```bash
    --immutabilitythreshold 1000000
    ```

Overrides the default immutability threshold for GoQuorum nodes.
Blocks below the immutability threshold are moved to the `ancient` data folder.
The default is 3162240.

### `istanbul.blockperiod`

=== "Syntax"

    ```bash
    --istanbul.blockperiod <INTEGER>
    ```

=== "Command Line"

    ```bash
    --istanbul.blockperiod 5
    ```

Minimum time between two consecutive [IBFT](../Concepts/Consensus/IBFT.md) blocks' timestamps in seconds.
Setting the block period determines how quickly blocks should be minted by the validators. The default is 1.

!!! warning

    Do not update this value after starting the network because this option is used by nodes to validate block times.

### `istanbul.requesttimeout`

=== "Syntax"

    ```bash
    --istanbul.requesttimeout <INTEGER>
    ```

=== "Command Line"

    ```bash
    --istanbul.requesttimeout 12000
    ```

Minimum request timeout for each [IBFT](../Concepts/Consensus/IBFT.md) round in milliseconds.
The request timeout is the timeout at which IBFT triggers a new round if the previous one did not complete.
This period increases as the timeout is hit more often.

The default is 10000.

### `multitenancy`

=== "Syntax"

    ```bash
    --multitenancy
    ```

=== "Command Line"

    ```bash
    --multitenancy
    ```

Enables [multi-tenancy](../Concepts/Multitenancy/Overview.md).
This requires the [JSON-RPC Security plugin](../HowTo/Use/JSON-RPC-API-Security.md) to also be configured.

### `permissioned`

=== "Syntax"

    ```bash
    --permissioned
    ```

=== "Command Line"

    ```bash
    --permissioned
    ```

Enables [basic network permissioning](../Concepts/Permissioning/BasicNetworkPermissions.md).
The node allows only a defined list of nodes to connect.

### `plugins`

=== "Syntax"

    ```bash
    --plugins file:///<path>/<to>/plugins.json
    ```

=== "Command Line"

    ```bash
    --plugins file:///opt/geth/plugins.json
    ```

URI of the [plugins settings JSON file](../HowTo/Configure/Plugins.md).
Use this to configure [plugins](../Concepts/Plugins/Plugins.md).

### `plugins.localverify`

=== "Syntax"

    ```bash
    --plugins.localverify
    ```

=== "Command Line"

    ```bash
    --plugins.localverify
    ```

Verifies [plugin integrity](../Concepts/Plugins/Plugins.md#plugin-integrity-verification) from the
local file system.
This requires a plugin signature file and [PGP public key file](#pluginspublickey) to be available.

### `plugins.publickey`

=== "Syntax"

    ```bash
    --plugins.publickey file:///<path>/<to>/<publicKeyFile>
    ```

=== "Command Line"

    ```bash
    --plugins.publickey file:///opt/geth/pubkey.pgp.asc
    ```

URI of the PGP public key for local
[plugin verification](../Concepts/Plugins/Plugins.md#plugin-integrity-verification).
This option is only valid if [`--plugins.localverify`](#pluginslocalverify) is set.

### `plugins.skipverify`

=== "Syntax"

    ```bash
    --plugins.skipverify
    ```

=== "Command Line"

    ```bash
    --plugins.skipverify
    ```

Disables the [plugin verification](../Concepts/Plugins/Plugins.md#plugin-integrity-verification) process.

### `raft`

=== "Syntax"

    ```bash
    --raft
    ```

=== "Command Line"

    ```bash
    --raft
    ```

Enables [Raft](../Concepts/Consensus/Raft.md) for consensus.

### `raftblocktime`

=== "Syntax"

    ```bash
    --raftblocktime <INTEGER>
    ```

=== "Command Line"

    ```bash
    --raftblocktime 100
    ```

Time between Raft block creations in milliseconds.
The default is 50.

### `raftdnsenable`

=== "Syntax"

    ```bash
    --raftdnsenable
    ```

=== "Command Line"

    ```bash
    --raftdnsenable
    ```

Enables [DNS resolution of peers](../HowTo/Configure/dns.md).

### `raftjoinexisting`

=== "Syntax"

    ```bash
    --raftjoinexisting <INTEGER>
    ```

=== "Command Line"

    ```bash
    --raftjoinexisting 1
    ```

Raft ID to assume when
[joining a pre-existing cluster](../HowTo/Configure/Consensus/Configuring-Raft.md#adding-raft-members).
The default is 0.

### `raftlogdir`

=== "Syntax"

    ```bash
    --raftlogdir <DIRECTORY>
    ```

=== "Command Line"

    ```bash
    --raftlogdir raftlogdir
    ```

Raft log directory used for the `quorum-raft-state`, `raft-snap` and `raft-wal` folders.
Defaults to the [`datadir` option](https://geth.ethereum.org/docs/interface/command-line-options).

### `raftport`

=== "Syntax"

    ```bash
    --raftport <PORT>
    ```

=== "Command Line"

    ```bash
    --raftport 50500
    ```

Port to bind for the [Raft transport](../HowTo/Configure/Consensus/Configuring-Raft.md#raft-transport-layer).
The default is 50400.
