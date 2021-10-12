# Contract state extension

Once a private contract is deployed, it is only available on the nodes on which it is initially deployed.
This means any new node doesn't have access to the private contract, because the new node doesn't have the code nor any
of the state associated with the contract.

In real life scenarios, a private contract deployed to set of initial participant nodes may need to be extended to a new
node which becomes part of the business flow.
Contract state extension addresses this requirement.

In contract state extension, only the state of the contract as of the time of extension is shared.
This means the new recipient can't view any history of the contract.
This also means events are not shared, as the transactions are not shared and no state transitions are calculated.

!!! note

    Mandatory recipients are defined at contract creation time and cannnot be amended/extended.
    However, such contracts can be extended to other nodes in the network.

## With enhanced network permissioning

If the network is running with [enhanced network permissioning](../PermissionsOverview.md#enhanced-network-permissioning),
only a network or organization administrator can initiate or accept contract extension.
