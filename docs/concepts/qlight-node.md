# GoQuorum qlight node

## What is Qlight?

A qlight node is a lightweight replica of a full node, with transactions being proxied to the full node;
it can be deployed to reduce the amount of data that is available and that is shared by the full nodes with external parties.

The qlight node can be used for a number of use cases:

- Anything that could thrash the API (monitoring, state querying etc). Thus avoiding impact to main nodes which are processing transactions.
- Security concerns where the main node is handling multiple private parties (multi-tenant). The qlight client will deal with private state for one party only, and only that user will have access to the qlight client.

## Details of qlight node

A standard GoQuorum node will process all blocks and associated transactions; It also requires a local Private Transaction Manager to handle private data.
This can require significant resources and may make it more difficult to scale networks.
Additionally, since the node processes all transactions, privacy concerns could be raised by business partners.

Using a qlight node for process-intensive tasks can also alleviate any concerns around impact to the performance of a main node, or having to deal with network throttling due to third party network limits, or multiple clients all hitting the same main node.

Qlight nodes have specific differences from standard quorum nodes, they:

- Depend on a 'server' full node for receiving data and will only connect to the server node. There is no communication with any other node.
- Only receive blocks from the server node, processing them locally to build up the public and private state.
- Do not require a transaction manager. Instead, private data is sent directly by the server node via the qlight P2P protocol.
- Act as a proxy for locally submitted transactions, performing minimal validation. API calls like `SendTansaction`/`SendRawTransaction`/`StoreRaw` are forwarded to the server node for processing.
- Have the same RPC APIs that are required for dApps, delegating calls to the server node if needed.
- Do not partake in the consensus mechanism.

If the qlight node is halted, then on restart it will resync with any blocks that were missed whilst it was not running.

It is worth noting that the server node would normally be set up as a multi-tenant (MT) node with Multiple Private States (MPS).
However this is not essential, for example when setting up a qlight client for the purpose of offloading processing from a full node.

## Terminology

- "qlight client": This refers to the qlight node.
- "qlight server": This refers to a full node that is configured to supply data to the qlight client. It also handles API requests that are delegated from the qlight client.

## Architecture

![Qlight](../images/qlight_diagram_1.jpeg)

## Communication protocol

A peer-to-peer protocol is implemented for communication between the qlight client and server.

### Security

A number of security features are available for the qlight client-server connection:

- Native transport layer security (TLS): this can be used to encrypt communications and ensure the security of private transaction data.
- Network restriction: restricts communication to specified IP networks (CIDR masks).
- File based permissioning: allows qlight peers to be checked against a permissioned list and a disallowed list.
- Enterprise authorization protocol integration: this allows qlight clients to be authenticated using an OAuth2 server.

## Private transaction manager cache

The qlight client does not have a local Private Transaction Manager (PTM), but relies on the qlight server to supply private data.
This is implemented by means of a local cache which simulates a local PTM. Therefore private transactions can be executed locally, with the private data being fetched from the PTM cache.

## New API methods (on qlight server)

- `admin.qnodeInfo`: Returns details of the qlight configuration.
- `admin.qpeers`: Returns details of the qlight clients that are connected.
