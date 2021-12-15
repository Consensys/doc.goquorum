---
description: Getting started with GoQuorum overview
---

# Getting started overview

You can get started with GoQuorum in multiple ways.
They range from using the quickstart to generate a local network, to creating and configuring a full network from scratch.

## Quorum Dev Quickstart

The easiest way to get a network up and running is by using the [Quorum Dev Quickstart](../../tutorials/quorum-dev-quickstart/using-the-quickstart.md).
This command-line tool creates a local GoQuorum network that can be started and be ready for use in minutes.

The quickstart provides options for configuring the network and generates all the resources to run in containers
using `docker-compose`.

The quickstart requires:

* [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and runs on Linux and Mac only.
* [Docker and Docker-compose](https://docs.docker.com/compose/install/).
* [Truffle](https://www.trufflesuite.com/truffle) development framework.
* [`curl` command line](https://curl.haxx.se/download.html).
* [MetaMask](https://metamask.io/).

To start the quickstart, run:

```bash
npx quorum-dev-quickstart
```

To explore the features of GoQuorum and deploy private contracts, follow the instructions on [Interacting with the Network](../../tutorials/quorum-dev-quickstart/using-the-quickstart.md)

## GoQuorum examples sample network

[GoQuorum examples](../../reference/goquorum-projects.md) provides the means to quickly create a pre-configured sample GoQuorum
network that can be run either in a virtual-machine environment using Vagrant, in containers using docker-compose,
or locally through the use of bash scripts to automate creation of the network.

## GoQuorum on Kubernetes

Use [kubernetes](kubernetes.md) to run configurable GoQuorum and Tessera networks on Kubernetes.

For local development, use [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) or
[Minikube](https://minikube.sigs.k8s.io/docs/start/). For long running networks,
use a cloud service (for example Google GKE, Azure AKS, AWS EKS) or a self-hosted Kubernetes cluster.

## Creating a network from scratch

Follow the step-by-step walk-throughs to create and configure GoQuorum networks for [IBFT](../../tutorials/private-network/create-ibft-network.md), [QBFT](../../tutorials/private-network/create-qbft-network.md), and [Raft](../../tutorials/private-network/create-a-raft-network.md) consensus.
It also shows how to enable privacy and add/remove nodes as required.

## Creating a network deployed in the cloud

[Quorum Terraform](https://github.com/ConsenSys/quorum-terraform) provides an example of how a GoQuorum network
can be run on a cloud platform on either AWS or Azure
