---
sidebar_position: 2.5
sidebar_label: Handheld use and recovery
---

# Handheld use and recovery

Ratspeak Handheld runs on T-Deck Plus, T-Pager, Cardputer Adv and ThinkNode M9.
Use Standalone mode to send encrypted messages over LoRa or WiFi without a phone.

For installation and backups, see [Flashing firmware](./flashing-firmware.md).
Device controls are covered in the [T-Deck](../products/rsdeck.md),
[T-Pager](../products/rspager.md) and [Cardputer](../products/rscardputer.md) guides.

## Sending and reading messages

Open a peer or contact to start a conversation. Messages are saved before sending.
If a save fails, your text stays in the composer; check the displayed error before
trying again.

| Status | Meaning |
| --- | --- |
| `queued` / `sending` | Waiting to send, or sending is in progress. |
| `sent` | Transmission has started; receipt is not yet confirmed. |
| `delivered` | The recipient confirmed delivery. This is not a read receipt. |
| `unconfirmed` | No delivery confirmation arrived in time. The recipient may still have received it. |
| `failed` | The send could not complete. Check the connection and any displayed error before resending. |

A brief failure to refresh a delivery status keeps its last known label. If the
problem persists, a separate retry action appears outside the message bubble.

The chat list shows two conversations per page. Use the first, previous, next and
last arrows to move between pages. Previews update automatically.

Inside a conversation, scroll to read earlier messages. On T-Deck, T-Pager and
M9, continuing past the top or bottom loads the next part of the history. T-Deck
also supports swiping at the edge. **Read full** opens a long message. On
Cardputer, press **Tab** to select a message, then **Enter** to open it.
New messages leave your place in older history intact.

## Message dates

The clock syncs through GPS or WiFi. Set your timezone in Settings to display
local time. GPS reception can take longer indoors.

Before the clock syncs, sent messages can appear dated near January 1970 in other
clients. Once it syncs, new messages get the correct date; messages already sent
keep their original timestamps.

## Discovering peers

The Peers screen uses one continuous list. Scroll to browse it; incoming updates
keep the selected peer in place. Open a peer to save it as a contact or send a
message.

## Network and radio settings

For LoRa, match the other device's frequency, bandwidth, spreading factor, coding
rate and preamble. Choose a region suited to your hardware and location. See
[LoRa radio settings](../networking/lora-and-rnode.md) for presets and tuning.

For WiFi, join a network and configure a TCP peer, or enable LAN discovery to find
nearby nodes. A local hotspot is also available; it does not provide internet
access. WiFi client and hotspot modes are alternatives.

**Auto Announce** can be set to **OFF**, or an interval of 30 minutes and up.
Manual **Announce** remains available when automatic announcements are off.

Wait for settings to finish saving and follow any restart prompt. Standalone
uses LoRa and WiFi; USB/BLE radio connections use **RNode** mode, which is coming
soon for M9.

## Storage and SD cards {#internal-flash-sd-copies-and-deletion}

An SD card is optional for messaging. Identity and settings are stored in internal
flash, so copying the SD card alone is not a complete backup. Follow the
[backup instructions](./flashing-firmware.md#back-up-an-existing-handheld)
before replacing firmware or erasing a device.

**Initialize SD** prepares the card for Ratspeak. **Wipe SD Data** removes only
Ratspeak's files from the card: `/ratdeck` on T-Deck, `/ratpager` on T-Pager,
`/ratcom` on Cardputer and `/m9` on M9. Internal data remains and may be copied
back to the card later. To remove a conversation, delete it from Chats.

Wait for saves or deletions to finish before switching off or removing the card.
If a read or deletion fails, keep the data intact and retry before considering a
reset.

## Restart, erase and recovery

Use the device's restart or shutdown controls when available so pending saves can
finish. Turning off the screen on Cardputer does not shut it down.

**Erase Device / Factory Reset** deletes internal data and Ratspeak's SD files
if the card is included in the reset. Check the confirmation screen and keep
power connected until it finishes.

If power is lost during a reset, the device opens **Reset recovery**:

- Press **R** to review what will be erased, then **Enter** to confirm.
- Press **B** to go back, or **X** to restart with the reset still pending.
- Reinsert the SD card if the interrupted reset included it.

For other startup problems, note the error and check power and the SD card.
[Download mode](./flashing-firmware.md#recovery-download-mode) lets you restore a
full backup or reinstall firmware. Reinstalling clears internal data, so keep
that as a last step when recovering messages or an identity.
