---
sidebar_position: 1
---

# Ratspeak

Ratspeak is the desktop and mobile app for messaging over Reticulum. It combines private LXMF conversations, attachments, Offline Inbox, Channels, experimental voice calls and turn-based games with controls for the interfaces that carry them.

Private LXMF messages are encrypted to the recipient. Channels use a different model: the hub can read and relay room messages. See [Messaging and contacts](../using-ratspeak/messaging-and-contacts.md) before choosing a room for sensitive conversations.

## Get the app

The current public desktop/Android release is **1.0.40**. Use the [downloads page](https://ratspeak.org/download.html) or the [versioned GitHub release](https://github.com/ratspeak/Ratspeak/releases/tag/v1.0.40). iOS is available through the [public TestFlight channel](https://testflight.apple.com/join/AzzW4Jg6); check TestFlight for its offered build.

| Platform | Release packages | RNode connections in the app |
|---|---|---|
| macOS | Apple Silicon and Intel DMG | USB serial, BLE, TCP |
| Linux | amd64/arm64 DEB; x86-64 AppImage and RPM | USB serial, BLE, TCP |
| Windows | x64 EXE and MSI installers | USB serial, BLE, TCP |
| Android | arm64, armv7 and x86-64 APK | Supported USB host RNodes, BLE, TCP |
| iOS | TestFlight | BLE and TCP |

Bluetooth roles, background behavior and device permissions differ by platform. For installation and first launch, follow [Install and platform setup](../getting-started/install-and-platform-setup.md). For radio requirements, use [LoRa radio interfaces](../networking/lora-and-rnode.md).

## Inside the app

The desktop sidebar and mobile navigation arrange these features differently:

- **Messages and Contacts** hold conversations and saved peers. Messages include delivery state, attachments, search and formatting.
- **Channels** connect to a hub and its rooms. Joining, moderation and room access are separate from private LXMF delivery.
- **Peers** shows discovered messaging peers. An old announce or saved contact does not establish a current path.
- **Network** manages interfaces, paths, transport mode, Offline Inbox and Bluetooth Peer.
- **Settings** manages identities, backups, PIN protection, appearance and app preferences.
- [**Games**](../using-ratspeak/games.md) provides Chess, Tic-Tac-Toe and Four in a Row through [LRGP](lrgp.md).
- **Setup** handles the initial identity and backup. Identity management also remains available after setup.

A fresh app starts without a network interface. Add a path that fits your setup: local LAN discovery, a reachable TCP server, a nearby Bluetooth Peer or an RNode radio. Start with [Choosing your setup](../getting-started/choosing-your-setup.md).

## Voice calls

Calls use [rsLXST](rslxst.md) over a Reticulum Link and are experimental. A call can start from a conversation, contact or peer detail when the voice feature is available. A saved contact is not an outbound-call requirement.

Incoming calls are admitted for a saved contact or a direct zero-hop peer, subject to blocking and the call policy. A routed stranger cannot ring you merely because they know your address. Calls need a live path and suitable audio permissions; they are not delivered through Offline Inbox. Losing the Link's interface can end a call.

See [Voice calls](../using-ratspeak/messaging-and-contacts.md#voice-calls-experimental) for controls, microphone permissions, caller policy and current limits. This app behavior is narrower than everything the rsLXST library can support.

## Identity and local data

Back up a new software identity's **12-word recovery phrase** or export an encrypted `.rsi` identity backup. The phrase restores the identity, not its message history. A PIN protects the local software identity key and phrase; it does not encrypt the message database or attachment files.

Desktop builds also provide experimental YubiKey/PIV identities through [Ratkey](ratkey.md). Hardware-only and recoverable provisioning have different backup properties. Use [Settings and identity](../using-ratspeak/settings-and-identity.md) for the app's supported flows.

App state lives under `.ratspeak/` in the OS app-data directory. Active Reticulum configuration normally belongs to the selected identity at `identities/<identity_hash>/reticulum/config`; `RATSPEAK_RNS_CONFIG_DIR` can override it. See [Configuration reference](../reference/configuration-reference.md) for exact platform paths and storage scope. Use the app's export/import controls for identity transfer; copying an arbitrary key file is not a history migration procedure.

## Operators and developers

You do not need a separate `rnsd-rs` or `lxmd-rs` installation for ordinary app use. For an always-on transport node, Offline Inbox node or Channels hub, follow [Infrastructure and ops](../deployment/infrastructure-and-ops.md).

Ratspeak embeds its protocol libraries. Release 1.0.40 pins rsReticulum/rsLXMF sources with package version 1.4.0, which differ from the standalone 1.3.0 downloads. [Building from source](../reference/building-from-source.md) explains the exact five-repository source set and toolchains, including builds with voice disabled.

The Tauri frontend calls the Rust backend through app-internal commands and events. Those commands are a [contributor interface](../reference/tauri-ipc-reference.md), not a stable public SDK. Library consumers should start with the component APIs.

The app is published under the [Reticulum License](https://github.com/ratspeak/Ratspeak/blob/main/LICENSE). It bundles rsReticulum and rsLXMF, ports of Mark Qvist's reference implementations that carry his copyright under the same license, and voice uses rsLXST under his separate non-commercial LXST license; see [Licenses](../reference/licenses.md).
