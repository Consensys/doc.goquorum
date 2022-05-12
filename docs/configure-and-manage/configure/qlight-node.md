# Configure GoQuorum qlight

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

## Configure the `client-security-plugin` mode

In this mode, the configured Go-Quorum plugin is called when the token expiry is reached.
This plugin is configurable and you can even develop your own implementation of this plugin.

The plugins are in the ConsenSys repository and are downloaded automatically in their absence in the plugins directory.

But, you can provide your own plugin implementation: you can refer to the [use of plugin with the hello world tutorial](/tutorials/use-plugins.md) and do the same with the projects below:

- GoQuorum plugins are based on the Hashicorp plugin model, there is a gRPC model for the communication interaction: [ProtoBuf model](https://github.com/ConsenSys/quorum-plugin-definitions/blob/master/qlight-token-manager.proto).

- The model is pre-compiled as an SDK you can refer to, so you can develop your own implementation: [QLight Token Manager Plugin SDK in Go](https://github.com/ConsenSys/quorum-qlight-token-manager-plugin-sdk-go).

- The Go-Quorum implementation is using the Ory Hydra OAuth server: [GoQuorum Qlight Token Manager Plugin](https://github.com/ConsenSys/quorum-plugin-qlight-token-manager).

- You can refer to the GoQuorum examples Docker-compose file: [QLight Client with Token Manager Plugin](https://github.com/baptiste-b-pegasys/quorum-examples/pull/1/files#diff-f1ae6238d92e0b4f764eede62765302b1cfffee7e9a971a48ee97354b57b9686) (- [ ] TODO: fix this file in the quorum-example repository)


### Steps

1. Configure the plugins (`plugins/geth-plugin-settings.json`)

    ```
    {
    "baseDir": "./plugins",
    "providers": {
    "qlighttokenmanager": {
        "name":"quorum-plugin-qlight-token-manager",
        "version":"1.0.0",
        "config": "file://./plugins/qlight-token-manager-plugin-config.json"
    },
    "helloworld": {
        "name":"quorum-plugin-hello-world",
        "version":"1.0.0",
        "config": "file://./plugins/hello-world-plugin-config.json"
    }
    }
    }
    ```

1. Configure the qlight token manager (`plugins/qlight-token-manager-plugin-config.json`)

    ```
    {
        "url":"https://multi-tenancy-oauth2-server:4444/oauth2/token",
        "method":"POST",
        "parameters":{
            "grant_type":"client_credentials",
            "client_id":"${PSI}",
            "client_secret":"foofoo",
            "scope":"rpc://eth_* p2p://qlight rpc://admin_* rpc://personal_* rpc://quorumExtension_* rpc://rpc_modules psi://${PSI}?self.eoa=0x0&node.eoa=0x0",
            "audience":"Node1"
        }
    }
    ```

1. Enable the plugins configuration in the geth arguments

    Add the flag `--plugins file://./plugins/geth-plugin-settings.json --plugins.skipverify` so GoQuorum enables them.

    (`skipverify` will skip the verification of the plugins integrity)