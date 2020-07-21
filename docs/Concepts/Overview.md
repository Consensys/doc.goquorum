---
description: EthSigner overview
---

# Overview

EthSigner acts as a proxy service by forwarding requests to the Ethereum client.
When EthSigner receives a transaction it generates a signature using the stored
private key, and forwards the signed transaction to the Ethereum client.

EthSigner can sign transactions with keys stored in:

* A [V3 keystore file](../Tutorials/Start-EthSigner.md#create-password-and-key-files) stored on a file
  system accessible by the host.
* [Hashicorp Vault](../HowTo/Store-Keys/Use-Hashicorp.md).
* [Azure Key Vault](../HowTo/Store-Keys/Use-Azure.md).

!!! note

    * The [`file-based-signer`](../Reference/CLI/CLI-Syntax.md#file-options), [`hashicorp-signer`](../Reference/CLI/CLI-Syntax.md#hashicorp-options), and [`azure-signer`](../Reference/CLI/CLI-Syntax.md#azure-options)
    command line options are used for a [single key only](../Tutorials/Start-EthSigner.md).
    * The [`multikey-signer`](../Reference/CLI/CLI-Syntax.md#multikey-options) command line option
    is used for [one or more keys](../Tutorials/Multifile.md).

The transaction process when using EthSigner is:

![EthSigner Transaction](../images/EthSigner_Transaction.png)
