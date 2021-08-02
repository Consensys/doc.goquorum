---
description: Getting started with GoQuorum overview
---

# Getting started overview

You can get started with GoQuorum in multiple ways.
They range from using our quickstart to generate a local network, to configuring and creating a full network from scratch.

## Quorum Dev Quickstart

The easiest way to get a network up and running is by using the [Quorum Dev Quickstart](../../Tutorials/Quorum-Dev-Quickstart/Using-the-Quickstart.md).
This command-line tool creates a local GoQuorum network that can be started and be ready for use in minutes.

The quickstart provides options for configuring the network and generates all the resources to run in containers
using `docker-compose`

The quickstart requires:
* [Nodejs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and runs on Linux/Mac only.
* [Docker and Docker-compose](https://docs.docker.com/compose/install/)
* [Truffle](https://www.trufflesuite.com/truffle) development framework
* [curl command line](https://curl.haxx.se/download.html)
* [MetaMask](https://metamask.io/)


```bash
npx quorum-dev-quickstart
```

To explore the features of GoQuorum and deploy private contracts, follow the instructions on [Interacting with the Network](../../Tutorials/Quorum-Dev-Quickstart/Using-the-Quickstart.md)


## GoQuorum Examples sample network

[GoQuorum Examples](../../Reference/GoQuorum-Projects.md) provides the means to quickly create a pre-configured sample GoQuorum
network that can be run either in a virtual-machine environment using Vagrant, in containers using docker-compose,
or locally through the use of bash scripts to automate creation of the network.

## GoQuorum on Kubernetes (Qubernetes)

Use [qubernetes](Getting-Started-Qubernetes.md) to run configurable N node GoQuorum networks on Kubernetes.

For local development, use [kind](https://github.com/ConsenSys/qubernetes#quickest-start) or
[Minikube](https://github.com/ConsenSys/qubernetes/blob/master/docs/minikube-docs.md). For long running networks,
use a cloud service (for ecample Google Kubernetes Engine, Azure KS, AWS EKS) or a self-hosted Kubernetes cluster.

Qubernetes supports Raft and Istanbul consensus algorithms, multiple versions, and networks with an arbitrary number of nodes.
The [Qubernetes repository](https://github.com/ConsenSys/qubernetes) includes [examples](https://github.com/ConsenSys/qubernetes/blob/master/docs/7nodes-on-k8s.md)
ready to run on Kubernetes.

## Creating a network from scratch

[Creating a Network From Scratch](../../Tutorials/Private-Network/Create-IBFT-Network.md) provides a step-by-step walkthrough
of how to create and configure a GoQuorum network suitable for either Raft or Istanbul consensus. It
also shows how to enable privacy and add/remove nodes as required.

