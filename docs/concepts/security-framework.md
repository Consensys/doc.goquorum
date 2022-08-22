---
description: Security framework overview
---

# Security framework

This topic describes high-level security best practices for:

- Managing a GoQuorum [consortium](#consortium).
- Securing the components of a [GoQuorum node](#goquorum-node).
- [Monitoring](#monitoring) a GoQuorum network.
- Using the Tessera [transaction manager](#transaction-manager).

You can view a [list of additional network and dapp security resources](#resources).

## Consortium

A consortium network connects multiple independent networks.
Consortiums come with risks such as accidental data exposure and potential liabilities that must be managed.
They require governance structures that fulfill the concerns of participants equally.

!!! note

    In a consortium network, every member does not need to be a validator. Each non-validating
    member will still have a full copy of the chain data and has full ability to transact (private or public)
    on the network. To prevent the network halting, all validators have additional responsibility to ensure
    that their node does not go down and is available per SLAs of the consortium agreements.

### Security checklist

- Use a [Byzantine fault tolerant consensus protocol](consensus/index.md) in case nodes are managed by non-trusted participants.
- Ensure consortium members provide a reasonable network service-level agreement (SLA).
- Ensure private and public payload data is stored in an appropriate geographical legislation area.
- Document:
    - The organizational and technological requirements to join the consortium.
    - The consortium governance structure.
    - Ownership of intellectual property and assets.
    - Liability.
    - Memberships.
    - Activities.
- Ensure consortium members are known to every participant in the network.
- Ensure private and public payload data is compliant with privacy policies.

## GoQuorum node

The GoQuorum client is an Ethereum client that uses a transaction manager to encrypt and decrypt private transaction payloads.
GoQuorum and its dependencies use the TCP/UDP transport layer to communicate.

GoQuorum's security depends on the security of the client host, transaction manager host, encryption keys, consensus
runtime, and network access controls.

### Host security checklist

- Harden the GoQuorum host operating system following industry best practices (for example, remove irrelevant services
  and root access).
- Disable direct remote network access to the GoQuorum host management interface in production.
- Use a host-based intrusion detection system (HIDS) to monitor the GoQuorum node host.
- Enable host-based firewall rules that limit network access to the JSON-RPC interface to only pre-identified, trusted,
  and required systems.
- Implement a robust patch management program, and always keep the host updated to the latest stable version.
- Ensure host-level isolation of responsibility between the GoQuorum client and its dependencies (for example, don't run
  the transaction manager and its database in the same host).
- Run GoQuorum network hosts with service level agreements (SLAs) that defend against non-vulnerability-based denial of service.

### Client security checklist

- Encrypt all communications to and from the JSON-RPC interface using TLS to prevent data leakage and
  man-in-the-middle (MITM) attacks.
- Enable an enterprise JSON-RPC authorization model to enforce atomic access controls to ledger module
  functionalities (for example, `personal.OpenWallet`).
- Implement a robust patch management program, and always keep the client updated to latest stable version.
- Don't start the GoQuorum client run configuration with unlocked accounts.
- Configure cross-domain access to the JSON-RPC interface appropriately.
- Set peer discovery based on the consortium requirements.
- In Raft consensus, there's no guarantee a leader isn't acting maliciously, so don't use Raft in an environment where
  the network ledger is managed by third-party authorities.
- Run GoQuorum with metrics collection enabled to preserve operational security.

### User security checklist

- Ensure accounts' private-key-encrypted passwords are never stored in the ledger host in any form.
- In an architecture where accounts' private keys are not offloaded to ledger node clients, regularly back up the
  encrypted private keys.

## Monitoring

The GoQuorum network produces logs that should be monitored for security anomalies.

### Security checklist

- Log all activities of GoQuorum hosts to a centralized log system.
- Ensure the centralized log system can answer queries about:
    - Ethereum accounts on the network.
    - Active ledger and transaction manager nodes in the network.
    - Public and private transaction rates per account in the network.
    - Number of public smart contracts in the network.
    - Network connections to ledger nodes and metadata.
    - Consensus protocol metadata (for example, block creation rate and source).
- Back up and verify logs.
- Implement an alerting system to monitor consensus protocol anomalies.

## Transaction manager

Tessera is GoQuorum's transaction manager.
GoQuorum privacy features depend on Tessera to encrypt, decrypt, and broadcast the orchestrations of private
transaction payloads.

Tessera encryption keys are the most critical element of the privacy model; if they're compromised, the network loses
its privacy.

Tessera supports integration with trusted platform modules (TPMs) and hardware security modules (HSM) to reduce surface
attacks and provide a secure environment.

### Security checklist

- Run Tessera in an independent network segment in production.
- Use certificate-based mutual authentication (mTLS) with Tessera's dependencies.
- Store encryption keys in secure environments such an HSM.
- Ensure the secret storage services support key rotation.
- Depending on the deployment model, back up encryption keys in offline secured locations.
- Ensure the secret storage service is in complete isolation of the external network.
- Don't store Tessera connection strings in plaintext in configuration files.
- When deploying secret storage in the cloud, use a single tenancy model.
- Enable host firewall rules to limit inbound and outbound traffic to only consumers of vault services.
  This includes essential host services like DNS and NTP.
- Limit remote access to the secret storage instance to only allowlisted IP addresses, and enable MFA.
- Disable remote root access to Tessera/secret storage hosts.
- Enable remote centralized logging for Tessera and its dependencies.
- Disable core dumps in Tessera hosts.
- Upgrade Tessera frequently, and use an immutable strategy when upgrading.

## Resources

The following are additional resources for blockchain network and dapp security best practices.

- Decentralized Application Security Project
- [Solidity documentation](https://docs.soliditylang.org/en/v0.8.10/)
- [Smart Contract Federated Identity Management without Third Party Authentication Services](https://ws680.nist.gov/publication/get_pdf.cfm?pub_id=925957)
- [Advancing Blockchain Cybersecurity: Technical and Policy Considerations for the Financial Services Industry](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE1TH5G)
- [Framework for Improving Critical Infrastructure Cybersecurity](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.04162018.pdf)
- [Recommendation for Key Management: Part 2 - Best Practices for Key Management Organizations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt2r1.pdf)
