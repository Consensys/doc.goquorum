---
description: deploying smart contracts
---

# Deploy a smart contract

This tutorial shows you how to deploy smart contracts as transactions onto a running network.
Use the [Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Getting-Started.md) to rapidly generate a local blockchain network.

## Prerequisites

* A [private network](../Private-Network/Create-IBFT-Network.md) if deploying a public contract.
* A [privacy-enabled network](../Create-Privacy-enabled-network.md) if deploying a private contract
    (public contracts can also be deployed on privacy-enabled networks).

!!! note

    You can use the Quorum Developer Quickstart to deploy either public contracts or private contracts.
    To enable privacy, enter `Y` at the prompt for private transactions.

## Compile the contract

You first need to create a smart contract.
The following examples use the
[`SimpleStorage.sol`](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/common/smart_contracts/contracts/SimpleStorage.sol)
smart contract.

Create a new file called `compile.js` with the following content:

!!! example "compile.js"

    ```js
    const fs = require('fs').promises;
    const solc = require('solc');

    async function main() {
      // Load the contract source code
      const sourceCode = await fs.readFile('SimpleStorage.sol', 'utf8');
      // Compile the source code and retrieve the ABI and bytecode
      const { abi, bytecode } = compile(sourceCode, 'SimpleStorage');
      // Store the ABI and bytecode into a JSON file
      const artifact = JSON.stringify({ abi, bytecode }, null, 2);
      await fs.writeFile('SimpleStorage.json', artifact);
    }

    function compile(sourceCode, contractName) {
      // Create the Solidity Compiler Standard Input and Output JSON
      const input = {
        language: 'Solidity',
        sources: { main: { content: sourceCode } },
        settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
      };
      // Parse the compiler output to retrieve the ABI and bytecode
      const output = solc.compile(JSON.stringify(input));
      const artifact = JSON.parse(output).contracts.main[contractName];
      return {
        abi: artifact.abi,
        bytecode: artifact.evm.bytecode.object,
      };
    }

    main().then(() => process.exit(0));
    ```

Run the compile code to get the smart contract's output JSON:

```bash
node compile.js
```

Run `solc` to get the contract's bytecode and ABI:

```bash
solc SimpleStorage.sol --bin --abi
```

Once you have the bytecode and ABI, you can rename the output files to make them easier to use.
This tutorial refers to them as `SimpleStorage.bin` and `SimpleStorage.abi`.
You can now deploy this contract to a network as a public or private transaction.

## Public contracts

### 1. Using `eth_sendTransaction`

Call [`eth_sendTransaction`](https://eth.wiki/json-rpc/API) with the following parameters:

* `from` - Address of the sender's account.
* `to` - Address of the receiver. To deploy a contract, set to `null`.
* `gas` - Amount of gas provided by the sender for the transaction.
* `gasPrice` - Price for each unit of gas. [Set to zero](../../Concepts/FreeGasNetwork.md) in GoQuorum networks.
* `data` - One of the following:
    * For contract deployments (this use case), the [compiled binary of the contract](#compile-the-contract).
    * For contract interactions, the hash of the invoked method signature and encoded parameters
      (see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html)).
    * For simple ether transfers, empty.

!!! example "Example eth_sendTransaction curl HTTP request"

    ```bash
    curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0xf0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5", "to":null, "gas":"0x24A22","gasPrice":"0x0", "data":"0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"}], "id":1}' -H 'Content-Type: application/json' http://localhost:20000
    ```

If using the [Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md), use the `from` address and
RPC endoint of Member1.

### 2. Using `web3.eth.Contract`

Using the outputs from [compiling the contract](#compile-the-contract), create a new file
`public_tx_web3.js` (or run the following commands in a JavaScript console) to send the transaction.
The example code uses the
[Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md) and sends the
transaction from Member1.

!!! example "public_tx_web3.js"

    ```js
    const path = require('path');
    const fs = require('fs-extra');
    const web3 = new Web3(host);
    // use the existing Member1 account address or make a new account
    const address = "f0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5";

    // read in the contracts
    const contractJsonPath = path.resolve(__dirname, 'SimpleStorage.json');
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
    const contractAbi = contractJson.abi;
    const contractByteCode = contractJson.evm.bytecode.object

    async function createContract(host, contractAbi, contractByteCode, contractInit, fromAddress) {
      const web3 = new Web3(host)
      const contractInstance = new web3.eth.Contract(contractAbi);
      const ci = await contractInstance
        .deploy({ data: '0x'+contractByteCode, arguments: [contractInit] })
        .send({ from: fromAddress, gasLimit: "0x24A22" })
        .on('transactionHash', function(hash){
          console.log("The transaction hash is: " + hash);
        });
      return ci;
    };

    // create the contract
    async function main(){
      // using Member1 to send the transaction from
      createContract("http://localhost:20000", contractAbi, contractByteCode, 47, address)
      .then(async function(ci){
        console.log("Address of transaction: ", ci.options.address);
      })
     .catch(console.error);

    }
    ```

!!! info

    This example uses the [web3js](https://www.npmjs.com/package/web3) library and the
    [`web3.eth.Contract`](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html) object
    to interact with smart contracts on the chain.
    Once the contract object is created, you give it the JSON interface of the smart contract and the library converts the
    calls into low level ABI calls over RPC for you.
    This benefits you as a developer as it allows you to interact with smart contracts as if they were JavaScript objects.

### 3. Using `eth_sendSignedTransaction`

To deploy a smart contract using
[`eth_sendSignedTransaction`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#sendsignedtransaction), use an
account's private key to sign and serialize the transaction, and send the API request.
This example uses the [web3js](https://www.npmjs.com/package/web3) library to make the API calls and the outputs
from [compiling the contract](#compile-the-contract).

Create a new file `public_tx.js`(or run the following commands in a JavaScript console) to send the transaction.

!!! example "public_tx.js"

    ```js
    const web3 = new Web3("http://localhost:20000");
    // use an existing account or make a new account
    const privateKey = "b9a4bd1539c15bcc83fa9078fe89200b6e9e802ae992f13cd83c853f16e8bed4";
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // read in the contracts
    const contractJsonPath = path.resolve(__dirname, 'SimpleStorage.json');
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
    const contractAbi = contractJson.abi;
    const contractBinPath = path.resolve(__dirname,'SimpleStorage.bin');
    const contractBin = fs.readFileSync(contractBinPath);
    // initialize the default constructor with a value `47 = 0x2F`; this value is appended to the bytecode
    const contractConstructorInit = "000000000000000000000000000000000000000000000000000000000000002F";

    // get txnCount for the nonce value
    const txnCount = await web3.eth.getTransactionCount(account.address);

    const rawTxOptions = {
      nonce: web3.utils.numberToHex(txnCount),
      from: account.address,
      to: null, // public tx
      value: "0x00",
      data: '0x'+contractBin+contractInit, // contract binary appended with initialization value
      gasPrice: "0x0", // Set to 0 in GoQuorum networks
      gasLimit: "0x24A22" // max number of gas units the tx is allowed to use
    };
    console.log("Creating transaction...");
    const tx = new Tx(rawTxOptions);
    console.log("Signing transaction...");
    tx.sign(privateKey);
    console.log("Sending transaction...");
    var serializedTx = tx.serialize();
    const txr = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
    console.log("tx transactionHash: " + txr.transactionHash);
    console.log("tx contractAddress: " + txr.contractAddress);
    ```

`rawTxOptions` contains the following fields:

* `nonce` - Number of transactions sent from this address.
* `from` - Address of the EthSigner account.
* `to` - Address of the receiver. To deploy a contract, set to `null`.
* `gas` - Amount of gas provided by the sender for the transaction.
* `gasPrice` - Price for each unit of gas. [Set to zero](../../Concepts/FreeGasNetwork.md) in GoQuorum networks.
* `data` - Binary of the contract (in this example there's also a constructor initialization value appended to the binary value).
* `value` - Amount of ETH in Wei transferred from the sender to the recipient.

As the example demonstrates, once the transaction `tx` is created, you can sign it with the private key of the account.
You can then serialize it and call `eth_sendSignedTransaction` to deploy the contract.

For reference, the Developer Quickstart provides an
[example of a public transaction script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goquorum/smart_contracts/scripts/public_tx.js).

## Private contracts

### 1. Using `eth_sendTransaction`

Call [`eth_sendTransaction`](https://eth.wiki/json-rpc/API) with the following parameters:

* `from` - Address of the sender's account.
* `to` - Address of the receiver. To deploy a contract, set to `null`.
* `gas` - Amount of gas provided by the sender for the transaction.
* `gasPrice` - Price for each unit of gas. [Set to zero](../../Concepts/FreeGasNetwork.md) in GoQuorum networks.
* `privateFrom` - The sender's base-64-encoded public key.
* `privateFor` - Array of the recipient's base-64-encoded public keys.
* `privacyFlag` - 0 for standard private, 1 for [counter party protection](../../Concepts/Privacy/PrivacyEnhancements.md#counter-party-protection).
  and 3 for [private state validation](../../Concepts/Privacy/PrivacyEnhancements.md#private-state-validation).
* `data` - One of the following:
    * For contract deployments (this use case), the [compiled binary of the contract](#compile-the-contract).
    * For contract interactions, the hash of the invoked method signature and encoded parameters
      (see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html)).
    * For simple ether transfers, empty.

!!! example "Example eth_sendTransaction curl HTTP request"

    ```bash
    curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0xf0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5", "to":null, "gas":"0x24A22","gasPrice":"0x0", "privateFrom": "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=", "privateFor": ["1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="], "privacyFlag": 0,"data":"0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"}], "id":1}' -H 'Content-Type: application/json' http://localhost:20000
    ```

If using the [Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md), use the `from` address and
RPC endoint of Member1.

### 2. Using `web3.eth.Contract`

Using the outputs from [compiling the contract](#compile-the-contract), create a new file
`private_tx_web3.js` (or run the following commands in a JavaScript console) to send the transaction.
The example code uses the
[Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md) and sends the
transaction from Member1.

!!! example "private_tx_web3.js"

    ```js
    const path = require('path');
    const fs = require('fs-extra');
    const web3 = new Web3(host);
    // use the existing Member1 account or make a new account
    const privateKey = "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";

    // read in the contracts
    const contractJsonPath = path.resolve(__dirname, 'SimpleStorage.json');
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
    const contractAbi = contractJson.abi;
    const contractByteCode = contractJson.evm.bytecode.object

    async function createContract(host, contractAbi, contractByteCode, contractInit, fromAddress, toPublicKey) {
      const web3 = new Web3(host)
      const contractInstance = new web3.eth.Contract(contractAbi);
      const ci = await contractInstance
        .deploy({ data: '0x'+contractByteCode, arguments: [contractInit] })
        .send({ from: fromAddress, privateFor: [toPublicKey], gasLimit: "0x24A22" })
        .on('transactionHash', function(hash){
          console.log("The transaction hash is: " + hash);
        });
      return ci;
    };

    // create the contract
    async function main(){
      // sending the transaction from Member1 to Member3
      createContract("http://localhost:20000", contractAbi, contractByteCode, 47, "f0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5", "1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg=")
      .then(async function(ci){
        console.log("Address of transaction: ", ci.options.address);
      })
     .catch(console.error);

    }
    ```

For reference, the Developer Quickstart provides an
[example of a private transaction script using web3](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goquorum/smart_contracts/scripts/private_tx_web3.js).

### 3. Using `priv.generateAndSendRawTransaction`

This example uses the [web3js-quorum](https://www.npmjs.com/package/web3js-quorum) library to make the
[`priv.generateAndSendRawTransaction`](https://consensys.github.io/web3js-quorum/latest/module-priv.html#~generateAndSendRawTransaction)
API call.
Create a new file `private_tx_web3js_quorum.js`(or run the following commands in a JavaScript console) to send the transaction.

!!! example "private_tx_web3js_quorum.js"

    ```js
    const Web3 = require('web3');
    const Web3Quorum = require('web3js-quorum');

    // read in the contracts
    const contractJsonPath = path.resolve(__dirname, 'SimpleStorage.json');
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
    const contractAbi = contractJson.abi;
    const contractBinPath = path.resolve(__dirname,'SimpleStorage.bin');
    const contractBin = fs.readFileSync(contractBinPath);
    // initialize the default constructor with a value `47 = 0x2F`; this value is appended to the bytecode
    const contractConstructorInit = "000000000000000000000000000000000000000000000000000000000000002F";

    // account details
    // unlock the account so you can sign the tx
    const accountKeyPath = path.resolve(__dirname, '../../','config/quorum/networkFiles/member1/accountkey');
    const accountKey = JSON.parse(fs.readFileSync(accountKeyPath));
    const signingAccount = web3.eth.accounts.decrypt(accountKey, "");

    const web3 = new Web3("http://localhost:20000");
    const web3quorum = new Web3Quorum(web3, {privateUrl: client.privateUrl}, true);

    // get the nonce for the accountAddress
    const accountAddress = client.accountAddress;
    const txCount = await web3.eth.getTransactionCount(`0x${accountAddress}`);

    const txOptions = {
      nonce: txCount,
      gasPrice: 0, // Set to 0 in GoQuorum networks
      gasLimit: 0x24A22, //max number of gas units the tx is allowed to use
      value: 0,
      data: '0x'+contractBin+contractConstructorInit,
      from: signingAccount,
      isPrivate: true,
      privateKey: fromPrivateKey,
      privateFrom: fromPublicKey,
      privateFor: [toPublicKey]
    };
    console.log("Creating contract...");
    const txHash = await web3quorum.priv.generateAndSendRawTransaction(txOptions);
    console.log("Getting contractAddress from txHash: ", txHash);
    console.log("Private Transaction Receipt: ", txHash.contractAddress);
    ```

`txOptions` contains the following fields:

* `nonce` - Number of transactions sent from this address.
* `from` - Address of the EthSigner account.
* `gasLimit` - Amount of gas provided by the sender for the transaction.
* `gasPrice` - Price for each unit of gas. [Set to zero](../../Concepts/FreeGasNetwork.md) in GoQuorum networks.
* `isPrivate` - Indicates that this is a private transaction.
* `privateKey` - The sender's GoQuorum node private key.
* `privateFrom` - The sender's base-64-encoded public key.
* `privateFor` - Array of the recipient's base-64-encoded public keys.
* `data` - Binary of the contract (in this example there's also a constructor initialization value appended to the binary value).

For reference, the Developer Quickstart provides an
[example of a private transaction script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goquorum/smart_contracts/scripts/private_tx.js).
