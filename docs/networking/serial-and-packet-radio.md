---
sidebar_position: 4
---

# Serial and packet radio

Serial interfaces carry Reticulum over a cable or a compatible modem/TNC. Match the framing and serial settings to both endpoints. These configuration details target **standalone rsReticulum 1.3.0**; Ratspeak 1.0.40 exposes a smaller set of radio setup controls, described below.

## Why serial interfaces matter

A serial connection can reach hardware that has no IP stack. The serial port is only the carrier: both ends still need to agree on frame boundaries and, for a radio, on its modulation and channel-access settings.

Before connecting a modem, establish whether it expects Reticulum's HDLC-style framing, KISS, AX.25 inside KISS, or the RNode control protocol. A LoRa-capable board is not automatically an RNode or a generic KISS TNC.

## SerialInterface

`SerialInterface` already adds **HDLC-style framing**. It does not write unframed Reticulum packets to the port. Use it when the other endpoint implements the same framing.

| Key | Meaning |
|---|---|
| `port` | Device path, such as `/dev/ttyUSB0`, `/dev/cu.usbserial-XXXX` or `COM3`. |
| `speed` | Baud rate; the standalone default is `9600`. |
| `databits` | Data bits; normally `8`. |
| `parity` | `none`, `even` or `odd` (`N`, `E`, `O` also work). |
| `stopbits` | Stop bits; normally `1`. |

Both ends must use matching settings. A mismatch can corrupt or prevent frames; this framer is not a promise of error correction or a separate CRC.

## KISSInterface (TNCs and LoRa modems)

`KISSInterface` communicates with a compatible KISS TNC over serial. KISS frames use delimiter `0xC0` and escape byte `0xDB`. Confirm that the firmware supplies the framing and radio behavior you need; “LoRa modem” alone does not establish compatibility.

In addition to serial settings, the interface accepts:

| Key | Purpose | Standalone default |
|---|---|---|
| `preamble` | Transmit delay, in milliseconds. | `350` |
| `txtail` | Transmit tail, in milliseconds. | `20` |
| `persistence` | p-persistence channel-access value. | `64` |
| `slottime` | CSMA slot time, in milliseconds. | `20` |

Match these to the TNC and the shared channel. Defaults cannot establish that a particular radio or local channel plan is suitable.

Automatic callsign beacons have a limitation in rsReticulum 1.3.0: when both `id_interval` and `id_callsign` are configured and the callsign is shorter than 15 bytes, traffic can arm a timer that keeps triggering beacons on later idle checks after the interval expires. Omit either key to disable this automatic feature.

## AX.25 KISS (amateur radio)

`AX25KISSInterface` wraps Reticulum packets in AX.25 frames carried by a KISS TNC. Configuration includes `callsign` and `ssid` (`0`–`15`) alongside the serial/TNC settings.

A callsign header does not make encrypted traffic permissible on an amateur band, and AX.25 is not universally required for every amateur transmission. Check the rules for the service and country before transmitting. For example, US amateur rules restrict messages encoded to obscure their meaning and separately prescribe station identification: [47 CFR 97.113](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97/subpart-B/section-97.113) and [97.119](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97/subpart-B/section-97.119).

## HDLC

In this release, HDLC is the shared **framing implementation**, not a separate `HDLCInterface` configuration type. Serial, TCP and Pipe interfaces use its delimiter/escaping scheme: `0x7E` marks frame boundaries, and `0x7D` escapes reserved bytes using XOR `0x20`.

Use `type = SerialInterface` for this framing over a serial cable. A custom bridge must preserve those frame boundaries and escaping; it cannot send arbitrary unframed bytes and expect the receiver to recover packets.

## PipeInterface

`PipeInterface` starts a subprocess and exchanges HDLC-framed data over the child's stdin/stdout. It can connect Reticulum to a custom bridge without adding a new interface driver.

The required key is `command`; `respawn_delay` defaults to **5 seconds**. The interface attempts to restart a process that exits. Keep diagnostic output off the child's stdout, which carries protocol frames.

In rsReticulum 1.3.0, the command is split on whitespace and executed directly. Shell quoting, pipes, redirection and shell variable expansion are not interpreted. For complex setup, call a dedicated executable script that sets up its own arguments and environment. The command runs with the daemon's privileges, so protect its configuration as executable code.

## Platform support

Standalone desktop Serial, KISS, AX.25 KISS and serial RNode support require the `serial` build feature. A custom build without it cannot open those serial interfaces. RNode over TCP uses its own socket path and feature support.

Ratspeak desktop's **Add LoRa Device** flow configures an RNode; it is not a generic setup wizard for every serial framer. For a standalone daemon configuration, use [Configuration reference](../reference/configuration-reference.md).

Ratspeak on Android uses the USB host path for supported **USB RNodes**, with a per-device permission grant. That does not expose every desktop serial/TNC driver on Android. iOS Ratspeak has no general USB serial path. Android and iOS can also reach compatible RNodes through BLE or a protected TCP bridge; see [LoRa Radio Interfaces](lora-and-rnode.md).
