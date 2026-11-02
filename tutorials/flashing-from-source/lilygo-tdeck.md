---
sidebar_position: 3
sidebar_label: LilyGO T-Deck Plus
---

# Build Ratspeak Handheld for T-Deck Plus

This tutorial builds **Ratspeak Handheld v2.3.4** for the **LilyGO T-Deck Plus**
and produces the same package types as the release. It uses the unified
[`ratspeak-handheld` repository](https://github.com/ratspeak/ratspeak-handheld).
The older `rsDeck` repository is retained for legacy recovery.

If you only need to install the released firmware, use the
[browser tutorial](/tutorials/webinstaller-flashing/lilygo-tdeck).

## 1. Prepare the tools

Use Linux or macOS with Git, Make, **Python 3.12** and
[Arduino CLI 1.4.1](https://github.com/arduino/arduino-cli/releases/tag/v1.4.1).
The commands below use `python3.12` so a different system Python does not silently
create the build environment.

Clone the release into a new directory:

```sh
git clone --branch v2.3.4 https://github.com/ratspeak/ratspeak-handheld.git ratspeak-handheld-v2.3.4
cd ratspeak-handheld-v2.3.4
python3.12 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r requirements-build.txt
```

Keep this virtual environment active for the remaining commands. The dependency
file pins PlatformIO and esptool; a separate global installation is not needed.
The normal firmware build uses the included prebuilt Rust protocol libraries.

## 2. Prepare and check the T-Deck build

```sh
make setup DEVICE=tdeck
make doctor DEVICE=tdeck
```

`setup` fetches and prepares the device's build dependencies. `doctor` checks the
tools and source prerequisites. Resolve any reported failures before building;
a successful check does not mean firmware has been built or tested on a device.

## 3. Build the packages

```sh
make package DEVICE=tdeck
```

When the command succeeds, look in `dist/`:

| File | Use |
| --- | --- |
| `tdeck-full.bin` | Standalone messenger and RNode, with a startup launcher |
| `tdeck-standalone.bin` | Standalone messenger only |
| `tdeck-rnode.bin` | USB/BLE radio for a host running Reticulum |
| `tdeck-standalone-launcher.bin` | Standalone image for bmorcelli's Launcher |

The first three files are complete images for the web flasher or esptool at
address `0x0`. Use the Launcher-specific file only with the
[Launcher installation procedure](/docs/hardware/flashing-firmware#bmorcellis-launcher).
Do not substitute an intermediate application binary from the build directory.

## 4. Back up and flash

[Back up the handheld](/docs/hardware/flashing-firmware#back-up-an-existing-handheld)
if it holds an identity, messages or settings you need to keep. Copy the SD card
as well; it does not contain the complete internal backup.

1. Open the [Ratspeak download page](https://ratspeak.org/download.html) in Chrome
   or Edge on a computer. Under **Build your own**, choose **Flash**.
2. Select **Upload** and choose `dist/tdeck-full.bin`, or the complete single-mode
   image you built.
3. With the T-Deck's main power off, connect USB. Hold the trackball button,
   switch power on, then release the button after a few seconds.
4. Choose **Select USB Device**, select the board's port, then **Flash firmware**.
   Read the installation notice. Cancel if it calls for erasing data you have
   not backed up. Keep USB connected until the operation finishes.
5. Restart the handheld. A Full image opens the mode launcher; choose Standalone.

For a deliberate factory installation from the terminal, use the
[esptool procedure](/docs/hardware/flashing-firmware#esptool) with your complete
T-Deck image. That procedure erases internal data.

## 5. Check the result

Check the firmware version, name, timezone and radio settings on the handheld.
Match the radio parameters of a known peer, announce and exchange a message.
A successful build or flash alone does not verify radio operation.

The [handheld guide](/docs/hardware/handheld-guide) covers messages, voice,
storage and recovery. If the build fails, keep the failing command and its first
error, along with the source revision and tool versions. If flashing fails,
record the selected image, serial-port error and board revision before retrying.
