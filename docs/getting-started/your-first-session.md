---
sidebar_position: 3
---

# Your first session

Create an identity, connect to the network, and send a message to another Reticulum/LXMF user. You need [Ratspeak installed](install-and-platform-setup.md) and at least one reachable peer to finish the message step. A second device or a friend using an LXMF client gives you someone to test with.

## Launch the app

Open Ratspeak from your applications menu or home screen. The app includes its networking runtime; there is no separate daemon to start.

For a new identity, select **Create Identity**. If you are returning with an existing identity, use **Import or Restore Identity** instead. Desktop users can also choose **Hardware Key**; see [Ratkey](../products/ratkey.md) for the requirements.

## Create your identity

1. Select **Create Identity** and wait for the **Backup Phrase** screen.
2. Select **Tap to reveal phrase**. Write the 12 words down in order and keep them somewhere private.
3. Check **I have written down my 12-word phrase and stored it safely**, then select **Continue**.
4. Copy the LXMF address shown under **Your Identity**. This is the address you share with someone who wants to message you.
5. Optionally enter a **Display Name**, then select **Connect**.

Anyone with your recovery phrase can restore and use your identity. The address is safe to share; the phrase is not. A display name is public and is not unique, so confirm someone's address rather than relying on their name alone.

The recovery phrase restores the identity, not your message history. You can protect a software identity and its stored phrase with **Set PIN** in the identity menu under **Settings → Identity**. See [Settings and identity](../using-ratspeak/settings-and-identity.md) for backup, restore and protection options.

## Add your first interface

A fresh install has no interfaces enabled. Open **Network** and choose a connection that matches your setup:

| Connection | What to do | What it needs |
|---|---|---|
| Local Network | Select **+** next to **Local Network**, then **Enable**. | Another Reticulum device on the same LAN or Wi-Fi, with multicast allowed. |
| Internet/TCP | Select **+** next to **Internet/TCP**. Choose a server under **Public**, or enter a host and port under **Custom**. | A route to that server, usually through the internet. |
| Bluetooth Peer | Select **+** next to **Bluetooth Peer** and follow the permission prompts. | A nearby compatible peer and supported Bluetooth roles on each platform. |
| LoRa radio | Open **Add LoRa Device**, choose the applicable Bluetooth, USB or TCP connection, configure the radio and select **Add Radio**. | Compatible RNode hardware and matching radio settings. |

For a first test over the internet, use a server in the **Public** list. **Official** identifies servers managed by Ratspeak; third-party entries are marked **Unofficial**. Reachability depends on the server and the paths available through it.

For two devices on the same LAN, enable **Local Network** on both. Guest Wi-Fi and some managed networks block the multicast discovery it uses. If discovery fails there, try a permitted TCP connection or another network.

For LoRa, match the frequency and radio preset used by the peers you want to reach, and use the appropriate regional settings. A handheld acting as an RNode must be booted into RNode mode. Follow [LoRa and RNode](../networking/lora-and-rnode.md) for the full radio procedure. [Bluetooth interfaces](../networking/bluetooth-interfaces.md) lists platform-specific requirements.

You can enable more than one interface. Check **Network** for each connection's current status before continuing.

## See your first announce

Open **Peers**. Reticulum announces advertise destinations and may include an LXMF display name. A peer appears when an announce reaches your device; an established connection alone does not guarantee any peers will appear.

For a two-device test, use **Announce** in the other device's **Network** view if it runs Ratspeak. In another LXMF client, use that client's announce control. Wait for the announce to travel over your chosen connection. Radio links can take longer than local-network links.

Peer details include the destination address and hop count. Hop count describes the network path, not physical distance. If the list stays empty, check both devices' interface status and radio settings or use [Network and peers](../using-ratspeak/network-and-peers.md) to diagnose discovery. You can also start with a known LXMF address; see [Messaging and contacts](../using-ratspeak/messaging-and-contacts.md).

## Send your first message

1. Select your test peer in **Peers**.
2. Select **Message** to open the conversation.
3. Enter a short message and send it.
4. Check its delivery status and ask your test peer to reply.

**Delivered** confirms receipt by the destination. Sending or transmission alone does not. A message stored in an **Offline Inbox** has been accepted by a propagation node for later pickup; that is not confirmation that the recipient has received it. See the [delivery states](../using-ratspeak/messaging-and-contacts.md) for retries, failures and offline delivery.

If delivery fails, keep the failed message and check the connection and destination before retrying. Creating another identity is not a network troubleshooting step.

## Save them as a contact

Open the peer's details and select **Add**. Enter an optional contact name and confirm. The contact remains in **Contacts** when its announce is no longer visible in **Peers**; saving it does not make an offline peer reachable.

## What's next

- [Messaging and contacts](../using-ratspeak/messaging-and-contacts.md) covers attachments, delivery modes and the address book.
- [Network and peers](../using-ratspeak/network-and-peers.md) explains interfaces, discovery and transport settings.
- [Settings and identity](../using-ratspeak/settings-and-identity.md) covers identity protection, backups and app preferences.
