---
sidebar_position: 3
---

# Your first session

Create an identity, connect to the network, and send a message to another Reticulum/LXMF user. You need [Ratspeak installed](install-and-platform-setup.md) and at least one reachable peer to finish the message step. A second device or a friend using an LXMF client gives you someone to test with.

## Launch the app

Open Ratspeak from your applications menu or home screen. The app includes its networking runtime; there is no separate daemon to start.

For a new identity, select **Create identity**. If you are returning with an existing identity, use **Restore an identity** instead. Desktop users can also choose **Use a hardware key**; see [Ratkey](../products/ratkey.md) for the requirements.

## Create your identity

1. Select **Create identity** and wait for **Save your recovery phrase**.
2. Select **Show phrase**. Write the 12 words down in order and keep them somewhere private.
3. Check **I wrote down all 12 words.**, then select **Continue**.
4. Copy the **LXMF address** shown under **Your identity**. This is the address you share with someone who wants to message you.
5. Optionally enter a **Display name**, then select **Start Ratspeak**.

If you leave the display name empty, Ratspeak names the identity with a verb and an animal, like Leaping Frog, picked from its address. You can rename it later on the **Identity** page.

Anyone with your recovery phrase can restore and use your identity. The address is safe to share; the phrase is not. A display name is public and is not unique, so confirm someone's address rather than relying on their name alone.

The recovery phrase restores the identity, not your message history. You can protect a software identity and its stored phrase with **Set PIN** on the **Identity** page. See [Settings and identity](../using-ratspeak/settings-and-identity.md) for backup, restore and protection options.

## Add your first interface

A fresh install has no interfaces enabled. Open **Network**. Its **Connectivity** panel has one card for each way to connect, each with its own switch. Turn on the one that matches your setup:

| Connection | What to do | What it needs |
|---|---|---|
| Internet | Turn on **Internet**, then choose **Join** beside a server. For a server someone gave you, choose **Add your own server** and enter its address and port. | A route to that server, usually through the internet. |
| Local Network | Turn on **Local Network**, then choose **Turn on**. | Another Reticulum device on the same LAN or Wi-Fi, with multicast allowed. |
| Bluetooth Peer | Turn on **Bluetooth Peer** and follow the permission prompts. It stays on for 30 minutes unless you change **Stay on for**. | A nearby compatible peer and supported Bluetooth roles on each platform. |
| Radio | Turn on **Radio**. In **Set up a radio**, choose **Bluetooth**, **USB** or **Wi-Fi**, select the radio and choose **Next**. Set the radio, then choose **Connect radio**. | Compatible RNode hardware and matching radio settings. |

For a first test over the internet, join one of the Ratspeak servers: **Ruby**, **Emerald** or **Diamond**. Community servers are listed under **Unofficial**. Reachability depends on the server and the paths available through it.

For two devices on the same LAN, turn on **Local Network** on both. Guest Wi-Fi and some managed networks block the multicast discovery it uses. If discovery fails there, try a permitted internet server or another network.

For LoRa, match the frequency and radio preset used by the peers you want to reach, and use the appropriate regional settings. A handheld acting as an RNode must be booted into RNode mode. Follow [LoRa and RNode](../networking/lora-and-rnode.md) for the full radio procedure. [Bluetooth interfaces](../networking/bluetooth-interfaces.md) lists platform-specific requirements.

You can turn on more than one. Each connection's row in **Connectivity** shows whether it is connected; check it before continuing.

## See your first announce

Open **Peers**. Reticulum announces advertise destinations and may include an LXMF display name. A peer appears when an announce reaches your device; an established connection alone does not guarantee any peers will appear.

For a two-device test, use **Announce** in the other device's **Network** view if it runs Ratspeak. In another LXMF client, use that client's announce control. Wait for the announce to travel over your chosen connection. Radio links can take longer than local-network links.

Peer details show the LXMF address and the route: **Direct**, or **Relayed** with its hop count. Hop count describes the network path, not physical distance. If the list stays empty, check both devices' interface status and radio settings or use [Network and peers](../using-ratspeak/network-and-peers.md) to diagnose discovery. You can also start with a known LXMF address; see [Messaging and contacts](../using-ratspeak/messaging-and-contacts.md).

## Send your first message

1. Select your test peer in **Peers**.
2. Select **Message** to open the conversation.
3. Enter a short message and send it.
4. Check its delivery status and ask your test peer to reply.

**Delivered** confirms receipt by the destination. Sending or transmission alone does not. A message **In the Offline Inbox** has been accepted by a propagation node for later pickup; that is not confirmation that the recipient has received it. A message that can't go yet waits and Ratspeak keeps trying for up to 24 hours. See the [delivery states](../using-ratspeak/messaging-and-contacts.md#delivery-states) for retries, failures and offline delivery.

If delivery fails, keep the failed message and check the connection and destination before retrying. Creating another identity is not a network troubleshooting step.

## Save them as a contact

Open the peer's details and select **Add to contacts**. Enter an optional name and select **Add contact**. The contact remains in **Contacts** when its announce is no longer visible in **Peers**; saving it does not make an offline peer reachable.

## What's next

- [Messaging and contacts](../using-ratspeak/messaging-and-contacts.md) covers attachments, delivery modes and the address book.
- [Network and peers](../using-ratspeak/network-and-peers.md) explains interfaces, discovery and transport settings.
- [Settings and identity](../using-ratspeak/settings-and-identity.md) covers identity protection, backups and app preferences.
