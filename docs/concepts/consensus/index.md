# Consensus protocols

GoQuorum implements the following proof of authority (PoA) consensus protocols:

* [QBFT](../../configure-and-manage/configure/consensus-protocols/qbft.md) - The recommended enterprise-grade
  consensus protocol for private networks.
* [IBFT](../../configure-and-manage/configure/consensus-protocols/ibft.md) - Supported for existing private networks,
  but you can [migrate a network using IBFT to QBFT](../../configure-and-manage/configure/consensus-protocols/qbft.md#migrate-from-ibft-to-qbft).
* [Raft](../../configure-and-manage/configure/consensus-protocols/raft.md) - Not recommended for production networks.
  You can [migrate a network using Raft to another consensus protocol](../../configure-and-manage/configure/consensus-protocols/raft.md#migrate-from-raft-to-another-consensus-protocol).
* [Clique](../../configure-and-manage/configure/consensus-protocols/clique.md) - Not recommended for production networks.
  You can [migrate a network using Clique to another consensus protocol](../../configure-and-manage/configure/consensus-protocols/clique.md#migrate-from-clique-to-another-consensus-protocol).

See a [comparison of the PoA consensus protocols](comparing-poa.md).

!!! note

    You can't create a network of GoQuorum nodes using different consensus protocols.
    GoQuorum nodes configured with one consensus protocol can only work correctly with other nodes running the same protocol.
