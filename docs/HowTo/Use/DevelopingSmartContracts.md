# Developing Smart Contracts

GoQuorum uses standard [Solidity](https://solidity.readthedocs.io/en/develop/) for writing Smart Contracts,
and generally, these can be designed as you would design Smart Contracts for Ethereum. Smart Contracts can
either be public (i.e. visible and executable by all participants on a given GoQuorum network) or private to
one or more network participants. Note that GoQuorum does not introduce new contract types.

## Creating public transactions/contracts

Sending a standard Ethereum-style transaction to a given network will make it viewable and executable by
all participants on the network. As with Ethereum, leave the `to` field empty for a contract-creation transaction.

Example JSON RPC API call to send a public transaction:

``` json
{
    "jsonrpc":"2.0",
    "method":"eth_sendTransaction",
    "params":[
        {
            "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
            "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
            "gas": "0x76c0", // 30400
            "gasPrice": "0x9184e72a000", // 10000000000000
            "value": "0x9184e72a", // 2441406250
            "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
        }
    ],
    "id":1
}
```

See the [GoQuorum API](../../Reference/APIs/PrivacyAPI.md) page for details on the `sendTransaction` call, which includes some modifications to the standard Ethereum call.

!!! info
    See the Contract Design Considerations sections below for important points on creating GoQuorum contracts.

## Creating private transactions/contracts

To make a transaction/smart contract private and therefore only viewable and executable by a
subset of the network, send a standard Ethereum Transaction but include the GoQuorum-specific `privateFor`
parameter.  `privateFor` is used to provide the list of participants for the transaction/contract.
Each participant is identified by a Privacy Manager public key.

Example JSON RPC API call to send a private transaction:

``` json
{
    "jsonrpc":"2.0",
    "method":"eth_sendTransaction",
    "params":[
        {
            "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
            "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
            "gas": "0x76c0", // 30400
            "gasPrice": "0x9184e72a000", // 10000000000000
            "value": "0x9184e72a", // 2441406250
            "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
            "privateFor": ["$PUBKEY1, $PUBKEY2"]
        }
    ],
    "id":1
}
```

See the [GoQuorum API](../../Reference/APIs/PrivacyAPI.md) page for details on the `sendTransaction` call, which includes some modifications to the standard Ethereum call.

!!! info
    See the Contract Design Considerations sections below for important points on creating GoQuorum contracts.

## GoQuorum contract design considerations

1. *Private contracts cannot update public contracts.* This is because not all participants will be able to execute a private contract, and so if that contract can update a public contract, then each participant will end up with a different state for the public contract.
1. *Once a contract has been made public, it can't later be made private.* If you do need to make a public contract private, it would need to be deleted from the blockchain and a new private contract created.
