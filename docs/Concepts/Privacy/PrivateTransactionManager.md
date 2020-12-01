# Private Transaction Manager

GoQuorum uses a Private Transaction Manager, [Tessera](https://docs.tessera.consensys.net), to implement
private transactions.

The Private Transaction Manager is a separate component that is concerned with the storing and distribution
of encrypted private transaction data between recipients of a private transaction.

The Private Transaction Manager has two distinct components:

* Transaction Manager
* Enclave

Enable private transactions with the `PRIVATE_CONFIG` environment variable when starting a GoQuorum
node.

Use the `PRIVATE_CONFIG` environment variable either with a direct path to the Privacy Manager's `.ipc` socket
or with a path to a TOML IPC configuration file as explained in the following sections.

## Direct IPC connection configuration

This is the basic method for specifying the IPC socket:

```bash
export PRIVATE_CONFIG=path/to/tm.ipc
```

## Using an IPC connection configuration file

Use a TOML IPC configuration file to specify more options for the IPC socket connection:

```bash
export PRIVATE_CONFIG=path/to/ipc-config-file.toml
```

Configuration file provides the ability to configure timeouts for the ipc socket.

!!! example "Example ipc-config-file.toml"

    ```toml
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
