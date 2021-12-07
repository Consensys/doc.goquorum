---
description: funds transfer transactions
---

# Transfer funds between accounts

This tutorial shows you how to transfer funds (ETH) between accounts in a transaction on a running network.
Use the [Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Getting-Started.md) to rapidly generate a local blockchain network.

## Prerequisites

* A private network.
  You can use a [private network tutorial](../Private-Network/Create-IBFT-Network.md) or the
  [Quorum Developer Quickstart](../Quorum-Dev-Quickstart/Getting-Started.md).

## Using `eth_sendSignedTransaction`

The simplest way to transfer funds between externally-owned accounts is using
[`eth_sendSignedTransaction`](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#sendsignedtransaction).
This example uses `eth_sendSignedTransaction` and one of the [test accounts](../../Reference/Accounts-for-Testing.md)
to transfer funds to a newly created account.

!!! critical "Security warning"

    **Do not use the test accounts on Ethereum MainNet or any production network.**

    The private key is publicly displayed, which means the account is not secure.

Create a new file `eth_tx.js` (or run the following commands in a JavaScript console) to send the transaction.
Before making the transaction, the script checks the balances of both accounts to verify the funds transfer after the transaction.

!!! example "eth_tx.js using eth_sendSignedTransaction"

    ```js
    const web3 = new Web3(host);
    // Pre-seeded account with 90000 ETH
    const privateKeyA = "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";
    const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
    var accountABalance = web3.utils.fromWei(await web3.eth.getBalance(accountA.address));
    console.log("Account A has balance of: " + accountABalance);

    // Create a new account to transfer ETH to
    var accountB = web3.eth.accounts.create();
    var accountBBalance = web3.utils.fromWei(await web3.eth.getBalance(accountB.address));
    console.log("Account B has balance of: " + accountBBalance);

    // Send 0x100 ETH from AccountA to AccountB and sign the transaction with
    // Account A's private key
    const rawTxOptions = {
      nonce: web3.utils.numberToHex(await web3.eth.getTransactionCount(accountA.address)),
      from: accountA.address,
      to: accountB.address,
      value: "0x100", // Amount of ETH to transfer
      gasPrice: "0x0", // Set to 0 in GoQuorum networks
      gasLimit: "0x24A22" // Max number of gas units the tx is allowed to use
    };
    console.log("Creating transaction...");
    const tx = new Tx(rawTxOptions);
    console.log("Signing transaction...");
    tx.sign(Buffer.from(accountA.privateKey.substring(2), "hex"));
    console.log("Sending transaction...");
    var serializedTx = tx.serialize();
    const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
    console.log("tx transactionHash: " + pTx.transactionHash);

    // After the transaction, check the updated balances and there should be some ETH transferred
    var accountABalance = await getAccountBalance(host, accountA);
    console.log("Account A has an updated balance of: " + accountABalance);
    var accountBBalance = await getAccountBalance(host, accountB);
    console.log("Account B has an updatedbalance of: " + accountBBalance);
    }
    ```

For reference, the Quorum Developer Quickstart provides an [example of a funds transfer script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/goquorum/smart_contracts/scripts/eth_tx.js).

## Using `eth_sendTransaction`

An alternative to using `eth_sendSignedTransaction` is using
[`eth_sendTransaction`](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#sendtransaction).

Create a new file `eth_tx.js` (or run the following commands in a JavaScript console) to send the transaction.

!!! example "eth_tx.js using eth_sendTransaction"

    ```js
    const web3 = new Web3(host);
    // Pre-seeded account with 90000 ETH
    const privateKeyA = "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";
    const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
    var accountABalance = web3.utils.fromWei(await web3.eth.getBalance(accountA.address));
    console.log("Account A has balance of: " + accountABalance);

    // Create a new account to transfer ETH to
    var accountB = web3.eth.accounts.create();
    var accountBBalance = web3.utils.fromWei(await web3.eth.getBalance(accountB.address));
    console.log("Account B has balance of: " + accountBBalance);

    // Send some ETH from A to B
    const txOptions = {
      from: accountA.address,
      to: accountB.address,
      value: "0x100",  // Amount of ETH to transfer
      gasPrice: "0x0", // Set to 0 in GoQuorum networks
      gasLimit: "0x24A22" // Max number of gas units the tx is allowed to use
    };
    console.log("Creating transaction...");
    const pTx = await web3.eth.sendTransaction(txOptions);
    console.log("tx transactionHash: " + pTx.transactionHash);

    // After the transaction, there should be some ETH transferred
    var accountABalance = await getAccountBalance(host, accountA);
    console.log("Account A has an updated balance of: " + accountABalance);
    var accountBBalance = await getAccountBalance(host, accountB);
    console.log("Account B has an updatedbalance of: " + accountBBalance);
    }
    ```
