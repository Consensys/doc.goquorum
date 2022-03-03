# Consensus protocols

GoQuorum implements the following Proof of Authority consensus protocols:

* [IBFT](../../configure-and-manage/configure/consensus-protocols/ibft.md)
* [QBFT](../../configure-and-manage/configure/consensus-protocols/qbft.md)
* [Raft](../../configure-and-manage/configure/consensus-protocols/raft.md)
* [Clique](../../configure-and-manage/configure/consensus-protocols/clique.md).

!!! warning

    - QBFT is currently an early access feature. It is not recommended for production networks with business critical impact.

    - Raft is not suitable for production environments. Use only in development environments. Also, you can't migrate to
      another consensus protocol from Raft.

!!! note

    You can't create a network of GoQuorum nodes using different consensus protocols.
    GoQuorum nodes configured with one consensus protocol can only work correctly with other nodes running the same protocol.
