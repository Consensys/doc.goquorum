---
description: GoQuorum pluggable architecture
---

# GoQuorum plugins

GoQuorum allows adding features as plugins to the core `geth` client, providing extensibility, flexibility, and
isolation of GoQuorum features.

The benefits of plugins include:

1. Allowing the implementation of certain GoQuorum components to be changed at configuration time.
1. Supporting the GoQuorum community to improve the GoQuorum client with innovative implementations of the supported
   pluggable components.
1. Decoupling new GoQuorum-specific features from the core `geth`, simplifying the process of integrating changes from
   upstream `geth`.

## How it works

Each plugin exposes an implementation for a specific [plugin interface](https://github.com/ConsenSys/quorum-plugin-definitions).
Plugins are executed as separate processes and communicate with the main `geth` process over a [gRPC](https://grpc.io/)
interface.

The plugin implementation must adhere to certain gRPC services defined in a `.proto` file corresponding to the plugin interface.
Plugins can be written in different languages, as gRPC provides a mechanism to generate stub code from `.proto` files.

The [high-level plugin library](https://github.com/hashicorp/go-plugin) automatically handles the network communication
and RPC.

## Installing plugins

Currently, plugins must be manually installed into a directory.
The default is the `plugins` directory inside `geth` data directory.
You can override the default by setting `baseDir` in the [plugin settings](../../HowTo/Configure/Plugins.md).

## Using plugins

You can [configure a plugin settings file](../../HowTo/Configure/Plugins.md) and
[use an example `HelloWorld` plugin](../../Tutorials/Use-Plugin.md).

## Plugin integrity verification

You can use Plugin Central Server to download and verify plugin integrity using [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy).
The architecture enables the same verification process locally using the
[`--plugins.localverify`](../../Reference/CLI-Syntax.md#pluginslocalverify) and
[`--plugins.publickey`](../../Reference/CLI-Syntax.md#pluginspublickey) command line options, or
remotely using [custom Plugin Central](../../HowTo/Configure/Plugins.md).

To disable the plugin verification process, use the
[`--plugins.skipverify`](../../Reference/CLI-Syntax.md#pluginsskipverify) command line option.

!!! warning

    Using `--plugins.skipverify` introduces security risks and isn't recommended for production environments.
