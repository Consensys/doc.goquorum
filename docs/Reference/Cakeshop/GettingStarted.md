# Getting started with Cakeshop

For a high level overview of what Cakeshop is, see the [Cakeshop concept page](../../Tutorials/Quorum-Dev-Quickstart/Tools.md).

## Download

Binary packages are available on the [GitHub releases page](https://github.com/ConsenSys/cakeshop/releases).

## Configuration

Cakeshop is a Spring Boot application, so you may place an `application.properties` file in the working directory to override any default configuration values.

For more info, see the [configuration documentation](Configuration.md).

## Running via Quorum Dev Quickstart

The recommended way to use Cakeshop is to generate a GoQuorum network with [Quorum Dev Quickstart](../../Tutorials/Quorum-Dev-Quickstart/Getting-Started.md).

## Requirements

* Java 11+
* Nodejs 10+ (if the Nodejs binary on your machine isn't called 'node', see [here](Configuration.md#cakeshop-internals))

## Running

* Download WAR file
* Run `java -jar cakeshop.war`
* Navigate to [`http://localhost:8080/`](http://localhost:8080/)

## Running via Docker

Simple example of running via docker on port 8080:

```sh
docker run -p 8080:8080 quorumengineering/cakeshop
```

Then access the UI at [`http://localhost:8080/`](http://localhost:8080/)

## Docker Customizations

You can add some extra flags to the run command to further customize Cakeshop.

Here is an example where you mount `./data` as a data volume for the container to use:

```sh
mkdir data
docker run -p 8080:8080 -v "$PWD/data":/opt/cakeshop/data quorumengineering/cakeshop
```

An example providing an initial `nodes.json` in the data directory and configuring it to be used:

```sh
# makes sure you have nodes.json at $PWD/data/nodes.json
docker run -p 8080:8080 -v "$PWD/data":/opt/cakeshop/data \
    -e JAVA_OPTS="-Dcakeshop.initialnodes=/opt/cakeshop/data/nodes.json" \
    quorumengineering/cakeshop
```

## Migrating from Cakeshop v0.11.0

The following big changes were made in v0.12.0:

1. Simplification of config file to better follow Spring Boot standards.
    * To ensure easy transition, Cakeshop will still look in the locations where v0.11.0 commonly stored the config file. But the new version allows you to now place your config in the folder where you run Cakeshop, or specify a different location using standard spring boot flags, for easier customization.
    * Cakeshop had custom logging location logic in the config before this change, which was removed. You may now redirect logs yourself or use Spring's logging config settings.
1. Moved Contract Registry from being stored in a combination of a smart contract and the database to being in the database only.
    * If you had contracts deployed and stored in the old Contract Registry, you may leave the `contract.registry.addr` line in your config file. Cakeshop will look for that contract address when it connects to the network and add those contracts to the database.
1. Elimination of Cakeshop's managed node in favor of only attaching to existing nodes.
    * Most of the original config values were related to this feature, and can be safely removed. See the [default config file](https://github.com/ConsenSys/cakeshop/blob/master/cakeshop-api/src/main/resources/config/application.properties) for all the values that are actually used.
1. Simplified DB configuration by using Spring Data.
    * You will need to update the db-related config values to use spring data. The old `cakeshop.database`, `cakeshop.hibernate`, and `cakeshop.jdbc` settings should change to use `spring.data`, `spring.jpa`, etc. See the [database configuration section](Configuration.md#database) for more info.
    * Due to an bug that happens when you update from Hibernate 4 to 5, when auto updating the database it will try to recreate some column constraints that don't need to be recreated. These will fail and print a stack trace in the logs because they already exist. No negative effects result from this error, so the best thing to do is to run with `spring.jpa.hibernate.ddl-auto=update` once and then change `update` to `none` on subsequent runs. In production, it is not recommended to use auto update to migrate your database at all, but instead run migrations on the database yourself.

## Configuration

For more info about how to configure Cakeshop, see the [configuration documentation](Configuration.md).
