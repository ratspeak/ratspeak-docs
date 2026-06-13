---
sidebar_position: 2
---

# rsDeck

rsDeck is the dual-mode firmware for the LilyGO T-Deck Plus. The full image boots a small launcher that can start either mode:

- **Standalone** — on-device Reticulum/LXMF messaging over LoRa, with local identity, contacts, messages, radio settings, Wi-Fi options, GPS time sync, and SD-card storage support.
- **RNode** — a host-controlled RNode-style radio for Ratspeak, Sideband, or another Reticulum client over BLE or USB serial.

For the smaller Cardputer-based handheld, see [rsCardputer](../products/rscardputer.md). Both devices speak the same Reticulum/LXMF protocols and can see each other when their radio settings and reachable paths match.

## Hardware

You need one [LilyGO T-Deck Plus](https://www.lilygo.cc/products/t-deck-plus). It's an ESP32-S3 handheld with a 320×240 IPS display, a backlit QWERTY thumb keyboard, a four-direction trackball, an integrated SX1262 LoRa transceiver, an internal battery, and an optional UBlox GPS module for time sync. That's the whole bill of materials. Pick up the 915 MHz variant for the Americas/Australia or the 868 MHz variant for Europe — the firmware is the same image either way.

## Get the firmware on your device

The easy path is the [web flasher](https://ratspeak.org/download.html). Plug the T-Deck into your computer with a USB-C cable, hold the trackball down while you power it on (this puts the ESP32 into download mode), and follow the prompts in the browser. Two minutes, no toolchain.

If you'd rather build from source, see the bottom of this page. For recovery mode, serial verification, and post-flash checks, see [Flashing Firmware](../hardware/flashing-firmware.md).

## Modes

Use the full rsDeck image when you want to switch modes on-device. Choose **Standalone** for local messaging on the T-Deck itself, or **RNode** to pair/connect it to a host client. Split Standalone and RNode images are also published for recovery, testing, or M5Launcher/M5Burner-style installs.

## First boot

On first boot rsDeck generates a fresh Reticulum identity for you, then asks for a display name and your timezone. From there you land on the Home tab. Home shows a shortened LXMF ID for recognition; use the full address from identity/details screens where exposed for manual contact exchange, or start chats from Peers once announces have been heard.

## What you can do on it

Five tabs along the bottom, navigated with the trackball:

- **Home** — your short ID, signal/battery status, and a manual announce (press the trackball or Enter to broadcast yourself to the mesh).
- **Chats** — your inbox. Tap a thread to read or reply.
- **Contacts** — saved peers. Long-press a contact to remove it; save new contacts from Peers or from a message conversation.
- **Peers** — every Reticulum node rsDeck has heard from on the mesh. Select one to start a chat.
- **Setup** — radio config, network mode, region, device options.

## LoRa presets

Eight presets cover the useful range from "fast and short" to "slow and long." The default is Long Fast, which is what most public Reticulum mesh activity uses. Presets live under Setup -> LoRa Link. Individual radio controls are available behind Developer Radio Controls, and changes apply immediately without a reboot.

For the full preset table and tuning guidance, see [LoRa Radio Interfaces](../networking/lora-and-rnode.md).

## Regions

One firmware image covers all four ISM bands: Americas (915 MHz), Europe (868 MHz), Australia (915 MHz), and Asia (923 MHz). Pick Region in Setup -> LoRa Link, then select a preset to apply that region's default frequency. The first-boot timezone can warn about a likely region mismatch, but it does not switch the radio region for you. You're responsible for operating within your local regulations.

## Wi-Fi bridging

rsDeck has two Wi-Fi modes, mutually exclusive, both toggled in Setup -> Interfaces.

**STA mode** joins your home Wi-Fi. Once you configure a TCP peer or server, internet access can extend the mesh well beyond what LoRa alone can cover. The firmware does not join Ruby, Emerald, Diamond, or any other public TCP server automatically. In the app, "Official" means the server is managed by Ratspeak; "Unofficial" means it is operated by a third party.

**AP mode** turns the rsDeck itself into a hotspot — SSID `rsdeck-XXXX`, password `ratspeak` — and exposes a TCP server on port 4242. Connect a laptop to that network and add a `TCPClientInterface` pointed at `192.168.4.1:4242` in your desktop Reticulum config, and your laptop can talk to the wider LoRa mesh through the handheld. AP mode is still experimental in the handheld firmware and is being reworked alongside the desktop client release, so test it before relying on it in the field.

## Build from source

If you want to build the firmware yourself rather than use the web flasher:

```bash
git clone https://github.com/ratspeak/rsDeck
cd rsDeck
pip install platformio
make prep-tdeck
make package
```

Release artifacts include:

```text
dist/rsdeck-full.zip
dist/rsdeck-standalone.zip
dist/rsdeck-rnode.zip
dist/rsdeck-standalone-m5launcher.bin
dist/rsdeck-rnode-m5launcher.bin
```

Use `rsdeck-full.zip` with the Ratspeak web flasher for normal installs. The
Standalone and RNode-only artifacts are for recovery, testing, host-radio-only
installs, or launcher users who already boot apps from SD. RNode mode
self-provisions the T-Deck RNode product/model/default config and running
firmware hash on first boot; it does not require a separate `rnodeconf`
provisioning step.

## License

rsDeck firmware is AGPL-3.0-or-later. Vendored third-party libraries keep their own notices, including `lib/Crypto` under MIT.
