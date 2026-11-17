---
sidebar_position: 3
---

# Settings and identity

Your identities have their own **Identity** page, with your recovery phrase, PIN, and export in one place. Open it from the sidebar, from **More** on a phone, or from **Settings → General → Identity**. **Settings** holds how Ratspeak sends, looks, notifies, and connects. Back up an identity before deleting it or resetting a hardware key.

## Settings at a glance

Settings has nine sections:

| Section | What it holds |
| --- | --- |
| **General** | **Identity**; under **Messages**, **Keep trying to send**, **Limit incoming messages to 1 MB**, **Paper messages**, and **Message titles**; **Channel hosting**; **Vibration** on a phone; and **Window** on Linux and Windows desktops (**Tray icon** and **Window decorations** on Linux, **Close button** on Windows) |
| **Appearance** | **Theme**, **Color mode**, and **Text size** |
| **Notifications** | **Notifications**, **Previews**, and, on Android, **Background battery access** |
| **Privacy and blocking** | **Blocked people**, **Hide known spam peers**, **Protect Activity identities**, **Announce Ratspeak features**, and **Trusted websites** |
| **Network** | **Auto-announce**, **Relay for other devices**, **Reconnect radios** on Android, **Discovery**, **Private network**, **Network stamps**, and **Links** |
| **Offline Inbox** | Which inbox (an LXMF propagation node) to use, and hosting one |
| **Storage** | Clearing routes and peers, deleting messages and contacts, and **Reset Ratspeak** |
| **Developer** | **Developer mode** and **Reticulum on this device** |
| **About** | The version, **Check for updates**, the policies, and **Licenses** |

**Shut down**, below the sections (not on iPhone or iPad), stops all network and Ratspeak services and closes the app. On Android this also ends its background service, so nothing keeps running until you open Ratspeak again.

## Your identity

Your identity lets you keep the same address when you restore it on another device. It is based on cryptographic keys: the public keys identify you on Reticulum, and the private key lets you act as that identity. Applications derive their own destination addresses from it; give contacts your **LXMF address** for messaging. Keep the private-key material secret. See [Security and privacy](../concepts/cryptography-and-protection.md) for the cryptographic details.

Software identities live under your OS data directory:

```
<data>/.ratspeak/identities/<hash>/
```

For an unprotected software identity, the private key is stored as `identity`. If you set a PIN, the private key is stored as `identity.enc` instead. New recoverable identities also keep recovery-phrase material so it can be shown again later: plaintext beside an unprotected key, or encrypted inside the same PIN vault once a PIN is set. Hardware-key identities store metadata in `identity.hwid`; the private key stays on the YubiKey and is not exportable.

This material controls your identity on the network. Anyone with the private key, recovery phrase, or an unlocked hardware key can impersonate you and sign announces in your name. Back it up; never share it.

When you create a new software identity, Ratspeak derives it from a **12-word recovery phrase** (BIP-39). Reveal the phrase, write it down, then check the acknowledgement that you have stored it safely before continuing. It is how you restore the same identity on another device. You can view the phrase again later on the Identity page, and you can seal the on-disk key and stored phrase behind a **PIN**. See *Recovery phrase* and *PIN protection* below.

The Identity page lists your identities, with **In use** on the active one. Select one for its **Profile** (your status), **Security and backup**, **Addresses** (its LXMF address and identity hash), and **Details**. **Share contact card** shows the card others scan to add you.

## Names

If you leave the name empty, Ratspeak names the identity with a verb and an animal, like Leaping Frog, picked from its LXMF address. Identities still named `!Ratspeak.org-…` by earlier versions take their new name when you update.

To rename the identity in use, choose **Rename** (the pencil beside its name), enter up to 32 characters, and choose **Rename**. Ratspeak announces the new name and stops using the old one everywhere it was shared, including channel nicknames and saved hubs that still use it. Names you set for a single hub stay.

## Multiple identities

You can keep several identities side by side. **Add identity**, the **+** on the Identity page or the last row of its list on a phone, offers **Create identity**, **Import or restore**, and, on desktop, **Add hardware key**. To change identity, select it and choose **Switch to this identity**. Each identity has its own:

- destination hash and LXMF address
- contact list and conversation history
- Offline Inbox mode and any manually pinned propagation-node hash

Common reasons to run more than one: a public identity for community channels and a private one for close contacts; separate identities for separate roles (operator, club call sign, personal); a throwaway identity for testing.

Only one identity is active at a time. Switching stops the previous identity's live network session and starts the selected one. Do not expect the inactive identity to receive live messages in the background. Messages already stored locally remain with their identity; mail left at an Offline Inbox can be checked after switching back. The auto-announce interval is an app setting, not a separate schedule for each identity.

Your first identity can't be deleted. To start over with only one identity, use **Settings → Storage → Reset Ratspeak**.

## Recovery phrase

New software identities are derived from a 12-word BIP-39 recovery phrase, shown at creation. Write the words down in order and keep them offline — anyone with them controls your identity. The backup acknowledgement confirms that you have saved the phrase; it does not test the words you recorded. Check your copy carefully before continuing.

**Viewing it again.** Ratspeak keeps the phrase on this device so you can show it again for the identity in use: on the Identity page, choose **View** beside **Recovery phrase**. Its at-rest protection matches the identity key's: for an unprotected identity it is stored in plaintext beside the key file, and Ratspeak asks you to confirm before showing it; once you set a **PIN**, the phrase is encrypted in the same vault and showing it requires the PIN. This is for **software** identities only — a hardware (YubiKey) identity keeps its keys on the token and has no stored phrase.

**Copying it.** A copied phrase stays out of clipboard history where the system allows it and leaves the clipboard after a minute, counting time the device slept, unless you copied something else since; on desktop it also goes when Ratspeak quits. On iPhone and iPad it is not shared with your other devices. Android hides the clipboard from apps in the background, so while Ratspeak is in the background it clears the clipboard after that minute even if you copied something else.

To restore an identity on a new device (or after a reinstall), choose **Restore an identity** on first setup, or **Import or restore** on the Identity page, then **Recovery phrase**, and enter the 12 words. This works on every platform, including mobile, and produces the exact same identity and address. On desktop, the same phrase can also restore a recoverable identity onto a YubiKey.

A recovery phrase restores **your identity, not your message history, contacts, or app settings**. Those are stored separately on the device. Restoring the same address does not reconstruct a lost conversation database; see [Backing up and migrating](#backing-up-and-migrating).

Identities created before the recovery-phrase system have random keys with no phrase; they keep working, but Ratspeak cannot retroactively invent a phrase for them. Back those up with a PIN-encrypted `.rsi` export, a raw Reticulum identity export, or a full data-directory backup.

## PIN protection

You can protect a software identity's stored key with a **PIN**. Ratspeak encrypts the on-disk key with a key derived from your PIN (Argon2id + authenticated encryption). This protects the key and stored recovery phrase at rest. It does **not** encrypt the message database or prevent someone using an already-unlocked session. Use your device's storage encryption and screen lock to protect local conversations and backups. Set it on the Identity page under **Security and backup**: choose **Set PIN** beside **PIN**. **Change PIN** changes it, and its dialog has **Remove PIN**. A new software identity can also be PIN-protected at creation with **Protect with a PIN**.

The PIN is required when Ratspeak loads the protected identity: at launch, and again after you switch to another identity and back. It is not asked for per message, when its screen reopens, or when Ratspeak restarts the same identity's network. On Android, the runtime can remain unlocked in the background after the task is removed; reopening its screen resumes that same session. **Auto-lock** can lock it again once a set time has passed since you unlocked it.

Ratspeak cannot recover a forgotten PIN. A separately saved 12-word phrase can recreate a recoverable identity, so keep it outside the locked vault. For an older identity without a phrase, keep a separately usable backup: for example, a `.rsi` export with its own known backup PIN, or a securely stored raw private-key export. A copy of the same PIN-encrypted profile still needs that PIN; it does not recover a forgotten one.

## Auto-announce

An announce tells the network you exist and how to reach you. Reticulum needs to hear an announce from you (or learn a path from someone who has) before anyone can route to you.

Pick an interval in **Settings → Network → Auto-announce**:

- **Never** — announce only when you choose
- **15 minutes**, **30 minutes** (default), **1 hour**
- **Custom…** — any value from 1 to 48 hours

The default is 30 minutes. Shorter intervals make you reachable faster after a network change but use more bandwidth and battery; longer intervals are friendlier on constrained links like LoRa.

A manual announce is always available, regardless of the auto-announce setting: **Announce** in the Network view or on the desktop Home, or a long press on the phone's tab bar. Use it after plugging in a new radio, switching networks, or when someone says they can't reach you.

## Network policy

**Settings → Network** holds **Auto-announce** and **Relay for other devices**, then **Discovery**, **Private network**, **Network stamps**, and **Links**. Changes in those last four restart the network for a moment. The connections themselves are in the **Network** tab, where you add, turn on or off, pause, and edit them. Offline Inbox has its own Settings section.

**Relay for other devices** is Reticulum's transport mode. It is **Off** by default. **On** allows forwarding for other peers; **Automatic** relays only when the configured interfaces and network meet its conditions. See [Network and peers](network-and-peers.md#transport-mode) for the conditions, for [discovered servers](network-and-peers.md#discovered-servers-and-radios) and [private networks](network-and-peers.md#private-networks), and for the Developer controls used with another local Reticulum instance. On Android, **Reconnect radios** lets Bluetooth radios reconnect on their own.

**Network stamps** has two switches, both off by default. **Stamp my announces and path requests** lets nodes that require stamps pass yours on, and uses some battery. **Require stamps from others** asks the same of other nodes; older software doesn't stamp, so nodes running it aren't heard.

**Links → Link MTU discovery** uses larger packets on fast links, so transfers finish sooner. It is on by default.

Some interfaces offer a network name and passphrase (IFAC) to restrict participation in a shared network. All participants must use matching settings. This is separate from the end-to-end encryption of private LXMF messages. See [Interfaces overview](../networking/interfaces-overview-and-design.md) for interface-specific settings and announce limits. Changing a connection can interrupt current transfers.

## Bluetooth Peer

Turn on **Bluetooth Peer** in **Network**. This connects compatible nearby devices directly; it is separate from connecting to an RNode over Bluetooth. It stays on for 30 minutes unless you change **Stay on for**. Range, central/peripheral roles, and permissions depend on the platform and adapter.

The public Windows `.exe` and `.msi` installers do not provide Bluetooth Peer advertising. Do not rely on two such installations discovering each other as peripherals. See [Bluetooth interfaces](../networking/bluetooth-interfaces.md) for platform support and setup.

## Sending

**Settings → General → Keep trying to send** is on by default. A message that can't be sent now waits, marked with an hourglass, and Ratspeak tries again for up to 24 hours. It goes when the recipient is heard, when your network or Offline Inbox is back, or when you choose **Try now** from its menu. **Stop trying** ends it. See [Delivery states](messaging-and-contacts.md#delivery-states).

**Settings → General → Limit incoming messages to 1 MB** is on by default. It refuses larger incoming messages and attachments. This is a receiver setting, so a file that your app can send may still exceed the recipient's limit. Agree on a suitable size before sending a large file, especially over radio.

**Settings → General → Paper messages** is off by default. With it on, the new-message button also offers **Open a paper message**, for messages shared as a QR code or link. Sending a paper message and opening a paper link work either way; see [Paper messages](messaging-and-contacts.md#paper-messages).

**Settings → General → Message titles** is off by default. With it on, the message box has a **Title** line above **Message…**, and the title goes out with the message as its LXMF title. A message with a title shows it in bold above the text, whether this setting is on or not.

## Notifications and background connection

**Settings → Notifications → Notifications** keeps Ratspeak's notification preference separate from the operating system permission. If permission has not been requested, use **Allow**; after a denial, use **Open Settings** to change it at the OS level, and once it is granted, **Review** opens the OS setting. Turning Ratspeak notifications off hides those permission actions without changing the OS setting.

**Previews** chooses what an alert shows: **Name and message**, **Name only**, or **Neither**. A call alert always shows who is calling. On Android and iOS, switching to another identity, an Auto-lock, removing the active hardware identity or a reset removes the alerts that are still shown.

On Android, **Background battery access** shows the current OS battery-optimization status, not a saved Ratspeak on/off preference. Choose **Review** to open Android's battery controls. Exempting Ratspeak from battery optimization can help background connections but may increase battery use. Android or the device maker can still stop the app; this does not guarantee delivery after a force stop, reboot, or OS process termination.

## Appearance

**Settings → Appearance → Theme** picks the colors: **Ratspeak**, **Nord** (the default), **Everforest**, **Gruvbox**, **Catppuccin**, or **Rosé Pine**. **Color mode** offers **Light**, **Dark**, and **System** (follows your system setting). Both apply instantly to every view.

**Text size** makes text smaller or larger, from 90% to 150%. It changes the text only, not buttons or touch targets.

## Privacy and blocking

**Settings → Privacy and blocking → Blocked people** lists the people you blocked, with **Unblock**. **Hide known spam peers** hides bridge-style IDs you haven't saved or messaged.

**Protect Activity identities** hides names and addresses in Activity until you reveal them. **Announce Ratspeak features** controls whether your announcements tell others you can play games and take calls. Neither setting makes a public announce anonymous.

**Trusted websites** lists the sites you chose **Don't ask again** for when opening a message link. Remove a site to be asked again. See [Opening links](formatting-messages.md#opening-links).

## Storage

**Settings → Storage** clears caches with **Clear routes** (routes rebuild on their own) and **Clear peers** (peers come back as they announce). **Delete all messages**, **Delete all contacts**, and **Delete messages and contacts** remove data from this device; deleted data can't be brought back. **Reset Ratspeak** deletes identities, messages, contacts, and settings. Back up your identity first.

## Hardware keys (YubiKey)

On **desktop**, you can back an identity with a YubiKey 5-class PIV token instead of a private-key file: private-key operations use the token, and the app unlocks it with your PIN once per session. Set one up with **Use a hardware key** on first setup, or **Add hardware key** on the Identity page. Choose **Recoverable** (a 12-word phrase backup that can restore the same identity) or **Key only** (no backup; losing or resetting the key loses the identity). Hardware identities use the same Reticulum identity format as software identities. This support is still labeled experimental.

**Auto-lock** shows on the Identity page when an identity has a PIN, on a hardware key or as a passcode, and applies to all of them. It locks the identity once the set time (**5 minutes** to **1 hour**) has passed since you unlocked it, counting time the device slept, so a lock that fell due during sleep happens within seconds of waking; using the app does not reset it. It locks even when the network is stopped or could not start. While it is locked, its messages and contacts stay hidden until you unlock it again. Changes apply on the next unlock. Setting or changing the open identity's PIN starts the time over, and removing the PIN ends Auto-lock for it. **Off** disables the timeout; switching identities or restarting Ratspeak still locks the identity.

Hardware keys are **desktop-only** for now (the token transport relies on the desktop PC/SC stack). On **mobile**, use a software identity and bring it across with your recovery phrase — hardware-key setup is not available there. Re-provisioning or resetting a token overwrites its Ratspeak PIV keys, so Ratspeak warns before it would destroy an identity already on the key. Resetting the PIV application removes its user keys and certificates, including those used by other software, and restores the default PIV credentials. Check what else uses that token before proceeding. On supported YubiKey 5 tokens, this reset does not target the separate FIDO/passkey or OTP applications.

Hardware-key private keys cannot be exported as a Reticulum identity file or Base32 key. If you chose Recoverable, use the 12-word phrase to restore. If you chose Key only, the token is the only copy.

## Backing up and migrating

Choose the backup according to what you need to restore:

| Backup | Restores | Does not restore |
| --- | --- | --- |
| 12-word recovery phrase | The same recoverable identity and address | Messages, contacts, app settings |
| PIN-encrypted `.rsi` export | A software identity, its identity metadata, and its recovery phrase if one exists | Messages, contacts, app settings |
| Full app-data backup | The local profile, including the database and identity files | An attached hardware key, or external services and configuration stored elsewhere |

For an identity export, choose **Export…** on the Identity page and pick **Ratspeak backup**. The export asks for authorization with the identity's PIN, or confirmation if it has no PIN. Choose a separate backup PIN and keep it safely: the backup file and that PIN together allow someone to use the identity. **Reticulum identity file** and **Reticulum key as text** (base32) are available for compatibility, but are unencrypted private keys.

On the destination device, use **Restore an identity** during setup, or **Import or restore** on the Identity page, and choose the corresponding backup type: **Ratspeak backup**, **Reticulum identity key**, or **Recovery phrase**. After restoring, check that the LXMF address matches the old device before giving it to contacts. Hardware identities cannot be exported as private-key files; use a recoverable identity's separately saved phrase, or register the existing token on the other desktop.

For a full local backup, quit Ratspeak completely before copying its `.ratspeak` folder. It is under the app's platform-specific data directory; a custom `RATSPEAK_DATA_DIR` changes the parent location. Preserve the whole folder, including the database, identity subdirectories, and files. Keep the copy encrypted: a PIN on an identity does not encrypt the conversation database.

Ratspeak 1.0.44 and earlier can't open data used by 1.1.0, so keep a backup from before the update if you may need to go back.

Do not overwrite a destination profile that contains data you need. Keep both originals and verify a restored copy before retiring the old device. File paths and access to app storage differ across operating systems, especially on mobile; use identity import when you only need the identity, and obtain platform-specific migration guidance before moving a complete profile between systems. Copying an identity subdirectory alone is not a supported substitute for importing it and does not bring its database history or contacts.
