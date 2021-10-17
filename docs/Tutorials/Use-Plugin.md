---
description: HelloWorld plugin tutorial
---

## Example: `HelloWorld` plugin

The plugin interface is implemented in Go and Java.
In this example, `HelloWorld` plugin exposes a JSON RPC endpoint to return a greeting message in the configured language.
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
