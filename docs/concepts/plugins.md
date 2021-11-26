---
description: GoQuorum plugins overview
---

# GoQuorum plugins

GoQuorum allows adding features as plugins to the core `geth` client, providing extensibility, flexibility, and
isolation of GoQuorum features.

The benefits of plugins include:

- Allowing the implementation of certain GoQuorum components to be changed at configuration time.
- Supporting the GoQuorum community to improve the GoQuorum client with innovative plugin implementations in different languages.
- Decoupling new GoQuorum-specific features from the core `geth`, simplifying the process of integrating changes from
   upstream `geth`, and isolating potential failures.

## How it works

Each plugin exposes an implementation for a specific [plugin interface](https://github.com/ConsenSys/quorum-plugin-definitions).
Plugins are executed as separate processes and communicate with the main `geth` process over a [gRPC](https://grpc.io/)
interface.

The plugin implementation must adhere to certain gRPC services defined in a `.proto` file corresponding to the plugin interface.
Plugins can be written in different languages, as gRPC provides a mechanism to generate stub code from `.proto` files.

The [high-level plugin library](https://github.com/hashicorp/go-plugin) automatically handles the network communication
and RPC.

## Using plugins

The GoQuorum client reads the [plugin configuration file](../DevelopingApplications/DevelopPlugins.md) to determine which plugins to
load and searches for installed plugins (`<name>-<version>.zip` files) in the plugins directory `baseDir` (the default
directory is `<datadir>/plugins`).

You can [specify a plugin configuration file](../DevelopingApplications/DevelopPlugins.md),
[develop plugins](../DevelopingApplications/DevelopPlugins.md),
and [use an example `HelloWorld` plugin](../Tutorials/Use-Plugin.md).

## Plugin reloading

The Plugin Manager exposes an API `admin_reloadPlugin` that allows reloading a plugin.
This attempts to restart the current plugin process.

Plugin configuration changes made after the initial node startup are applied when reloading the plugin.
This is demonstrated in the [`HelloWorld` plugin tutorial](../Tutorials/Use-Plugin.md).

## Plugin integrity verification

GoQuorum uses Plugin Central Server to download and verify plugin integrity using [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy).
You can enable the same verification process locally using the
[`--plugins.localverify`](../Reference/CLI-Syntax.md#pluginslocalverify) and
[`--plugins.publickey`](../Reference/CLI-Syntax.md#pluginspublickey) command line options, or
remotely using [custom Plugin Central](../DevelopingApplications/DevelopPlugins.md).

To disable the plugin verification process, use the
[`--plugins.skipverify`](../Reference/CLI-Syntax.md#pluginsskipverify) command line option.

!!! warning

    Using `--plugins.skipverify` introduces security risks and isn't recommended for production environments.
