---
description: Extend module
---

# Extend module

The `extend` module of `quorum.js` allows Quorum-specific APIs to be added to an instance of `web3`.

!!!example

    ```js
    const Web3 = require("web3");
    const quorumjs = require("quorum-js");

    const web3 = new Web3("http://localhost:22000");

    quorumjs.extend(web3);

    web3.quorum.eth.sendRawPrivateTransaction(signedTx, args);
    ```

## Parameters

| param | type | required | description |
| :---: | :---: | :---: | --- |
| `web3` | `Object` | yes | web3 instance |
| `apis` | `String` | no | comma-separated list of APIs to extend `web3` with. Default is to add all APIs, that is `quorumjs.extend(web3, 'eth, raft, istanbul, quorumPermission')` |

## Methods

See the [API documentation](../API-Methods.md) for API details.
