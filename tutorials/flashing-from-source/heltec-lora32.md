---
sidebar_position: 2
sidebar_label: "Heltec: rnodeconf"
---

# Installing Heltec firmware with rnodeconf

This procedure installs a prebuilt image of
[upstream RNode firmware](https://github.com/markqvist/RNode_Firmware) using
`rnodeconf`, the installer included with Reticulum. It turns a supported Heltec
LoRa32 into a radio for a host such as Ratspeak; it does not install the Ratspeak
app or the standalone handheld messenger.

Upstream marks its Heltec firmware experimental. Check the installer for your
exact board revision and radio band. Do not select a different revision because
its name is similar. For a browser installation, use the
[Heltec web tutorial](/tutorials/webinstaller-flashing/heltec-lora32).

## 1. Prepare the board and tools

Use a USB data cable and attach the correct antenna before transmitting. Save
any existing firmware's configuration and identity using its own backup
instructions before replacing it. Installation can erase that data.

Install Reticulum into a Python virtual environment. On Linux or macOS:

```sh
python3 -m venv rnode-tools
. rnode-tools/bin/activate
python3 -m pip install --upgrade rns
```

On Windows, use Python and PowerShell:

```powershell
py -m venv rnode-tools
.\rnode-tools\Scripts\python.exe -m pip install --upgrade rns
```

On Windows, run the commands below as `.\rnode-tools\Scripts\rnodeconf.exe`
in place of `rnodeconf`. On Linux or macOS, keep the virtual environment active.

## 2. Install and provision

Close any serial monitor, browser flasher or app using the board. Connect it by
USB, then run:

```sh
rnodeconf --autoinstall
```

Follow the prompts to select the serial port, exact Heltec revision and hardware
band. Read the firmware and erase notices before continuing. The installer
downloads the image and provisions the board for RNode use; do not unplug it
until the installer reports completion.

If the tool cannot connect, check that the cable carries data and that no other
application owns the port. Follow
[Heltec's bootloader instructions](https://wiki.heltec.org/docs/platform/f%26t/flash)
for your board: hold **USER/PRG**, press and release **RST**, then release
USER/PRG. Reselect the port if it changes.

## 3. Verify and connect

Restart the board if prompted. Replace `PORT` with its current serial port,
for example `/dev/ttyACM0` on Linux, `/dev/cu.usbmodem…` on macOS or `COM4` on
Windows:

```sh
rnodeconf PORT --info
```

Check that the reported board and firmware match what you installed. Close the
tool before adding an RNode interface in Ratspeak. Follow
[LoRa and RNode](/docs/networking/lora-and-rnode) to configure the radio, announce
and exchange a message with a known peer.

For a later upstream firmware update, review its release notes and run:

```sh
rnodeconf PORT --update
```

## If you need to compile RNode

The installer above uses prebuilt firmware. Upstream maintains the
[RNode source and build targets](https://github.com/markqvist/RNode_Firmware/blob/master/Makefile).
Its ESP32 builds use Arduino CLI, and targets differ by board revision. Follow
the build and provisioning instructions for the revision you check out; a
compiled application binary is not automatically a complete, provisioned image
that can be flashed at `0x0`.

This page's verified installation path is the auto-installer. Do not apply the
Ratspeak Handheld build commands or package layout to an upstream Heltec build.
