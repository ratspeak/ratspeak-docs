---
sidebar_position: 2
---

# Install and platform setup

Ratspeak is a single application: no separate daemon, no web server, no Python runtime. Pick your platform below, install it, and you're done.

## Download

Ratspeak v1.0.20 is published as a normal public release. Start at [ratspeak.org/download.html](https://ratspeak.org/download.html), or use the [GitHub releases page](https://github.com/ratspeak/Ratspeak/releases) directly. If you want to inspect or package the code yourself, use [Building from Source](../reference/building-from-source.md).

## macOS

1. Download the `.dmg` from the download page or GitHub release (Apple Silicon or Intel — match your Mac).
2. Open the `.dmg`. Drag **Ratspeak.app** onto the **Applications** folder shortcut.
3. Eject the disk image.
4. Launch Ratspeak from Applications or Spotlight.

## Linux

Pick whichever Linux release format fits your distro:

- **`.AppImage`** — most portable, works on essentially any modern distro. After downloading, make it executable and run it:
  ```bash
  chmod +x Ratspeak-*.AppImage
  ./Ratspeak-*.AppImage
  ```
- **`.deb`** — Debian, Ubuntu, Mint, Pop!_OS. Use `amd64` for x86_64 PCs and `arm64` for 64-bit Raspberry Pi OS, Armbian, Ubuntu, or Debian on Raspberry Pi / Orange Pi:
  ```bash
  sudo apt install ./Ratspeak-*.deb
  ```
- **`.rpm`** — Fedora, RHEL, openSUSE:
  ```bash
  sudo dnf install ./ratspeak-*.rpm
  ```

Once installed via `.deb` or `.rpm`, Ratspeak shows up in your application menu. AppImages run in place — drop them anywhere on your `$PATH` if you want to launch from a terminal.

## Windows

Use the Windows installer from the download page or GitHub release. If multiple Windows package types are available, use the MSIX build when this machine needs the Bluetooth Peer advertiser/peripheral role; Windows only exposes the Bluetooth capability Ratspeak uses from the packaged app. The `.msi` and `.exe` builds are fine for normal desktop use, TCP, I2P, serial radios, and RNode work, but they do not provide the Bluetooth Peer advertiser/peripheral role.

## iOS

Ratspeak for iPhone and iPad is available as a TestFlight public beta. Install Apple's TestFlight app, then open the [iOS TestFlight Public Beta](https://testflight.apple.com/join/AzzW4Jg6) link on your device and follow the prompts to install. App Store distribution will come later. To build it yourself instead, see [Building from Source](../reference/building-from-source.md).

iOS does not support general USB serial from third-party apps, so LoRa on iPhone and iPad uses Bluetooth RNode hardware or an RNode TCP bridge on a reachable local network. Signed Ratspeak builds include the approved multicast capability, but users must still grant Apple's Local Network permission. Notifications require user permission, and background execution remains subject to iOS lifecycle limits.

## Android

- Download the `.apk` from [ratspeak.org/download.html](https://ratspeak.org/download.html) or the GitHub release.
- Open the file. Android will ask permission to install from an unknown source — grant it for your browser or file manager.
- Tap **Install**.

Public Play Store distribution will replace this for most users once the listing is ready.

## Microphone permission (voice calls)

Public Ratspeak builds include an experimental voice call surface on top of [rsLXST](../products/rslxst.md). The first time you place or answer a call, the OS prompts for microphone access:

- **macOS** — Ratspeak appears under System Settings → Privacy & Security → Microphone.
- **Windows** — Ratspeak appears under Settings → Privacy & Security → Microphone.
- **Linux** — most distros do not gate microphone access per app; Ratspeak uses the default PulseAudio or PipeWire input device.
- **Android** — Ratspeak requests `RECORD_AUDIO` (plus `MODIFY_AUDIO_SETTINGS` for routing) the first time you place or answer a call.
- **iOS** — Ratspeak appears under Settings → Privacy & Security → Microphone. The first call also requires the `NSMicrophoneUsageDescription` prompt to be accepted.

Granting permission once is enough. If you deny it on the first prompt and the OS never asks again, toggle the permission manually in system settings, then place a fresh call. See [Messaging & Contacts](../using-ratspeak/messaging-and-contacts.md) for how the call surface behaves in the app, and [Troubleshooting](../reference/troubleshooting.md) for the common voice issues.

## First launch (security warnings)

Ratspeak's installers aren't yet code-signed and notarized, so each OS will ask you to confirm the first time you run it. This is a one-time prompt.

- **macOS** — Open Ratspeak once; macOS blocks it and says it could not verify the app. Click **Done**, then go to **System Settings → Privacy & Security**, scroll to the Security section, and click **Open Anyway** next to the Ratspeak message. Confirm with your password, then click **Open Anyway** again. Subsequent launches work normally.
- **Windows** — SmartScreen shows "Windows protected your PC." Click **More info**, then **Run anyway**.
- **Linux AppImage** — needs `chmod +x` (shown above). No further prompt.
- **Android** — "For your security, your phone is not allowed to install unknown apps from this source." Tap **Settings**, allow the source, then return and install.

## Where your data lives

Ratspeak stores its identity keys, message database, and config in the OS-standard data directory under a `.ratspeak/` subfolder:

| Platform | Path |
|---|---|
| macOS | `~/Library/Application Support/org.ratspeak.desktop/.ratspeak/` |
| Linux | `~/.local/share/org.ratspeak.desktop/.ratspeak/` |
| Windows | `%APPDATA%\org.ratspeak.desktop\.ratspeak\` |

The app-private Reticulum config is inside that folder at `reticulum/config`
and defaults to shared-instance ports `37430`/`37431`. It is separate from a
system Reticulum install using ports `37428`/`37429`, such as Python
Reticulum's `~/.reticulum/config` or rsReticulum's `~/.rsReticulum/config`.

Back this folder up to preserve your identity and messages. Deleting it resets Ratspeak to a fresh install.

## Updating

Choose **Check for updates** next to the version number in Settings. Ratspeak asks before contacting GitHub, then shows the release notes if a newer version is out.

Ratspeak doesn't update itself. Install the newer release from the download page or GitHub releases over the top; your data folder is left untouched. On iPhone and iPad, updates come through TestFlight.

## Next

Once Ratspeak launches, continue to [Your First Session](../getting-started/your-first-session.md).

If you want to review the code, package the current tree yourself, or build for a platform without a public artifact, use [Building from Source](../reference/building-from-source.md). It covers the sibling repo layout, Rust and Tauri prerequisites, desktop bundles, Android APKs, iOS builds, and the standalone `rnsd-rs` / `lxmd-rs` daemons.
