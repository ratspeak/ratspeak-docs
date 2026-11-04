---
sidebar_position: 4
---

# rsReticulum

rsReticulum is the Rust implementation of the Reticulum network stack. Use its standalone tools to operate a node, or embed its libraries in a Rust application. It does not need a Python runtime to carry traffic.

The current standalone release is [**1.3.0**](https://github.com/ratspeak/rsReticulum/releases/tag/v1.3.0). Its release baseline is Python Reticulum **1.4.2** for the implemented surface. The project remains experimental; wire compatibility does not mean every interface, tool or public Rust item has identical support across implementations.

Ratspeak 1.0.40 uses a different, pinned rsReticulum source set with package version **1.4.0**. If you are building the app, use its dependency manifest and [source-build guide](../reference/building-from-source.md), rather than substituting the standalone tag.

## For node operators

The release provides macOS, Linux x86-64 and Windows x86-64 tool archives. Select an artifact for your host and follow [Infrastructure and ops](../deployment/infrastructure-and-ops.md) for a running transport node. A listening socket alone does not enable forwarding.

| Tool | Purpose |
|---|---|
| `rnsd-rs` | Own interfaces, routing and shared-instance endpoints. |
| `rnstatus-rs` | Inspect interface and transport status and counters. |
| `rnpath-rs` | Request and inspect paths; manage path/rate/blackhole state with the applicable authorization. |
| `rnid-rs` | Create and inspect identities, import/export, hash destinations, sign/verify and encrypt/decrypt files. |
| `rnprobe-rs` | Probe a named destination and report loss and round-trip time. |
| `rncp-rs` | Send, receive and fetch files over Reticulum. |
| `rnsh-rs` | Run a remote shell listener or client. |
| `rnodeconf-rs` | Inspect an RNode, back up EEPROM and save TNC/normal startup settings. |

Use the selected release's `--help` for flags and exit behavior. File/shell listeners need deliberate authentication and filesystem permissions. In `rnodeconf-rs` 1.3.0, firmware installation, signing/trust enrollment and Bluetooth, Wi-Fi, display and interference-avoidance changes are disabled even though their options appear in help. Use the matching [firmware guide](../hardware/flashing-firmware.md) for installation.

To inspect the starter configuration without changing a file:

```bash
rnsd-rs --exampleconfig
```

Default path selection and app-private versus standalone shared-instance endpoints are documented in [Configuration reference](../reference/configuration-reference.md). Existing Python configs need a version-specific check: for example, standalone Rust 1.3.0 interprets `ifac_size` as **bytes**, while Python and the app's bundled 1.4.0 configuration use bits.

## Identity tools

`rnid-rs` distinguishes public and private material. Public exports can be shared; private exports let their holder act as the identity. Keep private keys and decrypted files out of logs, public issues and chat.

For an existing identity file:

```bash
rnid-rs -i ./identity -p
rnid-rs -i ./identity -H lxmf.delivery
rnid-rs -i ./identity -w ./identity.pub
```

`-w` writes public data unless private export is explicitly requested with `-X`. Use a new output path or review the file before choosing an overwrite option. The [versioned tool reference](https://github.com/ratspeak/rsReticulum/blob/v1.3.0/README.md#tool-usage) covers generation, public/private import, `.rsg` signatures and file encryption.

## For Rust application developers

Start with **`rns_runtime::prelude`** and the [1.3 API guide](https://github.com/ratspeak/rsReticulum/blob/v1.3.0/api/README.md). The [runtime examples](https://github.com/ratspeak/rsReticulum/tree/v1.3.0/crates/rns-runtime/examples) show complete startup, destination, announce, packet-proof, Link, Channel and Resource flows.

The workspace separates cryptography, wire format, identities, transport, links, protocol transfers, carrier interfaces and runtime ownership into `rns-*` crates. `rns-runtime` is the usual entry point for a host application; lower layers are available when you need a narrower boundary. MCU work uses the separate Lite ports and their toolchains.

The application prelude does not make every actor, RPC, transport table or concrete driver a stable API. Package stability tiers and migration notes live with the versioned API guide. Pin a reviewed compatible dependency line or immutable source commit.

An embedded runtime can own interfaces itself or join a shared instance. Shared-client mode does not also own those local interfaces, and two independent owners must not compete for the same ports or radio. Choose ownership deliberately rather than starting a daemon and assuming the application will attach to it.

## Interfaces and platform limits

Available families include TCP client/server, UDP, AutoInterface, Backbone, I2P/SAM, serial/HDLC, KISS, AX.25 KISS, Pipe, RNode and local sharing. BLE and Android USB paths have feature and target requirements. A driver existing in the library does not establish that every binary or app exposes it.

See [Network interfaces](../networking/interfaces-overview-and-design.md) for setup boundaries, platform roles and configuration examples. Capacity and radio performance depend on the deployment; Backbone has no fixed connection-count promise here.

## Build and license

The host workspace requires **Rust 1.89+**. Build standalone 1.3.0 from its tag using the [standalone source instructions](../reference/building-from-source.md); the binaries use `*-rs` names. The source is [AGPL-3.0-or-later](https://github.com/ratspeak/rsReticulum/blob/v1.3.0/LICENSE). Use the repository API guide and local tests when changing an integration; wire compatibility and platform behavior still need their own verification.
