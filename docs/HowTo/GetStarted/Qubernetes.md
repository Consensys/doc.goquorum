
## Qubernetes (GoQuorum on Kubernetes)

[Qubernetes](https://github.com/ConsenSys/qubernetes) is project for creating, managing and interacting with a
GoQuorum network on Kubernetes.

[qctl](https://github.com/ConsenSys/qubernetes/tree/master/qctl) is the golang command line tool for Qubernetes.

```
> qctl --help
> qctl init network --num 3 --consensus ibft --cakeshop --monitor
> qctl generate network --create
> qctl deploy network --wait
> qctl geth exec quorum-node1 'eth.blockNumber'
```

## Installing

##### Binaries
The binary for various disto are available for download on each release

[**Release v0.2.0**](https://github.com/ConsenSys/qubernetes/releases/tag/v0.2.0): [mac](https://github.com/ConsenSys/qubernetes/releases/download/v0.2.0/qctl_darwin_amd64),  [linux](https://github.com/ConsenSys/qubernetes/releases/download/v0.2.0/qctl_linux_amd64)

##### Go Get
Requires golang version >  1.13
```
> GO111MODULE=on go get github.com/ConsenSys/qubernetes/qctl
```

Test that it is installed properly
```
 > qctl --help
```

## Dependencies

* Docker
!!! important
    Ensure you allow Docker up to 5G of memory.
    Refer to the _Resources_ section in [Docker for Mac](https://docs.docker.com/docker-for-mac/) and
    [Docker Desktop](https://docs.docker.com/docker-for-windows/) for details.

* Kubernetes runtime, e.g. minikube
```
> brew install minikube
> minikube start --memory 6144
```
## Running / Setting up a Network
There are two required values need to be set, either as evn vars, or flags to the commands:

1. `QUBE_CONFIG` a path to a the minimal config see [minimal config overview](http://127.0.0.1:8000/Concepts/Qubernetes/Overview/#minimal-config)
2. `QUBE_K8S_DIR` a path to a directory which will contain the GoQuorum resource and K8s resources.


```
export QUBE_CONFIG=$(pwd)/myconfig.yaml
export QUBE_K8S_DIR=$(pwd)/out
```
```
> qctl init network --num 3  --consensus ibft --cakeshop --monitor
> qctl generate network --create
> qctl deploy network --wait
> qctl geth exec quorum-node1 'eth.blockNumber'
```
with flags `--config` and `--k8sdir` instead of environment variables `QUBE_CONFIG`, `QUBE_K8S_DIR`.
```
> qctl init --config $(pwd)/myconfig.yaml network --num 3  --consensus ibft --cakeshop --monitor
> qctl generate network --create --config $(pwd)/myconfig.yaml --k8sdir $(pwd)/out
> qctl deploy network --wait --config $(pwd)/myconfig.yaml --k8sdir $(pwd)/out
> qctl geth exec quorum-node1 'eth.blockNumber'
> qctl geth attach quorum-node1
```




## Interacting

```
 > qctl ls nodes
 > qctl ls nodes --all
 > qctl ls nodes --enode --bare
 > qctl add node quorum-node5
 > qctl delete node quorum-node4
 > qctl test contract quorum-node1
 > qctl test contract quorum-node1 --private
 > qctl geth exec quorum-node1 'eth.blockNumber'
```
attach to a specific geth node
```
> qctl geth attach quorum-node1

connecting to geth /etc/quorum/qdata
Welcome to the Geth JavaScript console!

instance: Geth/v1.9.7-stable-6005360c(quorum-v2.7.0)/linux-amd64/go1.13.13
coinbase: 0x5dc833a384369714e05d1311e40a8b244be772af
at block: 19 (Tue, 06 Oct 2020 00:24:05 UTC)
 datadir: /etc/quorum/qdata/dd
 modules: admin:1.0 debug:1.0 eth:1.0 istanbul:1.0 miner:1.0 net:1.0 personal:1.0 quorumExtension:1.0 rpc:1.0 txpool:1.0 web3:1.0
>
```

