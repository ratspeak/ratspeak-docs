---
sidebar_position: 3
---

# Community mesh

A community mesh connects devices run by several people: a neighborhood, campus or local group. Agree on the radio settings, the role of each node and who maintains shared infrastructure before installing it.

For hardware, see [RNode and supported boards](../hardware/rnode-and-supported-boards.md). For interface setup, see [LoRa and RNode](../networking/lora-and-rnode.md).

## What this looks like

- **Endpoints** send and receive their own messages. These may be standalone handhelds or Ratspeak clients with an attached RNode.
- **Transport nodes** forward traffic for others. They need transport enabled, suitable interfaces and reliable power.
- **IP gateways** connect the local radio segment to another Reticulum segment over IP. An RNode's TCP radio-control socket is a different connection: it lets a host control that radio.

A radio network can operate without an IP gateway when the participants have working radio paths between them. An internet gateway extends its reach; it also adds bandwidth, availability and privacy decisions for the operators.

## Coordinating on radio settings

Record the actual values, not only a preset name:

| Setting | What operators must agree on |
|---|---|
| Frequency | A frequency supported by every radio and permitted at the deployment location |
| Bandwidth | The same LoRa channel bandwidth |
| Spreading factor | The same spreading factor; higher values consume more airtime |
| Coding rate | The same coding-rate setting |
| IFAC | Whether it is used, and the matching name, passphrase and any explicit size |

Preset names can differ between firmware or versions. Do not assume a label matches another device's parameters. The [LoRa guide](../networking/lora-and-rnode.md) lists the app's presets and configuration controls.

Choose settings from a measured coverage and traffic test. There is no universally best preset, and a regional band label is not permission to use every frequency or power level in that band. Check the local regulator's conditions, including antenna gain, radiated power and any airtime requirements.

## Setting up a gateway node

Install `rnsd-rs` and configure one working RNode interface plus an IP connection. This template uses explicit placeholders for the locally chosen radio values; replace them before starting the daemon:

```ini
[reticulum]
  enable_transport = yes
  share_instance = yes
  instance_control_socket = yes

[interfaces]
  [[Local LoRa]]
    type = RNodeInterface
    enabled = yes
    port = /dev/serial/by-id/REPLACE_WITH_RADIO
    frequency = REPLACE_WITH_FREQUENCY_HZ
    bandwidth = REPLACE_WITH_BANDWIDTH_HZ
    txpower = REPLACE_WITH_POWER_DBM
    spreadingfactor = REPLACE_WITH_SF
    codingrate = REPLACE_WITH_CR
    mode = gateway

  [[Backhaul]]
    type = TCPClientInterface
    enabled = yes
    target_host = backhaul.example.org
    target_port = 4242
    mode = boundary
```

Use a serial-enabled build for a USB RNode. For a radio reached through a TCP bridge, use its actual endpoint, such as `port = tcp://radio-lan-host:7633`, and confirm that the bridge supports RNode control. That socket is still the radio interface, not the wider-network backhaul.

Test the radio side and IP side separately, then test a message across the gateway in both directions. Use an explicit config directory and the service/diagnostic procedures in [Infrastructure and ops](infrastructure-and-ops.md).

## Boundary vs gateway mode

Interface modes affect how a transport handles announces and path requests at a segment boundary. In the example, **gateway** faces local radio clients and **boundary** faces the wider IP network. They do not enable transport, add bandwidth or guarantee a working route by themselves.

Use the pairing where those roles match the topology. Keep the initial deployment small enough to observe its announce queues and message latency before adding more links. See [Interface modes](../networking/interfaces-overview-and-design.md) for the detailed behavior.

## IFAC or open mesh

For an open community segment, publish the radio parameters and participation expectations. For a restricted interface, distribute the IFAC secret privately and configure matching values on all participants that need that interface.

IFAC does not hide radio transmissions or prevent interference. It also does not stop an authorized node from bridging to another interface. If the group needs a restricted network, agree on those bridges and on how shared secrets will be changed.

## Multiple gateways

Redundant gateways can improve availability when they offer usable alternative paths. They do not guarantee immediate failover: path discovery, stale routes, radio collisions and shared uplink or power failures still matter.

Test the loss of each gateway while sending messages. Also test loss of the internet backhaul while local radio communication remains available. Record how long recovery takes in your actual network.

The default announce bandwidth cap is 2%. In a standalone config, `announce_cap = 2` means two percent. It is an announce-traffic control, not a substitute for radio duty-cycle compliance or a cap on all transmitted traffic. Watch queues and measured airtime before changing it.

## Monitoring

On each gateway:

```bash
rnstatus-rs --config ~/.rsReticulum
rnpath-rs --config ~/.rsReticulum --table
```

Use the actual service config directory if different. For a particular destination, `rnpath-rs --config ~/.rsReticulum DESTINATION_HASH` requests or inspects its path. A path alone does not prove that an application is responding.

Keep a test contact on each segment and verify messages in both directions. If using Offline Inbox delivery, test storage and later retrieval separately. For active probes, use the full destination name and hash described in [Infrastructure and ops](infrastructure-and-ops.md#monitoring-with-rnstatus-rs-rnpath-rs-rnprobe-rs).
