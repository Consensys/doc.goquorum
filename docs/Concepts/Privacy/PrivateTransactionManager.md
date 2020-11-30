# Private Transaction Manager

GoQuorum uses a Private Transaction Manager, [Tessera](https://docs.tessera.consensys.net), to implement
private transactions.

The Private Transaction Manager is a separate component that is concerned with the storing and distribution
of encrypted private transaction data between recipients of a private transaction.

The Private Transaction Manager has two distinct components:

* Transaction Manager
* Enclave

To enable private transactions, use the `PRIVATE_CONFIG` environment variable when starting a GoQuorum
node to provide the path to the Privacy Manager's `.ipc` socket. There are two ways to do this, which are described below.

## Direct IPC connection configuration

This is the normal method for specifying the IPC socket:

```bash
export PRIVATE_CONFIG=path/to/tm.ipc
```

## Using an IPC connection configuration file

Alternatively, a TOML configuration file can be used to specify the details of the IPC socket:

```bash
export PRIVATE_CONFIG=path/to/ipc-config-file.toml
```

Using this method allows the configuration of timeouts for the ipc socket. Here is an example of the TOML file:

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

Out of these timeouts, the only one that might require changing from default is `responseHeaderTimeout`,
which may need to be increased in the event of slow transaction manager responses.
