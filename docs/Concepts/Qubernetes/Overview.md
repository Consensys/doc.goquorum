## Qubernetes Overview

[Qubernetes](https://github.com/ConsenSys/qubernetes) is a project for generating GoQuorum network resources, Kubernetes
GoQuorum resources, and managing / interacting with a GoQuorum Kubernetes deployment.

Qubernetes is designed to have resonable defaults for quick setups and easy of use, as well as to be customizable for
more advanced Kubernetes deployments with configurable, ingress, network policies, security context, Persistent Volume size,
etc. Qubernetes also includes support for cakeshop, monitoring and acceptance tests.


## The Build Container

The [qubernetes](https://hub.docker.com/repository/docker/quorumengineering/qubernetes) build container is available on
docker hub. It works with the minimal config (called `qubernetes.yaml` in the following examples), and can be
used to generate GoQuorum resources (configs, keys, etc.), and/or Kubernetes resources for a GoQuorum network. This container
can be leveraged by other projects that need to generate GoQuorum resource, e.g. [quorum-wizard](https://github.com/ConsenSys/quorum-wizard)
GoQuorum's interactive setup wizard (supports local, bash, docker-compose, k8s via qubernetes) uses it to generate GoQuorum
network resources, and for running Kubernetes.

Generate Quorum resources only `./qube-init`.
```
> docker run --rm -it -v $(pwd)/qubernetes.yaml:/qubernetes/qubernetes.yaml -v $(pwd)/out:/qubernetes/out  quorumengineering/qubernetes ./qube-init qubernetes.yaml
```

Generated Quorum resources and Kubernetes resources for the Quorum network `./quorum-init`.
```
> docker run --rm -it -v $(pwd)/qubernetes.yaml:/qubernetes/qubernetes.yaml -v $(pwd)/out:/qubernetes/out  quorumengineering/qubernetes ./quorum-init qubernetes.yaml
```

Generate or regenerate Kubernetes resources only `./qubernetes`.
```
> docker run --rm -it -v $(pwd)/qubernetes.yaml:/qubernetes/qubernetes.yaml -v $(pwd)/out:/qubernetes/out  quorumengineering/qubernetes ./qubernetes qubernetes.yaml
```

## Config as Code

Config as Code is a core concept around dev ops and automating deployments. The main idea is that simplified
configuration files should be able to accurately describe the state of the running system. More specifically,
everything the system needs to know about must be in the config file and not guessed at or stored in external sources.

## Minimal Config

Quberentes embraces config as code, and runs off a minimal configuration file generally called `qubernetes.yaml` or
`qubernetes-generated.yaml`. This file can either be created and modified manually, or via the
[`qctl`](https://github.com/ConsenSys/qubernetes/tree/master/qctl) command line tool, which allows the user to generate
and manipulate this file to their desired state.

An example of the minimal config for a single cluster deployment shows the necessary parameters required by the
genesis file, and each node that is in the cluster.  Notice that the consensus and versions can change between the
nodes as it is in line with what would be running in K8s. Each node represents a deployment that manages a
pod (the smallest unit in Kubernetes) as well as being used to generate necessary configuration files for GoQuorum,
e.g. `permissioned-nodes.json`, `static-nodes.json`, `istanbul-validator.toml`, loading accounts with value, setting
up test contracts etc.

```yaml
genesis:
 consensus: istanbul
 Quorum_Version: 2.7.0
 Chain_Id: "1000"
nodes:
- Node_UserIdent: quorum-node1
 Key_Dir: key1
 quorum:
   quorum:
     consensus: istanbul
     Quorum_Version: 2.7.0
   tm:
     Name: tessera
     Tm_Version: 0.10.6
 geth:
   Geth_Startup_Params: --rpcvhosts=\"*\" --rpccorsdomain=\"*\"
- Node_UserIdent: quorum-node2
 Key_Dir: key2
 quorum:
   quorum:
     consensus: istanbul
     Quorum_Version: 2.7.0
   tm:
     Name: tessera
     Tm_Version: 0.10.6
 geth:
   Geth_Startup_Params: --rpcvhosts=\"*\" --rpccorsdomain=\"*\"

```

### Nodes
The nodes portion of the minimal config represents nodes running in a single cluster. When running a node in a single
cluster, the keys for the nodes in the cluster, the version(s) to use, where to get the docker images, consensus, etc.

The minimal cluster owned node looks like:
```yaml
nodes:
- Node_UserIdent: quorum-node1
 Key_Dir: key1
 quorum:
   quorum:
     consensus: istanbul
     Quorum_Version: 2.7.0
   tm:
     Name: tessera
     Tm_Version: 0.10.6
 geth:
   Geth_Startup_Params: --rpcvhosts=\"*\" --rpccorsdomain=\"*\"
```

## Qctl Command line tool
[Qctl](https://github.com/ConsenSys/qubernetes/tree/master/qctl) is a golang command line tool for creating / manipulating
the minimal config, interacting with a running Kuberentes network.

The commands intentionally try to do only one thing (Unix philosophy). They can be added to scripts to automate
complete network creation / deletion, etc.

see [qctl](https://github.com/ConsenSys/qubernetes/tree/master/qctl) project
and
[Getting Started with Qubernetes](http://127.0.0.1:8000/HowTo/GetStarted/Qubernetes/)

an example script starting a network 2.6.0 GoQuorum network and adding a 2.7.0 node to it (test upgrade).
```bash
#!/bin/sh

export QUBE_CONFIG=/path/to/my/qubernetes.yaml
export QUBE_K8S_DIR=/path/to/my/output/dir/out

qctl init --qversion 2.6.0 --num 3
qctl generate network --create
echo "deploying a 3 nodes 2.6.0 Quourm network"
qctl deploy network --wait
qctl ls node --all

## script adding a node
qctl "adding a 2.7.0 node to the 2.6.0 network"
qctl add node --qversion 2.7.0 quorum-node4
qctl generate network --update
qctl deploy network --wait

echo "testing a private and public contract again the new 2.7.0 nodes"
qctl test contracts quorum-node4

sleep 1
## show all node info
qctl ls nodes --all

sleep 2
echo "delete network now"
qctl delete network
```
