---
title: Private transaction manager
description: configuring private transaction manager
sidebar_position: 9
---

# Configure the private transaction manager

You can configure a connection to the [private transaction manager](../../concepts/privacy-index.md#private-transaction-manager) and enable private transactions using any of the following methods.

- [Configure the private transaction manager](#configure-the-private-transaction-manager)
  - [Direct IPC connection configuration](#direct-ipc-connection-configuration)
  - [Using a connection configuration file](#using-a-connection-configuration-file)
    - [IPC socket connection](#ipc-socket-connection)
    - [HTTP connection](#http-connection)
    - [HTTP connection using TLS](#http-connection-using-tls)
  - [Using command line options](#using-command-line-options)
    - [IPC socket connection](#ipc-socket-connection-1)
    - [HTTP connection](#http-connection-1)
    - [HTTP connection using TLS](#http-connection-using-tls-1)

:::note

To run a GoQuorum node without a private transaction manager, set the `PRIVATE_CONFIG` environment variable to `ignore`. Ensure there is no transaction manager running for the node. The node won't broadcast matching private keys and won't be able to participate in any private transactions.

:::

## Direct IPC connection configuration

You can set the `PRIVATE_CONFIG` environment variable to the path to the `.ipc` socket file created by the private transaction manager. Use this method if you want to use an IPC socket for the connection with default timeout values.

```bash
export PRIVATE_CONFIG=path/to/tm.ipc
```

## Using a connection configuration file

You can set the `PRIVATE_CONFIG` environment variable to the path to a TOML configuration file that specifies the private transaction manager connection. Using a configuration file allows you to specify more options for the connection to the transaction manager.

```bash
export PRIVATE_CONFIG=path/to/connection-config-file.toml
```

The configuration file can specify:

- An [IPC socket connection](#ipc-socket-connection).
- An [HTTP connection](#http-connection).
- An [HTTP connection using TLS](#http-connection-using-tls).

### IPC socket connection

:::note

A configuration file is only necessary for an IPC socket connection if you need to change the timeout values from their default values. Otherwise, [direct IPC connection configuration](#direct-ipc-connection-configuration) is simpler.

:::

An IPC socket configuration file has the following parameters.

- `socket` - `.ipc` socket file created by the private transaction manager.
- `workdir` - Path to the working directory of the IPC file.
- `timeout` - (optional) Timeout when sending messages, in seconds. Setting to 0 disables the timeout. The default is 5 seconds. You can increase this value if transaction manager responses are too slow.
- `dialTimeout` - (optional) Timeout for connecting to the socket, in seconds. The default is 1 second.

```toml title="ipc-config-file.toml"
socket = "tm.ipc"
workdir = "path/to/ipc/file"
timeout = 5
dialTimeout = 1
```

### HTTP connection

:::caution

This should only be used for development purposes, due to a lack of security on the connection. For production environments, you should enable TLS on the connection.

:::

An HTTP configuration file has the following parameters.

- `httpUrl` - URL of the HTTP connection.
- `timeout` - (optional) Timeout when sending messages, in seconds. Setting to 0 disables the timeout. The default is 5 seconds.
- `writeBufferSize` - (optional) Size of the write buffer, in bytes. Setting to 0 or not specifying uses the `http.Transport` default.
- `readBufferSize` - (optional) Size of the read buffer, in bytes. Setting to 0 or not specifying uses the `http.Transport` default.

```toml title="http-config-file.toml"
httpUrl = "HTTP://127.0.0.1:9101"
timeout = 5
httpWriteBufferSize = 4096
httpReadBufferSize = 4096
```

### HTTP connection using TLS

An HTTP configuration file using TLS has the following parameters.

- `httpUrl` - URL of the HTTPS connection. Make sure to use an `https` URL.
- `tlsMode` - Set to `STRICT` to enable TLS encryption over the connection.
- `tlsRootCA` - Any combination of comma separated files or directories containing root CA certificates. The default is the host's certificates.
- `tlsClientCert` - Path to the file containing the client certificate.
- `tlsClientKey` - Path to the file containing the client certificate private key.
- `timeout` - (optional) Timeout when sending messages, in seconds. Setting to 0 disables the timeout. The default is 5 seconds.
- `httpIdleConnTimeout` - (optional) Idle timeout in seconds. Setting to 0 disables the timeout. The default is 10 seconds.
- `writeBufferSize` - (optional) Size of the write buffer, in bytes. Setting to 0 or not specifying uses the `http.Transport` default.
- `readBufferSize` - (optional) Size of the read buffer, in bytes. Setting to 0 or not specifying uses the `http.Transport` default.

```toml title="http-config-file.toml"
httpUrl = "HTTPS://127.0.0.1:9101"
tlsMode = "STRICT"
tlsRootCA = "/path/to/ca-root.cert.pem"
tlsClientCert = "/path/to/client-ca-chain.cert.pem"
tlsClientKey = "/path/to/client.key.pem"
timeout = 5
httpIdleConnTimeout = 10
httpWriteBufferSize = 4096
httpReadBufferSize = 4096
```

## Using command line options

Use [`--ptm.*` command line options](../../reference/cli-syntax.md#ptmdialtimeout) to specify the private transaction manager connection. These can be used in conjunction with the previous methods, in which case the command line options override any others.

### IPC socket connection

Specify the path to the IPC socket file using [`--ptm.socket`](../../reference/cli-syntax.md#ptmsocket).

```bash
geth <other parameters> --ptm.socket qdata/c1/tm.ipc
```

### HTTP connection

:::caution

This should only be used for development purposes, due to a lack of security on the connection. For production environments, you should enable TLS on the connection.

:::

Specify the HTTP URL of the private transaction manager connection using [`--ptm.url`](../../reference/cli-syntax.md#ptmurl).

```bash
geth <other parameters> --ptm.url "http://127.0.0.1:9101"
```

### HTTP connection using TLS

HTTP using TLS requires:

- Specifying an `https` URL using [`--ptm.url`](../../reference/cli-syntax.md#ptmurl).
- Setting the TLS mode to `strict` using [`--ptm.tls.mode`](../../reference/cli-syntax.md#ptmtlsmode).
- Specifying relevant certificates using [`--ptm.tls.rootca`](../../reference/cli-syntax.md#ptmtlsrootca), [`--ptm.tls.clientcert`](../../reference/cli-syntax.md#ptmtlsclientcert), and [`--ptm.tls.clientkey`](../../reference/cli-syntax.md#ptmtlsclientkey).

```bash title="Example TLS connection"
geth <other parameters> \
  --ptm.url "https://127.0.0.1:9101" \
  --ptm.tls.mode "strict" \
  --ptm.tls.rootca "path/to/certfile.pem,dir/with/cert/files/" \
  --ptm.tls.clientcert "path/to/client.cert.pem" \
  --ptm.tls.clientkey "path/to/client.key.pem" \
```
