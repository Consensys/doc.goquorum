# Contract state extension

A private contract is only available on the nodes on which it was initially deployed.
New nodes don't have access to the private contract because they don't have the code and state associated with the contract.

Contract state extension allows you to extend a private contract deployed to set of initial participant nodes to
a new node.

When extending a contract state to a node, the contract state at the time of the extension is shared, meaning the new recipient can't view the contract history.
This also means events are not shared, as the transactions are not shared and no state transitions are calculated.

!!! note

    Mandatory recipients are defined at contract creation time and can't be amended or extended.
    However, such contracts can be extended to other nodes in the network.

## With enhanced network permissioning

If the network is running with [enhanced network permissioning](../PermissionsOverview.md#enhanced-network-permissioning),
only a network or organization administrator can initiate or accept a contract extension.
