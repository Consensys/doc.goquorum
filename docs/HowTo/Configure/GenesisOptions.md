# GoQuorum Genesis Options

## Configurable transaction size:

GoQuorum allows operators of blockchains to increase maximum transaction size of accepted transactions
via the genesis block. The GoQuorum default is currently increased to `64kb` from Ethereum's default `32kb`
transaction size. This is configurable up to `128kb` by adding `txnSizeLimit` to the config section of the genesis file:

``` json
"config": {
    "chainId": 10,
    "isQuorum":true.
    ...
    "txnSizeLimit": 128
}
```

## Contract code size:

GoQuorum allows operators of blockchains to increase maximum contract code size of accepted smart contracts
via the genesis block. The GoQuorum default is currently increased to `32kb` from Ethereum's default `24kb`
contract code size. This is configurable up to `128kb` by adding `maxCodeSize` to the config section of the genesis file:

``` json
"config": {
    "chainId": 10,
    "isQuorum":true.
    ...
    "maxCodeSize": 128
}
```
