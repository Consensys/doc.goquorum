# Setting up a GoQuorum qlight node

A qlight client node requires a full node configured to act as a qlight server.
The server node is usually set up to support Multiple Private States (MPS), with the qlight client set up to use a Private State Identifier (PSI) which is managed by the server node.

## Configure qlight client

The qlight client is configured using the following command line options:

- `--qlight.client`: This marks the node as a qlight client.
- `--qlight.client.psi`: This specifies the PSI which this client will support (default = "private").
- `--qlight.client.serverNode`: The Node Id of the server node.
- `--qlight.client.serverNodeRPC`: The RPC URL of the server node.

Additionally, if the server node has the RPC API secured using TLS, then the qlight client requires the following:

- `--qlight.client.rpc.tls`: Use TLS when forwarding RPC API calls.
- `--qlight.client.rpc.tls.insecureskipverify`: Skip TLS verification.
- `--qlight.client.rpc.tls.cacert`: The qlight client certificate authority.
- `--qlight.client.rpc.tls.cert`: The qlight client certificate.
- `--qlight.client.rpc.tls.key`: The qlight client certificate private key.

## Configure server node

The qlight server is configured using the following command line options:

- `--qlight.server`: This marks the node as a qlight server.
- `--qlight.server.p2p.port`: The RPC listening port.
- `--qlight.server.p2p.maxpeers`: The maximum number of qlight clients that are supported.

### Network IP restriction

This restricts communication to specified IP networks (CIDR masks).
The network mask is specified on the qlight server using the command line option `--qlight.server.p2p.netrestrict`.

### File based permissioning

File based permissioning allows qlight clients to be checked against a permissioned list and a disallowed list.
It is enabled on the server node using `--qlight.server.p2p.permissioning`.

The default files are `permissioned-nodes.json` and `disallowed-nodes.json`.
However, a file prefix can be specified using `--qlight.server.p2p.permissioning.prefix`, in which case the filename will be: the prefix, followed by a hyphen, followed by the default file name.

## Using the enterprise authorization protocol integration

This leverages the security model described under [JSON-RPC security](json-rpc-api-security.md#enterprise-authorization-protocol-integration) to only allow authenticated clients to connect to the server.

An access token must be obtained on the qlight client by authenticating with the authorization server.
The token is then passed on the qlight client command line using `--qlight.client.token`.

## Native transport layer security (TLS) for P2P communication

An encryption layer can be used on the qlight client-server communication.
This is configured using the following options:

- `--qlight.tls`: Enable TLS on the P2P connection.
- `--qlight.tls.cert`: The certificate file to use.
- `--qlight.tls.key`: The key file to use.
- `--qlight.tls.clientcacerts`: The certificate authorities file to use for validating the connection (server configuration parameter).
- `--qlight.tls.cacerts`: The certificate authorities file to use for validating the connection (client configuration parameter).
- `--qlight.tls.clientauth`: The way the client is authenticated. Possible values: 0=NoClientCert(default) 1=tRequestClientCert 2=RequireAnyClientCert 3=VerifyClientCertIfGiven 4=RequireAndVerifyClientCert (default: 0).
- `--qlight.tls.ciphersuites`: The cipher suites to use for the connection.
