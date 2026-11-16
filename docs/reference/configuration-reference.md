---
sidebar_position: 1
---

# Configuration reference

This reference covers **rsReticulum 1.5.0** and **rsLXMF 1.5.0**, the standalone tools and the libraries inside **Ratspeak 1.1.0**, plus the app's own settings. They follow Reticulum 1.6.0 and LXMF 1.3.0, so the keys below are the ones Python Reticulum and `lxmd` read, with the exceptions noted.

## Reticulum config (`~/.rsReticulum/config` or `~/.reticulum/config`)

The standalone `rnsd-rs` daemon reads an INI-style file with nested interface sections. An interface starts only when its section has `enabled = yes` or `interface_enabled = yes`, as in Python Reticulum; a section with neither key is skipped with a warning.

rsReticulum defaults to rsReticulum-specific paths such as `~/.rsReticulum/config`, with `/etc/rsReticulum/config` or `~/.config/rsReticulum/config` taking precedence on Unix-like systems if present. Point `--config` at another Reticulum-compatible directory only when shared local state is intentional.

| Section | Purpose |
|---|---|
| `[reticulum]` | Daemon-wide flags: transport role, shared instance, RPC, management, and discovery. |
| `[stamps]` | Network stamp generation and requirements. |
| `[filter]` | Destination types and hop counts this node drops. |
| `[logging]` | `loglevel` 0–8, from critical only to extreme. The starter file sets `4`; with no `loglevel`, `rnsd-rs` logs at `3`, Notice. |
| `[interfaces]` | One sub-block per interface (TCP, RNode, Auto, and others). |

The daemon creates a starter file when none exists; `rnsd-rs --exampleconfig` prints the annotated version. Back up an existing configuration before editing it, then restart the daemon to apply changes. A malformed value stops the daemon at start-up, and so does an interface that can't be built or started.

## `[reticulum]` block

| Key | Default | Description |
|---|---|---|
| `enable_transport` | `No` | Make this node a transport router. Forwards traffic and announces for other nodes. Enable it on a node that should forward for others; a TCP listener alone does not enable forwarding. |
| `share_instance` | `Yes` | Run as a shared instance so other tools on this host can attach to this daemon over a local socket instead of opening their own interfaces. |
| `instance_name` | `default` | Name of the shared-instance socket. Multiple daemons on one host need distinct names. |
| `shared_instance_port` | `37428` | Local shared-instance data port when using TCP local sharing. |
| `instance_control_port` | `37429` | Local control-service port. Unix platforms can use a named local socket instead. |
| `rpc_key` | *(derived)* | Key for the local control service that tools such as `rnstatus-rs` and `rnpath-rs` use. Without one, it is derived from the transport identity. It is an admin credential: whoever holds it can read this node's state, drop its paths, and block identities. |
| `link_mtu_discovery` | `Yes` | Let Links use the largest packets their path allows, so transfers on fast links finish sooner. |
| `enable_remote_management` | `No` | Allow remote status and path queries from listed identities. |
| `remote_management_allowed` | *(none)* | Comma-separated identity hashes permitted to manage this node. |
| `static_transport_identity` | `No` | Keep the same transport identity across restarts when transport is off. Set it on a leaf node you manage remotely; a transport node always keeps its identity. |
| `enable_interface_management` | `Yes` | Allow `rnstatus-rs --attach`, `--detach`, and `--reload` through the control service. |
| `respond_to_probes` | `No` | On a transport node, answer `rnprobe-rs` probes on a destination built from the transport identity. The node logs that destination at start-up. |
| `discover_interfaces` | `No` | Collect the interfaces other nodes announce for discovery. `rnstatus-rs --discovered` lists them. |
| `required_discovery_value` | `16` | Lowest stamp value a received discovery announce must carry. |
| `autoconnect_discovered_interfaces` | `0` | Most discovered interfaces to connect to automatically; `0` connects none. |
| `autoconnect_unverified_implementations` | `No` | Auto-connect discovered Backbone interfaces from any implementation. Without it, `rnsd-rs` auto-connects only to Python Reticulum 1.5.7 or later and rsReticulum 1.5.0 or later. |
| `panic_on_interface_error` | `No` | Shut the daemon down when a running interface fails, for example when its radio disappears. |

`storage/transport_identity` holds the node's private key and is written readable only by its owner (mode `0600`). Tools attached to a shared instance, such as `rnstatus-rs`, `rnpath-rs`, and `lxmd-rs`, read it to derive the RPC key, so run them as the same user as `rnsd-rs`, or set an explicit `rpc_key`, in hex, in the config they use.

## `[stamps]`

Reticulum 1.6.0 adds proof-of-work stamps to announces, path requests, and link requests. This release checks every stamp it receives, but neither makes nor requires destination and path request stamps unless you turn them on. A link request is stamped already when its destination announced a link cost. Upstream plans to turn on stamping by default in 1.6.1 and to require stamps in 1.6.2.

| Key | Default | Description |
|---|---|---|
| `stamp_destinations` | `No` | Stamp this node's announces. A destination's stamp is made once and kept, so expect some CPU use on its first announce. |
| `stamp_prs` | `No` | Stamp this node's path requests. |
| `enforce_stamps` | `No` | Drop announces, path requests, and link requests that don't meet the required costs. Software older than Reticulum 1.6 doesn't stamp, so a node with this on doesn't hear it. |
| `always_stamp_lrs` | `No` | Stamp link requests at `lr_cost` even when the destination announced no cost. |
| `destination_cost` | `23.5` | Cost an announce must meet, for this node and the announces it forwards. |
| `destination_value` | `25.0` | Value this node aims for when stamping its own destinations. An application can ask for more, not less. |
| `pr_cost` | `15.8` | Cost a path request must meet. |
| `pr_value` | `15.8` | Value this node aims for when stamping its path requests. |
| `lr_cost` | `12.5` | Link request cost used when the destination's own is unknown. At most `40`. |
| `lr_stamp_timeout` | `15` | Seconds to spend making a link request stamp. At least `0.02`. |
| `pr_stamp_timeout` | `15` | Seconds to spend making a path request stamp. At least `0.02`. |

Costs and values can be fractional and are capped at `100`. The four switches only turn features on: `no` leaves the default in place. An interface section can override `destination_cost` and `pr_cost` for traffic it carries. In Ratspeak, **Settings → Network → Network stamps** writes these keys: **Stamp my announces and path requests** sets `stamp_destinations` and `stamp_prs` together, and **Require stamps from others** sets `enforce_stamps`.

## `[filter]`

| Key | Default | Description |
|---|---|---|
| `ignored_types` | *(none)* | Full destination names, such as `nomadnetwork.node`, whose announces this node drops. |
| `required_only` | `No` | Keep only announces for destination types that a program on this node registered or that `allowed_types` lists. Announces from local programs still pass. |
| `allowed_types` | *(none)* | Destination names kept when `required_only` is on. |
| `hop_limiter` | `128` | Drop packets that arrive having travelled this many hops or more, from `0` to `128`. |

`hop_limiter` is read only from `[filter]`:

```ini
[filter]
  hop_limiter = 16
```

The file `rnsd-rs` writes on first run has no `hop_limiter`. The `rnsd-rs --exampleconfig` output shows a commented `# hop_limiter = 16` under `[reticulum]`; uncommented there, it has no effect, and nothing is logged.

## `[interfaces]` block

Each interface is declared as a sub-block. The block name is a label; `type` selects the driver.

```
[[Hub Uplink]]
    type = TCPClientInterface
    target_host = hub.example.org
    target_port = 4242
    enabled = yes
```

### Common interface keys

| Key | Description |
|---|---|
| `type` | Driver name, such as `TCPClientInterface`, `TCPServerInterface`, `UDPInterface`, `AutoInterface`, or `RNodeInterface`. Serial, Bluetooth, and other drivers also depend on the binary's build features. |
| `enabled` / `interface_enabled` | `yes` / `no` or `True` / `False`. One of them must say yes for the interface to start. |
| `mode` or `interface_mode` | `full` (default), `access_point`, `roaming`, `boundary`, `gateway`. Controls how announces are rebroadcast. |
| `network_name` | IFAC network name used to derive link access credentials. Peers on that link need matching IFAC settings. `networkname` is accepted too; when both are set, `network_name` is used. |
| `passphrase` | IFAC passphrase, combined with the network name to derive link access credentials. This is separate from end-to-end message encryption. |
| `ifac_size` | IFAC tag length in **bits**, as in Python Reticulum; `128` is 16 bytes. Leave unset unless you need a specific value. See the upgrade note below. |
| `destination_cost`, `pr_cost` | Stamp costs for this interface, overriding `[stamps]`. |
| `announce_cap` | Max share of bandwidth used for announces. Default `2` (percent). |
| `announce_rate_target` | Target interval between announces from a destination, in seconds, used by announce rate limiting. |
| `bitrate` | Link bitrate in bps. Used for airtime accounting on lossy or rate-limited links. |

**Upgrading with an explicit `ifac_size`.** A bare `ifac_size = 16` meant 16 bytes in rsReticulum 1.3, was rejected by 1.4, and means 16 bits (2 bytes) from 1.5 on, as in Python Reticulum. If you upgrade straight from 1.3 and set a size, multiply it by 8 (16 becomes 128), or stop the daemon and let `rnsd-rs` convert it:

```bash
rnsd-rs --config ~/.rsReticulum config ifac-units --interface "Friend group" --source-units bytes
```

Name each interface section with `--interface`, repeating it for more than one. The command shows the change; run it again with `--write` to save it. It writes the size in bits, marked with `ifac_size_unit = bits`, and keeps a private backup of the old file. A 1.4 file that already marks its size with `ifac_size_unit = bits` or `ifac_size_bytes` works unchanged.

### TCP keys (`TCPClientInterface`, `TCPServerInterface`)

| Key | Used by | Description |
|---|---|---|
| `target_host` | Client | Hostname or IP of the remote peer. |
| `target_port` | Client | TCP port on the remote peer. |
| `listen_ip` | Server | Local bind address. `0.0.0.0` for all interfaces. |
| `listen_port` | Server | Local bind port. |

### RNode keys (`RNodeInterface`, LoRa radios)

Ratspeak writes `mode = roaming` for a newly added RNode, matching the usual mobile-radio role. **Settings → Developer → Developer mode** shows the **Interface mode** selector in radio setup, for fixed infrastructure and other deliberate topologies. Existing or imported RNode configurations keep their configured mode; if an older configuration omits `mode`, Reticulum's ordinary `full` default still applies.

| Key | Description |
|---|---|
| `port` | Serial device, e.g. `/dev/ttyUSB0` or `COM3`, or a TCP-backed RNode stream such as `tcp://192.168.1.50:7633`. |
| `frequency` | Centre frequency in Hz. Must match other nodes on the link and local regulations. |
| `bandwidth` | LoRa bandwidth in Hz (e.g. `125000`, `250000`). |
| `txpower` | Transmit power in dBm. |
| `spreadingfactor` | LoRa SF, `5`-`12`. Higher = longer range, lower throughput. |
| `codingrate` | LoRa coding rate, `5`-`8` (means 4/5 to 4/8). |
| `airtime_limit_short` | Short-window airtime limit, as a percentage; supported by the RNode configuration. |
| `airtime_limit_long` | Long-window airtime limit, as a percentage; supported by the RNode configuration. |

For RNode over TCP, keep `type = RNodeInterface` and set `port` to the radio endpoint:

```ini
[[Field TCP RNode]]
    type = RNodeInterface
    enabled = yes
    port = tcp://192.168.1.50:7633
    frequency = 915000000
    bandwidth = 250000
    txpower = 17
    spreadingfactor = 9
    codingrate = 5
```

Choose a frequency and power permitted for your radio and location; the example is not a regional preset.

This is different from `TCPClientInterface`. A TCP client connects to another Reticulum node or hub; an RNode TCP endpoint connects to the radio control stream and still transmits over LoRa.

### AutoInterface keys

`AutoInterface` discovers peers on the local LAN over IPv6 multicast. Useful keys: `group_id` (separate logical groups on the same LAN), `discovery_scope` (`link`, `admin`, `site`, `organisation`, `global`), `devices` (whitelist of OS interface names), `ignored_devices` (blacklist).

### Discovery keys

A TCP or Backbone listener, an I2P interface, or a radio interface can announce itself so other nodes discover it. [Infrastructure and ops](../deployment/infrastructure-and-ops.md#public-backbone-with-discovery) has a full example.

| Key | Description |
|---|---|
| `discoverable` | `yes` announces this interface for discovery. |
| `mode` | `gateway` on a listener, `access_point` on a radio. A discoverable interface in another mode is switched to one of these, with a notice at every start. |
| `discovery_name` | Name shown to people who discover the interface. |
| `reachable_on` | Public IP address or hostname that clients connect to, without the port; the port comes from the interface. A TCP or Backbone listener without a valid `reachable_on` runs but isn't announced, and the log says so. |
| `announce_interval` | Minutes between discovery announces; `360` by default and at least `5`. The first goes out soon after start. |
| `discovery_stamp_value` | Stamp value of each announce; `16` by default. Higher values take more CPU to make. Other nodes accept `16` or more unless their `required_discovery_value` says otherwise. |

The [Reticulum manual](https://reticulum.network/manual/interfaces.html#discoverable-interfaces) describes the optional keys, such as `discovery_lxmf_address`, `latitude`, `longitude`, `height`, `publish_ifac`, and `discovery_encrypt`.

## Reticulum storage

`rnsd-rs` keeps its state under `<config directory>/storage/`:

| Path | Holds |
|---|---|
| `transport_identity` | The node's transport identity. |
| `known_destinations.db` | Known destinations and the ratchets received from them. |
| `cache/announces.db` | Cached announces. |

The two databases are SQLite files in the format Python Reticulum 1.6.0 uses. On its first start, 1.5.0 imports the files earlier releases wrote, so going back to an older release starts with no known destinations. A shared-instance client reads the owner's databases and never writes them. If a database can't be opened, the daemon logs it once and keeps that state in memory for the session.

## LXMF / `lxmd-rs` config

INI format, read by `lxmd-rs`, the LXMF daemon, from `<config directory>/config`. Ratspeak calls the client-facing feature Offline Inbox, but LXMF calls the server role a propagation node. The daemon reads this file even with propagation disabled; Ratspeak app preferences are managed separately. Use `lxmd-rs --config <dir>` for an explicit config directory and `lxmd-rs --exampleconfig` for the annotated file.

`lxmd-rs` reads the file as Python's `lxmd` does. It writes a default file on first run, and a malformed value, or a stamp cost of 100 or more, stops it instead of falling back to a default. With `--service`, it logs to `logfile` in the config directory.

### `[propagation]`

| Key | Description |
|---|---|
| `enable_node` | Run a propagation node, storing and forwarding messages for offline peers. `--propagation-node` turns it on too. |
| `node_name` | Display name announced to peers. |
| `announce_interval` | Minutes between propagation-node announces; `360` in the default file. |
| `announce_at_start` | Announce the propagation node when the daemon starts. |
| `autopeer` | Automatically peer with discovered propagation nodes. |
| `autopeer_maxdepth` | Furthest a node can be, in hops, to be peered automatically. |
| `message_storage_limit` | Disk used for stored messages, in megabytes; `500` by default. Large and old messages go first when it fills. |
| `propagation_message_max_accepted_size` | Largest single propagated message accepted, in kilobytes; `256` by default. |
| `propagation_sync_max_accepted_size` | Largest sync accepted from a peer, in kilobytes; `10240` by default. |
| `propagation_stamp_cost_target` | Stamp cost a message needs to be delivered through this node; `16` by default. |
| `propagation_stamp_cost_flexibility` | How far below the target a message forwarded by another propagation node may be; `3` by default. |
| `propagation_stamp_throttle` | Minutes a peer that sent messages with too-low stamps is throttled; `5` by default and at least. |
| `peering_cost` | Value a remote node must reach to peer with this node; `18` by default. |
| `remote_peering_cost_max` | Highest peering cost of a remote node this node will meet; `26` by default. |
| `max_peers` | Most propagation peers this node takes automatically; `20` by default. |
| `prioritise_destinations` | Comma-separated destination hashes whose messages are kept first when storage fills. |
| `static_peers` | Comma-separated propagation node destination hashes this node always peers with. |
| `from_static_only` | Accept incoming propagation messages only from static peers. |
| `sequential_pn_stamp_validation` | Check sync batches one at a time, asking other peers to retry later; on by default. |
| `static_peers_bypass_sequential` | Let static peers skip that queue; on by default. |
| `max_inbound_syncs` | Inbound syncs accepted at once; `3` by default. Use `1` on a slow system. |
| `auth_required` | Require propagation clients to identify and appear in the `allowed` file in the LXMF config directory. This is separate from `control_allowed`. |
| `control_allowed` | Comma-separated identity hashes authorized for node control. Treat this list as administrative access. |

The `allowed` file contains one 32-character identity hash per line. With `auth_required = yes`, an empty client allowlist does not authorize retrieval. `control_allowed` grants administration and does not add clients to that file. rsLXMF also reads a few keys of its own, among them `outbound_node`; see its [configuration notes](https://github.com/ratspeak/rsLXMF/blob/v1.5.0/README.md#configuration).

### `[lxmf]`

| Key | Description |
|---|---|
| `display_name` | Display name for this LXMF peer. |
| `announce_at_start` | Announce the local LXMF destination when the daemon starts. |
| `announce_interval` | Minutes between local LXMF peer announces; off unless set. |
| `stamp_cost` | Stamp cost required for incoming messages. Costs can be fractional. |
| `delivery_transfer_max_accepted_size` | Largest direct delivery accepted, in kilobytes; `1` by default. |
| `on_inbound` | Optional command run with the path of each received message. Treat this as security-sensitive. |

### `[logging]`

| Key | Description |
|---|---|
| `loglevel` | Log verbosity; the default file sets `4`. With no `loglevel`, `lxmd-rs` logs at `3`, Notice. |

### Network stamps and storage

`lxmd-rs` follows the `[stamps]` section of its Reticulum configuration. Delivery, propagation downloads, and peer sync stamp their link requests when the destination asks for it. With stamping on, `lxmd-rs` also stamps its own announces.

Its state lives in the config directory: `identity` is the daemon's identity, and `storage/lxmf/state.db` holds delivered message ids, stamp costs, and tickets, in the SQLite format LXMF 1.3.0 uses. Ratchets and known identities are left to Reticulum's storage. On its first start, 1.5.0 imports the old cache files and removes the ratchet and identity files earlier `lxmd-rs` releases kept; each contact's ratchet returns with its next announce, and going back to an older release starts without them.

## Ratspeak app settings

Ratspeak does **not** use a hand-edited config file for app preferences. Display name, theme, auto-announce interval, Offline Inbox mode/manual node hash, notification preferences, and most UI state live in the SQLite database next to the app data and are managed through the Settings view.

The active identity's network configuration normally lives at
`<app data root>/.ratspeak/identities/<identity hash>/reticulum/config`.
The top-level `.ratspeak/reticulum/config` is a seed/legacy location. This is
separate from a standalone daemon's configuration. See
[Install & Platform Setup](../getting-started/install-and-platform-setup.md)
for the platform data root.

Use the app's **Network** controls to change its interfaces. Set
`RATSPEAK_RNS_CONFIG_DIR` only when deliberately selecting another Reticulum
configuration directory. That override applies across identities and bypasses
the normal separate network directories; switching app identities does not
select a new override directory.

**Relay for other devices** (Transport Mode) is stored as `transport_mode`:
`off`, `on` or `auto`, shown as **Off**, **On** and **Automatic**. Off is the
fresh default. On enables local forwarding when Ratspeak owns the
network runtime. Automatic requires an enabled non-LoRa interface, no enabled
LoRa/RNode interface, and Wi-Fi, Ethernet or an unknown desktop network type.
It also stays off when more than one recognized public TCP server is enabled.
A shared-instance client relies on its owner for forwarding.

The app uses its own shared-instance selector and ports `37430`/`37431` when
app-managed local sharing applies. Standalone rsReticulum uses `37428`/`37429`
by default. Separate configuration directories alone do not prevent conflicts:
shared-instance names, listening ports and exclusive hardware also matter.

Do not delete the app profile to troubleshoot a preference. It contains the
message database and identity material as well as settings. Use the setting's
own control, and use the app's identity export before any deliberate reset.

## Identity files

A raw software Reticulum private key contains 64 bytes: a 32-byte X25519 private
key and a 32-byte Ed25519 seed. Other identity formats are not interchangeable
with that file. A PIN-protected Ratspeak identity uses an encrypted vault;
a hardware-backed identity keeps its private key on the token.

| Tool | Normal identity storage |
|---|---|
| Ratspeak app | `<app data root>/.ratspeak/identities/<hash>/`; the file is `identity`, `identity.enc` or a hardware descriptor `identity.hwid`, depending on the identity. |
| Standalone `rnsd-rs` | `<config directory>/storage/transport_identity`. This is the transport identity, not an app messaging backup. |
| Standalone `lxmd-rs` | `<config directory>/identity`; an existing legacy `<config directory>/.lxmf/identity` can be used as a fallback. |

For Ratspeak, use **Export…** on the **Identity** page and the app's **Import or
restore** flow. A PIN-encrypted `.rsi` backup includes identity material and
metadata, but not message history or app settings. Raw Reticulum exports are
unencrypted. A hardware private key cannot be exported. See
[Settings & Identity](../using-ratspeak/settings-and-identity.md) before moving or
recovering an identity. Never publish private keys, backup phrases or backup PINs.
