# DNS for GoQuorum

DNS support in GoQuorum has two distinct areas, usage in the static nodes file and usage in the
node discovery protocol. You are free to use one and not the other, or to mix them as the use case
requires.

## Static nodes

Static nodes are nodes we keep reference to even if the node is not alive, so that is the nodes comes alive,
then we can connect to it. Hostnames are permitted here, and are resolved once at startup. If a static peer goes offline
and its IP address changes, then it is expected that this peer would re-establish the connection in a fully static
network, or have discovery enabled.

## Discovery

DNS is not supported for the discovery protocol. Use a bootnode instead, which can use a DNS name that is repeatedly
resolved.

## Compatibility

For Raft, the whole network must be on GoQuorum version 2.4.0 or later for DNS to function properly.
DNS must be explicitly enabled using the [`--raftdnsenable`](../../Reference/CLI-Syntax.md#raftdnsenable) option for each
node once the node has migrated to version 2.4.0 or later.
The network runs fine when some nodes are in version 2.4.0 or later and some in older versions as long as this feature is not enabled.
For safe migration the following approach is recommended:

* migrate the nodes to GoQuorum version 2.4.0 or later without using `--raftdnsenable` option
* once the network is fully migrated, restart the nodes with `--raftdnsenable` to enable the feature

Please note that in a partially migrated network (where some nodes are on version 2.4.0 or later and others on lower versions)
**with DNS feature enabled** for migrated nodes, `raft.addPeer` should not be invoked with Hostname until the entire
network migrates to version 2.4.0 or later.
If invoked, this call will crash all nodes running in older versions and these nodes will have to be restarted with
GoQuorum version 2.4.0 or later.
`raft.addPeer` can still be invoked with IP address without affecting nodes running older versions of GoQuorum.

### Note

In a network where all nodes are running on GoQuorum version 2.4.0, with few nodes enabled for DNS, we recommend the
 `--verbosity` to be 3 or below. We have observed that nodes which are not enabled for DNS fail to restart if
 `raft.addPeer` is invoked with host name if `--verbosity` is set above 3.
