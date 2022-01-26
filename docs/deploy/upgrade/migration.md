# Upgrade GoQuroum

The following information is for upgrading GoQuorum only.

You can have multiple versions of GoQuorum running on the same network, allowing you to perform a rolling (node-by-node)
upgrade.
Ensure your network maintains full uptime availability when upgrading to provide redundancy and reversibility if
anything goes wrong.

## Incremental upgrades

Stop the GoQuorum node you wish to upgrade, update the binary to the next version, and restart the node.
Check that the node starts without errors and has the latest block from the network.

We don't recommend jumping versions during an upgrade; some versions require manual intervention.
Check the [release log](https://github.com/ConsenSys/quorum/releases) for any actions you might need to take.

## Before you upgrade to GoQuorum v22.1.0

There are several significant changes to the underlying version of geth v1.10 in the release of GoQuorum v22.1.0. Before you upgrade to this version, consider and prepare for these changes. New geth features are detailed in https://blog.ethereum.org/2021/03/03/geth-v1-10-0/. The main things to be aware of are Flag deprecations and ChainID enforcement

### Flag deprecations

Several cli flags have been marked as deprecated throughout the v1.9.x releases of geth (first merged into GoQuorum as of v2.6.0). Support for deprecated flags will be removed in v22.1.0. Further info available at https://blog.ethereum.org/2021/03/03/geth-v1-10-0/#flag-deprecations

### ChainID enforcement

Signing transactions with a ChainID will now be enforced as the default behaviour in geth and GoQuorum for raw transactions; this impacts client libraries, tooling and applications. You can send signed raw private transactions that include a ChainID to GoQuorum today. But when you use `sendTransaction` for private transactions, GoQuorum will continue to sign it using the Homestead signer (i.e. without ChainId). Further infor available at https://blog.ethereum.org/2021/03/03/geth-v1-10-0/#chainid-enforcement

#### Changes we think you should make

We recommend that you sign transactions using the ChainID on your network. If you are using a client library, for example, `web3j-quorum`, you need to use the latest `QuorumTransactionManager` to specify a ChainID. With `web3js-quorum` you can add the chainId property to the transaction, as seen in the quorum-dev-quickstart examples.

#### if you don't want to make application changes

From v22.1.0 you will be able to start GoQuorum with the flag `--rpc.allow-unprotected-txs`. This will allow you to submit transactions that are not signed with a ChainID.


## Upgrade to GoQuorum 2.6.0

GoQuorum 2.6.0 upgrades the base Geth version from 1.8.18 to 1.9.7.
See [Ethereum 1.9.0](https://blog.ethereum.org/2019/07/10/geth-v1-9-0/) for the complete list if new features added as a
part of Geth 1.9.7.

!!! note

    Geth 1.9.7 has several enhancements at the database layer which are part of GoQuorum 2.6.0.
    Once you migrate to 2.6.0, it can't roll back to an older version of GoQuorum.
    We recommend backing up the data directory before upgrading to 2.6.0, which you can use to revert back to the older
    version if necessary.

A node running on GoQuorum 2.6.0 can coexist in a network with other nodes on lower versions of GoQuorum, so you can
perform a rolling upgrade to GoQuorum 2.6.0.
The following is the recommended upgrade process:

1. Stop the node you wish to upgrade to GoQuorum 2.6.0.
    Modify the `genesis.json` file to include `istanbulBlock` and `petersburgBlock`.
    Set these parameters to an appropriate value in future by when the entire network will be upgraded to GoQuorum 2.6.0.

    !!! warning

        Setting the milestone blocks is necessary because the gas calculation logic changes in Geth 1.9.7.
        Not setting these values properly can result in a `Bad block error`.

1. GoQuorum 2.6.0 deprecates genesis parameters `maxCodeSize` and `maxCodeSizeChangeBlock`.
    A new attribute `maxCodeSizeConfig` is added to genesis to allow tracking of multiple `maxCodeSize` value changes.

    In earlier GoQuorum versions, if the `maxCodeSize` is changed multiple times, any node joining the network might get
    a `Bad block error`.
    The changes in GoQuorum 2.6.0 enable tracking of historical changes of `maxCodeSize` in the genesis file and thus
    allow it to be changed multiple times in the network's life.
    When `init` is executed in GoQuorum 2.6.0, Geth forces use of `maxCodeSizeConfig`.

    !!! example

        ```javascript
        "config": {
            "homesteadBlock": 0,
            "byzantiumBlock": 0,
            "constantinopleBlock": 0,
            "petersburgBlock": 0,
            "istanbulBlock": 0,
            "chainId": 10,
            "eip150Block": 0,
            "eip155Block": 0,
            "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eip158Block": 0,
            "isQuorum": true,
            "maxCodeSizeConfig": [
              {
                "block": 5,
                "size": 35
              },
              {
                "block": 15,
                "size": 24
              },
              {
                "block": 20,
                "size": 35
              }
            ]
          },
        ```

1. Execute `geth --datadir path/to/datadir init genesis.json` with the modified `genesis.json`.

1. Start the node in GoQuorum 2.6.0.

!!! note "Notes"

    * Geth 1.9.7 introduces `freezerdb`, where block data beyond a certain threshold is moved to a different
      file-based storage area.
      Provide the location for `freezerdb` using the
      [`--datadir.ancient`](https://geth.ethereum.org/docs/interface/command-line-options) Geth command line option.

    * When a node is migrated to this version, Geth by default creates the `ancient` data folder and starts moving
      blocks below the immutability threshold (default: 3162240) into the ancient data.

        If you don't want this movement to happen, use
        [`--immutabilitythreshold`](../../reference/cli-syntax.md#immutabilitythreshold) to set the immutability
        threshold to an appropriate value when starting Geth.

    * Geth 1.9.7 by default doesn't allow unlocking keystore-based accounts in the startup process, and crashes if
      you attempt this.
      To enable account unlocking, use the
      [`--allow-insecure-unlock`](https://geth.ethereum.org/docs/interface/command-line-options) Geth option.

    * In a GoQuorum 2.6.0 network running with `gcmode=full` and block height exceeding the immutability threshold (with
      blocks in `freezerdb`), if a node is restarted non-gracefully (`kill -9/docker kill & start`), it can fail to sync
      up with its peers, generating a `missing parent` error.
      This is due to an upstream bug where non-graceful restart causes a gap between `leveldb` and `freezerdb`.

        You can avoid this by either running the node with `gcmode=archive` or restarting the node gracefully
        (`kill / docker stop & start`).

        This is fixed in GoQuorum v21.4.0 (from upstream Geth 1.9.20).
