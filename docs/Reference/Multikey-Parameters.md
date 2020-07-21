---
description: TOML file parameters for multi signers.
---

# Multikey Parameters

The optional `[metadata]` section in the TOML files contains data that is not
required by EthSigner. The `[signing]` section contains the parameters required
for the signing type.

!!! important
    All parameters in the `[signing]` section are mandatory.

## File-based Signing

!!! example

    ```
    [metadata]
    createdAt = 1994-11-05T08:15:30-05:00
    description = "Example of a File based configuration"

    [signing]
    type = "file-based-signer"
    key-file = "/Users/me/project/78e6e236592597c09d5c137c2af40aecd42d12a2.key"
    password-file = "/Users/me/project/78e6e236592597c09d5c137c2af40aecd42d12a2.password"
    ```

!!! note
    EthSigner supports absolute paths or relative paths when specifying
    `key-file` and `password-file`. Relative paths are relative to
    the directory specified in the [`multikey-signer --directory`](../Reference/CLI/CLI-Syntax.md#multikey-options) subcommand.

| Key                  | Description                           |
|----------------------|---------------------------------------|
| **type**             | Type of key signing. Use `file-based-signer`|
| **key-file**         | V3 keystore file containing the [key with which transactions are signed](../Tutorials/Multifile.md#create-password-and-key-files) |
| **password-file**    | File containing the password for the [key with which transactions are signed](../Tutorials/Multifile.md#create-password-and-key-files).    |

## Hashicorp Vault Signing

!!! example

    ```
    [metadata]
    createdAt = 2019-07-01T12:11:30Z
    description = "Example of a valid Hashicorp based configuration"

    [signing]
    type = "hashicorp-signer"
    signing-key-path = "/secret/data/ethsignerKey"
    host = "localhost"
    port = 9001
    auth-file = "/Users/me/project/hashicorp_auth"
    timeout = 500
    tls-known-server-file = "/Users/me/project/knownHashicorpServers"
    ```

!!! note
    EthSigner supports an absolute path or relative path when specifying
    `auth-file`. The relative path is relative to the directory specified
    in the [`multikey-signer --directory`](../Reference/CLI/CLI-Syntax.md#multikey-options) subcommand.

| Key                  | Description                           |
|----------------------|---------------------------------------|
| **type**             | Type of key signing. Use `hashicorp-signer`|
| **signing-key-path** | Path to secret in the Hashicorp Vault containing the private key for signing transactions |
| **host**             | Host of the Hashicorp Vault server  |
| **port**             | Port of the Hashicorp Vault server  |
| **auth-file**        | File containing authentication data for Hashicorp Vault. The authentication data is the [root token displayed by the Hashicorp Vault server](../HowTo/Store-Keys/Use-Hashicorp.md#storing-private-key-in-hashcorp-vault)    |
| **timeout**    | Timeout in milliseconds for requests to the Hashicorp Vault server    |
| **tls-enabled**      | [Enable or disable TLS](../Concepts/TLS.md). Defaults to `true` |
| **tls-known-server-file**  | Path to the file containing a list of [trusted Hashicorp Vault servers](../HowTo/Store-Keys/Use-Hashicorp.md#create-the-known-servers-file) |

## Azure Key Vault Signing

!!! example

    ```
    [metadata]
    createdAt = 2011-11-01T12:15:30Z
    description = "Example of an Azure Key Vault based configuration"

    [signing]
    type = "azure-signer"
    key-vault-name = "AzureKeyVault"
    key-name = "ethsignerKey"
    key-version = "7c01fe58d68148bba5824ce418241092"
    client-id = "47efee5c-8079-4b48-31bb4f2e9a22"
    client-secret = "TW_3Uc/HLPdpLp5*om@MGcd1T29MuP*5"
    ```

| Key                  | Description                           |
|----------------------|---------------------------------------|
| **type**             | Type of key signing. Use `azure-signer`|
| **key-vault-name**   | Name of the vault to access. Sub-domain of `vault.azure.net` |
| **key-name**         | Name of key to be used |
| **key-version**      | Version of the specified key |
| **client-id**        | ID used to authenticate with Azure Key Vault |
| **client-secret**    | Secret used to access the vault |
