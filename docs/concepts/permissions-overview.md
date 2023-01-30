---
title: Permissioning
description: Permissioning overview
sidebar_position: 8
---

# Permissioning

GoQuorum supports two network permissioning models, [basic network permissioning](#basic-network-permissioning) and [enhanced network permissioning](#enhanced-network-permissioning).

## Basic network permissioning

In the basic network permissioning model, you can control:

- The nodes that a particular GoQuorum node can connect to.
- The nodes that a particular GoQuorum node can receive connections from.

It is managed at the individual node level by providing the [`--permissioned`](../reference/cli-syntax.md#permissioned) command line option when starting the node.

You can [configure basic network permissioning](../configure-and-manage/configure/permissioning/basic-permissions.md).

## Enhanced network permissioning

The enhanced network permissioning model caters to enterprise-level needs by using smart contracts. It has significant flexibility to manage nodes, accounts, and account-level access controls. Two versions of enhanced network permissioning are available:

- Version 1 - The permissioning rules are applied only at the time of transaction entry with respect to the permissioning data stored in node memory.
- Version 2 - The permissioning rules are applied both at the time of transaction entry and block minting with respect to the data stored in the permissioning contracts.

You can configure [enhanced network permissioning](../configure-and-manage/manage/enhanced-permissions.md).

### Key definitions

![permissions mode](../images/PermissionsModel.png)

- Network - A set of interconnected nodes representing an enterprise blockchain. The network comprises a group of organizations. The network administrator accounts defined at the network level can propose and approve new organizations to join the network, and can assign an account as an organization administrator.
- Organization - A set of roles, Ethereum accounts, and nodes having a variety of permissions to interact with the network. The organization administrator can create roles, create sub-organizations, assign roles to its accounts, and add any other node that is part of the organization. The organization administrator can assign an account as a sub-organization administrator.
- Sub-organization - A sub-group within an organization, corresponding to business needs. A sub-organization can have its own set of roles, accounts, and sub-organizations.
- Account - An externally-owned Ethereum account. The access rights of an account are derived based on the role assigned to it. The account can transact via any node linked to its sub-organization or at the organization level.
- Voter - An account capable of voting for a certain action.
- Role - A named job function in an organization.
- Node - A `geth` node that is part of the network and belongs to an organization or sub-organization.
