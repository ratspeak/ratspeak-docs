---
sidebar_position: 5
---

# rsLXMF

rsLXMF implements LXMF messaging in Rust. Application developers use `lxmf-core`; operators use the `lxmd-rs` daemon for a local messaging destination or propagation node. Ordinary Ratspeak users already have LXMF in the app.

The current release is [**1.5.0**](https://github.com/ratspeak/rsLXMF/releases/tag/v1.5.0), built with rsReticulum 1.5.0. It follows Python LXMF **1.3.0** with Reticulum **1.6.0**, and `lxmd-rs --version` names both. Ratspeak 1.1.0 builds on the same release. The implementation remains experimental, and compatibility must be assessed for the fields and delivery flow being used.

## Delivery methods

| Method | Behavior |
|---|---|
| **Direct** | Send to a reachable recipient over an encrypted Reticulum Link; larger messages use Resources. |
| **Opportunistic** | Send a small recipient-encrypted packet without establishing a Link, then await its packet proof. |
| **Propagated** | Deposit a recipient-encrypted envelope at a propagation node for later pickup. |

The application selects a method and any fallback policy. A known path alone is not sufficient for encryption: the sender also needs the recipient's public identity or ratchet information. The default opportunistic content ceiling is 287 bytes before additional title, fields, serialization, and stamp effects; it is not a fixed chat-text limit. Outgoing messages reuse an open Link to the same destination, and are compressed only when the recipient says it supports that.

A protocol proof confirms the receipt it covers, not that a person read the message. Acceptance by a propagation node also does not establish recipient delivery. Storage limits, expiry, node availability, and the recipient's sync policy affect pickup. See [Links and LXMF](../concepts/links-and-lxmf.md) for the delivery model and Ratspeak's Auto behavior.

## Running a propagation node

`lxmd-rs` can accept encrypted deposits and exchange messages with peer propagation nodes. Ratspeak calls the client-facing feature **Offline Inbox**. The propagation node does not need plaintext access to private message contents. This is a separate service from a Channels hub, which reads room messages.

For a running installation, use [Infrastructure and ops](../deployment/infrastructure-and-ops.md), including identity persistence, storage limits, and client authorization. The following commands inspect the supplied configuration and start a node with directories you have already prepared:

```bash
lxmd-rs --exampleconfig
lxmd-rs --config ~/.rsLXMF --rnsconfig ~/.rsReticulum --propagation-node
```

`--config` and `--rnsconfig` take directories. Their default selection depends on the platform and existing files; see [Configuration reference](../reference/configuration-reference.md#lxmf--lxmd-rs-config). `--service` logs to `logfile` in the config directory but does not install an OS service for you.

`lxmd-rs` reads its config as Python's `lxmd` does. It writes a default config on first run, and a malformed value, or a stamp cost of 100 or more, stops it instead of being replaced by a default. With no `loglevel` set, it logs at Notice.

A propagation node follows LXMF 1.3.0 in storage limits, peering, and sync, throttles peers that send messages with invalid stamps, and announces LXMF 1.3.0 as its version. The control commands, `--status`, `--peers`, `--sync`, and `--break`, wait for a path to the node within `--timeout`. The CLI also supports one-shot sending and delivery-method selection; see `lxmd-rs --help` and the [operator reference](https://github.com/ratspeak/rsLXMF/blob/v1.5.0/README.md#operating-lxmd-rs). Control authorization and the propagation-client allowlist are separate policies.

## Stamps and tickets

Stamps attach proof-of-work to messages as spam resistance. A recipient's required cost determines the work an unknown sender must supply. Tickets allow a correspondent to bypass that work while the ticket is valid. Stamp costs can be fractional, as in LXMF 1.3.0, and announces carry them where LXMF 1.3.0 reads them.

Tickets expire and can be reissued; they are not a permanent authorization or a way around a block. Propagation admission has its own limits and policies.

LXMF also follows Reticulum's [network stamps](../reference/configuration-reference.md#stamps). Delivery, propagation downloads, and peer sync stamp their link requests when the destination asks for it, and with stamping turned on in Reticulum's `[stamps]` section, `lxmd-rs` stamps its own announces too.

## Storage

Delivered message ids, stamp costs, and tickets are stored in `storage/lxmf/state.db`, the same SQLite store LXMF 1.3.0 uses. Ratchets and known identities are left to Reticulum's own storage. On its first start, 1.5.0 imports the old cache files and removes the ratchet and identity files earlier `lxmd-rs` releases kept; each contact's ratchet returns with its next announce. Going back to an older release starts without them, so back up the config directory before updating.

## Using the library

Start with **`lxmf_core::message_api`** for message construction and inspection. The [API guide](https://github.com/ratspeak/rsLXMF/blob/v1.5.0/api/README.md) identifies that application boundary, and the [message example](https://github.com/ratspeak/rsLXMF/blob/v1.5.0/crates/lxmf-core/examples/message.rs) demonstrates construction, signing, packing, and unpacking. Breaking changes are in the [1.5 migration guide](https://github.com/ratspeak/rsLXMF/blob/v1.5.0/api/migrations/1.5.md); use the `~1.5.0` line with rsReticulum `~1.5.0`.

Router and delivery ownership remain provisional APIs. An embedding application must drive the Reticulum/LXMF runtime, handle inbound events, persist its own user state, and distinguish queue acceptance from recipient proofs. The library does not supply a conversation UI or OS notifications. Message ids and signatures match Python LXMF for messages packed by any encoder. Display names in announces are passed through unchanged; use `presentation::sanitize_name` before showing one.

LXMF fields carry typed MessagePack values. Use the matching field API for the data you are embedding. For LRGP, `set_msgpack_field` accepts the pre-encoded string/map values; treating those bytes as a generic binary field changes their wire type. See [LRGP](lrgp.md).

## Build and license

Source builds require **Rust 1.89+**, a C compiler for the bundled SQLite of the default `sqlite-store` feature, and the matching rsReticulum sibling checkout. Follow [Building from source](../reference/building-from-source.md#build-rslxmf) for the standalone pair and OS prerequisites. The daemon binary is `lxmd-rs`; it does not need Python at runtime.

The project is under the [Reticulum License](https://github.com/ratspeak/rsLXMF/blob/main/LICENSE), the license of the reference implementation it is ported from; see [Licenses](../reference/licenses.md). API checks and interoperability tests provide evidence for their exercised cases; they do not establish support for every third-party client extension or deployment.
