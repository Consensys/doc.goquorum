---
description: GoQuorum and Tessera deployment via binaries
---

GoQuorum and [Tessera](https://docs.tessera.consensys.net) can be installed and used as Docker containers, by building from source,
or by downloading pre-built release binaries.

## As release binaries

The pre-compiled release binaries for GoQuorum and Tessera can be downloaded from the following links:

* [Quorum](https://github.com/ConsenSys/quorum/releases)
* [Tessera](https://github.com/ConsenSys/tessera/releases)

Once downloaded, add the binaries to `PATH` to make them easily invokable

## From source

### GoQuorum

!!! note

    We recommend installing from official [containers](./Docker-and-compose.md) or [release binaries](#as-release-binaries)
    rather than building from source. If you build from source, use Go version 1.15 or later.

1. Clone the repository and build the source:

    ```bash
    git clone https://github.com/Consensys/quorum.git
    cd quorum
    make all
    ```

    Binaries are placed in `$REPO_ROOT/build/bin`. Add that folder to `PATH` to make `geth` and `bootnode` easily invokable, or copy those binaries to a folder already in `PATH`, for example `/usr/local/bin`.

    An easy way to supplement `PATH` is to add `PATH=$PATH:/path/to/repository/build/bin` to your `~/.bashrc` or `~/.bash_aliases` file.

1. Run the tests:

    ```bash
    make test
    ```

### Tessera

Follow the installation instructions on the [Tessera project page](https://github.com/ConsenSys/tessera).
