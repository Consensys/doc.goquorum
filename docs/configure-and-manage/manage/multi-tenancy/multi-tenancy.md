# Using multi-tenancy via multiple private states

Use [multi-tenancy via multiple private states (MPS)](../../../concepts/multi-tenancy.md) to allow multiple tenants to
use the same GoQuorum node, with each tenant having its own private state(s).

## Configure multi-tenancy via multiple private states

### Prerequisites

- Tesera version `21.4.0` or later installed
- GoQuorum version `21.4.2` or later installed

!!! important

    If running an earlier GoQuorum or Tessera version, upgrade your existing nodes to enable MPS and multi-tenancy using
    the [migration guide](migration.md).

### Steps

1. Set `isMPS` to `true` in the `config` item of the [GoQuorum genesis file](../../configure/genesis-file/genesis-options.md).

    !!! example "MPS configuration"

        ```json
        {
          "config": {
            ...
            "isMPS": true
          },
          ...
        }
        ```

    !!! note

        There can be a mix of MPS-enabled and non-MPS-enabled nodes in a network.

1. Configure the [JSON-RPC security plugin](../json-rpc-api-security.md#configuration).
   This requires configuring an authorization server.
   View [examples of configuring the plugin to work with different OAuth2 authorization servers](https://github.com/ConsenSys/quorum-security-plugin-enterprise/tree/master/examples).

1. Set [`enableMultiplePrivateStates`]({{ extra.othersites.tessera }}/HowTo/Configure/Multiple-private-state/#multiple-private-states)
   to `true` in the Tessera configuration file.
   The default is `false`.

    !!! important

        GoQuorum can't start if `isMPS` is `true` in the GoQuorum configuration and `enableMultiplePrivateStates` is
        `false` in the Tessera configuration.

        GoQuorum runs as a non-MPS-enabled node if `isMPS` is `false` and `enableMultiplePrivateStates` is `true`.

1. [Configure `residentGroups`]({{ extra.othersites.tessera }}/HowTo/Configure/Multiple-private-state/#resident-groups)
   in the Tessera configuration file.

1. Run GoQuorum with the [`--multitenancy`](../../../reference/cli-syntax.md#multitenancy) command line option.

    ```bash
    geth [OPTIONS] --multitenancy --plugins file:///<path>/<to>/plugins.json
    ```

    In the command, `plugins.json` is the [plugin settings file](../../../develop/develop-plugins.md) that
    contains the [JSON-RPC Security plugin definition](../../../develop/develop-plugins.md#plugindefinition).

    For example, if you use [quorum-security-plugin-enterprise](https://github.com/ConsenSys/quorum-security-plugin-enterprise),
    `plugins.json` looks like the following:

    !!! example "plugins.json"

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

## Configure custom scopes

A network operator must configure [scope values](../../../concepts/multi-tenancy.md#access-token-scope) for each user in
an authorization server, for each tenant.

### Example

This example network contains four nodes.
Multi-tenant `Node1` is shared between tenant `J` and `G` (`isMPS=true`) and single-tenant `Node2` is used by tenant `D`
alone (`isMPS=false`).

!!! note

    A node consists of a GoQuorum client and Tessera private transaction manager.
    We name privacy manager key pairs for easy referencing, for example: `J_K1` or `G_K1`.
    In reality, their values are the pubic keys used in the `privateFor` and `privateFrom` fields.

Tenants are assigned to multi-tenant nodes as follows:

- `J Organization` owns `J_K1` and `J_K2`, and its tenancy is on `Node1`.
- `G Organization` owns `G_K1` and `G_K2`, and its tenancy is on `Node1`.
- `D Organization` owns `D_K1`, and its tenancy is on `Node2`.

In practice, `J Organization` and `G Organization` may decide to allocate keys to their departments, therefore the
security model may be as follows:

- `J Organization`:
    - `J Investment` has access to `J` tenancy using any self-managed Ethereum accounts.
    - `J Settlement` has access to `J` tenancy using node-managed Ethereum account `J_ACC1` and a self-managed `Wallet1`.
- `G Organization`:
    - `G Investment` has access to `G` tenancy using any self-managed Ethereum accounts.
    - `G Settlement` has access to `G` tenancy using node-managed Ethereum account `G_ACC1` and self-managed `Wallet2`.

Each authorization server has its own configuration steps and client onboarding process.
A network operator's responsibility is to implement this security model in the authorization server by defining
[custom scopes](../../../concepts/multi-tenancy.md#access-token-scope) and granting them to target clients.

A custom scope representing `J Investment` is:

```text
psi://J?self.eoa=0x0
```

A custom scope representing `G Settlement` is:

```text
psi://G?node.eoa=G_ACC1&self.eoa=Wallet2
```

Clients must also be granted scopes which specify access to the JSON-RPC APIs:

```text
rpc://eth_*
```

Refer to the [JSON-RPC security plugi documentation](../../../reference/plugins/security.md#oauth2-scopes) for more information.

## Add a new tenant to multi-tenant node

Use the following steps to add a new tenant to a multi-tenant node:

1. The network administrator executes Tessera keygen to generate a new key.

1. Update the Tessera configuration file to include the new key in a [resident group]({{ extra.othersites.tessera }}/HowTo/Configure/Multiple-private-state/#resident-groups).

1. Restart Tessera to load the new key.
   Startup fails if the new key is generated but not added to a resident group.

1. Make updates to the [authorization server](#configure-custom-scopes) to provide the new tenant access to the private
   state defined in the resident groups configuration.

## API methods

Use the [`eth_getMPS`](../../../reference/api-methods.md#eth_getpsi) JSON-RPC API method to get the private state the
user is operating on.
