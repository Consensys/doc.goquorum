---
description: Signing transactions with key stored in Azure Key Vault
---

# Using EthSigner with Azure Key Vault

EthSigner supports storing the signing key in an [Azure Key Vault](https://azure.microsoft.com/en-au/services/key-vault/).

## Storing private key in Azure Key Vault

Create a SECP256k1 key in the [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/)
and register EthSigner as an application for the key.

Take note of the following to specify when starting EthSigner:

* Key vault name
* Key name
* Key version
* Client ID
* File containing client secret for the client ID

## Start Besu

[Start Besu](https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Starting-node/) with the
[`--rpc-http-port`](https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-port)
option set to `8590` to avoid conflict with the default EthSigner listening port (`8545`).

!!! example

    ```bash
    besu --network=dev --miner-enabled --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 --rpc-http-cors-origins="all" --host-whitelist=* --rpc-http-enabled --rpc-http-port=8590 --data-path=/tmp/tmpDatdir
    ```

!!! important
    EthSigner requires a [chain ID](https://besu.hyperledger.org/en/stable/Concepts/NetworkID-And-ChainID/) to be
    used when signing transactions. The downstream Ethereum client must be operating in a milestone supporting replay
    protection. That is, the genesis file must include at least the Spurious Dragon milestone
    (defined as `eip158Block` in the genesis file) so the blockchain is using a chain ID.

## Start EthSigner with Azure Key Vault signing

Start EthSigner.

!!! example

    ```bash
    ethsigner --chain-id=2018 --downstream-http-port=8590 azure-signer --client-id=<ClientID> --client-secret-path=mypath/mysecretfile --key-name=<KeyName> --key-version=<KeyVersion> --keyvault-name=<KeyVaultName>
    ```

!!! warning "Important"
    Use the [--http-listen-port](../../Reference/CLI/CLI-Syntax.md#http-listen-port) option to change the
    EthSigner listening port if `8545` is in use.

You can now [use EthSigner to sign transactions](../Transactions/Make-Transactions.md) with the key
stored in the Azure Key Vault.
