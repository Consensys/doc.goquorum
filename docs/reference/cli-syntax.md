---
description: GoQuorum command line interface reference
---

# GoQuorum command line options

This reference describes the syntax of the GoQuorum command line interface (CLI) options.

!!! important

    GoQuorum is based on the [Geth Go Ethereum client](https://geth.ethereum.org/) but only the GoQuorum-specific CLI
    options are listed here.
    Visit the [Go Ethereum documentation](https://geth.ethereum.org/docs/interface/command-line-options) to view the CLI
    options for the `geth` command.

## Specifying options

You can specify GoQuorum options:

* On the command line.

    ```bash
    geth [OPTIONS]
    ```

* In a [configuration file](../configure-and-manage/configure/use-configuration-file.md).

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

### `emitcheckpoints`

=== "Syntax"

    ```bash
    --emitcheckpoints
    ```

If included, emits specially formatted logging checkpoints.

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

Minimum time between two consecutive [IBFT](../configure-and-manage/configure/consensus-protocols/ibft.md) or
[QBFT](../configure-and-manage/configure/consensus-protocols/qbft.md) blocks' timestamps in seconds.
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

Minimum request timeout for each [IBFT](../configure-and-manage/configure/consensus-protocols/ibft.md) or
[QBFT](../configure-and-manage/configure/consensus-protocols/qbft.md) round in milliseconds.
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

Enables [multi-tenancy](../concepts/multi-tenancy.md).
This requires the [JSON-RPC Security plugin](../develop/json-rpc-apis.md) to also be configured.

### `override.istanbul`

=== "Syntax"

    ```bash
    --override.istanbul <INTEGER>
    ```

=== "Example"

    ```bash
    --override.istanbul 100
    ```

Custom fork block when using [IBFT](../configure-and-manage/configure/consensus-protocols/ibft.md) or
[QBFT](../configure-and-manage/configure/consensus-protocols/qbft.md) consensus.
The default is 0.

### `permissioned`

=== "Syntax"

    ```bash
    --permissioned
    ```

=== "Example"

    ```bash
    --permissioned
    ```

Enables [basic network permissioning](../concepts/permissions-overview.md#basic-network-permissioning).
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

URI of the [plugins settings JSON file](../develop/develop-plugins.md).
Use this to configure [plugins](../concepts/plugins.md).

### `plugins.localverify`

=== "Syntax"

    ```bash
    --plugins.localverify
    ```

If included, verifies [plugin integrity](../concepts/plugins.md#plugin-integrity-verification) from the
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
[plugin verification](../concepts/plugins.md#plugin-integrity-verification).
This option is only valid if [`--plugins.localverify`](#pluginslocalverify) is set.

### `plugins.skipverify`

=== "Syntax"

    ```bash
    --plugins.skipverify
    ```

If included, disables the [plugin verification](../concepts/plugins.md#plugin-integrity-verification) process.

### `privacymarker.enable`

=== "Syntax"

    ```bash
    --privacymarker.enable
    ```

If included, GoQuorum creates a [privacy marker transaction](../concepts/privacy/privacy-marker-transactions.md) when a
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

Dial timeout in seconds for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).
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

Idle timeout in seconds for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).
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

Size of the read buffer in bytes for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).
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

Size of the write buffer in bytes for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).
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

Path to the IPC file when using a Unix domain socket for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.timeout`

=== "Syntax"

    ```bash
    --ptm.timeout <INTEGER>
    ```

=== "Example"

    ```bash
    ---ptm.timeout 0
    ```

Timeout in seconds for communication over the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).
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

Path to the file containing the client certificate (or chain of certificates) when using a TLS
[connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).
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
[connection to private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).
This is required if the server is configured to use two-way authentication.

### `ptm.tls.insecureskipverify`

=== "Syntax"

    ```bash
    --ptm.tls.insecureskipverify
    ```

If included, disables verification of the server's TLS certificate on
[connection to private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

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
Setting to `strict` enables TLS when using an HTTPS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.tls.rootca`

=== "Syntax"

    ```bash
    --ptm.tls.rootca <path>/<to>/<rootca_pem_file>
    ```

=== "Example"

    ```bash
    ---ptm.tls.rootca certfile.pem
    ```

Path to the file containing the root CA certificate when using a TLS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).
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

URL when using an HTTP/HTTPS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `qlight.client`

=== "Syntax"

    ```bash
    --qlight.client
    ```

Enables the [qlight client](../configure-and-manage/configure/qlight-node.md) P2P protocol.

### `qlight.client.psi`

=== "Syntax"

    ```bash
    --qlight.client.psi <STRING>
    ```

=== "Example"

    ```bash
    --qlight.client.psi "private"
    ```

PSI the qlight client uses to connect to a server node. The default is `private`.

### `qlight.client.rpc.tls`

=== "Syntax"

    ```bash
    --qlight.client.rpc.tls
    ```

Enables the qlight client RPC connection to use TLS.

### `qlight.client.rpc.tls.cacert`

=== "Syntax"

    ```bash
    --qlight.client.rpc.tls.cacert <path>/<to>/<client-RPC certicate-auth-file>
    ```

=== "Example"

    ```bash
    --qlight.client.rpc.tls.cacert certfile.pem
    ```

Path to the qlight client RPC client certificate authority file.

### `qlight.client.rpc.tls.cert`

=== "Syntax"

    ```bash
    --qlight.client.rpc.tls.cert <path>/<to>/<client-RPC-client-certificate-file>
    ```

=== "Example"

    ```bash
    --qlight.client.rpc.tls.cert certfile.pem
    ```

Path to the qlight client RPC client certificate file.

### `qlight.client.rpc.tls.insecureskipverify`

=== "Syntax"

    ```bash
    --qlight.client.rpc.tls.insecureskipverify
    ```

Enables the qlight client RPC connection to skip TLS verification.

### `qlight.client.rpc.tls.key`

=== "Syntax"

    ```bash
    --qlight.client.rpc.tls.key <path>/<to>/<client_TLS_key_pem_file>
    ```

=== "Example"

    ```bash
    --qlight.client.rpc.tls.key client.TLS.key.pem
    ```

Path to the qlight client RPC client certificate private key.

### `qlight.client.serverNode`

=== "Syntax"

    ```bash
    --qlight.client.serverNode <nodeID>
    ```

=== "Example"

    ```bash
    --qlight.client.serverNode 0xc35c3...d615f
    ```

The node ID of the target server node.

### `qlight.client.serverNodeRPC`

=== "Syntax"

    ```bash
    --qlight.client.serverNodeRPC <URL>
    ```

=== "Example"

    ```bash
    --qlight.client.serverNodeRPC "http://127.0.0.1:8888"
    ```

The RPC URL of the target server node.

### `qlight.client.token.enabled`

=== "Syntax"

    ```bash
    --qlight.client.token.enabled
    ```

Enables the client to use a token when connecting to the qlight server.

### `qlight.client.token.management`

=== "Syntax"

    ```bash
    --qlight.client.token.management <string>
    ```

=== "Example"

    ```bash
    --qlight.client.token.management "none"
    ```

Mechanism used to refresh the token. Possible values:

* `none` - Developer mode. The token is not refreshed.
* `external` - You must update the refreshed token in the running qlight client process by invoking the `qlight.setCurrentToken` RPC API.
* `client-security-plugin` - You must deploy the client security plugin, which periodically refreshes the access token.

### `qlight.client.token.value`

=== "Syntax"

    ```bash
    --qlight.client.token.value <TOKEN>
    ```

=== "Example"

    ```bash
    --qlight.client.token.value "bearer AYjcyMzY3ZDhiNmJkNTY"
    ```

Token the qlight client uses to connect to a server node.

### `qlight.server`

=== "Syntax"

    ```bash
    --qlight.server
    ```

Enables the [qlight server](../configure-and-manage/configure/qlight-node.md) P2P protocol.

### `qlight.server.p2p.maxpeers`

=== "Syntax"

    ```bash
    --qlight.server.p2p.maxpeers <INTEGER>
    ```

=== "Example"

    ```bash
    --qlight.server.p2p.maxpeers 10
    ```

Maximum number of qlight peers. The default is 10.

### `qlight.server.p2p.netrestrict`

=== "Syntax"

    ```bash
    --qlight.server.p2p.netrestrict <NETWORK MASK>
    ```

=== "Example"

    ```bash
    --qlight.server.p2p.netrestrict "xyz"
    ```

Restricts network communication to the given IP networks (CIDR masks).

### `qlight.server.p2p.permissioning`

=== "Syntax"

    ```bash
    --qlight.server.p2p.permissioning
    ```

Enables the qlight peers to check against a permissioned list and a disallowed list.

### `qlight.server.p2p.permissioning.prefix`

=== "Syntax"

    ```bash
    --qlight.server.p2p.permissioning.prefix <prefix-filename>
    ```

=== "Example"

    ```bash
    --qlight.server.p2p.permissioning.prefix "permissioned-nodes.json"
    ```

Prefix for the `permissioned-nodes.json` and `disallowed-nodes.json` files.

### `qlight.server.p2p.port`

=== "Syntax"

    ```bash
    --qlight.server.p2p.port=<INTEGER>
    ```

=== "Example"

    ```bash
    --qlight.server.p2p.port=30305
    ```

Port the qlight network listens to. The default is 30305.

### `qlight.tls`

=== "Syntax"

    ```bash
    --qlight.tls
    ```

Enables the qlight client P2P protocol to use TLS.

### `qlight.tls.cacerts`

=== "Syntax"

    ```bash
    --qlight.tls.cacerts <path>/<to>/<qlight_tls_cacert_file>
    ```

=== "Example"

    ```bash
    --qlight.tls.cacerts certfile.pem
    ```

Path to the certificate authorities file to use for validating P2P connection.

### `qlight.tls.cert`

=== "Syntax"

    ```bash
    --qlight.tls.cert` <path>/<to>/<qlight_tls_cert_file>
    ```

=== "Example"

    ```bash
    --qlight.tls.cert certfile.pem
    ```

Path to the certificate file to use for the qlight P2P connection.

### `qlight.tls.ciphersuites`

=== "Syntax"

    ```bash
    --qlight.tls.ciphersuites <STRING>
    ```

=== "Example"

    ```bash
    --qlight.tls.ciphersuites "CIPHER_SUITE_1,CIPHER_SUITE_2"
    ```

Cipher suites to use for the qlight P2P connection.

### `qlight.tls.clientauth`

=== "Syntax"

    ```bash
    --qlight.tls.clientauth <INTEGER>
    ```

=== "Example"

    ```bash
    --qlight.tls.clientauth 0
    ```

Sets the method the client is authenticated. Possible values:

* 0=`NoClientCert` (default)
* 1=`RequestClientCert`
* 2=`RequireAnyClientCert`
* 3=`VerifyClientCertIfGiven`
* 4=`RequireAndVerifyClientCert`

### `qlight.tls.key`

=== "Syntax"

    ```bash
    --qlight.tls.key <path>/<to>/<qlight_tls_key_file>
    ```

=== "Example"

    ```bash
    --qlight.tls.key certfile.pem
    ```

Path to the key file to use for qlight P2P connection.

### `raft`

=== "Syntax"

    ```bash
    --raft
    ```

=== "Example"

    ```bash
    --raft
    ```

Enables [Raft](../configure-and-manage/configure/consensus-protocols/raft.md) for consensus.

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

Enables [DNS resolution of peers](../configure-and-manage/configure/dns.md).

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
[joining a pre-existing cluster](../configure-and-manage/manage/add-nodes.md#adding-goquorum-nodes).
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

Port to bind for the [Raft transport](../configure-and-manage/configure/consensus-protocols/raft.md#raft-transport-layer).
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

Enables including the [revert reason](../configure-and-manage/manage/revert-reason.md) in the
[`eth_getTransactionReceipt`](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt) response.

### `rpcclitls.cacert`

=== "Syntax"

    ```bash
    --rpcclitls.cacert <path>/<to>/<TLS-CA-pem-file>
    ```

=== "Example"

    ```bash
    --rpcclitls.cacert certfile.pem
    ```

Path to the file containing the CA certificate for the [server's TLS certificate](#rpcclitlscert) when using a
[secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.cert`

=== "Syntax"

    ```bash
    --rpcclitls.cert <path>/<to>/<TLS-pem-file>
    ```

=== "Example"

    ```bash
    --rpcclitls.cert certfile.pem
    ```

Path to the file containing the server's TLS certificate when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.ciphersuites`

=== "Syntax"

    ```bash
    --rpcclitls.ciphersuites <STRING>
    ```

=== "Example"

    ```bash
    --rpcclitls.ciphersuites "CIPHER_SUITE_1,CIPHER_SUITE_2"
    ```

Comma-separated list of cipher suites to support when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.insecureskipverify`

=== "Syntax"

    ```bash
    --rpcclitls.insecureskipverify
    ```

If included, disables verification of the server's TLS certificate when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitoken`

=== "Syntax"

    ```bash
    --rpcclitoken <STRING>
    ```

=== "Example"

    ```bash
    --rpcclitoken "AYjcyMzY3ZDhiNmJkNTY"
    ```

JSON-RPC client access token when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `vm.calltimeout`

=== "Syntax"

    ```bash
    --vm.calltimeout <INTEGER>
    ```

=== "Example"

    ```bash
    --vm.calltimeout 2
    ```

Timeout in seconds when executing [`eth_call`](https://geth.ethereum.org/docs/rpc/ns-eth#eth_call).
The default is 5.
