# Securing JSON-RPC

## Overview

JSON-RPC servers are secured using a [security plugin interface](https://github.com/ConsenSys/quorum-plugin-definitions/blob/master/security.proto).
The [official implementation](https://github.com/ConsenSys/quorum-security-plugin-enterprise) enables the GoQuorum
client to protect JSON-RPC APIs using the following features:

### Native Transport Layer Security

Native Transport Layer Security (TLS) introduces an encryption layer to the JSON-RPC request/response communication
channel for both HTTP and WebSocket listeners.
By using a simple configuration flag, this feature allows the automatic generation of a self-signed certificates for
testing environments, or a smooth integration with certificate authorities for enterprise deployment.

### Enterprise authorization protocol integration

Enterprise authorization protocol integration introduces an access control layer that authorizes each JSON-RPC
invocation to an atomic module function level (for example `personal_OpenWallet`) using the industry standard
[OAuth 2.0](https://tools.ietf.org/html/rfc6749) protocol and [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) method.
This feature enables GoQuorum access control and dapp management.

## Configuration

Refer to the [plugin implementation](../../reference/plugins/security.md#for-users) for more details
and find [examples on how to configure the plugin to work with different OAuth2 Authorization servers](https://github.com/ConsenSys/quorum-security-plugin-enterprise/tree/master/examples).

## Client usage

Before invoking protected JSON-RPC APIs, the client must request an access token by authenticating with the
authorization server.
An access token can be opaque or a JWT.
It's the client's responsibility to maintain this token's validity during its lifetime.

When invoking a JSON-RPC API, the client must send the token in the `Authorization` request header field with the
`Bearer` authentication scheme.
All major HTTP client libraries have extensions to allow such customization.

## Examples

The following are examples on how to interact with protected JSON-RPC APIs.

### `web3`

Use Web3.js JavaScript library:

```js
let Web3 = require('web3');
let HttpHeaderProvider = require('httpheaderprovider');
// obtain the preauthenticated bearer token
// by authenticating with the authorization server
let token = ...;
let headers = { "Authorization": `Bearer ${token}` };
let provider = new HttpHeaderProvider('https://...', headers);
web3.setProvider(provider);
```

### `web3j-quorum`

Use the [web3j-quorum](https://github.com/web3j/web3j-quorum) Java library:

```java
HttpService service = new HttpService("<JSON-RPC HTTPS endpoint>");
service.addHeader("Authorization", "bearer $accessToken");

quorum = Quorum.build(service);
```

### `curl`

Get the pre-authenticated bearer token by authenticating with the authorization server:

```bash
export TOKEN="Bearer ..."
curl -X POST -H "Content-type: application/json" -H "Authorization: $TOKEN" \
    https://... \
    --data '{"jsonrpc":"2.0", "method":"eth_blockNumber", "params":[], "id":1}'
```

### `geth attach`

Use the following command line options to allow a secured GoQuorum node connection:

- [`--rpcclitoken`](../../reference/cli-syntax.md#rpcclitoken)
- [`--rpcclitls.insecureskipverify`](../../reference/cli-syntax.md#rpcclitlsinsecureskipverify)
- [`--rpcclitls.cert`](../../reference/cli-syntax.md#rpcclitlscert)
- [`--rpcclitls.cacert`](../../reference/cli-syntax.md#rpcclitlscacert)
- [`--rpcclitls.ciphersuites`](../../reference/cli-syntax.md#rpcclitlsciphersuites)

For example, connect to the node using `--rpcclitls.insecureskipverify` to ignore the server's certificate validation:

=== "HTTP"

    ```bash
    geth attach https://localhost:22000 --rpcclitls.insecureskipverify
    ```

=== "WebSocket"

    ```bash
    geth attach wss://localhost:23000 --rpcclitls.insecureskipverify
    ```

### `ethclient`

`ethclient` provides a Go client for the Ethereum RPC API.
It also supports GoQuorum-specific APIs and protected APIs.

=== "HTTP"

    For the HTTP endpoint, the preauthenticated token is populated in the `Authorization` HTTP request header for each call.
    The token value is obtained from the `rpc.HttpCredentialsProviderFunc` implementation, which is configured after
    `rpc.Client` is instantiated.

    ```go
    // obtain the preauthenticated bearer token
    // by authenticating with the authorization server
    token := ...
    // instantiate rpc.Client
    c, err := rpc.Dial("http://...")
    if err != nil {
        // handle err
    }
    var f rpc.HttpCredentialsProviderFunc = func(ctx context.Context) (string, error) {
        // optionally to refresh the token if necessary
        return "Bearer " + token, nil
    }
    // configure rpc.Client with preauthenticated token
    authenticatedClient, err := c.WithHTTPCredentials(f)
    if err != nil {
        // handle err
    }

    // use authenticatedClient as usual
    ```

    To customize TLS client configuration:

    ```go
    // instantiate a http.Client with custom TLS client config
    myHttpClient := ...
    // instantiate rpc.Client
    c, err := rpc.DialHTTPWithClient("https://...", myHttpClient)
    ```

=== "WebSocket"

    For the WS endpoint, the preauthenticated token is populated in the `Authorization` HTTP request header only once
    during the handshake. The token value is obtained from the `rpc.HttpCredentialsProviderFunc` implementation via
    `context.Context` when dialing.

    ```go
    // obtain the preauthenticated bearer token
    // by authenticating with the authorization server
    token := ...

    var f rpc.HttpCredentialsProviderFunc = func(ctx context.Context) (string, error) {
        // optionally to refresh the token if necessary
        return "Bearer " + token, nil
    }
    ctx := context.WithValue(context.Background(), rpc.CtxCredentialsProvider, f)
    authenticatedClient, err := rpc.DialContext(ctx, "ws://...)
    if err != nil {
        // handle err
    }

    // use authenticatedClient as usual
    ```

    To customize the TLS client configuration, use `rpc.DialWebsocketWithCustomTLS()` instead of `rpc.DialContext()`:

    ```go
    // create a tls.Config
    tlsConfig := &tls.Config{...}
    c, err := rpc.DialWebsocketWithCustomTLS(ctx, "wss://...", "", tlsConfig)
    ```
