# Private Transaction Manager

GoQuorum uses a Private Transaction Manager, [Tessera](https://docs.tessera.consensys.net), to implement
private transactions.

The Private Transaction Manager is a separate component for storage and distribution
of encrypted private transaction data between recipients of a private transaction.

The Private Transaction Manager has two distinct components:

* Transaction Manager
* Enclave

Enable private transactions with the `PRIVATE_CONFIG` environment variable when starting a GoQuorum
node.

Use this `PRIVATE_CONFIG` environment variable either with a direct path to the Privacy Manager's `.ipc` socket
or with a path to a TOML configuration file as explained in the following sections.

## Direct IPC connection configuration

This is the default method for specifying an IPC socket.

Use this method if you want to use an IPC socket for the connection, with default timeout values.

```bash
export PRIVATE_CONFIG=path/to/tm.ipc
```

## Using a connection configuration file

Using a configuration file allows you to specify more options for the connection to the Transaction Manager.

```bash
export PRIVATE_CONFIG=path/to/connection-config-file.toml
```

#### IPC connection

A configuration file is only necessary for an IPC socket connection if you need to change the timeouts from their default values.

!!! example "Example ipc-config-file.toml"

    ```toml
    [socketConfig]
    socket = "tm.ipc"
    workdir = "path/to/ipc/file"
    dialTimeout = 1
    requestTimeout = 5
    responseHeaderTimeout = 5
    ```

    Where:

    * optional `dialTimeout` is timeout when connecting to socket (seconds), default = 1 second
    * optional `requestTimeout` is timeout for the write to the socket (seconds), default = 5 seconds
    * optional `responseHeaderTimeout` is timeout for reading a response from the socket (seconds), default = 5 seconds

!!! note

    You can increase `responseHeaderTimeout` if transaction manager responses are too slow.

    `dialTimeout` and `requestTimeout` rarely need changes and can work with the default values.

#### HTTP connection

This allows quorum to connect to a private transaction manager using http.
This should only be used for development purposes, due to a lack of security on the connection.
For production environments, you should enable TLS on the connection, as described in the next section.

!!! example "Example http-config-file.toml"

    ```toml
    [httpConfig]
    url = "HTTP://127.0.0.1:9101"
    clientTimeout = 10
    writeBufferSize = 4096
    readBufferSize = 4096
    tls = "OFF"
    ```

    Where:

    * optional `clientTimeout` is timeout for overall client call (seconds), zero means timeout disabled, default = 10 seconds
    * optional `writeBufferSize` is size of the write buffer (bytes), if zero or unspecified then uses http.Transport default
    * optional `readBufferSize` is size of the read buffer (bytes), if zero or unspecified then uses http.Transport default

#### HTTPS connection using TLS

Using an `https` url, and changing the `tls` flag to `STRICT` in the HTTP config, will enable TLS encryption over the connection.

!!! example "Example http-config-file.toml"

    ```toml
    [httpConfig]
    url = "HTTPS://127.0.0.1:9101"
    idleConnTimeout = 10
    writeBufferSize = 4096
    readBufferSize = 4096
    tls = "STRICT"
    rootCA = "/path/to/ca-root.cert.pem"
    clientCert = "/path/to/client.cert.pem"
    clientKey = "/path/to/client.key.pem"
    clientTimeout = 10
    ```

    Where:

    * optional `rootCA` is file containing root CA certificate
    * optional `clientCert` is file containing client certificate
    * optional `clientKey` is file containing client certificate private key
