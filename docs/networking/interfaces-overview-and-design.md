---
sidebar_position: 1
---

# Network interfaces

An interface connects Reticulum to a carrier such as TCP, Bluetooth or LoRa. A node can use several interfaces, subject to platform support and hardware limits. The routing layer can then reach destinations through different media.

This overview distinguishes Ratspeak 1.0.37 controls from standalone rsReticulum 1.3.0 configuration. A protocol driver existing in the library does not mean every app/platform exposes a setup form for it.

## What an interface is

An interface is the lowest layer in the Reticulum stack — the thing that
puts bytes on a wire (or radio, or socket) and reads them back. Above it,
[Reticulum](https://reticulum.network/manual/) handles routing, addressing,
crypto, and reliable delivery the same way regardless of the medium. The packet format is shared, but interface capacity, mode, loss and platform behavior affect which traffic can be carried and when.

## Interface families

The library’s interfaces fall into these families. Choose the carrier you actually need.

**IP-based.** TCP client/server for stable point-to-point Reticulum links over the
internet or LAN, UDP for low-overhead local broadcasts, AutoInterface for
zero-config LAN discovery (it speaks link-local IPv6 multicast and
auto-discovers peers on the same subnet using UDP ports 29716 for discovery
and 42671 for data), Backbone for high-throughput hub roles, and I2P for
IP-hiding transport through the I2P overlay. AutoInterface is useful for two devices on the same Wi-Fi network; TCP connects known hosts across the internet.

**Serial and packet-radio.** HDLC-framed Serial, KISS for compatible TNCs, AX.25-over-KISS, and Pipe for pumping bytes through any subprocess that
exposes stdin/stdout. These are how you bolt Reticulum onto existing radio
hardware that wasn't designed for it.

**RNode and LoRa.** RNode drives radio hardware directly over USB serial,
Android USB-OTG, Bluetooth LE, or a TCP-exposed RNode stream — long-range LoRa
links for low-bandwidth resilient meshes. RNodeMulti exposes multiple
sub-interfaces from one physical board.
RNode over TCP belongs in this family, not in the normal TCP Client family:
the TCP socket reaches the radio, while the Reticulum traffic still rides LoRa.

**Bluetooth.** BLE-RNode is the BLE bridge for BLE-equipped RNode hardware.
Bluetooth Peer is the phone-to-phone and laptop-to-phone transport that works
without a LoRa radio — useful when two devices are nearby and you don't
want to share a wifi network.

**Local sharing.** Local interfaces connect processes on the same host to an owning Reticulum instance. The app’s Android USB path is an RNode carrier, not a general replacement for desktop serial drivers.

For concrete setup details, use the interface-family pages:
[IP, LAN & I2P](../networking/ip-internet-and-i2p.md),
[LoRa Radio Interfaces](../networking/lora-and-rnode.md),
[Bluetooth Interfaces](../networking/bluetooth-interfaces.md), and
[Serial & Packet Radio](../networking/serial-and-packet-radio.md).

## Interface modes

An interface mode changes announce and path policy; it does not independently enable forwarding or provide access control. A standalone node also needs `enable_transport = yes` to forward for others. In the app, use Transport Mode deliberately.

| Mode | Purpose |
|---|---|
| `full` | General interface policy; the ordinary standalone default. |
| `access_point` | Limits relayed announces sent onto the interface; it is not simply another name for a TCP listener. |
| `roaming` | Restricts announce relaying for mobile/intermittent paths. The app uses it for newly added RNodes. |
| `gateway` | Allows a client-facing gateway to answer path requests through the node. |
| `boundary` | Restricts announce propagation at a network boundary. |

Mode selection can affect reachability, not just efficiency. Start with the documented topology in [Infrastructure & Ops](../deployment/infrastructure-and-ops.md) and verify path discovery in both directions before changing a working network.

## IFAC and announce caps

**IFAC (Interface Access Codes)** authenticates packets at an interface using matching network-name/passphrase settings. Use a secret passphrase for restricted access. It does not make radio energy or TCP connections invisible, replace a firewall, or replace recipient encryption.

Leave the IFAC size at its class default unless you need an explicit interoperable value. Standalone rsReticulum 1.3.0 interprets `ifac_size` in **bytes**; the app’s bundled 1.4.0 source uses explicit **bits** and asks for a choice when an old value is ambiguous. See [Configuration reference](../reference/configuration-reference.md) before moving a config between implementations or versions.

**Announce caps** budget announce traffic. In a config, `announce_cap = 2` means **2 percent**, not a fraction of `0.02`. The cap helps constrain routing traffic on slow links; it does not prevent interference, collisions or application congestion.

## Combining interfaces

A few patterns cover most real deployments.

**Laptop with LoRa dongle.** AutoInterface on the LAN for fast local
traffic, an RNode interface attached over USB, BLE, or TCP for long-range,
and optionally Bluetooth Peer so a nearby phone can talk to the laptop without
joining the wifi. The router decides per-destination which interface to
use; you don't manage that by hand.

**Transport server with many clients.** A TCP server or Backbone listener accepts connections. Enable transport when it should forward traffic. Select interface modes for the topology and use IFAC/firewall policy when access should be restricted. This transport role is separate from a Channels hub.

**Two-network bridge.** Use one interface per network on a transport node. Verify paths across the bridge in both directions. Interface modes and announce caps affect which announces cross it; a mode name alone does not guarantee that the slower segment is protected from excessive traffic. Check the topology and observed load before changing those policies.

**Mobile node.** AutoInterface for whichever LAN it's on right now, plus
Bluetooth Peer for ad-hoc nearby connections. `roaming` mode restricts which
announces this node relays onto an interface, a policy intended for intermittent
links. It does not send an upstream reachability-status signal.

Test each interface on its own before combining them. Separate interfaces can still contend for a radio, port or airtime, and a failed interface may require a new Reticulum Link rather than a seamless handoff.
