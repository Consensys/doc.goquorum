# GoQuorum high availability

You can configure GoQuorum for end-to-end high availability (HA). This section covers the HA
configuration requirements for GoQuorum and Tessera.

![Quorum Tessera HA Mode](../../images/QT_HA_1.png)

## GoQuorum HA configuration requirements

- Two or more GoQuorum nodes serve as one client node.
- The inbound RPC requests are load balanced to one of the GoQuorum nodes.
- The GoQuorum nodes must share the same key for transaction signing, and must have shared access to
    the key store directory or key vaults.
- The GoQuorum nodes must share the same private state. They can connect to a local Tessera node,
    or a highly available Tessera node.

## Tessera HA configuration requirements

- Two or more Tessera nodes serve as the privacy manager for a GoQuorum node.
- The Tessera nodes share the same public and private key pair in password protected files or
    external vaults.
- The nodes share the same database.
- The [Quorum-to-Tessera (Q2T) server configuration] uses HTTP or HTTPS.
- Add database replication or mirroring for Tessera private data, the JDBC connection must include
    primary and disaster recovery database connections to facilitate auto switchover on failure.

*[HA]: High Availability
[Quorum-to-Tessera (Q2T) server configuration]: https://docs.tessera.consensys.net/en/stable/HowTo/Configure/TesseraAPI/
