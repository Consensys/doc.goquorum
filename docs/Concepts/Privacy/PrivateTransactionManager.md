# Private Transaction Manager

GoQuorum uses a Private Transaction Manager, [Tessera](https://docs.tessera.consensys.net), to implement
private transactions.

The Private Transaction Manager is a separate component that is concerned with the storing and distribution
of encrypted private transaction data between recipients of a private transaction.

To enable private transactions, use the `PRIVATE_CONFIG` environment variable when starting a GoQuorum
node to provide the node with the path to the Privacy Manager's `.ipc` socket, e.g.:

```bash
export PRIVATE_CONFIG=path/to/tm.ipc
```

!!! note "Use of a configuration file to describe the IPC connection instead"

    The `PRIVATE_CONFIG` environment variable can be optionally set to the path of a TOML configuration file instead.

    ```bash
    export PRIVATE_CONFIG=path/to/ipc-config-file.toml
    ```

    Using this option allows the configuration of timeouts for the ipc socket. Here is an example of the TOML file:

    ```toml
    socket = "tm.ipc"
    workdir = "path/to/ipc/file"
    dialTimeout = 1
    requestTimeout = 5
    responseHeaderTimeout = 5
    ```

    Where:

    - optional dialTimeout is timeout when connecting to socket (seconds), default = 1 second
    - optional requestTimeout is timeout for the write to the socket (seconds), default = 5 seconds
    - optional responseHeaderTimeout is timeout for reading a response from the socket (seconds), default = 5 seconds

    It is unlikely that any of these timeouts will require changing, other than `responseHeaderTimeout`,
    which may require increasing in the event of slow transaction manager responses.

The Private Transaction Manager has two components:

* Transaction Manager
* Enclave
