# Multi-tenancy via Multiple Private States

In a typical network, each participant (tenant) uses its own GoQuorum and Tessera node. Tessera can
be configured to manage multiple key pairs which are owned by one tenant. This model is costly to
run and scale as more tenants join the network.

[Multi-tenancy via Multiple Private States] allows multiple tenants to use the same GoQuorum node, with each tenant having it's own private state(s). Tenants can perform all operations (create/read/write) on any contract in their private state and a single tenant can have access to multiple private states. Multi-tenancy allows for a similar user experience to a user running their own managed node.

The public state remains available publicly to all tenants and private states are logically separated.

```plantuml
skinparam shadowing false
skinparam monochrome true
skinparam nodesep 20
skinparam ranksep 20
skinparam database {
StereotypeFontSize 10
}
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
    database "<size:16><&lock-locked></size> Private State" << J Organization >> as privatestateJ {
    }
    database "<size:16><&lock-locked></size> Private State" << G Organization >> as privatestateG {
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
users within the departments. Each tenant operates on it's own private state. Each user in an organization owns one or more privacy manager key pairs that allows them to operate on their organization's private state. A network
operator administers entitlements and private state access for each organization using the Authorization Server.

[JSON RPC security](../../HowTo/Use/JSON-RPC-API-Security.md) features are used to manage a users access to a private state. The [Authentication Server setup] controls this access.

## Configuration changes

In order to run a multi-tenant node, the node must have the [configuration changes needed for MPS]

## Enable Multi-tenancy via MPS

Multi-tenancy requires [Tessera] version `20.10.3` or later and GoQuorum to be [MPS enabled].

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

!!! example

    If [quorum-security-plugin-enterprise](https://github.com/ConsenSys/quorum-security-plugin-enterprise) is used, `plugins.json`
    will look like the below

    ```json
    {
        "providers": {
            "security": {
                "name":"quorum-security-plugin-enterprise",
                "version":"0.1.1",
                "config": "/path/to/config.json"
            }
        }
    }
    ```
    
## Enterprise Authorization Server

To support Multi-tenancy, an Authorization Server will need to be configured. The Authorization Server has the ability to grant private state access to clients via a private state identifier.
View [Multi-tenancy via Multiple Private States] for more information on how to set up the Authorization server and configure a Multi-tenant network.

### Access Token Scope

The JSON RPC Security plugin enables the `geth` JSON RPC API server to be an OAuth2-compliant
resource server. A client must first obtain a pre-authenticated access token from an authorization
server, then present the access token (using an `Authorization` HTTP request header) when calling an
API. Calls to the quorum RPC API without an authenticated token are rejected.

The value of the scope encoded in an access token (in case of JWT), or introspection response
(in the case of the OAuth2 Token Introspection API) contains the [RPC scope](../../Reference/Plugins/security/For-Users.md#oauth2-scopes)
and tenant scope which has the following URL-based syntax:


Specific scope details here...

```text
    "psi://[PSI]?self.eoa=0x0&node.eoa=0x0"
```

In the syntax, `PSI` is the URL-encoded value of the PSI, which represents the private state the tenant has access to.

For example, for a client that has access to two private states `PS1` and `PS2`,
an authorization server operator would setup and grant the following scopes to the client:

```text
    psi://PS1?self.eoa=0x0&node.eoa
    psi://PS2?self.eoa=0x0&node.eoa
```

A client presenting an access token containing the above scopes has full access (read/write/create)
to private contracts on private states `PS1` and `PS2` using any self or node managed Ethereum Accounts.

<!--links-->
[Multi-tenancy via Multiple Private States]: ../../HowTo/Use/MultitenancyMPS.md
[configuration changes needed for MPS]: MultiplePrivateStates.md#Configuration-Changes
[MPS enabled]: MultiplePrivateStates.md#Enable-Multiple-Private-States
[Authentication Server setup]: #Enterprise-Authorization-Server
[security plugins documentation]: ../../Reference/Plugins/security/For-Users.md#configuration
[Tessera]: https://docs.tessera.consensys.net
