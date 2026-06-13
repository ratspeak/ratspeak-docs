---
sidebar_position: 2
---

# Flashing firmware

This guide walks you through getting firmware onto a rsDeck, rsCardputer, or RNode-class board. The web flasher is the fastest path for rsDeck and rsCardputer; PlatformIO is the path you want when you're hacking on the firmware itself. RNode boards use Mark Qvist's `rnodeconf` toolchain.

> **Warning**: Attach an antenna matched to your frequency band before powering or testing a LoRa radio. Transmitting without an antenna can damage the radio module.

## Web Flasher (Easiest)

For rsDeck and rsCardputer, you don't need to install anything. Plug the board into a USB-C port and visit:

**[ratspeak.org/download.html](https://ratspeak.org/download.html)**

The page uses WebSerial (Chrome, Edge, or Opera on desktop) to detect the board, pick the right image, and flash it directly from your browser. Pick your board, click Flash, and wait for the progress bar to hit 100%. The same image covers all regions — the LoRa band is a runtime setting you choose later from the device UI.

If the browser can't see the board, jump to the [Recovery](../hardware/flashing-firmware.md#recovery-download-mode) section below.

## rsDeck (Build & Flash)

Use this path when you want to build from source — for example, to test a patch or a custom branch. rsDeck builds the launcher, Standalone mode, and RNode mode together, with split artifacts available for recovery, testing, and M5Launcher/M5Burner-style installs.

1. Clone the repo and install PlatformIO:

```bash
git clone https://github.com/ratspeak/rsDeck
cd rsDeck
pip install platformio
make prep-tdeck
```

2. Build the release package and flash the full image:

```bash
make package
make flash port=/dev/cu.usbmodem3101
```

If you have multiple boards plugged in, use the matching serial port: `/dev/cu.usbmodem*` on macOS, `/dev/ttyACM0` on Linux, or `COM3` on Windows.

3. (Optional) Watch the boot log:

```bash
python3 -m platformio device monitor -b 115200
```

`make package` produces:

```text
dist/rsdeck-full.zip
dist/rsdeck-standalone.zip
dist/rsdeck-rnode.zip
dist/rsdeck-standalone-m5launcher.bin
dist/rsdeck-rnode-m5launcher.bin
```

Use `rsdeck-full.zip` for normal installs. The RNode-only artifacts boot the T-Deck as a host-controlled radio and self-provision the T-Deck RNode product/model/default config plus the running firmware hash on first boot; they are advanced artifacts, not generic upstream `rnodeconf` images.

## rsCardputer (Build & Flash)

The Cardputer Adv firmware now lives in the rsCardputer repo. It builds the launcher, Standalone mode, and RNode mode together, with split artifacts available for recovery and debugging.

1. Clone and install PlatformIO (skip if you already did this for rsDeck):

```bash
git clone https://github.com/ratspeak/rsCardputer
cd rsCardputer
pip install platformio
```

2. Build and flash:

```bash
make package
make flash port=/dev/cu.usbmodem3101
```

If you have multiple boards plugged in, use the matching serial port: `/dev/cu.usbmodem*` on macOS, `/dev/ttyACM0` on Linux, or `COM3` on Windows.

## RNode (rnodeconf)

RNode-class boards (RNode, LilyGO T-Beam Supreme, Heltec V3, etc.) use the upstream RNode toolchain rather than PlatformIO directly. The `rnodeconf` utility ships with Reticulum.

1. Install Reticulum, which brings in `rnodeconf`:

```bash
pip install rns
```

2. Plug the board into USB and run the auto-installer:

```bash
rnodeconf --autoinstall
```

The utility detects your board, downloads the right RNode firmware image, flashes it, and provisions the EEPROM with the correct transceiver and frequency settings. Follow the interactive prompts.

To verify or update an existing RNode later:

```bash
rnodeconf -i        # show device info
rnodeconf --update  # update firmware in place
```

Note: `airtime_limit_long` and `airtime_limit_short` are *runtime* configuration keys — you set them in your Reticulum config under the RNode interface stanza, not at flash time.

## Recovery (Download Mode)

If a flash fails partway through and the board no longer enumerates, force the ESP32-S3 into download mode:

- **rsDeck**: hold the **trackball button** while plugging in USB (or while pressing reset). Release once the board is connected.
- **rsCardputer**: hold the **boot button** while plugging in USB. Release once the host detects the device.

Then re-run the web flasher or your PlatformIO upload command. Download mode bypasses whatever state the previous flash left behind.

For RNode boards, hold the BOOT button (and tap RESET if the board has a reset button) before re-running `rnodeconf --autoinstall`.

## Verifying the Flash Worked

A successful flash shows the same signs across all three platforms:

1. The device boots into its splash/animation screen within a few seconds of reset.
2. The serial monitor (`platformio device monitor` for rsDeck/rsCardputer, `rnodeconf -i` for RNode) prints the firmware version and a healthy hardware report.
3. The LoRa radio initializes without errors — look for a `RADIO_INIT_OK` line or equivalent.
4. For rsDeck and rsCardputer, the first-boot/setup flow appears and lets you set the device name, timezone or region defaults, and network mode.
5. If you enable Hotspot/AP mode later, a Wi-Fi access point named `rsdeck-XXXX` or `rscardputer-XXXX` appears and exposes the configured TCP bridge.
6. A Reticulum identity is generated on first boot (X25519 encryption key + Ed25519 signing key) and persisted to flash. Subsequent reflashes preserve it.

If any of those steps stall, power-cycle the board and check the serial monitor for the failure point before re-flashing.
