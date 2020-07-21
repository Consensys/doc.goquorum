---
description: Use Multiple Signers
---

# Use multiple signing keys

EthSigner supports transaction signing using [multiple stored keys](../Tutorials/Multifile.md).
Any account submitting transactions to EthSigner can use the stored keys. The keys can be stored
in:

* A [V3 keystore file](../Tutorials/Multifile.md##create-password-and-key-files)
  stored on a file system accessible by the host.
* A [Hashicorp Vault](../HowTo/Store-Keys/Use-Hashicorp.md).
* An [Azure Key Vault](../HowTo/Store-Keys/Use-Azure.md).

!!! caution

    The ability to use mulitiple signing keys should be limited to the accounts with access to the
    stored keys.

Each key requires a separate [TOML file](../Reference/Multikey-Parameters.md) that defines the
parameters to access the key. The TOML files must be placed in a single directory specified using
the [`multikey-signer --directory`](../Reference/CLI/CLI-Syntax.md#multikey-options) subcommand.

!!! tip

    Files can be added or removed from the directory without needing to restart EthSigner.

The TOML file name must use the format `[<prefix>]<accountAddress>.toml`. The prefix can be
anything you want. No two TOML files can have the same key address in the file name, even if the
prefix differs.

Remove the `0x` portion of the account address. For example,
`78e6e236592597c09d5c137c2af40aecd42d12a2.toml`.

!!! tip

    Use the
    [`export-address`](https://besu.hyperledger.org/en/latest/Reference/CLI/CLI-Subcommands/#export-address)
    Hyperledger Besu subcommand to obtain the account address of the node.
