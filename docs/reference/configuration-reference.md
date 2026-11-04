---
sidebar_position: 1
---

# Configuration reference

This reference covers standalone **rsReticulum 1.3.0** and **rsLXMF 1.3.0**, plus app settings in **Ratspeak 1.0.40**. The app bundles newer protocol source than the standalone 1.3.0 downloads; their defaults are not interchangeable.

## Reticulum config (`~/.rsReticulum/config` or `~/.reticulum/config`)

The standalone `rnsd-rs` daemon reads an INI-style file with nested interface sections. Use explicit `enabled = yes` or `enabled = no` in each interface. In rsReticulum 1.3.0, an ordinary interface without either enable key defaults to enabled; do not rely on that default when moving configurations between versions or implementations.

rsReticulum defaults to rsReticulum-specific paths such as `~/.rsReticulum/config`, with `/etc/rsReticulum/config` or `~/.config/rsReticulum/config` taking precedence on Unix-like systems if present. Point `--config` at another Reticulum-compatible directory only when shared local state is intentional.

Three top-level sections:

| Section | Purpose |
|---|---|
| `[reticulum]` | Daemon-wide flags: transport role, shared instance, RPC. |
| `[logging]` | `loglevel` 0-7 (0 = quiet, 7 = extreme). |
| `[interfaces]` | One sub-block per interface (TCP, RNode, Auto, etc.). |

The daemon creates a starter file when none exists. Back up an existing configuration before editing it, then restart the daemon to apply changes.

## `[reticulum]` block

| Key | Default | Description |
|---|---|---|
| `enable_transport` | `No` | Make this node a transport router. Forwards traffic and announces for other nodes. Enable it on a node that should forward for others; a TCP listener alone does not enable forwarding. |
| `share_instance` | `Yes` | Run as a shared instance so other tools on this host can attach to this daemon over a local socket instead of opening their own interfaces. |
| `instance_name` | `default` | Name of the shared-instance socket. Multiple daemons on one host need distinct names. |
| `shared_instance_port` | `37428` | Local shared-instance data port when using TCP local sharing. |
| `instance_control_port` | `37429` | Local control-service port. Unix platforms can use a named local socket instead. |
| `rpc_key` | *(derived)* | Key for the local control service that tools such as `rnstatus-rs` and `rnpath-rs` use. Without one, it is derived from the transport identity. It is an admin credential: whoever holds it can read this node's state, drop its paths and block identities. |
| `enable_remote_management` | `No` | Allow remote RPC management from listed identities. |
| `remote_management_allowed` | *(none)* | Comma-separated identity hashes permitted to manage this node. |
| `respond_to_probes` | `No` | Reply to network probes used by `rnprobe-rs` for diagnostics. |
| `panic_on_interface_error` | `No` | Fail startup if an interface cannot be configured or started, instead of logging that failure and continuing. |

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
| `type` | Driver name, such as `TCPClientInterface`, `TCPServerInterface`, `UDPInterface`, `AutoInterface` or `RNodeInterface`. Serial, Bluetooth and other drivers also depend on the binary's build features. |
| `enabled` / `interface_enabled` | `yes` / `no` or `True` / `False`. For ordinary interfaces in 1.3.0, `enabled` takes precedence over `interface_enabled`; with neither present, the default is enabled. Use one explicit key, as in these examples. |
| `mode` | `full` (default), `access_point`, `roaming`, `boundary`, `gateway`. Controls how announces are rebroadcast. |
| `network_name` | IFAC network name used to derive link access credentials. Peers on that link need matching IFAC settings. |
| `passphrase` | IFAC passphrase, combined with the network name to derive link access credentials. This is separate from end-to-end message encryption. |
| `ifac_size` | IFAC tag length in **bytes**, from 1 to 64 in rsReticulum 1.3.0. Leave unset unless you need a specific value; check the other implementation's units before sharing a config. |
| `announce_cap` | Max share of bandwidth used for announces. Default `2` (percent). |
| `announce_rate_target` | Target interval between announces from a destination, in seconds, used by announce rate limiting. |
| `bitrate` | Link bitrate in bps. Used for airtime accounting on lossy or rate-limited links. |

### TCP keys (`TCPClientInterface`, `TCPServerInterface`)

| Key | Used by | Description |
|---|---|---|
| `target_host` | Client | Hostname or IP of the remote peer. |
| `target_port` | Client | TCP port on the remote peer. |
| `listen_ip` | Server | Local bind address. `0.0.0.0` for all interfaces. |
| `listen_port` | Server | Local bind port. |

### RNode keys (`RNodeInterface`, LoRa radios)

Ratspeak writes `mode = roaming` for a newly added RNode, matching the usual mobile-radio role. Developer Mode exposes the interface-mode selector for fixed infrastructure and other deliberate topologies. Existing or imported RNode configurations keep their configured mode; if an older configuration omits `mode`, Reticulum's ordinary `full` default still applies.

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

## LXMF / `lxmd-rs` config

INI format. Read by `lxmd-rs`, the LXMF propagation node daemon. Ratspeak calls the client-facing feature Offline Inbox, but LXMF calls the server role a propagation node. The daemon reads this file even with propagation disabled; Ratspeak app preferences are managed separately. Use `lxmd-rs --config <dir>` for an explicit config directory.

### `[propagation]`

| Key | Description |
|---|---|
| `enable_node` | Enable propagation node duties (store-and-forward for offline peers). |
| `node_name` | Display name announced to peers. |
| `announce_interval` | Minutes between propagation-node announces. |
| `announce_at_start` | Announce the propagation node when the daemon starts. |
| `autopeer` | Automatically peer with discovered propagation nodes. |
| `autopeer_maxdepth` | Maximum autopeering depth. |
| `message_storage_limit` | Maximum disk used for stored messages, in megabytes. |
| `propagation_message_max_accepted_size` | Largest single propagated message accepted from peers, in kilobytes. |
| `propagation_sync_max_accepted_size` | Largest accepted propagation sync transfer, in kilobytes. |
| `propagation_stamp_cost_target` | Target stamp cost for propagated messages. |
| `propagation_stamp_cost_flexibility` | Accepted variance around the target stamp cost. |
| `peering_cost` | Stamp cost used for peering. |
| `remote_peering_cost_max` | Maximum accepted remote peering cost. |
| `max_peers` | Maximum propagation peers. |
| `prioritise_destinations` | Comma-separated destination hashes whose messages are kept first when storage fills. |
| `static_peers` | Comma-separated propagation peer destination hashes to retain as static peers. |
| `from_static_only` | Restrict incoming propagation peer transfers to configured static peers. |
| `auth_required` | Require propagation clients to identify and appear in the `allowed` file in the LXMF config directory. This is separate from `control_allowed`. |
| `control_allowed` | Comma-separated identity hashes authorized for node control. Treat this list as administrative access. |

The `allowed` file contains one 32-character identity hash per line. With `auth_required = yes`, an empty client allowlist does not authorize retrieval. `control_allowed` grants administration and does not add clients to that file.

### `[lxmf]`

| Key | Description |
|---|---|
| `display_name` | Display name for this LXMF peer. |
| `announce_at_start` | Announce the local LXMF destination when the daemon starts. |
| `announce_interval` | Minutes between local LXMF peer announces. |
| `delivery_transfer_max_accepted_size` | Largest direct delivery transfer accepted, in kilobytes. |
| `on_inbound` | Optional command hook for inbound messages. Treat this as security-sensitive. |

### `[logging]`

| Key | Description |
|---|---|
| `loglevel` | Log verbosity, 0-7. |

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

Transport Mode is stored as `transport_mode`: **OFF**, **ON** or **AUTO**.
OFF is the fresh default. ON enables local forwarding when Ratspeak owns the
network runtime. AUTO requires an enabled non-LoRa interface, no enabled
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

For Ratspeak, use **Settings → Identity → Export Identity** and the app's import
or restore flow. A PIN-encrypted `.rsi` backup includes identity material and
metadata, but not message history or app settings. Raw Reticulum exports are
unencrypted. A hardware private key cannot be exported. See
[Settings & Identity](../using-ratspeak/settings-and-identity.md) before moving or
recovering an identity. Never publish private keys, backup phrases or backup PINs.
