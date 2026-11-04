---
sidebar_position: 5
---

# Troubleshooting

These checks cover Ratspeak **1.0.40**. Record your version and platform before
trying a workaround; older builds can have different behavior. Handheld advice
is listed separately below.

## macOS says "unidentified developer" on first launch

Check that you downloaded the app from the [Ratspeak release page](https://github.com/ratspeak/Ratspeak/releases), and compare its checksum with the matching release file. If you trust this specific download and macOS offers an exception, use **System Settings → Privacy & Security → Open Anyway**, as described in [Apple's instructions](https://support.apple.com/en-us/102445). If macOS reports malware or a damaged download, keep the exact warning for your report rather than treating it as the same problem.

## Linux AppImage won't run

Make it executable first:

```bash
chmod +x Ratspeak-*.AppImage
./Ratspeak-*.AppImage
```

The AppImage mounts itself with FUSE. It does not need the FUSE 2 library (`libfuse2`), only a `fusermount` program. If it reports `No suitable fusermount binary found on the $PATH` or another FUSE error, install your distribution's FUSE 3 package, which provides `fusermount3`:

- Debian and Ubuntu: `sudo apt install fuse3`
- Fedora: `sudo dnf install fuse3`
- Arch: `sudo pacman -S fuse3`

Where FUSE is unavailable, for example in a container, run it without mounting:

```bash
./Ratspeak-*.AppImage --appimage-extract-and-run
```

Setting `APPIMAGE_EXTRACT_AND_RUN=1` does the same. The AppImage then extracts to a temporary directory on every launch and removes it on exit, so it starts more slowly.

## AppImage shows a blank window or no window

Two problems fixed in Ratspeak 1.0.40; update if you use an older AppImage:

- On newer distributions, such as Arch, Fedora 44, and Ubuntu 26.04, the window opens blank and the terminal shows `Could not create default EGL display: EGL_BAD_PARAMETER`. This happens under X11 too.
- On niri, or another Wayland compositor without Xwayland, no window appears.

From 1.0.40, the AppImage uses your system's Wayland libraries and runs natively on Wayland. If a Wayland session still misbehaves, launch it once under X11 and include the result in your report:

```bash
GDK_BACKEND=x11 ./Ratspeak-*.AppImage
```

The `.deb` and `.rpm` packages use the system libraries and were not affected.

## Voice memos or ringtones are silent in the AppImage

AppImages before 1.0.40 did not bundle the GStreamer media plugins that voice-memo playback and ringtones use. Update to 1.0.40 or later, or use the `.deb` or `.rpm` package, which uses your system's GStreamer.

## Gray or blank window on Linux

Start with the rendering diagnostic, which prints the environment and exits:

```bash
ratspeak --webview-diag
```

For an AppImage, replace `ratspeak` with the path to that AppImage. Include this
output, your desktop/compositor and GPU in the report.

Current Ratspeak applies its DMA-BUF workaround only on Wayland with WebKitGTK
older than 2.46. Before trying a different setting, remove any renderer overrides
you previously added to your launcher or shell. To test whether the app's own
workaround is responsible, launch once with:

```bash
RATSPEAK_DISABLE_WEBKIT_DMABUF_WORKAROUND=1 ratspeak
```

This affects that launch only. Record whether it changes the symptom; do not
combine several renderer overrides at once. Tauri's
[Linux graphics troubleshooting](https://v2.tauri.app/develop/debug/linux-graphics/)
provides further graphics-specific checks.

On NixOS, use a package/build environment that supplies the required native
libraries. A downloaded DEB is not a Nix package. See
[Building from source](building-from-source.md) for the exact source set and
packaging reference.

## Two title bars under Sway, Hyprland, or niri

Check **Settings → System → Window Decorations**. **Auto** uses the detected desktop session; **On** and **Off** override it. From 1.0.40 this also applies to the AppImage, which now runs natively on Wayland. If Auto chooses incorrectly, include the output of `ratspeak --webview-diag` in your report.

## Windows SmartScreen blocks the installer

SmartScreen checks download reputation as well as publisher information, so an unrecognized-app warning can also appear for signed software. Check the exact installer against the [official release](https://github.com/ratspeak/Ratspeak/releases) and its checksum before deciding whether to run it. Use **More info** to inspect the warning; on a managed computer, your organization may control whether an exception is available. See [Microsoft's explanation of SmartScreen reputation](https://learn.microsoft.com/windows/apps/package-and-deploy/smartscreen-reputation).

## App is slow to start the first time

Let the startup screen finish before retrying an action. A new profile also needs identity setup; identity creation happens when you choose **Create Identity**. If the screen stops progressing, record its message and how long it has remained there. A repeated stall after reopening the app needs investigation; it is not something to ignore indefinitely.

## Messaging says service unavailable or not initialized

During startup or an identity switch, messaging calls can return `service_unavailable`, `database_unavailable`, or `lxmf_not_initialized`. Wait until setup finishes and the app is responsive, then retry. If it persists after a restart, collect logs as described in [Still stuck](../reference/troubleshooting.md#still-stuck).

## I can't see any peers

Walk through these in order:

1. Open **Network** and confirm at least one interface is enabled and connected. A fresh app profile does not connect an interface for you.
2. **AutoInterface**: both ends must be on the same LAN. Many corporate WiFi networks and guest SSIDs block multicast — try a wired connection or a different network.
3. **TCP**: confirm you can reach the host and port (`nc -zv host port`). Check the remote side has a TCPServer interface listening on that port.
4. **LoRa**: check frequency, spreading factor, bandwidth and compatible packet format. Start with matching presets; in explicit-header mode, the header communicates the payload coding rate. See [LoRa settings](../networking/lora-and-rnode.md#tunable-parameters). Also check that IFAC settings match if you use them.

## My RNode doesn't show up in "Add LoRa Device"

- **macOS / Linux**: serial devices need user permissions. On macOS, check for a serial device such as `/dev/cu.usbserial-*` or `/dev/cu.usbmodem*`; the name depends on its USB interface. On Linux, the `.deb` and `.rpm` packages install a udev rule, `/usr/lib/udev/rules.d/70-ratspeak.rules`, that gives the user signed in at the computer access to common USB-serial radios. With the AppImage, copy [`70-ratspeak.rules`](https://github.com/ratspeak/Ratspeak/blob/v1.0.40/src-tauri/resources/linux/70-ratspeak.rules) to `/etc/udev/rules.d/`, then run `sudo udevadm control --reload && sudo udevadm trigger`. If you installed an older rule yourself, compare it with the current rule before changing your udev setup. Without the rule, add yourself to the group that owns serial ports, `dialout` on most distributions or `uucp` on Arch (`sudo usermod -aG dialout $USER`), then log out and back in.
- **Windows**: install the CP210x or CH340 driver matching your RNode's USB chip. Check Device Manager for an unknown COM device.
- **iOS**: USB radios are not supported. Use a BLE-equipped RNode from **Network → Add LoRa Device → Bluetooth**, or use the TCP tab if your RNode stream is exposed on a reachable local endpoint. Follow the pairing prompt shown for that connection.
- Bad cables look identical to good ones. If nothing else works, try a different USB cable — many shipped with devices are charge-only.

## Android Bluetooth RNode stays on "Initializing RNode"

Update to 1.0.40 if you are on an older build. Releases since 1.0.37 include setup
fixes for ESP32 Bluetooth RNodes on older Android versions and show the RNode PIN
prompt inside Ratspeak. Put the radio into pairing mode and use its PIN. Keep the
exact failure text: pairing failures, timeouts and an unresponsive radio are
different problems. If initialization still stalls, also record the Android
version and radio firmware. You can pause a connecting/reconnecting radio before
adding another. See [Bluetooth interfaces](../networking/bluetooth-interfaces.md).

## Messages aren't delivering

A few things to check:

- **Check the delivery method and status.** Direct delivery needs a reachable recipient. Propagated delivery needs a usable Offline Inbox node and later pickup by the recipient. A message deposited at a node is not the same as confirmed delivery to the recipient. See [Messaging & Contacts](../using-ratspeak/messaging-and-contacts.md).
- **The current path is unknown.** A saved contact or old announce does not establish a current path. Open the contact and tap **Request Path**, or use a configured Offline Inbox node that you can reach.
- **No connected path.** You need a Reticulum path to the recipient or the chosen propagation node. Another interface or transport node can help only if it connects to that network; an arbitrary TCP server may not.

## I lost my identity

Use the app's **Import / Restore** flow if you have its recovery phrase, a
Ratspeak identity backup, or a compatible Reticulum private key. A PIN-encrypted
`.rsi` backup also needs its backup PIN. An identity restore does not restore
message history or app settings.

For a PIN-protected identity, the PIN is not recoverable from the app. A recovery
phrase or separate exported key can restore the identity without that original
PIN. A hardware-backed identity needs its hardware key; its private key is not
exportable. See [Settings & Identity](../using-ratspeak/settings-and-identity.md)
for the appropriate restore method.

If no usable key material, phrase or backup remains, create a new identity and
share its new messaging address with your contacts. Do not copy files into an
active profile or delete the database to attempt a restore.

## Auto-Announce isn't broadcasting

1. **Settings → Network → Auto-Announce** must not be set to **Off**.
2. At least one interface must be enabled and connected. If all interfaces are red, there's nothing to announce on.
3. Use **Network → Announce** to test a manual announce. Check the reported status rather than assuming it was transmitted immediately; network limits and connection state still apply.

## Bluetooth Peer sees nothing

- On both devices, open **Network** and use **+** beside **Bluetooth Peer** to enable it.
- Both devices need OS-level Bluetooth permission. On iOS and recent Android, the OS prompts on first scan; if you denied, grant it under system settings.
- Move the devices close together while testing; walls, interference and the adapters affect range.
- Windows advertising needs a packaged Bluetooth peripheral capability. The public 1.0.40 downloads are EXE/MSI, with no MSIX download. Do not rely on that Windows installation being discoverable; test with the other device advertising, and report any peripheral-unavailable message.
- On Linux, the `bluetooth` service must be running (`systemctl status bluetooth`), the user must have BlueZ permissions, the adapter must support LE advertising, and BlueZ must allow the requested peripheral role. Follow your distribution's BlueZ guidance if it refuses advertising.

## I can't reach a public Ratspeak TCP server

Ruby (`1.ratspeak.org:4141`), Emerald (`2.ratspeak.org:4242`), and Diamond (`3.ratspeak.org:4343`) are best-effort public Ratspeak infrastructure with no uptime guarantee. The legacy endpoint `rns.ratspeak.org:4242` is an alias for Emerald. In the app, "Official" means the server is managed by Ratspeak; "Unofficial" means it is operated by a third party. If one is unreachable:

- Try another public Ratspeak server, or a different community hub from [Reticulum's current connect/backbone information](https://reticulum.network/connect.html) or from a community directory you trust.
- Run your own TCPServer on a small VPS — it's a single interface block in the config.
- Connect peer-to-peer over a different transport (LoRa, BLE, AutoInterface on a shared LAN).

## Path not found for a contact you've messaged before

Reticulum forgets stale paths. Open the contact and tap **Request Path**, or wait for the next announce from the recipient. If the recipient went offline, a reachable Offline Inbox/propagation node can still hold encrypted mail for later pickup.

## "Ratspeak is already open"

Another Ratspeak app is using the same data, for example a second build started with `RATSPEAK_DATA_DIR` pointing at it. Only one app can open the data at a time, so the second one stops at this screen and changes nothing. Quit the other app, then open Ratspeak again.

On a network or virtual drive that can't lock files, Ratspeak can't tell that another app has the data open. It starts with a warning instead: open it from only one app, on one device, at a time.

## "Update Ratspeak"

The data was saved by a newer version of Ratspeak, for example before an older build was reinstalled. An older version can't use it safely, so it stops at this screen without writing to the database. Install the latest version to open your data again.

## "Database is locked"

Only one copy of Ratspeak can use its data at a time; a second copy stops at the ["Ratspeak is already open"](#ratspeak-is-already-open) screen. Quit any other copies (check the system tray and any leftover processes), then relaunch. Don't delete `ratspeak.db-wal`: it can hold recent messages that are not yet in `ratspeak.db`. If the error persists after a clean restart, collect logs as described in [Still stuck](#still-stuck).

## Peers or Network views are laggy with many nodes

Filter out **Discovered** peers you have never spoken to, or narrow the interface/status filters while diagnosing a large mesh. Large announce tables are normal on busy networks; narrow what is shown rather than deleting what the router has learned.

## Voice call button never appears

The call action needs a build with the `lxst-voice` feature and a running voice service. It can appear in a conversation, contact details or peer details; you do not have to save the recipient first. A call already in progress elsewhere disables another call action.

Public builds enable voice by default. If you deliberately built without default features, rebuild with voice enabled using [Building from source](building-from-source.md). Keep the `rsLXST` sibling in the source layout for either build.

## Microphone permission was denied

Voice calls need OS-level microphone access. Calling or answering checks microphone permission; later calls can reuse permission already granted.

- **macOS** — System Settings → Privacy & Security → Microphone → enable Ratspeak.
- **Windows** — open **Settings → Privacy & security → Microphone**, enable microphone access and **Let desktop apps access your microphone**. The EXE/MSI app may not have its own toggle. See [Microsoft’s microphone permissions guide](https://support.microsoft.com/en-us/windows/privacy/turn-on-app-permissions-for-your-microphone-in-windows).
- **Linux** — most distros do not gate microphone access per-app at the OS level. If audio capture still fails, check your PulseAudio / PipeWire input device and that no other app holds an exclusive handle on it.
- **Android** — Settings → Apps → Ratspeak → Permissions → enable Microphone.
- **iOS** — Settings → Privacy & Security → Microphone → enable Ratspeak.

If the prompt does not return after a denial, grant permission in the OS settings and try again.

## Incoming call surface never opens

A few things to check:

- **You are not a contact yet.** Ratspeak rings for saved contacts or recognized direct peers. A recent zero-hop announce or a cached zero-hop path can establish that direct-peer status. Save the caller on the receiving device and try again.
- **The spam guard rejected repeated unknown callers.** Ten policy-rejected calls from a non-contact/non-direct identity within the rejection window can create a blackhole; this is not a count of how often you press Decline. Open **Network → Blackholes** and remove the entry if it was a mistake.
- **You blocked the contact.** Ratspeak rejects that contact’s incoming call and can add a network blackhole when the call arrives. If you unblock a trusted caller, also check for and remove a related blackhole that would still reject the call.
- **The voice stack is not running.** Reopen the app — the call surface comes online once the LXST service has started.

## Call connects but there is no audio

- Confirm both sides granted microphone permission (see above).
- Check your OS default audio input and output, and the app’s mute/speaker controls. The microphone path tries the default input first, then other available inputs if it fails.
- On Linux, confirm PulseAudio or PipeWire actually exposes the device you expect (`pactl info`, `pactl list short sinks`, `pactl list short sources`).
- On Android, a denied microphone permission leaves an established call in listen-only mode. Grant the permission before speaking; Ratspeak promotes microphone capture only while the active call needs it.
- Copy any microphone or speaker error shown in the call status when filing a report.

## High latency on LoRa

LoRa delivery time depends on radio settings, message size, hops, contention and retries. Compare both ends' settings and test a short message over one hop first. A faster preset changes the link budget and must be selected on both ends; use settings permitted for the hardware and location. Do not judge delivery solely by a fixed timeout or resend repeatedly while a message is still queued.

## Ratspeak Handheld

For **Ratspeak Handheld 2.3.4 beta**, start with the [handheld guide](../hardware/handheld-guide.md) and the page for your board. The M9 has a Standalone image only; mode and hardware instructions for other boards do not automatically apply.

- **T-Pager frequency is hard to change:** open **Settings → Device → Developer
  Radio Controls** and hold the encoder as prompted. Return to **Settings → LoRa
  → Frequency**. A/D selects the
  digit, the encoder tunes it, Enter saves and Alt+Backspace cancels. See the
  [Pager controls](../products/rspager.md#select-a-frequency-without-touch).
- **Cardputer has no LoRa:** Cardputer Adv requires the Cap LoRa-1262. Check that
  module and the matching antenna before investigating networking. Wi-Fi and a
  saved TCP endpoint do not supply a missing radio.
- **Sent but not delivered:** `sent` is a transport-start indication; only a
  verified proof produces `delivered`. A late/lost proof can leave a received
  message unconfirmed. Check the path and matching radio settings; repeated
  resends create separate outgoing records.
- **Save retry, storage error or unavailable history:** keep the exact detail,
  allow the pending operation to settle, and check the SD card if used. Do not
  format merely to clear a warning. A valid delivery proof and an unsaved status
  can coexist.
- **Reset recovery at boot:** the reset did not complete. Normal identity loading
  is intentionally paused. Review the recorded scope before confirming another
  erase; restarting alone leaves it pending. Follow the
  [recovery guide](../hardware/handheld-guide.md#restart-erase-and-recovery).

For a handheld report, include the board/radio model, firmware repository/version,
mode, displayed error and relevant serial log. Keep private identity files, whole
flash backups and Wi-Fi passwords out of reports.

## Closing the Linux window quits Ratspeak

In 1.0.40, Ratspeak can run even when a tray cannot be installed. In that case,
closing the window quits instead of hiding it. Keep the window open if you need
Ratspeak running, and check your desktop's tray support if you expected a tray icon.

## Still stuck

Include the Ratspeak version, OS version, device/radio model, connection type,
exact error, steps to reproduce it, and whether reopening changes the result.
The [issue tracker](https://github.com/ratspeak/Ratspeak/issues) is suitable for
reproducible non-sensitive bugs. Keep private keys, backup phrases and PINs out
of reports.

Production process logging is off by default. On desktop, a support session can
launch the app from a terminal with diagnostics enabled, for example on Linux:

```bash
RATSPEAK_DIAGNOSTICS=1 ratspeak
```

This enables diagnostic output for that process. To also create a desktop log
file, set `RATSPEAK_DIAGNOSTIC_FILE=1` for the same launch. `RUST_LOG` controls
verbosity only after diagnostics is enabled. File logs use the local data
location, which is different from the Windows profile's roaming directory:

- macOS: `~/Library/Application Support/Ratspeak/logs/ratspeak.log`.
- Linux: `$XDG_DATA_HOME/Ratspeak/logs/ratspeak.log`, or
  `~/.local/share/Ratspeak/logs/ratspeak.log`.
- Windows: `%LOCALAPPDATA%\Ratspeak\logs\ratspeak.log`.

An ordinary Android or TestFlight release does not promise process logs.
For an enabled diagnostic build, Android's Rust log tag is `RatspeakRust`
(`adb logcat -s RatspeakRust`); iOS uses the `org.ratspeak.apple` logging subsystem.
Coordinate mobile diagnostics with the maintainer rather than assuming a desktop
shell variable reaches an installed phone app.

Review any output before sharing it. Paths, addresses, filenames and network
information may still be sensitive even when message bodies are not logged.
