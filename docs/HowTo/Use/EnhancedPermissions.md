---
description: Using enhanced smart contract based permissioning
---

# Using enhanced permissioning

Managing the [enhanced permissioning model](../../Concepts/Permissioning/Enhanced/EnhancedPermissionsOverview.md)
can be broadly categorized into the following activities:

## Initial network set up

Please refer to [set up](../Configure/EnhancedPermissions.md). For an existing network running with an older version of GoQuorum:

* Upgrade GoQuorum to the latest version
* Deploy the contracts
* Execute the `init` method of `PermissionsUpgradable.sol` from the guardian account
* Copy the `permission-config.json` to the data directory of each node
* Bring `geth` up in `--permissioned` mode.

For a new network using the latest version of GoQuorum:

* Bring up the initial set of nodes
* Deploy the contracts
* Execute the `init` method of `PermissionsUpgradable.sol` from the guardian account
* Upgrade GoQuorum to the latest version
* Copy the `permission-config.json` to the data directory of each node
* Bring `geth` up in `--permissioned` mode.

As part of network initialization:

* A network admin organization is created with the `nwAdminOrg` name specified in `permission-config.json`. All nodes which are part of `static-nodes.json` are assigned to this organization.
* A network admin role is created with the `nwAdminRole` name specified in the config file.
* All accounts given in the `accounts` array of the config file are assigned the network admin role. These accounts will have the ability to propose and approve new organizations into the network.

!!!example

    Assuming that the network was started with the `permission-config.json` given in the [set up](../Configure/EnhancedPermissions.md), and assuming the network was brought up with the `static-nodes.json` file as the following:

    ```json
    [
        "enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0",
        "enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0",
        "enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0",
        "enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
    ]
    ```

    then the network will have the following configuration once it has started up:

    Run the following command in Geth console:

    ```javascript
    quorumPermission.orgList
    ```

    Result is:

    ```json
    [{
        fullOrgId: "ADMINORG",
        level: 1,
        orgId: "ADMINORG",
        parentOrgId: "",
        status: 2,
        subOrgList: null,
        ultimateParent: "ADMINORG"
    }]
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ADMINORG")
    ```

    Result is:

    ```json
    {
      acctList: [{
          acctId: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
          isOrgAdmin: true,
          orgId: "ADMINORG",
          roleId: "ADMIN",
          status: 2
      }, {
          acctId: "0xca843569e3427144cead5e4d5999a3d0ccf92b8e",
          isOrgAdmin: true,
          orgId: "ADMINORG",
          roleId: "ADMIN",
          status: 2
      }],
      nodeList: [{
          orgId: "ADMINORG",
          status: 2,
          url: "enode://72c0572f7a2492cffb5efc3463ef350c68a0446402a123dacec9db5c378789205b525b3f5f623f7548379ab0e5957110bffcf43a6115e450890f97a9f65a681a@127.0.0.1:21000?discport=0"
      }, {
          orgId: "ADMINORG",
          status: 2,
          url: "enode://7a1e3b5c6ad614086a4e5fb55b6fe0a7cf7a7ac92ac3a60e6033de29df14148e7a6a7b4461eb70639df9aa379bd77487937bea0a8da862142b12d326c7285742@127.0.0.1:21001?discport=0"
      }, {
          orgId: "ADMINORG",
          status: 2,
          url: "enode://5085e86db5324ca4a55aeccfbb35befb412def36e6bc74f166102796ac3c8af3cc83a5dec9c32e6fd6d359b779dba9a911da8f3e722cb11eb4e10694c59fd4a1@127.0.0.1:21002?discport=0"
      }, {
          orgId: "ADMINORG",
          status: 2,
          url: "enode://28a4afcf56ee5e435c65b9581fc36896cc684695fa1db83c9568de4353dc6664b5cab09694d9427e9cf26a5cd2ac2fb45a63b43bb24e46ee121f21beb3a7865e@127.0.0.1:21003?discport=0"
      }],
      roleList: [{
          access: 3,
          active: true,
          isAdmin: true,
          isVoter: true,
          orgId: "ADMINORG",
          roleId: "ADMIN"
      }],
      subOrgList: null
    }
    ```

### Proposing a new organization into the network

Once the network is up, the network admin accounts can then propose a new organization into the network.

Majority approval from the network admin accounts is required before an organization is approved.

The APIs for [proposing](../../Reference/API-Methods.md#quorumpermission_addorg) and
[approving](../../Reference/API-Methods.md#quorumpermission_approveorg) an organization are documented in
[permission APIs](../../Reference/API-Methods.md#permission-methods).

!!!example
    An example to propose and approve an organization by name `ORG1` is as shown below:

    Run the following command in Geth console:

    ```javascript
    quorumPermission.addOrg("ORG1", "enode://de9c2d5937e599930832cecc1df8cc90b50839bdf635c1a4e68e1dab2d001cd4a11c626e155078cc65958a72e2d72c1342a28909775edd99cc39470172cce0ac@127.0.0.1:21004?discport=0", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", {from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Once the org is proposed, it will be in `Proposed` state awaiting approval from other network admin accounts.

    List the org status using the following command:

    Run the following command in Geth console:

    ```javascript
    quorumPermission.orgList[1]
    ```

    Result is:

    ```json
    {
        fullOrgId: "ORG1",
        level: 1,
        orgId: "ORG1",
        parentOrgId: "",
        status: 1,
        subOrgList: null,
        ultimateParent: "ORG1"
    }
    ```

    The network admin accounts can then approve the proposed organizations and once the majority approval is achieved, the organization status is updated as `Approved`

    Run the following command in Geth console:

    ```javascript
    quorumPermission.approveOrg("ORG1", "enode://de9c2d5937e599930832cecc1df8cc90b50839bdf635c1a4e68e1dab2d001cd4a11c626e155078cc65958a72e2d72c1342a28909775edd99cc39470172cce0ac@127.0.0.1:21004?discport=0", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", {from: "0xca843569e3427144cead5e4d5999a3d0ccf92b8e"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```



    Run the following command in Geth console:

    ```javascript
    quorumPermission.orgList[1]
    ```

    Result is:

    ```json
    {
        fullOrgId: "ORG1",
        level: 1,
        orgId: "ORG1",
        parentOrgId: "",
        status: 2,
        subOrgList: null,
        ultimateParent: "ORG1"
    }
    ```

    The details of the new organization approved are as below:

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1")
    ```

    Result is:

    ```json
    {
        acctList: [{
            acctId: "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
            isOrgAdmin: true,
            orgId: "ORG1",
            roleId: "ORGADMIN",
            status: 2
        }],
        nodeList: [{
            orgId: "ORG1",
            status: 2,
            url: "enode://de9c2d5937e599930832cecc1df8cc90b50839bdf635c1a4e68e1dab2d001cd4a11c626e155078cc65958a72e2d72c1342a28909775edd99cc39470172cce0ac@127.0.0.1:21004?discport=0"
        }],
        roleList: [{
            access: 3,
            active: true,
            isAdmin: true,
            isVoter: true,
            orgId: "ORG1",
            roleId: "ORGADMIN"
        }],
        subOrgList: null
    }
    ```

    * A org admin role with name as given in `orgAdminRole` in `permission-config.json` has been created and linked to the organization `ORG1`
    * The account given has been linked to the organization `ORG1` and org admin role. This account acts as the organization admin account and can in turn manage further roles, nodes and accounts at organization level
    * The node has been linked to organization and status has been updated as `Approved`

    The new node belonging to the organization can now join the network. In case the network is running in `Raft` consensus mode, before the node joins the network, please ensure that:

    * The node has been added as a peer using `raft.addPeer(<<enodeId>>)`
    * Bring up `geth` for the new node using `--raftjoinexisting` with the peer id as obtained in the above step

### Organization admin managing the organization level permissions

Once the organization is approved and the node of the organization has joined the network, the organization admin can:

* create sub organizations, roles, add additional nodes at organization level.
* add accounts to the organization.
* change roles of existing organization level accounts.

Use [`quorumPermission_addSubOrg`](../../Reference/API-Methods.md#quorumpermission_addsuborg) to add a sub org at `ORG1`
level.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.addSubOrg("ORG1", "SUB1", "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0", {from: eth.accounts[0]})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1")
    ```

    Result is:

    ```json
    {
      acctList: null,
      nodeList: [{
          orgId: "ORG1.SUB1",
          status: 2,
          url: "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
      }],
      roleList: null,
      subOrgList: null
    }
    ```

The enode ID is not mandatory for adding a sub-organization.

If the organization admin wants to add an administration account for the newly created sub-organization, the
organization admin account must first create a role using
[`quorumPermission_addNewRole`](../../Reference/API-Methods.md#quorumpermission_addnewrole) with `isAdmin` flag as `Y`,
then assign this role to the account which belongs to the sub-organization.

Once assigned, the account will act as organization admin at the sub-organization level.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.addNewRole("ORG1.SUB1", "SUBADMIN", 3, false, true,{from: eth.accounts[0]})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    eth.accounts[0]
    ```

    Result is:

    ```json
    "0x0638e1574728b6d862dd5d3a3e0942c3be47d996"
    ```

The role `SUBADMIN` can now be assigned to an account at sub org `SUB1` for making the account admin for the sub org.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.addAccountToOrg("0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0", "ORG1.SUB1", "SUBADMIN", {from: "0x0638e1574728b6d862dd5d3a3e0942c3be47d996"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1")
    ```

    Result is:

    ```json
    {
      acctList: [{
          acctId: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
          isOrgAdmin: true,
          orgId: "ORG1.SUB1",
          roleId: "SUBADMIN",
          status: 2
      }],
      nodeList: [{
          orgId: "ORG1.SUB1",
          status: 2,
          url: "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
      }],
      roleList: [{
          access: 3,
          active: true,
          isAdmin: true,
          isVoter: false,
          orgId: "ORG1.SUB1",
          roleId: "SUBADMIN"
      }],
      subOrgList: null
    }
    ```

    The account `0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0` is now the admin for sub org `SUB1` and will be able to add roles, accounts and nodes to the sub org.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.addNewRole("ORG1.SUB1", "TRANSACT", 1, false, true,{from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").roleList
    ```

    Result is:

    ```json
    [{
        access: 3,
        active: true,
        isAdmin: true,
        isVoter: false,
        orgId: "ORG1.SUB1",
        roleId: "SUBADMIN"
    }, {
        access: 1,
        active: true,
        isAdmin: true,
        isVoter: false,
        orgId: "ORG1.SUB1",
        roleId: "TRANSACT"
    }]
    ```

!!!note

    The organization admin account at the master organization level has the admin rights on all the children
    sub-organizations.
    However, the admin account at the sub-organization level has control only in its sub-organization.

To add an account to an organization, use
[`quorumPermission_addAccountToOrg`](../../Reference/API-Methods.md#quorumpermission_addaccounttoorg).

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.addAccountToOrg("0x283f3b8989ec20df621166973c93b56b0f4b5455", "ORG1.SUB1", "SUBADMIN", {from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").acctList
    ```

    Result is:

    ```json
    [{
        acctId: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "SUBADMIN",
        status: 2
    }, {
        acctId: "0x283f3b8989ec20df621166973c93b56b0f4b5455",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "TRANSACT",
        status: 2
    }]
    ```

To suspend an account, use
[`quorumPermission_updateAccountStatus`](../../Reference/API-Methods.md#quorumpermission_updateaccountstatus) with
`action` set to 1.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.updateAccountStatus("ORG1.SUB1", "0x283f3b8989ec20df621166973c93b56b0f4b5455", 1, {from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").acctList
    ```

    Result is:

    ```json
    [{
        acctId: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "SUBADMIN",
        status: 2
    }, {
        acctId: "0x283f3b8989ec20df621166973c93b56b0f4b5455",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "TRANSACT",
        status: 1
    }]
    ```

To revoke suspension of an account, use
[`quorumPermission_updateAccountStatus`](../../Reference/API-Methods.md#quorumpermission_updateaccountstatus)
with `action` set to 2.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.updateAccountStatus("ORG1.SUB1", "0x283f3b8989ec20df621166973c93b56b0f4b5455", 2, {from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").acctList
    ```

    Result is:

    ```json
    [{
        acctId: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "SUBADMIN",
        status: 2
    }, {
        acctId: "0x283f3b8989ec20df621166973c93b56b0f4b5455",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "TRANSACT",
        status: 2
    }]
    ```

To exclude an account, use
[`quorumPermission_updateAccountStatus`](../../Reference/API-Methods.md#quorumpermission_updateaccountstatus) with
`action` set to 3.

Once exclude, no further activity will be possible on the account.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.updateAccountStatus("ORG1.SUB1", "0x283f3b8989ec20df621166973c93b56b0f4b5455", 3, {from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").acctList
    ```

    Result is:

    ```json
    [{
        acctId: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "SUBADMIN",
        status: 2
    }, {
        acctId: "0x283f3b8989ec20df621166973c93b56b0f4b5455",
        isOrgAdmin: true,
        orgId: "ORG1.SUB1",
        roleId: "TRANSACT",
        status: 5
    }]
    ```

To add nodes at the organization and sub-organization level, use
[`quorumPermission_addNode`](../../Reference/API-Methods.md#quorumpermission_addnode).

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.addNode("ORG1.SUB1", "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0", {from: "0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").nodeList
    ```

    Result is:

    ```json
    [{
        orgId: "ORG1.SUB1",
        status: 2,
        url: "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
    }, {
        orgId: "ORG1.SUB1",
        status: 2,
        url: "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
    }]
    ```

To manage the status of the nodes, use
[`quorumPermission_updateNodeStatus`](../../Reference/API-Methods.md#quorumpermission_updatenodestatus).
To deactivate a node, call the method with `action` set to 1.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").nodeList
    ```

    Result is:

    ```json
    [{
        orgId: "ORG1.SUB1",
        status: 2,
        url: "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
    }, {
        orgId: "ORG1.SUB1",
        status: 3,
        url: "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
    }]
    ```

To re-activate a node, use
[`quorumPermission_updateNodeStatus`](../../Reference/API-Methods.md#quorumpermission_updatenodestatus) with `action`
set to 2.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.updateNodeStatus("ORG1.SUB1", "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0",2, {from:"0x42ef6abedcb7ecd3e9c4816cd5f5a96df35bb9a0"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").nodeList
    ```

    Result is:

    ```json
    [{
        orgId: "ORG1.SUB1",
        status: 2,
        url: "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
    }, {
        orgId: "ORG1.SUB1",
        status: 2,
        url: "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
    }]
    ```

To exclude a node, use
[`quorumPermission_updateNodeStatus`](../../Reference/API-Methods.md#quorumpermission_updatenodestatus) with `action`
set to 3. Once excluded, a node can't re-join the network.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.getOrgDetails("ORG1.SUB1").nodeList
    ```

    Result is:

    ```json
    [{
        orgId: "ORG1.SUB1",
        status: 2,
        url: "enode://239c1f044a2b03b6c4713109af036b775c5418fe4ca63b04b1ce00124af00ddab7cc088fc46020cdc783b6207efe624551be4c06a994993d8d70f684688fb7cf@127.0.0.1:21006?discport=0"
    }, {
        orgId: "ORG1.SUB1",
        status: 4,
        url: "enode://eacaa74c4b0e7a9e12d2fe5fee6595eda841d6d992c35dbbcc50fcee4aa86dfbbdeff7dc7e72c2305d5a62257f82737a8cffc80474c15c611c037f52db1a3a7b@127.0.0.1:21005?discport=0"
    }]
    ```

!!!note
    In the case of the `Raft` consensus mechanism, when the node is deactivated the peer id is lost and
    hence upon activation, the node needs to be added to Raft cluster again using `raft.addPeer`
    and the node should be brought up with new peer id.

Further:

* An account can transact from any of the nodes linked to org or sub org with in the same organization
* If a node is deactivated no transaction will be allowed from that node

### Suspending an organization temporarily

If you need to temporarily suspend all activities of an organization, use
[`quorumPermission_updateOrgStatus`](../../Reference/API-Methods.md#quorumpermission_updateorgstatus) with
`action` set to `. This can be invoked only by network admin accounts and requires majority approval.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.updateOrgStatus("ORG1", 1, {from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.orgList[2]
    ```

    Result is:

    ```json
    {
      fullOrgId: "ORG1",
      level: 1,
      orgId: "ORG1",
      parentOrgId: "",
      status: 3,
      subOrgList: null,
      ultimateParent: "ORG1"
    }
    ```

To approve an organization, use
[`quorumPermission_approveOrgStatus`](../../Reference/API-Methods.md#quorumpermission_approveorgstatus).

Suspending an organization requires majority approval from other network admin accounts.
Once approved the organization status is marked as suspended.

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.approveOrgStatus("ORG1", 1, {from: "0xca843569e3427144cead5e4d5999a3d0ccf92b8e"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.orgList[2]
    ```

    Result is:

    ```json
    {
      fullOrgId: "ORG1",
      level: 1,
      orgId: "ORG1",
      parentOrgId: "",
      status: 4,
      subOrgList: null,
      ultimateParent: "ORG1"
    }
    ```

When the org is suspended no transaction from any of the account linked to the organization or sub
organizations under it is allowed.
However, the nodes linked to the organization will be active and will be syncing with the network.

### Revoking suspension of an organization

To revoke the suspension of an organization, use
[`quorumPermission_updateOrgStatus`](../../Reference/API-Methods.md#quorumpermission_updateorgstatus) with `action` set
to 2.
Revoking an organization's suspension requires majority approval (using
[`quorumPermission_approveOrgStatus`](../../Reference/API-Methods.md#quorumpermission_approveorgstatus) with `action`
set to 2).

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.updateOrgStatus("ORG1", 2, {from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.approveOrgStatus("ORG1", 2, {from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.orgList[0]
    ```

    Result is:

    ```json
    {
      fullOrgId: "ORG1.SUB1",
      level: 2,
      orgId: "SUB1",
      parentOrgId: "ORG1",
      status: 2,
      subOrgList: null,
      ultimateParent: "ORG1"
    }
    ```

Once the revoke is approved, all accounts in the organization and sub organization will be able to
transact as per role level access.

### Assigning admin privileges at organization and network level

There may be a scenario where one of the accounts at the organization level needs to have network
admin level permissions and be able to perform network admin activities.

Similarly there can be a need to change the admin account at organization level.

Both these activities can be performed by existing network admin accounts only, and will require
majority approval from the network admin accounts.

#### API usage details

To assign a network admin or organization admin role to an account, use
[`quorumPermission_assignAdminRole`](../../Reference/API-Methods.md#quorumpermission_assignadminrole).

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.assignAdminRole("ORG1", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", "ADMIN", {from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d"})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.acctList[3]
    ```

    Result is:

    ```json
    {
      acctId: "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
      isOrgAdmin: true,
      orgId: "ORG1",
      roleId: "ADMIN",
      status: 1
    }
    ```

To approve the assignment of a network admin role, use
[`quorumPermission_approveAdminRole`](../../Reference/API-Methods.md#quorumpermission_approveadminrole).

!!!example

    Run the following command in Geth console:

    ```javascript
    quorumPermission.approveAdminRole("ORG1", "0x0638e1574728b6d862dd5d3a3e0942c3be47d996", {from: eth.accounts[0]})
    ```

    Result is:

    ```json
    "Action completed successfully"
    ```

    Run the following command in Geth console:

    ```javascript
    quorumPermission.acctList[4]
    ```

    Result is:

    ```json
    {
      acctId: "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
      isOrgAdmin: true,
      orgId: "ORG1",
      roleId: "ADMIN",
      status: 2
    }
    ```

The above account can now perform all activities allowable by a network admin account and can participate in the approval process for any actions at network level.
