---
description: GoQuorum node
---

# GoQuorum node

The GoQuorum client is a thick client whose private transaction feature operation depends on a transaction manager
client that encrypts and decrypts private transaction payloads.
Both GoQuorum and its dependencies (transaction manager, peers, and enclave) use the traditional TCP/UDP transport layer
to communicate.

As any asset in a network, its security depends on multiple elements (for example, the security of the host, data, and accounts).
In GoQuorum, this depends on the security of the client and transaction manager host/host-runtime, encryption keys,
consensus runtime, and network access controls.

## Host security

Any asset in a GoQuorum network (for example, client host, transaction manager host, or private transaction storage
host) must be hardened following industry best practices.

A host IDS should be used to detect any malicious activities on the host.
Direct access to the host should not be allowed, instead a jump server should be used and access limited to small number
of administrators.

Operating systems, software, and services have vulnerabilities.
GoQuorum network hosts must implement a robust patch management program.

## Client security

GoQuorum client instance exposes a JSON-RPC interface through HTTP, WebSocket, or inter-process communication techniques.

The JSON-RPC interfaces allows remote interaction with the ledger features and smart contracts,and it must be secured to
preserve the integrity of the ledger runtime.

Each client in the network must be uniquely identified.

In GoQuorum this is done by using nodes' identities.
Node identity is represented through a public key/private key, where the public key identifies the node in the network.

GoQuorum smart contract permissioning models depend on nodes' identities to authorize TCP-level communication between
nodes, so securing the private key of a node is required to prevent unauthorized nodes from joining the network.

## User security

Blockchain technology uses public key cryptography to protect the integrity of transactions and blocks.

In Ethereu, accounts' private keys are encrypted with user-specified seeds (passwords).

Users' passwords should never be saved across the ecosystem or stored in a ledger host in any form.

## Security checklist

### Host

- Harden GoQuorum host operating system (for example, remove irrelevant services).

- Disable direct remote network access to GoQuorum host management interface in production.

- Use host-based intrusion detection system (HIDS) to monitor GoQuorum node host.

- Enable host-based firewall rules that enforce network access to JSON-RPC interface to only pre-identified, trusted,
  and required systems.

- Implement a robust patch management program, and always keep the host updated to the latest stable version.

- Ensure host-level isolation of responsibility between the GoQuorum client and its dependencies (for example, don't run
  the transaction manager and its database in the same host).

- Ensure GoQuorum network hosts run with appropriate service level agreements (SLA) that can ensure a defense against
  non-vulnerability-based denial of service.

### Client

- Enable TLS to encrypt all communications to and from the JSON-RPC interface to prevent data leakage and
  man-in-the-middle (MITM) attacks.

- Enable GoQuorum enterprise JSON-RPC authorization model to enforce atomic access controls to ledger modules
  functionalities (for example, `personal.OpenWallet`).

- Implement a robust patch management program, and always keep the client updated to latest stable version.

- Ensure GoQuorum client run configuration is not started with unlocked accounts options.

- Ensure cross domain access of the JSON-RPC interface is configured appropriately.

- Ensure peer discovery is appropriately set based on the consortium requirements.

- In Raft consensus, there's no guarantee a leader isn't acting maliciously, so Raft shouldn't be used in an environment
  where the network ledger is managed by third-party authorities.

- GoQuorum clients must run with metrics collection capability in order to preserve operational security.

### Users

- [x] Accounts Private Key encryption password should never be stored in the ledger host in any form.

- [x] In an architecture where accounts private keys are not offloaded to ledger node clients, the encrypted private keys should be backed-up to secure environment regularly.
