---
description: Sending private transactions
---

# Send private transactions

## Prerequisites

* [Privacy-enabled network as configured in tutorial](Create-Privacy-enabled-network.md).

## Steps

Listed on the right-hand side of the page are the steps to create a private contract, deploy the contract,
and send a private transaction.

## 1. Create private contract

In the `Node-0` directory, copy and paste the following to a file called `private-config.js`. Replace
the placeholder for `privateFor` with the `tessera1.pub` key.

```javascript
a = eth.accounts[0]
web3.eth.defaultAccount = a;

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"payable":false,"type":"constructor"}];

var bytecode = "0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029";

var simpleContract = web3.eth.contract(abi);
var simple = simpleContract.new(42, {from:web3.eth.accounts[0], data: bytecode, gas: 0x47b760, privateFor: ["<Tessera 1 public key>"]}, function(e, contract) {
    if (e) {
        console.log("err creating contract", e);
    } else {
         if (!contract.address) {
            console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
        } else {
            console.log("Contract mined! Address: " + contract.address);
            console.log(contract);
        }
    }
});
```

## 2. Create run script

In the `Node-0` directory, create a script called `runscript.sh`.

```bash
#!/bin/bash
geth --exec 'loadScript("./private-contract.js")' --datadir=data attach ipc:/<path to IBFT-network>/IBFT-network/Node-0/data/geth.ipc
```

## 3. Create account

In the `Node-0` directory, create an account.

```bash
/geth --datadir data account new
```

## 4. Unlock account

Accounts are locked by default and must be unlocked before sending the transaction.

```bash
geth attach geth.ipc
```

Display the accounts.

```javascript
eth.accounts
```

Unlock the account using the account key displayed by `eth.accounts`.

=== "Unlock"
     ```javascript
     personal.unlockAccount("<account key>")
     ```

=== "Example"
    ```javascript
    personal.unlockAccount("0x0bc37b7dc68c24aee9d49fab70bb20cb8c6154c2")
    ```

Type in the account password when prompted.

## 5. Send the private transaction

Run the script created in step 2. The contract is deployed and a private transaction sent from node
1 to node 2.

```javascript
loadScript("private-contract.js")
```

The GoQuorum logs for node 0 and node 1 display the transaction submission and receipt.

=== "Node 0"
    ```bash
    INFO [11-30|15:47:16.817] Submitted contract creation              fullhash=0x3a554484aaa5bee8e03995d994960751b551ff88b0ed76509482e668b2dd6150 to=0x76A16Dff1E50c1cD84198DE7Cbb8473F544f5C65
    INFO [11-30|15:47:16.817] QUORUM-CHECKPOINT                        name=TX-CREATED              tx=0x3a554484aaa5bee8e03995d994960751b551ff88b0ed76509482e668b2dd6150 to=0x76A16Dff1E50c1cD84198DE7Cbb8473F544f5C65
    ```

=== "Node 1"
    ```bash
    INFO [11-30|15:47:18.381] QUORUM-CHECKPOINT                        name=TX-COMPLETED tx=0x3a554484aaa5bee8e03995d994960751b551ff88b0ed76509482e668b2dd6150 time=3.431831ms
    ```
