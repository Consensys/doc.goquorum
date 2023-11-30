---
title: Enhanced permissioning
description: Configure enhanced permissions
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Configure enhanced permissions

[Enhanced network permissioning](../../../concepts/permissions-overview.md#enhanced-network-permissioning) is a smart-contract-based permissioning model designed for enterprise-level needs. You can configure enhanced permissioning for a [new network](#new-network) or when [migrating from an earlier version](#migrating-from-an-earlier-version).

## New network

1.  Start the initial set of nodes.

2.  Deploy the `PermissionsUpgradable.sol` contract in the network, which requires specifying a guardian account.

3.  Deploy the rest of the contracts, which requires specifying the address of `PermissionsUpgradable.sol`.

4.  Once all the contracts are deployed, create a file `permission-config.json` with the following construct:

    ```json title="permission-config.json"
    {
      "permissionModel": "v2",
      "upgradableAddress": "0x1932c48b2bf8102ba33b4a6b545c32236e342f34",
      "interfaceAddress": "0x4d3bfd7821e237ffe84209d8e638f9f309865b87",
      "implAddress": "0xfe0602d820f42800e3ef3f89e1c39cd15f78d283",
      "nodeMgrAddress": "0x8a5e2a6343108babed07899510fb42297938d41f",
      "accountMgrAddress": "0x9d13c6d3afe1721beef56b55d303b09e021e27ab",
      "roleMgrAddress": "0x1349f3e1b8d71effb47b840594ff27da7e603d17",
      "voterMgrAddress": "0xd9d64b7dc034fafdba5dc2902875a67b5d586420",
      "orgMgrAddress": "0x938781b9796aea6376e40ca158f67fa89d5d8a18",
      "nwAdminOrg": "ADMINORG",
      "nwAdminRole": "ADMIN",
      "orgAdminRole": "ORGADMIN",
      "accounts": [
        "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
        "0xca843569e3427144cead5e4d5999a3d0ccf92b8e"
      ],
      "subOrgBreadth": 3,
      "subOrgDepth": 4
    }
    ```

    - `permissionModel` - Permission model to be used (`v1` or `v2`).
    - `upgradableAddress`- Address of deployed contract `PermissionsUpgradable.sol`.
    - `interfaceAddress` - Address of deployed contract `PermissionsInterface.sol`.
    - `implAddress` - Address of deployed contract `PermissionsImplementation.sol`.
    - `nodeMgrAddress` - Address of deployed contract `NodeManager.sol`.
    - `accountMgrAddress` - Address of deployed contract `AccountManager.sol`.
    - `roleMgrAddress` - Address of deployed contract `RoleManager.sol`.
    - `voterMgrAddress` - Address of deployed contract `VoterManager.sol`.
    - `orgMgrAddress` - Address of deployed contract `OrgManager.sol`.
    - `nwAdminOrg` - Name of the initial organization to be created as a part of the network boot up with a new permissions model. This organization owns all the initial nodes and network administrator accounts at the network boot up.
    - `nwAdminRole` - Role ID to be assigned to the network administrator accounts.
    - `orgAdminRole` - Role ID to be assigned to the organization administrator account.
    - `accounts` - Initial list of accounts linked to the network administrator organization and assigned the network administrator role. These accounts have complete control of the network and can propose and approve new organizations into the network.
    - `subOrgBreadth` - Number of sub-organizations that any organization can have.
    - `subOrgDepth` - Maximum depth of sub-organization hierarchy allowed in the network.

5.  Once the contracts are deployed, execute `init` in `PermissionsUpgradable.sol` through the guardian account. This links the interface and implementation contracts.

6.  At the `geth` prompt, load the following script after replacing the contract addresses appropriately:

    ```javascript
    ac = eth.accounts[0];
    web3.eth.defaultAccount = ac;
    var abi = [
      {
        constant: true,
        inputs: [],
        name: "getPermImpl",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "_proposedImpl", type: "address" }],
        name: "confirmImplChange",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getGuardian",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getPermInterface",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "_permInterface", type: "address" },
          { name: "_permImpl", type: "address" },
        ],
        name: "init",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ name: "_guardian", type: "address" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
    ];
    var upgr = web3.eth
      .contract(abi)
      .at("0x1932c48b2bf8102ba33b4a6b545c32236e342f34"); // address of the upgradable contracts
    var impl = "0xfe0602d820f42800e3ef3f89e1c39cd15f78d283"; // address of the implementation contracts
    var intr = "0x4d3bfd7821e237ffe84209d8e638f9f309865b87"; // address of the interface contracts
    ```

7.  Execute `upgr.init(intr, impl, {from: <guardian account>, gas: 4500000})`.

8.  Stop all `geth` nodes in the network and copy `permission-config.json` into the data directory of each node.

## Migrating from an earlier version

1. Stop the running network in the earlier version.

2. Set the `maxCodeSize` attribute in `genesis.json` to 35.

   ```javascript
   "config": {
     "homesteadBlock": 0,
     "byzantiumBlock": 0,
     "chainId": 10,
     "eip150Block": 0,
     "eip155Block": 0,
     "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
     "eip158Block": 0,
     "maxCodeSize" : 35,
     "isQuorum": true
   }
   ```

3. Execute `geth --datadir <data dir path> init genesis.json`.

4. Follow the steps to [configure enhanced permission for a new network](#new-network).

:::note

The new permissioning model will be in effect only when `permission-config.json` is present in data directory. If this file is not there and the node is started with `--permissioned`, the old permissioning model will be in effect.

:::
