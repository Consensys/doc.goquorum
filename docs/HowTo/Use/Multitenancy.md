# Multi-tenancy

## Prerequisites

* Supply the `--multitenancy` command line flag
* Configure the [JSON RPC Security plugin](JSON-RPC-API-Security.md#configuration)
* Use [Tessera] version `20.10.2` or later.

## Network Topology

A network can consist of multi-tenant nodes and single-tenant nodes. One or more independent
authorization servers can be used to protect multi-tenant nodes, however one multi-tenant node can
only be protected by one authorization server.

## Sample Network Setup

This section outlines an example of how multi-tenancy can be set up. A network operator must
configure [scope values] for each user in an authorization server, for each tenant.
This example network contains 4 nodes, 2 of which are multi-tenant nodes. The multi-tenant nodes are
`Node1` and `Node2`.

!!! note
    A node consists of GoQuorum client and Tessera Private Transaction Manager.

    We name Privacy Manager key pairs for easy referencing, for example: `J_K1` or `G_K1`. In
    reality, their values are the pubic keys used in `privateFor` and `privateFrom` fields.

Privacy Manager key pairs are allocated as follows:

* `Node1` manages `J_K1`, `J_K2`, `G_K1`, and `G_K3`
* `Node2` manages `G_K2` and `D_K1`.

Tenants are assigned to multi-tenant nodes as follows:

* `J Organization` owns `J_K1` and `J_K2`, and it's tenancy is on `Node1`
* `G Organization` owns `G_K1`, `G_K2`, and `G_K3`, and its tenancy is on `Node1` and `Node2`
* `D Organization` owns `D_K1`, and its tenancy is on `Node2`.

In practice, `J Organization`, `G Organization` and `D Organization` may decide to allocate keys to
their departments, therefore the security model could be as below:

* `J Organization` has:
    * `J Investment` owning `J_K1`
    * `J Settlement` owning `J_K2`
    * `J Audit` having READ access to contracts in which `J_K1` and `J_K2` are participants
* `G Organization` has:
    * `G Investment` owning `G_K1`
    * `G Settlement` owning `G_K2`
    * `G Research` owning `G_K3`
    * `G Audit` having READ access to contracts in which `G_K1`, `G_K2` and `G_K3` are participants
* `D Organization` has:
    * `D Investment` owning `D_K1`

Each authorization server has its own configuration steps and client onboarding process.
A network operator's responsibility is to implement the above security model in the authorization
server by defining [custom scopes](../../Concepts/Multitenancy/Overview.md#access-token-scope) and
granting them to target clients.

A custom scope representing __`J Investment` owning `J_K1`__,  
where `J_K1=8SjRHlUBe4hAmTk3KDeJ96RhN+s10xRrHDrxEi1O5W0=`  
would be:

```text
private://0x0/_/contracts?owned.eoa=0x0&from.tm=8SjRHlUBe4hAmTk3KDeJ96RhN%2bs10xRrHDrxEi1O5W0%3d
```

Custom scopes representing __`J Audit` having READ access to contracts in which `J_K1` and `J_K2` are participants__,  
where `J_K1=8SjRHlUBe4hAmTk3KDeJ96RhN+s10xRrHDrxEi1O5W0=`  
and `J_K2=2T7xkjblN568N1QmPeElTjoeoNT4tkWYOJYxSMDO5i0=`,  
would be:

```text
private://0x0/read/contracts?owned.eoa=0x0&from.tm=8SjRHlUBe4hAmTk3KDeJ96RhN%2bs10xRrHDrxEi1O5W0%3d&from.tm=2T7xkjblN568N1QmPeElTjoeoNT4tkWYOJYxSMDO5i0%3d
```

!!! important
    Clients must also be granted scopes which specify access to the JSON RPC APIs.

    Refer to the [JSON RPC Security plugin](../../Reference/Plugins/security/For-Users.md#oauth2-scopes)
    for more information.

In summary, to reflect the above security model, typical scopes being granted to `J Investment`
would be the following:

```text
rpc://eth_*
private://0x0/_/contracts?owned.eoa=0x0&from.tm=8SjRHlUBe4hAmTk3KDeJ96RhN%2bs10xRrHDrxEi1O5W0%3d
```

## Supported JSON RPC APIs

!!! important
    The `privateFrom` field is mandatory when multi-tenancy is enabled

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

It's important for the network operator to configure the authorization server to ensure the
authorization model is reflected accurately.

!!! info
    GraphQL APIs and other APIs will be supported in the future.

## Migration Guides

### GoQuorum

Multi-tenancy introduces new improvements to how GoQuorum stores data so it can be used to protect
tenant states. This requires re-syncing a node to be multi-tenant.

### Tessera

Tenants own one or more Privacy Manager key pairs. Public keys are used to address private transactions.
Please refer to [Tessera keys configuration documentation](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/Keys/)
for more information about how Tessera manages multiple key pairs.

<!--links-->
[scope values]: ../../Concepts/Multitenancy/Overview.md#access-token-scope
[Tessera]: https://docs.tessera.consensys.net/en/stable/
