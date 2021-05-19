---
description: GoQuorum network setup wizard command line tool
---

# GoQuorum Wizard

[GoQuorum Wizard](https://github.com/ConsenSys/quorum-wizard) is a command line tool that allows
users to set up a development GoQuorum network on their local machine in less than 2 minutes.

![GoQuorum wizard terminal demo](../../../images/wizard/quorum-wizard.gif)

## Using GoQuorum Wizard

GoQuorum Wizard is written in Javascript and designed to be run as a global NPM module from the command line. Make sure you have [Node.js/NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed (version 10 or higher).

Using npx to run the wizard without the need to install:

```sh
npx quorum-wizard
```

You can also install the wizard globally with npm:

```Bash
npm install -g quorum-wizard

# Once the global module is installed, run:
quorum-wizard
```

Note: Many installations of npm don't have permission to install global modules and will throw an EACCES error. [Here is the recommended solution from NPM](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

## Dependencies

Here are the dependencies (in addition to Nodejs 10+) that are required depending on the mode that you run the wizard in:

Bash:

- Java (when running Tessera or Cakeshop)

Docker Compose:

- Docker
- docker-compose

Kubernetes:

- Docker (for generating resources during network creation)
- kubectl
- minikube, Docker Desktop with Kubernetes enabled, or some other kubernetes context

## Options

You can also provide these flags when running `quorum-wizard`:

| Flags | Effect |
| - | - |
| `-q`, `--quickstart` | Create 3 node Raft network with Tessera and Cakeshop (no user-input required) |
| `generate --config <PATH>` | Generate a network from an existing config.json file |
| `-r`, `--registry <REGISTRY>` | Use a custom docker registry (instead of registry.hub.docker.com) |
| `-o`, `--outputPath <PATH>` | Set the output path. Wizard will place all generated files into this folder. Defaults to the location where Wizard is run |
| `-v`, `--verbose` | Turn on additional logs for debugging |
| `--version` | Show version number |
| `-h`, `--help` | Show help |

## Interacting with the Network

To explore the features of GoQuorum and deploy a private contract, follow the instructions on [Interacting with the Network](Interacting.md).

## Tools

The wizard provides the option to deploy some useful tools alongside your network. Learn more on the [Tools page](Tools.md).

## Developing

Clone this repo to your local machine.

`npm install` to get all the dependencies.

`npm run test:watch` to automatically run tests on changes

`npm run start` to automatically build on changes to any files in the src directory

`npm link` to use your development build when you run the global npm command

`quorum-wizard` to run (alternatively, you can run `node build/index.js`)

## Contributing

GoQuorum Wizard is built on open source and we invite you to contribute enhancements.
Upon review, you will be required to complete a Contributor License Agreement (CLA) before we are able to merge.
If you have any questions about the contribution process, you can get
them answered by the [GoQuorum Slack community].

## Getting Help

Stuck at some step? Please join our [GoQuorum Slack community] for support.

[GoQuorum Slack community]: https://www.goquorum.com/slack-inviter
