---
description: Use a Single Signer
---

# Use a single signing key

The key used to [sign transactions](Transactions/Make-Transactions.md) can be stored externally
using [Hashicorp Vault](Store-Keys/Use-Hashicorp.md) or [Azure Key Vault](Store-Keys/Use-Azure.md), or
in a [V3 keystore file](../Tutorials/Start-EthSigner.md#create-password-and-key-files).

To [start EthSigner with a single signing key](../Tutorials/Start-EthSigner.md), use the subcommands:

* [`file-based-signer`](../Reference/CLI/CLI-Syntax.md#file-options)
* [`hashicorp-signer`](../Reference/CLI/CLI-Syntax.md#hashicorp-options)
* [`azure-signer`](../Reference/CLI/CLI-Syntax.md#azure-options)
