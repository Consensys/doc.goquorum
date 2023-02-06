---
title: Contract state extension
description: Extending a private contract
sidebar_position: 5
---

# Contract state extension

A private contract is only available on the nodes on which it was initially deployed. New nodes don't have access to the private contract because they don't have the code and state associated with the contract.

Contract state extension allows you to extend a private contract deployed to set of initial participant nodes to a new node.

When extending a contract state to a node, the contract state at the time of the extension is shared, meaning the new recipient can't view the contract history. This also means events are not shared, as the transactions are not shared and no state transitions are calculated.

:::note

[Mandatory recipients](privacy-enhancements.md#mandatory-party-protection) are defined at contract creation time and can't be updated. However, contracts containing mandatory recipients can be extended to other nodes in the network.

:::

## Enhanced network permissioning

If the network is running with [enhanced network permissioning](../permissions-overview.md#enhanced-network-permissioning), only a network or organization administrator can initiate or accept a contract extension.

## Flow

The following diagram describes the flow of contract state extension. ![contract state extension diagram](../../images/ContractStateExtension.png)

In this example, Node A extends an existing private contract to Nodes C that was initially deployed only between Nodes A and B.

1. User in node A proposes the extension of the contract, citing node C's Private Transaction Manager(PTM) public keys as private participants of this extension, node C's public Ethereum key as a receiving address of this extension, and node C's PTM public key as the target receiver.

   - **1a** - Node A identifies all participants for the contract being extended and creates the extension contract with user given inputs and PTM public keys of all participants.
   - **1b** - the private transaction payload is shared with PTMs of participants.
   - **1c** - The public state is propagated across all nodes. All participant nodes see an emitted log, and start watching the contract address that emitted the event for subsequent events that may happen. This contract address is the management contract for the extension process. A new management contract is created with each extension.

2. Node A automatically approves the contract extension by virtue of creating the extension contract. In the approval process:

   - **2a** - Node A calls its local Tessera node to encrypt the management contract address.
   - **2b** - Node A sends a private transaction to all participants with the encrypted payload from the previous step to generate a random hash for the approval process.
   - **2c** - The private transaction is propagated to the Tessera nodes of all participants.
   - **2d** - Node A approves the extension with the hash generated (in step 2b).
   - **2e & 2f** - Private transaction payload is shared with the Tessera nodes of all participants. Public state is propagated across all nodes.

3. Since the state sharing does not execute the transactions that generate the state (in order to keep history private), there is no proof that can be provided by the proposer that the state is correct. In order to remedy this, the receiver must accept the proposal for the contract as the proof. In this step, the user of node C, as the receiving address, approves the contract extension using GoQuorum APIs.

   - **3a** - Node C calls its local Tessera node to encrypt the management contract address.
   - **3b** - Node C sends a private transaction to all participants with the encrypted payload from the previous step to generate a random hash for the approval process.
   - **3c** - The private transaction is propagated to the Tessera nodes of all participants.
   - **3d** - Node C approves the extension with the hash generated in step 3b.
   - **3e & 3f** - Private transaction payload is shared with the Tessera nodes of all participants. Public state is propagated across all nodes.

4. Node A monitors for acceptance of contract extension by Node C.

   - **4a & 4b** - Node A fetches the state of the contract and sends it as a "private transaction" to Node C. It then submits the PTM hash of that state to the contract, including the recipient's PTM public key.
   - **4c** - Node A submits a transactions to mark completion of state share. This transaction emits a log that is picked up by the receiver when processing the transaction.
   - **4d & 4e** - Private transaction payload is shared with Tessera nodes C. Public state is propagated across all nodes.

5. Node A & B monitors for state share event.

   - **5a** - Upon noticing the state share event as a part of block processing, node A & B update the privacy metadata for the contract being extended. _This step is executed only for party protection or private state validation type of contracts._

6. Node C monitors for state share event.

   - **6a** - Upon noticing the state share event as a part of block processing, node C fetches the contract private state data from its local Tessera node.
   - **6b** - Node C applies the fetched state to the contract address and becomes party of the private contract.

:::note

Steps (2a, 2b, 2c) and (3a, 3b. 3c) are required to handle data recovery of transaction manager data.

In original extension design, the node accepting the extension does so by voting with a hash which is generated by sending a private transaction with management contract address as the payload to self.

This hash is further verified at the time of extension to validate the rightful node for extension.

In the event if the node loses its transaction manager and has to recover transactions using resend from other nodes in the network, this self voting transaction is never recoverable.

Subsequently if that node ever recovers the chain then it is never able to process the past contract extension transactions and set state for the private contract.

:::
