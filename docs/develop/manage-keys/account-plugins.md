---
title: Use account plugins
description: Use account plugins
sidebar_position: 2
---

# `account` plugins

You can use `account` [plugins](../../concepts/plugins.md) with GoQuorum or `clef` to provide additional account management.

See the [`account` plugin reference](../../reference/plugins/account.md) for more information.

## Available account plugins

| Name | Version | Description |
| --- | --- | --- |
| [`hashicorp-vault`](https://www.github.com/ConsenSys/quorum-account-plugin-hashicorp-vault) | `0.0.1` | Enables storage of GoQuorum account keys in a HashiCorp Vault KV v2 engine. Written in Go. |

## Using GoQuorum and `clef`

Run an `account` plugin using GoQuorum or `clef`:

<!--tabs-->

# GoQuorum

```bash
geth --plugins file:///path/to/plugins.json ...
```

# clef

```bash
clef --plugins file:///path/to/plugins.json ...
```

<!--/tabs-->

`plugins.json` is the [plugins configuration file](../develop-plugins.md) that defines an `account` provider:

```json
{
  "providers": {
    "account": {
      "name": "quorum-account-plugin-<NAME>",
      "version": "<VERSION>",
      "config": "file:///path/to/plugin.json"
    }
  }
}
```

## RPC API

A limited API allows users to interact directly with `account` plugins.

:::caution

GoQuorum must expose the API using the `--http.api plugin@account` or `--ws.api plugin@account` command line options.

:::

### `plugin@account_newAccount`

Creates a plugin-managed account with a new key.

#### Parameters

`config`: _object_ - Plugin-specific JSON configuration for creating an account. See the plugin's documentation for more information on the JSON configuration required.

:::tip Example

<!--tabs-->

# GoQuorum

```bash
curl -X POST \
    -H "Content-Type:application/json" \
    -d '
        {
            "jsonrpc":"2.0",
            "method":"plugin@account_newAccount",
            "params":[{<config>}],
            "id":1
        }' \
    http://localhost:22000
```

# JS console

```js
plugin_account.newAccount({<config>})
```

# clef

```bash
echo '
    {
        "jsonrpc":"2.0",
        "method":"plugin@account_newAccount",
        "params":[{<config>}],
        "id":1
    }
' | nc -U /path/to/clef.ipc
```

<!--tabs-->

:::

### `plugin@account_importRawKey`

Creates a plugin-managed account from an existing private key.

:::note

Although you can use this API to move plugin-managed accounts between nodes, the plugin may provide a preferable alternative. See the plugin's documentation for more information.

:::

#### Parameters

- `rawkey`: _string_ - Hex-encoded account private key (without the `0x` prefix).
- `config`: _object_ - Plugin-specific JSON configuration for creating a new account. See the plugin's documentation for more information on the JSON configuration required.

:::tip Example

<!--tabs-->

# GoQuorum

```bash
curl -X POST \
    -H "Content-Type:application/json" \
    -d '
        {
            "jsonrpc":"2.0",
            "method":"plugin@account_importRawKey",
            "params":["<rawkey>", {<config>}],
            "id":1
        }' \
    http://localhost:22000
```

# JS console

```js
plugin_account.importRawKey(<rawkey>, {<config>})
```

# clef

Not supported, use CLI instead

<!--/tabs-->

:::

## Command line interface

A limited command line interface allows users to interact directly with `account` plugins. Run the following command to view all `geth account plugin` subcommands and options:

```bash
geth account plugin --help
```

:::info

Use the `--verbosity` option to hide log output. For example, `geth --verbosity 1 account plugin new ...`.

:::

### `geth account plugin new`

Creates a plugin-managed account from an existing key.

#### Parameters

`plugins.account.config`: Plugin-specific configuration for creating an account. The value can be `file://...` or inline JSON. See the plugin's documentation for more information on the JSON configuration required.

<!--tabs-->

# JSON file

```bash
geth account plugin new \
    --plugins file:///path/to/plugin-config.json \
    --plugins.account.config file:///path/to/new-acct-config.json
```

# inline JSON

```bash
geth account plugin new \
    --plugins file:///path/to/plugin-config.json \
    --plugins.account.config '{<json>}'
```

<!--/tabs-->

### `geth account plugin import`

Creates a plugin-managed account from an existing private key.

#### Parameters

- `plugins.account.config`: Plugin-specific configuration for creating an account. The value can be `file://...` or inline JSON. See the plugin's documentation for more information on the JSON configuration required.
- `rawkey`: Path to the file containing a hex-encoded account private key (without the `0x` prefix) (for example `/path/to/raw.key`).

<!--tabs-->

# JSON file

```bash
geth account plugin import \
    --plugins file:///path/to/plugin-config.json \
    --plugins.account.config file:///path/to/new-acct-config.json \
    /path/to/raw.key
```

# inline JSON

```bash
geth account plugin import \
    --plugins file:///path/to/plugin-config.json \
    --plugins.account.config '{<json>}'
    /path/to/raw.key
```

<!--/tabs-->

### `geth account plugin list`

Lists all the plugin-managed accounts for a given configuration.

```bash
geth account plugin list \
    --plugins file:///path/to/plugin-config.json
```
