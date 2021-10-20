# Initialization interface

Every [plugin](../../Concepts/Plugins.md) must implement the initialization interface and define it in an `init.proto` file.

`geth` sends a raw configuration to each plugin using the `PluginInitializer` service.
Each plugin determines how to interpret and parse the configuration and perform initialization.

## `PluginInitializer`

The service required for `geth` to initialize the plugin after the plugin process starts.

| Method name | Request type                   | Response type                   |
| ----------- | ------------------------------ | ------------------------------- |
| `Init`      | `PluginInitialization.Request` | `PluginInitialization.Response` |

## Messages

### `PluginInitialization`

A wrapper message to logically group other messages.

### `PluginInitialization.Request`

Initialization data for the plugin.

| Field              | Type   | Description                                     |
| ------------------ | ------ | ----------------------------------------------- |
| `hostIdentity`     | string | `geth` node identity                            |
| `rawConfiguration` | bytes  | Raw configuration to be processed by the plugin |

### `PluginInitialization.Response`

The initialization response.
