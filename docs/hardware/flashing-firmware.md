---
sidebar_position: 2
---

# Flashing firmware

Install Ratspeak Handheld on T-Deck Plus, T-Pager, Cardputer Adv or ThinkNode M9.
Firmware is available from the [download page](https://ratspeak.org/download.html)
and [GitHub releases](https://github.com/ratspeak/ratspeak-handheld/releases).

## Before flashing

**Compatible web updates preserve identity, messages and settings.** If the
installation cannot be identified or updated safely, the flasher offers
**Erase and install** or **Cancel**. Erasing removes all internal data; see
[backup instructions](#back-up-an-existing-handheld) if you need to keep it.

Attach a suitable LoRa antenna before powering the radio. Transmitting without
one can damage it.

## Choose a package

- **Full** includes Standalone and RNode, with a launcher to choose between them.
- **Standalone** is the on-device messenger, using LoRa or WiFi.
- **RNode** turns the handheld into a radio for a Reticulum client over USB or BLE.

T-Deck, T-Pager and Cardputer offer all three packages. M9 offers Standalone;
RNode support is coming soon. Download the ZIP for your device:

| Device | Example download |
| --- | --- |
| T-Deck Plus | `tdeck-full.zip` |
| T-Pager | `pager-standalone.zip` |
| Cardputer Adv | `cardputer-rnode.zip` |
| ThinkNode M9 | `m9-standalone.zip` |

Standalone and RNode are also published as a `.bin`, such as
`cardputer-standalone.bin`. It is the same complete image as in the matching
ZIP, for [esptool](#esptool) or [bmorcelli's Launcher](#bmorcellis-launcher).
Full is published only as a ZIP.

## Web flasher

Use Chrome or Edge on a computer, with a USB data cable.

1. Open the [download page](https://ratspeak.org/download.html), select your
   device, then **Flash in browser**.
2. Check the package and version. M9 supports Standalone only.
3. Connect the device and choose **Select USB Device**. If it does not connect,
   try [download mode](#recovery-download-mode).
4. Select **Flash Ratspeak**. The flasher checks the device and updates compatible
   firmware automatically. An erase always requires confirmation. Keep USB
   connected until flashing finishes, then restart the device if needed.

To use a ZIP you already downloaded or built, choose **Flash** under **Build
your own** and upload it.

## esptool {#esptool}

Download the device's `.bin`, or extract it from the ZIP into an empty
directory. Install [esptool](https://docs.espressif.com/projects/esptool/en/latest/esp32s3/esptool/basic-commands.html)
with `python3 -m pip install esptool==5.2.0`, and
[back up](#back-up-an-existing-handheld) any data you want to keep.

Connect the device in [download mode](#recovery-download-mode). Close the web
flasher and any serial monitor, replace `PORT` with its serial port, and run
these commands from the folder that holds the image:

```sh
python3 -m esptool --chip esp32s3 --port PORT --baud 115200 erase-flash
python3 -m esptool --chip esp32s3 --port PORT --baud 115200 write-flash 0x0 cardputer-standalone.bin
```

This is a factory installation: it removes all internal data, including the
identity. Leave power connected until writing and verification finish. On M9,
keep the power switch on; if no serial port appears, check the cable and your
[WCH driver](https://learn.adafruit.com/how-to-install-drivers-for-wch-usb-to-serial-chips-ch9102f-ch9102/overview).
To update without losing data, use the [web flasher](#web-flasher).

## bmorcelli's Launcher {#bmorcellis-launcher}

On T-Deck Plus, T-Pager and Cardputer Adv,
[bmorcelli's Launcher](https://github.com/bmorcelli/Launcher) 2.8 or later can
install the Standalone or RNode `.bin` from the SD card or through Launcher's
web interface. M9 is not supported.

- **Storage:** Launcher creates a 448 KB data partition for Ratspeak's internal
  storage, and Ratspeak prepares it on first start. You can resize it in
  Launcher without losing data. At 448 KB, about 100 text messages are kept
  before the oldest are removed; a 1.9 MB partition keeps several hundred. See
  [message history](./handheld-guide.md#message-history).
- **Updates:** installing a newer `.bin` through Launcher keeps identity,
  messages and settings.
- **Removing:** when you delete Ratspeak, Launcher offers to back up its data
  partition to the SD card, and reinstalling offers to restore it.

If internal storage holds another app's files or can't be read, for example
after an older Launcher shared its storage, Ratspeak asks before changing it:
**X** keeps it and restarts, and **E** erases it once you confirm with
**Enter**. The SD card is not touched. If no storage partition is found,
install the complete `.bin` or ZIP for your device.

## Backups

### Back up an existing handheld

1. Switch off the device and copy its SD card to your computer, if fitted.
2. Install esptool: `python3 -m pip install esptool==5.2.0`.
3. Connect the device in [download mode](#recovery-download-mode). Close the web
   flasher and any serial monitor. Replace `PORT` with its serial port and use a
   new backup filename for each device:

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

Insert the card, open **Settings → Identity & Device → Import Identity**, then
select the imported **Identity Slot**. The device restarts with that identity.
Check its address and remove the key file from the card.

Importing an identity does not restore messages, contacts or settings. There is
no identity-export menu, and a contact QR does not contain the private key.
Cardputer does not have this import menu; use a full backup to recover its
existing installation.

### Return to your backup

Connect the **same device** in download mode and write back its full backup:

```sh
python3 -m esptool --chip esp32s3 --port PORT --after no-reset write-flash 0 handheld-backup.bin
python3 -m esptool --chip esp32s3 --port PORT --after no-reset verify-flash 0 handheld-backup.bin
```

After both commands succeed, switch off, restore the matching SD copy and restart.
This replaces the current installation with the saved firmware and data.

## Recovery (download mode) {#recovery-download-mode}

- **T-Deck Plus:** connect USB with the main power off. Hold the trackball button,
  switch the power on, then release the button after a few seconds.
- **T-Pager:** hold **BOOT**, tap **RST**, then release BOOT when the computer
  detects the device. PWR is the separate power button.
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
for your device. Packaged ZIPs are written to `dist/`.

## Legacy firmware

Earlier builds remain in [rsDeck](https://github.com/ratspeak/rsDeck),
[rsPager](https://github.com/ratspeak/rsPager) and
[rsCardputer](https://github.com/ratspeak/rsCardputer). Use their own installation
instructions; their firmware and partition layouts differ from Ratspeak Handheld.

## RNode (rnodeconf)

For boards supported by upstream RNode firmware, such as Heltec or T-Beam,
install Reticulum and run its installer:

```sh
python3 -m pip install rns
rnodeconf --autoinstall
```

Follow the prompts to select and install firmware. To inspect or update an
existing RNode, replace `PORT` with its serial port:

```sh
rnodeconf PORT --info
rnodeconf PORT --update
```

For Ratspeak Handheld, use the device's **RNode** or **Full** package above.
