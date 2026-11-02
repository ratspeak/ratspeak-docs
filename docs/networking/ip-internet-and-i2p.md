---
sidebar_position: 5
---

# IP, LAN and I2P

Use TCP for a known host, AutoInterface for local discovery, or I2P when you have an I2P router and want an overlay path. The examples below target **standalone rsReticulum 1.3.0**. Add them under `[interfaces]`; configure app-managed interfaces through Ratspeak’s Network controls instead.

A listener alone does not forward for other nodes. Enable transport deliberately when building infrastructure, and check [Configuration reference](../reference/configuration-reference.md) for paths and defaults. The [Reticulum manual](https://reticulum.network/manual/interfaces.html) describes the Python implementation; version-specific Rust behavior can differ.

## TCPClientInterface

A simple outbound TCP socket — what you use to dial a public Ratspeak server, another public hub, or a friend's transport node.

```ini
[[Emerald]]
  type = TCPClientInterface
  enabled = yes
  target_host = 2.ratspeak.org
  target_port = 4242
```

`target_host` and `target_port` are required. Both ends must agree on framing: ordinary Reticulum TCP uses HDLC-style frames; set `kiss_framing = yes` only when the remote endpoint expects KISS. The client retries a lost connection, subject to its reconnect settings.

Do not rely on `i2p_tunneled` in a standalone 1.3.0 `TCPClientInterface`: that release’s ordinary TCP config factory does not apply it. The app’s bundled 1.4.0 source does. Use `I2PInterface` for the standalone I2P setup below.

## TCPServerInterface

Accepts inbound TCP connections. Run this on a host with a routable address (or behind a port-forward).

```ini
[[Inbound]]
  type = TCPServerInterface
  enabled = yes
  listen_ip = 0.0.0.0
  listen_port = 4242
  mode = gateway
```

`listen_ip` defaults to `0.0.0.0` (all IPv4 interfaces). Choose the intended bind address and allow the port through any relevant firewall/NAT. IPv6 availability and dual-stack behavior depend on the host; verify the address actually listening rather than assuming `::` also accepts IPv4.

`mode = gateway` is a topology choice for a client-facing gateway. It does not turn on transport forwarding by itself. See [Network interfaces](interfaces-overview-and-design.md#interface-modes) before changing modes.

## AutoInterface — zero-config LAN

AutoInterface discovers compatible peers using IPv6 multicast and carries their packets over UDP. It does not need a manually entered peer list or a DHCP lease, but link-local IPv6 and local peer traffic must work.

```ini
[[LAN]]
  type = AutoInterface
  enabled = yes
  group_id = home
```

Discovery rides UDP **29716**, data rides UDP **42671** — both must be open on the host firewall. Nodes only see each other if their `group_id` matches; different group names separate discovery groups, but are not secret access credentials. `discovery_scope` (default `link`) accepts `link`, `admin`, `site`, `organisation`, or `global` and selects the IPv6 multicast scope. Broader scopes also require suitable multicast routing; changing this value does not create it. `discovery_port` and `data_port` override the defaults if those ports are in use. `devices` whitelists specific NICs (`eth0`, `wlan0`); `ignored_devices` blacklists them.

Failure modes are predictable: managed switches that drop multicast, hotel/captive-portal Wi-Fi that isolates clients, and VPNs that do not carry the required IPv6 multicast can prevent discovery. On those networks, fall back to TCP.

## BackboneInterface — high-throughput WAN

Backbone is HDLC-framed TCP with connection management intended for infrastructure. It can communicate with ordinary Reticulum TCP peers using the same framing. Capacity depends on hardware, OS limits and traffic; there is no fixed supported peer count in this guide. It runs on **Linux, macOS, and Windows desktop**; Linux additionally gets `TCP_USER_TIMEOUT` for fast detection of stuck connections. Mobile builds (iOS, Android) hide Backbone in the Ratspeak UI for now — use `TCPServerInterface` / `TCPClientInterface` there.

```ini
[[Backbone]]
  type = BackboneInterface
  enabled = yes
  listen_on = 0.0.0.0
  port = 4242
  mode = gateway
```

`listen_on` and `port` set the bind address. `target_host` (or its alias `remote`) selects client mode instead of listening; supply the host separately from `port`. Use another interface block when you need both a listener and an outbound connection. Use Backbone when you're a transport node fanning out to many clients, or when TCP is measurably the bottleneck. In the Ratspeak desktop UI, Backbone surfaces as an opt-in toggle on the standard TCP connect / host modals rather than a separate flow.

## UDPInterface

UDP carries packets without a TCP session. This example sends to a known peer; its receiver needs a matching listener and a return path.

```ini
[[Peer over UDP]]
  type = UDPInterface
  enabled = yes
  listen_ip = 0.0.0.0
  listen_port = 4242
  forward_ip = 10.0.0.5
  forward_port = 4242
```

Do not turn this into a multicast recipe by changing both addresses: multicast group membership and interface selection need their own supported implementation. Use AutoInterface for the LAN discovery/multicast path. With no forward address, this standalone UDP interface does not transmit outgoing packets.

## I2PInterface — IP-hiding transport

`I2PInterface` carries Reticulum through an I2P SAM session. It addresses an I2P destination instead of connecting directly to the remote node’s clearnet IP. Private LXMF encryption still applies above that carrier; I2P does not hide activity from every observer. Start an I2P router with SAM enabled first; the default endpoint is `127.0.0.1:7656`.

```ini
[[I2P]]
  type = I2PInterface
  enabled = yes
  connectable = yes
  # Add real peer addresses supplied by their operators:
  # peers = PEER_ADDRESS.b32.i2p
```

`connectable = yes` accepts inbound — the interface prints its own `.b32.i2p` address on first run, which is what you share with peers. `peers` is a comma-separated list of `.b32.i2p` addresses to dial. `i2p_sam_host` and `i2p_sam_port` select a different SAM endpoint. Keep that control API protected; it is not a public Reticulum listener.

Tunnel startup and performance depend on the I2P router and its peers. Confirm that SAM is reachable and the tunnel establishes before debugging Reticulum path discovery. Offline Inbox can help with asynchronous messaging, but cannot remove the underlying latency or guarantee availability.

## IFAC — per-interface authentication

IFAC can restrict an interface to peers with matching credentials. Set `network_name` and `passphrase` on every node that should join — packets without a matching IFAC signature are dropped at ingress before the protocol sees them.

```ini
[[Private TCP]]
  type = TCPServerInterface
  enabled = yes
  listen_ip = 0.0.0.0
  listen_port = 4242
  network_name = our-mesh
  passphrase = REPLACE_WITH_YOUR_SHARED_SECRET
```

Replace the example passphrase on every participating node; do not use the published placeholder as a secret. Leave `ifac_size` unset unless you need an explicit value. In standalone rsReticulum 1.3.0 it is **bytes** (1–64); the Python manual and the app’s bundled 1.4.0 configuration use bits, with explicit migration handling in the app. Do not copy a numeric size between these versions without converting it.

IFAC authenticates interface packets. It is not end-to-end encryption, and it does not hide a TCP listener or protect every service on the host. Private LXMF payloads remain encrypted above it.

## Public Ratspeak TCP servers

A reachable public TCP server can supply a path to other destinations it knows; it does not guarantee reachability to every Reticulum user. In the app, the public Ratspeak servers are labelled by friendly names:

| Name | Endpoint |
|---|---|
| Ruby | `1.ratspeak.org:4141` |
| Emerald | `2.ratspeak.org:4242` |
| Diamond | `3.ratspeak.org:4343` |

The app also recognizes the legacy endpoint `rns.ratspeak.org:4242` as Emerald.

In the app, "Official" means the server is managed by Ratspeak; "Unofficial" means it is operated by a third party.

Other public Reticulum hubs are independent of Ratspeak:

- For wider Reticulum connectivity, use the current Reticulum connect/backbone information at [reticulum.network/connect.html](https://reticulum.network/connect.html) or a community directory you trust.

For a network you depend on, choose infrastructure and alternate paths you can test and maintain. A public server may be unavailable. See [Infrastructure & Ops](../deployment/infrastructure-and-ops.md) for operating your own transport node.
