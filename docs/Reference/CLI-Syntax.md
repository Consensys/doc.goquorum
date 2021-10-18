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

=== "Example"

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

=== "Example"

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

=== "Example"

    ```bash
    --istanbul.blockperiod 5
    ```

Minimum time between two consecutive [IBFT](../HowTo/Configure/Consensus-Protocols/IBFT.md) or
[QBFT](../HowTo/Configure/Consensus-Protocols/QBFT.md) blocks' timestamps in seconds.
Setting the block period determines how quickly blocks should be minted by the validators. The default is 1.

!!! warning

    Do not update this value after starting the network because this option is used by nodes to validate block times.

### `istanbul.requesttimeout`

=== "Syntax"

    ```bash
    --istanbul.requesttimeout <INTEGER>
    ```

=== "Example"

    ```bash
    --istanbul.requesttimeout 12000
    ```

Minimum request timeout for each [IBFT](../HowTo/Configure/Consensus-Protocols/IBFT.md) or
[QBFT](../HowTo/Configure/Consensus-Protocols/QBFT.md) round in milliseconds.
The request timeout is the timeout at which IBFT triggers a new round if the previous one did not complete.
This period increases as the timeout is hit more often.

The default is 10000.

### `multitenancy`

=== "Syntax"

    ```bash
    --multitenancy
    ```

=== "Example"

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

=== "Example"

    ```bash
    --permissioned
    ```

Enables [basic network permissioning](../Concepts/PermissionsOverview.md#basic-network-permissioning).
The node allows only a defined list of nodes to connect.

### `plugins`

=== "Syntax"

    ```bash
    --plugins file:///<path>/<to>/plugins.json
    ```

=== "Example"

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

If included, verifies [plugin integrity](../Concepts/Plugins/Plugins.md#plugin-integrity-verification) from the
local file system.
This requires a plugin signature file and [PGP public key file](#pluginspublickey) to be available.

### `plugins.publickey`

=== "Syntax"

    ```bash
    --plugins.publickey file:///<path>/<to>/<publicKeyFile>
    ```

=== "Example"

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

If included, disables the [plugin verification](../Concepts/Plugins/Plugins.md#plugin-integrity-verification) process.

### `privacymarker.enable`

=== "Syntax"

    ```bash
    --privacymarker.enable
    ```

If included, GoQuorum creates a [privacy marker transaction](../Concepts/Privacy/PrivacyMarkerTransactions.md) when a
private transaction is submitted.

### `ptm.dialtimeout`

=== "Syntax"

    ```bash
    --ptm.dialtimeout <INTEGER>
    ```

=== "Example"

    ```bash
    ---ptm.dialtimeout 0
    ```

Dial timeout in seconds for the [private transaction manager connection](../HowTo/Configure/ConfigurePTM.md).
Setting to 0 disables the timeout.
The default is 1 second.

### `ptm.http.idletimeout`

=== "Syntax"

    ```bash
    --ptm.http.idletimeout <INTEGER>
    ```

=== "Example"

    ```bash
    ---ptm.http.idletimeout 0
    ```

Idle timeout in seconds for the [private transaction manager connection](../HowTo/Configure/ConfigurePTM.md).
Setting to 0 disables the timeout.
The default is 10 seconds.

### `ptm.http.readbuffersize`

=== "Syntax"

    ```bash
    --ptm.http.readbuffersize <INTEGER>
    ```

=== "Example"

    ```bash
    ---ptm.http.readbuffersize 0
    ```

Size of the read buffer in bytes for the [private transaction manager connection](../HowTo/Configure/ConfigurePTM.md).
Setting to 0 or not specifying uses the `http.Transport` default.

### `ptm.http.writebuffersize`

=== "Syntax"

    ```bash
    --ptm.http.writebuffersize <INTEGER>
    ```

=== "Example"

    ```bash
    ---ptm.http.writebuffersize 0
    ```

Size of the write buffer in bytes for the [private transaction manager connection](../HowTo/Configure/ConfigurePTM.md).
Setting to 0 or not specifying uses the `http.Transport` default.

### `ptm.socket`

=== "Syntax"

    ```bash
    --ptm.socket <path>/<to>/<ipc>/<file>
    ```

=== "Example"

    ```bash
    ---ptm.socket qdata/c1/tm.ipc
    ```

Path to the IPC file when using a Unix domain socket for the [private transaction manager connection](../HowTo/Configure/ConfigurePTM.md).

### `ptm.timeout`

=== "Syntax"

    ```bash
    --ptm.timeout <INTEGER>
    ```

=== "Example"

    ```bash
    ---ptm.timeout 0
    ```

Timeout in seconds for communication over the [private transaction manager connection](../HowTo/Configure/ConfigurePTM.md).
Setting to 0 disables the timeout.
The default is 5 seconds.

### `ptm.tls.clientcert`

=== "Syntax"

    ```bash
    --ptm.tls.clientcert <path>/<to>/<client_cert_pem_file>
    ```

=== "Example"

    ```bash
    ---ptm.tls.clientcert client.cert.pem
    ```

Path to the file containing client certificate (or chain of certificates) when using a TLS
[connection to the private transaction manager](../HowTo/Configure/ConfigurePTM.md).
This is required if the server is configured to use two-way authentication.

### `ptm.tls.clientkey`

=== "Syntax"

    ```bash
    --ptm.tls.clientkey <path>/<to>/<client_key_pem_file>
    ```

=== "Example"

    ```bash
    ---ptm.tls.clientkey client.key.pem
    ```

Path to the file containing the client's private key when using a TLS
[connection to private transaction manager](../HowTo/Configure/ConfigurePTM.md).
This is required if the server is configured to use two-way authentication.

### `ptm.tls.insecureskipverify`

=== "Syntax"

    ```bash
    --ptm.tls.insecureskipverify
    ```

If included, disables verification of the server's TLS certificate on
[connection to private transaction manager](../HowTo/Configure/ConfigurePTM.md).

### `ptm.tls.mode`

=== "Syntax"

    ```bash
    --ptm.tls.mode <STRING>
    ```

=== "Example"

    ```bash
    ---ptm.tls.mode "strict"
    ```

Setting to `off` disables TLS.
Setting to `strict` enables TLS when using an HTTPS [connection to the private transaction manager](../HowTo/Configure/ConfigurePTM.md).

### `ptm.tls.rootca`

=== "Syntax"

    ```bash
    --ptm.tls.rootca <path>/<to>/<rootca_pem_file>
    ```

=== "Example"

    ```bash
    ---ptm.tls.rootca certfile.pem
    ```

Path to the file containing root CA certificate when using a TLS [connection to the private transaction manager](../HowTo/Configure/ConfigurePTM.md).
The default is the host's certificates.

### `ptm.url`

=== "Syntax"

    ```bash
    --ptm.url <URL>
    ```

=== "Example"

    ```bash
    ---ptm.url "https://127.0.0.1:9101"
    ```

URL when using an HTTP/HTTPS [connection to the private transaction manager](../HowTo/Configure/ConfigurePTM.md).

### `raft`

=== "Syntax"

    ```bash
    --raft
    ```

=== "Example"

    ```bash
    --raft
    ```

Enables [Raft](../HowTo/Configure/Consensus-Protocols/Raft.md) for consensus.

### `raftblocktime`

=== "Syntax"

    ```bash
    --raftblocktime <INTEGER>
    ```

=== "Example"

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

=== "Example"

    ```bash
    --raftdnsenable
    ```

Enables [DNS resolution of peers](../HowTo/Configure/dns.md).

### `raftjoinexisting`

=== "Syntax"

    ```bash
    --raftjoinexisting <INTEGER>
    ```

=== "Example"

    ```bash
    --raftjoinexisting 1
    ```

Raft ID to assume when
[joining a pre-existing cluster](../HowTo/Configure/Consensus-Protocols/Raft.md#adding-raft-members).
The default is 0.

### `raftlogdir`

=== "Syntax"

    ```bash
    --raftlogdir <DIRECTORY>
    ```

=== "Example"

    ```bash
    --raftlogdir raftlogdir
    ```

Raft log directory used for the `quorum-raft-state`, `raft-snap`, and `raft-wal` folders.
Defaults to the [`datadir` option](https://geth.ethereum.org/docs/interface/command-line-options).

### `raftport`

=== "Syntax"

    ```bash
    --raftport <PORT>
    ```

=== "Example"

    ```bash
    --raftport 50500
    ```

Port to bind for the [Raft transport](../HowTo/Configure/Consensus-Protocols/Raft.md#raft-transport-layer).
The default is 50400.

### `revertreason`

=== "Syntax"

    ```bash
    --revertreason
    ```

=== "Example"

    ```bash
    --revertreason
    ```

Enables including the [revert reason](../HowTo/Use/Revert-Reason.md) in the
[`eth_getTransactionReceipt`](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt) response.
