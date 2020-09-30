# Consensus Mechanisms

With no need for Proof of Work (PoW) in a permissioned network, GoQuorum instead implements multiple
consensus mechanisms that are more appropriate for consortium chains:

* Raft-based

     A consensus model for faster blocktimes, transaction finality, and on-demand block creation.
  See [Raft-based documentation](Raft.md) for more information

* Istanbul BFT (Byzantine Fault Tolerance)

     A PBFT-inspired consensus algorithm with immediate transaction finality, by AMIS.
    See [IBFT documentation](IBFT.md), the [RPC API](../../Reference/Consensus/IBFT-RPC-API.md),
    and this [technical web article](https://medium.com/getamis/istanbul-bft-ibft-c2758b7fe6ff).

* Clique Proof of Authority (PoA)

      A default POA consensus algorithm bundled with Go Ethereum. See [Clique POA Consensus Documentation](https://github.com/ethereum/EIPs/issues/225) and a [guide to setup clique json](https://hackernoon.com/hands-on-creating-your-own-local-private-geth-node-beginner-friendly-3d45902cc612) with [puppeth](https://blog.ethereum.org/2017/04/14/geth-1-6-puppeth-master/)
