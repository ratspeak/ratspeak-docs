---
sidebar_position: 3
sidebar_label: LilyGO T-Deck Plus
---

# Building rsDeck (T-Deck Plus)

The LilyGO T-Deck Plus runs Ratspeak's **rsDeck** firmware, built from [`ratspeak/rsDeck`](https://github.com/ratspeak/rsDeck) with **PlatformIO**. A single build produces the launcher, Standalone mode, and RNode mode together.

*New to building from source? Start with the [Overview](/tutorials/flashing-from-source/prerequisites) for prerequisites and toolchain setup.*

:::note[Looking for the easy path?]
To flash a prebuilt release in your browser instead, see [Flashing the T-Deck Plus](/tutorials/webinstaller-flashing/lilygo-tdeck). You don't need any of the tools below for that.
:::

:::warning
Attach an antenna matched to your frequency band before powering or testing the board. Transmitting without one can damage the radio module.
:::

## Prerequisites

Before you touch the repo, install these command-line tools. Each row links to its installer; install them, then confirm each one runs (see [Verify your tools](#verify-your-tools) below).

| Tool | Why rsDeck needs it | Where to get it |
|---|---|---|
| **git** | Downloads the source code | [git-scm.com/downloads](https://git-scm.com/downloads) |
| **Python 3.9+ & pip** | Runs PlatformIO and esptool (below) | [python.org/downloads](https://www.python.org/downloads/) |
| **PlatformIO Core** | Compiles the T-Deck app and launcher | installed with `pip` in [step 1](#1-install-the-python-tools-platformio--esptool) |
| **esptool** | Merges the firmware images and writes them to the board | installed with `pip` in [step 1](#1-install-the-python-tools-platformio--esptool) |
| **arduino-cli** | Compiles the **bundled RNode radio firmware** (rsDeck ships it and builds it as part of the image) | [arduino.github.io/arduino-cli](https://arduino.github.io/arduino-cli/latest/installation/) |

You'll also need a **USB-C data cable** (not a charge-only cable) and ideally a reasonably fast internet connection, as the first build downloads several hundred MB of compiler toolchains.

## 1. Install the Python tools (PlatformIO + esptool)

PlatformIO and esptool are Python packages. On most modern systems (recent Debian/Ubuntu, or macOS with Homebrew Python) a plain `pip install` is blocked with an `externally-managed-environment` error, so the reliable, cross-platform way is a **virtual environment**:

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows (PowerShell): .venv\Scripts\Activate.ps1
pip install platformio esptool
```

**Keep this virtual environment activated for every step below.** The build calls `python3 -m platformio` and `python3 -m esptool` directly, so those tools must be importable by the `python3` you're running. If you open a new terminal later, re-run the `source .venv/bin/activate` line first.

> Prefer a system-wide install? See the [PlatformIO installation guide](https://docs.platformio.org/en/latest/core/installation/index.html). Just make sure `python3 -m platformio --version` works in the shell you build from.

## 2. Install arduino-cli

`arduino-cli` is a **standalone binary**, not a Python package; `pip` won't install it. rsDeck needs it because the RNode radio firmware bundled in the image is compiled with the Arduino toolchain, not PlatformIO.

Install it by following the [official guide](https://arduino.github.io/arduino-cli/latest/installation/) (there's a one-line script for Linux/macOS and a package for Windows), then make sure the binary is on your `PATH` so `make` can find it.

### Verify your tools

Before cloning, confirm everything is installed and callable. Each command should print a version, not "command not found":

```bash
git --version
python3 --version                # 3.9 or newer
python3 -m platformio --version
python3 -m esptool version
arduino-cli version
```

If any of these fails, fix it before continuing, as the build will stop at whichever tool is missing.

## 3. Clone the repository

```bash
git clone https://github.com/ratspeak/rsDeck
cd rsDeck
```

A plain clone is complete. The RNode firmware ships inside the repo (under `vendor/`), so there are no submodules to initialize.

## 4. Install the ESP32 build toolchain

Run this **once** to download the ESP32 compilers and board support that the actual build needs:

```bash
make prep-tdeck
```

This uses `arduino-cli` to fetch the ESP32 core and libraries for the bundled RNode firmware. Expect it to download **a few hundred MB** and take a few minutes on the first run. You only repeat this if you wipe the toolchain or move to a new machine.

## 5. Build the firmware

```bash
make package
```

This compiles the three parts of rsDeck (launcher, Standalone messenger, and RNode radio firmware), then merges and bundles them. The first `make package` also downloads PlatformIO's ESP32 platform, so it can take several minutes; later builds are much faster. When it finishes, the release images are in the `dist/` folder (see [Build artifacts](#build-artifacts)).

## 6. Flash the board

**Put the T-Deck in download mode.** Unlike most boards, you enter download mode as the board *powers on*, not by plugging it in:

1. With the T-Deck's **main power switch off**, connect it to your computer with a data-capable USB-C cable.
2. Press the **trackball** in until you hear a click, and keep holding it.
3. Switch the **main power on** while still holding the trackball for about three seconds, then release. The screen stays black; that's expected in download mode, and the board is now detectable over USB.

**Find the serial port** the board shows up as:

- **Linux:** `ls /dev/ttyACM*` (usually `/dev/ttyACM0`)
- **macOS:** `ls /dev/cu.usbmodem*`
- **Windows:** Device Manager → Ports (COM & LPT) → e.g. `COM3`

**Flash** the board, substituting your port:

```bash
make flash port=/dev/ttyACM0
```

`make flash` writes the full image (launcher + Standalone + RNode) with `esptool`.

## 7. Verify

Reboot the T-Deck with the button on its left side; rsDeck should start within a few seconds. To watch the boot log over USB:

```bash
python3 -m platformio device monitor -b 115200
```

**You can now disconnect the board. The build is complete.**


## Build artifacts

`make package` writes several images to `dist/`. `make flash` installs the full image; the others are for recovery, testing, or M5Launcher/M5Burner-style installs.

| Artifact | Use |
|---|---|
| `rsdeck-full.zip` | Normal install (launcher + Standalone + RNode) — **use this** |
| `rsdeck-standalone.zip` | Standalone mode only |
| `rsdeck-rnode.zip` | RNode mode only — host-controlled radio |
| `rsdeck-standalone-m5launcher.bin` | M5Launcher / M5Burner install, Standalone |
| `rsdeck-rnode-m5launcher.bin` | M5Launcher / M5Burner install, RNode |

:::info[About the RNode artifacts]
The RNode-only images boot the T-Deck as a host-controlled radio and self-provision the T-Deck RNode product, model, default config, and running firmware hash on first boot. They are advanced artifacts — not generic upstream `rnodeconf` images.
:::

## Troubleshooting

- **`pip install` says `externally-managed-environment`** — you're installing into a system Python that's locked. Use the virtual environment shown in [step 1](#1-install-the-python-tools-platformio--esptool).
- **`make: arduino-cli: command not found`** (or the build fails during `make prep-tdeck`) — arduino-cli isn't installed or isn't on your `PATH`. See [step 2](#2-install-arduino-cli).
- **`python3 -m platformio` works, but `make` can't find it** — your virtual environment isn't active in this terminal. Re-run `source .venv/bin/activate`.
- **The board doesn't appear as a serial port** — use a USB-C **data** cable (charge-only cables won't enumerate), re-enter download mode (connect with the power off, hold the trackball, then switch the power on), and on Windows confirm the USB-serial driver is installed.
- **`make prep-tdeck` / `make package` stalls or fails mid-download** — it needs internet to fetch toolchains; check your connection or proxy and re-run the command.
