---
description: JSON-RPC APIs
---

# JSON-RPC Server

GoQuorum is based on the [Geth Go Ethereum client](https://geth.ethereum.org/) and supports all
[standard web3 JSON-RPC APIs](https://geth.ethereum.org/docs/rpc/server). JSON-RPC is supported over
HTTP, WebSocket, and Unix Domain Sockets, which are enabled through
[command-line options](./Connecting-to-a-node.md)

Ethereum JSON-RPC APIs use a namespace system, and methods are grouped into categories depending on
their purpose. The general form for a method name is the namespace and the actual method name, separated
by an underscore.

In addition to the standard APIs, GoQuorum adds extra capabilities with to permissioning, privacy, consensus
methods, and contracts, all of which are detailed in the [API documentation](../Reference/API-Methods.md).
