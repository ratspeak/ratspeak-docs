---
sidebar_position: 2
---

# Flashing firmware

Ratspeak Handheld brings T-Deck Plus and T-Pager firmware into one codebase.
The first beta covers those two devices; Cardputer Adv is in testing, with
existing rsCardputer releases still available separately. RNode-class boards
can also use the upstream `rnodeconf` toolchain below.

> **Warning**: Attach an antenna matched to your frequency band before powering or testing a LoRa radio. Transmitting without an antenna can damage the radio module.

## Before flashing

The `*-full.zip`, `*-standalone.zip`, and `*-rnode.zip` packages are **fresh
installs, not data-preserving updates**. They write firmware and a partition
layout; leaving **Full Erase** off does not protect existing data. This beta
does not provide an automatic migration from rsDeck or rsPager.

Back up internal flash and the SD card before replacing an existing installation.
A flash backup lets you return to the old firmware and its saved data; it does
not import that data into the new firmware. Keep the original SD card aside
during the fresh install.

### Back up an existing T-Deck or T-Pager

1. Shut down the device and copy the entire SD card to your computer, if fitted.
   An SD copy alone is not a complete backup: identities and settings can be
   stored only in internal flash.
2. Install [esptool](https://docs.espressif.com/projects/esptool/en/latest/esp32s3/esptool/basic-commands.html)
   in a Python environment: `python3 -m pip install esptool==5.2.0`.
3. Connect only the device being backed up and enter [download mode](#recovery-download-mode).
   Replace `PORT` below with its serial port, and use a new backup filename for
   each device. Close the web flasher or serial monitor first.

```sh
python3 -m esptool --chip esp32s3 --port PORT --after no-reset read-flash 0 ALL handheld-backup.bin
python3 -m esptool --chip esp32s3 --port PORT --after no-reset verify-flash 0 handheld-backup.bin
```

Both commands must finish successfully before flashing. These boards have 16 MB
of flash, so the backup should be 16,777,216 bytes. Keep it with the SD copy in
private storage: it contains identity keys and may contain Wi-Fi passwords.
Do not attach it to a bug report.

### Keep an existing identity

If you already have the identity's **64-byte private key file**, copy it to
`/ratdeck/identity/import.identity` on an SD card for T-Deck, or
`/ratpager/identity/import.identity` for T-Pager. After installation, insert the
card before booting and open **Settings → Identity & Device → Import Identity**.
Then select the imported **Identity Slot**; the device restarts with that identity.
Check its address against your old one, then remove the import file from the card.

The firmware has no identity-export menu, and a contact QR is not a private-key
backup. If you need the same identity but do not have its key file, keep the old
installation until you have recovered it. Messages, contacts and settings are
not restored by importing a key.

### Return to your backup

On the **same device**, enter download mode and restore the complete flash backup:

```sh
python3 -m esptool --chip esp32s3 --port PORT --after no-reset write-flash 0 handheld-backup.bin
python3 -m esptool --chip esp32s3 --port PORT --after no-reset verify-flash 0 handheld-backup.bin
```

This replaces the current firmware and internal data with the saved snapshot.
Restore the matching SD copy with the device off, then reset it. Do not restore
one device's backup onto another.

## Web flasher

Use a desktop browser with Web Serial support, such as Chrome or Edge, and a
USB-C data cable. Open the [Ratspeak download page](https://ratspeak.org/download.html).

1. Select **T-Deck Plus** or **T-Pager**, then **Flash in browser**.
2. Check the firmware name and version. Unified releases are labelled
   **Ratspeak Handheld**; rsDeck, rsPager, and rsCardputer labels refer to legacy firmware.
3. For a fresh installation, choose **Full** to include the launcher, Standalone
   messenger, and RNode mode. After verifying your backup, enable **Full Erase**
   to start with empty internal storage. The other packages install one mode only.
4. Enter [download mode](#recovery-download-mode), select the correct USB device,
   and flash. Confirm the device model and backup notice before continuing.
5. When writing finishes, reset the device manually.

To install a downloaded or locally built package, open **Build your own** on the
download page and upload the complete `.zip`. Unified release packages come from
[`ratspeak-handheld` releases](https://github.com/ratspeak/ratspeak-handheld/releases):

| Device | Full package |
| --- | --- |
| T-Deck Plus | `rsdeck-full.zip` |
| T-Pager | `rspager-full.zip` |

Bare `*-app.bin` and `*-m5launcher.bin` files are for their intended launcher or
layout-specific installation, not the normal ZIP upload flow. Cardputer's board
preset continues to use [legacy rsCardputer releases](https://github.com/ratspeak/rsCardputer/releases).

## Build from source

On Linux or macOS, install Git, Make, Python 3.12, and Arduino CLI 1.4.1:

```bash
git clone https://github.com/ratspeak/ratspeak-handheld
cd ratspeak-handheld
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r requirements-build.txt
make setup DEVICE=tdeck
make doctor DEVICE=tdeck
make package DEVICE=tdeck
```

Use `DEVICE=tpager` for T-Pager. `DEVICE=cardputer` builds the experimental
Cardputer firmware; it is not part of the first beta download set. Packages go
to `dist/` and can be uploaded through **Build your own**. Normal builds use the
included Rust libraries and do not need a Rust toolchain. Protocol development
is covered in the [build notes](https://github.com/ratspeak/ratspeak-handheld/blob/main/protocol/prebuilt/README.md).

## Legacy firmware

Earlier builds remain in [rsDeck](https://github.com/ratspeak/rsDeck),
[rsPager](https://github.com/ratspeak/rsPager), and
[rsCardputer](https://github.com/ratspeak/rsCardputer). Use each repository's
build instructions for those versions; do not mix their images or partition
layouts with the unified firmware.

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

- **T-Deck Plus**: connect USB with the main power off. Hold the **trackball
  button**, switch the power on, then release the trackball after a few seconds.
- **T-Pager**: hold **BOOT**, tap **RST**, then release BOOT after the host detects
  the device. PWR is the separate power button, not reset.
- **Cardputer Adv**: switch the side power off, hold **G0** while applying USB
  power, then release it.

The screen can remain black in download mode. Retry with the package for that
board; entering download mode does not itself erase data.

For RNode boards, hold the BOOT button (and tap RESET if the board has a reset button) before re-running `rnodeconf --autoinstall`.

## Verifying the Flash Worked

A successful handheld installation should pass these checks:

1. The device boots into its splash/animation screen within a few seconds of reset.
2. A Full installation opens the launcher with Standalone and RNode choices;
   a single-mode package boots that mode directly.
3. Standalone mode starts without storage or radio errors. On a fresh device,
   complete the name and timezone setup, then check the radio region and preset.
4. Test a message with another Reticulum/LXMF device using matching radio settings
   or a reachable network path.

If startup fails, record the serial log at 115200 baud before considering another
flash. Do not erase the device as a first response to a missing identity or history.
