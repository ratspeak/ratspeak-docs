---
sidebar_position: 2
---

# Home or friend group

For people on the same Wi-Fi or LAN, start by enabling **Local Network** on each Ratspeak device and test a message. An always-on node becomes useful when people connect at different times, use separate networks, or need a stable shared connection.

This guide sets up a TCP transport for a group. An Offline Inbox and a channel hub are optional, separate services.

## Choose where the node runs

Use a machine you can keep powered and maintain: a home computer, a small Linux server or a VPS. A home server keeps local connections available during an internet outage; a remote VPS still depends on each user's route to the internet. Neither gives a distant radio user connectivity without a working radio path or gateway.

For connections outside the server's LAN, arrange a reachable host and TCP port. A VPS usually has a public address; a home connection may need router forwarding and may be behind carrier-grade NAT. Confirm that path before configuring every client.

## Step 1 - set up the always-on node

Install the applicable [rsReticulum tools](https://github.com/ratspeak/rsReticulum/releases), or follow their [source build instructions](https://github.com/ratspeak/rsReticulum#building). The examples here use the standalone `rnsd-rs` configuration, not the app's data directory.

Create `~/.rsReticulum/config` and use that directory explicitly when starting the daemon. Replace the example network name and passphrase with your group's values:

```ini
[reticulum]
  enable_transport = yes
  share_instance = yes
  instance_control_socket = yes

[interfaces]
  [[Friend group]]
    type = TCPServerInterface
    enabled = yes
    listen_ip = 0.0.0.0
    listen_port = 4242
    networkname = our-friends
    passphrase = replace-with-your-shared-secret
```

Use a strong passphrase and share it privately. Leave `ifac_size` at its interface default unless you are matching an existing network with an explicit size.

Start the node:

```bash
rnsd-rs --config ~/.rsReticulum
```

In another terminal, check its interfaces:

```bash
rnstatus-rs --config ~/.rsReticulum
```

Allow inbound TCP on your chosen port through the relevant host/router firewall. On a home network, expose only the intended listener. Do not expose the daemon's local shared-instance or control ports as public services.

Once the foreground test works, use [Infrastructure and ops](infrastructure-and-ops.md#raspberry-pi-systemd) to run it as a service.

## Step 2 - lock the interface with IFAC

The `networkname` and `passphrase` fields above enable IFAC for this TCP interface. Clients must match them. A TCP socket may connect even when the IFAC values differ, so check an announce and message as well as the connection indicator.

IFAC authenticates interface traffic. It does not make the server's IP address, open port or traffic volume invisible. Anyone holding the shared secret can participate, and a group member's other interfaces may connect the segment to a wider network. Decide together which bridges are intended.

Avoid leaving an unintended open AutoInterface or second TCP listener on a node intended to serve only this group. A Local Network **Group ID** separates discovery groups; it is not a secret or an IFAC passphrase.

## Step 3 - add it to each Ratspeak client

1. Open **Network**, select **+** next to **Internet/TCP**, and choose **Custom**.
2. Enter the server's reachable host and port.
3. Enable **Use IFAC**. Enter the matching **IFAC Network Name** and **IFAC Passphrase**.
4. Connect, then check the interface status.
5. Have another member announce from **Network**. Find them in **Peers**, send a message and confirm a reply. Add them to **Contacts** explicitly if you want to save them.

For a standalone Reticulum client, the corresponding interface is:

```ini
[interfaces]
  [[Friend group]]
    type = TCPClientInterface
    enabled = yes
    target_host = group.example.org
    target_port = 4242
    networkname = our-friends
    passphrase = replace-with-your-shared-secret
```

`group.example.org` is a placeholder. Use the address you tested in step 1. Match names, passphrases and any explicit IFAC size across both ends; see [Configuration reference](../reference/configuration-reference.md) for version-specific details.

## Add offline delivery or group conversation

For messages to people who are offline, operate or choose an **Offline Inbox** and configure it in the clients. Test by taking a recipient offline, sending through propagation, then reconnecting and fetching the message. The transport daemon alone does not provide this storage.

For live group conversation, a desktop member can [host a channel hub](infrastructure-and-ops.md#hosting-a-channel-hub). Tell participants that the hub reads and relays channel content. A private or invite-only channel controls admission; it does not turn channel content into end-to-end encrypted direct messages.

## Bringing in handhelds (rsDeck/rsCardputer)

Current device builds are supplied by [Ratspeak Handheld](../hardware/handheld-guide.md). A standalone handheld uses its own identity and radio connection. In RNode mode, a supported handheld supplies the radio for a phone or computer.

A TCP-only server cannot reach a LoRa-only handheld without a gateway between the two segments. Match the radio parameters and use only the IFAC configuration supported by the actual firmware and mode. Test the complete path before treating the handheld as part of the group.

## Maintenance

Keep the daemon version, config directory and service account recorded. Read release notes before updating; app and standalone daemon releases do not have to use the same version number. Back up the complete configured state directories while the services are stopped, including the LXMF directory if you run an Offline Inbox.

If membership changes, rotate the shared secret on every participating interface and test again. Devices still using the old secret cannot join the changed interface, but rotation does not retract old messages or remove another network path.

When a connection fails, check the listener, firewall, client address, IFAC values and routing evidence before changing identities or erasing state. See [Troubleshooting](../reference/troubleshooting.md).
