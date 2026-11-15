---
sidebar_position: 6
---

# rsLXST

rsLXST is Ratspeak's voice component: the Rust port of LXST behind voice calls in the app and voice memos on the handhelds. Its author licenses the port for use in Ratspeak only, for non-commercial use, with no derivatives or use outside Ratspeak; it is not offered as a library for other applications. If you want to make a call in Ratspeak, start with [Voice calls](../using-ratspeak/messaging-and-contacts.md#voice-calls-experimental); this page documents the component for Ratspeak development.

The current release is [**0.4.0**](https://github.com/ratspeak/rsLXST/releases/tag/v0.4.0), which targets LXST **0.6.0** and builds on rsReticulum 1.5.0. Ratspeak 1.1.0 uses it; use the app's [dependency manifest](../reference/building-from-source.md) for app builds. It has no standalone `rnphone-rs` application.

## Service boundary in Ratspeak

Ratspeak uses **`lxst_telephony::TelephonyService`** to register an `lxst.telephony` destination and drive calls, keeping its typed control/event channels and running the service. The [API guide](https://github.com/ratspeak/rsLXST/blob/v0.4.0/api/README.md) and [service example](https://github.com/ratspeak/rsLXST/tree/v0.4.0/crates/lxst-telephony/examples) show that integration.

The service handles call setup, answer/reject/busy outcomes, hangup, timeouts, signalling, negotiated media profiles and stream teardown. Ratspeak still owns contact policy, microphone/speaker permissions, capture/playback, resampling, device routing, audio sessions, UI and background behavior.

Calls connect as in LXST 0.6.0. A call can be full or half duplex and switch between them while it runs; `TelephonyControl::Call` takes the mode, and `None` means full duplex. The callee is established as soon as it answers, a lost setup packet no longer ends the call, and `audio_started` says when audio is running. An outgoing call ends if the callee doesn't ring within `connect_timeout`, 5 seconds by default, and the line is busy while a call looks for its path. The service sends its first announce 5 seconds after it starts.

Call announces and link requests carry [network stamps](../reference/configuration-reference.md#stamps) when Reticulum's `[stamps]` settings ask for them, and call Links use Link MTU discovery.

An established call uses its exact Reticulum Link interface. Interface loss can end the call; media does not automatically switch to another radio. Local queue admission and best-effort media transmission are also different from remote receipt.

## Crates and codecs

| Crate | Role |
|---|---|
| `lxst-core` | Profiles, signalling, wire values, codec/stream processing and buffers. |
| `lxst-rns` | Reticulum Link packet boundary for LXST media and signalling. |
| `lxst-telephony` | Host call runtime and the service Ratspeak drives. |
| `lxst-embedded` | Bounded `no_std` protocol and media integration for Ratspeak's handhelds. |
| `lxst-codec2` | Native bounded Codec2 700C, 1600 and 3200 processing without an allocator. |

The component includes Opus voice profiles and Codec2 integration, including the ULBW/VLBW/LBW profile families. Its `opus-rs` 0.1.42 dependency fixes a decoder crash on a crafted packet, and a damaged frame is skipped instead of dropping its whole packet. `lxst-embedded` sessions use LXST 0.6.0's ring, wait, and connect times, which `SessionConfig::times` changes. That capability does not establish that an arbitrary board has qualified audio timing, memory, transport, or drivers; the embedded boundary needs device integration and validation.

The component does not supply a general platform microphone/speaker backend or complete parity with Python LXST's local audio graph. It is also not the app's Offline Inbox or voice-message container format.

## Build and compatibility

rsLXST 0.4.0 uses rsReticulum **1.5.0** (`~1.5.0`) as the sibling checkout specified by its Cargo manifest. Its default storage builds a bundled SQLite, so builds need a C compiler. The host workspace requires Rust **1.89+**; `lxst-codec2` and `lxst-embedded` retain separate Rust **1.87** minimums for the constrained targets. API changes, including the removed answer retry, call modes, and async outgoing link calls, are in the [migration guide](https://github.com/ratspeak/rsLXST/blob/v0.4.0/api/migrations/next.md).

The [README](https://github.com/ratspeak/rsLXST/blob/v0.4.0/README.md) lists build prerequisites and local tests. Reference-interoperability tests have additional Python/reference-source requirements; they are not runtime dependencies of Ratspeak builds.

All rsLXST packages remain experimental. Ratspeak pins the source/dependency set and tests the profiles and target platforms it ships. rsLXST is ported from Mark Qvist's LXST, whose reference implementation is published under CC BY-NC-ND 4.0; the port is used under his [LXST license](https://github.com/ratspeak/rsLXST/blob/main/LICENSE) for Ratspeak, non-commercial use only, with no derivatives or use outside Ratspeak (see [Licenses](../reference/licenses.md)). Builds that include it are non-commercial. `lxst-codec2` declares [LGPL-2.1-only, MIT and BSD-3-Clause terms](https://github.com/ratspeak/rsLXST/blob/main/crates/lxst-codec2/Cargo.toml).
