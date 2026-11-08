---
sidebar_position: 6
---

# rsLXST

rsLXST is Ratspeak's voice component: the Rust port of LXST behind voice calls in the app and voice memos on the handhelds. A license for its use in Ratspeak is being arranged with its author; until then Ratspeak LLC grants no rights to it, and it is not offered as a library for other applications. If you want to make a call in Ratspeak, start with [Voice calls](../using-ratspeak/messaging-and-contacts.md#voice-calls-experimental); this page documents the component for Ratspeak development.

The most recent tagged source is [**0.3.0**](https://github.com/ratspeak/rsLXST/releases/tag/v0.3.0), targeting the implemented LXST **0.4.5** surface; the current license and README are on [`main`](https://github.com/ratspeak/rsLXST). It has no standalone `rnphone-rs` application. Ratspeak 1.0.40 pins a later coordinated source commit carrying the same package version; use the app's [dependency manifest](../reference/building-from-source.md) for app builds.

## Service boundary in Ratspeak

Ratspeak uses **`lxst_telephony::TelephonyService`** to register an `lxst.telephony` destination and drive calls, keeping its typed control/event channels and running the service. The [versioned API guide](https://github.com/ratspeak/rsLXST/blob/main/api/README.md) and [service example](https://github.com/ratspeak/rsLXST/tree/main/crates/lxst-telephony/examples) show that integration.

The service handles call setup, answer/reject/busy outcomes, hangup, timeouts, signalling, negotiated media profiles and stream teardown. Ratspeak still owns contact policy, microphone/speaker permissions, capture/playback, resampling, device routing, audio sessions, UI and background behavior.

An established call uses its exact Reticulum Link interface. Interface loss can end the call; media does not automatically switch to another radio. Local queue admission and best-effort media transmission are also different from remote receipt.

## Crates and codecs

| Crate | Role |
|---|---|
| `lxst-core` | Profiles, signalling, wire values, codec/stream processing and buffers. |
| `lxst-rns` | Reticulum Link packet boundary for LXST media and signalling. |
| `lxst-telephony` | Host call runtime and the service Ratspeak drives. |
| `lxst-embedded` | Bounded `no_std` protocol and media integration for Ratspeak's handhelds. |
| `lxst-codec2` | Native bounded Codec2 700C, 1600 and 3200 processing without an allocator. |

The component includes Opus voice profiles and Codec2 integration, including the ULBW/VLBW/LBW profile families. That capability does not establish that an arbitrary board has qualified audio timing, memory, transport or drivers; the embedded boundary needs device integration and validation.

The component does not supply a general platform microphone/speaker backend or complete parity with Python LXST's local audio graph. It is also not the app's Offline Inbox or voice-message container format.

## Build and compatibility

For standalone 0.3.0, use rsReticulum **1.3.0** as the sibling checkout specified by its Cargo manifest. The host workspace requires Rust **1.89+**; `lxst-codec2` and `lxst-embedded` retain separate Rust **1.87** minimums for the constrained targets.

The [README](https://github.com/ratspeak/rsLXST/blob/main/README.md) lists build prerequisites and local tests. Reference-interoperability tests have additional Python/reference-source requirements; they are not runtime dependencies of Ratspeak builds.

All rsLXST packages remain experimental. Ratspeak pins the source/dependency set and tests the profiles and target platforms it ships. rsLXST is ported from Mark Qvist's LXST, whose reference implementation is published under CC BY-NC-ND 4.0; a license for its use in Ratspeak is being arranged with him, and until it is in place no rights to the port are granted (see [Licenses](../reference/licenses.md)). `lxst-codec2` declares [LGPL-2.1-only, MIT and BSD-3-Clause terms](https://github.com/ratspeak/rsLXST/blob/main/crates/lxst-codec2/Cargo.toml).
