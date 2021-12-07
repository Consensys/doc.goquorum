---
description: calling smart contracts functions
---

# Interact with a deployed smart contract

This tutorial shows you how to interact with smart contracts that have been deployed to a network.
Use the [Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Getting-Started.md) to rapidly generate a local blockchain network.

## Prerequisites

* A network with a deployed smart contract as in the [deploying smart contracts tutorial](Deploying-Contracts.md).

## Interact with public contracts

This tutorial uses the
[`SimpleStorage.sol`](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/common/smart_contracts/contracts/SimpleStorage.sol)
contract:

```js
pragma solidity ^0.7.0;

contract SimpleStorage {
  uint public storedData;

  constructor(uint initVal) public {
    storedData = initVal;
  }

  function set(uint x) public {
    storedData = x;
  }

  function get() view public returns (uint retVal) {
    return storedData;
  }
}
```

Once the contract is deployed, you can perform a read operation using the `get` function call and a write operation
using the `set` function call.
This tutorial uses the [web3js](https://www.npmjs.com/package/web3) library to interact with the contract.
The Quorum Developer Quickstart provides a [full example of a public contract script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goquorum/smart_contracts/scripts/public_tx.js).

### 1. Perform a read operation

To perform a read operation, you need the address that the contract was deployed to and the contract's ABI.
The contract's ABI can be obtained from compiling the contract;
see the [deploying smart contracts tutorial](Deploying-Contracts.md) for an example.

Use the [`web3.eth.Contract`](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html) object to create a new
instance of the smart contract, then make the `get` function call from the contract's list of methods, which will return the value stored:

```js
async function getValueAtAddress(host, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.get().call();
  console.log("Obtained value at deployed contract is: "+ res);
  return res
}
```

### 2. Perform a write operation

To perform a write operation, send a transaction to update the stored value.
As with the [`get` call](#1-perform-a-read-operation), you need to use the address that the contract was deployed to and the contract's ABI.
The account address must correspond to an actual account with some ETH in it to perform the transaction.

Make the `set` call passing in your account address, `value` as the updated value of the contract, and the amount of gas
you are willing to spend for the transaction:

```js
// You need to use the accountAddress details provided to GoQuorum to send/interact with contracts
async function setValueAtAddress(host, accountAddress, value, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.set(value).send({from: accountAddress, gasPrice: "0x0", gasLimit: "0x24A22"});
  return res
}
```

### 3. Verify an updated value

To verify that a value has been updated, perform a `get` call after a `set` update call.

## Interact with private contracts

This private contracts example uses the same `SimpleStorage.sol` contract as in the
[public contracts example](#interact-with-public-contracts), but it uses the
[`eea_sendRawTransaction`](../../Reference/API-Methods.md#eea_sendrawtransaction) method to interact with the contract.
Both read and write operations are performed using the `eea_sendRawTransaction` API call.
The Quorum Developer quickstart provides a [full example of a private contract script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goquorum/smart_contracts/scripts/private_tx_web3.js).

### 1. Perform a read operation

Performing a read operation on a contract is identical to the [public contract example](#interact-with-public-contracts),
and you need the address that the contract was deployed to and the contract's ABI.

Use the [`web3.eth.Contract`](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html) object to create a new
instance of the smart contract, then make the `get` function call from the contract's list of methods, which will return the value stored:

```js
async function getValueAtAddress(host, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.get().call();
  console.log("Obtained value at deployed contract is: "+ res);
  return res
}
```

### 2. Perform a write operation

Performing a write operation is almost the same process as the read operation, except that you encode the new value to
the `set` function's ABI, and then append these arguments to the `set` function's ABI and use this as the `data` field.
Additionally provide the public key of the Transaction Manager of the respective node.

```js
async function setValueAtAddress(host, value, deployedContractAbi, deployedContractAddress, fromAddress, toPublicKey) {
  const web3 = new Web3(host)
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.set(value).send({from: fromAddress, privateFor: [toPublicKey], gasLimit: "0x24A22"});
  return res
}
```

### 3. Verify an updated value

To verify that a value has been updated, perform a `get` call after a `set` update call.
