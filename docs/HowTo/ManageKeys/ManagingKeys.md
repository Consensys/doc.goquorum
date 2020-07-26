# Managing Keys

Options for managing keys in GoQuorum include: 

* Keystore files 

    [As with geth, keys can be stored in password-protected `keystore` files.](https://geth.ethereum.org/docs/interface/managing-your-accounts)  

* [Clef](#clef)

* Accounts plugin
  
    GoQuorum v2.7.0 introduced [`account` plugins support](AccountPlugins.md), which allows GoQuorum or `clef` to be extended 
   with alternative methods of managing accounts.
   
## Clef

`clef` was introduced in Quorum `v2.6.0`.

Clef for GoQuorum is the standard `go-ethereum` `clef` tool, with additional support for GoQuorum-specific
features, including:

* Support for private transactions
* Ability to extend functionality with [`account` plugins](AccountPlugins.md) 

`clef` runs as a separate process to `geth` and provides an alternative method of managing accounts
and signing transactions/data.  Instead of `geth` loading and using accounts directly, `geth` delegates
account management responsibilities to `clef`.

Account management will be deprecated within `geth` in the future and replaced with `clef`.

Using `clef` instead of `geth` for account management has several benefits: 

* Users and DApps no longer have a dependency on access to a synchronised local node loaded with accounts.
Transactions and DApp data can instead be signed using `clef`
* Future account-related features will likely only be available in `clef` and not found in `geth`
(e.g. [EIP-191 and EIP-712 have been implemented in `clef`, but there is no intention of implementing them in `geth`](https://github.com/ethereum/go-ethereum/pull/17789/)) 
* `User-experience improvements to ease use and improve security. 



