---
title: Maintenance
description: Maintenance for GoQuorum on a Kubernetes cluster
sidebar_position: 5
---

## Prerequisites

- Clone the [Quorum-Kubernetes](https://github.com/ConsenSys/quorum-kubernetes) repository
- A [running Kubernetes cluster](./create-cluster.md) with a [network](./deploy-charts.md)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm3](https://helm.sh/docs/intro/install/)

## Updating a persistent volume claim size

Over time, as the chain grows so will the amount of space used by the persistent volume claim (PVC). As of Kubernetes v1.11, [certain types of storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/#allow-volume-expansion) allow volume resizing. Our charts for Azure use Azure Files and the AWS charts use EBS Block Store, both of which allow for volume expansion.

To update the volume size, you must update the override values file. For example, to increase the size on the transaction nodes volumes, add the following snippet to the [`txnode values.yml`](https://github.com/ConsenSys/quorum-kubernetes/blob/master/helm/values/txnode.yml) file, with the new size limit (the following example uses 50Gi).

```bash
storage:
  sizeLimit: "50Gi"
  pvcSizeLimit: "50Gi"
```

Once complete, update the node via helm:

```bash
helm upgrade member-1 ./charts/goquorum-node --namespace goquorum --values ./values/txnode.yml
```

## Updating GoQuorum versions

:::warning

When updating GoQuorum nodes across a cluster, perform the updates as a rolling update and not all at once, especially for the validator pool. If all the validators are taken offline, the chain halts, and you must wait for round changes to expire before blocks are created again.

:::

Updates for GoQuorum can be done via Helm in exactly the same manner as other applications. Alternatively, this can be done via `kubectl`. This example updates a node called `goquorum-validator-3`:

1. Set the update policy to use rolling updates (if not done already):

   ```bash
   kubectl patch statefulset goquorum-validator-3 --namespace goquorum -p '{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}'
   ```

2. Update the GoQuorum version via Helm:

   ```bash
   helm upgrade validator-3 ./charts/goquorum-node --namespace goquorum --values ./values/validator.yml --set image.goquorum.tag=21.10.0
   ```

   Or via `kubectl`:

   ```bash
   kubectl patch statefulset goquorum-validator-3 --namespace goquorum --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"quorumengineering/goquorum:21.10.0"}]'
   ```
