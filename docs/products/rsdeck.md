---
sidebar_position: 2
sidebar_label: T-Deck Plus
---

# Ratspeak for T-Deck Plus

The T-Deck Plus is supported by [Ratspeak Handheld](https://github.com/ratspeak/ratspeak-handheld),
the shared successor to rsDeck, rsPager, and rsCardputer. The first beta covers
T-Deck Plus and [T-Pager](./rspager.md); Cardputer Adv is in testing.
The full image boots a small launcher that can start either mode:

- **Standalone** — on-device Reticulum/LXMF messaging over LoRa, with local identity, contacts, messages, radio settings, Wi-Fi options, GPS time sync, and SD-card storage support.
- **RNode** — a host-controlled RNode-style radio for Ratspeak, Sideband, or another Reticulum client over BLE or USB serial.

For the smaller Cardputer-based handheld and its existing firmware, see
[rsCardputer](./rscardputer.md). Both speak Reticulum/LXMF and can exchange
messages when their radio settings and reachable paths match.

## Hardware

The [LilyGO T-Deck Plus](https://www.lilygo.cc/products/t-deck-plus) has an ESP32-S3,
320×240 display, QWERTY keyboard, trackball, integrated LoRa radio, battery, and
GPS. Choose hardware and an antenna suited to the frequency band you will use.
An SD card is optional for normal messaging.

## Get the firmware on your device

Use `rsdeck-full.zip` from
[Ratspeak Handheld releases](https://github.com/ratspeak/ratspeak-handheld/releases)
for a fresh installation. The [web flasher](https://ratspeak.org/download.html)
accepts the complete ZIP through **Build your own**; check that a board preset
shows **Ratspeak Handheld** if selecting an automatic download.

**Back up your identity and data first.** Full, Standalone, and RNode ZIPs are
factory images, not data-preserving updates, even with Full Erase off. See the
[backup instructions](../hardware/flashing-firmware.md#before-flashing) before
replacing an existing installation.

If you'd rather build from source, see the bottom of this page. For recovery mode, serial verification, and post-flash checks, see [Flashing Firmware](../hardware/flashing-firmware.md).

## Modes

Use the full image to switch modes on-device. Choose **Standalone** for messaging
on the T-Deck, or **RNode** to connect it to a host client. Standalone-only and
RNode-only packages install a single mode. Bare app binaries require a compatible
external launcher or the correct application slot; they are not full images.

## First boot

On a fresh installation, Standalone mode creates a Reticulum identity and asks
for a display name and timezone. Share your Ratspeak contact QR to include your
name, address, identity, and public key. **Legacy** shows an LXMF-address-only QR.

## What you can do on it

Five tabs along the bottom, navigated with touch or the trackball:

- **Home** — identity and device controls. Select **Announce** to advertise your
  identity to reachable peers.
- **Chats** — your inbox. Open a thread to read or reply.
- **Contacts** — saved peers. Select a contact to open its chat.
- **Peers** — discovered messaging peers. Open one to **Save Contact** or **Message**.
- **Settings** — radio config, network mode, region, and device options.

To remove a saved contact, focus it with the trackball, hold the trackball button,
then press Enter to confirm. Esc keeps the contact.

## LoRa presets

The default radio preset is **Long Fast**. Match the frequency and preset with
the peers you want to reach; a shared preset name alone does not establish a
connection. Radio controls are in Settings.

For the full preset table and tuning guidance, see [LoRa Radio Interfaces](../networking/lora-and-rnode.md).

## Regions

Choose a radio region supported by your hardware and permitted where you use it.
A timezone setting does not change the radio's hardware band or automatically
select a legal frequency. Check the region and frequency before transmitting.

## Wi-Fi bridging

Choose **Client** or **Hotspot** in Settings; the two modes are mutually exclusive.

**Client** joins an existing Wi-Fi network. Configure a TCP peer to reach a remote
Reticulum network; no public server is selected automatically.

**Hotspot** creates a local Wi-Fi network with a Reticulum TCP bridge for a nearby
host client. It provides a path through the handheld's radio, not an Internet
connection for the connected computer.

## Build from source

Use the [shared build instructions](../hardware/flashing-firmware.md#build-from-source)
with `DEVICE=tdeck`. The Reticulum/LXMF core is Rust; normal builds use the
included libraries, with C++ hardware and user-interface code.

## Legacy rsDeck

Older microReticulum-based releases and their source remain in
[`ratspeak/rsDeck`](https://github.com/ratspeak/rsDeck). The package names retain
the `rsdeck-` prefix, so check the repository and version rather than the filename
alone when choosing an image.

## License

The standalone firmware and launcher are AGPL-3.0-or-later; bundled RNode firmware
retains its GPLv3 license. See the repository's
[third-party notices](https://github.com/ratspeak/ratspeak-handheld/blob/main/THIRD_PARTY_NOTICES.md).
