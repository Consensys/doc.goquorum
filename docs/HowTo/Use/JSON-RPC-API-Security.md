# Securing JSON RPC

## Overview

JSON RPC servers are secured via a [security plugin interface](../../Reference/Plugins/security/interface.md).
The official implementation is [Quorum Security Plugin](https://github.com/ConsenSys/quorum-security-plugin-enterprise) which
enables the GoQuorum Client to protect JSON RPC APIs with the following features:

### Native Transport Layer Security

The native Transport Layer Security (TLS) introduces an encryption layer
to the JSON-RPC request/response communication channel for both HTTP,
and Web Socket listeners. By using a simple configuration flag this
feature allows the automatic generation of self signed certificate for
testing environment, or a smooth integration with certificate
authorities for enterprise deployment.

### Enterprise authorization protocol integration

Enterprise authorization protocol integration introduces an access
control layer that authorizes each JSON RPC invocation to an atomic
module function level (E.g `personal_OpenWallet`) using industry
standard [OAuth 2.0](https://tools.ietf.org/html/rfc6749)
protocol and [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) method.
This feature allows managing distributed application (dApps),
and Quorum Clients access control in an efficient approach.

## Configuration

Refer to [plugin implementation](../../Reference/Plugins/security/For-Users.md) for more details
and find [examples on how to configure the plugin to work with different OAuth2 Authorization servers](https://github.com/ConsenSys/quorum-security-plugin-enterprise/tree/master/examples).

## Client usage

Before invoking protected JSON RPC APIs, the client must request an access token by authenticating with the
authorization server. An access token could be opaque or a JWT. It's the client's reponsiblity to maintain
this preauthenticated token valid during its life time.

When invoking a JSON RPC API, the client must send the preauthenticated token in the `Authorization` request header field
with `Bearer` authentication scheme. All major HTTP client libraries have extensions to allow such customization.

## Examples

Here are some examples on how to interact with protected JSON RPC APIs:

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

### `curl`

Obtain the pre-authenticated bearer token by authenticating with the authorization server.

```bash
export TOKEN="Bearer ..."
curl -X POST -H "Content-type: application/json" -H "Authorization: $TOKEN" \
    https://... \
    --data '{"jsonrpc":"2.0", "method":"eth_blockNumber", "params":[], "id":1}'
```

### `geth attach`

Use additional flags to allow a secured GoQuorum node connection:

```text
--rpcclitoken value                 RPC Client access token
--rpcclitls.insecureskipverify      Disable verification of server's TLS certificate on connection by client
--rpcclitls.cert value              Server's TLS certificate PEM file on connection by client
--rpcclitls.cacert value            CA certificate PEM file for provided server's TLS certificate on connection by client
--rpcclitls.ciphersuites value      Customize supported cipher suites when using TLS connection. Value is a comma-separated cipher suite string
```

For example connect to the node with `--rpcclitls.insecureskipverify` to ignore the Server's certificate validation.

=== "HTTP"

    ```bash
    geth attach https://localhost:22000 --rpcclitls.insecureskipverify
    ```

=== "WebSocket"

    ```bash
    geth attach wss://localhost:23000 --rpcclitls.insecureskipverify
    ```

### `ethclient`

`ethclient` provides a Go client for Ethereum RPC API.
It's also enhanced to support Quorum-specific APIs and ability to invoke protected APIs.

=== "HTTP"

    For HTTP endpoint, the preauthenticated token is populated in `Authorization` HTTP request header for each call.
    The token value is obtained from `rpc.HttpCredentialsProviderFunc` implementation which is configured after
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

    For WS endpoint, the preauthenticated token is populated in `Authorization` HTTP request header only once
    during the handshake. The token value is obtained from `rpc.HttpCredentialsProviderFunc` implementation via
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

    To customize TLS client configuration, use `rpc.DialWebsocketWithCustomTLS()` instead of `rpc.DialContext()`

    ```go
    // create a tls.Config
    tlsConfig := &tls.Config{...}
    c, err := rpc.DialWebsocketWithCustomTLS(ctx, "wss://...", "", tlsConfig)
    ```
