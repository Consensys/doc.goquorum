---
title: DNS
description: how to DNS
sidebar_position: 10
---

# DNS for GoQuorum

DNS support in GoQuorum can be used in the static nodes file and the node discovery protocol. You can use one and not the other, or both, as the use case requires.

## Static nodes

Static nodes are nodes you keep reference to in a `static-nodes.json` file, even if the nodes are not alive. As the static nodes comes alive, you can connect to them.

You can specify the static nodes by their IP addresses or their DNS names, which are resolved once at startup.

If a static peer goes offline and its IP address changes, then it is expected that this peer re-establish the connection in a fully static network, or have discovery enabled.

## Discovery

DNS is not supported for the discovery protocol. Use a bootnode instead, which can use a DNS name that is repeatedly resolved.

## Compatibility

For Raft, the whole network must be on GoQuorum version 2.4.0 or later for DNS to function properly. DNS must be explicitly enabled using the [`--raftdnsenable`](../../reference/cli-syntax.md#raftdnsenable) option for each node once the node has migrated to version 2.4.0 or later. The network runs fine when some nodes are in version 2.4.0 or later and some in older versions as long as this feature is not enabled. For safe migration the following approach is recommended:

1. Migrate the nodes to GoQuorum version 2.4.0 or later without using `--raftdnsenable` option.
1. Once the network is fully migrated, restart the nodes with `--raftdnsenable` to enable the feature.

In a partially migrated network (where some nodes are on version 2.4.0 or later and others on lower versions) with DNS feature enabled for migrated nodes, [`raft_addPeer`](../../reference/api-methods.md#raft_addpeer) should not be invoked with a DNS name until the entire network migrates to version 2.4.0 or later. If invoked, this call will crash all nodes running in older versions and these nodes will have to be restarted with GoQuorum version 2.4.0 or later. `raft_addPeer` can still be invoked with an IP address without affecting nodes running older versions of GoQuorum.

:::note

In a network where all nodes are running on GoQuorum version 2.4.0, with few nodes enabled for DNS, we recommend `--verbosity` to be 3 or below. Nodes not enabled for DNS fail to restart if `raft.addPeer` is invoked with a DNS name and `--verbosity` is set above 3.

:::
