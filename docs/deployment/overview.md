---
sidebar_position: 1
---

# Deployment overview

Start with the people and places you need to connect. A few devices on the same LAN may need only **Local Network** enabled in Ratspeak. Add infrastructure when you need to connect separate segments, keep a useful route available, store messages for offline recipients, or host Channels.

## Pick a scenario

| Your situation | Guide |
|---|---|
| A household or friend group needs a shared connection | [Home or friend group](home-or-friend-group.md) |
| Several operators are connecting a local radio network | [Community mesh](community-mesh.md) |
| A field group needs messaging without internet | [Off-grid and emergency](off-grid-emergency.md) |
| You need services, monitoring, updates or a channel hub | [Infrastructure and ops](infrastructure-and-ops.md) |

These patterns can be combined. Test each segment on its own before joining it to a larger network.

## Common building blocks

**Transport node.** A Reticulum instance configured to forward traffic for other destinations. It needs transport enabled and working interfaces. It can connect local IP, radio and remote IP segments, subject to their reachability and capacity. It does not store LXMF messages for offline delivery by itself.

**Offline Inbox / propagation node.** An LXMF service that accepts encrypted messages for later retrieval. The recipient must reconnect and fetch them before the node expires or removes them. Acceptance by the node is different from delivery to the recipient. Run `lxmd-rs` for this role.

**Channel hub.** A live group-conversation service hosted by the desktop Ratspeak app. The hub can read and relay channel content. This has a different privacy model from end-to-end encrypted LXMF direct messages and a different role from an Offline Inbox. See [Hosting a channel hub](infrastructure-and-ops.md#hosting-a-channel-hub).

**IFAC.** Interface authentication using a shared network name and/or passphrase. It limits participation on a configured interface. It does not hide radio transmissions or TCP connections, and a node connected to other interfaces can forward traffic between segments. It is not a replacement for checking identities or choosing a trustworthy channel hub.

**RNode and LoRa.** A radio interface for a computer, phone or transport node. The supported connection may be USB, Bluetooth or a TCP radio bridge, depending on the radio and host. Use the [flashing guide](../hardware/flashing-firmware.md) for the correct board and firmware; a configuration utility is not automatically a firmware installer.

**`rnsd-rs`.** The standalone rsReticulum daemon. It owns interfaces and routing state and exposes local control services to the other rsReticulum tools. The Ratspeak app already includes its own runtime; installing a daemon is an operator choice.

## Before relying on the deployment

Write down the intended participants, interfaces, radio settings, service addresses and operators. Keep secrets out of the public copy. Check a successful message in both directions, offline retrieval if used, and recovery after a service restart or lost link. A healthy interface counter alone does not prove the whole journey works.

For radio deployments, plan around measured coverage, power use and local radio rules. For private deployments, review every interface on each bridging node. For an unattended service, arrange backups and a way to recover when its normal network path is unavailable.
