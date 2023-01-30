---
title: Ansible
description: GoQuorum deployment Ansible
sidebar_position: 2
---

GoQuorum can be installed using Ansible on a linux VM or OSX machine. Additionally, you can use the same role in conjunction with other orchestration tooling like Terraform.

## Ansible-Galaxy

You can use an [Ansible Galaxy](https://galaxy.ansible.com/consensys/goquorum) role to install, configure, and run GoQuorum

### Install the role

The first step is to include the role in the `requirements.yaml` file with any other roles that you use. For example the Prometheus exporter roles below publishes system metrics that can be scraped with Prometheus

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

Then install the role:

```bash
ansible-galaxy install --role-file requirements.yaml
```

### Use the role

After you [install the role](#install-the-role), create a file called `goquorum.yml` where you can define variables to configure GoQuorum. For example, you can configure the JSON-RPC service as follows:

```bash
# goquorum.yml
---
- hosts: localhost
  connection: local
  force_handlers: True

  roles:
  - role: consensys.goquorum
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

Run the file as follows:

```bash
ansible-playbook -v /path/to/goquorum.yml
```
