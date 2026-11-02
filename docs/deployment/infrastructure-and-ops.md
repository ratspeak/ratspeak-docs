---
sidebar_position: 5
---

# Infrastructure and ops

This guide covers standalone transport and Offline Inbox services, their diagnostics, and the desktop app's channel hub. Choose the role you need before starting a service.

## What you're running

| Role | What runs | What it provides |
|---|---|---|
| Transport | `rnsd-rs` with transport enabled and configured interfaces | Routes packets for other destinations |
| Offline Inbox / propagation node | `lxmd-rs` with propagation enabled | Stores encrypted LXMF messages for later pickup, subject to its limits |
| Channel hub | Ratspeak desktop with Channel hosting enabled | Relays live channel conversation and manages channel access |

A transport is not an Offline Inbox. An Offline Inbox is not a channel hub. A hub can read channel content; LXMF direct-message encryption does not extend through that hub to other participants.

The standalone commands below match rsReticulum and rsLXMF **v1.3.0**. Check the installed versions with `rnsd-rs --version` and `lxmd-rs --version`. Download an applicable release from [rsReticulum](https://github.com/ratspeak/rsReticulum/releases) and [rsLXMF](https://github.com/ratspeak/rsLXMF/releases), or follow their source instructions. App and library release numbers are separate.

Use explicit config directories for services. `--config` takes a directory containing a file named `config`; `lxmd-rs --rnsconfig` selects the Reticulum directory. This guide uses `~/.rsReticulum` and `~/.rsLXMF` for manual tests. Defaults can instead resolve an existing system or user configuration; see [Configuration reference](../reference/configuration-reference.md).

## Raspberry Pi systemd

This example is for a Linux host with systemd. Install a binary matching its CPU and runtime libraries. For an RNode, the build also needs the relevant serial/Bluetooth support and the service account needs access to that device.

First run the daemon in a terminal with the intended config and confirm the interfaces with `rnstatus-rs`. The [home/group](home-or-friend-group.md) and [community](community-mesh.md) guides provide configuration patterns.

For the service below, replace `operator` and `/home/operator/.rsReticulum` with an existing account and its actual configuration directory. Keep the account consistent with your manual test, or deliberately copy the configuration and identity/state into the service's chosen directory before starting it.

```ini
# /etc/systemd/system/rnsd-rs.service
[Unit]
Description=Reticulum transport
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=operator
ExecStart=/usr/local/bin/rnsd-rs --config /home/operator/.rsReticulum --service
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

After saving the unit:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now rnsd-rs
systemctl status rnsd-rs
journalctl -u rnsd-rs -n 100 --no-pager
```

With `--service`, the daemon writes its normal log to the config directory’s `logfile`. For the example account, read it with `sudo -u operator tail -n 100 /home/operator/.rsReticulum/logfile`. The journal commands above show service lifecycle and startup failures.

A running service is only the first check. Query its interfaces using the same config directory and appropriate account permissions, then test a message through it. Use stable `/dev/serial/by-id/...` radio paths on Linux where available. Confirm the intended firewall rule for a TCP listener; the local shared-instance/control ports should remain local.

## Docker

A container can run the same standalone daemon, but its image must contain a compatible binary and required runtime libraries. The release archive is not itself a container image. Test the image on the target architecture before putting it into service.

For an image you have prepared, here named `rnsd-image`, a TCP-only deployment can use:

```bash
docker run -d --name rnsd-rs \
  --mount type=bind,src="$HOME/.rsReticulum",dst=/data/reticulum \
  -p 4242:4242 \
  --restart unless-stopped \
  rnsd-image rnsd-rs --config /data/reticulum --service
```

The image must have `rnsd-rs` on `PATH` and allow that command to run. Create the host directory and config first, with permissions matching the container user. Configure the TCP server to listen on the container's `0.0.0.0:4242`. Publishing the port does not create that listener.

For AutoInterface discovery on a physical LAN, Docker Engine on Linux can use `--network host` instead of `-p`. Check IPv6 multicast and firewall behavior on the host. Docker Desktop's opt-in host networking has different limitations; do not assume it provides the same LAN discovery behavior. See Docker's [host networking documentation](https://docs.docker.com/engine/network/drivers/host/).

For a USB radio, pass the specific device and arrange permissions. For an RNode TCP bridge, configure its actual `tcp://host:port` endpoint and test reachability from the container. Do not expose the radio-control socket publicly without considering who can control that radio.

With `--service`, normal daemon logs are in `/data/reticulum/logfile`, also visible through the host mount.

Keep the state directory outside the container and back it up. Record the image, config and mount before an update; preserve the mount when replacing the container.

## Offline Inbox node walkthrough

1. Start `rnsd-rs` with a working network configuration and shared-instance support.
2. Create the LXMF configuration directory. Review `lxmd-rs --exampleconfig` for storage, peering and access settings.
3. Start the propagation service:

   ```bash
   lxmd-rs --config ~/.rsLXMF --rnsconfig ~/.rsReticulum --propagation-node
   ```

4. Derive the propagation destination from the service's identity:

   ```bash
   rnid-rs -i ~/.rsLXMF/identity -H lxmf.propagation
   ```

   Use the identity file actually selected by the service if you migrated an older profile. Share the full 32-character propagation destination hash as the Offline Inbox address. It differs from the raw identity hash and the `lxmf.delivery` address.
5. Configure a client to use that node, send a test message while the recipient is offline, then reconnect the recipient and fetch it. Check the final recipient delivery separately from acceptance by the node.
6. Once the test works, give `lxmd-rs` its own service unit with the same explicit directories and appropriate permissions. Keep `rnsd-rs` available for its network connection.

In Ratspeak, **Auto** selects from discovered propagation nodes; it does not ensure your intended node is chosen. Use the manual node setting when your test or group requires a particular address.

Review storage limits, accepted message size, authentication, stamp costs and peering policy in the [rsLXMF configuration](https://github.com/ratspeak/rsLXMF#configuration). Propagation peering depends on discovery, configured policy and capacity; it is not an assurance that every message has redundant copies.

The LXMF directory holds its own identity and message store. Backing up only the transport daemon's directory does not back up the Offline Inbox.

## Hosting a channel hub

Channel hosting is available in the desktop Ratspeak app. Keep the host awake and connected through an interface that participants can reach. A working TCP or radio connection still needs a usable Reticulum path to the hub.

1. In **Settings → Channels**, set **Channel hosting** to **ON**. This reveals the hosting controls; it does not by itself start a hub.
2. Open **Channels**, then **Manage Hub → Host a hub**. If you already have one, open **Manage your hub** or its manage control.
3. In the hub manager's **Settings**, choose the **Hub name**, **Welcome & guidance**, announce schedule and **Recent activity** setting.
4. Select **Start hosting**. Check for **Hosting**. **Waiting for network** means hosting was requested but the network is not ready.
5. Copy the **Hub address** and share it with intended participants. Have someone on the intended connection join and exchange a short message; see the [client instructions](../using-ratspeak/messaging-and-contacts.md).

The hub terminates participants' links and can read the channel messages it relays. Tell participants who operates it and what rules apply. Private channels, invitations and join keys restrict access; they do not provide end-to-end encryption between channel participants.

### Create and manage channels

In the manager's **Channels** tab, select **Create channel**. Choose a name and topic and set the policies that fit the group:

| Control | Effect |
|---|---|
| Private channel | Hides the channel from people who are neither members nor operators |
| Invite only | Requires an active invitation or reconnect lease unless the participant is a hub or channel operator |
| Moderated posting | Allows operators and identities granted voice to post; “voice” here is posting permission |
| Members post | Rejects room messages from identities that have not joined |
| Operator topics | Restricts topic changes to channel or hub operators |
| Join key | Requires the key on admission unless the participant is a hub operator, channel operator or has an active invitation; the stored key is verify-only and cannot be recovered |

Channel names cannot be renamed. A new or replacement join key must be 8–128 UTF-8 bytes without whitespace. Share it privately and retain a copy if needed; replacing it invalidates the old key for admission checks. It does not remove current members. A reconnect lease bypasses invite-only admission, but does not bypass the join key. To revoke access, review current membership, invitations and operator grants and use the appropriate remove, revoke or ban controls.

Use **People → Manage access** or the **Access** tab to grant/remove channel operator or posting permissions, issue/revoke invitations, remove a live member, or apply channel/hub bans. Select the intended identity, not just a display name. Review the action and scope before confirming it.

Registering a channel saves its policy and access records. **Unregister** removes those saved records: current members remain until they leave, but the channel becomes live-only and disappears when empty. This is different from stopping the hub.

### Persistence, activity and restart

The hub keeps its configuration and registered channel/access policy. It does not provide a persistent conversation archive or replay missed conversation to offline participants. Clients may retain their own local history.

**Recent activity** is optional moderation context held in memory. It is off by default; the available retention choices are 1, 6, 12 or 24 hours, with count/size limits as well. It can include message excerpts and identities. It is cleared by a hub restart and is not a durable audit log or a promise about what another client or modified hub can retain.

Saving hub settings while it is running briefly restarts it and interrupts live connections. Use **Stop hosting** to stop the service. Turning **Channel hosting** off in Settings also disables the hosting capability. Keep backups of the app profile if you need to preserve the hub identity and saved policy; quit the app completely before copying that profile.

### When hosting fails

- **Waiting for network:** check the app's active network, identity and interfaces before asking participants to reconnect.
- **No one can find it:** check the address and announce schedule, then test a known path from another device. A locally running hub is not proof of remote reachability.
- **Admission or posting refused:** review the channel's key, invitation, ban and posting policy for the participant's identity.
- **Changes waiting to be saved:** the live change may already be applied while durable storage is unavailable. Leave the warning visible, check storage and refresh to confirm persistence before relying on a restart.

Use the manager's **Overview**, **People** and **Activity** views to distinguish a live session, a saved policy and a failed operation. Avoid changing the app identity or erasing its database as a connection fix.

## Remote management

rsReticulum can answer authorized status/path queries over Reticulum. This requires a working path to the node; it does not replace operating-system administration or recovery access.

Create a separate management identity on the querying machine:

```bash
mkdir -p ~/.rsReticulum/identities
rnid-rs -g ~/.rsReticulum/identities/mgmt
rnid-rs -i ~/.rsReticulum/identities/mgmt -p
```

Keep the identity file private. On the remote node, add its full identity hash to the allow-list, replacing the placeholder:

```ini
[reticulum]
  enable_remote_management = yes
  remote_management_allowed = REPLACE_WITH_MANAGER_IDENTITY_HASH
```

An empty allow-list denies remote queries. Restart the service after changing its config.

On the managed node, after starting it with remote management enabled, inspect its saved management identity:

```bash
rnid-rs -i ~/.rsReticulum/storage/remote_management_identity -p
```

Use the actual service directory and an account allowed to read that key. The full **Identity Hash** is the `REMOTE_MANAGEMENT_IDENTITY_HASH` for `-R` queries. It is separate from the management client's identity created above and from the node's transport identity. Do not pass a derived destination hash to `-R`.

If you also enable `respond_to_probes = yes` and restart, obtain the probe destination on that node:

```bash
rnid-rs -i ~/.rsReticulum/storage/probe_identity -H rnstransport.probe
```

That command gives the `PROBE_DESTINATION_HASH` used below. Share these public hashes, not either identity file. These are the standalone v1.3.0 paths; inspect the matching release instructions before applying them to another version.

## Monitoring with rnstatus-rs, rnpath-rs, rnprobe-rs

Use the service's actual config directory in these examples. Replace the hash placeholders with full 32-character values.

```bash
# Local interface state and counters
rnstatus-rs --config ~/.rsReticulum

# Local path table
rnpath-rs --config ~/.rsReticulum --table

# Authorized remote status and path table
rnstatus-rs --config ~/.rsReticulum -R REMOTE_MANAGEMENT_IDENTITY_HASH -i ~/.rsReticulum/identities/mgmt
rnpath-rs --config ~/.rsReticulum --table -R REMOTE_MANAGEMENT_IDENTITY_HASH -i ~/.rsReticulum/identities/mgmt

# A destination configured to answer rnstransport.probe packets
rnprobe-rs --config ~/.rsReticulum rnstransport.probe PROBE_DESTINATION_HASH -n 5
```

The probe target must enable `respond_to_probes = yes`; its probe destination hash is not automatically its LXMF address or raw transport identity hash.

The flags differ between tools:

| Tool | Timeout | JSON output |
|---|---|---|
| `rnstatus-rs` | `-w SECONDS` | `--json` or `-j` |
| `rnpath-rs` | `-w SECONDS` for local responses; `-W SECONDS` for remote management | `--json` or `-j` |
| `rnprobe-rs` | `-t SECONDS`; `-w` instead controls the wait between probes | `--json` |

A path table entry, an answered probe and a delivered application message test different things. Keep a test destination for each important service. Check return codes/timeouts when collecting JSON for monitoring.

## Updating

Record the current binaries, config paths, account and state mounts. Read the target release's compatibility notes. Stop the affected services cleanly and back up their complete state directories, including identities and the separate LXMF store. Protect those backups.

Install matching replacement binaries or rebuild the documented source revision, then restart with the same intended configuration. Confirm the version, interface state, a routed message and an Offline Inbox retrieval where applicable. For a channel hub, confirm its address, saved policy and a participant reconnect.

If an update fails, retain the failed-state evidence and restore according to that release's compatibility limits. Do not assume a newer database or state format can be opened by an older binary. Changing the config directory or erasing state is not a routine update step.
