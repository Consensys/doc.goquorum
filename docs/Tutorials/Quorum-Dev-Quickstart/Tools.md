---
description: Supporting tools for Quorum Dev Quickstart
---

# Quorum Dev Quickstart Tools

When using the quickstart you are presented with a few options for monitoring:

* Default - which gives you Cakeshop, Prometheus, Grafana and the Alethio Block Explorer
* ELK - which gives you the same options as the `default` option but also adds in the the Elastic Cluster for logs
* Splunk - which gives you the same options as the `default` option but also adds in support for Splunk (logs and metrics)

## Cakeshop

![Cakeshop](../../images/console.png)

[Cakeshop](https://github.com/ConsenSys/cakeshop) is GoQuorum's block explorer and node monitoring tool.
You can use it to inspect blocks, deploy contracts, manage peers, and more.

Once you have selected this tool and started the network, it can be accessed at [http://localhost:8999](http://localhost:8999)

## Reporting Tool

![Reporting Tool](../../images/reporting2.png)

The [Reporting Tool](https://github.com/ConsenSys/quorum-reporting) provides convenient APIs for generating reports
about contracts deployed to your network. Once a contract is registered, it is easy to inspect the transactions related
to that contract and see how the state of the contract has changed over time.

Once you have selected this tool and started the network, the Reporting UI can be accessed at
[http://localhost:3000](http://localhost:3000). The RPC API itself runs at [http://localhost:4000](http://localhost:4000).

## Prometheus and Grafana

![Prometheus](../../images/prometheus.png)

[Prometheus](https://prometheus.io) is a third-party metrics and monitoring solution that works with GoQuorum.
With Prometheus collecting metrics, you will be able to generate graphs based on network data. Paired with
[Grafana](https://grafana.com/) you can install our [Quourm Dashboard](https://grafana.com/grafana/dashboards/14360)
to get a dashboard with an overview of your network with stats like blocks/transactions per second, cpu and memory
usage, network information, and more.

Promethus can be accesssed on [http://localhost:9090](http://localhost:9090) and Grafana can be accessed on
[http://localhost:3000](http://localhost:3000)

![Grafana system, network and chain infos screenshot](../../images/dashboard_grafana_1.png)

![Grafana detailed chain infos screenshot](../../images/dashboard_grafana_2.png)

## Elastic Stack

The [Elastic Stack](https://www.elastic.co/what-is/elk-stack) is an open-source log and metrics management platform.

The [Quorum Developer Quickstart](https://github.com/ConsenSys/quorum-dev-quickstart) provides example implementations
using ELK for log management. The [configuration](../../HowTo/Monitor/Elastic-Stack.md ) page shows you how to configure
the quickstart as well as any production nodes for log ingestion by the Elastic Stack

Once you have selected `elk` for monitoring, the Kibana logs can be accessed at
[http://localhost:5601](http://localhost:5601)

![Kibana](../../images/KibanaQuickstart.png)

## Splunk

![Splunk](../../images/splunk.png)

[Splunk](https://splunkbase.splunk.com/app/4866/#/details) is a third-party monitoring solution that works with
GoQuorum. If you add Splunk to your network, all logs will be directed to the local Splunk container. From there, you
can search through the logs, see network metrics, and create custom dashboards with the data that you are interested in.

Once you have selected this tool and started the network, the Splunk UI will be accessible at
[http://localhost:8000](http://localhost:8000)
