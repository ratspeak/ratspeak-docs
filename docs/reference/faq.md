---
sidebar_position: 4
---

# Frequently asked questions

## What is Ratspeak?

Ratspeak is a desktop and mobile app for messaging over Reticulum. Private LXMF messages can travel over supported internet, local-network, Bluetooth, and radio interfaces without a phone number or a centrally registered account. The app also has hub-based channels, voice, and turn-based games.

## Do I need internet to use it?

No. Compatible local-network, Bluetooth, or RNode radio connections can carry Reticulum traffic without internet. Both sides still need a usable path. Radio range depends on the hardware, antennas, settings, terrain, and interference; a LoRa connection does not guarantee coverage across a particular distance.

## What hardware do I need?

For internet or local-network use, start with a supported computer or phone. Configure a connection in **Network → Connections**; a fresh install does not automatically join a public TCP server. For LoRa, you need a compatible RNode and a supported connection between it and Ratspeak. Check [Interfaces overview](../networking/interfaces-overview-and-design.md) and the hardware guide for your exact device before buying or flashing it.

## What is Reticulum, and what is LXMF?

Reticulum provides networking, routing, and encrypted links across its interfaces. LXMF (Lightweight Extensible Message Format) carries messages over Reticulum. Ratspeak can exchange LXMF messages with compatible clients such as Sideband and NomadNet. Features such as formatting, reactions, voice messages, and games depend on support in both clients; plain-message interoperability does not imply identical features.

## How is it encrypted? Who can read my messages?

Private LXMF messages are encrypted for their recipient. Intermediate transport and Offline Inbox nodes forward or store encrypted data rather than receiving the private-message plaintext. They can still observe traffic timing, size, and activity on their connections. Message contents are available on the sending and receiving devices, so device access, backups, and copied keys also matter.

**Channels have a different boundary:** the hub can read and relay channel messages. Do not use a channel as a substitute for a private conversation. See [Messaging and contacts](../using-ratspeak/messaging-and-contacts.md) and [Security and privacy](../concepts/cryptography-and-protection.md).

## Is Ratspeak anonymous?

It is pseudonymous. Your address is derived from cryptographic keys rather than a phone number, but that does not guarantee anonymity. Announced names and profile information are visible to nodes that receive them. A TCP server can observe the IP address connecting to it, and network observers may correlate timing or radio activity. See [Security and privacy](../concepts/cryptography-and-protection.md) before relying on a particular privacy property.

## What is my identity, exactly?

Your identity is a set of cryptographic keys. Ratspeak derives its LXMF messaging address from that identity. New software identities have a 12-word recovery phrase; older imported keys may not. A PIN protects the stored software key and phrase, but does not encrypt the message database. Desktop hardware identities keep private-key operations on a supported YubiKey. See [Settings and identity](../using-ratspeak/settings-and-identity.md).

## How do I move my identity to a new device?

Use **Import or Restore Identity** with the 12-word recovery phrase, or import a PIN-encrypted `.rsi` backup exported from the old device. These restore the identity, not messages, contacts, or app settings. Raw Reticulum key exports are unencrypted and need the same protection as a recovery phrase. For full-profile backup and migration precautions, see [Backing up and migrating](../using-ratspeak/settings-and-identity.md#backing-up-and-migrating).

## What is the maximum attachment size?

There is no single size that is safe for every path and recipient. Ratspeak checks its sending limit, the recipient may reject larger messages, and an Offline Inbox node can impose its own transfer limit. Ratspeak's **Limit incoming messages to 1 MB** setting is on by default. It applies to incoming messages and attachments, not just the file you select.

Keep radio attachments small. For supported photos, choose a smaller size in the app before sending. See [Attachments](../using-ratspeak/messaging-and-contacts.md#attachments).

## Where are my settings stored?

Ratspeak stores app settings, contacts, and message history in its local SQLite database. Reticulum interface configuration is also stored in files within the app's data area. Use **Settings** and **Network** for normal changes; see [Settings and identity](../using-ratspeak/settings-and-identity.md#backing-up-and-migrating) for backups. Do not assume that copying one configuration file backs up your identity or conversations.

## What is auto-announce, and what is the default?

An announce advertises your destination and public identity information so other nodes can learn a route to you. Auto-announce defaults to **30 minutes**. Change it under **Settings → Network → Auto-Announce**, or turn it off and announce manually. Offline Inbox retrieval is a separate operation: your app asks the inbox node for waiting messages.

## Can I run Ratspeak on a server or headless?

The public Ratspeak app is a graphical client. For an always-on headless transport or Offline Inbox, use the `rnsd-rs` and `lxmd-rs` tools from [rsReticulum](../products/rsreticulum.md) and [rsLXMF](../products/rslxmf.md). See [Infrastructure and operations](../deployment/infrastructure-and-ops.md) for setup.

## Can I run my own Offline Inbox node?

Yes. An Offline Inbox is an LXMF propagation node. Ratspeak can host one through **Settings → Offline Inbox → Hosted Offline Inbox**, except with hardware-key identities. For an always-on server, use `lxmd-rs` with propagation enabled. Keep the device powered and reachable; mobile background restrictions can interrupt hosting. See [Offline Inbox](../using-ratspeak/network-and-peers.md#offline-inbox) and [Infrastructure and operations](../deployment/infrastructure-and-ops.md).

## What happens if the recipient is offline when I send a message?

Auto delivery first tries to reach the recipient live. If that fails and a usable Offline Inbox is enabled, Ratspeak can store the encrypted message there for later pickup. **Stored in Offline Inbox** confirms the inbox node accepted it; it does not confirm the recipient received it. Without a usable live path or inbox, delivery fails. See [Delivery states](../using-ratspeak/messaging-and-contacts.md#delivery-states).

## Why are the public Ratspeak servers TCP addresses?

They provide an entry into Reticulum over an IP network. They are transport connections, not accounts you sign into. You can select one in **Network → Connections → Internet/TCP**, use another operator's server, or run your own. In the app, **Official** identifies a Ratspeak-operated server; it is not a guarantee of uptime or anonymity. A transport server cannot decrypt private LXMF message content, but it can observe its own connections.

## Why does my first launch warn about an unidentified developer?

macOS Gatekeeper or Windows SmartScreen may warn about an app that the operating system does not recognize. Check that the download came from the official release before allowing it to run. Follow the current platform instructions in [Installation](../getting-started/install-and-platform-setup.md); signing and packaging status can differ between releases.

## How do I get the mobile app?

Use the [official download page](https://ratspeak.org/download.html) for the current mobile distribution links. Android APKs are available from the public GitHub release. The download page links to TestFlight for iOS; availability there is separate from the desktop and Android release assets.

## Can I make voice calls with Ratspeak?

Yes. Voice calls are experimental and require a live Reticulum path between both devices. Calls are accepted from contacts or direct zero-hop peers. Voice quality and available controls depend on the path; constrained calls use **Hold to talk**.

You can also record and send a voice message through LXMF. Unlike a call, it can use Offline Inbox delivery. See [Voice calls](../using-ratspeak/messaging-and-contacts.md#voice-calls-experimental) and [Voice messages](../using-ratspeak/messaging-and-contacts.md#voice-messages).

## What games are there?

**Chess**, **Tic-Tac-Toe**, and **Four in a Row**. They exchange turn-based actions over LXMF using LRGP, so the players do not need a separate game server. See [Games](../using-ratspeak/games.md) for challenges, delivery failures, and session expiry.

## Can I play games with people on Sideband or NomadNet?

Both clients need compatible LRGP game support for interactive play. A client without it may display fallback text such as `[LRGP TTT] Move 3`, but that text is not an interactive board. This is separate from exchanging ordinary LXMF messages.

## Is my YubiKey or Nitrokey supported?

Ratspeak's experimental desktop hardware-key flow is designed for supported YubiKey 5-class PIV tokens. It can provision, register, unlock, and manage those identities. Do not assume another token is supported merely because it implements PIV. Mobile uses software identities. See [Hardware keys](../using-ratspeak/settings-and-identity.md#hardware-keys-yubikey) for recovery and reset precautions.

## Is Ratspeak free and open source?

Yes. The Ratspeak app is published under AGPL-3.0-or-later. Related libraries, documentation, and hardware designs have their own licenses; check the license in the repository you intend to use or modify. Contributions and bug reports belong in the relevant project's repository.

## Where can I get help?

Start with [Getting started](../getting-started/your-first-session.md) or [Troubleshooting](troubleshooting.md). The [support page](https://ratspeak.org/support.html) lists current help routes. For an app bug, include your Ratspeak version, operating system, and the steps that reproduce it. Do not include recovery phrases, private keys, PINs, or shared-instance control keys in a report.
