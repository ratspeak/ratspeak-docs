---
sidebar_position: 2.5
sidebar_label: T-Pager
---

# Ratspeak for T-Pager

The LilyGO T-Pager runs [Ratspeak Handheld](https://github.com/ratspeak/ratspeak-handheld),
alongside [T-Deck Plus](./rsdeck.md) in the first beta. It replaces the separate
rsPager firmware with the shared Rust Reticulum/LXMF core.

## Hardware

Use the SX1262 version of the
[T-Pager / T-LoRa-Pager](https://wiki.lilygo.cc/products/t-lora-series/t-lora-pager/).
It has an ESP32-S3, 480×222 display, QWERTY keyboard, scroll encoder, LoRa radio,
and GPS. Other radio variants are not interchangeable firmware targets. Match
your antenna and radio configuration to the hardware and frequency band.

An SD card is optional for normal messaging. The firmware can store identity,
settings, and messages on internal flash.

## Install

Use `rspager-full.zip` from
[Ratspeak Handheld releases](https://github.com/ratspeak/ratspeak-handheld/releases)
for a fresh installation. Upload it through **Build your own** on the
[web flasher](https://ratspeak.org/download.html), or select the T-Pager preset
when it shows **Ratspeak Handheld**.

**Back up your identity and data first.** Factory packages can replace saved
data even with Full Erase off. See the
[backup instructions](../hardware/flashing-firmware.md#before-flashing) before
replacing an existing installation.

Hold **BOOT**, tap **RST**, then release BOOT to enter download mode. Reset the
device manually after writing completes. See [Flashing firmware](../hardware/flashing-firmware.md)
for the full procedure and source builds; use `DEVICE=tpager`.

## Modes and controls

The full package starts a launcher with two choices:

- **Standalone** — on-device LXMF messaging over LoRa or Wi-Fi.
- **RNode** — a host-controlled radio for Ratspeak or another Reticulum client.

Use the keyboard and scroll encoder to navigate; click the encoder or press
Enter to select. In Standalone mode, a short **BOOT** press sleeps or wakes the
screen. Holding BOOT while the screen is on opens the power-off confirmation; a six-second hold forces
power off. **PWR** powers the device on from shutdown; **RST** resets it.
Prefer the confirmed shutdown over a forced power-off when saving data.

## Legacy rsPager

Previous releases and their build instructions remain in
[`ratspeak/rsPager`](https://github.com/ratspeak/rsPager). Both firmware families
use `rspager-` filenames, so check the source repository and release version.
