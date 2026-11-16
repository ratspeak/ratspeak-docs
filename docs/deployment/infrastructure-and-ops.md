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

The standalone commands below match rsReticulum and rsLXMF **1.5.0**, which follow Reticulum 1.6.0 and LXMF 1.3.0. Check the installed versions with `rnsd-rs --version` and `lxmd-rs --version`; each names the Python release it follows. Download a release from [rsReticulum](https://github.com/ratspeak/rsReticulum/releases) and [rsLXMF](https://github.com/ratspeak/rsLXMF/releases), or follow their source instructions. App and library release numbers are separate.

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

With `--service`, the daemon writes its normal log to the config directory’s `logfile`, at the configured `loglevel`; without one it logs at Notice, so set `loglevel = 4` for more detail. For the example account, read it with `sudo -u operator tail -n 100 /home/operator/.rsReticulum/logfile`. The journal commands above show service lifecycle and startup failures.

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

For I2P, run the I2P router, for example i2pd, in its own container on a private network shared with `rnsd-rs`. Enable SAM there and set the interface's `i2p_sam_host` to the router container's name. Never publish the SAM port. Start order doesn't matter: the interface keeps retrying SAM until it answers.

For a USB radio, pass the specific device and arrange permissions. For an RNode TCP bridge, configure its actual `tcp://host:port` endpoint and test reachability from the container. Do not expose the radio-control socket publicly without considering who can control that radio.

With `--service`, normal daemon logs are in `/data/reticulum/logfile`, also visible through the host mount.

Keep the state directory outside the container and back it up. Record the image, config and mount before an update; preserve the mount when replacing the container.

## Public backbone with discovery

A transport node with a public listener can announce that listener, so other nodes find it among their discovered interfaces and, if they allow it, connect on their own. Start from a listener that already works from outside your network, then add the discovery keys:

```ini
[reticulum]
  enable_transport = yes

[interfaces]
  [[Public Backbone]]
    type = BackboneInterface
    enabled = yes
    mode = gateway
    listen_on = 0.0.0.0
    port = 4242

    discoverable = yes
    discovery_name = Region A Public Entrypoint
    reachable_on = backbone.example.org
    announce_interval = 720
    discovery_stamp_value = 24
```

Replace `backbone.example.org` with the address or hostname clients should use; the port comes from `port`. A `TCPServerInterface` works the same way, with `listen_ip` and `listen_port`. Keep `mode = gateway`: without it, `rnsd-rs` switches the interface to Gateway mode and logs a notice at every start. The node announces the listener soon after start, then every `announce_interval` minutes. A higher `discovery_stamp_value` takes more CPU to make, and other nodes accept 16 or more by default. Each key is described in the [configuration reference](../reference/configuration-reference.md#discovery-keys).

To check it:

- On this node, `rnstatus-rs --config ~/.rsReticulum` should show the interface up in Gateway mode. It doesn't list the node's own discovery announces, but the log warns when `reachable_on` is missing or isn't a valid address, and the interface is then not announced.
- On another node connected to the same network, set `discover_interfaces = yes` in `[reticulum]` and restart it. It hears only later announces, so restart this node afterwards or wait for the next one. `rnstatus-rs --discovered` then lists the interfaces it has found, and `rnstatus-rs -D` adds each one's details and the config entry for connecting to it.

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
6. Once the test works, give `lxmd-rs` its own service unit with the same explicit directories, `--service`, and the same user as `rnsd-rs`. It then logs to `logfile` in its config directory. Start it only once `rnsd-rs` answers, for example:

   ```ini
   [Unit]
   Requires=rnsd-rs.service
   After=rnsd-rs.service

   [Service]
   User=operator
   ExecStartPre=/bin/sh -c 'until /usr/local/bin/rnstatus-rs --config /home/operator/.rsReticulum >/dev/null 2>&1; do sleep 2; done'
   ExecStart=/usr/local/bin/lxmd-rs --config /home/operator/.rsLXMF --rnsconfig /home/operator/.rsReticulum --service
   Restart=on-failure
   ```

   If `rnsd-rs` isn't running, `lxmd-rs` becomes the shared instance itself and opens the interfaces in the Reticulum config, and so does `lxmd-rs --status`. An `rnsd-rs` started later only attaches to it, and logs that it is connected to another shared instance. Use `rnstatus-rs` for health checks: it never starts an instance, and exits with an error when none is running.

   In Docker, containers that share a network namespace, for example with `network_mode: service:rnsd`, share the instance; give them the same Reticulum directory. Containers in separate namespaces can't reach each other's shared instance. If the `rnsd-rs` container is recreated, restart the `lxmd-rs` one too, so it joins the new namespace.

In Ratspeak, **Automatic** selects from discovered propagation nodes; it does not ensure your intended node is chosen. Use the manual node setting when your test or group requires a particular address.

Review storage limits, accepted message size, authentication, stamp costs and peering policy in the [rsLXMF configuration](https://github.com/ratspeak/rsLXMF#configuration). Propagation peering depends on discovery, configured policy and capacity; it is not an assurance that every message has redundant copies.

The LXMF directory holds its own identity, message store, and `storage/lxmf/state.db`. Backing up only the transport daemon's directory does not back up the Offline Inbox.

## Hosting a channel hub

Channel hosting is available in the desktop Ratspeak app. Keep the host awake and connected through an interface that participants can reach. A working TCP or radio connection still needs a usable Reticulum path to the hub.

1. In **Settings → General → Channels**, turn on **Channel hosting**. This reveals the hosting controls; it does not by itself start a hub.
2. Open **Channels**. Under **Your hub**, select the hub or its manage button to open **Hub administration**.
3. In its **Settings** tab, choose the **Hub name**, **Welcome & guidance**, announce schedule and **Recent activity** setting.
4. Select **Start hosting**. Check for **Hosting**. **Waiting for network** means hosting was requested but the network is not ready.
5. Copy the **Hub address** and share it with intended participants. Have someone on the intended connection join and exchange a short message; see the [client instructions](../using-ratspeak/messaging-and-contacts.md).

The hub terminates participants' links and can read the channel messages it relays. Tell participants who operates it and what rules apply. Private channels, invitations and join keys restrict access; they do not provide end-to-end encryption between channel participants.

### Create and manage channels

In the **Channels** tab of **Hub administration**, select **Create channel**. Choose a name and topic and set the policies that fit the group:

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

Saving hub settings while it is running briefly restarts it and interrupts live connections. Use **Stop hosting** to stop the service. Turning **Channel hosting** off in **Settings → General** also disables the hosting capability. Keep backups of the app profile if you need to preserve the hub identity and saved policy; quit the app completely before copying that profile.

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

Remote queries go to the node's transport identity. A node with `enable_transport = no` gets a new one at each start unless it sets `static_transport_identity = yes`, so set that on a leaf you manage remotely. On a transport node, `rnstatus-rs` shows the hash as the transport instance. On a transport node or a leaf with a static identity, you can also read it from the identity file:

```bash
rnid-rs -i ~/.rsReticulum/storage/transport_identity -p
```

Use the actual service directory and an account allowed to read that key. The full **Identity Hash** is the `REMOTE_TRANSPORT_IDENTITY_HASH` for `-R` queries. It is separate from the management client's identity created above. Releases before 1.4.0 used a separate `storage/remote_management_identity`; it is no longer read and can be deleted.

On a transport node, `respond_to_probes = yes` answers probes on a destination built from the same transport identity, and the node logs it at start-up. You can also derive it:

```bash
rnid-rs -i ~/.rsReticulum/storage/transport_identity -H rnstransport.probe
```

That command gives the `PROBE_DESTINATION_HASH` used below. Share these public hashes, not the identity file.

## Monitoring with rnstatus-rs, rnpath-rs, rnprobe-rs

Use the service's actual config directory in these examples. Replace the hash placeholders with full 32-character values.

```bash
# Local interface state and counters
rnstatus-rs --config ~/.rsReticulum

# Local path table
rnpath-rs --config ~/.rsReticulum --table

# Authorized remote status and path table
rnstatus-rs --config ~/.rsReticulum -R REMOTE_TRANSPORT_IDENTITY_HASH -i ~/.rsReticulum/identities/mgmt
rnpath-rs --config ~/.rsReticulum --table -R REMOTE_TRANSPORT_IDENTITY_HASH -i ~/.rsReticulum/identities/mgmt

# A destination configured to answer rnstransport.probe packets
rnprobe-rs --config ~/.rsReticulum rnstransport.probe PROBE_DESTINATION_HASH -n 5
```

The probe target must be a transport node with `respond_to_probes = yes`; its probe destination hash is not its LXMF address or its raw transport identity hash.

The flags differ between tools:

| Tool | Timeout | JSON output |
|---|---|---|
| `rnstatus-rs` | `-w SECONDS` | `--json` or `-j` |
| `rnpath-rs` | `-w SECONDS` for local responses; `-W SECONDS` for remote management | `--json` or `-j` |
| `rnprobe-rs` | `-t SECONDS`; `-w` instead controls the wait between probes | `--json` |

A path table entry, an answered probe and a delivered application message test different things. Keep a test destination for each important service. Check return codes/timeouts when collecting JSON for monitoring.

## Network stamps

Reticulum 1.6.0 adds stamps to announces, path requests, and link requests. Every 1.5.0 node checks the stamps it receives, but by default it neither makes destination and path request stamps nor requires any. Upstream plans to stamp by default in Reticulum 1.6.1 and to require stamps in 1.6.2.

To opt in early, set the switches in the `[stamps]` section of the Reticulum config:

```ini
[stamps]
  stamp_destinations = yes
  stamp_prs = yes
  # enforce_stamps = yes
```

Stamping costs CPU. A destination's stamp is made once and kept, but a slow host can take a while on its first announce, and `lr_stamp_timeout` and `pr_stamp_timeout` bound the time spent on link and path request stamps. Turn on `enforce_stamps` only when the nodes you rely on stamp too: an enforcing node drops announces, path requests, and link requests that don't meet its costs, so it stops hearing nodes that run older software. All keys and defaults are in the [configuration reference](../reference/configuration-reference.md#stamps), alongside the `[filter]` section that drops unwanted destination types and long-travelled packets.

## Updating

Record the current binaries, config paths, account and state mounts. Read the target release's compatibility notes. Stop the affected services cleanly and back up their complete state directories, including identities and the separate LXMF store. Protect those backups.

Install matching replacement binaries or rebuild the documented source revision, then restart with the same intended configuration. Moving to 1.5.0 changes the state format: `rnsd-rs` imports its known destinations, ratchets, and cached announces into SQLite files under `storage/`, and `lxmd-rs` moves its router state into `storage/lxmf/state.db`. Both import on first start, and an older release can't read the new files, so keep the backup until you've decided to stay. Check that each interface section says `enabled = yes`. An `ifac_size` set under 1.3 is in bytes: multiply it by 8, or convert it with `rnsd-rs config ifac-units`; see [Configuration reference](../reference/configuration-reference.md#common-interface-keys). Confirm the version, interface state, a routed message, and an Offline Inbox retrieval where applicable. For a channel hub, confirm its address, saved policy, and a participant reconnect.

If an update fails, retain the failed-state evidence and restore according to that release's compatibility limits. Do not assume a newer database or state format can be opened by an older binary. Changing the config directory or erasing state is not a routine update step.
