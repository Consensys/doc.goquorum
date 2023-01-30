---
title: Enhanced permissions
description: Using enhanced smart contract based permissioning
sidebar_position: 4
---

# Using enhanced permissioning

Managing the [enhanced permissioning model](../../concepts/permissions-overview.md#enhanced-network-permissioning) can be broadly categorized into the following activities:

## Setting up the initial network

Please refer to the [configuration instructions](../configure/permissioning/enhanced-permissions.md) for detailed information. For an existing network running with an older version of GoQuorum:

1. Upgrade GoQuorum to the latest version.
2. Deploy the contracts.
3. Execute the `init` method of `PermissionsUpgradable.sol` from the guardian account.
4. Copy the `permission-config.json` to the data directory of each node.
5. Bring `geth` up in `--permissioned` mode.

For a new network using the latest version of GoQuorum:

1. Bring up the initial set of nodes.
2. Deploy the contracts.
3. Execute the `init` method of `PermissionsUpgradable.sol` from the guardian account.
4. Upgrade GoQuorum to the latest version.
5. Copy the `permission-config.json` to the data directory of each node.
6. Bring `geth` up in `--permissioned` mode.

As part of network initialization:

- A network admin organization is created with the `nwAdminOrg` name specified in `permission-config.json`. All nodes which are part of `static-nodes.json` are assigned to this organization.
- A network admin role is created with the `nwAdminRole` name specified in the config file.
- All accounts given in the `accounts` array of the config file are assigned the network admin role. These accounts will have the ability to propose and approve new organizations into the network.

### Example

This example assumes that the network was started with the `permission-config.json` given in the [configuration instructions](../configure/permissioning/enhanced-permissions.md), and that the network was brought up with the `static-nodes.json` file as the following:

```json
[
  "enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0",
  "enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0",
  "enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0",
  "enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
]
```

View the organization list with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.orgList;
```

# geth console result

```json
[
  {
    "fullOrgId": "ADMINORG",
    "level": 1,
    "orgId": "ADMINORG",
    "parentOrgId": "",
    "status": 2,
    "subOrgList": null,
    "ultimateParent": "ADMINORG"
  }
]
```

<!--/tabs-->

View `ADMINORG`'s details:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ADMINORG");
```

# geth console result

```json
{
  "acctList": [
    {
      "acctId": "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
      "isOrgAdmin": true,
      "orgId": "ADMINORG",
      "roleId": "ADMIN",
      "status": 2
    },
    {
      "acctId": "0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
      "isOrgAdmin": true,
      "orgId": "ADMINORG",
      "roleId": "ADMIN",
      "status": 2
    }
  ],
  "nodeList": [
    {
      "orgId": "ADMINORG",
      "status": 2,
      "url": "enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0"
    },
    {
      "orgId": "ADMINORG",
      "status": 2,
      "url": "enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0"
    },
    {
      "orgId": "ADMINORG",
      "status": 2,
      "url": "enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0"
    },
    {
      "orgId": "ADMINORG",
      "status": 2,
      "url": "enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
    }
  ],
  "roleList": [
    {
      "access": 3,
      "active": true,
      "isAdmin": true,
      "isVoter": true,
      "orgId": "ADMINORG",
      "roleId": "ADMIN"
    }
  ],
  "subOrgList": null
}
```

<!--/tabs-->

## Proposing a new organization into the network

Once the network is up, the network admin accounts can then propose a new organization into the network.

Majority approval from the network admin accounts is required before an organization is approved.

The APIs for [proposing](../../reference/api-methods.md#quorumpermission_addorg) and [approving](../../reference/api-methods.md#quorumpermission_approveorg) an organization are documented in [permission APIs](../../reference/api-methods.md#permission-methods).

### Example

This example is to propose and approve an organization by name `ORG1`.

Propose to add `ORG1` with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.addOrg(
  "ORG1",
  "enode://de9c2d5937e599930832cecc1df8cc90b50839bdf635c1a4e68e1dab2d001cd4a11c626e155078cc65958a72e2d72c1342a28909775edd99cc39470172cce0ac@127.0.0.1:21004?discport=0",
  "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
  { from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

Once the organization is proposed, it will be in `Proposed` state awaiting approval from other network admin accounts.

View `ORG1`'s status:

<!--tabs-->

# geth console request

```javascript
quorumPermission.orgList[1];
```

# geth console result

```json
{
  "fullOrgId": "ORG1",
  "level": 1,
  "orgId": "ORG1",
  "parentOrgId": "",
  "status": 1,
  "subOrgList": null,
  "ultimateParent": "ORG1"
}
```

<!--/tabs-->

The network admin accounts can then approve the proposed organizations with the following command, and once the majority approval is achieved, the organization status is updated to `Approved`:

<!--tabs-->

# geth console request

```javascript
quorumPermission.approveOrg(
  "ORG1",
  "enode://de9c2d5937e599930832cecc1df8cc90b50839bdf635c1a4e68e1dab2d001cd4a11c626e155078cc65958a72e2d72c1342a28909775edd99cc39470172cce0ac@127.0.0.1:21004?discport=0",
  "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
  { from: "0xca843569e3427144cead5e4d5999a3d0ccf92b8e" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

See that `ORG1`'s status was updated in the organization list with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.orgList[1];
```

# geth console result

```json
{
  "fullOrgId": "ORG1",
  "level": 1,
  "orgId": "ORG1",
  "parentOrgId": "",
  "status": 2,
  "subOrgList": null,
  "ultimateParent": "ORG1"
}
```

<!--/tabs-->

View the details of the new approved organization:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1");
```

# geth console result

```json
{
  "acctList": [
    {
      "acctId": "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
      "isOrgAdmin": true,
      "orgId": "ORG1",
      "roleId": "ORGADMIN",
      "status": 2
    }
  ],
  "nodeList": [
    {
      "orgId": "ORG1",
      "status": 2,
      "url": "enode://de9c2d5937e599930832cecc1df8cc90b50839bdf635c1a4e68e1dab2d001cd4a11c626e155078cc65958a72e2d72c1342a28909775edd99cc39470172cce0ac@127.0.0.1:21004?discport=0"
    }
  ],
  "roleList": [
    {
      "access": 3,
      "active": true,
      "isAdmin": true,
      "isVoter": true,
      "orgId": "ORG1",
      "roleId": "ORGADMIN"
    }
  ],
  "subOrgList": null
}
```

<!--/tabs-->

At this point:

- An organization admin role with name as given in `orgAdminRole` in `permission-config.json` has been created and linked to the `ORG1`.

- The account `0x0638e1574728b6d862dd5d3a3e0942c3be47d996` has been linked to `ORG1` and the organization admin role. This account acts as the organization admin account and can manage further roles, nodes, and accounts at the organization level.

- The node has been linked to the organization and its status has been updated as `Approved`.

The new node belonging to the organization can now join the network. In case the network is running in `Raft` consensus mode, before the node joins the network, ensure that:

- The node has been added as a peer using `raft.addPeer(<<enodeId>>)`.

- You bring up `geth` for the new node using `--raftjoinexisting` with the peer ID as obtained in the previous step.

## Managing the organization-level permissions

Once the organization is approved and the node of the organization has joined the network, the organization admin can:

- Create sub-organizations, add roles, and add additional nodes at organization level.

- Add accounts to the organization.

- Change roles of existing organization-level accounts.

Use [`quorumPermission_addSubOrg`](../../reference/api-methods.md#quorumpermission_addsuborg) to add a sub-organization at the `ORG1` level.

### Example

Add a sub-organization with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.addSubOrg(
  "ORG1",
  "SUB1",
  "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0",
  { from: eth.accounts[0] },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

Get the sub-organization's details:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1");
```

# geth console result

```json
{
  "acctList": null,
  "nodeList": [
    {
      "orgId": "ORG1.SUB1",
      "status": 2,
      "url": "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
    }
  ],
  "roleList": null,
  "subOrgList": null
}
```

<!--/tabs-->

The enode ID is not mandatory for adding a sub-organization.

If the organization admin wants to add an admin account for the newly created sub-organization, the organization admin account must first create a role using [`quorumPermission_addNewRole`](../../reference/api-methods.md#quorumpermission_addnewrole) with `isAdminRole` set to `true`, then assign this role to the account which belongs to the sub-organization.

Once assigned, the account will act as organization admin at the sub-organization level.

Add a new admin account for the sub-organization with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.addNewRole("ORG1.SUB1", "SUBADMIN", 3, false, true, {
  from: eth.accounts[0],
});
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the organization admin account ID:

<!--tabs-->

# geth console request

```javascript
eth.accounts[0];
```

# geth console result

```json
"0x0638e1574728b6d862dd5d3a3e0942c3be47d996"
```

<!--/tabs-->

The sub-organization admin role `SUBADMIN` can now be assigned to an account at `SUB1`.

Add the account as a `SUBADMIN` to `SUB1` with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.addAccountToOrg(
  "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
  "ORG1.SUB1",
  "SUBADMIN",
  { from: "0x0638e1574728b6d862dd5d3a3e0942c3be47d996" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View `SUB1`'s details:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1");
```

# geth console results

```json
{
  "acctList": [
    {
      "acctId": "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
      "isOrgAdmin": true,
      "orgId": "ORG1.SUB1",
      "roleId": "SUBADMIN",
      "status": 2
    }
  ],
  "nodeList": [
    {
      "orgId": "ORG1.SUB1",
      "status": 2,
      "url": "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
    }
  ],
  "roleList": [
    {
      "access": 3,
      "active": true,
      "isAdmin": true,
      "isVoter": false,
      "orgId": "ORG1.SUB1",
      "roleId": "SUBADMIN"
    }
  ],
  "subOrgList": null
}
```

<!--/tabs-->

The account `0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0` is now the admin for `SUB1` and can add roles, accounts, and nodes to the sub-organization.

Add a new role `TRANSACT` to `SUB1` with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.addNewRole("ORG1.SUB1", "TRANSACT", 1, false, true, {
  from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
});
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View `SUB1`'s role list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").roleList;
```

# geth console result

```json
[
  {
    "access": 3,
    "active": true,
    "isAdmin": true,
    "isVoter": false,
    "orgId": "ORG1.SUB1",
    "roleId": "SUBADMIN"
  },
  {
    "access": 1,
    "active": true,
    "isAdmin": true,
    "isVoter": false,
    "orgId": "ORG1.SUB1",
    "roleId": "TRANSACT"
  }
]
```

<!--/tabs-->

:::note

The organization admin account at the master organization level has the admin rights on all the children sub-organizations. However, the admin account at the sub-organization level has control only in its sub-organization.

:::

To add an account to an organization, use [`quorumPermission_addAccountToOrg`](../../reference/api-methods.md#quorumpermission_addaccounttoorg):

<!--tabs-->

# geth console request

```javascript
quorumPermission.addAccountToOrg(
  "0x283f3b8989ec20df621166973c93b56b0f4b5455",
  "ORG1.SUB1",
  "SUBADMIN",
  { from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the organization's account list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").acctList;
```

# geth console result

```json
[
  {
    "acctId": "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "SUBADMIN",
    "status": 2
  },
  {
    "acctId": "0x283f3b8989ec20df621166973c93b56b0f4b5455",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "TRANSACT",
    "status": 2
  }
]
```

<!--/tabs-->

To suspend an account, use [`quorumPermission_updateAccountStatus`](../../reference/api-methods.md#quorumpermission_updateaccountstatus) with `action` set to 1:

<!--tabs-->

# geth console request

```javascript
quorumPermission.updateAccountStatus(
  "ORG1.SUB1",
  "0x283f3b8989ec20df621166973c93b56b0f4b5455",
  1,
  { from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the account's updated status in the organization's account list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").acctList;
```

# geth console result

```json
[
  {
    "acctId": "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "SUBADMIN",
    "status": 2
  },
  {
    "acctId": "0x283f3b8989ec20df621166973c93b56b0f4b5455",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "TRANSACT",
    "status": 1
  }
]
```

<!--/tabs-->

To revoke suspension of an account, use [`quorumPermission_updateAccountStatus`](../../reference/api-methods.md#quorumpermission_updateaccountstatus) with `action` set to 2:

<!--tabs-->

# geth console request

```javascript
quorumPermission.updateAccountStatus(
  "ORG1.SUB1",
  "0x283f3b8989ec20df621166973c93b56b0f4b5455",
  2,
  { from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0" },
);
```

# geth console result

```json
"Action completed successfully"
```

:::

<!--/tabs-->

View the account's updated status in the organization's account list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").acctList;
```

# geth console result

```json
[
  {
    "acctId": "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "SUBADMIN",
    "status": 2
  },
  {
    "acctId": "0x283f3b8989ec20df621166973c93b56b0f4b5455",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "TRANSACT",
    "status": 2
  }
]
```

<!--/tabs-->

To exclude an account, use [`quorumPermission_updateAccountStatus`](../../reference/api-methods.md#quorumpermission_updateaccountstatus) with `action` set to 3:

<!--tabs-->

# geth console request

```javascript
quorumPermission.updateAccountStatus(
  "ORG1.SUB1",
  "0x283f3b8989ec20df621166973c93b56b0f4b5455",
  3,
  { from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

Once excluded, no further activity is possible on the account. View the account's updated status in the organization's account list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").acctList;
```

# geth console result

```json
[
  {
    "acctId": "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "SUBADMIN",
    "status": 2
  },
  {
    "acctId": "0x283f3b8989ec20df621166973c93b56b0f4b5455",
    "isOrgAdmin": true,
    "orgId": "ORG1.SUB1",
    "roleId": "TRANSACT",
    "status": 5
  }
]
```

<!--/tabs-->

To add nodes at the organization and sub-organization level, use [`quorumPermission_addNode`](../../reference/api-methods.md#quorumpermission_addnode):

<!--tabs-->

# geth console request

```javascript
quorumPermission.addNode(
  "ORG1.SUB1",
  "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0",
  { from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the organization's updated node list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").nodeList;
```

# geth console result

```json
[
  {
    "orgId": "ORG1.SUB1",
    "status": 2,
    "url": "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
  },
  {
    "orgId": "ORG1.SUB1",
    "status": 2,
    "url": "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
  }
]
```

<!--/tabs-->

To manage the status of the nodes, use [`quorumPermission_updateNodeStatus`](../../reference/api-methods.md#quorumpermission_updatenodestatus). To deactivate a node, call the method with `action` set to 1:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").nodeList;
```

# geth console result

```json
[
  {
    "orgId": "ORG1.SUB1",
    "status": 2,
    "url": "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
  },
  {
    "orgId": "ORG1.SUB1",
    "status": 3,
    "url": "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
  }
]
```

<!--/tabs-->

To re-activate a node, use [`quorumPermission_updateNodeStatus`](../../reference/api-methods.md#quorumpermission_updatenodestatus) with `action` set to 2:

<!--tabs-->

# geth console request

```javascript
quorumPermission.updateNodeStatus(
  "ORG1.SUB1",
  "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0",
  2,
  { from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the node's updated status in the organization's node list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").nodeList;
```

# geth console result

```json
[
  {
    "orgId": "ORG1.SUB1",
    "status": 2,
    "url": "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
  },
  {
    "orgId": "ORG1.SUB1",
    "status": 2,
    "url": "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
  }
]
```

<!--/tabs-->

To exclude a node, use [`quorumPermission_updateNodeStatus`](../../reference/api-methods.md#quorumpermission_updatenodestatus) with `action` set to 3:

<!--tabs-->

# geth console request

```javascript
quorumPermission.getOrgDetails("ORG1.SUB1").nodeList;
```

# geth console result

```json
[
  {
    "orgId": "ORG1.SUB1",
    "status": 2,
    "url": "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
  },
  {
    "orgId": "ORG1.SUB1",
    "status": 4,
    "url": "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
  }
]
```

<!--/tabs-->

Once excluded, a node can't re-join a network.

:::note

- In Raft consensus, when a node is deactivated, the peer ID is lost. Upon activation, the node needs to be added to the Raft cluster again using `raft.addPeer` and the node should be brought up with a new peer ID.
- An account can transact from any of the nodes within the same organization.
- No transaction is allowed from a deactivated node.

:::

## Suspending an organization temporarily

If you need to temporarily suspend all activities of an organization, use [`quorumPermission_updateOrgStatus`](../../reference/api-methods.md#quorumpermission_updateorgstatus) with `action` set to `1`. This can be invoked only by network admin accounts and requires majority approval.

### Example

Suspend `ORG1` with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.updateOrgStatus("ORG1", 1, {
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
});
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the organization's updated status in the organization list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.orgList[2];
```

# geth console result

```json
{
  "fullOrgId": "ORG1",
  "level": 1,
  "orgId": "ORG1",
  "parentOrgId": "",
  "status": 3,
  "subOrgList": null,
  "ultimateParent": "ORG1"
}
```

<!--/tabs-->

Suspending an organization requires majority approval from other network admin accounts, using [`quorumPermission_approveOrgStatus`](../../reference/api-methods.md#quorumpermission_approveorgstatus). Once approved the organization status is marked as `Suspended`.

<!--tabs-->

# geth console request

```javascript
quorumPermission.approveOrgStatus("ORG1", 1, {
  from: "0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
});
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the organization's updated status in the organization list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.orgList[2];
```

# geth console result

```json
{
  "fullOrgId": "ORG1",
  "level": 1,
  "orgId": "ORG1",
  "parentOrgId": "",
  "status": 4,
  "subOrgList": null,
  "ultimateParent": "ORG1"
}
```

<!--/tabs-->

When the organization is suspended, no transaction from any of the accounts linked to the organization or sub-organizations under it is allowed. However, the nodes linked to the organization are active and are syncing with the network.

## Revoking suspension of an organization

To revoke the suspension of an organization, use [`quorumPermission_updateOrgStatus`](../../reference/api-methods.md#quorumpermission_updateorgstatus) with `action` set to 2.

### Example

Revoke the suspension of `ORG1` with the following command:

<!--tabs-->

# geth console request

```javascript
quorumPermission.updateOrgStatus("ORG1", 2, {
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
});
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

Revoking an organization's suspension requires majority approval using [`quorumPermission_approveOrgStatus`](../../reference/api-methods.md#quorumpermission_approveorgstatus) with `action` set to 2:

<!--tabs-->

# geth console request

```javascript
quorumPermission.approveOrgStatus("ORG1", 2, {
  from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
});
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the organization's updated status in the organization list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.orgList[0];
```

# geth console result

```json
{
  "fullOrgId": "ORG1.SUB1",
  "level": 2,
  "orgId": "SUB1",
  "parentOrgId": "ORG1",
  "status": 2,
  "subOrgList": null,
  "ultimateParent": "ORG1"
}
```

<!--/tabs-->

Once the revoke is approved, all accounts in the organization and sub-organizations under it are able to transact as per role level access.

## Assigning admin privileges at organization and network level

At times, an account at the organization level may need be able to perform network admin activities. Also, there may be a need to change the admin account at organization level.

Both of these activities can be performed by existing network admin accounts only, and will require majority approval from the network admin accounts.

### Example

To assign a network admin or organization admin role to an account, use [`quorumPermission_assignAdminRole`](../../reference/api-methods.md#quorumpermission_assignadminrole):

<!--tabs-->

# geth console request

```javascript
quorumPermission.assignAdminRole(
  "ORG1",
  "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
  "ADMIN",
  { from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d" },
);
```

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the account's updated role in the account list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.acctList[3];
```

# geth console result

````json
{
  acctId: "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
  isOrgAdmin: true,
  orgId: "ORG1",
  roleId: "ADMIN",
  status: 1
}
    ```

<!--/tabs-->

To approve the assignment of a network admin role, use [`quorumPermission_approveAdminRole`](../../reference/api-methods.md#quorumpermission_approveadminrole):

<!--tabs-->

# geth console request

```javascript
quorumPermission.approveAdminRole(
  "ORG1",
  "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
  { from: eth.accounts[0] },
);
````

# geth console result

```json
"Action completed successfully"
```

<!--/tabs-->

View the account's updated status in the account list:

<!--tabs-->

# geth console request

```javascript
quorumPermission.acctList[4];
```

# geth console result

```json
{
  "acctId": "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
  "isOrgAdmin": true,
  "orgId": "ORG1",
  "roleId": "ADMIN",
  "status": 2
}
```

<!--/tabs-->

The account can now perform all activities allowable by a network admin account and can participate in the approval process for any actions at network level.
