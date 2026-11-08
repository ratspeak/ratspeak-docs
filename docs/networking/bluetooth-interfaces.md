---
sidebar_position: 3
---

# Bluetooth interfaces

Ratspeak 1.0.40 has two Bluetooth paths:

- **Bluetooth RNode** connects the app to a compatible LoRa radio. Bluetooth replaces the USB cable; the radio still sends over LoRa.
- **Bluetooth Peer** connects nearby Ratspeak devices directly, without a LoRa radio or shared Wi-Fi network.

A Bluetooth connection is a carrier interface. A Reticulum Link is an encrypted session carried over that interface; the two are not the same thing.

## BLE RNode bridge

The phone or computer acts as the BLE central and the RNode as the peripheral. Use firmware that exposes a compatible RNode BLE service. A supported Ratspeak handheld must be in **RNode** mode; Standalone is a separate messenger. Handheld 2.3.5 provides RNode images for T-Deck Plus, T-Pager and Cardputer Adv, not M9.

The bridge carries the RNode control/data stream. Radio frequency, preset and airtime settings still apply. BLE connection quality and buffering can affect performance even when the LoRa settings match a USB connection.

### Pairing an RNode

1. Put the radio into its firmware's pairing mode. Follow the board's instructions; button combinations differ.
2. Open **Network → Add LoRa Device → Bluetooth**. Grant Bluetooth/Nearby devices permission if the OS asks, then scan.
3. Select the radio and follow the pairing prompt. On Android 1.0.40, the six-digit RNode PIN is entered inside Ratspeak. Use the PIN shown by that radio while its pairing window is open.
4. Set the interface name, region and preset. Check the resulting connection status and radio settings.

An existing bond can be reused, but reconnects can still need pairing again if the radio or OS has lost its bond. Android supports one enabled BLE RNode at a time. Pause the current one before switching radios; Pause remains available during connection/reconnection.

On Android, a native application-scoped supervisor retains the configured connection across Activity recreation and retries when the radio returns. This does not override OS process termination or radio availability. Pause an old USB/BLE/TCP interface before moving the same radio to another connection; do not rely on automatic physical-device deduplication across transports or other applications.

When a radio is not ready, keep the exact failure text:

| Status | Next check |
|---|---|
| **PIN did not match** / **Pairing ran out of time** | Reopen pairing on the radio, choose **Retry Connection** and enter its current PIN. |
| **Radio not answering** | The connection did not produce the expected radio response. Check radio power and firmware; the app retries. |
| **Radio failed to start** | The radio reported a startup failure. Check its own display/log and hardware setup. |
| **Bluetooth link too small** | The negotiated BLE size cannot carry the required RNode response. Record phone OS, radio firmware and the error; try reconnecting. |

Releases since 1.0.37 include Android BLE setup and MTU negotiation fixes for ESP32 RNodes; 1.0.38 also fixes setup stalling at **Initializing RNode** on some older Android versions. Update an older app before diagnosing the same failure. If a bond appears stale, compare the OS and radio pairing state before resetting either one. Linux access depends on BlueZ policy; membership in a group named `bluetooth` is not a universal requirement.

### What goes over the wire

The bridge carries radio commands, Reticulum packets and their framing. Private LXMF payloads remain encrypted by Reticulum, but announces, control traffic and transport metadata are not all secret. Bluetooth pairing does not replace Reticulum identity encryption. See [Cryptography & Protection](../concepts/cryptography-and-protection.md).

## Bluetooth Peer

Bluetooth Peer uses BLE GATT to carry Reticulum traffic. Where the platform permits, it scans and advertises; a platform may support only the central/scanning role. The app binds a discovered peer identity from a directly received, signature-verified LXMF announce. It does not require manual Bluetooth bonding or a shared room password.

For implementation work, the primary service UUID is `a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d`. The app handles its service selection and fragmentation; normal setup does not require editing UUIDs.

### Enabling it

Open **Network** and select **+** beside **Bluetooth Peer**. Choose **10 minutes**, **30 minutes**, **60 minutes** or **Always on**. The app saves the choice and expiry; a timed session does not restart with a fresh interval when you reopen the app. Allow Bluetooth access and keep the app active while testing discovery; a saved preference cannot make a suspended or terminated process scan.

The interface can carry announces, links, resources and LXMF traffic. When a destination has several paths, Reticulum selects a route. An established Link stays on its selected interface: losing Bluetooth can close that Link, after which a new connection may find another path. Enabling LoRa at the same time does not guarantee interruption-free handoff.

### Desktop requirements

**Windows:** the peripheral/advertising implementation requires packaged-app Bluetooth capability. The public 1.0.40 release supplies EXE/MSI installers and no MSIX artifact. If advertising is unavailable, the implementation reports that condition and can continue central-only; the other device must advertise. Do not look for an MSIX download in that release or assume every Windows adapter supports the needed roles.

**Linux:** BlueZ must be running, the user must be allowed to access it, and the adapter must support LE advertising and a local GATT server. Some BlueZ configurations need experimental features for the server path. Use your distribution's guidance and the exact reported error before changing service configuration. Scanning success alone does not establish advertising support.

### Use cases vs. LoRa

Use Bluetooth Peer for nearby devices without a shared LAN. Use an RNode when the radio path is needed to reach beyond those devices. Both can be enabled, but test the actual route and failure behavior before depending on a mixed network.

## iOS support

Ratspeak on iOS supports BLE RNode and RNode TCP, and hides the USB radio option. Grant Bluetooth permission when requested. For initial discovery and troubleshooting, keep Ratspeak in the foreground; Core Bluetooth background rules do not guarantee continuous peer discovery or advertising while the app is suspended.

A radio's TCP endpoint must be reachable from the phone and should be protected by the local network/VPN or bridge authentication. See [RNode over TCP](lora-and-rnode.md#rnode-over-tcp).

## Range and limits

Range, throughput, latency and battery use depend on the adapters, placement, interference, OS and foreground/background state. Test with the devices close together first, then test the intended location. A connection can be slower or less reliable than its nominal BLE data rate suggests.

The bundled Bluetooth Peer implementation caps its peer set at **seven**. That is a software limit, not a promise that a phone can sustain seven useful simultaneous connections. Scanning, advertising and active traffic also consume power.

Use the Network status and traffic counters to narrow a failure. Zero traffic can mean no discovered peer, a missing permission, an unavailable advertising role, an incompatible radio service or another connection problem. Include those states and the exact error in a report; do not assume every scan failure is a stale bond.
