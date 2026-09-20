---
sidebar_position: 2.5
sidebar_label: T-Pager
---

# Ratspeak for T-Pager

The LilyGO T-Pager runs [Ratspeak Handheld](https://github.com/ratspeak/ratspeak-handheld),
alongside [T-Deck Plus](./rsdeck.md) and [Cardputer Adv](./rscardputer.md). It
uses the shared Rust Reticulum/LXMF core. This page describes
**Ratspeak Handheld 2.2.0 beta**.

## Hardware

Use the SX1262 version of the
[T-Pager / T-LoRa-Pager](https://wiki.lilygo.cc/products/t-lora-series/t-lora-pager/).
It has an ESP32-S3, 480×222 display, QWERTY keyboard, scroll encoder, LoRa radio,
and GPS. Other radio variants are not interchangeable firmware targets. Match
your antenna and radio configuration to the hardware and frequency band.

An SD card is optional for normal messaging. The firmware can store identity,
settings, and messages on internal flash.

## Install

Use `rspager-full.zip` from
[Ratspeak Handheld releases](https://github.com/ratspeak/ratspeak-handheld/releases)
for a fresh installation. Upload it through **Build your own** on the
[web flasher](https://ratspeak.org/download.html), or select the T-Pager preset
when it shows **Ratspeak Handheld**.

**Back up your identity and data first.** Factory packages reset internal
storage after you accept the web flasher's backup notice. See the
[backup instructions](../hardware/flashing-firmware.md#before-flashing) before
replacing an existing installation.

Hold **BOOT**, tap **RST**, then release BOOT to enter download mode. Reset the
device manually after writing completes. See [Flashing firmware](../hardware/flashing-firmware.md)
for the full procedure and source builds; use `DEVICE=tpager`.

## Modes and controls

The full package starts a launcher with two choices:

- **Standalone** — on-device LXMF messaging over LoRa or Wi-Fi.
- **RNode** — a host-controlled radio for Ratspeak or another Reticulum client.

Use the scroll encoder to move between tabs. Click it or press **Enter** to
enter the selected tab, then turn it to move through that screen's controls.
The first click enters the screen; it does not also activate a control.
**Backspace** goes back to tab navigation when the current screen has no more
specific back/edit action. **Alt+Backspace** is Escape for cancelling an edit.

For a selected setting, press Enter or click to edit, then turn the encoder
**up to increase/advance** or **down to decrease/go back**. Editing changes the
value without scrolling the surrounding page. Enter saves; Backspace cancels
ordinary value edits. A setting with only one available choice cannot be edited.

### Select a frequency without touch

1. Open **Settings → LoRa**. Select **Developer Radio Controls**, then hold the
   encoder button as prompted to unlock the custom fields.
2. Open **Frequency** and press Enter or click to edit. Use **A/D** to choose the highlighted digit. Comma/slash also work here.
3. Turn the encoder up to increase that digit or down to decrease it, or type
   a digit; **Alt+Q…P** enters 1…0.
4. Press **Enter** to save, or **Alt+Backspace** to cancel. Backspace alone moves
   to the preceding digit while editing.

The bracketed digit and the on-screen hint show what will change. Match the
frequency and radio preset with the other device; unsupported frequencies are
rejected. This editor does not require touch, a trackball or horizontal scrolling.

### Power buttons

In Standalone mode, a short **BOOT** press sleeps or wakes the screen. Holding BOOT while the screen is on opens the power-off confirmation; a six-second hold forces
power off. **PWR** powers the device on from shutdown; **RST** resets it.
Prefer the confirmed shutdown over a forced power-off when saving data. A forced
power-off can interrupt a save. If the display is dark, tap and release BOOT to
wake it before holding again.

See the [handheld guide](../hardware/handheld-guide.md) for messaging states,
long history and storage/recovery behavior.

## Legacy rsPager

Previous releases and their build instructions remain in
[`ratspeak/rsPager`](https://github.com/ratspeak/rsPager). Both firmware families
use `rspager-` filenames, so check the source repository and release version.
