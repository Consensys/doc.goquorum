---
description: Permissioning types reference
---

# Permissioning types

This reference describes account access and status types for
[permissioning](../Concepts/PermissionsOverview.md).

## Account access types

When setting the account access, the system checks if the account setting the access has
sufficient privileges to grant account access.

The following table indicates the numeric value and granting privileges for each account access type.

|   AccessType   | Value | Granting Privileges                    |
|:--------------:|:-----:|:--------------------------------------:|
|    ReadOnly    |   0   | none                                   |
|    Transact    |   1   | Transact and ReadOnly                  |
| ContractDeploy |   2   | ContractDeploy, Transact, and ReadOnly |
|   FullAccess   |   3   | any                                    |

* Accounts with `FullAccess` can grant any access type.

* Accounts with `ContractDeploy` can grant only `Transact`, `ContractDeploy` or `ReadOnly` access to other accounts.

* Accounts with `Transact` access can grant only `Transact` or `ReadOnly` access to other accounts.

* Accounts with `ReadOnly` access cannot grant any access.

### Organization status types

The following table indicates the numeric value for each organization status.

| OrgStatus                | Value |
| :----------------------: | :---: |
| NotInList                |     0 |
| Proposed                 |     1 |
| Approved                 |     2 |
| PendingSuspension        |     3 |
| Suspended                |     4 |
| AwaitingSuspensionRevoke |     5 |

### Account status types

The following table indicates the numeric value for each account status.

| AccountStatus                              | Value |
| :----------------------------------------: | :---: |
| Not In List                                |     0 |
| Pending Approval                           |     1 |
| Active                                     |     2 |
| Suspended                                  |     4 |
| Denylisted                                 |     5 |
| Revoked                                    |     6 |
| Recovery initiated for Denylisted accounts |     7 |

### Node status types

The following table indicates the numeric value for each node status.

| NodeStatus                             | Value |
| :------------------------------------: | :---: |
| NotInList                              |     0 |
| PendingApproval                        |     1 |
| Approved                               |     2 |
| Deactivated                            |     3 |
| Denylisted                             |     4 |
| Recovery initiated for Denylisted Node |     5 |
