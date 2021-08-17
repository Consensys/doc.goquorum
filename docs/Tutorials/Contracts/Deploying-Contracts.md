---
description: deploying smart contracts
---

# Deploying smart contracts to an Ethereum chain

This tutorial shows you how to deploy smart contracts as transactions onto a running network. Use the
[Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md) to rapidly generate 
a local blockchain network.

## Prerequisites

* A [private network](../Private-Network/Create-IBFT-Network.md) if deploying a public contract.

* A [privacy-enabled network](../Create-Privacy-enabled-network.md) if deploying a private contract
    (Public contracts can also be deployed on privacy-enabled networks).

Please note, that the [Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md)
caters to both scenarios above. To enable privacy, select and `y` for
[private transactions](../../Concepts/Privacy/Privacy.md).

## Compile the contract 

The first step in this process is to create a smart contract. For the examples that follow
we are using the
[`SimpleStorage.sol`](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/common/smart_contracts/contracts/SimpleStorage.sol)
smart contract as an example that we compile and get the binary and JSON output that we use
to deploy the contract to the network. 

Start with creating a new file called `compile.js` with the contents below, and then compile
the contract to get its bytecode using `solc`:

```js
// compile.js

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

Run the compile code to get the smart contracts output JSON:

```bash
node compile.js
```

To get the contracts binary and ABI, run `solc` like so:

```bash
solc SimpleStorage.sol --bin --abi
```

Once you have the bytecode and ABI, you can rename the output files to make it a little easier to use, and
we refer to them as SimpleStorage.bin and SimpleStorage.abi from here on. We can now deploy this contract to
a network as a public transaction or as a private transaction.

## Public Contracts

### 1. Using `eth_sendTransaction` 

Use [`eth_sendTransaction`](https://eth.wiki/json-rpc/API) and pass the following parameters to the API call

```json
params: {
  "from": "0xf0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5",
  "to": null,
  "gas": "0x24A22",
  "gasPrice": "0x0",
  "data": "0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"
}
```

The parameters are:

* `to` - address of the receiver. To deploy a contract, set to `null`.
* `from` - address of the sender's account. For example `0x9b790656b9ec0db1936ed84b3bea605873558198`.
* `gas` - amount of gas provided by the sender for the transaction
* `gasPrice` - price for each unit of gas the sender is willing to pay
* `data` - one of the following:
    * For contract deployments (this use case) - compiled binary of the contract from the [compiling the contract](#compile-the-contract) step
    * For contract interactions - hash of the invoked method signature and encoded parameters
      (see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html))
    * For simple ether transfers - empty

Make the request via curl like so:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0xf0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5", "to":null, "gas":"0x24A22","gasPrice":"0x0", "data":"0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"}], "id":1}' -H 'Content-Type: application/json' http://localhost:20000
```

where the `from` address as well as the RPC endoint of `http://localhost:20000` are that of Member1 if
using the [Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md). Please 
update your request according to your environment.

### 2. Using `web3.eth.Contract` from [web3](https://www.npmjs.com/package/web3)

Using the outputs from [compiling the contract](#compile-the-contract), create a new file
`public_tx_web3.js`(or run the commands below in a JavaScript console) to send the transaction.
In the code below we are using the
[Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md) and sending the
transaction from Member1. 

We use the [web3js](https://www.npmjs.com/package/web3) library and the
[web3.eth.Contract](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html) object
to interact with smart contracts on the chain. Once the contract object is created, you
essentially give it the JSON interface of the smart contract and the library converts the
calls into low level ABI calls over RPC for you. The benefit of this for you as a developer
is that this allows you to interact with smart contracts as if they were JavaScript objects.

```js
// public_tx_web3.js

const path = require('path');
const fs = require('fs-extra');
const web3 = new Web3(host);
//use an exsiting Member1 account address, alternatively you can make an account
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

### 3. Using `eth_sendSignedTransaction`

To deploy a smart contract using
[`eth_sendSignedTransaction`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#sendsignedtransaction), use an
account's private key to sign and serialize the transaction, and send the API request.

This example uses the [web3js](https://www.npmjs.com/package/web3) library to make the API calls and the outputs
from [compiling the contract](#compile-the-contract). Create a new file `public_tx.js`(or run the commands
below in a JavaScript console) to send the transaction. 

The Developer Quickstart provides an
[example of a public transaction script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goQuorum/smart_contracts/scripts/public_tx.js).

```js
// public_tx.js

const web3 = new Web3("http://localhost:20000");
//use an exsiting account, alternatively you can make an account
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
  to: null, //public tx
  value: "0x00",
  data: '0x'+contractBin+contractInit, // contract binary appended with initialization value
  gasPrice: "0x0", //ETH per unit of gas
  gasLimit: "0x24A22" //max number of gas units the tx is allowed to use
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

* `nonce` - the number of transactions sent from an address.
* `from` - address of the EthSigner account. For example `0xfe3b557e8fb62b89f4916b721be55ceb828dbd73`.
* `to` - address of the receiver. To deploy a contract, set to `null`.
* `gas` - amount of gas provided by the sender for the transaction.
* `gasPrice` - price for each unit of gas the sender is willing to pay.
* `data` - binary of the contract (in this example there's also a constructor initialization value,
    so we append that to the binary value).
* `value` - amount of Ether/Wei transferred from the sender to the recipient.

As the example demonstrates, once the transaction `tx` is created, you can sign it with the private
key of the account. You can then serialize it and call `eth_sendSignedTransaction` to deploy the
contract.

## Private Contracts

### 1. Using `eth_sendTransaction` 

As with the [public transaction](#using-eth_sendTransaction ) this one is very similar and has a few more
parameters for the privacy part of the transaction namely `privateFrom, privateFor and privacyFlag (optional)`.

```json
params: {
  "from": "0xf0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5",
  "to": null,
  "gas": "0x24A22",
  "gasPrice": "0x0",
  "privateFrom": "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=", //sender's base-64 encoded public keys ie Member1
  "privateFor": ["1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="], // receipient's base-64 encoded public keys ie Member3
  "privacyFlag": 0, // standard private
  "data": "0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"
}
```

The parameters are as before with a few new parameters for privacy:

* `to` - address of the receiver. To deploy a contract, set to `null`.
* `from` - address of the EthSigner account. For example `0x9b790656b9ec0db1936ed84b3bea605873558198`.
* `gas` - amount of gas provided by the sender for the transaction
* `gasPrice` - price for each unit of gas the sender is willing to pay
* `privateFrom` - the sender's base-64 encoded public keys
* `privateFor` - an array of the receipient's base-64 encoded public keys
* `privacyFlag` - 0 for standard private, 1 for Counter Party Protection and 3 for Private State Validation. Please
 refer to [Privacy Enhancements]((../../Concepts/Privacy/PrivacyEnhancements.md)) for more information.
* `data` - one of the following:
    * For contract deployments (this use case) - compiled binary of the contract from the [compiling the contract](#compile-the-contract) step
    * For contract interactions - hash of the invoked method signature and encoded parameters
      (see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html))
    * For simple ether transfers - empty

Make the request via curl like so:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0xf0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5", "to":null, "gas":"0x24A22","gasPrice":"0x0", "privateFrom": "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=", "privateFor": ["1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="], "privacyFlag": 0,"data":"0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"}], "id":1}' -H 'Content-Type: application/json' http://localhost:20000
```
where the `from` address as well as the RPC endoint of `http://localhost:20000` are that of Member1 if using the [Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md) and the `from` address is the account address of Member1. Please update your request according to your environment.


### 2. Using `web3.eth.Contract` from [web3](https://www.npmjs.com/package/web3)

This is also similar to the public method above and adds in the same privacy parameters of
`privateFrom, privateFor and an optional privacyFlag` to the payload. We are also using
Member1's details from the
[Developer Quickstart](../Quorum-Dev-Quickstart/Using-the-Quickstart.md), please update this
to suit your environment.

```js
// public_tx_web3.js

const path = require('path');
const fs = require('fs-extra');
const web3 = new Web3(host);
//use an exsiting account, alternatively you can make an account
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

### 3. Using `priv.generateAndSendRawTransaction` for private contracts using [web3js-quorum](https://www.npmjs.com/package/web3js-quorum)

This example uses the [web3js-quorum](https://www.npmjs.com/package/web3js-quorum) library to make the
`[priv.generateAndSendRawTransaction](https://consensys.github.io/web3js-quorum/latest/module-priv.html#~generateAndSendRawTransaction)`
 API call.  Create a new file `private_tx_web3js_quorum.js`(or run the commands below in a JavaScript
 console) to send the transaction. 

For reference, the Developer Quickstart provides an
[example of a private transaction script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goquorum/smart_contracts/scripts/private_tx.js).

```js
//private_tx_web3js_quorum.js 

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
// unlock the account so you can sign the tx; uses web3.eth.accounts.decrypt(keystoreJsonV3, password);
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
  gasPrice: 0, //ETH per unit of gas
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
// Generate and send the Raw transaction to the Besu node using the eea_sendRawTransaction JSON-RPC call
const txHash = await web3quorum.priv.generateAndSendRawTransaction(txOptions);
console.log("Getting contractAddress from txHash: ", txHash);
console.log("Private Transaction Receipt: ", txHash.contractAddress);
```

`txOptions` contains the following field:
* `nonce` - the count of transactions from this account
* `from` - address of the EthSigner account. For example `0x9b790656b9ec0db1936ed84b3bea605873558198`.
* `gasLimit` - amount of gas provided by the sender for the transaction
* `gasPrice` - price for each unit of gas the sender is willing to pay
* `isPrivate` - indicate that it is a private Transaction
* `privateKey` - the sender's quorum node private key
* `privateFrom` - the sender's Transaction Manager's base-64 encoded public key
* `privateFor` - an array of the receipient's Transaction Manager's base-64 encoded public keys
* `data` - compiled code of the contract (in this example there's also a constructor initialization value, so we append
  that to the bytecode).
