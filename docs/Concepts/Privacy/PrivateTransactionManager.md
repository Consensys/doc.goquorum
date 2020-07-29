# Private Transaction Manager

GoQuorum uses a Private Transaction Manager, [Tessera](https://docs.tessera.consensys.net), to implement
private transactions. 

The Private Transaction Manager is a separate component that is concerned with the storing and distribution
of encrypted private transaction data between recipients of a private transaction.

To enable private transactions, use the `PRIVATE_CONFIG` environment variable when starting a GoQuorum
node to provide the node with the path to the Privacy Manager's `.ipc` socket, e.g.:

```shell
export PRIVATE_CONFIG=path/to/tm.ipc
``` 

The Private Transaction Manager has two components:

* Transaction Manager
* Enclave
