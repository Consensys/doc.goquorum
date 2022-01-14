# Migrating GoQuroum

The following information is for migrating GoQuroum only.

You can have multiple versions of GoQuroum running on the same network, providing you with the opportunity to perform a rolling upgrade. We recommend you ensure your network maintains full uptime availability whilst upgrading. It provides a level of redundancy and reversibility if anything goes wrong.

## Incremental upgrades

Stop the GoQuorum node you wish to upgrade, update the binary to the next version and restart. Check the node starts without errors and has the latest block from the network. Whilst you can jump versions during an upgrade, we do not recommend it. Some versions may require manual intervention. You should check the release log for any actions you may need to take.

## Upgrade to GoQuorum 2.6.0

GoQuorum 2.6.0 upgrades the base `geth` version from 1.8.18 to 1.9.7
See [Ethereum 1.9.0](https://blog.ethereum.org/2019/07/10/geth-v1-9-0/) for the complete list if new features added as a part of `geth` 1.9.7.

!!!note
    `geth` 1.9.7 has several enhancements at the database layer which are part of GoQuorum 2.6.0.
    Hence, once you migrate to 2.6.0, it cannot rollback to older version of Quorum.
    The recommendation is to take a backup of the data directory before upgrading to 2.6.0 which can be used to revert back to older version if necessary.

A node running on GoQuorum 2.6.0 can coexist on a network where other nodes are running on lower version of GoQuorum and thus supports node by node upgrade to GoQuorum 2.6.0. The suggested upgrade process is as described below:

* Bring down the node which needs to be upgraded to GoQuorum 2.6.0. Modify the `genesis.json` file to include `istanbulBlock` and `petersburgBlock`.
    The values for this should be set to an appropriate value in future by when the entire network would have upgraded to GoQuorum 2.6.0.
    This is important as the gas calculation logic has changed in `geth` 1.9.7.
    Not setting this value properly can result in `Bad block error`

* GoQuorum 2.6.0 has deprecated genesis attributes `maxCodeSize` and `maxCodeSizeChangeBlock`.
    To allow tracking of multiple `maxCodeSize` value changes, a new attribute `maxCodeSizeConfig` is added to genesis.
    If the `maxCodeSize` was changed multiple times, it could result in `Bad block` error for any new node joining the network.
    The changes in GoQuorum 2.6.0 address this and enable tracking of historical changes of `maxCodeSize` in genesis and thus allow it to be changed multiple times in network life.
    With this change when `init` is executed in GoQuorum 2.6.0, `geth` will force usage of `maxCodeSizeConfig`.

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

* Execute `geth --datadir path/to/datadir init genesis.json` with the modified `genesis.json`
* Bring up the node in GoQuorum 2.6.0

!!! Note

    * **freezerdb** - `geth` 1.9.7 introduces the feature of freezerdb where block data beyond a certain
        threshold is moved to a different file-based storage area. The location for freezerdb can be provided
        by the `geth` command line option:

        `--datadir.ancient <value>` - Data directory for ancient chain segments (default = inside `chaindata`)

    * When a node is migrated to this version, `geth` by default will create the `ancient` data folder
        and start moving blocks below the immutability threshold (default: 3162240) into the ancient data.

        If you do not want this movement to happen, use
        [`--immutabilitythreshold`](../../reference/cli-syntax.md#immutabilitythreshold) to set the immutability
        threshold to an appropriate value when starting `geth`.

    * `geth` 1.9.7 by default does not allow keystore-based accounts to be unlocked in the startup process.
        `geth` will crash if the unlock is attempted as a part of startup.
        To enable account unlocking, use `--allow-insecure-unlock`:

        `--allow-insecure-unlock ` - Allow insecure account unlocking when account-related RPCs are exposed by http.

    * **Failure to sync up** - GoQuorum 2.6.0 can fail to sync up with `missing parent` error under the following scenario:
        In a GoQuorum network running with `gcmode=full` and block height exceeding immutability threshold (with blocks in freezerdb), if a node is restarted non-gracefully (`kill -9/docker kill & start`) then it can fail to sync up with its peers with `missing parent` error.

        This is due to an upstream bug where non-graceful restart causes  gap between leveldb and freezerdb.

        This can be avoided by either running the node with `gcmode=archive`  or restarting the node gracefully (`kill / docker stop & start`).

        This has been fixed in GoQuorum v21.4.0 (from upstream `geth` 1.9.20).
