---
description: Qubernetes for multi-cluster networks
---

# Qubernetes for multi-cluster networks

Multi-cluster networks support high availability and connect different business units
and companies. The following outlines an initial way of using  Qubernetes to manage and enable a
cross-cluster GoQuorum Kubernetes deployment.

## Nodes

The `nodes` section of the [minimal configuration](Qubernetes-Overview.md#nodes) represents
nodes running in a single cluster.

!!! example "Minimal configuration single cluster nodes"
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

## External Nodes

External nodes are a multi-cluster concept for nodes outside the cluster. External nodes need
network routes to the necessary services (GoQuorum p2p and Tessera p2p), and the node address
if using istanbul consensus. When adding an external node, this information must be obtained from
exposes a pod to the outside world via `K8s_Node_IP:Node_Port`.the external cluster.

The [qctl](../../HowTo/GetStarted/Getting-Started-Qubernetes.md) command includes a command for exporting
the information required to add an external node. The required information cannot always be known
until the node is deployed. For example, the ports are provisioned by Kubernetes and cannot be known
until the node is deployed.

!!! example "Exporting external node information"
    ```
    qctl ls nodes --asexternal
    ```

    ```yaml
     external_nodes:
     - Node_UserIdent:  quorum-node1
       Enode_Url: "enode://61a3d243b2d24bbc24333a1d2dd0078d8b9b5594bf518fa2f191e56451d276d2cd252560270ea5f754234c137e0587ff62f4d6e62e9949105f1cd9c199063693@1.2.3.4:4598?discport=0&raftport=50401"
       Tm_Url:  1.2.3.4:4599
       Node_Acct_Addr: 0xb2A84e1F138FbfC6B9E69eCeD4272c35490261e4
    ```

## Two cluster multi-cluster example

!!! note
    This example was tested against commit [a47da88f5c3f](https://github.com/ConsenSys/qubernetes/commit/a47da88f5c3fcacd445e32720fe5669cdbff2fc2).

To add external nodes, there must be an initial cluster running. This example assumes two
entities manage their own Kubernetes clusters A and B.

1. **A** starts an initial cluster and deploys their initial nodes.

    ```bash
    qctl init network --num 3 --consensus ibft --qversion 2.7.0 --gethparams='--rpccorsdomain="*" --rpcvhosts="*"'
    qctl generate network --create
    qctl deploy network
    ```

    Config for **A**:

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
    - Node_UserIdent: quorum-node3
     Key_Dir: key3
     quorum:
       quorum:
         consensus: istanbul
         Quorum_Version: 2.7.0
       tm:
         Name: tessera
         Tm_Version: 0.10.6
     geth:
       Geth_Startup_Params:
    ```

2. Once the cluster is running, **A** runs `qctl` to obtain their cluster nodes in an external format.

    === "Example"
        ```bash
        qctl ls nodes --asexternal  --node-ip=1.2.3.4 --bare
        ```

    === "Result"
        ```yaml
        external_nodes:
        - Node_UserIdent:  quorum-node1
          Enode_Url: "enode://1cb6...@1.2.3.4:32044?discport=0&raftport=50401"
          Tm_Url:  1.2.3.4:30047
          Node_Acct_Addr: 0x60eD1973D8bEB9118f664A688B2E79a344F66954
        - Node_UserIdent:  quorum-node2
          Enode_Url: "enode://11d0...@1.2.3.4:32352?discport=0&raftport=50401"
          Tm_Url:  1.2.3.4:31735
          Node_Acct_Addr: 0x2bEa1b982A31dF3355b509303703303fCb34A0dC
        - Node_UserIdent:  quorum-node3
          Enode_Url: "enode://8a28...@1.2.3.4:31931?discport=0&raftport=50401"
          Tm_Url:  1.2.3.4:31914
          Node_Acct_Addr: 0x7D56e937283cFD29F5772696E610dCBf35b6C777
        ```

    === "Example Minikube"
        ```bash
        qctl ls nodes --asexternal  --node-ip=$(minikube ip) --bare
        ```
    
    === "Result"
        
        The `$MINIKUBE_IP` varibable below is the IP of your minikube node
        passed to the `qctl ls nodes` command using `--node-ip=$(minikube ip)`.
        
        ```yaml
        external_nodes:
        - Node_UserIdent:  quorum-node1
          Enode_Url: "enode://1cb6...@$MINIKUBE_IP:32044?discport=0&raftport=50401"
          Tm_Url:  $MINIKUBE_IP:30047
          Node_Acct_Addr: 0x60eD1973D8bEB9118f664A688B2E79a344F66954
        - Node_UserIdent:  quorum-node2
          Enode_Url: "enode://11d0...@$MINIKUBE_IP:32352?discport=0&raftport=50401"
          Tm_Url:  $MINIKUBE_IP:31735
          Node_Acct_Addr: 0x2bEa1b982A31dF3355b509303703303fCb34A0dC
        - Node_UserIdent:  quorum-node3
          Enode_Url: "enode://8a28...@$MINIKUBE_IP:31931?discport=0&raftport=50401"
          Tm_Url:  $MINIKUBE_IP:31914
          Node_Acct_Addr: 0x7D56e937283cFD29F5772696E610dCBf35b6C777
        ```

3. **A** shares the external node information by copying and pasting the output of the previous command,
   and the `genesis.json` with **B**.

4. **B** generates their initial qubernetes configuration file with the nodes that are internal and owned by
   their cluster.

    ```bash
     qctl init --num 2 --consensus ibft --qversion 2.7.0
     qctl generate network --create
    ```

    Config for **B**:

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
       Geth_Startup_Params: ""
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
       Geth_Startup_Params: ""
    ```

5. **B** adds the external nodes from **A** their config file, and the genesis.json obtained from **A**
 to their config, and regenerates the Kuberenetes network resources.

    ```bash
    qctl generate network --update
    ```

    Updated config for **B**:

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
       Geth_Startup_Params: ""
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
       Geth_Startup_Params: ""
    external_nodes:
     - Node_UserIdent:  quorum-node1
       Enode_Url: "enode://1cb6...@1.2.3.4:32044?discport=0&raftport=50401"
       Tm_Url:  1.2.3.4:30047
       Node_Acct_Addr: 0x60eD1973D8bEB9118f664A688B2E79a344F66954
     - Node_UserIdent:  quorum-node2
       Enode_Url: "enode://11d0...@1.2.3.4:32352?discport=0&raftport=50401"
       Tm_Url:  1.2.3.4:31735
       Node_Acct_Addr: 0x2bEa1b982A31dF3355b509303703303fCb34A0dC
     - Node_UserIdent:  quorum-node3
       Enode_Url: "enode://8a28...@1.2.3.4:31931?discport=0&raftport=50401"
       Tm_Url:  1.2.3.4:31914
       Node_Acct_Addr: 0x7D56e937283cFD29F5772696E610dCBf35b6C777
    ```

6. **B** deploys the network. The network is started but cannot connect to **A** because **A** has not
added the external nodes from **B** yet.

    ```bash
    qctl deploy network
    ```

7. **B** runs `qctl` to obtain the external nodes information from their running cluster.

    ```bash
    qctl ls nodes --asexternal --node-ip=2.2.3.4
    ```

    ```yaml
    external_nodes:
    - Node_UserIdent:  quorum-node1
      Enode_Url: "enode://dca1...@2.2.3.4:31923?discport=0&raftport=50401"
      Tm_Url:  2.2.3.4:30482
      Node_Acct_Addr: 0x9712A5aa48A654e9B117467748eF1F793153E918
    - Node_UserIdent:  quorum-node2
      Enode_Url: "enode://2a73...@2.2.3.4:32448?discport=0&raftport=50401"
      Tm_Url:  2.2.3.4:30371
      Node_Acct_Addr: 0xB4ba047619946B607dcBE6cA6E54Ff071f95c9E8
    ```

8. **B** shares its external nodes with **A** by copying and pasting the above output, and sending it
to **A**.

9. **A** adds the external nodes information from **B** to the **A** configuration file.

    Updated config for **A**:

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
       Geth_Startup_Params: ""
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
       Geth_Startup_Params: ""
    - Node_UserIdent: quorum-node3
     Key_Dir: key3
     quorum:
       quorum:
         consensus: istanbul
         Quorum_Version: 2.7.0
       tm:
         Name: tessera
         Tm_Version: 0.10.6
     geth:
       Geth_Startup_Params: ""
    external_nodes:
     - Node_UserIdent:  quorum-node1
       Enode_Url: "enode://dca1...@2.2.3.4:31923?discport=0&raftport=50401"
       Tm_Url:  2.2.3.4:30482
       Node_Acct_Addr: 0x9712A5aa48A654e9B117467748eF1F793153E918
     - Node_UserIdent:  quorum-node2
       Enode_Url: "enode://2a73...@2.2.3.4:32448?discport=0&raftport=50401"
       Tm_Url:  2.2.3.4:30371
       Node_Acct_Addr: 0xB4ba047619946B607dcBE6cA6E54Ff071f95c9E8
    ```

10. **A** generates the update for the Kubernetes network resources. The update leaves the current
nodes intact, only generating the diff and, updating the configuration files as necessary.

   ```bash
   qctl generate network --update
   ```

11. **A** deploys the updated resources to its cluster.

   ```bash
   qctl deploy network
   ```

   The clusters can now connect and there is a
   GoQuorum Kubernetes network spanning multiple clusters.

## Multi-cluster across namespaces using NodePorts

A namespace in Kubernetes is an isolated cluster within the same running Kubernetes instance. You can
add nodes across namespaces by exposing the services via a NodePort service.

[A NodePort service in Kubernetes](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport.)
exposes a pod to the outside world via `K8s_Node_IP:Node_Port`.

The NodePort is not known until deployment time. When the GoQuorum cluster is deployed, the NodePort
is assigned and can be obtained from Kubernetes.
 
!!! example "Obtain NodePort"
    ```bash
    kubectl get services` or `qctl ls url --type=nodeport   
    ```

Node ports are represented as pairs `<Internal_Port:External_Port>`. In the example below, `8545` represents the internal port used by the
cluster, and `31346` represents the external port.

!!! example "NodePort Example"
    ```bash
    kubectl get services
    quorum-node1 NodePort  10.96.184.48  <none> ...,8545:31346/TCP,30303:32109/TCP,...   4s
    ```

To access the service via the NodePort the Kubernetes Node IP must also be known. The Kubernetes Node
IP is the host running the Kubernetes nodes.

!!! note

    There are many ways to add nodes in a multi-cluster way. Qubernetes deliberately aims to be as simple as
    possible while supporting the necessary requirements.

    Multi-cluster currently only supports IBFT consensus.
