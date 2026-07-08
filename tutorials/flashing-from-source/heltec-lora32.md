---
sidebar_position: 2
sidebar_label: Heltec LoRa32
---

# Heltec LoRa32 firmware

The Heltec LoRa32 is an **RNode-class** board: it runs the upstream RNode firmware, installed and updated with **`rnodeconf`** (which ships with Reticulum) rather than a Ratspeak PlatformIO build. There is no separate Ratspeak firmware to compile for this board; the source is upstream [`markqvist/RNode_Firmware`](https://github.com/markqvist/RNode_Firmware).

*New to building from source? Start with the [Overview](/tutorials/flashing-from-source/prerequisites) for prerequisites and toolchain setup.*

:::note[Looking for the easy path?]
To flash in your browser instead, see [Flashing the Heltec LoRa32](/tutorials/webinstaller-flashing/heltec-lora32).
:::

:::warning
Attach an antenna matched to your frequency band before powering or testing the board. Transmitting without one can damage the radio module.
:::

## 1. Install rnodeconf

`rnodeconf` is part of Reticulum. Install it with pip:

```bash
pip install rns
```

## 2. Flash with the auto-installer

Plug the board into USB and run:

```bash
rnodeconf --autoinstall
```

The utility detects your board, downloads the correct RNode firmware image, flashes it, and provisions the EEPROM with the right transceiver and default settings. Follow the interactive prompts.

## 3. Verify or update later

```bash
rnodeconf -i        # show device info (firmware version, board model)
rnodeconf --update  # update the firmware in place
```


## Building the RNode firmware from source

`rnodeconf` flashes a prebuilt image. If you want to compile the firmware itself, build the upstream project with `arduino-cli`:

```bash
git clone https://github.com/markqvist/RNode_Firmware.git
cd RNode_Firmware
make prep-esp32
make firmware-heltec32_v3   # or heltec32_v2 / heltec32_v4 for your revision
```

Then flash your build and provision it with `rnodeconf`. See the [upstream repository](https://github.com/markqvist/RNode_Firmware) for the full build and firmware-signing process.
