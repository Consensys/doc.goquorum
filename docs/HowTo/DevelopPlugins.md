---
description: develop GoQuorum Plugins
---

# Develop plugins

GoQuorum uses HashiCorp's [`go-plugin`](https://github.com/hashicorp/go-plugin) library to enable a [plugin-based
architecture](../Concepts/Plugins.md) using gRPC.

We recommend reading the [`go-plugin` gRPC examples](https://github.com/hashicorp/go-plugin/tree/master/examples/grpc).
Some advanced topics not available in the `go-plugin` documentation are covered in this page.

## Lifecycle

Each plugin is started as a separate process and communicates with the GoQuorum client host process via gRPC service
interfaces, over a mutual TLS connection on the local machine.
The implementation is inside `go-plugin` library.

Developing plugins in Go is simplest.
For [plugins written in other languages](#advanced-topics-for-non-go-plugins), plugin authors must understand the
following lifecycle:

1. `geth` looks for the plugin distribution file after reading the plugin definition from settings.
1. `geth` verifies the plugin distribution file integrity.
1. `geth` generates a self-signed certificate (client certificate).
1. `geth` spawns the plugin with the client certificate.
1. The plugin imports the client certificate and generates a self-signed server certificate for its RPC server.
1. The plugin includes the RPC server certificate in the handshake.
1. `geth` imports the plugin RPC server certificate.
1. `geth` and the plugin communicate via RPC over TLS using mutual TLS.

Each plugin must implement the [`PluginInitializer` gRPC service interface](https://github.com/ConsenSys/quorum-plugin-definitions/blob/master/init.proto).
After the plugin process starts and connection with the GoQuorum client is established,
GoQuorum invokes the `Init()` gRPC method to initialize the plugin with data from the
[plugin configuration file](Configure/Plugins.md).

## Distribution

### File format

A plugin distribution file must be a ZIP file.
The file name format is `<name>-<version>.zip`.
`<name>` and `<version>` must be the same as the values defined in the [`PluginDefinition` object](Configure/Plugins.md#plugindefinition)
in the configuration file.

### Metadata

A plugin metadata file `plugin-meta.json` must be included in the distribution ZIP file.
`plugin-meta.json` contains a valid JSON object with key value pairs.

The following key value pairs are required:

=== "Syntax"

    ```json
    {
        "name": string,
        "version": string,
        "entrypoint": string,
        "parameters": array(string),
        ...
    }
    ```

=== "Example"

    ```json
    {
        "name": "quorum-plugin-helloWorld",
        "version": "1.0.0",
        "entrypoint": "helloWorldPlugin"
    }
    ```

| Field        | Description                                                |
|:-------------|:-----------------------------------------------------------|
| `name`       | The name of the plugin.                                    |
| `version`    | The version of the plugin.                                 |
| `entrypoint` | The command to execute the plugin process.                 |
| `parameters` | The command parameters to be passed to the plugin process. |

## Advanced topics for non-Go plugins

View the [`go-plugin` GitHub](https://github.com/hashicorp/go-plugin/blob/master/docs/guide-plugin-write-non-go.md) for
a guide on developing non-Go plugins.

Some additional advanced topics are described here.

### Magic cookie

A magic cookie key and value are used as basic verification that a plugin is intended to be launched.
This is not a security measure, just a UX feature.

Set the magic cookie key and value as an environment variable while executing the plugin process:

```bash
QUORUM_PLUGIN_MAGIC_COOKIE="CB9F51969613126D93468868990F77A8470EB9177503C5A38D437FEFF7786E0941152E05C06A9A3313391059132A7F9CED86C0783FE63A8B38F01623C8257664"
```

The plugin and the GoQuorum client's magic cookies are compared.
If they are equal then the plugin is loaded.
If they aren't equal, the plugin should show human-friendly output.

### Mutual TLS authentication

The GoQuorum client requires each plugin to authenticate and secure its connection via mutual TLS.
The `PLUGIN_CLIENT_CERT` environment variable is populated with the GoQuorum client certificate (in PEM format).

Each plugin must include this certificate to its trusted certificate pool, generate a self-signed certificate, and
append the base64-encoded value of the certificate (in DER format) in the
[handshake](https://github.com/hashicorp/go-plugin/blob/master/docs/internals.md#handshake) message.

## Example

Follow the [`HelloWorld` plugin tutorial](../Tutorials/Use-Plugin.md) for an example.

## Plugin interface definitions

You can view the [gRPC definitions](https://github.com/ConsenSys/quorum-plugin-definitions) for the initialization
interface, `HelloWorld` plugin interface, [`account` plugin](../Reference/Plugins/Account.md) interface, and
[`security` plugin](../Reference/Plugins/Security.md) interface.

