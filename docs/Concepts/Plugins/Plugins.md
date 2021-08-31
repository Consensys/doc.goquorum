---
description: GoQuorum pluggable architecture
---

# GoQuorum plugins

The GoQuorum client is a modified `geth` client.

One of the unique enhancement is the pluggable architecture which allows adding additional features
as plugins to the core `geth`, providing extensibility, flexibility, and isolation of GoQuorum features.

## Benefits

This enhancement provides a number of benefits, including:

1. Allowing the implementation of certain components of the GoQuorum client to be changed at configuration time.
1. Supporting our community to improve the GoQuorum client with their own innovative implementations of the supported pluggable components.
1. Decoupling new GoQuorum-specific features from core `geth` thereby simplifying the process of pulling in changes from upstream `geth`.

## How it works?

Each plugin exposes an implementation for a specific [plugin interface](https://github.com/ConsenSys/quorum-plugin-definitions) (or see `Pluggable Architecture -> Plugins` for more details)

Plugins are executed as a separate process and communicate with the main GoQuorum client `geth` process
over a [gRPC](https://grpc.io/) interface.

The plugin implementation must adhere to certain gRPC services defined in a `.proto` file corresponding to the plugin interface.
Plugins can be written in different languages as gRPC provides a mechanism to generate stub code from `.proto` files.

The network communication and RPC are handled automatically by the [high-level plugin library](https://github.com/hashicorp/go-plugin).

## Installing plugins

Currently plugins must be manually installed into a directory (defaults to `plugins` directory inside `geth` data directory - default can be overridden by setting `baseDir` in [plugins settings](../../HowTo/Configure/Plugins.md)).

## Using plugins

[Plugins settings file](../../HowTo/Configure/Plugins.md) contains a JSON that describes what plugins to be used.
Then start `geth` using the [`--plugins`](../../Reference/CLI-Syntax.md#plugins) command line option:

```bash
geth <other parameters> \
     --plugins file:///<path>/<to>/plugins.json
```

## Plugin integrity verification

Plugin Central Server can be used to download and verify plugin integrity using [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy).
The architecture enables the same verification process locally via
[`--plugins.localverify`](../../Reference/CLI-Syntax.md#pluginslocalverify) and
[`--plugins.publickey`](../../Reference/CLI-Syntax.md#pluginspublickey) options or
remotely with custom plugin central - reference the [`Settings`](../../HowTo/Configure/Plugins.md) section for more
information on how to support custom plugin central.

To disable the plugin verification process, use the
[`--plugins.skipverify`](../../Reference/CLI-Syntax.md#pluginsskipverify) command line option.

!!! warning

    Using `--plugins.skipverify` introduces security risks and isn't recommended for production environments.

!!! important

    Before GoQuorum `21.4.1`, the default Plugin Central Server configuration used Bintray to distribute the official plugins.
    As Bintray will stop working on May 1st 2020, [configure plugin central](../../HowTo/Configure/Plugins.md#plugincentralconfiguration) to use ConsenSys Cloudsmith repository
    to override the default:
    ```json
    {
        "central": {
            "baseURL": "https://provisional-plugins-repo.quorum.consensys.net",
            "publicKeyURI": ".pgp/Central.pgp.pk"
        },
        ...
    }
    ```

## Example: `HelloWorld` plugin

The plugin interface is implemented in Go and Java. In this example, `HelloWorld` plugin exposes a JSON RPC endpoint
to return a greeting message in the configured language.
This plugin can [reload](../../Concepts/Plugins/PluginsArchitecture.md#plugin-reloading) changes from its JSON configuration.

### Build plugin distribution file

1. Clone plugin repository

    ```bash
    git clone --recursive https://github.com/ConsenSys/quorum-plugin-hello-world.git
    cd quorum-plugin-hello-world
    ```

1. Here we will use Go implementation of the plugin

    ```bash
    cd go
    make
    ```

   `quorum-plugin-hello-world-1.0.0.zip` is now created in `build` directory.
   Noticed that there's a file `hello-world-plugin-config.json` which is the JSON configuration file for the plugin.

### Start GoQuorum with plugin support

1. Build Quorum

    ```bash
    git clone https://github.com/ConsenSys/quorum.git
    cd quorum
    make geth
    ```

1. Copy `HelloWorld` plugin distribution file and its JSON configuration `hello-world-plugin-config.json` to `build/bin`

1. Create `geth-plugin-settings.json`

    ```bash
    cat > build/bin/geth-plugin-settings.json <<EOF
    {
     "baseDir": "./build/bin",
     "providers": {
       "helloworld": {
         "name":"quorum-plugin-hello-world",
         "version":"1.0.0",
         "config": "file://./build/bin/hello-world-plugin-config.json"
       }
     }
    }
    EOF
    ```

1. Run `geth` with plugin

    ```bash
    PRIVATE_CONFIG=ignore \
    geth \
        --nodiscover \
        --verbosity 5 \
        --networkid 10 \
        --raft \
        --raftjoinexisting 1 \
        --datadir ./build/_workspace/test \
        --rpc \
        --rpcapi eth,debug,admin,net,web3,plugin@helloworld \
        --plugins file://./build/bin/geth-plugin-settings.json \
        --plugins.skipverify
    ```

    `ps -ef | grep helloworld` would reveal the `HelloWorld` plugin process

### Test the plugin

1. Call the JSON RPC
    Run the following command in the shell console:

    ```bash
    curl -X POST http://localhost:8545 \
        -H "Content-type: application/json" \
        --data '{"jsonrpc":"2.0","method":"plugin@helloworld_greeting","params":["Quorum Plugin"],"id":1}'
    ```

    Result is:

    ```json
    {"jsonrpc":"2.0","id":1,"result":"Hello Quorum Plugin!"}
    ```

1. Update `build/bin/hello-world-plugin-config.json` plugin configuration to support `es` language

1. Reload the plugin
    Run the following command in the shell console:

    ```bash
    curl -X POST http://localhost:8545 \
        -H "Content-type: application/json" \
        --data '{"jsonrpc":"2.0","method":"admin_reloadPlugin","params":["helloworld"],"id":1}'
    ```

    Result is:

    ```json
    {"jsonrpc":"2.0","id":1,"result":true}
    ```

1. Call the JSON RPC
    Run the following command in the shell console:

    ```bash
    curl -X POST http://localhost:8545 \
        -H "Content-type: application/json" \
        --data '{"jsonrpc":"2.0","method":"plugin@helloworld_greeting","params":["Quorum Plugin"],"id":1}'
    ```

    Result is:

    ```json
    {"jsonrpc":"2.0","id":1,"result":"Hola Quorum Plugin!"}
    ```
