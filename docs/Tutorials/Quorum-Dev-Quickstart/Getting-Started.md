---
description: Quorum Dev Quickstart network setup quickstart command line tool
---

# Quorum Dev Quickstart

[Quorum Dev Quickstart](https://github.com/ConsenSys/quorum-dev-quickstart) is a command line tool that allows
users to set up a development GoQuorum network on their local machine in less than two minutes.
The quickstart is written in Javascript and designed to be run as a global npm module from the command line.

![Quorum Dev Quickstart terminal demo](../../images/quickstart/quorum-dev-quickstart.gif)

## Prerequisites

* [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version 14 or higher
* [Docker and Docker-compose](https://docs.docker.com/compose/install/)
* [Truffle](https://www.trufflesuite.com/truffle) development framework
* [`curl` command line](https://curl.haxx.se/download.html)
* [MetaMask](https://metamask.io/)

## Using Quorum Dev Quickstart

To run the quickstart without installation, use `npx`:

```sh
npx quorum-dev-quickstart
```

You can also install the quickstart globally with `npm`:

```Bash
npm install -g quorum-dev-quickstart

# Once the global module is installed, run:
quorum-dev-quickstart
```

!!! Note

    Many npm installations don't have permission to install global modules and will throw an EACCES error.
    npm has [a recommended solution](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

## Options

You can provide these flags when running `quorum-dev-quickstart`:

| Flag                         | Required to skip prompt | Description                                                                             |
| :--------------------------: | :---------------------: | :-------------------------------------------------------------------------------------: |
| `--clientType=<STRING>`      | Yes                     | Use `quorum` for GoQuorum.                                                              |
| `--privacy=<true|false>`     | Yes                     | Enables or disables private transaction support.                                        |
| `--orchestrate=<true|false>` | No                      | Enables support for [ConsenSys Orchestrate](https://consensys.net/codefi/orchestrate/). |
| `--monitoring=<STRING>`      | No                      | Use `default` for Prometheus, Grafana, and Cakeshop; `elk` to add ELK; `splunk` to add Splunk. |
| `--outputPath=<PATH>`        | No                      | Path to output artifacts.                                                               |
| `-h`, `--help`               | No                      | Show help.                                                                              |

## Interacting with the network

To explore the features of GoQuorum, such as permissioning and privacy, follow the instructions on
[Interacting with the Network](./Using-the-Quickstart.md).
The page also has information on smart contracts, dapps, wallets, and monitoring the network.

## Tools

The quickstart provides the option to deploy some useful monitoring tools alongside your network.
Learn more on the [Tools page](./Tools.md).

## Developing

Clone this repo to your local machine.

`npm install` to get all the dependencies.

`npm run build` to automatically build on changes to any files in the `src` directory and output to a build directory.

`npm run start` to run (alternatively, you can run `node build/index.js`).

## Contributing

Quorum Dev Quickstart is open source, and we invite you to contribute enhancements.
Upon review, you will be required to complete a Contributor License Agreement (CLA) before we are able to merge.
If you have any questions about the contribution process, you can get them answered by the [GoQuorum Slack community].

## Getting help

Stuck on a step? Please join our [GoQuorum Slack community] for support.

[GoQuorum Slack community]: https://www.goquorum.com/slack-inviter
