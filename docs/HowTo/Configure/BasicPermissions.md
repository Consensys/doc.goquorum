## Configure Basic Permissions

Node Permissioning is used to define:

1. The nodes that a particular GoQuorum node is able to connect to
2. The nodes that a particular GoQuorum node is able to receive connections from

In the [basic permissions model](../../Concepts/Permissioning/BasicNetworkPermissions.md), permissioning
is managed at the individual node level by using the `--permissioned` command line flag when starting the node.

If a node is started with `--permissioned` set, the node looks for a `<data-dir>/permissioned-nodes.json` file.
This file contains the list of enodes that this node can connect to and accept connections from.  In other
words, if permissioning is enabled, only the nodes that are listed in the `permissioned-nodes.json` file become part of the network. 

If `--permissioned` is set, a `permissioned-nodes.json` file must be provided. If the flag is set but
no nodes are present in this file, the node is unable to make any outward connections or accept any
incoming connections.

The format of `permissioned-nodes.json` is similar to `static-nodes.json`:

```json
[
  "enode://enodehash1@ip1:port1",
  "enode://enodehash2@ip2:port2",
  "enode://enodehash3@ip3:port3"
]
```

For example, including the hash, a sample file might look like:

```json
[
  "enode://6598638ac5b15ee386210156a43f565fa8c48592489d3e66ac774eac759db9eb52866898cf0c5e597a1595d9e60e1a19c84f77df489324e2f3a967207c047470@127.0.0.1:30300"
]
```
