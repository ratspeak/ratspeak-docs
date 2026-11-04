---
sidebar_position: 5
---

# rsLXMF

rsLXMF implements LXMF messaging in Rust. Application developers use `lxmf-core`; operators use the `lxmd-rs` daemon for a local messaging destination or propagation node. Ordinary Ratspeak users already have LXMF in the app.

The current standalone release is [**1.3.0**](https://github.com/ratspeak/rsLXMF/releases/tag/v1.3.0), with rsReticulum 1.3.0 as its sibling source set. Its documented compatibility floor is LXMF **1.0.1**, with **1.1.0** as the release reference. The implementation remains experimental, and compatibility must be assessed for the fields and delivery flow being used.

Ratspeak 1.0.40 instead pins coordinated rsLXMF/rsReticulum commits with package version **1.4.0**. Follow the [app source manifest](../reference/building-from-source.md) when building that app.

## Delivery methods

| Method | Behavior |
|---|---|
| **Direct** | Send to a reachable recipient over an encrypted Reticulum Link; larger messages use Resources. |
| **Opportunistic** | Send a small recipient-encrypted packet without establishing a Link, then await its packet proof. |
| **Propagated** | Deposit a recipient-encrypted envelope at a propagation node for later pickup. |

The application selects a method and any fallback policy. A known path alone is not sufficient for encryption: the sender also needs the recipient's public identity or ratchet information. The default opportunistic content ceiling is 287 bytes before additional title, fields, serialization and stamp effects; it is not a fixed chat-text limit.

A protocol proof confirms the receipt it covers, not that a person read the message. Acceptance by a propagation node also does not establish recipient delivery. Storage limits, expiry, node availability and the recipient's sync policy affect pickup. See [Links and LXMF](../concepts/links-and-lxmf.md) for the delivery model and Ratspeak's Auto behavior.

## Running a propagation node

`lxmd-rs` can accept encrypted deposits and exchange messages with peer propagation nodes. Ratspeak calls the client-facing feature **Offline Inbox**. The propagation node does not need plaintext access to private message contents. This is a separate service from a Channels hub, which reads room messages.

For a running installation, use [Infrastructure and ops](../deployment/infrastructure-and-ops.md), including identity persistence, storage limits and client authorization. The following commands inspect the supplied configuration and start a node with directories you have already prepared:

```bash
lxmd-rs --exampleconfig
lxmd-rs --config ~/.rsLXMF --rnsconfig ~/.rsReticulum --propagation-node
```

`--config` and `--rnsconfig` take directories. Their default selection depends on the platform and existing files; see [Configuration reference](../reference/configuration-reference.md). `--service` changes daemon operation but does not install an OS service for you.

The standalone CLI also supports one-shot sending, delivery-method selection and authenticated propagation-control queries. Use `lxmd-rs --help` and the [versioned operator reference](https://github.com/ratspeak/rsLXMF/blob/v1.3.0/README.md#operating-lxmd-rs) for those commands. Control authorization and the propagation-client allowlist are separate policies.

## Stamps and tickets

Stamps attach proof-of-work to messages as spam resistance. A recipient's required cost determines the work an unknown sender must supply. Tickets allow a correspondent to bypass that work while the ticket is valid.

Tickets expire and can be reissued; they are not a permanent authorization or a way around a block. Propagation admission has its own limits and policies.

## Using the library

Start with **`lxmf_core::message_api`** for message construction and inspection. The [1.3 API guide](https://github.com/ratspeak/rsLXMF/blob/v1.3.0/api/README.md) identifies that application boundary, and the [message example](https://github.com/ratspeak/rsLXMF/blob/v1.3.0/crates/lxmf-core/examples/message.rs) demonstrates construction, signing, packing and unpacking.

Router and delivery ownership remain provisional APIs. An embedding application must drive the Reticulum/LXMF runtime, handle inbound events, persist its own user state and distinguish queue acceptance from recipient proofs. The library does not supply a conversation UI or OS notifications.

LXMF fields carry typed MessagePack values. Use the matching field API for the data you are embedding. For LRGP, `set_msgpack_field` accepts the pre-encoded string/map values; treating those bytes as a generic binary field changes their wire type. See [LRGP](lrgp.md).

## Build and license

Standalone source builds require **Rust 1.89+** and the matching rsReticulum sibling checkout. Follow [Building from source](../reference/building-from-source.md) for the pinned standalone pair and OS prerequisites. The daemon binary is `lxmd-rs`; it does not need Python at runtime.

The project is [AGPL-3.0-or-later](https://github.com/ratspeak/rsLXMF/blob/v1.3.0/LICENSE). API checks and interoperability tests provide evidence for their exercised cases; they do not establish support for every third-party client extension or deployment.
