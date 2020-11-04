---
description: Getting started with GoQuorum overview
---

# Getting started overview

You can get started with GoQuorum in multiple ways.
They range from using our wizard to generate a local network, to configuring and creating a full network from scratch.

## GoQuorum Wizard

The easiest way to get a network up and running is by using the [GoQuorum Wizard](Wizard/GettingStarted.md).
This command-line tool creates a local GoQuorum network that can be started and be ready for use in minutes.

The wizard provides options for configuring the network and generates all the resources to run either
in containers using `docker-compose`, or locally through the use of bash scripts.

The wizard requires [NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and runs on Linux/Mac only.

```bash
npm install -g quorum-wizard
quorum-wizard
```

To explore the features of GoQuorum and deploy a private contract, follow the instructions on [Interacting with the Network](Wizard/GettingStarted.md).

## GoQuorum Examples sample network

[GoQuorum Examples](../../Reference/GoQuorum-Projects.md) provides the means to quickly create a pre-configured sample GoQuorum
network that can be run either in a virtual-machine environment using Vagrant, in containers using docker-compose,
or locally through the use of bash scripts to automate creation of the network.

## GoQuorum on Kubernetes (Qubernetes)

Use [qubernetes](https://github.com/ConsenSys/qubernetes) to run configurable N node GoQuorum networks on Kubernetes.

You can use [kind](https://github.com/ConsenSys/qubernetes#quickest-start) or [Minikube](https://github.com/ConsenSys/qubernetes/blob/master/docs/minikube-docs.md)
for local development. For long running networks, use a cloud service (for ecample Google Kubernetes Engine, Azure KS, AWS EKS) or a self-hosted kubernetes cluster.

Qubernetes supports Raft and Istanbul consensus algorithms, multiple versions, and networks with an arbitrary number of nodes.
Also includes [examples](https://github.com/ConsenSys/qubernetes/blob/master/docs/7nodes-on-k8s.md) ready to run on Kubernetes.

## Creating a network from scratch

[Creating a Network From Scratch](../../Tutorials/Creating-A-Network-From-Scratch.md) provides a step-by-step walkthrough
of how to create and configure a GoQuorum network suitable for either Raft or Istanbul consensus. It
also shows how to enable privacy and add/remove nodes as required.

## Creating a network deployed in the cloud

[Quorum Cloud](https://github.com/ConsenSys/quorum-cloud) provides an example of how a GoQuorum network
can be run on a cloud platform. It uses Terraform to create a 7 node GoQuorum network deployed on AWS
using AWS ECS Fargate, S3 and an EC2.
