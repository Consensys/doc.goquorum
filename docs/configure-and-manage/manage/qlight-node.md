---
description: Using QLight node
---

# Using a GoQuorum qlight node

A [qlight client node](../../concepts/qlight-node.md) requires a full node configured to act as a qlight server.
The server node is usually set up to support [multiple private states](../../concepts/multi-tenancy.md#multiple-private-states)
(MPS), with the qlight client set up to use a [private state identifier](../../concepts/multi-tenancy.md#private-state-identifier)
(PSI) which is managed by the server node.

!!! note

    A server node is normally be set up as a multi-tenant node with Multiple Private States (MPS).
    However this is not essential, for example when setting up a qlight client for the purpose of offloading processing from a full node.

## Configure qlight client

Configure the qlight client using the following command line options:

- `--qlight.client`: This marks the node as a qlight client.
- `--qlight.client.psi`: This specifies the PSI which this client will support (default = "private").
- `--qlight.client.serverNode`: The Node ID of the server node.
- `--qlight.client.serverNodeRPC`: The RPC URL of the server node.

If the server node has the RPC API secured using TLS, then the qlight client requires the following:

- `--qlight.client.rpc.tls`: Use TLS when forwarding RPC API calls.
- `--qlight.client.rpc.tls.insecureskipverify`: Skip TLS verification.
- `--qlight.client.rpc.tls.cacert`: The qlight client certificate authority.
- `--qlight.client.rpc.tls.cert`: The qlight client certificate.
- `--qlight.client.rpc.tls.key`: The qlight client certificate private key.

If the qlight client node is halted, on restart it resyncs with any blocks that were missed when it was not running.

## Configure server node

Configure the qlight server using the following command line options:

- `--qlight.server`: This marks the node as a qlight server.
- `--qlight.server.p2p.port`: The RPC listening port.
- `--qlight.server.p2p.maxpeers`: The maximum number of qlight clients that are supported.

### Network IP restriction

This restricts communication to specified IP networks (CIDR masks).
Specify the network mask on the qlight server using `--qlight.server.p2p.netrestrict`.

### File based permissioning

File based permissioning allows qlight clients to be checked against a permissioned list and a disallowed list.
Enable file based permissioning on the server node using `--qlight.server.p2p.permissioning`.

The default files are `permissioned-nodes.json` and `disallowed-nodes.json`.
However, you can specify a file prefix using `--qlight.server.p2p.permissioning.prefix`, in which case the filename is: the prefix, followed by a hyphen, followed by the default file name.

## Using the enterprise authorization protocol integration

This leverages the security model described under [JSON-RPC security](json-rpc-api-security.md#enterprise-authorization-protocol-integration) to only allow authenticated clients to connect to the server.

When using [JSON-RPC security](json-rpc-api-security.md#enterprise-authorization-protocol-integration)
you must provide an access token to communicate to the qlight server.

Enable auth tokens in the qlight client using `--qlight.client.token.enabled`.

Once enabled, specify an initial value using `--qlight.client.token.value <token>`.

Specify a refresh mechanism for the token using `--qlight.client.token.management`.
The valid values are:

- `none` - the token is not refreshed (this mechanism is for development/testing purposes only).
- `external` - the refreshed token must be updated in the running qlight client process by invoking the `qlight.setCurrentToken` RPC API.
- `client-security-plugin` (default) - the client security plugin is used to periodically refresh the access token. Please see the client-security-plugin mode below.

## client-security-plugin mode

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

## Native transport layer security (TLS) for P2P communication

You can add an encryption layer on the qlight client-server communication.
Configure the encryption layer using the following options:

- `--qlight.tls`: Enable TLS on the P2P connection.
- `--qlight.tls.cert`: The certificate file to use.
- `--qlight.tls.key`: The key file to use.
- `--qlight.tls.clientcacerts`: The certificate authorities file to use for validating the connection (server configuration parameter).
- `--qlight.tls.cacerts`: The certificate authorities file to use for validating the connection (client configuration parameter).
- `--qlight.tls.clientauth`: The way the client is authenticated. Possible values: 0=NoClientCert(default) 1=RequestClientCert 2=RequireAnyClientCert 3=VerifyClientCertIfGiven 4=RequireAndVerifyClientCert (default: 0).
- `--qlight.tls.ciphersuites`: The cipher suites to use for the connection.
