---
description: develop GoQuorum Plugins
---

# Develop plugins

GoQuorum uses HashiCorp's [`go-plugin`](https://github.com/hashicorp/go-plugin) library to enable a [plugin-based
architecture](../Concepts/Plugins.md) using gRPC.

We recommend reading the [`go-plugin` gRPC examples](https://github.com/hashicorp/go-plugin/tree/master/examples/grpc).
Some advanced topics not available in the `go-plugin` documentation are covered in this page.

## Lifecycle

Each plugin starts as a separate process and communicates with the GoQuorum client host process via the
gRPC service interfaces, over a mutual TLS connection on the local machine.
The implementation is inside the `go-plugin` library.

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
1. `geth` communicates with the plugin via RPC over TLS, using mutual TLS.

Each plugin must implement the [`PluginInitializer` gRPC service interface](https://github.com/ConsenSys/quorum-plugin-definitions/blob/master/init.proto).
After the plugin process starts and establishes a connection with the GoQuorum client,
GoQuorum invokes the `Init()` gRPC method to initialize the plugin with data from the
plugin configuration file, detailed below.

## Configure plugins

GoQuorum can load [plugins](../Concepts/Plugins.md) from:

- A JSON file specified using the [`--plugins`](../Reference/CLI-Syntax.md#plugins) command line option.
- An Ethereum TOML configuration file specified using the [`--config`](https://geth.ethereum.org/docs/interface/command-line-options)
  command line option.

### Configuration files

You can specify the plugin configuration file with the following content.

=== "JSON file"

    ```json
    {
      "baseDir": string,
      "central": object(PluginCentralConfiguration),
      "providers": {
         <string>: object(PluginDefinition)
      }
    }
    ```

=== "TOML file"

    ```toml
    [Node.Plugins]
        BaseDir = string

        [Node.Plugins.Central]
            .. = .. from object(PluginCentralConfiguration)

        [[Node.Plugins.Providers]]
            [[Node.Plugins.Providers.<string>]]
            .. = .. from object(PluginDefinition)
    ```

| Field      | Description                                                                                                             |
|:-----------|:------------------------------------------------------------------------------------------------------------------------|
| `baseDir`  | The local directory from where GoQuorum reads plugins. The default is `<datadir>/plugins`. To read from an arbitrary environment variable, for example `MY_BASE_DIR`, provide the value `env://MY_BASE_DIR`. |
| `central`  | A configuration of the remote [Plugin Central](#plugincentralconfiguration).                                            |
| `providers`| The supported plugin interfaces mapped to their respective [plugin provider definitions](#plugindefinition).            |
| `<string>` | The plugin interface, for example `helloworld`.                                                                         |

#### `PluginCentralConfiguration`

[Plugin integrity verification](../Concepts/Plugins.md#plugin-integrity-verification) uses the GoQuorum Plugin
Central Server by default.
You can modify this section to configure your own local Plugin Central for plugin integrity verification.

=== "JSON file"

    ```json
    {
      "central": {
        {
          "baseURL": string,
          "certFingerprint": string,
          "publicKeyURI": string,
          "insecureSkipTLSVerify": bool,
          "pluginDistPathTemplate": string,
          "pluginSigPathTemplate": string
        }
      },
      ...
    }
    ```

=== "TOML file"

    ```toml
    ...
            [Node.Plugins.Central]
            BaseURL = string
            CertFingerPrint = string
            PublicKeyURI = string
            InsecureSkipTLSVerify = bool
            PluginDistPathTemplate = string
            PluginSigPathTemplate = string
    ...
    ```

| Field                    | Description                                                                    |
|:-------------------------|:-------------------------------------------------------------------------------|
| `baseURL`                | The remote plugin central URL. For example, `https://plugins.mycorp.com`.      |
| `certFingerprint`        | The HTTP server public key fingerprint, in hex, used for certificate pinning.  |
| `publicKeyURI`           | The path to the PGP public key used for signature verification.                |
| `insecureSkipTLSVerify`  | If true, GoQuorum doesn't verify the server's certificate chain and host name. |
| `pluginDistPathTemplate` | The path template to the plugin distribution file. The value is a Go text template. The variables are \{\{.Name\}\}, \{\{.Version\}\}, \{\{.OS\}\}, and \{\{.Arch\}\}.     |
| `pluginSigPathTemplate`  | The path template to the plugin sha256 signature file. The value is a Go text template. The variables are \{\{.Name\}\}, \{\{.Version\}\}, \{\{.OS\}\}, and \{\{.Arch\}\}. |

#### `PluginDefinition`

You can define each supported plugin and its configuration in this section.

=== "JSON file"

    ```json
    {
      "providers": {
        <string>: {
          "name": string,
          "version": string,
          "config": file/string/array/object
        },
        ...
      },
      ...
    }
    ```

=== "TOML file"

    ```toml
    ...
        [[Node.Plugins.Providers]]
            [[Node.Plugins.Providers.<string>]]
            Name = string
            Version = string
            Config = file/string/array/object
        ...
    ...
    ```

| Field     | Description                |
|:----------|:---------------------------|
| `name`    | The name of the plugin.    |
| `version` | The version of the plugin. |
| `config`  | The JSON configuration. The value can be: <ul><li>One of the following URI schemes:<ul><li>The path to the plugin configuration file. For example, `file:///opt/plugin.cfg`.</li><li>The configuration as an environment variable. For example, `env://MY_CONFIG_JSON`. <br/>To indicate the value is a file location, append `?type=file`. For example, `env://MY_CONFIG_FILE?type=file`.</li></ul><li>An arbitrary JSON string.</li><li>A valid JSON array. For example, `["1", "2", "3"]`.</li><li>A valid JSON object. For example, `{"foo" : "bar"}`.</li></ul> |

## Distribute plugins

#### File format

A plugin distribution file must be a ZIP file.
The file name format is `<name>-<version>.zip`.
`<name>` and `<version>` must be the same as the values defined in the [`PluginDefinition` object](#plugindefinition)
in the configuration file.

#### Metadata

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

### Example plugin

Follow the [`HelloWorld` plugin tutorial](../Tutorials/Use-Plugin.md) for an example.

### Plugin interface definitions

You can view the [gRPC definitions](https://github.com/ConsenSys/quorum-plugin-definitions) for the initialization
interface, `HelloWorld` plugin interface, [`account` plugin](../Reference/Plugins/Account.md) interface, and
[`security` plugin](../Reference/Plugins/Security.md) interface.

## Advanced topics for non-Go plugins

View the [`go-plugin` GitHub](https://github.com/hashicorp/go-plugin/blob/master/docs/guide-plugin-write-non-go.md) for
a guide on developing non-Go plugins.

Some additional advanced topics are described here.

#### Magic cookie

A magic cookie key and value are used as basic verification that a plugin is intended to be launched.
This is a UX feature, not a security measure.

Set the magic cookie key and value as an environment variable while executing the plugin process:

```bash
QUORUM_PLUGIN_MAGIC_COOKIE="CB9F51969613126D93468868990F77A8470EB9177503C5A38D437FEFF7786E0941152E05C06A9A3313391059132A7F9CED86C0783FE63A8B38F01623C8257664"
```

The plugin and the GoQuorum client's magic cookies are compared.
If they are equal then the plugin is loaded.
If they aren't equal, the plugin should show human-friendly output.

#### Mutual TLS authentication

The GoQuorum client requires each plugin to authenticate and secure its connection via mutual TLS.
The `PLUGIN_CLIENT_CERT` environment variable is populated with the GoQuorum client certificate (in PEM format).

Each plugin must include this certificate to its trusted certificate pool, generate a self-signed certificate, and
append the base64-encoded value of the certificate (in DER format) in the
[handshake](https://github.com/hashicorp/go-plugin/blob/master/docs/internals.md#handshake) message.
