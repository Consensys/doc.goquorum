## Summary

As GoQuorum networks grow and need HA and to be managed between different business units / companies, etc. we need to have a
way to connect GoQuorum nodes across multiple organizations, availability zones, etc. As the industry moves towards
Kuberenetes, we need a way to support this cross cluster model in Kubernetes. This document outlines the initial design
for Qubernetes to manage and enable a cross-cluster GoQuorum Kubernetes deployment.



## Nodes
The nodes portion of the [minimal config](http://127.0.0.1:8000/Concepts/Qubernetes/Overview/#minimal-config) represents
nodes running in a single cluster. Running a node in a single cluster requires, the keys for the nodes in the cluster,
the version(s) to use, where to get the docker images, consensus, etc.

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

## External Nodes

External Nodes is a multi-cluster concept used to express that the node lives outside the cluster. External nodes require
network routes to the necessary services (GoQuorum/geth p2p, Tessera p2p), and additionally the Node_Acct_Addr (derived from the nodekey)
if using istanbul consensus. When adding an external node, this information must be acquired from the external cluster
(either owned by the user, or owned by and another entity).

The [qctl](https://github.com/ConsenSys/qubernetes/tree/master/qctl) command has been updated to include a command for exporting this information, in some instances,
this information cannot be known until the node is deployed, for example when depending on ports are provisioned by
Kubernetes.
```
> qctl ls nodes --asexternal
```

```yaml
external_nodes:
 - Node_UserIdent:  quorum-node1
   Enode_Url: "enode://61a3d243b2d24bbc24333a1d2dd0078d8b9b5594bf518fa2f191e56451d276d2cd252560270ea5f754234c137e0587ff62f4d6e62e9949105f1cd9c199063693@1.2.3.4:4598?discport=0&raftport=50401"
   Tm_Url:  1.2.3.4:4599
   Node_Acct_Addr: 0xb2A84e1F138FbfC6B9E69eCeD4272c35490261e4
```


## Flow To Enabling Multi-Cluster K8s Deployments 2 cluster example
(tested against commit [a47da88f5c3f](https://github.com/ConsenSys/qubernetes/commit/a47da88f5c3fcacd445e32720fe5669cdbff2fc2))

In order to add external nodes, there must be an initial cluster running. For this example, we’ll assume two
entities that manage their own Kubernetes clusters A and B.

1. **A** started an initial cluster and deploys their initial desired nodes.
    ```
    > qctl init network --num 3 --consensus ibft --qversion 2.7.0 --gethparams='--rpccorsdomain="*" --rpcvhosts="*"'
    > qctl generate network --create
    > qctl deploy network
    ```
**A**’s config at this point:

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

2. Once the cluster is running, **A** runs the qctl command to obtain their cluster nodes in an external format, or obtains
   the information in a customized way.
   ```yaml
   > qctl ls nodes --asexternal  --node-ip=1.2.3.4 --bare
   ```
if running minikube
    ```
    > qctl ls nodes --asexternal  --node-ip=$(minikube ip) --bare
    ```

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

3. **A** shares their external node information (they can copy and paste the output of the previous command) as well as the
   genesis.json with **B**.

4. **B** generates (keys, configs) their initial qubernetes config file (with the nodes that are internal and owned by
   their cluster) and then
    ```
     > qctl init --num 2 --consensus ibft --qversion 2.7.0
     > qctl generate network --create
    ```
**B**'s config at this point

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

5. **B** addes **A**’s external-nodes to their config file, and the genesis.json obtained from B to their config, and “re-generates” the Kuberenetes network resources.
    ```
    > qctl generate network --update
    ```
**B**’s config now looks like:
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

6. **B** then deploys the network. At this stage the network will come up, but will not be able to connect to **A** as **A** has not added **B**’s external-nodes yet.
    ```
    > qctl deploy network
    ```
7. **B** runs the qctl command or obtains the necessary external-nodes info from their running cluster.
    ```
    > qctl ls nodes --asexternal --node-ip=2.2.3.4
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

8. **B** shares its external nodes with **A** (copies and pastes the above output and sends it to **A**).

9. **A** addes **B**’s external-nodes to its configuration file.
   **A**’s config file now looks like:
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

10. Once the config file has been updated, **A** generates the update of its K8s network resources
(note: this will leave their current nodes intact and only generate the diff, updating the configuration files as necessary).
   ```
   > qctl generate network --update
   ```

11. **A** then deploys the updated resources to its cluster.
   ```
   > qctl deploy network
   ```

12. Once the new config has been deployed, the clusters should now be able to connect and there will be a
    Quorum K8s network spanning multiple clusters.

## Multi-Cluster Across Namespaces Via NodePorts
A namespace in Kubernetes is an isolated cluster within the same running Kubernetes instance. We will walk through a
flow of adding nodes across namespaces exposing the services via a NodePort service.

A NodePort service in Kubernetes is a way to expose a pod to the outside world via K8s_Node_IP:Node_Port

The NodePort is not known until deployment time, but can be obtained from the running Kubernetes cluster once it
is up, the blue port represents the internal port used by the cluster, and the highlighted port represents the port
that is accessible from outside the cluster.
```
quorum-node1 NodePort  10.96.184.48  <none> ...,8545:31346/TCP,30303:32109/TCP,...   4s
```

In order to access the service via the NodePort the Kubernetes Node Ip must also be known, this is the ip of the
host running the Kubernetes node(s).

## Future Work
There are many ways to add nodes in a multi-cluster way, the approach taken by Qubernetes aims to be as simple as
possible while supporting the necessary requirements.

Once we gather user feedback on how users are running networks, we can update Qubernetes multi-cluster accordingly,
but the core design of node, external-nodes should not have to be changed.

Currently, multi-cluster only support IBFT as the flow for adding raft nodes is more involved and there will be a
move to a deterministic raft Id https://github.com/ConsenSysQuorum/quorum/pull/147 which will be supported in a
similar way to ibft. We do not wish to waste engineering effort in supporting the current raft schema unless we get
direct requests from users where this is absolutely necessary.

Support additional ways to add nodes, e.g. Ingress

