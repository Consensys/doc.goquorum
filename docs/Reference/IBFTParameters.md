# IBFT Parameters

## Command line options

You can set the block period with the [`--istanbul.blockperiod`](CLI-Syntax.md#istanbulblockperiod) option and
the request timeout with the [`--istanbul.requesttimeout`](CLI-Syntax.md#istanbulrequesttimeout) option.

## Genesis file options

Within the `genesis.json` file, there is an area for IBFT specific configuration, much like a Clique network
configuration.

The options are as displayed in the following configuration fragment:

```json
{
    "config": {
        "istanbul": {
            "epoch": 30000,
            "policy": 0,
            "ceil2Nby3Block": 0
        },
        ...
    },
    ...
}
```

### Epoch

The epoch specifies the number of blocks that should pass before pending validator votes are reset. When the
`blocknumber%EPOCH == 0`, the votes are reset in order to prevent a single vote from becoming stale. If the existing
vote was still due to take place, then it must be resubmitted, along with all its votes.

### Policy

The policy refers to the proposer selection policy, which is either `ROUND_ROBIN` or `STICKY`.

A value of `0` denotes a `ROUND_ROBIN` policy, where the next expected proposer is the next in queue. Once a proposer
has submitted a valid block, they join the back of the queue and must wait their turn again.

A value of `1` denotes a `STICKY` proposer policy, where a single proposer is selected to mint blocks and does so until
such a time as they go offline or are otherwise unreachable.

### ceil2Nby3Block

The `ceil2Nby3Block` sets the block number from which to use an updated formula for calculating the number of faulty
nodes. This was introduced to enable existing network the ability to upgrade at a point in the future of the network, as
it is incompatible with the existing formula. For new networks, it is recommended to set this value to `0` to use the
updated formula immediately.

To update this value, the same process can be followed as other hard-forks.
