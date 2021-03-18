# Multi-tenancy via MPS

## Prerequisites

* Set `isMPS=true` in GoQuorum genesis.config
* Configure the [JSON RPC Security plugin](JSON-RPC-API-Security.md#configuration)
* Use [Tessera] version `20.10.3` or later and configure `residentGroups`
* Run GoQuorum with `--multitenancy` flag

## Network Topology

A network can consist of multi-tenant nodes and single-tenant nodes. One or more independent
authorization servers can be used to protect multi-tenant nodes, however one multi-tenant node can
only be protected by one authorization server.

## Sample Network Setup

This section outlines an example of how multi-tenancy can be set up. A network operator must
configure [scope values] for each user in an authorization server, for each tenant.
This example network contains 4 nodes.
Multi-tenant `Node1` is shared between tenant `J` and `G` (`isMPS=true`)
Standalone `Node2` is used by tenant `D` alone (`isMPS=false`)

!!! note
    A node consists of GoQuorum client and Tessera Private Transaction Manager.

    We name Privacy Manager key pairs for easy referencing, for example: `J_K1` or `G_K1`. In
    reality, their values are the pubic keys used in `privateFor` and `privateFrom` fields.
    

Tenants are assigned to multi-tenant nodes as follows:

* `J Organization` owns `J_K1` and `J_K2`, and it's tenancy is on `Node1`
* `G Organization` owns `G_K1` and `G_K2`, and it's tenancy is on `Node1`
* `D Organization` owns `D_K1`, and it's tenancy is on `Node2`.

In practice, `J Organization` and `G Organization` may decide to allocate keys to
their departments, therefore the security model could be as below:

* `J Organization` has:
    * `J Investment` has access to `J` tenancy using any self-managed Ethereum Accounts
    * `J Settlement` has access to `J` tenancy using node-managed Ethereum Account `J_ACC1` and a self-managed `Wallet1`
* `G Organization` has:
    * `G Investment` has access to `G` tenancy using any self-managed Ethereum Accounts
    * `G Settlement` has access to `G` tenancy using node-managed Ethereum Account `G_ACC1` and self-managed `Wallet2`

Each authorization server has its own configuration steps and client onboarding process.
A network operator's responsibility is to implement the above security model in the authorization
server by defining [custom scopes] and
granting them to target clients.

A custom scope representing __`J Investment`__ would be:

```text
psi://J?self.eoa=0x0
```

A custom scope representing __`G Settlement`__ would be:

```text
psi://G?node.eoa=G_ACC1&self.eoa=Wallet2
```

Clients must also be granted scopes which specify access to the JSON RPC APIs.

Refer to the [JSON RPC Security plugin](../../Reference/Plugins/security/For-Users.md#oauth2-scopes) for more information.

In summary, to reflect the above security model, typical scopes being granted to `J Investment`
would be the following:

```text
rpc://eth_*
psi://J?self.eoa=0x0
```

### Tessera Setup

In addition to configuring the Authorization Server, the Tessera config file must be updated to contain `residentGroups` for the multi-tenant nodes.

In the above setup, the `residentGroups` configuration of `Node1` would be:

``` json
"residentGroups": [
 {
   "name": "PS1",
   "members": ["J_K1", "J_K2"],
   "description": "Private state of J Organization"
 },
 {
   "name": "PS2",
   "members": ["G_K1", "G_K2"],
   "description": "Private State of G Organization"
 }
]
```

`Node2` does not need to add `residentGroups` to its Tessera config file because it has only one tenant, and therefore all of it's keys will be added to a default "private" group automatically.

During Tessera startup, `residentGroups` are validated to check that each key is part of a single resident group.
If a key is not configured to be a part of a resident group it is automatically added to the default "private" resident group.
Once a key is added to a resident group, it should remain in that group.

## Adding a new Tenant to Multi-tenant Node

* Network Admin executes Tessera keygen to generate the new key
* The Tessera config file must be updated to include the new key in a resident group.
* Tessera needs to be restarted to load the new key. When Tessera starts, if the new key was generated but not added to a resident group it will be put in the default "private" resident group.
* Updates to the Authorization Server should be made to provide the new Tenant access to the private state defined in the `residentGroups` configuration.

## Removing a Tenant from an Multi-tenant Node

It may be the case that a tenant on an Multi-tenant node wants to move to its own standalone node and should be removed from the Multi-tenant node. What happens here????

[scope values]: ../../Concepts/MultiplePrivateStates/Multitenancy.md#Access-Token-Scope
[custom scopes]: ../../Concepts/MultiplePrivateStates/Multitenancy.md#Access-Token-Scope
[Tessera]: https://docs.tessera.consensys.net