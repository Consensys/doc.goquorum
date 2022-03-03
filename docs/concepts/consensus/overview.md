# Consensus protocols

GoQuorum implements the following Proof of Authority consensus protocols:

* [IBFT](../../configure-and-manage/configure/consensus-protocols/ibft.md)
* [QBFT](../../configure-and-manage/configure/consensus-protocols/qbft.md)
* [Raft](../../configure-and-manage/configure/consensus-protocols/raft.md)
* [Clique](../../configure-and-manage/configure/consensus-protocols/clique.md).

!!! warning

    Raft is not suitable for production environments.
    Use only in development environments.
    You can [migrate a network using Raft to another consensus protocol](../../configure-and-manage/configure/consensus-protocols/raft.md#migrate-from-raft-to-another-consensus-protocol).

!!! note

    You can't create a network of GoQuorum nodes using different consensus protocols.
    GoQuorum nodes configured with one consensus protocol can only work correctly with other nodes running the same protocol.
