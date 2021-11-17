---
description: GoQuorum deployment Docker and Compose
---

# Docker and Docker Compose

You can run GoQuorum using the [official docker image on Dockerhub](https://hub.docker.com/r/quorumengineering/quorum).

We also provide an [official Tessera docker image](https://hub.docker.com/r/quorumengineering/tessera) which
can be paired with GoQuorum to handle private transactions. This pattern is used in the [Kubernetes](./Kubernetes.md) manifests
and Helm charts.

### Pull the image

After you [log into dockerhub](https://docs.docker.com/engine/reference/commandline/login/), pull the latest image
as follows:

```bash
docker pull quorumengineering/quorum:latest
```

### Run the image

To run the image, pass in the same command line arguments as you would when running the [binary](Binaries.md):

```bash
docker run -d -p 8545:8545 quorumengineering/quorum:latest --datadir /data --http --http.addr 0.0.0.0 --http.port 8545 ...
```

## Docker Compose

[Docker-compose](https://docs.docker.com/compose/) allows you to spin up many docker containers simultaneously,
and allows you to quickly configure networking and volumes, and develop patterns to use.

The [Quorum Developer Quickstart](../Tutorials/Quorum-Dev-Quickstart/Using-the-Quickstart.md) provides the
simplest and fastest method to spin up a local GoQuourm network with Tessera nodes, and supporting containers
for monitoring.

You can also use the [Kubernetes](./Kubernetes.md) examples and charts.
