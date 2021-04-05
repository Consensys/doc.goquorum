---
description: GoQuorum command line interface reference
---

# GoQuorum command line options

This reference describes the syntax of the GoQuorum Command Line Interface (CLI) options.

!!! important

    Only the GoQuorum CLI options are listed here. Visit the
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
    --allowedfutureblocktime 2
    ```

Maximum time from current time, in seconds, allowed for blocks before they're considered future blocks.
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
Setting the block period determines how quickly blocks should be minted by the validators.
It is used for validation of block times by all nodes, so should not be changed after deciding a value for the network.

The default is 1.

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

If included, [multi-tenancy](../Concepts/Multitenancy/Overview.md) is enabled.
This requires the [JSON RPC Security plugin](../HowTo/Use/JSON-RPC-API-Security.md) to also be configured.

### `permissioned`

=== "Syntax"

    ```bash
    --permissioned
    ```

=== "Command Line"

    ```bash
    --permissioned
    ```

If included, [basic network permissioning](../Concepts/Permissioning/BasicNetworkPermissions.md) is enabled.
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

If included, [plugin integrity](../Concepts/Plugins/Plugins.md#plugin-integrity-verification) is verified from the
local file system.
This requires a plugin signature file and PGP public key file to be available.

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
This flag is only valid if [`--plugins.localverify`](#pluginslocalverify) is set.

### `plugins.skipverify`

=== "Syntax"

    ```bash
    --plugins.skipverify
    ```

=== "Command Line"

    ```bash
    --plugins.skipverify
    ```

If included, the [plugin verification](../Concepts/Plugins/Plugins.md#plugin-integrity-verification) process is disabled.

### `raft`

=== "Syntax"

    ```bash
    --raft
    ```

=== "Command Line"

    ```bash
    --raft
    ```

If included, [Raft](../Concepts/Consensus/Raft.md) is used for consensus.

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

If included, [DNS resolution of peers](../HowTo/Configure/dns.md) is enabled.

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

### `raftport`

=== "Syntax"

    ```bash
    --raftport <PORT>
    ```

=== "Command Line"

    ```bash
    --raftport 50500
    ```

The port to bind for the [Raft transport](../HowTo/Configure/Consensus/Configuring-Raft.md#raft-transport-layer).
The default is 50400.
