---
description: How to access APIs
---

# Access APIs

You can access the [GoQuorum](../../Reference/API-Methods.md) and [Geth](https://geth.ethereum.org/docs/rpc/server) APIs
using JSON-RPC over HTTP or WebSocket, or GraphQL over HTTP.

## Enabling API access

To enable API access, use:

- [`--http`](https://geth.ethereum.org/docs/interface/command-line-options) to enable JSON-RPC over HTTP.
- [`--ws`](https://geth.ethereum.org/docs/interface/command-line-options) to enable JSON-RPC over WebSocket.
- [`--graphql`](https://geth.ethereum.org/docs/interface/command-line-options) to enable GraphQL on the HTTP-RPC server.
  GraphQL can only be started if JSON-RPC over HTTP is enabled.

## Service hosts

To specify the host the API service listens on, use:

- [`--http.addr`](https://geth.ethereum.org/docs/interface/command-line-options) for an HTTP-RPC server.
- [`--ws.addr`](https://geth.ethereum.org/docs/interface/command-line-options) for a WebSocket RPC server.

The default host is `127.0.0.1`.

## Service ports

To specify the port the API service listens on, use:

- [`--http.port`](https://geth.ethereum.org/docs/interface/command-line-options) for an HTTP-RPC server. The default port is 8545.
- [`--ws.port`](https://geth.ethereum.org/docs/interface/command-line-options) for a WebSocket RPC server. The default port is 8546.
