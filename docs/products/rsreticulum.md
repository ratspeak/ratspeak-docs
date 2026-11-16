---
sidebar_position: 4
---

# rsReticulum

rsReticulum is the Rust implementation of the Reticulum network stack. Use its standalone tools to operate a node, or embed its libraries in a Rust application. It does not need a Python runtime to carry traffic.

The current release is [**1.5.0**](https://github.com/ratspeak/rsReticulum/releases/tag/v1.5.0), which follows Python Reticulum **1.6.0**. Ratspeak 1.1.0 builds on the same release. Every tool's `--version` names both, for example `rnsd-rs 1.5.0 (Reticulum 1.6.0)`. The project remains experimental; wire compatibility does not mean every interface, tool, or public Rust item has identical support across implementations.

## For node operators

The release provides macOS, Linux x86-64, and Windows x86-64 archives of the eight core tools, from `rnsd-rs` to `rnodeconf-rs`. The other tools in the table come from a [source build](../reference/building-from-source.md#build-rsreticulum). Follow [Infrastructure and ops](../deployment/infrastructure-and-ops.md) for a running transport node. A listening socket alone does not enable forwarding.

| Tool | Purpose |
|---|---|
| `rnsd-rs` | Run the shared Reticulum instance: interfaces, routing, and the local control sockets. |
| `rnstatus-rs` | Show interface, announce, path request, and link status; attach, detach, or reload an interface on a running `rnsd-rs`. |
| `rnpath-rs` | Look up and list paths, drop paths and queued announces, show announce rates, and manage blackholed identities. |
| `rnid-rs` | Create and inspect identities, import/export, hash destinations, sign/verify, and encrypt/decrypt files. |
| `rnprobe-rs` | Probe a named destination and report loss and round-trip time. |
| `rncp-rs` | Send, receive, and fetch files over Reticulum. |
| `rnsh-rs` | Run a remote shell listener or client. |
| `rnodeconf-rs` | Install and update RNode firmware, change device settings, sign devices, and set up a new device with `-a`. |
| `rnx-rs` | Run commands on a remote `rnx-rs` listener, one at a time or interactively with `-x`. |
| `rnir-rs` | Reticulum's distributed identity resolver. As in Reticulum 1.6.0, it starts Reticulum and exits. |
| `rnpkg-rs` | Reticulum's meta package manager. As in Reticulum 1.6.0, it starts Reticulum and exits. |
| `rngit-rs` | Host git repositories on a Reticulum node and manage them remotely; see [Git over Reticulum](rngit.md). |
| `git-remote-rns` | Git remote helper, so `git` can clone, fetch, and push `rns://` repositories. |
| `rngcs-rs` | Sign and verify git commits with a Reticulum identity. |

Use each tool's `--help` for flags and exit behavior. `rnstatus-rs`, `rnpath-rs`, `rnprobe-rs`, and `rnid-rs` match Python's tools in output, options, and exit codes. Scripts written for earlier releases need two changes: `rncp-rs -f` takes the remote file before the destination hash, and `rnsh-rs -c` now names rnsh's own config directory, with `--rnsconfig` for the Reticulum one.

File, shell, and command listeners accept only the identities you allow with `-a` or an `allowed_identities` file, unless you pass `-n`. Give them deliberate filesystem permissions too: `rnsh-rs` and `rnx-rs` run commands with the listener's account.

`rnodeconf-rs` supports every option of Python's `rnodeconf`. It installs and updates firmware, writes EEPROM settings, signs devices and, with `-a`, walks through a new device: it asks for the serial port, board, and band, shows a summary to confirm, downloads the firmware, then flashes and provisions the board. Flashing uses the same external tools as `rnodeconf`: `avrdude` for AVR boards, `adafruit-nrfutil` for nRF52 boards, and `python3` with the firmware's own `esptool.py` for ESP32 boards. Firmware and signing keys are kept in `~/.config/rnodeconf`, or `%APPDATA%\rnodeconf` on Windows. See the [firmware guide](../hardware/flashing-firmware.md#rnode-rnodeconf) for installation.

To inspect the starter configuration without changing a file:

```bash
rnsd-rs --exampleconfig
```

Default path selection, the `[stamps]` and `[filter]` sections, and app-private versus standalone shared-instance endpoints are documented in [Configuration reference](../reference/configuration-reference.md). Existing configurations need a version check. An interface starts only with `enabled = yes`, and `ifac_size` is in **bits**, as in Python Reticulum. A configuration written for rsReticulum 1.3.0 gave `ifac_size` in bytes, so multiply an explicit size by 8 (16 becomes 128), or convert it with `rnsd-rs config ifac-units`; see the [upgrade note](../reference/configuration-reference.md#common-interface-keys).

## Identity tools

`rnid-rs` distinguishes public and private material. Public exports can be shared; private exports let their holder act as the identity. Keep private keys and decrypted files out of logs, public issues, and chat.

For an existing identity file:

```bash
rnid-rs -i ./identity -p
rnid-rs -i ./identity -H lxmf.delivery
rnid-rs -i ./identity -w ./identity.pub
```

`-w` writes public data unless private export is explicitly requested with `-X`. Use a new output path or review the file before choosing an overwrite option. The [tool reference](https://github.com/ratspeak/rsReticulum/blob/v1.5.0/README.md#tool-usage) covers generation, public/private import, `.rsg` signatures, and file encryption.

## For Rust application developers

Start with **`rns_runtime::prelude`** and the [API guide](https://github.com/ratspeak/rsReticulum/blob/v1.5.0/api/README.md). The [runtime examples](https://github.com/ratspeak/rsReticulum/tree/v1.5.0/crates/rns-runtime/examples) show complete startup, destination, announce, packet-proof, Link, Channel, and Resource flows. An application can receive a Resource of any size straight to a file with `DestinationHandle::receive_resource_files` or `LinkSessionResourceOffer::accept_to_file`.

The workspace separates cryptography, wire format, identities, transport, links, protocol transfers, carrier interfaces, and runtime ownership into `rns-*` crates. `rns-runtime` is the usual entry point for a host application; lower layers are available when you need a narrower boundary. MCU work uses the separate Lite ports and their toolchains.

The application prelude does not make every actor, RPC, transport table, or concrete driver a stable API. Breaking changes are listed in the [1.5 migration guide](https://github.com/ratspeak/rsReticulum/blob/v1.5.0/api/migrations/1.5.md); use the `~1.5.0` dependency line or an immutable source commit. An interface that fails to start now stops start-up, as in Python Reticulum; an embedder can keep going with `InitOptions::keep_starting_after_interface_failure`.

An embedded runtime can own interfaces itself or join a shared instance. Shared-client mode does not also own those local interfaces, and two independent owners must not compete for the same ports or radio. Choose ownership deliberately rather than starting a daemon and assuming the application will attach to it.

## Interfaces and platform limits

Available families include TCP client/server, UDP, AutoInterface, Backbone, I2P/SAM, serial/HDLC, KISS, AX.25 KISS, Pipe, RNode, and local sharing. BLE and Android USB paths have feature and target requirements. A driver existing in the library does not establish that every binary or app exposes it.

See [Network interfaces](../networking/interfaces-overview-and-design.md) for setup boundaries, platform roles, and configuration examples. Capacity and radio performance depend on the deployment; Backbone has no fixed connection-count promise here.

## Build and license

The host workspace requires **Rust 1.89+**. The default build compiles a bundled SQLite for the stores in `storage/`, so it also needs a C compiler. Build 1.5.0 from its tag using the [source instructions](../reference/building-from-source.md#build-rsreticulum); the binaries use `*-rs` names. The source is under the [Reticulum License](https://github.com/ratspeak/rsReticulum/blob/main/LICENSE), the license of the reference implementation it is ported from; see [Licenses](../reference/licenses.md). Use the repository API guide and local tests when changing an integration; wire compatibility and platform behavior still need their own verification.
