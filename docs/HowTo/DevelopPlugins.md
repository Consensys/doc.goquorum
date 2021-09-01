---
description: develop GoQuorum Plugins
---

# Develop plugins

We leverage HashiCorp's [`go-plugin`](https://github.com/hashicorp/go-plugin) to enable our plugin-based architecture using gRPC.

We recommend reading the [`go-plugin` gRPC examples](https://github.com/hashicorp/go-plugin/tree/master/examples/grpc).
Some advanced topics which are not available in the `go-plugin` documentation will be covered here.

## Life cycle

A plugin is started as a separate process and communicates with the GoQuorum client host process via gRPC service interfaces.

This is done over a mutually-authenticated TLS connection on the local machine. The implementation is done inside `go-plugin`
library.

Usage is simpler when developing plugins in golang. For plugins written in other languages, plugin authors need to have
an understanding of the following lifecycle (see [Advanced topics for non-Go plugins](#advanced-topics-for-non-go-plugins) for more info):

1. `geth` looks for the plugin distribution file after reading the plugin definition from settings
1. `geth` verifies the plugin distribution file integrity
1. `geth` generates a self-signed certificate (aka client certificate)
1. `geth` spawns the plugin with the client certificate
1. The plugin imports the client certificate and generates a self-signed server certificate for its RPC server
1. The plugin includes the RPC server certificate in the handshake
1. `geth` imports the plugin RPC server certificate
1. `geth` and the plugin communicate via RPC over TLS using mutual TLS

Each plugin must implement the [`PluginInitializer`](#plugininitializer) gRPC service interface.

After the plugin process is successfully started and connection with the GoQuorum client is successfully established,

GoQuorum client invokes [`Init()`](#proto.PluginInitialization.Request) gRPC method in order to initialize the plugin with configuration data

read from the plugin definition's `config` field in [settings](Configure/Plugins.md) file.

## Distribution

### File format

Plugin distribution file must be a ZIP file. File name format is `<name>-<version>.zip`.
`<name>` and `<version>` must be the same as the values defined in the [`PluginDefinition` object](Configure/Plugins.md) in the settings file.

### Metadata

A plugin metadata file `plugin-meta.json` must be included in the distribution ZIP file.
`plugin-meta.json` contains a valid JSON object which has a flat structure with key value pairs.

Although the JSON object can include any desired information.
The following key value pairs must be present.

```json
{
    "name": string,
    "version": string,
    "entrypoint": string,
    "parameters": array(string),
    ...
}
```

| Fields       | Description                                                        |
|:-------------|:-------------------------------------------------------------------|
| `name`       | (**Required**) Name of the plugin                                    |
| `version`    | (**Required**) Version of the plugin                                 |
| `entrypoint` | (**Required**) Command to execute the plugin process                 |
| `parameters` | (**Optional**) Command parameters to be passed to the plugin process |

!!!example

    ```json
    {
      "name": "quorum-plugin-helloWorld",
      "version": "1.0.0",
      "entrypoint": "helloWorldPlugin"
    }
    ```

## Advanced topics for non-Go plugins

Writing non-Go plugins is documented in [`go-plugin` GitHub](https://github.com/hashicorp/go-plugin/blob/master/docs/guide-plugin-write-non-go.md).

Some additional advanced topics are described here.

### Magic Cookie

Magic Cookie key and value are used as a basic verification that a plugin is intended to be launched.
This is not a security measure, just a UX feature.

Magic Cookie key and value are injected as an environment variable while executing the plugin process.

```bash
QUORUM_PLUGIN_MAGIC_COOKIE="CB9F51969613126D93468868990F77A8470EB9177503C5A38D437FEFF7786E0941152E05C06A9A3313391059132A7F9CED86C0783FE63A8B38F01623C8257664"
```

The plugin and the GoQuorum client's magic cookies are compared.
If they are equal then the plugin is loaded.
If they are not equal, the plugin should show human-friendly output.

### Mutual TLS authentication

The GoQuorum client requires the plugin to authenticate and secure the connection via mutual TLS.
`PLUGIN_CLIENT_CERT` environment variable is populated with GoQuorum Client certificate (in PEM format).

A plugin would need to include this certificate to its trusted certificate pool, then
generate a self-signed certificate and append the base64-encoded value of the certificate (in DER format)
in the [handshake](https://github.com/hashicorp/go-plugin/blob/master/docs/internals.md#handshake) message.

{!./Reference/Plugins/init_interface.md!}

## Examples

Please visit [Overview](../Concepts/Plugins/Plugins.md#example-helloworld-plugin) page for a built-in HelloWorld plugin example.
