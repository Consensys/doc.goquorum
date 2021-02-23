# Multi-tenancy

In a typical network, each participant (tenant) uses its own GoQuorum and Tessera node. Tessera can
be configured to manage multiple key pairs which are owned by one tenant. This model is costly to
run and scale as more tenants join the network.

[Multi-tenancy] allows multiple tenants to use the same GoQuorum node, with access controls ensuring
isolation of tenant data. Tenants can only perform actions on data within their [scope]. Operators
who access the GoQuorum node using an IPC socket have access to all states, and are not restricted
by any [scope]. Accessing a node using HTTP/HTTPS/WS/WSS requires [scoped access tokens].

!!! info "State Isolation"
    Only private states are logically isolated whereas the public state is publicly available to all
    tenants.

```plantuml
skinparam shadowing false
skinparam monochrome true
skinparam nodesep 20
skinparam ranksep 20
scale 1.0

left to right direction

rectangle "<&people> J Organization" as ta
rectangle "<&people> G Organization" as tb

node "GoQuorum" as goquorum {
  rectangle "<size:16><&shield></size>\n\nA\n\nP\n\nI\n" as api
  rectangle "<size:16><&shield></size>\n\nE\n\nV\n\nM\n" as evm
  together {
    database "Public State" as publicstate {
    }
    database "<size:16><&lock-locked></size> Private State" as privatestate {
    }
  }
}

api -[hidden]- evm
evm -[hidden]- publicstate

rectangle "<b>Tessera</b>\n\n<&key> J Organization\n<&key> G Organization" as tessera

rectangle "<size:18><&cog></size> Authorization Server" as authServer


ta -- api: <&document> JSON RPC
tb -- api: <&document> JSON RPC

authServer -- ta
authServer -- tb

goquorum -- tessera
```

In this scenario, an organization represents a tenant with multiple departments, and
users within the departments. Each user owns one or more privacy manager key pairs. A network
operator administers entitlements for each organization using the Authorization Server.

[JSON RPC security](../../HowTo/Use/JSON-RPC-API-Security.md) features are used to manage the
authorization flow in which multi-tenancy checks are performed on [pre-authenticated access
tokens with the authorized scope].

## Enable multi-tenancy

!!! important

    Multi-tenancy requires [Tessera] version `20.10.2` or later.

To enable multi-tenancy, configure the [JSON RPC Security plugin](../../HowTo/Use/JSON-RPC-API-Security.md#configuration)
and start GoQuorum with the `--multitenancy` command line option:

```shell
geth <other parameters> \
    --multitenancy \
    --plugins file:///<path>/<to>/plugins.json
```

In the command, `plugins.json` is the [plugin settings file](../../HowTo/Configure/Plugins.md) that
contains the [JSON RPC Security plugin definition](../../HowTo/Configure/Plugins.md#plugindefinition).
View the [security plugins documentation] for more information about how to configure the JSON RPC
Security plugin.

## Access Token Scope

The JSON RPC Security plugin enables the `geth` JSON RPC API server to be an OAuth2-compliant
resource server. A client must first obtain a pre-authenticated access token from an authorization
server, then present the access token (using an `Authorization` HTTP request header) when calling an
API.

The value of the scope encoded in an access token (in case of JWT), or introspection response
(in the case of the OAuth2 Token Introspection API) contains the [RPC scope](../../Reference/Plugins/security/For-Users.md#oauth2-scopes)
and tenant scope which has the following URL-based syntax:

```text
    "private://0x0/_/contracts?owned.eoa=0x0&from.tm=[tm-pubkey]"
```

In the syntax, `tm-pubkey` is the URL-encoded value of the Privacy Manager public key.

For example, for a client that owns two Privacy Manager public keys `PUBKEY1` and `PUBKEY2`,
an authorization server operator would setup and grant the following scopes to the client:

```text
    private://0x0/_/contracts?owned.eoa=0x0&from.tm=PUBKEY1
    private://0x0/_/contracts?owned.eoa=0x0&from.tm=PUBKEY2
```

A client presenting an access token containing the above scopes has full access (read/write/create)
to private contracts in which `PUBKEY1` and `PUBKEY2` are participants.

<!--links-->
[Multi-tenancy]: ../../HowTo/Use/Multitenancy.md
[scope]: #access-token-scope
[scoped access tokens]: #access-token-scope
[pre-authenticated access tokens with the authorized scope]: #access-token-scope
[security plugins documentation]: ../../Reference/Plugins/security/For-Users.md#configuration
[Tessera]: https://docs.tessera.consensys.net/en/stable/
