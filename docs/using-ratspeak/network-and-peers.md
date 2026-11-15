---
sidebar_position: 2
---

# Network and peers

Use **Peers** to find known people and inspect the last route to them. Use **Network** to see this device's connections and turn them on or off. A peer's last-heard time is a clue about activity, not a promise that a message will arrive now.

## The Peers view

The Peers list contains peers Ratspeak has learned about, including saved contacts. Rows show the display name or address, identicon, a dot for whether they've been heard recently, and any profile status.

Peers are grouped as follows:

- **Contacts** — saved contacts, shown first.
- **Active** — peers with a name, heard in the last two hours.
- **Active, unnamed** — active peers without a name.
- **Seen recently** — less recent activity.
- **Older / unknown** — older records or peers with no recent activity information. The group shows its 300 most recent peers; search reaches the rest.

Tap a group header to collapse or expand it. **Active, unnamed** and **Older / unknown** start collapsed. Search by name, address, or profile status. The sort menu offers **Name**, **Last heard**, and **Hops**.

Peers you haven't heard from in a day are cleared, so the list stays small on busy networks. Contacts and anyone you've messaged or played a game with always stay. **Settings → Privacy and blocking → Hide known spam peers** also hides bridge-style IDs you haven't saved or messaged.

Select a peer to open their details. **Reachability** shows the known route (**Direct**, or **Relayed** with its hop count), the first relay on that path, the connection they were last heard on, and the last packet's signal for a direct radio peer. **History** shows when they were first heard and when the path last changed. These values may be missing or stale. **Identity** shows their LXMF address and identity hash. Use **Message** to start a conversation, or **Add to contacts** to save the peer. On a phone, these facts are folded under **Details**.

**Block** hides the peer and their messages in Ratspeak. The block dialog can also block at the network layer, dropping packets for the corresponding identity across all accounts on this device. If Ratspeak has not yet learned that network identity, filtering begins after its next announce. Do not confuse this with removing the peer from everyone else's network. **Settings → Privacy and blocking → Blocked people** lists your blocks; **Unblock** can also remove the network block.

## The Network view

**Network** shows a map of this device and its connections, with sent and received totals. Under the map are its traffic, **Active peers**, **Routes**, and **Last announce**. The arrow beside the map hides or shows it.

The **Connectivity** panel beside the map, or below it on a phone, has one card for each way to connect, each with its own switch:

- **Internet** connects to Reticulum servers.
- **Bluetooth Peer** connects nearby devices directly, without a radio.
- **Local Network** finds devices on the same Wi-Fi or wired network.
- **Radio** connects LoRa radios.
- **Host** lets other devices connect to this computer. It shows on desktop, and on a phone only once a host is set up.
- **Find more → Discover servers** lists the servers and radios that others share. See [Discovered servers and radios](#discovered-servers-and-radios).

Each connection has a row with its status. Select it for its details: traffic, its address or radio settings, and actions such as **Pause**, **Resume**, **Edit**, and **Disconnect**. **Open in Activity** shows its events. A card that is on folds shut with its own arrow. Turning a card's switch off turns off every connection of that kind.

**Pause all** stops every connection at once, and **Resume all** brings back the same ones. While they are paused, a notice shows how many.

**Activity** opens the [Activity](#activity) tab. **Announce** broadcasts your presence over the connections that are up, so it needs at least one. Offline Inbox configuration is under **Settings → Offline Inbox**.

## Activity

The **Activity** tab shows what Ratspeak is doing: network, messages, channels, and calls. It is kept on this device only. Activity is on by default. **Pause** stops recording until you choose **Resume**, and **Turn off Activity** in its **More** menu turns it off until you choose **Start Activity**. Filter by area, search, or choose **High** detail for more events for 10 minutes. Select an event for its details.

Use the event details when investigating a failed connection or transfer. **Settings → Privacy and blocking → Protect Activity identities** hides names and addresses until you reveal them.

When the network filter drops peers on its own, Activity shows how many, with **Review**. The list there offers **Clear network drops**, which lets them reach you again. Blocks you made aren't affected.

## Relay for other devices {#transport-mode}

**Settings → Network → Relay for other devices** is Reticulum's Transport Mode. It controls whether this Ratspeak device relays Reticulum traffic for other peers: forwarding, announce rebroadcasting, and path replies for other nodes. Your identity and Offline Inbox mode are separate settings.

The choices are:

- **Off** — default. Ratspeak behaves as a normal client. It can send, receive, announce itself, and use routes learned from the mesh, but it does not intentionally relay traffic for other peers.
- **On** — Ratspeak enables Reticulum transport forwarding whenever the local runtime is allowed to do so. Shared-instance clients leave this work to the shared instance they are attached to.
- **Automatic** — Ratspeak relays only when the current setup looks suitable: the network is Wi-Fi, Ethernet, or an unknown desktop network type; at least one enabled non-LoRa interface exists, such as Local Network, an internet server, or Backbone; no enabled LoRa/RNode interface is configured; and no more than one recognized public server is enabled. On Android and iOS, `unknown`, cellular, and no-network states keep Automatic from relaying.

Automatic is intentionally conservative. It is meant to avoid turning phones, cellular links, and LoRa radios into accidental relays while still allowing a desktop or fixed machine with a non-LoRa interface to help the mesh. Ratspeak re-evaluates it whenever the app learns about a network-type change or an interface is added, removed, or updated, so changing your connections does not require a restart. If you are deliberately running infrastructure, use **On** and make sure the device is stable, powered, and connected through interfaces that can handle the extra traffic.

While relaying is on, Ratspeak connects to only one public server; a public server saved as a Backbone connection counts too.

## Adding a connection {#adding-an-interface}

In **Network → Connectivity**, turn on the card for the connection type:

- **Internet** lists the Ratspeak servers **Ruby**, **Emerald**, and **Diamond**, with community servers under **Unofficial**. Choose **Join** beside one. **Add your own server** connects to an address and port someone gave you, with an optional network name and passphrase. Once you have a server, **Join another server** shows the list again, and the Internet switch turns all of them off or on.
- **Local Network** opens its settings; choose **Turn on**. It enables AutoInterface discovery on compatible local networks and needs IPv6 multicast to work; being on the same Wi-Fi network is not enough if the access point isolates clients or blocks multicast. **Options** changes its settings later, and **Turn off** stops it.
- **Radio** opens **Set up a radio** for an RNode over **Bluetooth**, **USB**, or **Wi-Fi**. Choose the connection your radio exposes and check its radio settings.
- **Bluetooth Peer** connects compatible nearby devices directly, without an RNode. It stays on for 30 minutes; **Stay on for** changes that to **10 min**, **30 min**, **1 hour**, or **Always**. Availability and permissions depend on the platform.
- **Host** opens **Host a server**, for devices you want other nodes to connect to.

For interface settings and platform limits, see [Interfaces overview](../networking/interfaces-overview-and-design.md) and [Bluetooth interfaces](../networking/bluetooth-interfaces.md). A fresh installation needs a connection before it can discover remote peers.

### Using another local Reticulum instance

If another app already manages Reticulum on this device, Ratspeak can connect to that instance. Turn on **Settings → Developer → Developer mode** to show **Reticulum on this device** in the same section.

Under **Run by**, choose **Another app**. Enter the connection details supplied by its owner (TCP ports or a Unix socket, instance name, and **RPC key (hex)**), or paste its **Access configuration (JSON)** and choose **Load configuration**. Use **Test connection**, then **Apply changes**. Applying the choice interrupts current calls and transfers. The other instance manages interfaces and transport; Ratspeak retains its saved local interface settings.

To return to Ratspeak's own network, choose **Ratspeak** under **Run by** and apply the change. **Share with local apps** lets trusted apps on the same device use that instance, and **Copy access…** copies its access configuration. Treat that configuration as an administrative secret: it includes the control key. Do not paste it into a public support request.

## Discovered servers and radios

Servers and radios can publish themselves on the network. Turn on **Discover servers** under **Find more** in Network, or in **Settings → Network → Discovery**, to list them. The change restarts the network for a moment.

The card shows how many were found; **See all** opens the list, with **All**, **Servers**, and **Radios** filters. Entries not heard for over three days move under **Show … not heard lately**. Select one for its details: its address or radio settings, distance in hops, when it was heard, and who published it.

- **Join** connects to a server. Its operator can see your IP address once you join.
- **Use these radio settings** opens radio setup with a radio's frequency, bandwidth, spreading factor, and coding rate filled in. It needs a radio that shares all four.
- **Trust this publisher** adds its publisher to **Trusted publishers**.

Under **Settings → Network → Discovery**:

- **Join automatically** keeps **1 server**, **3 servers**, or **5 servers** from the list connected, or is **Off**. Those servers see your IP address. A connection it made shows **Join automatically** under **Added by** in its details; **Keep** saves it as an ordinary connection.
- **Auto-connect to unknown implementations** lets Join automatically also join servers running other software. It's off by default, so only servers running Python Reticulum 1.5.7 or later or rsReticulum 1.5.0 or later are joined.
- **Accept from** lists servers from **Anyone** or only from **Trusted publishers**. **Trusted publishers** holds the publisher addresses you trust; only their servers are listed and joined. Your own private network always counts as trusted.

## Private networks

A private network lets a group find each other's hosts in discovery without anyone else seeing them, and fills in their network name and passphrase on joining.

Set one up in **Settings → Network → Private network**. **Create** makes a new one, and **Import** takes your group's from a file or a QR code. Once it is set up, the section shows its **Network ID**. **Share** shows a QR code for it and saves it as a file or image. Anyone with it can find your private connections and their passphrases, so share it only with your group. **Remove private network** stops your private hosts showing in discovery, and you won't see your group's private connections; connections you've joined keep working. Each change restarts the network for a moment.

A host's **Discovery** settings, in **Host a server** or in a running host's details, decide who can find it:

- **Show in discovery** lets people with Discover servers on find it. Enter the **Address others use**: the address or IP that Discover servers lists.
- **Share access in discovery** includes the network name and passphrase, so people join without typing them. Set a network name and passphrase on the host first.
- **Private network** limits it to people with your private network. If you don't have one yet, the switch offers **Create** and **Import**.

With **Share access in discovery** on and **Private network** off, anyone who finds the host can read the passphrase. Hosts from your private network show a **Private** tag in the discovered list; joining one fills in its network name and passphrase.

## Offline Inbox

Offline Inbox is Ratspeak's user-facing name for LXMF propagation nodes. A propagation node is an encrypted store-and-forward inbox: it can hold messages for offline recipients and hand them over when the recipient comes back online. The node stores sealed LXMF blobs; it does not get plaintext access to the message contents.

In **Settings → Offline Inbox**, set **Use an Offline Inbox** to one of three modes:

- **Off** — stops active Offline Inbox client checks, blocks new inbox syncs, and prevents new automatic Offline Inbox sends. Messages already accepted by a remote inbox node remain there for the recipient, but switching Off does not keep a local sync running just to drain it.
- **Automatic** — Ratspeak chooses a reachable inbox node. If **Prefer Ratspeak inboxes** is on, bundled Ratspeak inbox nodes win only after Ratspeak has current path evidence for them. If none are reachable, Automatic can fall back to another reachable propagation node discovered from the mesh.
- **Manual** — you pin a specific 32-character propagation-node destination hash. Ratspeak will use that node when it has a live path to it, and will ask the mesh for a path if it is missing.

In Manual mode, choose **Use** beside an inbox under **Inboxes nearby**, or paste its address under **Inbox address** and choose **Use**. **Stop using this inbox** clears the choice. A node in the bundled list is not necessarily reachable. Automatic waits for usable path and propagation-node information before treating it as ready.

The inbox in use shows its status, with a **Check now** button to ask for waiting messages. If the app reports deferred or paused downloads, read the accompanying reason. **Retry waiting messages** retries messages that could not previously be accepted; it does not make an unreachable node reachable.

You don't need Offline Inbox to message a peer who's online right now; their device receives directly. Offline Inbox only matters for store-and-forward — leaving a message for someone whose radio is off, or picking up messages that arrived while yours was off.

**Host an inbox → Host an Offline Inbox** is separate from using someone else's inbox. It is unavailable for hardware-key identities. Turning it on makes this device serve as a propagation node for other people's offline messages. The hosting status must be ready before the node can serve requests. Turning hosting off stops serving it; do not treat the switch as a way to erase stored messages. Use it deliberately: desktop and always-on devices are better hosts than phones, because mobile operating systems may stop background service.

If you run your own LXMF propagation node on a server or always-on device, set its published hash manually or let Automatic discover it. Ratspeak will use it for store-and-forward delivery when it is reachable.

## Live stats

Network counters and activity update while Ratspeak is running. A connection can be up without having a usable path to a particular recipient. If a message fails, check the connection state, the peer's routing details, and the message's delivery state together. Mobile background restrictions can interrupt network work even when the last visible counters looked healthy.

## Announcing yourself

An **announce** advertises your destination and public identity information so other nodes can learn a path back to you. You announce manually any time, and you can also have Ratspeak announce on a schedule.

In **Settings → Network → Auto-announce**, choose how often: **Never**, **15 minutes**, **30 minutes**, **1 hour**, or **Custom…**, between 1 and 48 hours. A fresh install defaults to **30 minutes**; choose **Never** if you'd rather only announce manually. Manual announces are always available regardless of the setting: **Announce** in the Network view or on the desktop Home, or a long press on the phone's tab bar.

More frequent announces make you easier to find but spend more airtime; on a busy LoRa channel that matters. Choose an interval appropriate for your network's capacity. After changing networks, a manual announce can help peers learn your new route.
