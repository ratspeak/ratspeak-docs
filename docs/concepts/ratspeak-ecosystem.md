---
sidebar_position: 1
---

# Ratspeak ecosystem

Ratspeak includes the desktop/mobile app, Rust networking and messaging libraries, and handheld firmware. Choose the app or device you want to use first; you do not need to install every layer separately.

For messaging, start with [Choosing Your Setup](../getting-started/choosing-your-setup.md). For an always-on transport or Offline Inbox node, use [Infrastructure & Ops](../deployment/infrastructure-and-ops.md).

## How the pieces stack

- **rsReticulum** handles packets, identities, announces, paths, links, resources and interfaces. It also supplies `rnsd-rs` and the command-line tools.
- **rsLXMF** adds signed messages, delivery methods, propagation storage, stamps and tickets. Ratspeak provides the conversation UI above it.
- **rsLXST** is the experimental voice/media layer over Reticulum. Ratspeak supplies the platform audio handling for its calls.
- **Ratspeak** embeds those libraries and LRGP in one desktop/mobile app. It also offers Channels through hubs; these have a different privacy model from private LXMF conversations.
- **Ratspeak Handheld** is the unified firmware for T-Deck Plus, T-Pager, Cardputer Adv and M9. Its protocol core uses rsReticulumLite and rsLXMFLite. The earlier rsDeck, rsPager and rsCardputer repositories are historical projects.
- **LRGP** carries turn-based game messages in LXMF fields. Ratspeak includes Chess, Tic-Tac-Toe and Four in a Row.
- **LXMFace** is a standalone deterministic avatar library.
- **Hardware identities** use the `rns-ratkey` PIV integration in desktop Ratspeak. The token performs private-key operations; mobile Ratspeak uses software identities.

## Quick reference

The table lists current releases; the app builds on the same protocol releases.

| Component | Role | Start here |
|---|---|---|
| [Ratspeak](../products/ratspeak.md) | App; public release 1.1.0, plus the iOS TestFlight channel | [Install & Platform Setup](../getting-started/install-and-platform-setup.md) |
| [rsReticulum](../products/rsreticulum.md) | Rust networking stack and node tools; release 1.5.0 | [Infrastructure & Ops](../deployment/infrastructure-and-ops.md) |
| [rsLXMF](../products/rslxmf.md) | Rust messaging library and `lxmd-rs`; release 1.5.0 | [Infrastructure & Ops](../deployment/infrastructure-and-ops.md) |
| [rsLXST](../products/rslxst.md) | Experimental voice component; release 0.4.0 | Library README and API reference |
| [Ratspeak Handheld](../hardware/handheld-guide.md) | Beta firmware 2.3.5; supported modes depend on board | [Flashing firmware](../hardware/flashing-firmware.md) |
| [LRGP](../products/lrgp.md) | Standalone Rust/Python game protocol implementations | [Games](../using-ratspeak/games.md) |
| [LXMFace](../products/lxmface.md) | Avatar library for application developers | Library README |
| [Ratkey](../products/ratkey.md) | Experimental hardware identity work and the desktop PIV integration | [Settings & Identity](../using-ratspeak/settings-and-identity.md) |

Ratspeak 1.1.0 bundles rsReticulum 1.5.0, rsLXMF 1.5.0, and rsLXST 0.4.0, following Reticulum 1.6.0, LXMF 1.3.0, and LXST 0.6.0. The app's dependency manifest selects their exact commits; developers should build from it, as explained in [Building from source](../reference/building-from-source.md).

## For users

The app manages its network and identity through its own UI. A standalone handheld can message without a phone; RNode mode instead makes supported hardware a radio for a host app. M9 has a Standalone image only in handheld 2.3.5.

Ratspeak can exchange LXMF messages with other Reticulum clients such as Sideband and NomadNet when there is a path and both applications support the content being sent. App-specific games, voice or Channels are separate capabilities.

## For operators

Run `rnsd-rs` with transport enabled to forward for other nodes. Add `lxmd-rs` with propagation enabled to store recipient-encrypted messages for later pickup. A Channels hub is another role: it reads and relays room messages, so do not treat it as an opaque Offline Inbox node.

## For developers

Use rsReticulum for networking, rsLXMF for messaging, LRGP for game messages, or LXMFace for avatars. Each repository's README and API reference describe its integration boundary. rsLXST, the voice component, is licensed for Ratspeak only and is not offered for other applications (see [Licenses](../reference/licenses.md)). The app embeds these pieces; its internal Tauri commands are not a stable replacement for the library APIs.
