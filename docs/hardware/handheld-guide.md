---
sidebar_position: 2.5
sidebar_label: Handheld use and recovery
---

# Handheld messaging and recovery

This guide describes **Ratspeak Handheld 2.2.0 beta** for T-Deck Plus, T-Pager
and Cardputer Adv. Use the notes for the release you install.

For board controls, see [T-Deck](../products/rsdeck.md),
[T-Pager](../products/rspager.md) or [Cardputer](../products/rscardputer.md).
For backups and package selection, start with [Flashing firmware](./flashing-firmware.md).

## Sending and reading messages

Submitting a message first saves its local record. While **Saving message** is
shown, keep the device powered. A failed save is not a successful send; the
composer retains the submitted text for recovery. Capacity or storage errors
can delay admission even if a network path exists.

| Label | Meaning |
| --- | --- |
| `queued` / `sending` | Saved outgoing work or an attempt in progress; no delivery proof yet. |
| `sent` | A transport reported that transmission started. It does not confirm receipt. |
| `delivered` | A delivery proof was validated. This does not mean the recipient read the message. |
| `unconfirmed` | The expected proof did not arrive in time. The recipient may still have received it. |
| `failed` | The attempt could not complete. Check the path, radio settings and any storage detail before resending. |

A separate **saving status**, **save retry**, **storage error** or **not sending**
caption describes local persistence or a stopped attempt. For example, a valid
proof can establish `delivered` while saving that status still needs a retry.
These are coarse phases, not a transfer percentage. An explicit resend creates
a new local outgoing record.

Incoming messages are acknowledged only after the required local save succeeds.
A repeated message is recognized while its record remains in retained history;
this is not a permanent duplicate archive. Cancelling a transfer does not erase
a record that already committed.

The Chats/Messages list uses **first / previous / next / last** arrows. They
remain visible and disabled when a page is unavailable. New activity offers a
return to the newest conversations without interrupting an older page.

History loads in pages. On Deck/Pager, use **Older**, **Newer**, **Newest** and
**Retry**. **Read full** opens a long message, with **Prev**, **Next** and **Back**
controls. On Cardputer, use the chat's Tab/Enter reader controls described on its
device page. A shortened preview is not a truncated stored message. A failed
read displays an unavailable/retry state; it should not be treated as an empty
conversation. New arrivals do not force you away from an older page you are reading.

## Network and radio settings

Match frequency and radio parameters with the other device. Choosing a region
preset selects its default frequency; it is not a substitute for checking the
hardware band and local operating rules. A custom tuple remains **Custom** until
you choose a preset. Cardputer includes the same preamble setting as Deck/Pager.

Standalone can use a saved Wi-Fi client network, a local hotspot, configured TCP
peers and enabled LAN discovery. Client and hotspot are alternative modes;
a hotspot is not an Internet router. No public TCP peer is selected automatically.
The Deck/Pager SSID/password editor configures client networks; the Cardputer UI
also exposes hotspot credentials. Standalone BLE messaging is not implemented;
RNode is the separate host-controlled radio mode.

**Auto Announce** can be **OFF** on every device, followed by 30 minutes and up.
OFF disables automatic announcements; manual Announce remains available.

Settings save before they are applied. Keep the displayed failure detail and
retry rather than assuming a selection reached the radio. A saved setting may
show a pending/restart requirement. Invalid new credentials are rejected without
replacing the saved configuration; an empty password can represent an open network.

## Internal flash, SD copies and deletion

Identity and configuration are authoritative in internal flash. An SD card is
optional, and its copies are not a complete backup of the device. Message storage
requires a verified committed copy; an optional mirror may need repair without
invalidating the committed record. Do not remove a card during an active operation.

The managed SD roots are `/ratdeck` (Deck), `/ratpager` (Pager) and `/ratcom`
(Cardputer). **Initialize SD** creates the required structure; **wipe SD data**
removes managed SD data, not unrelated files or internal device data. Data already
imported into internal flash, including contacts, can remain and later be mirrored
back. The startup SD-copy prompt has the same limited scope.

Conversation deletion is separate. It becomes effective when the durable deletion
record commits; a failed deletion keeps the conversation. Cleanup of an optional
mirror can still report an error after logical deletion has succeeded. Do not
interpret leftover files or a cleanup warning as an instruction to restore old
history over the device.

The firmware recognizes supported legacy storage, but it is not a universal
migration or backup-restoration tool. Preserve the original flash and SD backup,
and investigate a recovery error before formatting. Importing a private identity
key alone does not restore messages, contacts or settings.

## Restart, erase and recovery

Use the normal restart, mode-switch or confirmed shutdown action when available.
It waits for owned saves and transfers to settle. A failed maintenance action
stays failed; it does not silently continue erasing later. A forced restart or
power-off can lose pending work. On Cardputer, screen blanking is display-only.

**Erase Device / Factory Reset** is destructive. It includes internal device data
and the board's managed SD data if that medium was included when the reset began.
Keep power connected until completion. It is not a first response to a read error.

If a reset is interrupted, startup shows **Reset recovery** before normal identity
or settings loading. It does not automatically repeat the erase:

- **R** reviews the recorded scope; a fresh **Enter** confirms erasing that scope.
- **B** returns without confirming. **X** restarts and leaves reset pending.
- If the recorded scope includes an unavailable SD card, reinsert it to retry.
  A reset begun without SD does not erase a card inserted later.
- If the scope itself is unreadable, the screen explicitly offers a new scope
  for review. Do not confirm unless that is the data you intend to erase.

For other startup errors, note the exact message and keep the data intact. Check
power, the matching package and SD availability; a visible retry/restart is not
permission to format. [Download mode](./flashing-firmware.md#recovery-download-mode)
can restore a full backup or reinstall firmware, but reinstalling a factory
package can destroy the data you are trying to recover.
