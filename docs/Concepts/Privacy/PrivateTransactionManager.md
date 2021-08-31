# Private transaction manager

GoQuorum uses a private transaction manager, [Tessera](https://docs.tessera.consensys.net), to implement
private transactions.

The private transaction manager is a separate component for storage and distribution
of encrypted private transaction data between recipients of a private transaction.

The private transaction manager has two distinct components:

* Transaction manager
* Enclave

Enable private transactions using any of the following methods when starting a GoQuorum node:

* Set the `PRIVATE_CONFIG` environment variable to specify a direct IPC connection to the private transaction manager.
* Set the `PRIVATE_CONFIG` environment variable to a TOML configuration file that specifies the private transaction manager connection.
* Use command line parameters to specify the private transaction manager connection.

These options will be explained in detail in the following sections.

## Direct IPC connection configuration

This is the default method for specifying the path to an `.ipc` socket file created by the private transaction manager.

Use this method if you want to use an IPC socket for the connection, with default timeout values.

```bash
export PRIVATE_CONFIG=path/to/tm.ipc
```

## Using a connection configuration file

Using a configuration file allows you to specify more options for the connection to the transaction manager.

```bash
export PRIVATE_CONFIG=path/to/connection-config-file.toml
```

=== "Unix IPC socket connection"

    A configuration file is only necessary for an IPC socket connection if you need to change the timeouts from their default values, otherwise the [Direct IPC connection configuration](#direct-ipc-connection-configuration) method is simpler.

    !!! example "Example ipc-config-file.toml"

        ```toml
        socket = "tm.ipc"
        workdir = "path/to/ipc/file"
        timeout = 5
        dialTimeout = 1
        ```

        Where:

        * optional `timeout` is overall timeout when sending messages (seconds), zero disables timeout, default = 5 seconds
        * optional `dialTimeout` is timeout for connecting to the socket (seconds), default = 1 second

        !!! note

            You can increase `timeout` if transaction manager responses are too slow.
            `dialTimeout` rarely need to be changed and can work with the default values.

=== "HTTP connection"

    This allows quorum to connect to a private transaction manager using http.

    !!! warning

        This should only be used for development purposes, due to a lack of security on the connection.
        For production environments, you should enable TLS on the connection, as described in the next section.

    !!! example "Example http-config-file.toml"

        ```toml
        httpUrl = "HTTP://127.0.0.1:9101"
        timeout = 5
        httpWriteBufferSize = 4096
        httpReadBufferSize = 4096
        ```

        Where:

        * optional `timeout` is overall timeout when sending messages (seconds), zero disables timeout, default = 5 seconds
        * optional `writeBufferSize` is size of the write buffer (bytes), if zero or unspecified then uses http.Transport default
        * optional `readBufferSize` is size of the read buffer (bytes), if zero or unspecified then uses http.Transport default

=== "HTTP connection using TLS"

    Using an `https` url, and changing the `tls` flag to `STRICT` in the HTTP config, will enable TLS encryption over the connection.

    !!! example "Example http-config-file.toml"

        ```toml
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

        Where:

        * `tlsRootCA` is any combination of comma separated files/directories containing root CA certificates, defaults to host's certificates
        * `tlsClientCert` is file containing client certificate
        * `tlsClientKey` is file containing client certificate private key

## Using command line parameters

Command line parameters can also be used to configure the connection to the transaction manager.
Note that these can be used in conjunction with the other options given above,
in which case the command line parameters will override any others.

### Examples

=== "Unix IPC socket connection"

    Specify the path to the IPC socket file:

    !!! example "Example IPC connection"

        ```bash
        geth <other parameters> \
             --ptm.socket qdata/c1/tm.ipc
        ```

=== "HTTP connection"

    This should only be used for development purposes, due to a lack of security on the connection.
    For production environments, you should enable TLS on the connection, as described in the next section.

    Specify the http url for the connection to the Transaction Manager:

    !!! example "Example HTTP connection"

        ```bash
        geth <other parameters> \
             --ptm.url "http://127.0.0.1:9101"
        ```

=== "HTTP connection using TLS"

    This requires an https url, the tls mode to be "strict", plus relevant certificates:

    !!! example "Example TLS connection"

        ```bash
        geth <other parameters> \
             --ptm.url "https://127.0.0.1:9101" \
             --ptm.tls.mode "strict" \
             --ptm.tls.rootca "path/to/certfile.pem,dir/with/cert/files/" \
             --ptm.tls.clientcert "path/to/client.cert.pem" \
             --ptm.tls.clientkey "path/to/client.key.pem" \
        ```

### Full description of the command line parameters

`--ptm.socket path/to/ipc/file`

Path to the ipc file when using a unix domain socket for the private transaction manager connection.

`--ptm.url value`

URL when using http/https connection to private transaction manager.

`--ptm.timeout value`

Timeout (seconds) for communication over the private transaction manager connection. Zero value means timeout disabled (default = 5 seconds).

`--ptm.dialtimeout value`

Dial timeout (seconds) for the private transaction manager connection. Zero value means timeout disabled (default = 1 second).

`--ptm.http.idletimeout value`

Idle timeout (seconds) for the private transaction manager connection. Zero value means timeout disabled (default = 10 seconds).

`--ptm.http.writebuffersize value`

Size of the write buffer (bytes) for the private transaction manager connection. Zero value (default) uses `http.Transport` default.

`--ptm.http.readbuffersize value`

Size of the read buffer (bytes) for the private transaction manager connection. Zero value (default) uses `http.Transport` default.

`--ptm.tls.mode value`

If `off` then TLS is disabled (default). If `strict` then will use TLS for https connection to private transaction manager.

`--ptm.tls.rootca path/to/rootca_pem_file`

Path to file containing root CA certificate for TLS connection to private transaction manager. If this is not specified then uses host's certificates (default).

`--ptm.tls.clientcert path/to/client_cert_pem_file`

Path to file containing client certificate (or chain of certs) for TLS connection to private transaction manager. This is required if server is configured to use two-way authentication.

`--ptm.tls.clientkey path/to/client_key_pem_file`

Path to file containing client's private key for TLS connection to private transaction manager. This is required if server is configured to use two-way authentication.

`--ptm.tls.insecureskipverify`

Disable verification of server's TLS certificate on connection to private transaction manager.
