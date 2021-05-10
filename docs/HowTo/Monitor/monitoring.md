# Monitoring Quorum Node

This page explains how to configure a GoQuorum node to provide enhanced metrics and enable monitoring.

You require GoQuorum at minimum version 2.6.0 upgraded to `geth` version 1.9.7. The upgrade adds the ability 
to collect enhanced metrics which can then be used in different visualization tools for node monitoring.
Refer to [`geth` v1.9.0](https://blog.ethereum.org/2019/07/10/geth-v1-9-0/) for complete list of added features.


## Metrics Collection

Node monitoring requires that nodes collect metrics and expose them to the monitoring tools that the user chooses.
GoQuorum node can collect and expose the metric data in the following formats:
- [ExpVars](https://golang.org/pkg/expvar/) which is the standard Go interface to instrument and expose metrics via HTTP,
- [Prometheus](https://prometheus.io/) which is an alternative to ExpVars, and generally the preferred option because of the flexibility it allows so users can 'pull' or 'push' metrics as well as having a consistent metric format across languages
- [InfluxDB](https://www.influxdata.com/products/influxdb-overview/) which is similar to the avobe but metrics are only 'pushed' to Influx.

Use GoQuorum `--metrics`, `--pprof`, `--pprofaddr` and `pprofport` (where applicable, the default port is 6060) [command line options](#command-line-options) and set the scraper endpoints to:

* In ExpVar format at `http://127.0.0.1:6060/debug/metrics`

* In Prometheus format at `http://127.0.0.1:6060/debug/metrics/prometheus`

Use GoQuorum [`--metric.influxdb` command line option and associated flags](#command-line-options) to push the metrics data to [InfluxDB](https://www.influxdata.com/products/influxdb-overview/).

### Command line options

```text
LOGGING AND DEBUGGING OPTIONS:
  --pprof                             Enable the pprof HTTP server
  --pprofaddr value                   pprof HTTP server listening interface (default: "127.0.0.1")
  --pprofport value                   pprof HTTP server listening port (default: 6060)

METRICS AND STATS OPTIONS:
  --metrics                           Enable metrics collection and reporting
  --metrics.expensive                 Enable expensive metrics collection and reporting
  --metrics.influxdb                  Enable metrics export/push to an external InfluxDB database
  --metrics.influxdb.endpoint value   InfluxDB API endpoint to report metrics to (default: "http://localhost:8086")
  --metrics.influxdb.database value   InfluxDB database name to push reported metrics to (default: "geth")
  --metrics.influxdb.username value   Username to authorize access to the database (default: "test")
  --metrics.influxdb.password value   Password to authorize access to the database (default: "test")
  --metrics.influxdb.tags value       Comma-separated InfluxDB tags (key/values) attached to all measurements (default: "host=localhost")
```

!!!warning
    Do not expose `pprof` HTTP end point to public Internet!
    This end point can be used to trigger resource intensive operations.

## Metrics Visualization

GoQuorum metrics data can be visualised with many dashboard tools. We provide a [goQuourm dashboard](https://grafana.com/grafana/dashboards/14360) that can be imported into your instance of Grafana.The following screenshots are from [Grafana](https://grafana.com/).

If using the [Dev Quickstart](https://docs.goquorum.consensys.net/en/stable/Tutorials/Quorum-Dev-Quickstart/) the dashboard is preinstalled in the Grafana container and the example shows you how to configure your nodes to use Prometheus to send metrics to Grafana.

![Grafana system, network and chain infos screenshot](../../images/dashboard_grafana_1.png)

![Grafana detailed chain infos screenshot](../../images/dashboard_grafana_2.png)

!!!note
    The above dashboards are inspired by [`karalabe/geth-prometheus` project](https://github.com/karalabe/geth-prometheus).
