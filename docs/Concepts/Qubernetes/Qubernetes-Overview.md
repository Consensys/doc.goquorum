---
description: Qubernetes (GoQuorum on Kubernetes) overview
---

# Qubernetes

[Qubernetes](https://github.com/ConsenSys/qubernetes) is a project for generating GoQuorum network resources,
Kubernetes GoQuorum resources, and managing and interacting with a GoQuorum Kubernetes deployment.

Qubernetes has defaults to enable quick setups and ease of use. Qubernetes is customizable for
more advanced Kubernetes deployments. For example,  with configurable ingress, network policies, security
context, and persistent volume size. Qubernetes includes support for Cakeshop, monitoring, and acceptance tests.

## Build Container

The [qubernetes build container](https://hub.docker.com/repository/docker/quorumengineering/qubernetes):

* Works with the minimal configuration. The minimal configuration is called `qubernetes.yaml` in the
following examples.
* Generates GoQuorum resources including configuration and keys.
* Generates Kubernetes resources for a GoQuorum network.
* Can be leveraged by other projects that need to generate GoQuorum resource. For example, the
[GoQuorum Wizard](../../HowTo/GetStarted/Wizard/GettingStarted.md) uses the build container to generate GoQuorum
network resources, and to run Kubernetes.

!!! example "Generate GoQuorum resources only `./qube-init`."
    ```
    > docker run --rm -it -v $(pwd)/qubernetes.yaml:/qubernetes/qubernetes.yaml -v $(pwd)/out:/qubernetes/out  quorumengineering/qubernetes ./qube-init qubernetes.yaml
    ```

!!! example "Generate GoQuorum resources and Kubernetes resources for the Quorum network `./quorum-init`."
    ```
    > docker run --rm -it -v $(pwd)/qubernetes.yaml:/qubernetes/qubernetes.yaml -v $(pwd)/out:/qubernetes/out  quorumengineering/qubernetes ./quorum-init qubernetes.yaml
    ```

!!! example "Generate or regenerate Kubernetes resources only `./qubernetes`."
    ```
    > docker run --rm -it -v $(pwd)/qubernetes.yaml:/qubernetes/qubernetes.yaml -v $(pwd)/out:/qubernetes/out  quorumengineering/qubernetes ./qubernetes qubernetes.yaml
    ```

## Config as code

Config as code is a core concept for DevOps and automating deployments. When config as code is implemented,
configuration files accurately describe the state of the system. More specifically,
everything the system needs to know about must be in the configuration file and not guessed at or
stored in external sources.

## Minimal configuration

Quberentes implements config as code, and runs off a minimal configuration file called `qubernetes.yaml` or
`qubernetes-generated.yaml`. The configuration file can be created and modified:

* Manually
* Using the [`qctl`](https://github.com/ConsenSys/qubernetes/tree/master/qctl) command line tool. `qctl`
enables the users to generate and manipulate the configuration file.

The minimal configuration file example for a single cluster deployment includes the parameters required by the
genesis file, and by each node in the cluster. The consensus and versions can change between the
nodes in line with what would be running in Kubernetes. Each node represents a deployment that manages a
pod (that is, the smallest unit in Kubernetes). Each node is used to generate the necessary configuration
files for GoQuorum. For example, `permissioned-nodes.json`, `static-nodes.json`, `istanbul-validator.toml`,
loading accounts with value, and setting up test contracts.

!!! example "Minimal configuration file"
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

The `nodes` section of the minimal configuration represents nodes running in a single cluster. When
running a node in a single cluster, the node defines:

* Keys for the nodes in the cluster
* Versions to use
* Where to get the docker images
* Consensus.


!!! example "Minimal configuration single cluster node"

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

## qctl command line tool

[qctl](../../HowTo/GetStarted/Getting-Started-Qubernetes.md) is a Golang command line tool for
creating and manipulating the minimal configuration, and interacting with a running Kubernetes network.

Following the Unix philosophy, the commands intentionally only do one thing. Add the commands to
scripts to automate the complete network creation and other tasks.

!!! example "Starting a 2.6.0 GoQuorum network"
    ```bash
    #!/bin/sh

    export QUBE_CONFIG=/path/to/my/qubernetes.yaml
    export QUBE_K8S_DIR=/path/to/my/output/dir/out

    qctl init --qversion 2.6.0 --num 3
    qctl generate network --create
    echo "deploying a 3 nodes 2.6.0 Quourm network"
    qctl deploy network --wait
    qctl ls node --all
    ```

!!! example "Adding a 2.7.0 node to test the upgrade"
    ```bash
    qctl "adding a 2.7.0 node to the 2.6.0 network"
    qctl add node --qversion 2.7.0 quorum-node4
    qctl generate network --update
    qctl deploy network --wait

    echo "testing a private and public contract again the new 2.7.0 nodes"
    qctl test contracts quorum-node4

    sleep 1
    ```

!!! example "Show all node information and delete network"
    ```bash
     qctl ls nodes --all

    sleep 2
    echo "delete network now"
    qctl delete network
    ```
