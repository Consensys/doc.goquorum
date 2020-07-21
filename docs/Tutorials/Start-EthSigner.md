---
description: Getting started with EthSigner
---

# Start EthSigner with a single signer

For file-based signing, EthSigner requires a V3 Keystore key file and a password file.

!!! tip
    EthSigner also supports signing transactions with a key stored in an external vault (for example,
    [Hashicorp Vault](../HowTo/Store-Keys/Use-Hashicorp.md)), or using [multiple V3 Keystore key files](../Tutorials/Multifile.md).

## Prerequisites

* [EthSigner](../HowTo/Get-Started/Install-Binaries.md)
* [Hyperledger Besu](https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Install-Binaries/)
* [Node.js](https://nodejs.org/en/download/)
* [web3.js](https://github.com/ethereum/web3.js/)

!!! note
    The Ethereum client used in this documentation is Hyperledger Besu but EthSigner can be used with any Ethereum client.

## Start Besu

[Start Besu](https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Starting-node/), setting the:

* [`--rpc-http-port`](https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-port) option to `8590`
* [`--data-path`](https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-data-path) option to an appropriate directory.

!!! example

    ```bash
    besu --network=dev --miner-enabled --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 --rpc-http-cors-origins="all" --host-whitelist="*" --rpc-http-enabled --rpc-http-port=8590 --data-path=/Users/<user.name>/Datadir
    ```

!!! important
    EthSigner requires a [chain ID](https://besu.hyperledger.org/en/stable/Concepts/NetworkID-And-ChainID/) to be
    used when signing transactions. The downstream Ethereum client must be operating in a milestone supporting replay
    protection. That is, the genesis file must include at least the Spurious Dragon milestone
    (defined as `eip158Block` in the genesis file) so the blockchain is using a chain ID.

## Create password and key files

Create a text file containing the password for the V3 Keystore key file to be created (for example, `passwordFile`).

Use the [web3.js library](https://github.com/ethereum/web3.js/) to create a key file where:

* `<AccountPrivateKey>` is the private key of the account with which EthSigner will sign transactions.

* `<Password>` is the password for the key file being created. The password must match the password saved in the
   password file created previously (`passwordFile` in this example).

!!! example

    === "Create Key File"

        ```javascript linenums="1"
        const Web3 = require('web3')

        // Web3 initialization (should point to the JSON-RPC endpoint)
        const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8590'))

        var V3KeyStore = web3.eth.accounts.encrypt("<AccountPrivateKey>", "<Password>");
        console.log(JSON.stringify(V3KeyStore));
        process.exit();
        ```

    === "Example"

        ```javascript linenums="1"
        const Web3 = require('web3')

        // Web3 initialization (should point to the JSON-RPC endpoint)
        const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8590'))

        var V3KeyStore = web3.eth.accounts.encrypt("0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", "password");
        console.log(JSON.stringify(V3KeyStore));
        process.exit();
        ```

Copy and paste the example JS script to a file (for example, `createKeyFile.js`) and replace the placeholders.

Use the JS script to display the text for the key file:

```bash
node createKeyFile.js
```

Copy and paste the text to a file (for example, `keyFile`). The file is your V3 Keystore key file.

## Start EthSigner

Start EthSigner with options specified as follows:

* `chain-id` is the chain ID specified in the Besu genesis file.

* `downstream-http-port` is the `rpc-http-port` specified for Besu (`8590` in this example).

* `key-file` and `password-file` are the key and password files [created above](#create-password-and-key-files).

!!! example

    ```
    ethsigner --chain-id=2018 --downstream-http-port=8590 file-based-signer --key-file=/mydirectory/keyFile --password-file=/mydirectory/passwordFile
    ```

If using a cloud-based Ethereum client such as [Infura], specify the endpoint using
the [`--downstream-http-host`](../Reference/CLI/CLI-Syntax.md#downstream-http-host) and
[`--downstream-http-path`](../Reference/CLI/CLI-Syntax.md#downstream-http-path) command line
options.

!!! example

    ```
    ethsigner --chain-id=5 --downstream-http-host=goerli.infura.io \
    --downstream-http-path=/v3/d0e63ca5bb1e4eef2284422efbc51a56 --downstream-http-port=443 \
    --downstream-http-tls-enabled file-based-signer --key-file=/mydirectory/keyFile \
    --password-file=/mydirectory/passwordFile
    ```

## Confirm EthSigner is up

Use the `upcheck` endpoint to confirm EthSigner is running.

!!! example

    === "curl HTTP request"

        ```bash
        curl -X GET http://127.0.0.1:8545/upcheck
        ```

    === "Result"

        ```json
        I'm up
        ```

## Confirm EthSigner passing requests to Besu

Request the current block number using [`eth_blockNumber`] with the EthSigner JSON-RPC endpoint
(`8545` in this example):

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":51}' http://127.0.0.1:8545
```

You can now [use EthSigner to sign transactions](../HowTo/Transactions/Make-Transactions.md) with
the key stored in the V3 Keystore key file.

[`eth_blockNumber`]:https://besu.hyperledger.org/en/stable/Reference/API-Methods/#eth_blocknumber

<!-- links -->
[Infura]: https://infura.io/
