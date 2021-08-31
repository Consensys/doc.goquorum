---
description: Network operational decisions
---

# Network operations

## Monitoring

Monitoring a network for security events start from log collection activity. The GoQuorum network as any other network should produce logs, that must be analyzed for anomalies.
The following parameters are of interest to be collected and analyzed:

- Hosts access and events
- Ethereum accounts on the network
- Active ledger, transaction manager nodes in the network
- Public and Private transaction rates per account in the network.
- Number of public Smart contracts in the network.
- Network connections to ledger nodes and metadata.
- Consensus protocol metadata (Block creation rate, and source, …)

## Security checklist

- [x] Ensure all activities of GoQuorum hosts are being logged to centralized log system

- [x] Centralized log system must be able to provide query capabilities over the following parameters
    - Ethereum accounts on the network
    - Active ledger, transaction manager nodes in the network
    - Public and Private transaction rates per account in the network.
    - Number of public Smart contracts in the network.
    - Network connections to ledger nodes and metadata.
    - Consensus protocol metadata (E.g Block creation rate, and source, …)

- [x] Logs must be backed-up and integrity verified.

- [x] An alerting system should be put in place in order to monitor consensus protocol anomalies
