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

Use the chat list's navigation arrows to move through conversations. Previews
update automatically; recently opened conversations reuse their loaded history.

Inside a conversation, scroll to read earlier messages. On T-Deck, T-Pager and
M9, continuing past the top or bottom loads the next part of the history. T-Deck
also supports swiping at the edge. **Read full** opens a long message.

- On T-Deck, touch and hold a message to open its actions. Tap a voice clip's
  playback control to play or pause it.
- On T-Pager, turn the wheel to select messages, then click or press Enter to
  open the selected message or play/pause its audio. **M** opens message actions.
- On Cardputer and M9, use up/down to select messages and Enter to open the
  selection. Cardputer uses **Fn+up/down**; **M** opens message actions.

Back dismisses message selection before leaving the conversation. Opening a
conversation starts at its newest messages without a preselected message.
New messages leave your place in older history intact while you are reading.

## Voice messages

T-Deck, T-Pager, and Cardputer Adv can record and play short voice clips. Open
**Voice message** in a Direct conversation; on Cardputer, **Ctrl+V** opens the
recorder. On Pager, turn the wheel down from the composer to reach Voice or Send,
then click to activate the selected control. Select **Record**, then **Stop** when finished, up to 15 seconds.
Preview the clip before selecting **Send**, or delete it and record again.
Sending returns to the conversation, where its delivery status is shown.

Unsent clips are temporary and are removed when you close the conversation.
Playback controls show elapsed and total time. Adjust **Settings → Voice →
Playback volume** for the speaker.

**Max voice messages** limits retained audio on internal storage, from 1 to 50,
with a default of 2. Reaching the limit removes the oldest audio while keeping
its message in chat with an **Audio removed** label. SD-card audio has no
clip-count limit, but still needs available storage.

The accompanying Ratspeak app selects compact Codec2 700C recordings when it
has received or cached the handheld's no-compression announce. Announce from the
handheld before recording in the app. If the recipient's capability is unknown,
the app uses Opus, which these handhelds cannot play. Existing recordings retain
their original format. ThinkNode M9 has no supported audio hardware. Live
handheld calls and Hub/channel access are unavailable in this release.

## Propagation

**Settings → Propagation** enables delivery through propagation nodes and
retrieval of messages stored while you were offline.

- **AUTO** node selection chooses an available candidate from discovered nodes.
- **MANUAL** lets you enter an address or choose a discovered node. The selected
  address stays fixed even if that node becomes unreachable; replace or clear it
  in the same settings.
- **AUTO: direct first** tries direct delivery before using propagation when
  appropriate. **ALWAYS: relay only** requires a propagation node and does not
  silently fall back to direct delivery if it is unavailable.

**Selected** identifies the automatic candidate, not a confirmed connection.
Use **Sync now** to check the selected node for incoming messages. A node accepting
an outgoing message is not confirmation that its recipient has received it.
If a send is unconfirmed, it may have reached the node; check its status before
retrying. Connection availability, node policy, and proof-of-work requirements
can affect how quickly propagation completes.

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

New and reset radio settings use **Medium Fast**; saved presets are retained.
For LoRa, match the other device's frequency, bandwidth, spreading factor, coding
rate, and preamble. Choose a region suited to your hardware and location, and
follow your local radio regulations for frequency, transmit power and duty cycle;
presets do not limit power or airtime for your region. See
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

### Message history {#message-history}

Internal storage keeps the newest messages. When it runs low, the oldest
messages are removed across all conversations; messages still being sent and
drafts are kept. The device shows a notice the first time this happens.

To keep the full history, use an SD card for messages: turn on **Settings →
Storage → SD Message Store**; Cardputer uses an inserted card automatically. The
card then holds every message, and internal storage keeps recent copies. If the
card is missing, the oldest internal messages are removed as without a card;
those already on the card return when you insert it again.

**Settings → Storage** shows internal usage and whether history is complete on
the card or rolling.

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
