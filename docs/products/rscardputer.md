---
sidebar_position: 3
sidebar_label: Cardputer Adv
---

# Ratspeak for Cardputer Adv

[**Ratspeak Handheld**](https://github.com/ratspeak/ratspeak-handheld) includes
Cardputer Adv alongside T-Deck Plus, T-Pager and ThinkNode M9.
This page describes **Ratspeak Handheld 2.2.3 beta**.

## Hardware

Use the **M5Stack Cardputer Adv with a Cap LoRa-1262** for LoRa. The Cap supplies
the SX1262 radio; the handheld alone has no LoRa transceiver. Match the antenna
and operating band to the radio hardware.

The Cardputer Adv has an ESP32-S3, 240×135 display, compact keyboard, battery and
microSD slot. An SD card is optional for normal messaging. Its interface uses
compact pages; full message content remains available through the reader.

## Install and modes

The unified full package is `cardputer-full.zip`. It includes the launcher,
**Standalone** messenger and **RNode** radio mode. Single-mode ZIPs install one
mode; `cardputer-standalone.bin` and `cardputer-rnode.bin` are application images for a compatible launcher
or matching slot, not complete factory installations.

Use a package from the selected [Ratspeak Handheld
release](https://github.com/ratspeak/ratspeak-handheld/releases) or a local build
with `DEVICE=cardputer`. Select **Cardputer** on the
[web flasher](https://ratspeak.org/download.html), or upload a complete ZIP
through **Build your own**. Check that the selected firmware is
**Ratspeak Handheld 2.2.3**.

**Back up internal flash and the SD card first.** Factory packages are not
data-preserving updates. See [Flashing firmware](../hardware/flashing-firmware.md)
for the 8 MB backup size, download mode and installation limits.

In the full launcher, select Standalone for on-device LXMF messaging over LoRa or
Wi-Fi, or RNode to use the device as a radio for a host client over USB serial or
BLE. Standalone does not provide BLE messaging. RNode radio settings are managed
by its host client.

## Controls

- **Fn+arrows** moves through lists; left/right changes tabs where the current
  screen does not consume it. **Tab / Shift+Tab** also changes tabs outside chat.
- **Enter** opens or confirms. **Backspace** goes back outside text entry; in
  an editor it deletes text first, then a fresh tap on an empty field goes back.
  **Fn+Backspace** is forward Delete.
- **Ctrl+H** opens Help; **Ctrl+M** opens Messages, **Ctrl+N** starts a new message,
  and **Ctrl+S** opens Settings.
- In a chat, **Tab** selects a displayed message and **Enter** opens its full
  text. **Fn+arrows** scrolls; **Backspace** returns to chat. **R** refreshes while
  reading or selecting a message.

The Messages footer uses **first / previous / next / last** arrows. Move down
past the last conversation to focus the footer, choose an enabled arrow with
left/right and press Enter. **Fn+Left/Right** changes pages directly; adding
**Shift** jumps to either end. Unavailable arrows stay visible and disabled.

Screen dimming or blanking does not power off the Cardputer. Use the side power
switch for hardware power-off, and wait for pending saves or maintenance first.

## Radio and storage

**Settings → Radio** offers the shared presets and custom frequency, spreading
factor, bandwidth, coding rate, TX power and **preamble**. Match the radio tuple
with your peers. Cardputer exposes these fields directly; it does not use the
Deck/Pager developer-unlock screen.

The [handheld guide](../hardware/handheld-guide.md) explains message phases,
save errors, paged history, SD-copy scope and reset recovery. The compact editor
retains a draft across a pending send; it does not promise a separate saved draft
for every conversation.

## Legacy rsCardputer

Earlier firmware and its instructions remain in
[`ratspeak/rsCardputer`](https://github.com/ratspeak/rsCardputer). Current unified packages
use the `cardputer-` prefix; older releases used `rscardputer-`.
Do not mix legacy and unified partition layouts.

## License

Unified Standalone firmware and the launcher are AGPL-3.0-or-later. Bundled RNode
firmware retains GPLv3. See the [third-party
notices](https://github.com/ratspeak/ratspeak-handheld/blob/main/THIRD_PARTY_NOTICES.md).
