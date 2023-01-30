# Security plugins

## For developers

You can develop new `security` [plugins](../../concepts/plugins.md) to customize protection of the JSON-RPC server.

`security` plugins must follow the [gRPC API interface requirements](https://github.com/ConsenSys/quorum-plugin-definitions/blob/master/security.proto).

To simplify the development of new `security` plugins the following `security` plugin SDKs are available:

| Name | Language |
| --- | --- |
| [quorum-security-plugin-sdk-go](https://www.github.com/ConsenSys/quorum-security-plugin-sdk-go) | Go |

## For users

GoQuorum provides an [official plugin implementation](https://github.com/ConsenSys/quorum-security-plugin-enterprise) that:

- Provides TLS configuration to HTTP and WS transports.
- Enables the `geth` JSON-RPC (HTTP/WS) server to be an OAuth2-compliant resource server.

See [how to use the security plugin](../../develop/json-rpc-apis.md).

### Configuration

One of the following blocks must be configured:

```json
{
    "tls": object(TLSConfiguration),
    "tokenValidation": object(TokenValidationConfiguration)
}
```

| Field | Description |
| :-- | :-- |
| `tls` | (Optional) The [TLS configuration](#tlsconfiguration). |
| `tokenValidation` | (Optional) [Configuration to verify access token and extract granted authorities from the token](#tokenvalidationconfiguration). |

#### `TLSConfiguration`

```json
{
    "auto": bool,
    "certFile": EnvironmentAwaredValue,
    "keyFile": EnvironmentAwaredValue,
    "advanced": object(TLSAdvancedConfiguration)
}
```

| Field | Description |
| :-- | :-- |
| `auto` | If true, generate a self-signed TLS certificate. Then save the generated certificate and private key in PEM format in `certFile` and `keyFile` respectively <br/> If false, use values from `certFile` and `keyFile`. |
| `certFile` | Location to a file storing certificate in PEM format. The default is `cert.pem`. |
| `keyFile` | Location to a file storing private key in PEM format. The default is `key.pem`. |
| `advanced` | Additional TLS configuration. |

#### `TLSAdvancedConfiguration`

```json
{
    "cipherSuites": array
}
```

| Field | Description |
| :-- | :-- |
| `cipherSuites` | List of cipher suites to be enforced. The default is: <ul><li>`TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`</li><li>`TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`</li><li>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA`</li><li>`TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA`</li></ul> View the [list of supported cipher suites](#supported-cipher-suites). |

#### `TokenValidationConfiguration`

```json
{
    "issuers": array,
    "cache": object(CacheConfiguration),
    "introspect": object(IntrospectionConfiguration),
    "jws": object(JWSConfiguration),
    "jwt": object(JWTConfiguration),
}
```

| Field | Description |
| :-- | :-- |
| `issuers` | Array of strings specifying approved entities who issue tokens. |
| `cache` | Configuration of a token cache. |
| `introspect` | Configuration of how to connect to the introspection API. |
| `jws` | Configuration of how to obtain a JSON Web Keyset to validate a JSON Web Signature. |
| `jwt` | Configuration of how to handle a JSON Web Token. |

#### `CacheConfiguration`

An LRU cache that checks for expiration before returning the value. If not specified, the default configuration is as follows:

```json
{
  "limit": 80,
  "expirationInSeconds": 3600
}
```

| Field                 | Description                           |
| :-------------------- | :------------------------------------ |
| `limit`               | Maximum number of items in the cache. |
| `expirationInSeconds` | Expiration time for a cache item.     |

#### `IntrospectionConfiguration`

```json
{
    "endpoint": string,
    "authentication": object(AuthenticationConfiguration),
    "tlsConnection": object(TLSConnectionConfiguration)
}
```

| Field | Description |
| :-- | :-- |
| `endpoint` | Introspection API endpoint. |
| `authentication` | Configuration of how to authenticate when invoking `endpoint`. |
| `tlsConnection` | Configuration of TLS when connecting to `endpoint`. |

#### `AuthenticationConfiguration`

```json
{
    "method": string,
    "credentials": map(string->EnvironmentAwaredValue)
}
```

| Field | Description |
| :-- | :-- |
| `method` | Defines an authentication mechanism. Supported values are: <ul><li>`client_secret_basic`: basic authentication</li><li>`client_secret_form`: form authentication</li><li>`private_key`: mutual TLS authentication</li></ul> |
| `credentials` | Defines the key value pair used for `method`. See the following table for the supported keys. |

| Method                | Keys                       |
| :-------------------- | :------------------------- |
| `client_secret_basic` | `clientId`, `clientSecret` |
| `client_secret_form`  | `clientId`, `clientSecret` |
| `private_key`         | `certFile`, `keyFile`      |

#### `TLSConnectionConfiguration`

```json
{
    "insecureSkipVerify": bool,
    "certFile": EnvironmentAwaredValue,
    "caFile": EnvironmentAwaredValue
}
```

| Field | Description |
| :-- | :-- |
| `insecureSkipVerify` | If true, GoQuorum doesn't verify the server TLS certificate. |
| `certFile` | Location to a file storing the server certificate in PEM format. The default is `server.crt`. |
| `caFile` | Location to a file storing the server CA certificate in PEM format. The default is `server.ca.cert`. |

#### `JWSConfiguration`

```json
{
    "endpoint": string,
    "tlsConnection": object(TLSConnectionConfiguration)
}
```

| Field           | Description                                         |
| :-------------- | :-------------------------------------------------- |
| `endpoint`      | API endpoint to obtain a JSON Web Keyset.           |
| `tlsConnection` | Configuration of TLS when connecting to `endpoint`. |

#### `JWTConfiguration`

```json
{
    "authorizationField": string,
    "preferIntrospection": bool
}
```

| Field | Description |
| :-- | :-- |
| `authorizationField` | Claim field name that is used to extract scopes for authorization. The default is `scope`. |
| `preferIntrospection` | If true, the introspection result (if defined) is used. |

#### `EnvironmentAwaredValue`

A regular string that allows values to be read from environment variables by specifying a URI with `env` scheme. For example, `env://MY_VAR` returns the value from the `MY_VAR` environment variable.

### Supported cipher suites

- `TLS_RSA_WITH_RC4_128_SHA`
- `TLS_RSA_WITH_3DES_EDE_CBC_SHA`
- `TLS_RSA_WITH_AES_128_CBC_SHA`
- `TLS_RSA_WITH_AES_256_CBC_SHA`
- `TLS_RSA_WITH_AES_128_CBC_SHA256`
- `TLS_RSA_WITH_AES_128_GCM_SHA256`
- `TLS_RSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_ECDSA_WITH_RC4_128_SHA`
- `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA`
- `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_RC4_128_SHA`
- `TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA`
- `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
- `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305`
- `TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305`

## OAuth2 Authz Server integration

You can view [examples on how to integrate Quorum Security Plugin with an OAuth2 Authorization Server](https://github.com/ConsenSys/quorum-security-plugin-enterprise/tree/master/examples).

## OAuth2 Scopes

Scope is a mechanism to limit a client's access to protected resources in a GoQuorum client RPC server. A client can request one or more scopes from a token endpoint of an OAuth2 Provider. The access token issued to the client is limited to the scopes granted.

The scope syntax is as follows:

```text
scope := "rpc://"rpc-string

rpc-string := service-name delimiter method-name

service-name := string

delimiter := "." or "_"

method-name := string
```

!!! example "Example scopes: Protecting APIs"

    | Scope                                      | Description                                                                                        |
    |:-------------------------------------------|:---------------------------------------------------------------------------------------------------|
    | `rpc://web3.clientVersion`                 | Allow access to the `web3_clientVersion` API.                                                      |
    | `rpc://eth_*` <br/>or `rpc://eth_`         | Allow access to all APIs under the `eth` namespace.                                                |
    | `rpc://*_version` <br/>or `rpc://_version` | Allow access to the `version` method of all namespaces. For example, `net_version`, `ssh_version`. |
