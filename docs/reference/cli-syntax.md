---
title: Command line options
description: GoQuorum command line interface reference
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


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

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--allowedfutureblocktime <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--allowedfutureblocktime 1
```

  </TabItem>  
</Tabs>
Maximum time from current time allowed for blocks before they're considered future blocks, in seconds. This allows nodes to be slightly out of sync without receiving "Mining too far in the future" messages. The default is 0.

### `emitcheckpoints`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--emitcheckpoints
```

  </TabItem>  
</Tabs>
If included, emits specially formatted logging checkpoints.

### `immutabilitythreshold`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--immutabilitythreshold <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--immutabilitythreshold 1000000
```

  </TabItem>  
</Tabs>
Overrides the default immutability threshold for GoQuorum nodes. Blocks below the immutability threshold are moved to the `ancient` data folder. The default is 3162240.

### `multitenancy`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--multitenancy
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--multitenancy
```

  </TabItem>  
</Tabs>
Enables [multi-tenancy](../concepts/multi-tenancy.md). This requires the [JSON-RPC Security plugin](../develop/json-rpc-apis.md) to also be configured.

### `override.istanbul`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--override.istanbul <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--override.istanbul 100
```

  </TabItem>  
</Tabs>
Custom fork block when using [IBFT](../configure-and-manage/configure/consensus-protocols/ibft.md) or [QBFT](../configure-and-manage/configure/consensus-protocols/qbft.md) consensus. The default is 0.

### `permissioned`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--permissioned
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--permissioned
```

  </TabItem>  
</Tabs>
Enables [basic network permissioning](../concepts/permissions-overview.md#basic-network-permissioning). The node allows only a defined list of nodes to connect.

### `plugins`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--plugins file:///<path>/<to>/plugins.json
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--plugins file:///opt/geth/plugins.json
```

  </TabItem>  
</Tabs>
URI of the [plugins settings JSON file](../develop/develop-plugins.md). Use this to configure [plugins](../concepts/plugins.md).

### `plugins.localverify`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

    ```bash
    --plugins.localverify
    ```

  </TabItem>  
</Tabs>
If included, verifies [plugin integrity](../concepts/plugins.md#plugin-integrity-verification) from the local file system. This requires a plugin signature file and [PGP public key file](#pluginspublickey) to be available.

### `plugins.publickey`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--plugins.publickey file:///<path>/<to>/<publicKeyFile>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--plugins.publickey file:///opt/geth/pubkey.pgp.asc
```

  </TabItem>  
</Tabs>
URI of the PGP public key for local [plugin verification](../concepts/plugins.md#plugin-integrity-verification). This option is only valid if [`--plugins.localverify`](#pluginslocalverify) is set.

### `plugins.skipverify`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--plugins.skipverify
```

  </TabItem>  
</Tabs>
If included, disables the [plugin verification](../concepts/plugins.md#plugin-integrity-verification) process.

### `privacymarker.enable`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--privacymarker.enable
```

  </TabItem>  
</Tabs>
If included, GoQuorum creates a [privacy marker transaction](../concepts/privacy/privacy-marker-transactions.md) when a private transaction is submitted.

### `ptm.dialtimeout`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.dialtimeout <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.dialtimeout 0
```

  </TabItem>  
</Tabs>
Dial timeout in seconds for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 disables the timeout. The default is 1 second.

### `ptm.http.idletimeout`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.http.idletimeout <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.http.idletimeout 0
```

  </TabItem>  
</Tabs>
Idle timeout in seconds for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 disables the timeout. The default is 10 seconds.

### `ptm.http.readbuffersize`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.http.readbuffersize <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.http.readbuffersize 0
```

  </TabItem>  
</Tabs>
Size of the read buffer in bytes for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 or not specifying uses the `http.Transport` default.

### `ptm.http.writebuffersize`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.http.writebuffersize <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.http.writebuffersize 0
```

  </TabItem>  
</Tabs>
Size of the write buffer in bytes for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 or not specifying uses the `http.Transport` default.

### `ptm.socket`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.socket <path>/<to>/<ipc>/<file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.socket qdata/c1/tm.ipc
```

  </TabItem>  
</Tabs>
Path to the IPC file when using a Unix domain socket for the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.timeout`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

    ```bash
    --ptm.timeout <INTEGER>
    ```

  </TabItem>
  <TabItem value="Example" label="Example" default>

    ```bash
    ---ptm.timeout 0
    ```

  </TabItem>  
</Tabs>
Timeout in seconds for communication over the [private transaction manager connection](../configure-and-manage/configure/private-transaction-manager.md). Setting to 0 disables the timeout. The default is 5 seconds.

### `ptm.tls.clientcert`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.tls.clientcert <path>/<to>/<client_cert_pem_file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.tls.clientcert client.cert.pem
```

  </TabItem>  
</Tabs>
Path to the file containing the client certificate (or chain of certificates) when using a TLS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md). This is required if the server is configured to use two-way authentication.

### `ptm.tls.clientkey`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.tls.clientkey <path>/<to>/<client_key_pem_file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.tls.clientkey client.key.pem
```

  </TabItem>  
</Tabs>
Path to the file containing the client's private key when using a TLS [connection to private transaction manager](../configure-and-manage/configure/private-transaction-manager.md). This is required if the server is configured to use two-way authentication.

### `ptm.tls.insecureskipverify`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.tls.insecureskipverify
```

  </TabItem>  
</Tabs>
If included, disables verification of the server's TLS certificate on [connection to private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.tls.mode`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.tls.mode <STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.tls.mode "strict"
```

  </TabItem>  
</Tabs>
Setting to `off` disables TLS. Setting to `strict` enables TLS when using an HTTPS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `ptm.tls.rootca`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.tls.rootca <path>/<to>/<rootca_pem_file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.tls.rootca certfile.pem
```

  </TabItem>  
</Tabs>
Path to the file containing the root CA certificate when using a TLS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md). The default is the host's certificates.

### `ptm.url`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--ptm.url <URL>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
---ptm.url "https://127.0.0.1:9101"
```

  </TabItem>  
</Tabs>
URL when using an HTTP/HTTPS [connection to the private transaction manager](../configure-and-manage/configure/private-transaction-manager.md).

### `qlight.client`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client
```

  </TabItem>  
</Tabs>
Enables the [qlight client](../configure-and-manage/configure/qlight-node.md) P2P protocol.

### `qlight.client.psi`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.psi <STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.psi "private"
```

  </TabItem>  
</Tabs>
PSI the qlight client uses to connect to a server node. The default is `private`.

### `qlight.client.rpc.tls`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.rpc.tls
```

  </TabItem>  
</Tabs>
Enables the qlight client RPC connection to use TLS.

### `qlight.client.rpc.tls.cacert`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.rpc.tls.cacert <path>/<to>/<client-RPC certicate-auth-file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.rpc.tls.cacert certfile.pem
```

  </TabItem>  
</Tabs>
Path to the qlight client RPC client certificate authority file.

### `qlight.client.rpc.tls.cert`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.rpc.tls.cert <path>/<to>/<client-RPC-client-certificate-file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.rpc.tls.cert certfile.pem
```

  </TabItem>  
</Tabs>
Path to the qlight client RPC client certificate file.

### `qlight.client.rpc.tls.insecureskipverify`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.rpc.tls.insecureskipverify
```

  </TabItem>  
</Tabs>
Enables the qlight client RPC connection to skip TLS verification.

### `qlight.client.rpc.tls.key`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.rpc.tls.key <path>/<to>/<client_TLS_key_pem_file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.rpc.tls.key client.TLS.key.pem
```

  </TabItem>  
</Tabs>
Path to the qlight client RPC client certificate private key.

### `qlight.client.serverNode`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.serverNode <nodeID>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.serverNode 0xc35c3...d615f
```

  </TabItem>  
</Tabs>
The node ID of the target server node.

### `qlight.client.serverNodeRPC`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.serverNodeRPC <URL>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.serverNodeRPC "http://127.0.0.1:8888"
```

  </TabItem>  
</Tabs>
The RPC URL of the target server node.

### `qlight.client.token.enabled`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.token.enabled
```

  </TabItem>  
</Tabs>
Enables the client to use a token when connecting to the qlight server.

### `qlight.client.token.management`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.token.management <string>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.token.management "none"
```

  </TabItem>  
</Tabs>
Mechanism used to refresh the token. Possible values:

- `none` - Developer mode. The token is not refreshed.
- `external` - You must update the refreshed token in the running qlight client process by invoking the `qlight.setCurrentToken` RPC API.
- `client-security-plugin` - You must deploy the client security plugin, which periodically refreshes the access token.

### `qlight.client.token.value`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.client.token.value <TOKEN>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.client.token.value "bearer AYjcyMzY3ZDhiNmJkNTY"
```

  </TabItem>  
</Tabs>
Token the qlight client uses to connect to a server node.

### `qlight.server`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.server
```

  </TabItem>  
</Tabs>
Enables the [qlight server](../configure-and-manage/configure/qlight-node.md) P2P protocol.

### `qlight.server.p2p.maxpeers`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.server.p2p.maxpeers <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.server.p2p.maxpeers 10
```

  </TabItem>  
</Tabs>
Maximum number of qlight peers. The default is 10.

### `qlight.server.p2p.netrestrict`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.server.p2p.netrestrict <NETWORK MASK>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.server.p2p.netrestrict "xyz"
```

  </TabItem>  
</Tabs>
Restricts network communication to the given IP networks (CIDR masks).

### `qlight.server.p2p.permissioning`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.server.p2p.permissioning
```

  </TabItem>  
</Tabs>
Enables the qlight peers to check against a permissioned list and a disallowed list.

### `qlight.server.p2p.permissioning.prefix`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.server.p2p.permissioning.prefix <prefix>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.server.p2p.permissioning.prefix "qlight"
```

  </TabItem>  
</Tabs>
Prefix for the `permissioned-nodes.json` and `disallowed-nodes.json` files specific for the [qlight server](../configure-and-manage/configure/qlight-node.md#file-based-permissioning) to distinguish from other [permissioned nodes](../configure-and-manage/manage/add-nodes.md#permissioned-nodes). File format is the prefix name, followed by a hyphen, followed by the default file name. For example, `qlight-permissioned-nodes.json`.

### `qlight.server.p2p.port`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.server.p2p.port=<INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.server.p2p.port=30305
```

  </TabItem>  
</Tabs>
Port the qlight network listens to. The default is 30305.

### `qlight.tls`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.tls
```

  </TabItem>  
</Tabs>
Enables the qlight client P2P protocol to use TLS.

### `qlight.tls.cacerts`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.tls.cacerts <path>/<to>/<qlight_tls_cacert_file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.tls.cacerts certfile.pem
```

  </TabItem>  
</Tabs>
Path to the certificate authorities file to use for validating P2P connection.

### `qlight.tls.cert`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.tls.cert` <path>/<to>/<qlight_tls_cert_file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.tls.cert certfile.pem
```

  </TabItem>  
</Tabs>
Path to the certificate file to use for the qlight P2P connection.

### `qlight.tls.ciphersuites`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.tls.ciphersuites <STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.tls.ciphersuites "CIPHER_SUITE_1,CIPHER_SUITE_2"
```

  </TabItem>  
</Tabs>
Cipher suites to use for the qlight P2P connection.

### `qlight.tls.clientauth`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.tls.clientauth <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.tls.clientauth 0
```

  </TabItem>  
</Tabs>
Sets the method the client is authenticated. Possible values:

- 0=`NoClientCert` (default)
- 1=`RequestClientCert`
- 2=`RequireAnyClientCert`
- 3=`VerifyClientCertIfGiven`
- 4=`RequireAndVerifyClientCert`

### `qlight.tls.key`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--qlight.tls.key <path>/<to>/<qlight_tls_key_file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--qlight.tls.key certfile.pem
```

  </TabItem>  
</Tabs>
Path to the key file to use for qlight P2P connection.

### `raft`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--raft
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--raft
```

  </TabItem>  
</Tabs>
Enables [Raft](../configure-and-manage/configure/consensus-protocols/raft.md) for consensus.

### `raftblocktime`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--raftblocktime <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--raftblocktime 100
```

  </TabItem>  
</Tabs>
Time between Raft block creations in milliseconds. The default is 50.

### `raftdnsenable`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--raftdnsenable
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--raftdnsenable
```

  </TabItem>  
</Tabs>
Enables [DNS resolution of peers](../configure-and-manage/configure/dns.md).

### `raftjoinexisting`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--raftjoinexisting <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--raftjoinexisting 1
```

  </TabItem>  
</Tabs>
Raft ID to assume when [joining a pre-existing cluster](../configure-and-manage/manage/add-nodes.md#adding-goquorum-nodes). The default is 0.

### `raftlogdir`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--raftlogdir <DIRECTORY>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--raftlogdir raftlogdir
```

  </TabItem>  
</Tabs>
Raft log directory used for the `quorum-raft-state`, `raft-snap`, and `raft-wal` folders. Defaults to the [`datadir` option](https://geth.ethereum.org/docs/interface/command-line-options).

### `raftport`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--raftport <PORT>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--raftport 50500
```

  </TabItem>  
</Tabs>
Port to bind for the [Raft transport](../configure-and-manage/configure/consensus-protocols/raft.md#raft-transport-layer). The default is 50400.

### `revertreason`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--revertreason
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--revertreason
```

  </TabItem>  
</Tabs>
Enables including the [revert reason](../configure-and-manage/manage/revert-reason.md) in the [`eth_getTransactionReceipt`](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt) response.

### `rpcclitls.cacert`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--rpcclitls.cacert <path>/<to>/<TLS-CA-pem-file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--rpcclitls.cacert certfile.pem
```

  </TabItem>  
</Tabs>
Path to the file containing the CA certificate for the [server's TLS certificate](#rpcclitlscert) when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.cert`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--rpcclitls.cert <path>/<to>/<TLS-pem-file>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--rpcclitls.cert certfile.pem
```

  </TabItem>  
</Tabs>
Path to the file containing the server's TLS certificate when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.ciphersuites`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--rpcclitls.ciphersuites <STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--rpcclitls.ciphersuites "CIPHER_SUITE_1,CIPHER_SUITE_2"
```

  </TabItem>  
</Tabs>
Comma-separated list of cipher suites to support when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitls.insecureskipverify`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--rpcclitls.insecureskipverify
```

  </TabItem>  
</Tabs>
If included, disables verification of the server's TLS certificate when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `rpcclitoken`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--rpcclitoken <STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--rpcclitoken "AYjcyMzY3ZDhiNmJkNTY"
```

  </TabItem>  
</Tabs>
JSON-RPC client access token when using a [secured GoQuorum node connection](../develop/json-rpc-apis.md).

### `vm.calltimeout`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--vm.calltimeout <INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" default>

```bash
--vm.calltimeout 2
```

  </TabItem>  
</Tabs>
Timeout in seconds when executing [`eth_call`](https://geth.ethereum.org/docs/rpc/ns-eth#eth_call). The default is 5.
