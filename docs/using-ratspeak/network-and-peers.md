---
sidebar_position: 2
---

# Network and peers

Use **Peers** to find known people and inspect the last route to them. Use **Network** to check this device's connections and recent activity. A peer's last-seen time is a clue about activity, not a promise that a message will arrive now.

## The Peers view

The Peers list contains peers Ratspeak has learned about, including saved contacts. Rows show the display name or address, identicon, activity indicator, and any available profile status or interface badge.

Peers are grouped as follows:

- **Contacts** — saved contacts, shown first.
- **Recent** — recently heard peers with a name.
- **Recent\*** — recently heard peers without a name.
- **Seen today** — less recent activity.
- **Older / unknown** — older records or peers with no recent activity information.

Tap a group header to collapse or expand it. Search by name, address, or profile status. The sort menu offers **Alphabetical**, **Hops**, and **Last Seen**.

Select a peer to open their details. **Activity** shows when they were first and last heard. **Routing** shows the known route, hop count, path age, next hop, and last known interface. These values may be missing or stale. Use the message action to start a conversation, or add the peer to your contacts.

**Block** hides the peer and their messages in Ratspeak. The block dialog can also block at the network layer, dropping packets for the corresponding identity across all accounts on this device. If Ratspeak has not yet learned that network identity, filtering begins after its next announce. Do not confuse this with removing the peer from everyone else's network.

## The Network view

**Network → Connections** groups connections under **Internet/TCP**, **Bluetooth Peer**, **Local Network**, **Radio**, and **Host**. Expand the section for the connection you want to inspect. The view reports connection state and traffic counters; available details and actions depend on the interface type.

**Network → Activity** shows recent network, message, channel, and call events. Use the event details when investigating a failed connection or transfer. Privacy settings can hide names and addresses until you reveal an event.

The **Announce** button broadcasts your presence over the configured network. Offline Inbox configuration is under **Settings → Offline Inbox**.

## Transport Mode

**Settings → Network → Transport Mode** controls whether this Ratspeak device relays Reticulum traffic for other peers. It controls forwarding, announce rebroadcasting, and path replies for other nodes. Your identity and Offline Inbox mode are separate settings.

The modes are:

- **OFF** — default. Ratspeak behaves as a normal client. It can send, receive, announce itself, and use routes learned from the mesh, but it does not intentionally relay traffic for other peers.
- **ON** — Ratspeak enables Reticulum transport forwarding whenever the local runtime is allowed to do so. Shared-instance clients leave this work to the shared instance they are attached to.
- **AUTO** — Ratspeak enables Transport Mode only when the current setup looks suitable: the network is Wi-Fi, Ethernet, or an unknown desktop network type; at least one enabled non-LoRa interface exists, such as Local Network, TCP, or Backbone; no enabled LoRa/RNode interface is configured; and no more than one recognized public TCP server is enabled. On Android and iOS, `unknown`, cellular, and no-network states keep AUTO disabled.

AUTO is intentionally conservative. It is meant to avoid turning phones, cellular links, and LoRa radios into accidental relays while still allowing a desktop or fixed machine with a non-LoRa interface to help the mesh. Ratspeak re-evaluates AUTO whenever the app learns about a network-type change or an interface is added, removed, or updated, so changing your Local Network, TCP, Backbone, or LoRa setup does not require a restart. If you are deliberately running infrastructure, use **ON** and make sure the device is stable, powered, and connected through interfaces that can handle the extra traffic.

## Adding an interface

In **Network → Connections**, use the **+** button beside the connection type:

- **Internet/TCP** connects to a Reticulum server using its host and port. This can join a wider network over the internet or a private IP network.
- **Local Network** enables AutoInterface discovery on compatible local networks. It needs IPv6 multicast to work; being on the same Wi-Fi network is not enough if the access point isolates clients or blocks multicast.
- **Radio** connects an RNode over supported USB/serial, Bluetooth, or TCP connections. Choose the connection your radio exposes and check its radio settings.
- **Bluetooth Peer** connects compatible nearby devices directly, without an RNode. Availability and permissions depend on the platform.
- **Host** contains server interfaces for devices you want other nodes to connect to.

For interface settings and platform limits, see [Interfaces overview](../networking/interfaces-overview-and-design.md) and [Bluetooth interfaces](../networking/bluetooth-interfaces.md). A fresh installation needs a connection configured before it can discover remote peers.

### Using another local Reticulum instance

If another app already manages Reticulum on this device, the advanced **Network Ownership** controls can connect Ratspeak to that instance. Enable **Settings → System → Developer Mode** to expose these controls under **Settings → Network**.

Select **Use existing local instance**, enter the endpoint and control key supplied by its owner, or load its access configuration. Use **Test connection**, then **Apply changes**. Applying the choice interrupts current calls and transfers. The other instance manages interfaces and transport; Ratspeak retains its saved local interface settings.

To return to Ratspeak's own network, select **Managed by Ratspeak** and apply the change. **Share with local apps** lets trusted apps on the same device use that managed instance. Treat an exported access configuration as an administrative secret: it includes the control key. Do not paste it into a public support request.

## Offline Inbox

Offline Inbox is Ratspeak's user-facing name for LXMF propagation nodes. A propagation node is an encrypted store-and-forward inbox: it can hold messages for offline recipients and hand them over when the recipient comes back online. The node stores sealed LXMF blobs; it does not get plaintext access to the message contents.

In **Settings → Offline Inbox**, choose one of three modes:

- **Off** — stops active Offline Inbox client checks, blocks new inbox syncs, and prevents new automatic Offline Inbox sends. Messages already accepted by a remote inbox node remain there for the recipient, but switching Off does not keep a local sync running just to drain it.
- **Auto** — Ratspeak chooses a reachable inbox node. If **Favor Ratspeak inbox nodes** is enabled, bundled Ratspeak inbox nodes win only after Ratspeak has current path evidence for them. If none are reachable, Auto can fall back to another reachable propagation node discovered from the mesh.
- **Manual** — you pin a specific 32-character propagation-node destination hash. Ratspeak will use that node when it has a live path to it, and will ask the mesh for a path if it is missing.

In Manual mode, choose a discovered node or enter its address. A node in the bundled list is not necessarily reachable. Auto waits for usable path and propagation-node information before treating it as ready.

Use **Check Now** to ask for waiting messages. If the app reports deferred or paused downloads, read the accompanying reason. **Retry waiting messages** retries messages that could not previously be accepted; it does not make an unreachable node reachable.

You don't need Offline Inbox to message a peer who's online right now; their device receives directly. Offline Inbox only matters for store-and-forward — leaving a message for someone whose radio is off, or picking up messages that arrived while yours was off.

The **Hosted Offline Inbox** option is separate from using someone else's inbox. It is unavailable for hardware-key identities. Turning it on makes this device serve as a propagation node for other people's offline messages. The hosting status must be ready before the node can serve requests. Turning hosting off stops serving it; do not treat the toggle as a way to erase stored messages. Use it deliberately: desktop and always-on devices are better hosts than phones, because mobile operating systems may stop background service.

If you run your own LXMF propagation node on a server or always-on device, set its published hash manually or let Auto discover it. Ratspeak will use it for store-and-forward delivery when it is reachable.

## Live stats

Network counters and activity update while Ratspeak is running. A connection can be up without having a usable path to a particular recipient. If a message fails, check the connection state, the peer's routing details, and the message's delivery state together. Mobile background restrictions can interrupt network work even when the last visible counters looked healthy.

## Announcing yourself

An **announce** advertises your destination and public identity information so other nodes can learn a path back to you. You announce manually any time, and you can also have Ratspeak announce on a schedule.

In **Settings → Network → Auto-Announce**, choose how often: **Off**, **15 minutes**, **30 minutes**, **1 hour**, or a **custom** interval between 1 and 48 hours. A fresh install defaults to **30 minutes**; turn it off if you'd rather only announce manually. Manual announces are always available regardless of the setting, from the announce button in the Network view or by long-pressing the bottom bar.

More frequent announces make you easier to find but spend more airtime; on a busy LoRa channel that matters. Choose an interval appropriate for your network's capacity. After changing networks, a manual announce can help peers learn your new route.
