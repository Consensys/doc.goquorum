---
title: Basic permissioning
description: Configure basic permissions
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Configure basic permissions

[Basic network permissioning](../../../concepts/permissions-overview.md#basic-network-permissioning) is a feature that controls which nodes can connect to a given node, and which nodes the given node can dial out to. Configure basic permissions by providing the [--permissioned](../../../reference/cli-syntax.md#permissioned) command line option when starting the node.

If `--permissioned` is set, the node looks for a file named `<data-dir>/permissioned-nodes.json`. This file contains the allowlist of enodes that this node can connect to and accept connections from. Only the nodes that are listed in the `permissioned-nodes.json` file become part of the network.

If `--permissioned` is specified but no nodes are added to the `permissioned-nodes.json` file, this node can neither connect to any nodes nor accept any incoming connections.

The `permissioned-nodes.json` file is structured as follows, which is similar to the `<data-dir>/static-nodes.json` file that is used to specify the list of static nodes a given node always connects to:

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```json title="permissioned-nodes.json"
[
  "enode://remotekey1@ip1:port1",
  "enode://remotekey2@ip2:port2",
  "enode://remotekey3@ip3:port3"
]
```
  </TabItem>
  <TabItem value="Example" label="Example" default>

```json title="permissioned-nodes.json"
[
  "enode://6598638ac5b15ee386210156a43f565fa8c48592489d3e66ac774eac759db9eb52866898cf0c5e597a1595d9e60e1a19c84f77df489324e2f3a967207c047470@127.0.0.1:30300"
]
```

  </TabItem>
</Tabs>

:::note

You can use DNS names instead of IP addresses to specify nodes in `permissioned-nodes.json` and `static-nodes.json`. Only bootnodes need to be specified with IP addresses.

:::

:::caution

Every node has its own copy of the `permissioned-nodes.json` file. If different nodes have different lists of remote keys, then each node may have a different list of permissioned nodes which may have an adverse effect on the network.

:::
