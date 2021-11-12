---
description: json rpc apis
---

# JSON RPC Server

GoQuorum is based on the [Geth Go Ethereum client](https://geth.ethereum.org/) and so supports all
[standard web3 JSON-RPC APIs](https://geth.ethereum.org/docs/rpc/server). JSON-RPC is supported over HTTP, WebSocket and Unix
Domain Sockets, which are enabled through [command-line flags](./Connecting-to-a-node.md)

Ethereum JSON-RPC APIs use a name-space system and methods are grouped into categories depending on their purpose. The general
form for a method name is the namespace and the actual method name, separated by an underscore.

In addition to the standard APIs, GoQuorum also adds extra capabilities with regards to permissions, privacy, consensus
methods and contracts all of which are detailed in the [Reference API](../Reference/API-Methods.md)
