# Configure a GoQuorum qlight node

A [qlight client node](../../concepts/qlight-node.md) requires a full node configured to act as a qlight server.
The server node is usually set up to support [multiple private states](../../concepts/multi-tenancy.md#multiple-private-states)
(MPS), with the qlight client set up to use a [private state identifier](../../concepts/multi-tenancy.md#private-state-identifier)
(PSI) which is managed by the server node.

!!! note

    Setting up a server node to support MPS is not required, for example, when setting up a qlight client for offloading processing from a full node.

## Configure qlight client

Configure the qlight client using the [`--qlight.client.*`](../../reference/cli-syntax.md#qlightclient) command line options.

If the server node has the RPC API secured using TLS, then you must set the [`--qlight.client.rpc.tls.*`](../../reference/cli-syntax.md#qlightclientrpctls) command line options.

If you stop the qlight client node, on restart it resyncs with any blocks it missed when it was not running.

## Configure server node

Configure the qlight server using the [`--qlight.server.*`](../../reference/cli-syntax.md#qlightserver) command line options.

### Network IP restriction

This restricts communication to specified IP networks (CIDR masks).
Specify the network mask on the qlight server using [`--qlight.server.p2p.netrestrict`](../../reference/cli-syntax.md#qlightserverp2pnetrestrict).

### File based permissioning

File based permissioning allows you to check qlight clients against a permissioned list and a disallowed list.
Enable file based permissioning on the server node using [`--qlight.server.p2p.permissioning`](../../reference/cli-syntax.md#qlightserverp2ppermissioning).

The default files are `permissioned-nodes.json` and `disallowed-nodes.json`.
You can specify a file prefix using [`--qlight.server.p2p.permissioning.prefix`](../../reference/cli-syntax.md#qlightserverp2ppermissioningprefix).

## Configure enterprise authorization

The [enterprise authorization protocol integration](../manage/json-rpc-api-security.md#enterprise-authorization-protocol-integration)
only allows authenticated clients to connect to the server.

When using [JSON-RPC security](../manage/json-rpc-api-security.md#enterprise-authorization-protocol-integration)
you must provide an access token to communicate to the qlight server.

Enable auth tokens in the qlight client using [`--qlight.client.token.enabled`](../../reference/cli-syntax.md#qlightclienttokenenabled).

Once enabled, specify an initial value using [`--qlight.client.token.value`](../../reference/cli-syntax.md#qlightclienttokenvalue).

Specify a refresh mechanism for the token using [`--qlight.client.token.management`](../../reference/cli-syntax.md#qlightclienttokenmanagement).

## Configure TLS for P2P communication

You can add an encryption layer on the qlight client-server communication.
Configure the encryption layer using the [`qlight.tls.*`](../../reference/cli-syntax.md#qlighttls) command line options.
