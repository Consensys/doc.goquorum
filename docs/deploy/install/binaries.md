---
description: GoQuorum and Tessera deployment via binaries
---

# Install binaries

You can install and use GoQuorum and Tessera using Docker containers, building
from source, or by downloading pre-built release binaries.

## Release binaries

The pre-compiled release binaries for GoQuorum and Tessera can be downloaded from the following links:

* [Quorum](https://github.com/ConsenSys/quorum/releases)
* [Tessera](https://github.com/ConsenSys/tessera/releases)

Once downloaded, add the binaries to the `PATH` environment variable to make them easier to run.

## Build from source

### GoQuorum

!!! note
    We recommend installing from official [containers](./docker-and-compose.md) or [release binaries](#release-binaries)
    rather than building from source. If you build from source, use Go version 1.15 or later.

1. Clone the repository and build the source:

    ```bash
    git clone https://github.com/Consensys/quorum.git
    ```

    ```bash
    cd quorum
    ```

    ```bash
    make all
    ```

    Binaries are placed in `$REPO_ROOT/build/bin`. Add that folder to the `PATH` environment variable to make
    `geth` and `bootnode` easier to run, or copy those binaries to a folder already in `PATH`, for
    example `/usr/local/bin`.

    !!! tip
        An easy way to supplement `PATH` is to add `PATH=$PATH:/path/to/repository/build/bin` to your `~/.bashrc`
        or `~/.bash_aliases` file.

1. Run the tests:

    ```bash
    make test
    ```

### Tessera

Follow the installation instructions on the [Tessera project page](https://github.com/ConsenSys/tessera).
