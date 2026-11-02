---
sidebar_position: 1
---

# Choosing your setup

Choose a device to run Ratspeak and a connection to other Reticulum users. A phone or computer can use a local network, an internet connection, Bluetooth Peer, or an attached radio. A supported handheld can run its own messenger.

## Pick a scenario

| You want to… | Start with |
|---|---|
| Send messages from a computer | Ratspeak for macOS, Linux, or Windows |
| Send messages from a phone or tablet | Ratspeak for Android, or the iOS TestFlight beta |
| Reach peers through the internet | Ratspeak with an Internet/TCP connection |
| Add LoRa to a phone or computer | Ratspeak and compatible RNode hardware |
| Carry a self-contained LoRa messenger | Ratspeak Handheld on a supported device |
| Run a transport or propagation service | `rnsd-rs`, with `lxmd-rs` for LXMF propagation |

## Just the Ratspeak desktop app

[Install Ratspeak](install-and-platform-setup.md), create or restore an identity, then enable a connection in the **Network** tab. A fresh install has no interfaces enabled. For two devices on the same Wi-Fi or LAN, enable **Local Network** on both. To reach peers through the internet, add an **Internet/TCP** connection.

The [first-session guide](your-first-session.md) walks through connecting and sending a message. Installing a separate Reticulum daemon is optional; the app includes its own networking runtime.

## Ratspeak desktop + a TCP server {#ratspeak-desktop--a-tcp-hub}

In **Network → Internet/TCP**, choose a server from the **Public** list or enter a host and port under **Custom**. You can use an existing public server or one you operate yourself. The server provides a connection to the Reticulum destinations it can reach; it does not make every user reachable.

See [IP, LAN and I2P](../networking/ip-internet-and-i2p.md) for connection details and [Infrastructure and ops](../deployment/infrastructure-and-ops.md) for hosting.

## Ratspeak mobile

Android installs from an APK; iPhone and iPad use the [public TestFlight beta](install-and-platform-setup.md#ios).

For radio connections, Android supports USB-OTG, Bluetooth LE and RNode over TCP where the device and radio support them. On iOS, use a compatible Bluetooth RNode or a reachable RNode TCP bridge. General USB serial radios are not available through the iOS app.

Bluetooth Peer connects compatible nearby Ratspeak devices without a radio or Wi-Fi router. Its capabilities vary by platform; check [Bluetooth interfaces](../networking/bluetooth-interfaces.md) before relying on it for your setup.

## Ratspeak + an RNode or RNode-mode handheld

An RNode supplies the LoRa radio while Ratspeak on your phone or computer provides the messaging interface. Connect it over USB, Bluetooth LE, or a TCP bridge, depending on the radio firmware and host platform.

T-Deck Plus, T-Pager and Cardputer Adv can also run the RNode mode supplied with Ratspeak Handheld. They must be in that mode when another app controls their radio. See [LoRa and RNode](../networking/lora-and-rnode.md) for configuration and [supported boards](../hardware/rnode-and-supported-boards.md) for hardware details.

## Standalone handhelds {#just-an-rsdeck-or-rscardputer}

Ratspeak Handheld is the shared firmware for these devices:

| Device | Available modes |
|---|---|
| LilyGO T-Deck Plus | Standalone messenger and RNode |
| LilyGO T-Pager with SX1262 | Standalone messenger and RNode |
| M5Stack Cardputer Adv | Standalone messenger and RNode; Cap LoRa-1262 required for LoRa |
| Elecrow ThinkNode M9 | Standalone messenger |

The firmware uses rsReticulumLite and rsLXMFLite. Older material may call the device builds rsDeck, rsPager or rsCardputer; current downloads come from the [Ratspeak Handheld release](https://github.com/ratspeak/ratspeak-handheld/releases).

Use the [flashing guide](../hardware/flashing-firmware.md) to choose the correct image, then the [handheld guide](../hardware/handheld-guide.md) for controls, messaging and storage. Hardware, input methods and features vary by device.

## Self-hosted transport node

Run `rnsd-rs` when you want to operate a Reticulum transport node. Configure transport mode and the interfaces it should connect; starting a daemon alone does not establish those connections. Add `lxmd-rs` in propagation-node mode if you also want to store messages for later pickup.

These services are useful for network operators and are not prerequisites for using the Ratspeak app. See [Infrastructure and ops](../deployment/infrastructure-and-ops.md).

## What you actually need

For messaging, you need an identity, a working interface and a route to the recipient or an applicable propagation node. Local-network and radio connections can work without internet access. Internet TCP servers require an internet connection. Ratspeak messaging does not require a central account or a public IP address.

Continue with [Install and platform setup](install-and-platform-setup.md) or [Your first session](your-first-session.md).
