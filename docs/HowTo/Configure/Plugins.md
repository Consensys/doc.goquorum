# Configure plugins

GoQuorum can load [plugins](../../Concepts/Plugins.md) from:

- A JSON file specified using the [`--plugins`](../../Reference/CLI-Syntax.md#plugins) command line option.
- An Ethereum TOML configuration file specified using the [`--config`](https://geth.ethereum.org/docs/interface/command-line-options)
  command line option.

## Configuration files

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
| `providers`| The supported plugin interfaces being used mapped to their respective [plugin provider definitions](#plugindefinition). |
| `<string>` | The plugin interface, for example `helloworld`.                                                                         |

### `PluginCentralConfiguration`

[Plugin integrity verification](../../Concepts/Plugins.md#plugin-integrity-verification) uses the GoQuorum Plugin
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

### `PluginDefinition`

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
