---
description: Tessera transaction manager
---

# Transaction Manager

## Tessera

[Tessera](https://docs.tessera.consensys.net) is GoQuorum's Transaction Manager.

GoQuorum privacy features depends on Tessera to Encrypt/Decrypt, and broadcast the orchestrations of a private transaction payload.

Tessera uses an enclave to perform the encryption/decryption of private transactions payload. The encryption keys should be stored in high secure environments such a hardware security module (HSM).

Tessera communication with its dependencies (Enclave, GoQuorum node, Payload Storage Database, Secret Storage Service) must be secured.

To ensure the privacy and authentication of the communication between Tessera the network must be configured to Certificate Based Mutual Authentication (MTLS).

## Encryption Keys

Encryption keys is the most critical element of the privacy model, if the encryption key is compromised the network loses its privacy.

Tessera support integration with Trusted Platform Modules (TPM) and Hardware Security Modules (HSM) to reduce surface attack and provide highly secure environment.

## Security Checklist

- [x] Tessera should run in independent network segment in production

- [x] Tessera must leverage certificate based mutual authentication with its dependencies

- [x] Secret storage services must support key rotation.

- [x] Depending on the deployment model Encryption Keys must be backed-up in offline secured locations.

- [x] Secret storage service must be in complete isolation of external network.

- [x] Tessera connection strings must not be stored in clear text in configuration files.

- [x] Secret storage in cloud deployment should run under a single tenancy model.

- [x] Host firewall should be enabled, inbound and outbound traffic should be limited to only vault services and restricted to consumers of those services. This includes essential host services like DNS, and NTP.

- [x] Restrict remote access to Secret Storage instance to whitelisted IP addresses and enable MFA.

- [x] Disable remote root access to Tessera/Secret storage hosts.

- [x] Enable remote centralized logging for tessera and its dependencies.

- [x] Disable core dumps in tessera host.

- [x] Tessera upgrades should be using immutable strategy and frequent.

*[TPM]: Trusted Platform Modules
*[HSM]: Hardware Security Module
*[MTLS]: Certificate Based Mutual Authentication
