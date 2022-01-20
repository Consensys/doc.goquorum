---
title: GoQuorum Kubernetes Maintenance
description: Maintenance for GoQuorum on a Kubernetes cluster
---

## Prerequisites

* Clone the [Quorum-Kubernetes](https://github.com/ConsenSys/quorum-kubernetes) repository
* A [running Kubernetes cluster](./create-cluster.md) with a [network](./deploy-charts.md)
* [Kubectl](https://kubernetes.io/docs/tasks/tools/)
* [Helm3](https://helm.sh/docs/intro/install/)

## Updating a Persistent Volume Claim (PVC) size

Over time, as the chain grows so will the amount of space used by the PVC. As of Kubernetes v1.11,
[certain types of Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/#allow-volume-expansion)
allow volume resizing. Our production charts for Azure use Azure Files and on AWS use EBS Block Store which allow for
volume expansion.

To update the volume size, add the following to the override values file. For example to increase the size on the
transaction nodes volumes, add the following snippet to the
[`txnode values.yml`](https://github.com/ConsenSys/quorum-kubernetes/blob/master/dev/helm/values/txnode.yml) file, with
appropriate size you would like (for example 50Gi below)

```bash
storage:
  sizeLimit: "50Gi"
  pvcSizeLimit: "50Gi"
```

Once complete, update the node via helm:

```bash
helm upgrade tx-1 ./charts/goquorum-node --namespace goquorum --values ./values/txnode.yml
```

## Updating GoQuorum Versions

The most important thing to remember when updating goquorum nodes across a cluster is to do the nodes one at a time as a
rolling update and not all at once, especially for the validator pool. If all the validators are taken offline, the
chain will halt and you will have to wait till for round changes to expire before blocks are created again.

Updates for goquorum can be done via Helm in exactly the same manner as other applications. Alternatively, this can be done
via `kubectl` and, for this example, we will update a node called `goquorum-validator-3`:

1. Set the update policy to use rolling updates (if not done already)

    ```bash
    kubectl patch statefulset goquorum-validator-3 --namespace goquorum -p '{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}'
    ```

2. Update the goquorum version via Helm:

    ```bash
    helm upgrade validator-3 ./charts/goquorum-node --namespace goquorum --values ./values/validator.yml --set image.goquorum.tag=21.10.0
    ```

    Or via `kubectl`:

      ```bash
      kubectl patch statefulset goquorum-validator-3 --namespace goquorum --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"quorumengineering/goquorum:21.10.0"}]'
      ```