---
title: Backup and restore
description: Backup and restore GoQuorum Nodes with private transactions, permissioning, and supported consensus algorithms
sidebar_position: 8
---

# Backup and restore GoQuorum nodes

GoQuorum supports exporting and importing chain data with built-in tooling. This is a node backup mechanism adapted for the specific needs of GoQuorum such as private transactions, permissioning, and its supported consensus algorithms.

:::note

GoQuorum chain data import and export must run after `geth` process is stopped.

:::

## Node backup (export)

Backup functionality mimics the original [`geth export`](https://geth.ethereum.org/docs/interface/command-line-options) command. GoQuorum export accepts three arguments:

- Export file name
- First block
- Last block

First and last block are optional, but both arguments must be provided if one is.

```bash
geth export <export file name> --datadir <geth data dir>
```

## Node restore (import)

Restore functionality mimics original [`geth import`](https://geth.ethereum.org/docs/interface/command-line-options) command but requires a transaction manager environment variable.

GoQuorum import must run on a new node with an initialized `--datadir` after `geth init` has been executed.

Restore supports an arbitrary number of import files (at least one).

:::caution

If private transactions are used in the chain data, the Private Transaction Manager (PTM) process for the original exported node must be running on the PTM ipc endpoint during import. Otherwise, nil pointer exceptions are raised.

:::

```bash
PRIVATE_CONFIG=<PTM ipc endpoint> geth import <import file names...> --datadir <geth data dir>
```

## Special consensus considerations

### IBFT and QBFT

IBFT and QBFT block data contain sealer information in the header. To restore a copy of exported chain data, the new node must be initialized using an IBFT/QBFT genesis file with the same validator set encoded in `extraData` field as in the original exported node's genesis file.

### Raft

Raft backups do not account for current Raft state. An exported chain data from a Raft cluster can only be used by new nodes being added to that same cluster.
