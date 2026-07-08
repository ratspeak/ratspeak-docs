---
sidebar_position: 1
sidebar_label: Overview
---

# Building from source

Prefer to compile the firmware yourself to test a patch, audit exactly what runs on your device, or work offline? Which toolchain you use **depends on the board**:

- **rsDeck (LilyGO T-Deck) and rsCardputer** build with **PlatformIO** from their Ratspeak repositories.
- **RNode-class boards** (Heltec LoRa32, T-Beam, generic RNode) use **`rnodeconf`**, the upstream RNode toolchain that ships with Reticulum.

:::note[Just want a working device?]
Most people should use the web installer; it's faster, and requires no toolchain. See [Webinstaller flashing](/tutorials/webinstaller-flashing/heltec-lora32).
:::

## Pick your board

| Board | Firmware | Toolchain | Guide |
|---|---|---|---|
| LilyGO T-Deck Plus | rsDeck | PlatformIO | [Build rsDeck →](/tutorials/flashing-from-source/lilygo-tdeck) |
| Heltec LoRa32 | RNode | `rnodeconf` | [Flash with rnodeconf →](/tutorials/flashing-from-source/heltec-lora32) |

## Common prerequisites

Both paths need:

- A computer running **Linux, macOS, or Windows**
- **[`git`](https://git-scm.com/)**
- **Python 3.9+** with `pip` — both PlatformIO and `rns`/`rnodeconf` install through it
- A **USB-C data transfer cable** and your board

:::warning
Attach an antenna matched to your frequency band before powering or testing a LoRa radio. Transmitting without one can damage the radio module.
:::

The canonical firmware reference is the [official flashing guide](https://docs.ratspeak.org/docs/hardware/flashing-firmware).
