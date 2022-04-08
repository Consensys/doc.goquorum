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
- `client-security-plugin` (default) - the client security plugin is used to periodically refresh the access token. Please see the client-security-plugin documentation for further details.

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
