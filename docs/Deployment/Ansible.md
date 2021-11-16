---
description: GoQuorum deployment Ansible
---

GoQuorum can be installed using Ansible on a linux VM or OSX machine. Additionally, you can use the same role in conjuction
with other orchestration tooling like Terraform.

## Ansible

You can use an [Ansible Galaxy](https://galaxy.ansible.com/consensys/goquorum) role which will install, configure and run
GoQuourum

### Install the role

The first step to include the role in a `requirements.yaml` with any other roles that you use. For example the prometheus
exporter roles below will publish system metrics that can be scraped with prometheus

```bash
# requirements.yaml
---
roles:
  - src: consensys.goquorum
    version: 0.1.0
  - src: undergreen.prometheus-node-exporter
    version: v1.4.0
  - src: undergreen.prometheus-exporters-common
    version: v1.2.0

```

Then install the role via:

```bash
ansible-galaxy install --role-file requirements.yaml
```

### Use the role

Once installed, create a file called `goquorum.yml` where you can pass vars that configure GoQuorum, for example you could
configure the JSON RPC service like the example below

```bash
# goquorum.yml
---
- hosts: localhost
  connection: local
  force_handlers: True

  roles:
  - role: ansible-role-goquorum
    vars:
      goquorum_version: vX.Y.Z
      goquorum_consensus_algorithm: "istanbul"
      goquorum_genesis_path: "/path/to/genesis_file"
      goquorum_http_enabled: true
      goquorum_http_host: 127.0.0.1
      goquorum_http_port: 8545
      goquorum_http_api: ["admin","db","eth","debug","miner","net","web3","quorum","ibft"]
      goquorum_http_cors_origins: ["all"]
      goquorum_http_virtual_hosts: ["all"]

```
