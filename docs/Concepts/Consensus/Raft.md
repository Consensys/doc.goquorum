---
description: Raft Consensus Overview
---

# Raft consensus protocol

Raft consensus has faster blocktimes, transaction finality, and on-demand block creation.

GoQuorum implements [Raft](https://raft.github.io) consensus using the [etcd](https://github.com/coreos/etcd)
[implementation](https://github.com/coreos/etcd/tree/master/raft).

Use Raft for closed-membership/consortium settings where:
 
* Byzantine fault tolerance is not required.
* Faster block times (that is, milliseconds rather than seconds) and transaction finality are required.

Raft consensus does not create unnecessary empty blocks, and effectively creates blocks on-demand.

!!! note
    GoQuorum implements the [etcd implementation of the Raft protocol](https://github.com/coreos/etcd).
    In the GoQuorum documentation, the term Raft is used to refer to the Raft protocol, and using
    Raft to achieve consensus in GoQuorum networks.

## Raft nodes

The concept of Raft nodes and Ethereum nodes are distinct.
 
A Raft node can be a:
 
* Leader
* Follower (also called verifier or peer)
* Learner.
 
A cluster has one leader and all log entries flow through the leader.

Additional follower nodes or learner nodes can be added to a running network.

!!! note "Leader election"

    By design, the implementation details of Raft leader elections are opaque to applications built
    on networks using Raft.

    A candidate exists only during leader election.
    A Raft network is started with a set of verifiers and one verifier is elected as a leader when the
    network starts. If the leader node fails, a re-election is triggered and new leader elected by the network.

### Leader

A leader node:

* Mints and sends blocks to the follower and learner nodes.
* Participates in voting during re-election and becomes a follower if it does not win majority of votes.
* Can add and remove learner and follower nodes.
* Can promote learner nodes to follower.

If the leader node fails, re-election is triggered.

### Follower

A follower node:

* Follows the leader.
* Applies the blocks minted by the leader.
* Participates in voting during re-election and becomes a leader if it wins majority of votes.
* Sends acknowledgements to the leader.
* Can add and remove learner and follower nodes.
* Can promote learner nodes to follower.

### Learner

A learner node:

* Follows the leader.
* Applies the blocks minted by the leader.
* Cannot take part in voting during re-election.
* Must be promoted to be a follower by a leader or follower.
* Cannot add learner and follower nodes or promote learner nodes to follower.
* Cannot remove other learner and follower nodes.
* Can remove itself.

## Raft quorum

Adding or removing a follower, changes the Raft quorum. Adding or removing a learner does not
change the Raft quorum.

When a node is added to a long running network, we recommend the node is added
as a learner. The learner node can be promoted once the node is fully synchronized with
the network.

## Raft and Ethereum nodes

In Ethereum networks using Proof of Work consensus, any node in the network can mine a new block. That is,
there are not leader, follower, or learner nodes.

In Raft, there is a one-to-one correspondence between Raft and Ethereum nodes. Each Ethereum node is
also a Raft node. The leader of the Raft cluster is the only Ethereum node that mints new blocks.
A minter is responsible for including transactions in a block like an Ethereum miner, but does not
present a proof of work.

Ethereum | Raft
-------- | ----
minter   | leader
verifier | follower

A learner node is passive node that synchronizes blocks and submits transactions.

Reasons for co-locating the leader and minter include:

* Convenience. Raft ensures there is only one leader at a time.
* To avoid a network hop from a node minting blocks to the leader through which all Raft writes must flow.

The GoQuorum implementation watches Raft leadership changes. If a node
becomes a leader, it starts minting. If a node loses leadership, it stops minting.

## Raft communication

Raft uses the Ethereum P2P transport layer to propagate transactions between nodes. Blocks are
communicated only through the Raft transport layer. Blocks are created by the minter and flow from
the minter to the rest of the cluster, always in the same order, via Raft.

When a minter creates a block, the block is not inserted and set as the new
head of the chain until the block has flown through Raft. All nodes extend the chain together in
lock-step when they apply the Raft log.

## Raft configuration

* [How to configure Raft](../../HowTo/Configure/Consensus/Configuring-Raft.md)
* [Create a Raft network from scratch](../../Tutorials/Create-a-Raft-network.md)

## FAQ

Answers to frequently asked questions can be found on the main [GoQuorum FAQ page](../../Reference/FAQ.md).
