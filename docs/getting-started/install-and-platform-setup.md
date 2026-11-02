---
sidebar_position: 2
---

# Install and platform setup

Install Ratspeak for your platform, then use [Your first session](your-first-session.md) to create or restore an identity and add a network connection. The app includes its networking runtime; it does not require a separate Reticulum daemon or Python installation.

## Download

Get installers from [ratspeak.org/download.html](https://ratspeak.org/download.html) or the [Ratspeak releases page](https://github.com/ratspeak/Ratspeak/releases). Choose the package for your operating system and processor. Release notes and checksum files are attached to the release.

For source builds and platforms without a suitable installer, see [Building from source](../reference/building-from-source.md).

## macOS

1. Download the `.dmg` for **Apple Silicon** (`arm64`) or **Intel** (`x64`).
2. Open it and drag **Ratspeak.app** into **Applications**.
3. Eject the disk image and open Ratspeak from Applications or Spotlight.

If macOS cannot verify the app, first check that you downloaded it from the release links above. After trying to open it, go to **System Settings → Privacy & Security** and use **Open Anyway** for Ratspeak, then confirm the prompt. Apple's [instructions for opening downloaded apps](https://support.apple.com/en-us/102445) explain the available warnings and controls.

## Linux

The release provides an x86_64 AppImage and RPM, plus `amd64` and `arm64` Debian packages. Choose the format your distribution uses and match its processor architecture. A Linux package's availability does not mean every distribution or board has been tested.

Run these examples in the folder containing your download. If several versions match a wildcard, use the exact downloaded filename instead.

**AppImage (x86_64):**

```bash
chmod +x ./Ratspeak-*-linux-x86_64.AppImage
./Ratspeak-*-linux-x86_64.AppImage
```

**Debian/Ubuntu (amd64):**

```bash
sudo apt install ./Ratspeak-*-linux-amd64.deb
```

For a supported 64-bit ARM system, use the `arm64` package and substitute `arm64` in that command.

**Fedora (x86_64):**

```bash
sudo dnf install ./Ratspeak-*-linux-x86_64.rpm
```

Use your distribution's package manager for other RPM-based systems. Debian and RPM installations add an application-menu entry. An AppImage runs from the file you downloaded. If a package cannot start or reports missing dependencies, check [Troubleshooting](../reference/troubleshooting.md).

## Windows

Download the Windows x64 `.exe` or `.msi` installer and follow its prompts. If SmartScreen identifies it as an unrecognized app, check the download source before choosing **More info → Run anyway**, if that option is available. Managed-device policy may prevent an override.

The published `.exe` and `.msi` packages do not provide the Bluetooth Peer advertiser/peripheral role. Use a connection supported by your setup and check [Bluetooth interfaces](../networking/bluetooth-interfaces.md) for the distinction between Bluetooth Peer and a Bluetooth RNode radio.

## iOS

Install Apple's TestFlight app, then open the [Ratspeak public beta invitation](https://testflight.apple.com/join/AzzW4Jg6) on your iPhone or iPad. Follow TestFlight's prompts to install and update Ratspeak. If a build expires, check TestFlight for a newer build; beta builds have a limited testing period.

Allow **Local Network** access when using local-network discovery and the Bluetooth or microphone permissions needed by the features you enable. For LoRa, use a compatible Bluetooth RNode or an RNode TCP bridge on a reachable network. The iOS app does not expose general USB serial radio access.

Mobile background limits can interrupt connectivity. Keep Ratspeak in the foreground while testing your first connection or troubleshooting delivery. Source builders should use the [iOS build instructions](../reference/building-from-source.md).

## Android

1. Download the APK for your device from the download page or GitHub release. Most current phones use `arm64`; releases also provide `armv7` and `x86_64` packages.
2. Open the file. If Android asks, allow your browser or file manager to install apps from that source.
3. Select **Install**, then open Ratspeak.

Allow the Bluetooth, microphone or USB-device permissions needed by the connections and features you use. A USB radio also requires a data-capable cable or adapter and a device with USB host support.

## Microphone permission (voice calls)

Ratspeak includes experimental voice calling through [rsLXST](../products/rslxst.md). Allow microphone access when prompted. If you previously denied it, enable access in the operating system's privacy/app settings and try the call again.

Permission alone does not establish an audio route or a connection to the other caller. See [Messaging and contacts](../using-ratspeak/messaging-and-contacts.md) for calling and [Troubleshooting](../reference/troubleshooting.md) for audio problems.

## First launch (security warnings)

The macOS, Windows and Android sections above cover their installation prompts. Their appearance depends on the package, OS version and device policy. If a warning reports malware, a damaged file or an unexpected publisher rather than an unrecognized download, stop and check the download against the release before proceeding.

After installation, follow [Your first session](your-first-session.md). A new identity still needs an enabled interface before it can reach peers.

## Where your data lives

Default desktop data folders are:

| Platform | Path |
|---|---|
| macOS | `~/Library/Application Support/org.ratspeak.desktop/.ratspeak/` |
| Linux | `~/.local/share/org.ratspeak.desktop/.ratspeak/` |
| Windows | `%APPDATA%\org.ratspeak.desktop\.ratspeak\` |

These are the standard locations; platform configuration or an explicit data-directory override can change them. The folder contains private identity material, the message database and configuration. Quit Ratspeak completely before copying it for a desktop backup, and protect the copy as you would the original keys. Closing the window may leave the app running; use the app or tray **Quit** command where available.

The active identity's Reticulum configuration normally lives at `identities/<identity-hash>/reticulum/config` inside that folder. An explicit `RATSPEAK_RNS_CONFIG_DIR` override changes this location. Its shared-instance ports default to `37430` and `37431`, separate from the usual standalone Reticulum ports `37428` and `37429`. Do not assume the app uses Python Reticulum's `~/.reticulum/` or rsReticulum's `~/.rsReticulum/` state.

For identity export, recovery phrases and restore limits, see [Settings and identity](../using-ratspeak/settings-and-identity.md). A recovery phrase does not back up conversations. Removing the data folder can lose identity keys and messages; it is not a routine update step.

## Updating

In **Settings**, choose **Check for updates** next to the version. After you confirm, Ratspeak contacts GitHub and shows the available release information. **Get Update** opens the release; the app does not install it automatically. On iPhone and iPad, use TestFlight.

Before updating, retain your identity backup and read the release notes for compatibility or migration instructions. Quit Ratspeak completely, install the newer package using the same installation method, and reopen it. Keep the existing app data; do not uninstall and erase data as an update procedure. Confirm the version in Settings and check that your identity and conversations are present.

## Next

Continue with [Your first session](your-first-session.md). For a custom build, use [Building from source](../reference/building-from-source.md).
