---
title: GoQuorum profiling
description: Profiling GoQuorum
sidebar_position: 13
---

# Quorum profiling

[Quorum profiling](https://github.com/ConsenSys/quorum-profiling) is a custom toolset used to benchmark transaction throughput and network statistics on any existing Quorum network using the [JMeter](https://github.com/ConsenSys/quorum-profiling/tree/master/jmeter-test) and [TPS monitoring](https://github.com/ConsenSys/quorum-profiling/tree/master/tps-monitor) tool profiles. Alternatively, it could also be used to spin up an entire GoQuorum network from scratch in AWS and benchmark the network for TPS, CPU/Memory usage. The various scenarios of usage is explained [here](https://github.com/ConsenSys/quorum-profiling)

## Metrics visualization

Key Components:

- [Telegraf](https://hub.docker.com/_/telegraf) - plugin-driven server agent for collecting and reporting metrics. Refer to [GoQuorum profiling config](https://github.com/ConsenSys/quorum-profiling/blob/master/scripts/telegraf/telegraf.conf).
- [JMeter](https://jmeter.apache.org) - Load testing tool. The detail of various profiles and test execution, refer [here](https://github.com/ConsenSys/quorum-profiling/tree/master/jmeter-test)
- [TPS Monitor](https://github.com/ConsenSys/quorum-profiling/tree/master/tps-monitor) - Custom "go" project to monitor transactions per second, total transactions and total blocks in Quorum network.
- [InfluxDB](https://www.influxdata.com/time-series-platform/influxdb/) - Open source time series database for monitoring metrics and events, providing real-time visibility.
- [Prometheus](https://prometheus.io) - similar to influx Prometheus records real-time metrics in a time series database built using a HTTP "pull" model, with flexible queries and real-time alerting
- [Grafana](https://grafana.com) - Monitoring tool for metrics and logs consolidation

The tool executes the stress test profile selected and then collects the following metrics:

- CPU/Memory usage for both `Quorum` & `tessera`
- Transaction & Block count
- Transaction processing speed
- `Jmeter` test execution statistics

These metrics could be configured to be stored in an InfluxDB or Prometheus for further analysis. Both databases integrate well with the open source dashboard editor Grafana to allow for easy creation of dashboards to visualize the data being captured from the profiling tool. Sample dashboards below:

## Sample network dashboard

![Quorum network dashboard](../images/quorumDashboard.jpeg)

## Sample JMeter dashboard

![JMeter dashboard](../images/jmeterDashboard.jpeg)
