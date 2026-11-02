---
sidebar_position: 6
---

# Links and LXMF

Reticulum and LXMF solve different layers of the same problem. Reticulum finds destinations and moves encrypted packets across the mesh. LXMF defines the message format and delivery behavior that Ratspeak, Sideband, NomadNet, and other messengers use on top of Reticulum.

The important split:

- **Reticulum Link** - an encrypted session between two destinations.
- **Reticulum Resource** - a reliable larger transfer over a link.
- **LXMF Message** - the signed message envelope that may be delivered directly, opportunistically, or through propagation.

## What a Reticulum Link Is

A link is an encrypted, ephemeral, point-to-point session between two Reticulum destinations. It can be direct or multi-hop. The link is not the physical radio or TCP connection; it is an abstract encrypted channel across whatever path Reticulum has found.

Links provide forward secrecy through ephemeral X25519 key exchange. Once a link ends, its session keys are not reused. A later compromise of a long-term identity should not decrypt old link traffic.

Links are used for stateful work: request/response APIs, reliable channels, large transfers, and LXMF Direct delivery when both parties are reachable.

## Link Establishment

At a high level, link establishment works like this:

1. **Link request.** The initiator creates fresh ephemeral key material and sends a Link Request packet to the destination hash.
2. **Path marking.** Transport nodes that forward the request remember the link ID, which is derived from the request packet.
3. **Proof.** The destination accepts the request, creates its own ephemeral key material, signs proof material with its destination identity, and sends a proof packet back to the link ID.
4. **Active link.** Once the proof is verified, both ends can derive the same symmetric key and exchange encrypted packets addressed to the link ID.

The initiator does not have to reveal a long-term identity just to open a link. If an application wants the remote side to know who opened the session, it can identify over the encrypted link afterward with a signed identity packet. That identification step is optional and application-driven.

The first Link Request still uses normal Reticulum path discovery and may be broadcast when no path is known. After the responder accepts that request and the initiator validates its proof, the Link stays bound to the exact interface that completed the handshake. Link data, resources, keepalives, proofs, and teardown do not fall back to another interface if that interface disappears or becomes unusable; the Link closes and a new Link must discover a new path. This prevents an established session from unexpectedly leaking onto an unrelated radio or network interface.

The signing key for a packet receipt proof depends on the proof sender's role. When the Link initiator acknowledges a received packet, it signs with the temporary key advertised in the Link Request. When the responder acknowledges one, it signs with the destination identity that accepted the Link. This lets either peer authenticate delivery without requiring an initiator to disclose its long-term identity.

## Link Timers

The defaults below describe the Reticulum source bundled with Ratspeak 1.0.37:

| Timer | Default behavior |
|-------|------------------|
| Establishment timeout | Based on roughly 6 seconds per expected hop |
| Keepalive | Adaptive, between 5 and 360 seconds, based on observed RTT |
| Stale handling | A quiet link is marked stale after about two keepalive intervals, then closed if no response arrives |

On a healthy LAN these values are rarely noticeable. On LoRa, packet radio, and long multi-hop paths, the extra patience keeps links from failing just because the medium is slow.

## What Rides on a Link

**Reticulum Channels** provide reliable, ordered message streams over a link. This protocol facility is separate from Ratspeak’s hub-hosted Channels rooms. They are the right abstraction for request/response protocols and application data that must arrive in sequence.

**Resources** move payloads that are too large for a single packet. A resource transfer chunks the data, retransmits missing parts, reassembles the payload and verifies the completed transfer. Files, images, and larger LXMF payloads use this pattern.

Multiple higher-level operations can share the same link while it remains active.

## What LXMF Adds

LXMF is the message layer used by Ratspeak. It defines a compact signed envelope containing:

- Source and destination information.
- Timestamp.
- Optional title and content body.
- Structured fields for application-specific data.
- Sender signature for origin verification.
- Delivery metadata such as stamps, tickets, and propagation state.

LXMF is deliberately small enough for constrained links but flexible enough for chat, mail-like workflows, telemetry, game moves, and app-specific payloads.

## Delivery Modes

LXMF can deliver a message three ways.

| Mode | How it works | Best for |
|------|--------------|----------|
| **Direct** | Open a Reticulum link to the recipient and send over that encrypted session | Normal conversations, reliable delivery, larger messages |
| **Opportunistic** | Send a small encrypted message as one Reticulum packet with no link setup and await its packet proof | Tiny notes, alerts, and low-overhead traffic |
| **Propagated / Offline Inbox** | Store the encrypted message on a propagation node until the recipient asks for it | Offline recipients and delay-tolerant messaging |

The default opportunistic content ceiling is 287 bytes, but title, fields, serialization and stamps reduce the usable text budget. The complete message must fit one encrypted packet. Oversized opportunistic messages use Direct delivery; Direct messages that do not fit a link packet use a resource.

In Ratspeak 1.0.37, **Auto** uses Opportunistic for ordinary text only when it has a nonexpired recipient ratchet and no reusable active or pending link. Otherwise it uses Direct. Attachments and game traffic use Direct. When Offline Inbox is configured, an eligible failed live delivery can fall back to propagation. **Propagated** means a node accepted the message, not that the recipient has read or received it. The app exposes its current transfer limits; do not use the packet ceiling as a chat length limit.

## Propagation Nodes

A propagation node is a Reticulum node running LXMF propagation software such as `lxmd-rs`. It stores encrypted LXMF blobs for recipients who are offline or not currently reachable. When the recipient comes online, their client asks the propagation node for waiting mail.

Ratspeak's app UI calls this feature **Offline Inbox**. The technical LXMF term is still **propagation node**, so you will see that name in Reticulum tools, `lxmd-rs`, and protocol documentation.

Propagation nodes do not need plaintext access to the messages they store. They are useful because they provide availability, not because they are trusted with content.

Propagation is also how messaging can feel reliable on a mesh that is not always fully connected. Your recipient does not have to be online at the exact moment you press send, when the sender deposits it at a suitable node and the recipient later syncs from a node that holds it. Storage limits, expiry and node availability still affect pickup.

## Stamps and Tickets

LXMF uses **stamps** as proof-of-work against unsolicited traffic. A recipient can publish a stamp cost, and unknown senders must attach enough work for the message to be accepted.

**Tickets** are the fast path for known correspondents. A recipient can issue a ticket to a sender, letting future messages bypass proof-of-work until the ticket expires.

The result is a practical split: first contact can cost a small amount of CPU, while established conversations stay lightweight.
