---
sidebar_position: 6
---

# rsLXST

rsLXST provides experimental LXST telephony and media support for Rust applications using Reticulum. If you want to make a call in Ratspeak, start with [Voice calls](../using-ratspeak/messaging-and-contacts.md#voice-calls-experimental); this page is for library users.

The current standalone source release is [**0.3.0**](https://github.com/ratspeak/rsLXST/releases/tag/v0.3.0), targeting the implemented LXST **0.4.5** surface. It has no standalone `rnphone-rs` application. Ratspeak 1.0.40 pins a later coordinated source commit carrying the same package version; use the app's [dependency manifest](../reference/building-from-source.md) for app builds.

## Application boundary

Use **`lxst_telephony::TelephonyService`** to register an `lxst.telephony` destination and drive calls. Keep its typed control/event channels and run the service. The [versioned API guide](https://github.com/ratspeak/rsLXST/blob/v0.3.0/api/README.md) and [service example](https://github.com/ratspeak/rsLXST/tree/v0.3.0/crates/lxst-telephony/examples) show that integration.

The service handles call setup, answer/reject/busy outcomes, hangup, timeouts, signalling, negotiated media profiles and stream teardown. Applications still own contact policy, microphone/speaker permissions, capture/playback, resampling, device routing, audio sessions, UI and background behavior.

An established call uses its exact Reticulum Link interface. Interface loss can end the call; media does not automatically switch to another radio. Local queue admission and best-effort media transmission are also different from remote receipt.

## Crates and codecs

| Crate | Role |
|---|---|
| `lxst-core` | Profiles, signalling, wire values, codec/stream processing and buffers. |
| `lxst-rns` | Reticulum Link packet boundary for LXST media and signalling. |
| `lxst-telephony` | Host call runtime and application service. |
| `lxst-embedded` | Bounded `no_std` protocol and media integration for constrained applications. |
| `lxst-codec2` | Native bounded Codec2 700C, 1600 and 3200 processing without an allocator. |

The release includes Opus voice profiles and Codec2 integration, including the ULBW/VLBW/LBW profile families. That library capability does not establish that an arbitrary board has qualified audio timing, memory, transport or drivers. The embedded boundary needs application integration and device validation.

The library does not supply a general platform microphone/speaker backend or complete parity with Python LXST's local audio graph. It is also not the app's Offline Inbox or voice-message container format.

## Build and compatibility

For standalone 0.3.0, use rsReticulum **1.3.0** as the sibling checkout specified by its Cargo manifest. The host workspace requires Rust **1.89+**; `lxst-codec2` and `lxst-embedded` retain separate Rust **1.87** minimums for their constrained use.

The [versioned README](https://github.com/ratspeak/rsLXST/blob/v0.3.0/README.md) lists build prerequisites and local tests. Reference-interoperability tests have additional Python/reference-source requirements; they are not runtime dependencies for an application using the Rust library.

All rsLXST packages remain experimental. Use the API guide's service boundary, pin the source/dependency set, and test the profiles and target platforms your application will use. The host crates use [AGPL-3.0-or-later](https://github.com/ratspeak/rsLXST/blob/v0.3.0/LICENSE); `lxst-codec2` declares [LGPL-2.1-only, MIT and BSD-3-Clause terms](https://github.com/ratspeak/rsLXST/blob/v0.3.0/crates/lxst-codec2/Cargo.toml).
