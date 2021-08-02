

### Inspecting the GoQuorum nodes

You can inspect any of the GoQuorum nodes by using `./attach.sh` to open the geth JavaScript console. For this demo, you will be inspecting Node 1, Node 2, and Node 3.

It is recommended to use separate terminal windows for each node you are inspecting. In each terminal, ensure you are in your network's directory, then:

- In terminal 1 run `./attach.sh 1` to attach to node 1
- In terminal 2 run `./attach.sh 2` to attach to node 2
- In terminal 3 run `./attach.sh 3` to attach to node 3

To look at the private transaction that was just sent, run the following command in one of the terminals:

```javascript
eth.getTransaction("0xe28912c5694a1b8c4944b2252d5af21724e9f9095daab47bac37b1db0340e0bf")
```

where you should replace this hash with the TransactionHash that was previously printed to the terminal.
This will print a result of the form:

```json
{
  blockHash: "0x4d6eb0d0f971b5e0394a49e36ba660c69e62a588323a873bb38610f7b9690b34",
  blockNumber: 1,
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
  gas: 4700000,
  gasPrice: 0,
  hash: "0xe28912c5694a1b8c4944b2252d5af21724e9f9095daab47bac37b1db0340e0bf",
  input: "0x58c0c680ee0b55673e3127eb26e5e537c973cd97c70ec224ccca586cc4d31ae042d2c55704b881d26ca013f15ade30df2dd196da44368b4a7abfec4a2022ec6f",
  nonce: 0,
  r: "0x4952fd6cd1350c283e9abea95a2377ce24a4540abbbf46b2d7a542be6ed7cce5",
  s: "0x4596f7afe2bd23135fa373399790f2d981a9bb8b06144c91f339be1c31ec5aeb",
  to: null,
  transactionIndex: 0,
  v: "0x25",
  value: 0
}
```

Take note of the `v` field value of `"0x25"` or `"0x26"` (37 or 38 in decimal) which indicates this transaction has a private payload (input).

#### Checking the state of the contract

For each of the 3 nodes you'll use the geth JavaScript console to create a variable called `address` which you will assign to the address of the contract created by Node 1. The contract address can be found in two ways:

- In Node 1's log file: `qdata/logs/1.log`
- By reading the `contractAddress` param after calling `eth.getTransactionReceipt(txHash)` ([Ethereum API documentation](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransactionreceipt)) where `txHash` is the hash printed to the terminal after sending the transaction.

Once you've identified the contract address, run the following command in each terminal:

```js
var address = "0x1932c48b2bf8102ba33b4a6b545c32236e342f34"; //replace with your contract address
```

Next you'll use ```eth.contract``` to define a contract class with the simpleStorage ABI definition in each terminal:

```js
var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"type":"constructor"}];
var private = eth.contract(abi).at(address)
```

The function calls are now available on the contract instance and you can call those methods on the contract. Let's start by examining the initial value of the contract to make sure that only nodes 1 and 2 can see the initialized value.

- In terminal window 1 (Node 1):

    ```js
    private.get()
    ```

    Result is:

    ```js
    42
    ```

- In terminal window 2 (Node 2):

    ```js
    private.get()
    ```

    Result is:

    ```js
    42
    ```

- In terminal window 3 (Node 3):

    ```js
    private.get()
    ```

    Result is:

    ```js
    0
    ```

Notice that nodes 1 and 2 are able to read the state of the private contract and its initial value is 42.

If you look in `private-contract.js` you will see that this was the value set when the contract was created.

Node 3 is unable to read the state.

### Updating the state of the contract

Next you'll have Node 1 set the state to the value `4` and verify only nodes 1 and 2 are able to view the new state.

In terminal window 1 (Node 1):

```js
private.set(4,{from:eth.accounts[0],privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]});
```

Result is:

```js
"0xacf293b491cccd1b99d0cfb08464a68791cc7b5bc14a9b6e4ff44b46889a8f70"
```

You can check the log files in `qdata/logs/` to see each node validating the block with this new private transaction. Once the block containing the transaction has been validated you can once again check the state from each node 1, 4, and 2.

- In terminal window 1 (Node 1):

```js
private.get()
```

Result is:

```js
4
```

- In terminal window 2 (Node 2):

```js
private.get()
```

Result is:

```js
4
```

- In terminal window 3 (Node 3):

```js
private.get()
```

Result is:

```js
0
```

And there you have it: All nodes are validating the same blockchain of transactions, with the private transactions containing only a 512 bit hash in place of the transaction data, and only the parties to the private transactions being able to view and update the state of the private contracts.

