# Multitenancy

## Pre-requisites

* Supply `--multitenancy` command line flag to GoQuorum
* Configure [JSON RPC Security plugin](../../HowTo/Use/JSON-RPC-API-Security/#configuration) for GoQuorum
* Use Tessera version `20.10.1` and above

## Network Topology

A network can consist of multitenant nodes and single-tenant nodes.
More than one authorization servers can be used in the network.

## Typical Use Case

`J Organization`
    * `J Investment`
    * `J Settlemment`
    * `J Audit`
`G Organization`
    * `G Investment`
    * `G Settlemment`
    * `G Research`
    * `G Audit`
`D Organization`
    * `D Investment`

## Supported JSON RPC APIs

!!! important
    `privateFrom` field is mandatory when multitenancy is enabled

APIs that are used to access states are required to be protected. Those are:

* `read` APIs:
    * `eth_getTransactionReceipt`
    * `eth_getLogs`
    * `eth_getFilterLogs`
    * `eth_call`
    * `quorumExtension_getExtensionStatus`
    * `quorumExtension_activeExtensionContracts`
* `write` APIs:
    * `eth_sendTransaction`
    * `eth_sendRawPrivateTransaction`
    * `quorumExtension_extendContract`
    * `quorumExtension_approveExtension`
    * `quorumExtension_cancelExtension`

It's important for the network operator to configure the authorization server
to make sure the authorization model is reflected accurately.

!!! info
    graphql API and other APIs will be supported in the future.

## Migration Guides

### GoQuorum

### Tessera
