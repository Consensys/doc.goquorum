# Private Transaction Manager

A Private Transaction Manager is required to use private transactions in GoQuorum.

The Private Transaction Manager is a separate component that is concerned with the storing and distribution
of encrypted private transaction data between recipients of a private transaction.

To enable private transactions, use the `PRIVATE_CONFIG` environment variable when starting a GoQuorum
node to provide the node with the path to the Privacy Manager's `.ipc` socket, e.g.:

```shell
export PRIVATE_CONFIG=path/to/tm.ipc
``` 

The Private Transaction Manager has two components:

* Transaction Manager: ToDo - add link to Tessera and relevant page 
* Enclave: ToDo - add link to Tessera and relevant page  
