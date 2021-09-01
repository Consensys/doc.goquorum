---
description: Smart contracts security tips and checklist
---

# Smart contracts security

Smart contracts security must be considered as any other application security. It might contain logical vulnerabilities, insecure design, and it might run on vulnerable components (ledgers). However, Smart Contracts are the core element of Ethereum Blockchain. Unlike other software it is constrained by several Blockchain technology primitives:

- Smart contracts runtime is sandboxed; this means obtaining a secure randomness source is hard.
- Smart contracts can hold, transfer or destroy funds, making them an economic risk component.
- Smart contracts are not upgradeable unless an upgrade mechanism is introduced in the design phase.
- Smart contracts are immutable and have an irrevocable self-destruction feature.
- Smart contracts can have one or multiple owners.

## Ownership

Unlike traditional software management process, Smart Contracts support the following technologically enforced ownership model:

### Single ownership

The contract has one owner who is responsible for the contract administration process.

### Shared custody ownership

Suitable for agreement between two or more parties in a network of N parties;
where any party can unilaterally perform administrative action over the contract.

### Consortium based ownership

It is a form of expanded shared custody ownership that requires consensus over the administrative actions.

## Security patterns

### Checks-Effects-Interaction pattern

Interacting with other contracts should always be the last step in the contract function.

It is crucial that the current contract has finished its functionality before handing control to another contract and does not depend on the execution of the other contract.

### Circuit breaker

It is a logical emergency stop execution logic. Implementing emergency stops in the logic of smart contract is a good security practice.

A Circuit breaker can be triggered manually by trusted parties included in the contract like the contract owner or by using programmatic consensus rules that automatically trigger the circuit breaker when the defined conditions meet.

### Rate limit

Smart contract operation within an interval allows better control of abusable resources.

### Speed bumps

Speed bumps introduce a delay in the action execution allowing time to act if action is considered malicious.

## Common contract vulnerabilities

### Reentrancy

Reentrancy occurs when external contract calls are allowed to make new calls to the calling contract before the initial execution is complete. For a function, this means that the contract state may change in the middle of its execution as a result of a call to an untrusted contract, or the use of a low-level function with an external address.

### Access control

While insecure visibility settings give attackers straightforward ways to access a contract's private values or logic, access control bypasses are sometimes more subtle. These vulnerabilities can occur when contracts use the deprecated `tx.origin` to validate callers, handle extensive authorization logic with lengthy "require" and make reckless use of `delegatecall` in proxy libraries or proxy contracts.

### Arithmetic

Integer overflows and underflows are not a new class of vulnerability, but they are especially dangerous in smart contracts, where unsigned integers are prevalent, and most developers are used to simple int types (which are often just signed integers). If overflows occur, many seemingly benign code paths become vectors for theft or denial of service.

### Unchecked low level calls

One of the more in-depth features of Solidity are the low-level functions such as `call()`, `callcode()`, `delegatecall()` and `send()`. Their error handling behaviour is quite different from other Solidity functions. The errors will not surface immediately and will not lead to the total reversal of the current execution. Instead, they will return a boolean value set to false, and the code will continue to run. This scenario could surprise developers. If the return value of such low-level calls is not checked, it could lead to "fail open" situations and other unwanted outcomes.

### Bad randomness

Randomness is hard to get right in Ethereum. While Solidity offers functions and variables that can access seemingly hard-to-predict values, they are generally either more public than they seem. Because randomness sources are predictable to an extent in Ethereum, malicious users can usually replicate them and attack the function relying on the unpredictability. This also applies to dApps built on top of Quorum.

### Front running

In public Ethereum, miners always get rewarded via gas fees for running code on behalf of externally owned addresses (EOA). Users can specify higher fees to have their transactions mined quicker. Since the Ethereum blockchain is public, everyone can see the contents of other user's pending transactions. This situation means that if a given user is revealing the solution to a puzzle or other valuable secret, a malicious user can steal the solution and copy their transaction with higher fees to preempt the original solution. If smart contract developers are not careful, this situation can lead to practical and devastating front-running attacks. On the other hand, since Quorum does not use Proof Of Work (PoW) as consensus algorithm and the gas cost is zero, vulnerabilities related to PoW mining are not applicable when building on top of Quorum. However, front-running remains a risk and will depend on the consensus algorithm in use.

### Time manipulation

From locking a token sale to unlocking funds at a specific time, contracts sometimes need to rely on the current time. This is usually done via "block.timestamp "or it's alias "now" in Solidity. In public Ethereum, this value comes from the miners. However, in Quorum, it comes from the minter or validators. As a result, smart contracts should avoid relying strongly on the block time for critical decision making. Note that block.timestamp should not be used for the generation of random numbers.

### Short addresses

Short address attacks are a side effect of the EVM accepting incorrectly padded arguments. Attackers can exploit this by using specially crafted addresses to make poorly coded clients encode arguments incorrectly before including them in transactions.

## Security checklist

### Ownership

- [X] Smart contracts having no ownership must be prevented in Enterprise Blockchains.

- [X] Contracts must include initialization phase where all owners are identified clearly and set init(owners_list).

- [X] Identify contract ownership model before starting the design of the smart contract logic.

- [X] Define the consensus model for Consortium Based Ownership.

- [X] Contract upgradability and ownership functionalities must verify new addresses are valid.

- [X] Ownership related events must be broadcasted to all the network participants.

- [X] In a Consortium based ownership structure, changing activities that are bound to approval from consortium members before they are committed (for example, editing Consortium structure) must have approval pending expiration date.

- [X] Consortium based voting must involve real-time notification through EVM event emission.

### Contract implementation

- [X] Contract should use a locked compiler version.

- [X] The compiler version should be consistent across all contracts.

- [X] Contract should not shadow or overwrite built-in functions.

- [X] Contract should never use tx.origin as an authorization mechanism.

- [X] Contract should never use the timestamp as a source of randomness.

- [X] Contract should never use block number or hash as a source for randomness.

- [X] Contract should never use block number or timestamp as critical decision-making conditions.

- [X] Contract should never misuse multiple inheritance.

- [X] Modifiers must preserve the contract state or performing an external call.

- [X] Contract should never contain cross-function race conditions.

- [X] Contract should never use plain arithmetic computation; instead, safe math should be used.

- [X] Contract fallback functions should be free of unknown states that might introduce security implications.

- [X] Contract should avoid shadowed variables.

- [X] Contract public variables/functions should be reviewed to ensure visibility is appropriate.

- [X] Contract private variables should not contain sensitive data.

- [X] Contract functions should explicitly declare visibility.

- [X] Contract public functions should perform proper authorization checks.

- [X] Contract should validate the input of all public and external functions.

- [X] Contract using old solidity version constructor name must match contract name.

- [X] Contract should explicitly mark untrusted contracts as 'untrusted'.

- [X] Contract functions logic should perform state-changing actions before making external calls.

- [X] Contract logic should use send() and transfer() over call.value when possible.

- [X] Contract usage of delegatecall should be properly handled.

- [X] Contract logic must correctly handle return value of any external call.

- [X] Contract must never assume it has been created with a balance of 0.

- [X] Contract logic should not contain loops that are vulnerable to denial of service attacks.

- [X] Multiparty contract logic action should not be dependent on a single party.

- [X] Prevent token transfers to `0x0` address.
