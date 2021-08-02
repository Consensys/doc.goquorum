---
description: Quorum Dev Quickstart network setup quickstart command line tool
---

# Quorum Dev Quickstart

[Quorum Dev Quickstart](https://github.com/ConsenSys/quorum-dev-quickstart) is a command line tool that allows
users to set up a development GoQuorum network on their local machine in less than 2 minutes.

![Quorum Dev Quickstart terminal demo](../../images/quickstart/quorum-dev-quickstart.gif)

## Using Quorum Dev Quickstart

The Quorum Dev Quickstart is written in Javascript and designed to be run as a global NPM module from the command line.
Make sure you have [Node.js/NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed
(version 14 or higher).

Using npx to run the quickstart without the need to install:

```sh
npx quorum-dev-quickstart
```

You can also install the quickstart globally with npm:

```Bash
npm install -g quorum-dev-quickstart

# Once the global module is installed, run:
quorum-dev-quickstart
```

Note: Many installations of npm don't have permission to install global modules and will throw an EACCES error.
[Here is the recommended solution from NPM](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

## Dependencies

Here are the dependencies (in addition to Nodejs 14+) that are required:
* [Docker and Docker-compose](https://docs.docker.com/compose/install/)
* [Truffle](https://www.trufflesuite.com/truffle) development framework
* [curl command line](https://curl.haxx.se/download.html)
* [MetaMask](https://metamask.io/)


## Options

You can also provide these flags when running `quorum-dev-quickstart`:

| Flags | Effect |
| - | - |
| `--clientType` | User `quorum` for the clientType |
| `--pivacy` | Use `true` to enable Private Transaction support, or `false` to disable |
| `-orchestrate` | Use `true` to enable support for [Consensys Orchestrate](https://consensys.net/codefi/orchestrate/) , or `false` to disable|
| `--monitoring` | Use `default` to use the default monitoring options of Prometheus, Grafana and Cakeshop. Alternatively use `elk` for the Elastic Clsuter, or `splunk` for Splunk monitoring |
| `--outputPath` | The path to output the artifacts to  |
| `-h`, `--help` | Show help |

## Interacting with the Network

To explore the features of GoQuorum like permissioing and privacy, follow the instructions on
[Interacting with the Network](./Using-the-Quickstart.md). The page also has information on smart
contracts, DApps and using wallets, as well as monitoring the entire network.

## Tools

The quickstart provides the option to deploy some useful monitoring tools alongside your network. Learn more on the [Tools page](./Tools.md).

## Developing

Clone this repo to your local machine.

`npm install` to get all the dependencies.

`npm run build` to automatically build on changes to any files in the src directory and output to a build directory

`npm run start` to run (alternatively, you can run `node build/index.js`)

## Contributing

Quorum Dev Quickstart is built on open source and we invite you to contribute enhancements.
Upon review, you will be required to complete a Contributor License Agreement (CLA) before we are able to merge.
If you have any questions about the contribution process, you can get
them answered by the [GoQuorum Slack community].

## Getting Help

Stuck at some step? Please join our [GoQuorum Slack community] for support.

[GoQuorum Slack community]: https://www.goquorum.com/slack-inviter
