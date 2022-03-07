---
description: Clique Consensus Overview
---

# Clique

Clique is a proof of authority [consensus protocol](../../../concepts/consensus/overview.md) implemented in Go Ethereum
(Geth) and included in GoQuorum.

!!! warning

    Clique is not suitable for production environments.
    Use only in development environments.
    You can [migrate a Clique network to another consensus protocol](#migrate-from-clique-to-another-consensus-protocol).

You can refer to the following Clique documentation:

* [Clique specification](https://github.com/ethereum/EIPs/issues/225)
* [Guide to set up Clique](https://hackernoon.com/hands-on-creating-your-own-local-private-geth-node-beginner-friendly-3d45902cc612) with [puppeth](https://blog.ethereum.org/2017/04/14/geth-1-6-puppeth-master/)
* [Clique API](https://geth.ethereum.org/docs/rpc/ns-clique)

## Migrate from Clique to another consensus protocol

Migrating a network using Clique to a consensus mechanism suitable for production such as [QBFT](qbft.md) requires one of the following:

* Stopping the Clique network and starting the new network with the state at the time of migration.
  That is, historical transactions and state history are lost.

* Replaying the historical transactions on the new network.
  The historical transactions will be at different block heights, but the transactions and state history will
  be the same on the new network as on the Clique network.

If you want enterprise support to migrate a Clique network, contact [support](https://consensys.net/quorum/contact-us/).
