---
title: Command line options
description: GoQuorum command line interface reference
sidebar_position: 1
---

# GoQuorum command line options

This reference describes the syntax of the GoQuorum command line interface (CLI) options.

:::caution

GoQuorum is based on the [Geth Go Ethereum client](https://geth.ethereum.org/) but only the GoQuorum-specific CLI options are listed here.

Visit the [Go Ethereum documentation](https://geth.ethereum.org/docs/interface/command-line-options) to view the CLI options for the `geth` command.

:::

## Specifying options

You can specify GoQuorum options:

- On the command line.

  ```bash
  geth [OPTIONS]
  ```

- In a [configuration file](../configure-and-manage/configure/use-configuration-file.md).

## Options

### `allowedfutureblocktime`

<!--tabs-->

# Syntax

```bash
--allowedfutureblocktime <INTEGER>
```

# Example

```bash
--allowedfutureblocktime 1
```

<!--/tabs-->

Maximum time from current time allowed for blocks before they're considered future blocks, in seconds. This allows nodes to be slightly out of sync without receiving "Mining too far in the future" messages. The default is 0.

### `emitcheckpoints`

<!--tabs-->

# Syntax

```bash
--emitcheckpoints
```

<!--/tabs-->

If included, emits specially formatted logging checkpoints.

### `immutabilitythreshold`

<!--tabs-->

# Syntax

```bash
--immutabilitythreshold <INTEGER>
```

# Example

```bash
--immutabilitythreshold 1000000
```

<!--/tabs-->

Overrides the default immutability threshold for GoQuorum nodes. Blocks below the immutability threshold are moved to the `ancient` data folder. The default is 3162240.

### `multitenancy`

<!--tabs-->

# Syntax

```bash
--multitenancy
```

# Example

```bash
--multitenancy
```

<!--/tabs-->

Enables [multi-tenancy](../concepts/multi-tenancy.md). This requires the [JSON-RPC Security plugin](../develop/json-rpc-apis.md) to also be configured.

### `override.istanbul`

<!--tabs-->

# Syntax

```bash
--override.istanbul <INTEGER>
```

# Example

```bash
--override.istanbul 100
```

<!--/tabs-->

Custom fork block when using [IBFT](../configure-and-manage/configure/consensus-protocols/ibft.md) or [QBFT](../configure-and-manage/configure/consensus-protocols/qbft.md) consensus. The default is 0.

### `permissioned`

<!--tabs-->

# Syntax

```bash
--permissioned
```

# Example

```bash
--permissioned
```

<!--/tabs-->

Enables [basic network permissioning](../concepts/permissions-overview.md#basic-network-permissioning). The node allows only a defined list of nodes to connect.

### `plugins`

<!--tabs-->

# Syntax

```bash
--plugins file:///<path>/<to>/plugins.json
```

# Example

```bash
--plugins file:///opt/geth/plugins.json
```

<!--/tabs-->

URI of the [plugins settings JSON file](../develop/develop-plugins.md). Use this to configure [plugins](../concepts/plugins.md).

### `plugins.localverify`

<!--tabs-->

# Syntax

    ```bash
    --plugins.localverify
    ```

<!--/tabs-->

If included, verifies [plugin integrity](../concepts/plugins.md#plugin-integrity-verification) from the local file system. This requires a plugin signature file and [PGP public key file](#pluginspublickey) to be available.

### `plugins.publickey`

<!--tabs-->

# Syntax

```bash
--plugins.publickey file:///<path>/<to>/<publicKeyFile>
```

# Example

```bash
--plugins.publickey file:///opt/geth/pubkey.pgp.asc
```

<!--/tabs-->

URI of the PGP public key for local [plugin verification](../concepts/plugins.md#plugin-integrity-verification). This option is only valid if [`--plugins.localverify`](#pluginslocalverify) is set.

### `plugins.skipverify`

<!--tabs-->

# Syntax

```bash
--plugins.skipverify
```

<!--/tabs-->

If included, disables the [plugin verification](../concepts/plugins.md#plugin-integrity-verification) process.

### `privacymarker.enable`

<!--tabs-->

# Syntax

```bash
--privacymarker.enable
```

<!--/tabs-->

If included, GoQuorum creates a [privacy marker transaction](../concepts/privacy/privacy-marker-transactions.md) when a private transaction is submitted.

### `ptm.dialtimeout`

<!--tabs-->

# Syntax

```bash
--ptm.dialtimeout <INTEGER>
```

# Example

```bash
---ptm.dialtimeout 0
```

<!--/tabs-->

Dial timeout in seconds for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 disables the timeout. The default is 1 second.

### `ptm.http.idletimeout`

<!--tabs-->

# Syntax

```bash
--ptm.http.idletimeout <INTEGER>
```

# Example

```bash
---ptm.http.idletimeout 0
```

<!--/tabs-->

Idle timeout in seconds for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 disables the timeout. The default is 10 seconds.

### `ptm.http.readbuffersize`

<!--tabs-->

# Syntax

```bash
--ptm.http.readbuffersize <INTEGER>
```

# Example

```bash
---ptm.http.readbuffersize 0
```

<!--/tabs-->

Size of the read buffer in bytes for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 or not specifying uses the `http.Transport` default.

### `ptm.http.writebuffersize`

<!--tabs-->

# Syntax

```bash
--ptm.http.writebuffersize <INTEGER>
```

# Example

```bash
---ptm.http.writebuffersize 0
```

<!--/tabs-->

Size of the write buffer in bytes for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 or not specifying uses the `http.Transport` default.

### `ptm.socket`

<!--tabs-->

# Syntax

```bash
--ptm.socket <path>/<to>/<ipc>/<file>
```

# Example

```bash
---ptm.socket qdata/c1/tm.ipc
```

<!--/tabs-->

Path to the IPC file when using a Unix domain socket for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.timeout`

<!--tabs-->

# Syntax

    ```bash
    --ptm.timeout <INTEGER>
    ```

# Example

    ```bash
    ---ptm.timeout 0
    ```

<!--/tabs-->

Timeout in seconds for communication over the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 disables the timeout. The default is 5 seconds.

### `ptm.tls.clientcert`

<!--tabs-->

# Syntax

```bash
--ptm.tls.clientcert <path>/<to>/<client_cert_pem_file>
```

# Example

```bash
---ptm.tls.clientcert client.cert.pem
```

<!--/tabs-->

Path to the file containing the client certificate (or chain of certificates) when using a TLS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md). This is required if the server is configured to use two-way authentication.

### `ptm.tls.clientkey`

<!--tabs-->

# Syntax

```bash
--ptm.tls.clientkey <path>/<to>/<client_key_pem_file>
```

# Example

```bash
---ptm.tls.clientkey client.key.pem
```

<!--/tabs-->

Path to the file containing the client's private key when using a TLS [connection to private transaction manager](../configure-and-manage/configure/private-transaction-manager.md). This is required if the server is configured to use two-way authentication.

### `ptm.tls.insecureskipverify`

<!--tabs-->

# Syntax

```bash
--ptm.tls.insecureskipverify
```

<!--/tabs-->

If included, disables verification of the server's TLS certificate on [connection to private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.tls.mode`

<!--tabs-->

# Syntax

```bash
--ptm.tls.mode <STRING>
```

# Example

```bash
---ptm.tls.mode "strict"
```

<!--/tabs-->

Setting to `off` disables TLS. Setting to `strict` enables TLS when using an HTTPS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.tls.rootca`

<!--tabs-->

# Syntax

```bash
--ptm.tls.rootca <path>/<to>/<rootca_pem_file>
```

# Example

```bash
---ptm.tls.rootca certfile.pem
```

<!--/tabs-->

Path to the file containing the root CA certificate when using a TLS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md). The default is the host's certificates.

### `ptm.url`

<!--tabs-->

# Syntax

```bash
--ptm.url <URL>
```

# Example

```bash
---ptm.url "https://127.0.0.1:9101"
```

<!--/tabs-->

URL when using an HTTP/HTTPS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `qlight.client`

<!--tabs-->

# Syntax

```bash
--qlight.client
```

<!--/tabs-->

Enables the [qlight client](../configure-and-manage/configure/qlight-node.md) P2P protocol.

### `qlight.client.psi`

<!--tabs-->

# Syntax

```bash
--qlight.client.psi <STRING>
```

# Example

```bash
--qlight.client.psi "private"
```

<!--/tabs-->

PSI the qlight client uses to connect to a server node. The default is `private`.

### `qlight.client.rpc.tls`

<!--tabs-->

# Syntax

```bash
--qlight.client.rpc.tls
```

<!--/tabs-->

Enables the qlight client RPC connection to use TLS.

### `qlight.client.rpc.tls.cacert`

<!--tabs-->

# Syntax

```bash
--qlight.client.rpc.tls.cacert <path>/<to>/<client-RPC certicate-auth-file>
```

# Example

```bash
--qlight.client.rpc.tls.cacert certfile.pem
```

<!--/tabs-->

Path to the qlight client RPC client certificate authority file.

### `qlight.client.rpc.tls.cert`

<!--tabs-->

# Syntax

```bash
--qlight.client.rpc.tls.cert <path>/<to>/<client-RPC-client-certificate-file>
```

# Example

```bash
--qlight.client.rpc.tls.cert certfile.pem
```

<!--/tabs-->

Path to the qlight client RPC client certificate file.

### `qlight.client.rpc.tls.insecureskipverify`

<!--tabs-->

# Syntax

```bash
--qlight.client.rpc.tls.insecureskipverify
```

<!--/tabs-->

Enables the qlight client RPC connection to skip TLS verification.

### `qlight.client.rpc.tls.key`

<!--tabs-->

# Syntax

```bash
--qlight.client.rpc.tls.key <path>/<to>/<client_TLS_key_pem_file>
```

# Example

```bash
--qlight.client.rpc.tls.key client.TLS.key.pem
```

<!--/tabs-->

Path to the qlight client RPC client certificate private key.

### `qlight.client.serverNode`

<!--tabs-->

# Syntax

```bash
--qlight.client.serverNode <nodeID>
```

# Example

```bash
--qlight.client.serverNode 0xc35c3...d615f
```

<!--/tabs-->

The node ID of the target server node.

### `qlight.client.serverNodeRPC`

<!--tabs-->

# Syntax

```bash
--qlight.client.serverNodeRPC <URL>
```

# Example

```bash
--qlight.client.serverNodeRPC "http://127.0.0.1:8888"
```

<!--/tabs-->

The RPC URL of the target server node.

### `qlight.client.token.enabled`

<!--tabs-->

# Syntax

```bash
--qlight.client.token.enabled
```

<!--/tabs-->

Enables the client to use a token when connecting to the qlight server.

### `qlight.client.token.management`

<!--tabs-->

# Syntax

```bash
--qlight.client.token.management <string>
```

# Example

```bash
--qlight.client.token.management "none"
```

<!--/tabs-->

Mechanism used to refresh the token. Possible values:

- `none` - Developer mode. The token is not refreshed.
- `external` - You must update the refreshed token in the running qlight client process by invoking the `qlight.setCurrentToken` RPC API.
- `client-security-plugin` - You must deploy the client security plugin, which periodically refreshes the access token.

### `qlight.client.token.value`

<!--tabs-->

# Syntax

```bash
--qlight.client.token.value <TOKEN>
```

# Example

```bash
--qlight.client.token.value "bearer AYjcyMzY3ZDhiNmJkNTY"
```

<!--/tabs-->

Token the qlight client uses to connect to a server node.

### `qlight.server`

<!--tabs-->

# Syntax

```bash
--qlight.server
```

<!--/tabs-->

Enables the [qlight server](../configure-and-manage/configure/qlight-node.md) P2P protocol.

### `qlight.server.p2p.maxpeers`

<!--tabs-->

# Syntax

```bash
--qlight.server.p2p.maxpeers <INTEGER>
```

# Example

```bash
--qlight.server.p2p.maxpeers 10
```

<!--/tabs-->

Maximum number of qlight peers. The default is 10.

### `qlight.server.p2p.netrestrict`

<!--tabs-->

# Syntax

```bash
--qlight.server.p2p.netrestrict <NETWORK MASK>
```

# Example

```bash
--qlight.server.p2p.netrestrict "xyz"
```

<!--/tabs-->

Restricts network communication to the given IP networks (CIDR masks).

### `qlight.server.p2p.permissioning`

<!--tabs-->

# Syntax

```bash
--qlight.server.p2p.permissioning
```

<!--/tabs-->

Enables the qlight peers to check against a permissioned list and a disallowed list.

### `qlight.server.p2p.permissioning.prefix`

<!--tabs-->

# Syntax

```bash
--qlight.server.p2p.permissioning.prefix <prefix>
```

# Example

```bash
--qlight.server.p2p.permissioning.prefix "qlight"
```

<!--/tabs-->

Prefix for the `permissioned-nodes.json` and `disallowed-nodes.json` files specific for the [qlight server](../configure-and-manage/configure/qlight-node.md#file-based-permissioning) to distinguish from other [permissioned nodes](../configure-and-manage/manage/add-nodes.md#permissioned-nodes). File format is the prefix name, followed by a hyphen, followed by the default file name. For example, `qlight-permissioned-nodes.json`.

### `qlight.server.p2p.port`

<!--tabs-->

# Syntax

```bash
--qlight.server.p2p.port=<INTEGER>
```

# Example

```bash
--qlight.server.p2p.port=30305
```

<!--/tabs-->

Port the qlight network listens to. The default is 30305.

### `qlight.tls`

<!--tabs-->

# Syntax

```bash
--qlight.tls
```

<!--/tabs-->

Enables the qlight client P2P protocol to use TLS.

### `qlight.tls.cacerts`

<!--tabs-->

# Syntax

```bash
--qlight.tls.cacerts <path>/<to>/<qlight_tls_cacert_file>
```

# Example

```bash
--qlight.tls.cacerts certfile.pem
```

<!--/tabs-->

Path to the certificate authorities file to use for validating P2P connection.

### `qlight.tls.cert`

<!--tabs-->

# Syntax

```bash
--qlight.tls.cert` <path>/<to>/<qlight_tls_cert_file>
```

# Example

```bash
--qlight.tls.cert certfile.pem
```

<!--/tabs-->

Path to the certificate file to use for the qlight P2P connection.

### `qlight.tls.ciphersuites`

<!--tabs-->

# Syntax

```bash
--qlight.tls.ciphersuites <STRING>
```

# Example

```bash
--qlight.tls.ciphersuites "CIPHER_SUITE_1,CIPHER_SUITE_2"
```

<!--/tabs-->

Cipher suites to use for the qlight P2P connection.

### `qlight.tls.clientauth`

<!--tabs-->

# Syntax

```bash
--qlight.tls.clientauth <INTEGER>
```

# Example

```bash
--qlight.tls.clientauth 0
```

<!--/tabs-->

Sets the method the client is authenticated. Possible values:

- 0=`NoClientCert` (default)
- 1=`RequestClientCert`
- 2=`RequireAnyClientCert`
- 3=`VerifyClientCertIfGiven`
- 4=`RequireAndVerifyClientCert`

### `qlight.tls.key`

<!--tabs-->

# Syntax

```bash
--qlight.tls.key <path>/<to>/<qlight_tls_key_file>
```

# Example

```bash
--qlight.tls.key certfile.pem
```

<!--/tabs-->

Path to the key file to use for qlight P2P connection.

### `raft`

<!--tabs-->

# Syntax

```bash
--raft
```

# Example

```bash
--raft
```

<!--/tabs-->

Enables [Raft](../configure-and-manage/configure/consensus-protocols/raft.md) for consensus.

### `raftblocktime`

<!--tabs-->

# Syntax

```bash
--raftblocktime <INTEGER>
```

# Example

```bash
--raftblocktime 100
```

<!--/tabs-->

Time between Raft block creations in milliseconds. The default is 50.

### `raftdnsenable`

<!--tabs-->

# Syntax

```bash
--raftdnsenable
```

# Example

```bash
--raftdnsenable
```

<!--/tabs-->

Enables [DNS resolution of peers](../configure-and-manage/configure/dns.md).

### `raftjoinexisting`

<!--tabs-->

# Syntax

```bash
--raftjoinexisting <INTEGER>
```

# Example

```bash
--raftjoinexisting 1
```

<!--/tabs-->

Raft ID to assume when [joining a pre-existing cluster](../configure-and-manage/manage/add-nodes.md#adding-goquorum-nodes). The default is 0.

### `raftlogdir`

<!--tabs-->

# Syntax

```bash
--raftlogdir <DIRECTORY>
```

# Example

```bash
--raftlogdir raftlogdir
```

<!--/tabs-->

Raft log directory used for the `quorum-raft-state`, `raft-snap`, and `raft-wal` folders. Defaults to the [`datadir` option](https://geth.ethereum.org/docs/interface/command-line-options).

### `raftport`

<!--tabs-->

# Syntax

```bash
--raftport <PORT>
```

# Example

```bash
--raftport 50500
```

<!--/tabs-->

Port to bind for the [Raft transport](../configure-and-manage/configure/consensus-protocols/raft.md#raft-transport-layer). The default is 50400.

### `revertreason`

<!--tabs-->

# Syntax

```bash
--revertreason
```

# Example

```bash
--revertreason
```

<!--/tabs-->

Enables including the [revert reason](../configure-and-manage/manage/revert-reason.md) in the [`eth_getTransactionReceipt`](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt) response.

### `rpcclitls.cacert`

<!--tabs-->

# Syntax

```bash
--rpcclitls.cacert <path>/<to>/<TLS-CA-pem-file>
```

# Example

```bash
--rpcclitls.cacert certfile.pem
```

<!--/tabs-->

Path to the file containing the CA certificate for the [server's TLS certificate](#rpcclitlscert) when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.cert`

<!--tabs-->

# Syntax

```bash
--rpcclitls.cert <path>/<to>/<TLS-pem-file>
```

# Example

```bash
--rpcclitls.cert certfile.pem
```

<!--/tabs-->

Path to the file containing the server's TLS certificate when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.ciphersuites`

<!--tabs-->

# Syntax

```bash
--rpcclitls.ciphersuites <STRING>
```

# Example

```bash
--rpcclitls.ciphersuites "CIPHER_SUITE_1,CIPHER_SUITE_2"
```

<!--/tabs-->

Comma-separated list of cipher suites to support when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.insecureskipverify`

<!--tabs-->

# Syntax

```bash
--rpcclitls.insecureskipverify
```

<!--/tabs-->

If included, disables verification of the server's TLS certificate when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitoken`

<!--tabs-->

# Syntax

```bash
--rpcclitoken <STRING>
```

# Example

```bash
--rpcclitoken "AYjcyMzY3ZDhiNmJkNTY"
```

<!--/tabs-->

JSON-RPC client access token when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `vm.calltimeout`

<!--tabs-->

# Syntax

```bash
--vm.calltimeout <INTEGER>
```

# Example

```bash
--vm.calltimeout 2
```

<!--/tabs-->

Timeout in seconds when executing [`eth_call`](https://geth.ethereum.org/docs/rpc/ns-eth#eth_call). The default is 5.
