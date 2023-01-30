---
title: Quorum Explorer
description: Using the Quorum Explorer on a Kubernetes cluster
sidebar_position: 4
---

## Prerequisites

- Clone the [Quorum-Kubernetes](https://github.com/ConsenSys/quorum-kubernetes) repository
- A [running Kubernetes cluster](./create-cluster.md)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm3](https://helm.sh/docs/intro/install/)
- [Existing network](./deploy-charts.md)

## Deploy the Quorum Explorer helm chart

[Quorum-Explorer](https://github.com/ConsenSys/quorum-explorer) is a lightweight blockchain explorer. The Quorum Explorer is **not** recommended for use in production and is intended for demonstration/development purposes only.

The Explorer can give an overview of the whole network, such as querying each node on the network for block information, voting or removing validators from the network, demonstrating a SimpleStorage smart contract with privacy enabled, and sending transactions between wallets in one interface.

To achieve this, update the [Explorer values file](https://github.com/ConsenSys/quorum-kubernetes/blob/master/helm/values/explorer-goquorum.yaml) with details of your nodes and endpoints and then [deploy](./deploy-charts.md).

## Nodes

The **Nodes** page gives you an overview of the nodes on the network. Select the node you would like to interact with from the dropdown list in the upper right corner to get details of the node as well as block height.

![`k8s-explorer`](../../images/kubernetes/kubernetes-explorer.png)

## Validators

The **Validators** view simulates a production environment or consortium where each node individually runs API calls to vote a new validator in or an existing validator out. When using the buttons to remove, discard pending, or proposing a validator, the app sends an API request to the node selected from the dropdown list only.

In order to add or remove a validator, select a majority of the existing validator pool individually and perform the vote API call by selecting **Propose Validator** or **Remove**. Each node can call a discard on the voting process during or after the validator has been added.

Also note that vote calls made from non-validator nodes have no effect on overall consensus.

![`k8s-explorer-validators`](../../images/kubernetes/kubernetes-explorer-validators.png)

## Explorer

The **Explorer** view gives you the latest blocks from the chain as well as the latest transactions as they come through on the network. In addition, you can search by block number or transaction hash through each respective search bar.

![`k8s-explorer-explorer`](../../images/kubernetes/kubernetes-explorer-explorer.png)

## Contracts

This example demonstrates using the **Contracts** view in the app to deploy a private transaction between members, such as between `member-1`, `member-2` or `member-3`, as seen in the following screenshot.

To deploy a contract in this example, deploy `member-1` as the account in _1. Account to Deploy_. In **2. Deploy**, select `member-1` and `member-3` in the **Private For** multi-select. Then select **Compile** and **Deploy**.

![`k8s-explorer-contracts-1`](../../images/kubernetes/kubernetes-explorer-contracts-1.png)

Once deployed, you can interact with the contract. As this is a new transaction, select `member-1` and `member-3` in the **Interact** multi-select and select the appropriate method call to `get` or `set` the value at the deployed contract address.

![`k8s-explorer-contracts-set`](../../images/kubernetes/kubernetes-explorer-contracts-set.png)

To check for the private transaction functionality, if you select `member-2` from the dropdown list in the upper right corner, you are unable to interact with the contract as it was not part of the transaction. Only `members-1` and `member-3` respond correctly.

At present, the only contract that is available for deployment through the app is the SimpleStorage contract. However, in time, we plan to add more contracts to that view.

## Wallet

The **Wallet** view gives you the functionality to send simple Eth transactions between accounts by providing the account's private key, the recipient's address, and transfer amount in Wei.

![`k8s-explorer-wallet`](../../images/kubernetes/kubernetes-explorer-wallet.png)
