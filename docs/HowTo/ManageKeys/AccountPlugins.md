# account Plugins

`account` plugins can be used with GoQuorum or `clef` to provide additional account management.

We recommended reading the [Plugins overview](../../Concepts/Plugins/Plugins.md) first to learn how to use plugins.

## Using with GoQuorum & clef

=== "Quorum"

    ```shell
    geth --plugins file:///path/to/plugins.json ...
    ```

=== "clef"

    ```shell
    clef --plugins file:///path/to/plugins.json ...
    ```

Where the [plugins settings file](../Configure/Plugins.md), `plugins.json`, defines an `account` provider:

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

A limited API allows users to interact directly with `account` plugins:

!!! info
    GoQuorum must explicitly expose the API with `--rpcapi plugin@account` or `--wsapi plugin@account`

### plugin@account_newAccount

Create a plugin-managed account with a new key:

| Parameter | Description |
| --- | --- |
| `config` | Plugin-specific json configuration for creating an account.  See the plugin's documentation for more info on the json config required

### Example

=== "quorum"

    ```shell
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

=== "js console"

    ```js
    plugin_account.newAccount({<config>})
    ```

=== "clef"

    ```shell
    echo '
        {
            "jsonrpc":"2.0",
            "method":"plugin@account_newAccount",
            "params":[{<config>}],
            "id":1
        }
    ' | nc -U /path/to/clef.ipc
    ```

### plugin@account_importRawKey

Create a plugin-managed account from an existing private key:

!!! note
    Although this API can be used to move plugin-managed accounts between nodes, the plugin may provide a more preferable alternative.  See the plugin's documentation for more info.

| Parameter | Description |
| --- | --- |
| `rawkey` | Hex-encoded account private key (without 0x prefix)
| `config` | Plugin-specific json configuration for creating a new account.  See the plugin's documentation for more info on the json config required

#### Example

=== "quorum"

    ```shell
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

=== "js console"

    ```js
    plugin_account.importRawKey(<rawkey>, {<config>})
    ```

=== "clef"

    ```text
    not supported - use CLI instead
    ```

## CLI

A limited CLI allows users to interact directly with `account` plugins:

```shell
geth account plugin --help
```

!!! info
    Use the `--verbosity` flag to hide log output, e.g. `geth --verbosity 1 account plugin new ...`

### geth account plugin new

Create a plugin-managed account from an existing key:

| Parameter | Description |
| --- | --- |
| <span style="white-space:nowrap">`plugins.account.config`</span> | Plugin-specific configuration for creating an account.  Can be `file://` or inline-json. See the plugin's documentation for more info on the json config required.

=== "json file"

    ```shell
    geth account plugin new \
        --plugins file:///path/to/plugin-config.json \
        --plugins.account.config file:///path/to/new-acct-config.json
    ```

=== "inline json"

    ```shell
    geth account plugin new \
        --plugins file:///path/to/plugin-config.json \
        --plugins.account.config '{<json>}'
    ```

### geth account plugin import

Create a plugin-managed account from an existing private key:

| Parameter | Description |
| --- | --- |
| <span style="white-space:nowrap">`plugins.account.config`</span> | Plugin-specific configuration for creating an account.  Can be `file://` or inline-json. See the plugin's documentation for more info on the json config required
| `rawkey` | Path to file containing hex-encoded account private key (without 0x prefix) (e.g. `/path/to/raw.key`)

=== "json file"

    ```shell
    geth account plugin import \
        --plugins file:///path/to/plugin-config.json \
        --plugins.account.config file:///path/to/new-acct-config.json \
        /path/to/raw.key
    ```

=== "inline json"

    ```shell
    geth account plugin import \
        --plugins file:///path/to/plugin-config.json \
        --plugins.account.config '{<json>}'
        /path/to/raw.key
    ```

### geth account plugin list

List all plugin-managed accounts for a given config:

```shell
geth account plugin list \
    --plugins file:///path/to/plugin-config.json
```

## Developers
See [For Developers](../../Reference/Plugins/account/For-Developers.md).
