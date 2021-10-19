# Configure plugins

`geth` can load plugins from:

- A JSON file specified using the [`--plugins`](../../Reference/CLI-Syntax.md#plugins) command line option.
- An Ethereum TOML configuration file specified using the `--config` command line option.

## Configuration files

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

| Fields      | Description                                                                                                                                                                                                        |
|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `baseDir`   | A string indicating the local directory from where plugins are read. If empty, defaults to `<datadir>/plugins`. <br/> To read from arbitrary enviroment variable (e.g: `MY_BASE_DIR`), provide value `env://MY_BASE_DIR` |
| `central`   | A configuration of the remote plugin central. See [PluginCentralConfiguration](#plugincentralconfiguration)                                                                                                        |
| `providers` | A map of the supported plugin interfaces being used (for example, `helloworld`), mapped to their respective plugin provider definitions (see [PluginDefinition](#plugindefinition))                                                                             |
| `<string>`  | A string constant indicates the plugin interface. E.g: `helloworld`.                                                                                                                                               |

## `PluginCentralConfiguration`

[Plugin integrity verification](../../Concepts/Plugins.md#plugin-integrity-verification) uses the GoQuorum
Plugin Central Server by default.
Modifying this section configures your own local plugin central for Plugin Integrity Verification:

=== "JSON"

    ```json
    {
      "baseURL": string,
      "certFingerprint": string,
      "publicKeyURI": string,
      "insecureSkipTLSVerify": bool,
      "pluginDistPathTemplate": string,
      "pluginSigPathTemplate": string
    }
    ```

=== "TOML"

    ```toml
    BaseURL = string
    CertFingerPrint = string
    PublicKeyURI = string
    InsecureSkipTLSVerify = bool
    PluginDistPathTemplate = string
    PluginSigPathTemplate = string
    ```

| Fields                  | Description                                                                                                               |
|:------------------------|:--------------------------------------------------------------------------------------------------------------------------|
| `baseURL`               | A string indicating the remote plugin central URL (ex.`https://plugins.mycorp.com`)                                       |
| `certFingerprint`       | A string containing hex representation of the http server public key finger print <br/>to be used for certificate pinning |
| `publicKeyURI`          | A string defining the location of the PGP public key <br/>to be used to perform the signature verification                |
| `insecureSkipTLSVerify` | If true, **do not** verify the server's certificate chain and host name                                                   |
| `pluginDistPathTemplate`| A string defining the path template to the plugin distribution file. <br/>The value is a string that is a Go text template. <br/>The self-explanatory variables are \{\{.Name\}\}, \{\{.Version\}\}, \{\{.OS\}\} and \{\{.Arch\}\} |
| `pluginSigPathTemplate` | A string defining the path template to the plugin sha256 signature file. <br/> The value is a string that is a Go text template. <br/>The self-explanatory variables are \{\{.Name\}\}, \{\{.Version\}\}, \{\{.OS\}\} and \{\{.Arch\}\} |

## `PluginDefinition`

Defines the plugin and its configuration

=== "JSON"

    ```json
    {
      "name": string,
      "version": string,
      "config": file/string/array/object
    }
    ```

=== "TOML"

    ```toml
    Name = string
    Version = string
    Config = file/string/array/object
    ```

| Fields    | Description                                                                                                                                                                                                                                                                     |
|:----------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`    | A string specifying the name of the plugin                                                                                                                                                                                                                                       |
| `version` | A string specifying the version of the plugin                                                                                                                                                                                                                                    |
| `config`  | Value can be: <ul><li>uri format: supports the following schemes<ul><li>`file`: location of plugin config file to be read. E.g.: `file:///opt/plugin.cfg`</li><li>`env`: value from an environment variable. E.g.: `env://MY_CONFIG_JSON`<br/>To indicate value is a file location: append `?type=file`. E.g.: `env://MY_CONFIG_FILE?type=file`</li></ul><li>string: an arbitrary JSON string</li><li>array: a valid JSON array E.g.: `["1", "2", "3"]`</li><li>object: a valid JSON object. E.g.: `{"foo" : "bar"}`</li></ul> |
