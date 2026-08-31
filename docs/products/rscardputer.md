---
sidebar_position: 3
---

# rsCardputer

Cardputer Adv support in [Ratspeak Handheld](https://github.com/ratspeak/ratspeak-handheld)
is in testing. The released firmware described below remains **rsCardputer**;
the web flasher's Cardputer preset continues to use those legacy releases.

rsCardputer is the firmware family for the M5Stack Cardputer Adv with the Cap
LoRa-1262 add-on. It replaces the older standalone Cardputer firmware and adds a
launcher that can boot either mode from the same install:

- **Standalone** — on-device Ratspeak/LXMF messaging over LoRa, with local
  identity, contacts, messages, radio settings, Wi-Fi options, GPS time sync,
  and SD-card storage support.
- **RNode** — a host-controlled RNode-style radio for Ratspeak, Sideband, or
  another Reticulum client over BLE or USB serial.

Use the full rsCardputer image when you want to switch modes on-device. Split
Standalone and RNode images are also published for recovery, testing, or
M5Launcher users who already boot apps from SD.

## Hardware

The supported device is M5Stack's Cardputer Adv: an ESP32-S3 handheld with a
240 by 135 display, micro keyboard, internal battery, microSD support, and the
separate Cap LoRa-1262 SX1262 radio module.

## Cardputer and T-Deck Plus

Both are standalone Reticulum/LXMF handhelds when used in their native messaging
modes.

- **[T-Deck Plus](./rsdeck.md)** has the larger screen, full keyboard,
  integrated radio, and more memory headroom.
- **rsCardputer** is smaller and modular, with the LoRa radio supplied by the
  M5Stack cap. It can also reboot into RNode mode when you want the Cardputer to
  behave like a radio peripheral for another client.

## Flash it

The fastest path is the [web flasher](https://ratspeak.org/download.html).
With the side power switch off, hold **G0** while applying USB power, then release
it to enter download mode. Pick Cardputer Adv and check the firmware version.

Back up your identity and data before flashing. Full, Standalone, and RNode ZIPs
are factory images; leaving **Full Erase** off does not guarantee preservation.
Follow the selected release's upgrade instructions for an existing installation.

For recovery mode, serial verification, and post-flash checks, see
[Flashing Firmware](../hardware/flashing-firmware.md).

## Modes

The full image boots to a small launcher. Choose **Standalone** for local
messaging on the Cardputer itself, or **RNode** to pair/connect it to a host
client.

Standalone first boot asks for timezone and display name, then generates a local
Reticulum identity. RNode mode self-provisions its RNode configuration and
firmware hash on first boot.

## LoRa presets

Eight presets cover the useful range from short, fast local links to slower
long-haul links. Standalone mode exposes them under Settings -> Radio. RNode
mode accepts normal RNode radio profile changes from the host client.

For the full preset table and tuning guidance, see
[LoRa Radio Interfaces](../networking/lora-and-rnode.md).

## Build from source

These commands build the legacy rsCardputer firmware:

```bash
git clone https://github.com/ratspeak/rsCardputer
cd rsCardputer
pip install platformio
make prep-cardputer_adv
make package
make flash port=/dev/cu.usbmodem3101
```

Release artifacts include the full launcher image, split Standalone and RNode
web-flasher zips, and M5Launcher app binaries.

For experimental unified builds, use the
[Ratspeak Handheld build instructions](../hardware/flashing-firmware.md#build-from-source)
with `DEVICE=cardputer`. These can be uploaded explicitly through **Build your
own**; they are not part of the first beta's automatic downloads.

## License

The rsCardputer launcher, Standalone mode, partition tables, and packaging tools
are AGPL-3.0-or-later. The bundled upstream-derived RNode firmware is GPL-3.0.
