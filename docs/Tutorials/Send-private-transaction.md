---
description: Sending private transactions
---

# Send private transactions

## Prerequisites

* [Privacy-enabled network running as configured in tutorial](Create-Privacy-enabled-network.md). The
nodes must be running.

## Steps

Listed on the right-hand side of the page are the steps to create a private contract, deploy the contract,
and send a private transaction.

## 1. Create private contract

In the `Node-0` directory, copy and paste the following to a file called `private-contract.js`. On the
highlighted line, replace the placeholder for `privateFor` with the base64 content of the `tessera1.pub` key file.
For example, `1oRj9qpgnNhr/ZUggeMXnXsWMuVgedS6gfimpEVt+EQ=`.

```javascript hl_lines="11" linenums="1"
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

## 2. Create account

In the `Node-0` directory, create an account.

```bash
geth --datadir data account new
```

## 3. Unlock account

Accounts are locked by default and must be unlocked before sending the transaction. Use the `geth`
console to display and unlock the account.

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

!!! tip
    By default, accounts remain unlocked for 5 minutes. After 5 minutes, the account is relocked.

## 4. Send the private transaction

!!! important

    All participants listed in `privateFor` must have their [private transaction managers](../Concepts/Privacy/Privacy.md#private-transaction-manager) running when the private transaction is sent.
    Otherwise, the transaction doesn't propagate and an error is returned.

In the `geth` console, run `loadScript` to deploy the contract and
send a private transaction from node 1 to node 2.

```javascript
loadScript("private-contract.js")
```

The GoQuorum logs for node 0 indicate the private transaction was sent.

=== "Node 0"
    ```bash
    DEBUG[12-08|13:53:09.380] sending private tx                       txnType=3 data=606060…00002a privatefrom= privatefor="[yrrHrbeaXzZCYJ4DPXrunvms1/jy5zDvoH5KnNyW4VE=]" privacyFlag=0
    DEBUG[12-08|13:53:09.381] Simulated Execution EVM call finished    runtime=594ns
    TRACE[12-08|13:53:09.381] after simulation                         affectedCATxHashes=map[] merkleRoot=000000…000000 privacyFlag=0 error=nil
    INFO [12-08|13:53:09.629] sent private signed tx                   data=606060…00002a hash=f93744…407111 privatefrom= privatefor="[yrrHrbeaXzZCYJ4DPXrunvms1/jy5zDvoH5KnNyW4VE=]" affectedCATxHashes=map[] merkleroot=000000…000000 privacyflag=0
    DEBUG[12-08|13:53:09.629] Handle Private Transaction finished      took=249.112348ms
    INFO [12-08|13:53:09.630] Private transaction signing with QuorumPrivateTxSigner
    ```

The Tessera logs indicate the transaction payload was distributed and received.

=== "Node 0"
    ```bash
    2020-12-08 13:53:09.390 [qtp1487391298-33] INFO  c.q.tessera.q2t.TransactionResource - Enter Request : POST : /send
    2020-12-08 13:53:09.525 [pool-5-thread-1] INFO  c.q.tessera.q2t.RestPayloadPublisher - Publishing message to http://localhost:9003/
    2020-12-08 13:53:09.616 [pool-5-thread-1] INFO  c.q.tessera.q2t.RestPayloadPublisher - Published to http://localhost:9003/
    2020-12-08 13:53:09.622 [qtp1487391298-33] INFO  c.q.tessera.q2t.TransactionResource - Exit Request : POST : /send
    2020-12-08 13:53:09.622 [qtp1487391298-33] INFO  c.q.tessera.q2t.TransactionResource - Response for send : 201 Created
    ```

=== "Node 1"
    ```bash
    2020-12-08 13:53:09.548 [qtp1564775175-89] INFO  c.q.tessera.p2p.TransactionResource - Enter Request : POST : /push
    2020-12-08 13:53:09.614 [qtp1564775175-89] INFO  c.q.t.t.TransactionManagerImpl - Stored payload with hash +TdE/ZNMX0IrqLSwLh6szKS4rxCuDB9NbpdLf7yXjfwS0ATYsnpSkCCJ+SSzh0D19CT4RZGzAiiFldF9pkBxEQ==
    2020-12-08 13:53:09.615 [qtp1564775175-89] INFO  c.q.tessera.p2p.TransactionResource - Exit Request : POST : /push
    2020-12-08 13:53:09.615 [qtp1564775175-89] INFO  c.q.tessera.p2p.TransactionResource - Response for push : 201 Created
    2020-12-08 13:53:12.024 [qtp1527084496-36] INFO  c.q.tessera.q2t.TransactionResource - Enter Request : GET : /transaction/+TdE/ZNMX0IrqLSwLh6szKS4rxCuDB9NbpdLf7yXjfwS0ATYsnpSkCCJ+SSzh0D19CT4RZGzAiiFldF9pkBxEQ==
    2020-12-08 13:53:12.047 [qtp1527084496-36] INFO  c.q.t.t.TransactionManagerImpl - Lookup transaction +TdE/ZNMX0IrqLSwLh6szKS4rxCuDB9NbpdLf7yXjfwS0ATYsnpSkCCJ+SSzh0D19CT4RZGzAiiFldF9pkBxEQ==
    2020-12-08 13:53:12.088 [qtp1527084496-36] INFO  c.q.tessera.q2t.TransactionResource - Exit Request : GET : /transaction/+TdE/ZNMX0IrqLSwLh6szKS4rxCuDB9NbpdLf7yXjfwS0ATYsnpSkCCJ+SSzh0D19CT4RZGzAiiFldF9pkBxEQ==
    2020-12-08 13:53:12.088 [qtp1527084496-36] INFO  c.q.tessera.q2t.TransactionResource - Response for transaction/+TdE/ZNMX0IrqLSwLh6szKS4rxCuDB9NbpdLf7yXjfwS0ATYsnpSkCCJ+SSzh0D19CT4RZGzAiiFldF9pkBxEQ== : 200 OK
    ```
