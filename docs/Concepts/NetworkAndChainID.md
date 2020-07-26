# Network and Chain ID

An Ethereum network is run using a Network ID and a Chain ID.

The network ID is a property of a peer, not of the chain the peer is managing. Network ID is passed in
via the command line by `--networkid <id>`. It's purpose is to separate peers that are running under a
different network ID. You cannot sync with anyone who is running a node with a different network ID. 
However, since it is trivial to change this, it is a less secure version of GoQuorum's `--permissioned` flag,
and it only used for simple segregation.

The chain ID is a property of the chain managed by the node. It is used for replay protection of transactions.
Setting the chain ID has the effect of changing one of the parameters of a transaction, namely the `V` parameter.
The `v` parameter is set to `2*ChainID + 35/36`. For the Ethereum Mainnet, which has a chain ID of `1`, 
this means that all transactions have a value of either `37` or `38`.

The chain ID set in the genesis configuration file, in the `config` section, and is only used when the
block number is above the one set at `eip155Block`. See the [quorum-examples genesis files](../genesis)
for an example. It can be changed as many times as needed while the chain is below the `eip155Block` number
and re-rerunning `geth init` - this will not delete or modify any current sync process or saved blocks. 

In GoQuorum, transactions are considered private if the `v` parameter is set to `37` or `38`, which clashes
with networks which have a Chain ID of `1`. For this reason, GoQuorum will not run using chain ID `1` and will
immediately quit if started with such a configuration.
