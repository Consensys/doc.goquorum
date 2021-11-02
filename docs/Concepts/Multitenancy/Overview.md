# Multi-tenancy via multiple private states

In a typical GoQuorum network, each participant (tenant) uses its own GoQuorum and Tessera node.
Tessera can be configured to manage multiple key pairs owned by one tenant.
This model is costly to run and scale as more tenants join the network.

[Use multi-tenancy via multiple private states](../../HowTo/Use/Multitenancy.md) to allow multiple tenants to use the
same GoQuorum node, with each tenant having its own private state(s).
Each tenant can perform all operations (create, read, and write) on any contract in its private state, and a single
tenant can have access to multiple private states.
Multi-tenancy enables a user experience similar to a user running their own managed node.

The public state remains publicly available to all tenants, and private states are logically separated.

![Multi-tenancy](../../images/Multi-tenancy.png)

In this example diagram, an organization represents a tenant with multiple departments, and users within the departments.
Each tenant operates on its own private state.
Each user in an organization owns one or more privacy manager key pairs that allows them to operate on their
organization's private state.
A network operator administers entitlements and private state access for each organization using the authorization server.

[JSON-RPC security](../../HowTo/Use/JSON-RPC-API-Security.md) features are used to manage a users access to a private state.
The [authentication server setup](#enterprise-authorization-server) controls this access.

## Configuration changes

In order to run a multi-tenant node, the node must have the [configuration changes needed for MPS].

## Enable multi-tenancy

Multi-tenancy requires [Tessera] version `21.4.0` or later and GoQuorum to be [MPS enabled].

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

## Enterprise authorization server

To support Multi-tenancy, an Authorization Server will need to be configured. The Authorization Server has the ability to grant private state access to clients via a private state identifier.
View [Multi-tenancy via Multiple Private States] for more information on how to set up the Authorization server and configure a Multi-tenant network.

### Access token scope

The JSON RPC Security plugin enables the `geth` JSON RPC API server to be an OAuth2-compliant
resource server. A client must first obtain a pre-authenticated access token from an authorization
server, then present the access token (using an `Authorization` HTTP request header) when calling an
API. Calls to the quorum RPC API without an authenticated token are rejected.

The value of the scope encoded in an access token (in case of JWT), or introspection response
(in the case of the OAuth2 Token Introspection API) contains the [RPC scope](../../Reference/Plugins/Security.md#oauth2-scopes)
and tenant scope which has the following URL-based syntax:

Specific scope details here…

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
[Multi-tenancy via Multiple Private States]: ../../HowTo/Use/Multitenancy.md
[configuration changes needed for MPS]: MultiplePrivateStates.md#configuration-changes
[MPS enabled]: MultiplePrivateStates.md#enable-multiple-private-states
[security plugins documentation]: ../../Reference/Plugins/Security.md#configuration
[Tessera]: https://docs.tessera.consensys.net
