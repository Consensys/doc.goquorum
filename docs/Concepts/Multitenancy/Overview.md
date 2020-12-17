# Multitenancy

In a typical network, also known as a single-tenant network, each tenant uses its own GoQuorum
and Tessera node. Tessera may be configured to manage multiple key pairs which are solely owned by one tenant.
This model has been proven to be economically costly for service providers to run and scale as more tenants joining the network.

Multitenancy aims to be able to serve multiple tenants from a single GoQuorum node. We introduce access controls
in order to protect states owned by each tenant. Tenants will have `scope` to peform particular actions on particular
data and anything outside this `scope` should be inaccessible to the tenant. Operators who access GoQuorum node via IPC socket 
have access to all states and not restricted by any `scope`, however, accessing via HTTP/HTTPS/WS/WSS would require 
scoped access token like tenants.

!!! info "State Isolation"
    Only private states are logically isolated whereas public state is publicly available to all tenants.

In a classic scenario, an organization usually represents a tenant. Each organization is conformed 
to departments and each department of users. In the organization, each user owns one or more 
Privacy Manager key pairs authorized to transact with. A network operator administers authorization entitlements
for each organization using the Network Authorization Server. 

We leverage the [JSON RPC Security](../../../HowTo/Use/JSON-RPC-API-Security/)
feature in GoQuorum to reuse the authorization flow which allows pre-authenticated access token
containing authorized `scope` being passed to multitenancy checks. Please refer to [Access Token Scope](#access-token-scope) for 
more details.

```plantuml

```

In order to enable multitenancy support for a node:

* For GoQuorum, a command line flag `--multitenancy` must be provided and
the [JSON RPC Security plugin](../../HowTo/Use/JSON-RPC-API-Security/#configuration) must be configured.
  For example, starting a typical multitenant GoQuorum node would look like the below:
  ```
  geth <other parameters> \
      --multitenancy \
      --plugins file:///<path>/<to>/plugins.json
  ```
  whereas `plugins.json` is the [plugin settings file](../../HowTo/Configure/Plugins/) which contains JSON RPC Security plugin definition.
  Please refer to [this](../../HowTo/Configure/Plugins/#plugindefinition) on how to define a plugin
  and this on [how to configure](../../Reference/Plugins/security/For-Users/#configuration) JSON RPC Security plugin.
* For Tessera, use version `20.10.1` and above

## Access Token Scope

JSON RPC Security plugin enables `geth` JSON RPC API server to be an OAuth2-compliant resource server. 
A client must first obtain a pre-authenticated access token from an authorization server then 
presents the access token (via `Authorization` HTTP request header) when calling an API.

The value of the scope encoded in an access token (in case of JWT) or in an introspection response
(in case of OAuth2 Token Introspection API) contains [RPC scope](../../Reference/Plugins/security/For-Users/#oauth2-scopes)
and tenant scope which has the following URL-based syntax:

```
    "private://0x0/_/contracts?owned.eoa=0x0&from.tm=[tm-pubkey]"
```

in which:

* `tm-pubkey`: URL-encoded value of the Privacy Manager public key

For example, a client owns two Privacy Manager public keys `PUBKEY1` and `PUBKEY2`, 
an authorization server operator would setup and grant the following scopes to the client:

```
    private://0x0/_/contracts?owned.eoa=0x0&from.tm=PUBKEY1
    private://0x0/_/contracts?owned.eoa=0x0&from.tm=PUBKEY2
```

A client presenting an access token containing the above scopes has the full access (read/write/create)
to private contracts in which `PUBKEY1` and/or `PUBKEY2` are the participants.