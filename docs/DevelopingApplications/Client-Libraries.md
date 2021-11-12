---
description: GoQuorum client libraries
---

# Client Libraries

GoQuorum supports common smart contract and Dapp development, deployment, and operational use cases, using tools such as
[Truffle](https://trufflesuite.com/),  [web3.js] and
[web3js-quorum](https://consensys.github.io/web3js-quorum/latest/index.html). The client supports common
[JSON-RPC API](./JSON-RPC-APIs.md) methods such as eth, net, web3, debug, miner, etc

## Prerequisites

* [Node.js (version > 10)](https://nodejs.org/en/download/)
* [The web3 library must be installed in your project](https://github.com/ChainSafe/web3.js#installation)
* A [private network](../Tutorials/Private-Network/Create-IBFT-Network.md) if deploying a public contract.
* A [privacy-enabled network](../Tutorials/Create-Privacy-enabled-network.md) if deploying a private contract
    (public contracts can also be deployed on privacy-enabled networks).

!!! note

    You can use the Quorum Developer Quickstart to deploy either public contracts or private contracts.
    To enable privacy, enter `Y` at the prompt for private transactions.

# web3

[Web3.js] is the most widely used library for developing applications.

## Add web3 to project

```bash
npm install web3
```

## Initialize the web3 client

Initialize your client where:

* `<GoQuorum JSON-RPC HTTP endpoint>` is the JSON-RPC HTTP endpoint of your GoQuorum node.

!!! example "Example connection"

    === "HTTP example"

        ```js
        const Web3 = require("web3");
        const web3 = new Web3("http://some.local.remote.endpoint:8545");
        ```
    === "WS example"

        ```js
        const Web3 = require("web3");
        const web3 = new Web3("http://some.local.remote.endpoint:8546");
        ```

## Deploying a contract

To deploy a private contract, you need the contract binary. You can use
[Solidity](https://solidity.readthedocs.io/en/develop/using-the-compiler.html) to get the
contract binary.

!!! example "Deploying a contract with `Contract.deploy`"

    ```js
    myContract.deploy({
        data: '0x12345...',
        arguments: [123, 'My String']
    })
    .send({
        from: '0x1234567890123456789012345678901234567891',
        gas: 1500000,
        gasPrice: '30000000000000'
    }, function(error, transactionHash){ ... })
    .on('error', function(error){ ... })
    .on('transactionHash', function(transactionHash){ ... })
    .on('receipt', function(receipt){
       console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function(confirmationNumber, receipt){ ... })
    .then(function(newContractInstance){
        console.log(newContractInstance.options.address) // instance with the new contract address
    });
    ```

Alternatively, you can also deploy a contract via `eth.sendSignedTransaction`

    ```js
      const rawTxOptions = {
        nonce: "0x00",
        from: account.address,
        to: null, //public tx
        value: "0x00",
        data: '0x'+contractBin+contractConstructorInit,
        gasPrice: "0x0", //ETH per unit of gas
        gasLimit: "0x24A22" //max number of gas units the tx is allowed to use
      };
      console.log("Creating transaction...");
      const tx = new Tx(rawTxOptions);
      console.log("Signing transaction...");
      tx.sign(Buffer.from(account.privateKey.substring(2), "hex"));
      console.log("Sending transaction...");
      var serializedTx = tx.serialize();
      const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
      console.log("tx transactionHash: " + pTx.transactionHash);
      console.log("tx contractAddress: " + pTx.contractAddress);
      return pTx;
    ```

## web3 methods

For more information about the web3 methods, see the
[web3 reference documentation](https://web3js.readthedocs.io/en/v1.5.2/).

# web3js-quorum

The [web3js-quorum library] extends web3.js and adds supports for GoQuorum specific JSON-RPC APIs and features.

!!! note

    The web3js-quorum library replaces the deprecated [quorum.js] and [web3js-eea] libraries, and includes all the
    features of both libraries.

!!! important
    web3js-quorum supports GoQuorum JSON-RPC over HTTP only.

    Only the enclave connection can be configured over TLS.

!!! information

    If migrating to web3js-quorum, then update your Javascript code as indicated in the following examples.

    [Read the migration guide for more information about updating your code.](https://consensys.github.io/web3js-quorum/latest/tutorial-Migrate%20from%20quorum.js.html)

## Add web3js-quorum to project

```bash
npm install web3js-quorum
```

## Initialize the web3js-quorum client

Initialize your client where:

* `<GoQuorum JSON-RPC HTTP endpoint>` is the JSON-RPC HTTP endpoint of your GoQuorum node.
* `<Enclave IPC Path>` is the enclave IPC Unix socket path.
* `<Enclave Private URL>` is the enclave HTTP endpoint.
* `<enclave key file path>` is the enclave public key file path (see [Tessera keys documentation](https://docs.tessera.consensys.net/en/stable/HowTo/Generate-Keys/File-Stored-Keys/#store-keys-in-files)).
* `<enclave TLS cert file path>` is the enclave TLS client certificate file path (see [Tessera TLS documentation](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/TLS/)).
* `<enclave TLS CA cert file path>` is the enclave TLS certification authority (CA) certificate file path (see [Tessera TLS documentation](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/TLS/)).

!!! example "Example connection"

    === "Full syntax"

        ```js
        const Web3 = require("web3");
        const Web3Quorum = require("web3js-quorum");
        const fs = require('fs');

        const isQuorum = true;
        const keyFileBuffer = fs.readFileSync("<enclave key file path>");
        const certFileBuffer = fs.readFileSync("<enclave TLS cert file path>");
        const caCertFileBuffer = fs.readFileSync("<enclave TLS CA cert file path>");
        const enclaveOptions = {
          ipcPath: "<Enclave IPC Path>",
          privateUrl: "<Enclave Private URL>",
          tlsSettings: {
            key: keyFileBuffer,
            clcert: certFileBuffer,
            cacert: caCertFileBuffer,
            allowInsecure: true | false
          }
        };

        const web3 = new Web3Quorum(new Web3("<GoQuorum JSON-RPC HTTP endpoint>"),
          enclaveOptions, isQuorum);
        ```

        !!! important
            IPC and HTTP are mutually exclusive. Choose one or the other depending on your needs.

    === "IPC example"

        ```js
        const Web3 = require("web3");
        const Web3Quorum = require("web3js-quorum");

        const isQuorum = true;
        const enclaveOptions = {
          ipcPath: "unix:/tmp/enclave.ipc"
        };

        const web3 = new Web3Quorum(new Web3("http://localhost:8545"),
          enclaveOptions, isQuorum);
        ```

        !!! important
            If IPC is enabled with `ipcPath`, then HTTP `privateUrl` and TLS options will be ignored.

    === "HTTP example"

        ```js
        const Web3 = require("web3");
        const Web3Quorum = require("web3js-quorum");

        const isQuorum = true;
        const enclaveOptions = {
          privateUrl: "http://localhost:9081"
        };

        const web3 = new Web3Quorum(new Web3("http://localhost:8545"),
          enclaveOptions, isQuorum);
        ```

        !!! important
            If HTTP is enabled with `privateUrl`, then `ipcPath` options should not be used.

    === "HTTP + enclave TLS example"

        ```js
        const Web3 = require("web3");
        const Web3Quorum = require("web3js-quorum");
        const fs = require('fs');

        const isQuorum = true;
        const keyFileBuffer = fs.readFileSync("./cert.key");
        const certFileBuffer = fs.readFileSync("./cert.pem");
        const caCertFileBuffer = fs.readFileSync("./ca-cert.pem");

        const enclaveOptions = {
          privateUrl: "https://localhost:9081",
          tlsSettings: {
            key: keyFileBuffer,
            clcert: certFileBuffer,
            cacert: caCertFileBuffer,
            allowInsecure: false
          }
        };

        const web3 = new Web3Quorum(new Web3("http://localhost:8545"),
          enclaveOptions, isQuorum);
        ```

        !!! important
            * `allowInsecure: false` forces the private transaction manager's certificate to be verified.

                Setting `allowInsecure: true` disables the private transaction manager's certificate verification and allows
                self-signed certificates.

            * If HTTPS is enabled with `privateUrl` and TLS options, then `ipcPath` options should not be used.

## Deploying a contract with `generateAndSendRawTransaction`

To deploy a private contract, you need the contract binary. You can use
[Solidity](https://solidity.readthedocs.io/en/develop/using-the-compiler.html) to get the
contract binary.

!!! example "Deploying a contract with `web3.priv.generateAndSendRawTransaction`"

    ```js
    const contractOptions = {
      data: `0x123`, // contract binary
      privateFrom: "tesseraNode1PublicKey",
      privateFor: ["tesseraNode3PublicKey"],
      privateKey: "goquorumNode1PrivateKey"
    };
    return web3.priv.generateAndSendRawTransaction(contractOptions);
    ```

`web3.priv.generateAndSendRawTransaction(contractOptions)` returns the transaction hash. To get the private
transaction receipt, use `web3.priv.waitForTransactionReceipt(txHash)`.

## web3js-quorum methods

For more information about the web3js-quorum methods, see the
[web3js-quorum reference documentation](https://consensys.github.io/web3js-quorum/latest/index.html).

[web3js-quorum library]: https://github.com/ConsenSys/web3js-quorum
[web3]: https://github.com/ethereum/web3.js/
[quorum.js]: https://github.com/ConsenSys/quorum.js
[web3js-eea]: https://github.com/ConsenSys/web3js-eea
