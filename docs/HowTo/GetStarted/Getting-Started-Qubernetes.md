---
description: Getting started with Qubernetes (GoQuorum on Kubernetes)
---

# Getting started with Qubernetes

[Qubernetes](../../Concepts/Qubernetes/Qubernetes-Overview.md) is a project for generating GoQuorum network resources,
Kubernetes GoQuorum resources, and managing and interacting with a GoQuorum Kubernetes deployment.

[qctl](../../Concepts/Qubernetes/Qubernetes-Overview.md#qctl-command-line-tool) is a Golang command line tool for 
creating and manipulating the minimal configuration, and interacting with a running Kubernetes network.

## Installing binaries 

[Obtain the binaries from the repository.](https://github.com/ConsenSys/qubernetes/releases) 

## Go get

Requires golang version >  1.13. 

```
> GO111MODULE=on go get github.com/ConsenSys/qubernetes/qctl
```

Test that `qctl` is installed properly. 

```
 > qctl --help
```

## Dependencies

* Docker

!!! important
    Ensure you allow Docker up to 5G of memory.
    Refer to the _Resources_ section in [Docker for Mac](https://docs.docker.com/docker-for-mac/) and
    [Docker Desktop](https://docs.docker.com/docker-for-windows/) for details.

* Kubernetes runtime. For example, minikube.

    ```
    > brew install minikube
    > minikube start --memory 6144
    ```

## Starting a network

Two paths must be set, either as environment variable or flags to the commands:  

*  `QUBE_CONFIG` or `--config`. Path to the [minimal configuration](../../Concepts/Qubernetes/Qubernetes-Overview.md#minimal-configuration).
*  `QUBE_K8S_DIR` or `--k8sdir`. Path to a directory to contain the GoQuorum and Kubernetes resources.

!!! example "Environment variables"

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

!!! example "Command line flags"

    ```
    > qctl init --config $(pwd)/myconfig.yaml network --num 3  --consensus ibft --cakeshop --monitor
    > qctl generate network --create --config $(pwd)/myconfig.yaml --k8sdir $(pwd)/out
    > qctl deploy network --wait --config $(pwd)/myconfig.yaml --k8sdir $(pwd)/out
    > qctl geth exec quorum-node1 'eth.blockNumber'
    > qctl geth attach quorum-node1
    ```

## Interacting

!!! example
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

!!! example "Attach to a specific node"

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
