---
title: Use a configuration file
description: Using the GoQuorum configuration file
sidebar_position: 3
---

# Using the GoQuorum configuration file

You can specify [command line options](../../reference/cli-syntax.md) in a TOML configuration file.

To do this, specify your options on the command line, and use the `dumpconfig` command to print the options into a new TOML configuration file.

<!--tabs-->

# Syntax

```bash
geth [OPTIONS] dumpconfig > <TOML-CONFIG-FILE>
```

# Example

```bash
geth --wsapi "istanbul" --rpcapi "istanbul" --istanbul.requesttimeout 5000 --allowedfutureblocktime 5 dumpconfig > config.toml
```

<!--/tabs-->

The configuration file contains your specified options and other default options.

:::tip Example configuration file

```toml
[Eth]
NetworkId = 1337
SyncMode = "fast"
NoPruning = false
NoPrefetch = false
LightPeers = 100
UltraLightFraction = 75
DatabaseCache = 768
DatabaseFreezer = ""
TrieCleanCache = 256
TrieDirtyCache = 256
TrieTimeout = 3600000000000
EnablePreimageRecording = false
EWASMInterpreter = ""
EVMInterpreter = ""

[Eth.Miner]
GasFloor = 700000000
GasCeil = 800000000
GasPrice = 1000000000
Recommit = 3000000000
Noverify = false
AllowedFutureBlockTime = 5

[Eth.Ethash]
CacheDir = "ethash"
CachesInMem = 2
CachesOnDisk = 3
DatasetDir = "/Users/alexandratran/Library/Ethash"
DatasetsInMem = 1
DatasetsOnDisk = 2
PowMode = 0

[Eth.TxPool]
Locals = []
NoLocals = false
Journal = "transactions.rlp"
Rejournal = 3600000000000
PriceLimit = 1
PriceBump = 10
AccountSlots = 16
GlobalSlots = 4096
AccountQueue = 64
GlobalQueue = 1024
Lifetime = 10800000000000
TransactionSizeLimit = 64
MaxCodeSize = 24

[Eth.GPO]
Blocks = 20
Percentile = 60

[Eth.Istanbul]
RequestTimeout = 5000
BlockPeriod = 1
Epoch = 30000
Ceil2Nby3Block = 0

[Shh]
MaxMessageSize = 1048576
MinimumAcceptedPOW = 2e-01
RestrictConnectionBetweenLightClients = true

[Node]
DataDir = "/Users/alexandratran/Library/Ethereum"
omitempty = ""
IPCPath = "geth.ipc"
HTTPPort = 8545
HTTPVirtualHosts = ["localhost"]
HTTPModules = ["istanbul"]
WSPort = 8546
WSModules = ["istanbul"]
GraphQLPort = 8547
GraphQLVirtualHosts = ["localhost"]

[Node.P2P]
MaxPeers = 50
NoDiscovery = false
BootstrapNodes = ["enode://d860a01f9722d78051619d1e2351aba3f43f943f6f00718d1b9baa4101932a1f5011f16bb2b1bb35db20d6fe28fa0bf09636d26a87d31de9ec6203eeedb1f666@18.138.108.67:30303", "enode://22a8232c3abc76a16ae9d6c3b164f98775fe226f0917b0ca871128a74a8e9630b458460865bab457221f1d448dd9791d24c4e5d88786180ac185df813a68d4de@3.209.45.79:30303", "enode://ca6de62fce278f96aea6ec5a2daadb877e51651247cb96ee310a318def462913b653963c155a0ef6c7d50048bba6e6cea881130857413d9f50a621546b590758@34.255.23.113:30303", "enode://279944d8dcd428dffaa7436f25ca0ca43ae19e7bcf94a8fb7d1641651f92d121e972ac2e8f381414b80cc8e5555811c2ec6e1a99bb009b3f53c4c69923e11bd8@35.158.244.151:30303", "enode://8499da03c47d637b20eee24eec3c356c9a2e6148d6fe25ca195c7949ab8ec2c03e3556126b0d7ed644675e78c4318b08691b7b57de10e5f0d40d05b09238fa0a@52.187.207.27:30303", "enode://103858bdb88756c71f15e9b5e09b56dc1be52f0a5021d46301dbbfb7e130029cc9d0d6f73f693bc29b665770fff7da4d34f3c6379fe12721b5d7a0bcb5ca1fc1@191.234.162.198:30303", "enode://715171f50508aba88aecd1250af392a45a330af91d7b90701c436b618c86aaa1589c9184561907bebbb56439b8f8787bc01f49a7c77276c58c1b09822d75e8e8@52.231.165.108:30303", "enode://5d6d7cd20d6da4bb83a1d28cadb5d409b64edf314c0335df658c1a54e32c7c4a7ab7823d57c39b6a757556e68ff1df17c748b698544a55cb488b52479a92b60f@104.42.217.25:30303", "enode://979b7fa28feeb35a4741660a16076f1943202cb72b6af70d327f053e248bab9ba81760f39d0701ef1d8f89cc1fbd2cacba0710a12cd5314d5e0c9021aa3637f9@5.1.83.226:30303"]
BootstrapNodesV5 = ["enode://06051a5573c81934c9554ef2898eb13b33a34b94cf36b202b69fde139ca17a85051979867720d4bdae4323d4943ddf9aeeb6643633aa656e0be843659795007a@35.177.226.168:30303", "enode://0cc5f5ffb5d9098c8b8c62325f3797f56509bff942704687b6530992ac706e2cb946b90a34f1f19548cd3c7baccbcaea354531e5983c7d1bc0dee16ce4b6440b@40.118.3.223:30304", "enode://1c7a64d76c0334b0418c004af2f67c50e36a3be60b5e4790bdac0439d21603469a85fad36f2473c9a80eb043ae60936df905fa28f1ff614c3e5dc34f15dcd2dc@40.118.3.223:30306", "enode://85c85d7143ae8bb96924f2b54f1b3e70d8c4d367af305325d30a61385a432f247d2c75c45c6b4a60335060d072d7f5b35dd1d4c45f76941f62a4f83b6e75daaf@40.118.3.223:30307"]
StaticNodes = []
TrustedNodes = []
ListenAddr = ":30303"
EnableMsgEvents = false

[Node.HTTPTimeouts]
ReadTimeout = 30000000000
WriteTimeout = 30000000000
IdleTimeout = 120000000000

[Dashboard]
Host = "localhost"
Port = 8080
Refresh = 5000000000
```

:::

You can reuse the configuration file across node startups. To specify the configuration file, use the [`--config`](https://geth.ethereum.org/docs/interface/command-line-options) option.

<!--tabs-->

# Syntax

```bash
geth --config=<TOML-CONFIG-FILE>
```

# Example

```bash
geth --config=config.toml
```

<!--/tabs-->

To override an option specified in the configuration file, specify the same option on the command line.
