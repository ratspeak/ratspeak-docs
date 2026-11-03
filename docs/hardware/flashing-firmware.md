---
sidebar_position: 2
---

# Flashing firmware

Install **Ratspeak Handheld v2.3.4 beta** on T-Deck Plus, T-Pager (SX1262),
Cardputer Adv or ThinkNode M9. Cardputer requires Cap LoRa-1262 for LoRa.
Firmware is available from the [download page](https://ratspeak.org/download.html)
and [GitHub releases](https://github.com/ratspeak/ratspeak-handheld/releases).

## Before flashing

Back up an existing handheld before changing its firmware.
**Compatible web updates preserve identity, messages and settings.** If the
installation cannot be identified or updated safely, the flasher offers
**Erase and install** or **Cancel**. Erasing removes all internal data; see
[backup instructions](#back-up-an-existing-handheld) if you need to keep it.

Attach a suitable LoRa antenna before powering the radio. Transmitting without
one can damage it.

## Choose a package

- **Full** (**Messenger and radio** on the download page) includes Standalone
  and RNode, with a launcher to choose between them.
- **Standalone** (**Messenger only**) is the on-device messenger, using LoRa or WiFi.
- **RNode** (**Radio for your phone or computer**) turns the handheld into a
  radio for a Reticulum client over USB or BLE.

T-Deck, T-Pager and Cardputer offer all three packages. M9 offers Standalone
only in this release. Download the `.bin` for your device and intended mode:

| Device | Example download |
| --- | --- |
| T-Deck Plus | `tdeck-full.bin` |
| T-Pager | `pager-standalone.bin` |
| Cardputer Adv | `cardputer-rnode.bin` |
| ThinkNode M9 | `m9-standalone.bin` |

Each `.bin` is a complete image for the [web flasher](#web-flasher) or
[esptool](#esptool). T-Deck, T-Pager and Cardputer also have a
`-standalone-launcher.bin` for [bmorcelli's Launcher](#bmorcellis-launcher).
Use the files from the same release; legacy ZIP packages have their own instructions.

## Web flasher

Use Chrome or Edge on a computer, with a USB data cable.

1. Open the [download page](https://ratspeak.org/download.html), select your
   device, choose its package under **Firmware**, then select **Flash in browser**.
2. Check the package and version. M9 supports Standalone only.
3. Connect the device and choose **Select USB device**. If it does not connect,
   try [download mode](#recovery-download-mode).
4. Select **Install Ratspeak**. The flasher checks the device and updates compatible
   firmware automatically. An erase always requires confirmation. Keep USB
   connected until flashing finishes, then restart the device if needed.

To use a `.bin` you already downloaded or built, open the
[advanced flasher](https://ratspeak.org/flash.html), upload it on the **Upload**
tab, and select **Install firmware**.

## esptool {#esptool}

This procedure is a **factory installation**. It erases all internal data,
including the identity, messages and settings. [Back up first](#back-up-an-existing-handheld).
To preserve an existing compatible installation, use the [web flasher](#web-flasher).

Download the complete image for the exact device and mode. Install
[esptool](https://docs.espressif.com/projects/esptool/en/latest/esp32s3/esptool/basic-commands.html)
in a Python virtual environment:

```sh
python3 -m venv handheld-tools
. handheld-tools/bin/activate
python3 -m pip install esptool==5.2.0
```

These shell commands use Linux/macOS activation. On Windows, create the
environment with `py -m venv handheld-tools`, then use
`handheld-tools\Scripts\python.exe` in place of `python3` below and for the pip
installation command.

Connect the device in [download mode](#recovery-download-mode). Close the web
flasher and any serial monitor. Replace `PORT` with its serial port and
`IMAGE.bin` with the complete file you selected, such as `tdeck-full.bin` or
`m9-standalone.bin`. Run from the folder holding that file:

```sh
python3 -m esptool --chip esp32s3 --port PORT --baud 115200 erase-flash
python3 -m esptool --chip esp32s3 --port PORT --baud 115200 write-flash 0x0 IMAGE.bin
```

Do not use `-standalone-launcher.bin` or an intermediate application binary in
this procedure. Leave power connected until writing and verification finish.
On M9, keep the power switch on. If no port appears, check the data cable and
the USB-serial driver specified by the device manufacturer before retrying.

## bmorcelli's Launcher {#bmorcellis-launcher}

On T-Deck Plus, T-Pager and Cardputer Adv,
[bmorcelli's Launcher](https://github.com/bmorcelli/Launcher) can install Ratspeak
from the SD card or its web interface. Use the `-standalone-launcher.bin` for
Standalone, or the `-rnode.bin` for RNode. There is no M9 Launcher image.
Check Launcher's own device and version requirements before installing it.

Ratspeak stores its internal data in a separate `littlefs` partition. Back up
that partition before using Launcher's partition manager to resize or remove
an installation. Do not format or replace it during an update if you need its
identity, messages and settings. Message capacity depends on the partition
size and message contents; use an SD card for longer
[message history](./handheld-guide.md#message-history).

To reach Launcher from Ratspeak, switch the device off and on. If Ratspeak
started through Launcher shows **No storage partition was found**, install
`-standalone-launcher.bin`. For a direct installation outside Launcher, the same
error calls for the complete device image. Preserve any existing data before
changing the installation.

If internal storage holds another app's files or can't be read, for example
after an older Launcher shared its storage, Ratspeak asks before changing it:
**X** keeps it and restarts, and **E** erases it once you confirm with
**Enter**. The SD card is not touched.

## Backups

### Back up an existing handheld

1. Switch off the device and copy its SD card to your computer, if fitted.
2. [Set up esptool](#esptool) if needed; do not run the erase or install commands.
3. Connect the device in [download mode](#recovery-download-mode). Close the web
   flasher and any serial monitor. Replace `PORT` with its serial port and use a
   new backup filename for each device and date. The example assumes
   `handheld-backup.bin` does not already exist:

```sh
python3 -m esptool --chip esp32s3 --port PORT --after no-reset read-flash 0 ALL handheld-backup.bin
python3 -m esptool --chip esp32s3 --port PORT --after no-reset verify-flash 0 handheld-backup.bin
```

Both commands must succeed. Check the backup size before proceeding:

| Device | Backup size |
| --- | --- |
| T-Deck Plus, T-Pager, ThinkNode M9 | 16,777,216 bytes (16 MB) |
| Cardputer Adv | 8,388,608 bytes (8 MB) |

Keep the backup and SD copy private: they contain identity keys and may contain
WiFi passwords. Keep the original SD card aside during a fresh installation.

### Keep an existing identity

If you have your identity's **64-byte private key file**, T-Deck, T-Pager and M9
can import it from an SD card:

| Device | File path on SD |
| --- | --- |
| T-Deck Plus | `/ratdeck/identity/import.identity` |
| T-Pager | `/ratpager/identity/import.identity` |
| ThinkNode M9 | `/m9/identity/import.identity` |

Insert the card, open **Settings → Identity → Import Identity**, then
select the imported **Identity Slot**. The device restarts with that identity.
Check its address and remove the key file from the card.

Importing an identity does not restore messages, contacts or settings. There is
no identity-export menu, and a contact QR does not contain the private key.
Cardputer does not have this import menu; use a full backup to recover its
existing installation.

### Return to your backup

Restoring replaces the current firmware and internal data with the saved copy.
Back up the current state too if you need it. Connect the **same device** in
download mode and write back its full backup:

```sh
python3 -m esptool --chip esp32s3 --port PORT --after no-reset write-flash 0 handheld-backup.bin
python3 -m esptool --chip esp32s3 --port PORT --after no-reset verify-flash 0 handheld-backup.bin
```

After both commands succeed, switch off, restore the matching SD copy and restart.
Do not copy a full-device backup onto a different board or use it to run two
devices with the same identity at once.

## Recovery (download mode) {#recovery-download-mode}

- **T-Deck Plus:** connect USB with the main power off. Hold the trackball button,
  switch the power on, then release the button after a few seconds.
- **T-Pager:** connect USB, hold **BOOT**, tap **RST**, then release BOOT.
  PWR is the separate power button. See [LilyGO's download-mode instructions](https://github.com/Xinyuan-LilyGO/LilyGoLib/blob/master/docs/lilygo-t-lora-pager.md#t-lora-pager-enter-download-mode).
- **Cardputer Adv:** switch the side power off, hold **G0** while connecting USB,
  then release it.
- **ThinkNode M9:** leave the power switch on and USB connected. Esptool enters
  download mode automatically; use `--baud 115200`.

The screen may stay black in download mode. Entering it does not erase data.

## After installation {#verifying-the-flash-worked}

A Full installation opens the launcher; single-mode packages start directly.
In Standalone, complete the name and timezone setup, check the radio settings,
and send a message to a reachable peer.

If startup fails, note the error and collect a serial log at 115200 baud before
reflashing. See [Handheld recovery](./handheld-guide.md#restart-erase-and-recovery)
for interrupted resets or storage problems.

## Build from source

Follow the [build instructions](https://github.com/ratspeak/ratspeak-handheld#build-from-source)
for your device. Release images are written to `dist/`.

## Legacy firmware

Earlier builds remain in [rsDeck](https://github.com/ratspeak/rsDeck),
[rsPager](https://github.com/ratspeak/rsPager) and
[rsCardputer](https://github.com/ratspeak/rsCardputer). Use their own installation
instructions; their firmware and partition layouts differ from Ratspeak Handheld.

## RNode (rnodeconf)

Upstream RNode firmware has a separate installer, `rnodeconf`, included with
Reticulum. Follow the [Heltec/rnodeconf tutorial](/tutorials/flashing-from-source/heltec-lora32)
for tool setup, installation and verification; select your exact supported board
and band in the installer.

For Ratspeak Handheld, use the device's **RNode** or **Full** package above.
