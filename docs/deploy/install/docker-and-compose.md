---
title: Docker and Docker-Compose
description: GoQuorum deployment Docker and Compose
sidebar_position: 3
---

# Docker

You can run GoQuorum using the [official docker image on Dockerhub](https://hub.docker.com/r/quorumengineering/quorum).

We also provide an [official Tessera docker image](https://hub.docker.com/r/quorumengineering/tessera) which can be paired with GoQuorum to handle private transactions. This pattern is used in the [Kubernetes](./kubernetes.md) manifests and Helm charts.

## Pull the image

After you [log into dockerhub](https://docs.docker.com/engine/reference/commandline/login/), pull the latest image as follows:

```bash
docker pull quorumengineering/quorum:latest
```

## Run the image

To run the image, pass in the same command line arguments as you would when running the [binary](binaries.md):

```bash
docker run -d -p 8545:8545 quorumengineering/quorum:latest --datadir /data --http --http.addr 0.0.0.0 --http.port 8545 ...
```

# Docker Compose

[Docker-compose](https://docs.docker.com/compose/) allows you to spin up many docker containers simultaneously, and allows you to quickly configure networking and volumes, and develop patterns to use.

The [Quorum Developer Quickstart](../../tutorials/quorum-dev-quickstart/using-the-quickstart.md) provides the simplest and fastest method to spin up a local GoQuorum network with Tessera nodes, and supporting containers for monitoring.

You can also use the [Kubernetes](./kubernetes.md) examples and charts.
