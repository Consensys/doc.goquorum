---
description: web3js-quorum client library
---

# web3js-quorum client library

The [web3js-quorum library] adds a property to your web3 instance by extending [web3]. Use the library to
create and send RLP-encoded transactions using JSON-RPC.

The [web3js-quorum library] replaces the deprecated [quorum.js] and [web3js-eea] libraries, and includes
all the features of both libraries.

!!! important
    web3js-quorum supports GoQuorum JSON-RPC over HTTP only.

    Only the enclave connection can be configured over TLS.

!!! information

    If migrating to web3js-quorum, then update your Javascript code as indicated in the following examples.

    [Read the migration guide for more information about updating your code.](https://consensys.github.io/web3js-quorum/latest/tutorial-Migrate%20from%20quorum.js.html)

## Prerequisites

* [Node.js (version > 10)](https://nodejs.org/en/download/)
* [The web3 library must be installed in your project](https://github.com/ChainSafe/web3.js#installation)

## Add web3js-quorum to project

```bash
npm install web3js-quorum
```

## Initialize the web3js-quorum client

Initialize your client where:

* `<GoQuorum JSON-RPC HTTP endpoint>` is the JSON-RPC HTTP endpoint of your GoQuorum node.
* `<enclave key file path>` is the enclave public key file path, see [Tessera keys doc](https://docs.tessera.consensys.net/en/stable/HowTo/Generate-Keys/File-Stored-Keys/#store-keys-in-files)
* `<enclave TLS cert file path>` is the enclave TLS client certificate file path, see [Tessera TLS doc](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/TLS/)
* `<enclave TLS CA cert file path>` is the enclave TLS certification authority (CA) certificate file path, see [Tessera TLS doc](https://docs.tessera.consensys.net/en/stable/HowTo/Configure/TLS/)
* `<Enclave IPC Path>` is the enclave IPC Unix socket path
* `<Enclave Private URL>` is the enclave HTTP endpoint

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

        !!! note
            IPC and HTTP are exclusive. Choose one or the other depending on your needs.

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

        !!! note
            If IPC is enabled with `ipcPath`, HTTP `privateUrl` and TLS options should not be used.

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

        !!! note
            If HTTP is enabled with `privateUrl`, `ipcPath` options should not be used.

    === "HTTP + enclave TLS example"

        ```js
        const Web3 = require("web3");
        const Web3Quorum = require("web3js-quorum");
        const fs = require('fs');

        const isQuorum = true;
        const keyFileBuffer = fs.readFileSync("./key-file");
        const certFileBuffer = fs.readFileSync("./cert-file");
        const caCertFileBuffer = fs.readFileSync("./ca-cert-file");

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

        !!! note
            If HTTPS is enabled with `privateUrl` and TLS options, `ipcPath` options should not be used.

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
