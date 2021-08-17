---
description: Using Cakeshop with GoQuorum
---

# Cakeshop

[Cakeshop](https://github.com/ConsenSys/cakeshop) is a set of tools and APIs for working with Ethereum,
packaged as a Java web application archive (WAR) that gets you up and running quickly.

Out of the box you get:

* **Blockchain explorer** - View transactions, blocks, and contracts, and see historical contract state at a point in time.
* **Node info** - View the overall status of your network.
* **Peer management** - Discover, add, and remove peers.
* **Enhanced permissions UI** - Manage smart contract-based [enhanced permissioning](../../Concepts/Permissioning/Enhanced/EnhancedPermissionsOverview.md)
* **Solidity sandbox** - Develop, compile, deploy, and interact with Solidity smart contracts.
* **Contract registry** - Keep track of deployed contracts and their code, interfaces, and state.

You can access Cakeshop when using the [Quorum Developer Quickstart](../../Tutorials/Quorum-Dev-Quickstart/Getting-Started.md),
[with Spring Boot](https://github.com/ConsenSys/cakeshop#running-via-spring-boot), or
[with Docker](https://github.com/ConsenSys/cakeshop#running-via-docker).

To view Cakeshop with your GoQuorum Quickstart network:

1. [Start the Quorum Developer Quickstart with GoQuorum](../../Tutorials/Quorum-Dev-Quickstart/Using-the-Quickstart.md),
   selecting default monitoring.
1. Open the Cakeshop UI at [http://localhost:8999](http://localhost:8999).

!!! tip

    The Quorum Developer Quickstart tutorial demonstrates how to
    [perform transactions directly using the Cakeshop UI](../../Tutorials/Quorum-Dev-Quickstart/Using-the-Quickstart.md#use-cakeshop).

![Cakeshop](../../images/console.png)
