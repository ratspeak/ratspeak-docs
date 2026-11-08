---
sidebar_position: 1
sidebar_label: Overview
---

# Firmware tools and source builds

Build Ratspeak Handheld when you need to change or inspect its source. For a
normal installation, use a release image and the
[flashing guide](/docs/hardware/flashing-firmware).

The procedures in this section use two different tools:

| Task | What it does | Guide |
| --- | --- | --- |
| Build Ratspeak Handheld for T-Deck Plus | Compiles the released source and packages complete firmware images | [T-Deck Plus source build](/tutorials/flashing-from-source/lilygo-tdeck) |
| Install upstream RNode on Heltec LoRa32 | Downloads, flashes and provisions a prebuilt RNode image with `rnodeconf` | [Heltec installation](/tutorials/flashing-from-source/heltec-lora32) |

`rnodeconf` is an installer and configuration utility, not a compiler. Its guide
also points source developers to upstream's build instructions.

## Ratspeak Handheld build prerequisites

The v2.3.5 source build uses **Linux or macOS**, **Git**, **Make**, **Python 3.12**
and **Arduino CLI 1.4.1**. The repository pins the Python build dependencies,
including PlatformIO and esptool. Follow the T-Deck tutorial to install those
in a virtual environment.

The normal build uses the Rust protocol libraries included in the repository;
you do not need a Rust toolchain unless you change and rebuild those libraries.
Download access is needed to fetch the build tools and dependencies.

## Before connecting a board

Use a USB data cable, identify the exact board revision and attach an antenna
suited to its radio band before transmitting. Close other applications using
the serial port.

Back up an existing installation before changing its firmware or partition
layout. For a Ratspeak Handheld, follow
[backup and recovery](/docs/hardware/flashing-firmware#back-up-an-existing-handheld).
For a board running other firmware, use that firmware's backup instructions;
a copy of its settings is not necessarily a backup of its identity keys.
