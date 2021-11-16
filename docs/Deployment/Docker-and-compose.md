---
description: GoQuorum deployment Docker and Compose
---

## Docker

GoQuorum can be installed using the official docker image on [Dockerhub](https://hub.docker.com/r/quorumengineering/quorum).
There is an official docker image for [Tessera](https://hub.docker.com/r/quorumengineering/tessera) as well, which can be
paired with GoQuourm to handle private transactions. This pattern is used in the [Kubernetes](./Kubernetes.md) manifests
and Helm charts.

### Pull the image

Once you have [logged into dockerhub](https://docs.docker.com/engine/reference/commandline/login/) you can pull the image
and then run it like you would the [binary](./Binaries.md)

```bash
docker pull quorumengineering/quorum:latest
```

### Use the image

Running the image is quite simple and you pass in the same command line arguments to the binary like so:

```bash
docker run -d -p 8545:8545 quorumengineering/quorum:latest --datadir /data --http --http.addr 0.0.0.0 --http.port 8545 ...
```

## Docker Compose

[Docker-compose](https://docs.docker.com/compose/) allows you to spin up many docker containers at once and gives you the
freedom to configure networking, volumes etc faster and develop patterns for use

The [Quorum Dev Quickstart](../Tutorials/Quorum-Dev-Quickstart/Using-the-Quickstart.md) is simplest and fastest way to
spin up a local GoQuourm network with Tessera nodes and supporting containers for monitoring. The next step from this is
to use the [Kubernetes](./Kubernetes.md) examples and charts
