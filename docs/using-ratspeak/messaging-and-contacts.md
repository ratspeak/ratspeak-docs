---
sidebar_position: 1
---

# Messaging and contacts

Use **Messages** for private LXMF conversations and **Channels** for shared conversations through a hub. This page covers sending messages, delivery status, contacts, voice messages, and calls.

## Sending a message

Open the Messages tab. If you have an existing conversation, tap it to open it and start typing in the composer at the bottom. To start a new conversation, choose **New message**, then pick a saved contact or paste an LXMF address (the long hex hash that uniquely identifies a destination on the network) into **Name or LXMF address**.

A faster path: open the Peers tab. It lists peers this device has learned about. Tap a peer to open their detail panel — from there you can start a conversation immediately, or save them as a contact for later.

Press send, then check the delivery mark. A message can be waiting to send, stored for later pickup, or delivered; these states mean different things.

## Conversations

The conversation list shows your visible conversations, most-recent first. Each row shows the contact name (or address, if they're not saved), a one-line preview of the last message, the time, and any unread count. Delivery marks show only inside a conversation.

Inside a conversation, your messages appear on the right and theirs on the left. Messages can include bold, lists, code, links, and spoilers; see [Formatting messages](formatting-messages.md). Scroll up to read older messages. Press and hold, right-click, or use the menu key on any message to open its menu: react, **Reply**, **Copy**, or **Select**.

To delete messages, choose **Select** from a message's menu, tap any others you want, then choose **Delete**. This removes them from this device only; the other person keeps their copy. Messages still sending can't be selected.

You can hide a conversation you're done with: choose **Delete conversation** from its **Conversation options** menu, then **Remove from List**. It disappears from the list but the messages aren't deleted. Sending or receiving a message in that conversation brings it back to the top of the list. **Delete All Messages** removes them from this device instead.

### More than one conversation

**New conversation** in **Conversation options** starts another conversation with the same person, under a name only you see. Each one is a chip under the conversation's header; **Main** is the conversation every client shares. Select a chip to switch to it, or the selected chip again to rename or delete it. When the other person starts one, Ratspeak says so and offers **Rename it**. A person with only Main shows no chips.

## Attachments

Use **Attach** in the composer to add a file: **File or image** on desktop, or **Camera**, **Video**, **Photos**, or **File** on Android. On iPhone and iPad it opens the system picker. Ratspeak checks the attachment size before sending. If a file is too large, the app shows the file size and asks you to pick something smaller. Large attachments may take a long time, and Offline Inbox delivery can be limited by the propagation node you use, so keep files small when the path might include LoRa or another slow link.

The recipient can impose a smaller incoming-message limit; Ratspeak defaults to **1 MB** for incoming messages and attachments. A file passing your sending check does not guarantee the recipient can accept it.

For supported photos, the **Photo size** dialog offers smaller versions before sending. Smaller images travel faster over slow links. Ratspeak shows received images inline; other attachments appear with their filename and size.

## Delivery states

Every outgoing message gets a small mark that tells you what happened to it.

- **Sending** — a clock: Ratspeak is preparing, routing, or transmitting the message.
- **Sent** — one check: the message left your node, but no delivery proof has come back yet.
- **Delivered** — two checks: Ratspeak received an authenticated delivery proof from the recipient's destination.
- **In the Offline Inbox** — an envelope: the message was accepted by an LXMF propagation node for later pickup. This proves the inbox node received the encrypted message; it is not the same as end-to-end recipient delivery.
- **Waiting to send** — an hourglass: the message can't go now, and Ratspeak keeps trying for up to 24 hours. Tap it for **Try now** or **Stop trying**.
- **Sending cancelled** — a cross: you stopped the remaining local delivery work. This does not recall data already transmitted.
- **Rejected** — the recipient rejected the message.
- **Not delivered** — an exclamation mark: delivery did not succeed. The destination may be unreachable, or the transfer may have failed. Tap it for **Retry…**, which lets you choose how to send it again, or **Show in Activity**.

**Keep trying to send** (in **Settings → General**) is on by default. A message that can't be sent for a network reason waits instead of failing. It goes when the recipient is heard, when your network or Offline Inbox is back, or when you choose **Try now**. Messages to one person that had to wait arrive in the order you sent them. With the setting off, such a message is **Not delivered** instead.

Ratspeak sends in Automatic mode by default. Automatic tries live delivery first, even if the recipient has not announced recently: a quiet device can still be online and listening. The app chooses the live delivery method using its current link and recipient-key information. Attachments and game actions start with Direct delivery; ordinary text can use Opportunistic delivery when suitable recipient-key information is available. If that live method reaches a terminal failure and Offline Inbox is enabled with a reachable node, Automatic retries once by storing the encrypted message there. It never claims a message was stored when no inbox node took it.

To choose for one message, hold **Send**: **Opportunistic**, **Direct**, **Offline Inbox**, or **Paper**. A tap always sends with Automatic.

The underlying LXMF delivery modes are:

- **Direct** uses an encrypted live link to the recipient, with Link packet or Resource confirmation. Best when both sides are online or the message is too large for one packet.
- **Opportunistic** sends the message as a single packet without setting up a link. It's lightweight and works well over slow radios, has a small single-packet size limit (message fields and stamps also take space), and can return an authenticated Reticulum packet proof. If no proof returns, Ratspeak cannot distinguish non-delivery from a lost proof.
- **Offline Inbox** is Ratspeak's name for LXMF propagated delivery. It hands the encrypted message to a propagation node, which holds it until the recipient asks for waiting mail.

Most users do not have to choose a mode by hand. The mark reports the observable delivery result rather than the transport method.

While a message is still in flight, **Cancel** stops Ratspeak's remaining local
delivery work for that message. Mesh delivery is asynchronous: a packet or
Resource part that was already handed to an interface cannot be recalled, so a
cancelled message can still arrive at the recipient. The sender will continue
to show it as cancelled because it is no longer waiting for or acting on the
delivery result.

## Searching your messages

The search box at the top of the Messages tab searches the message history stored for your active identity on this device. Type a word or phrase to see matches grouped by conversation. Tap a result to jump straight to that message in its thread, with the matched text briefly highlighted.

Search is local — it runs against the database on your own device. Nothing is sent to a server, and there's no network round-trip.

## Contacts

The Contacts tab is your address book. Each contact has a name (or nickname) you choose, the LXMF address itself, and an avatar. Select a contact to open their details, beside the list on desktop: **Message**, **Call** where calls are available, **Rename** (the pencil beside the name), and **Remove from contacts**.

There are three ways to add a contact:

- **From the Peers tab** — open any peer's details and choose **Add to contacts**. Their address fills in automatically; just give them a name.
- **From a conversation** — open a conversation with someone unsaved and choose **Add contact** from **Conversation options**.
- **Manually** — choose **Add contact** (**+**) in the Contacts tab. **By address** takes an address they shared with you. **From QR code** scans their contact card, reads it from an image, or uses **Paste** for a copied QR image or contact link.

Names are local to your device. The other side has no idea what you've named them, and they can name you whatever they like on their end.

## Paper messages

A paper message is an encrypted LXMF message carried as a QR code or an `lxm://` link that you hand over yourself, for example on paper or another screen. To send one, type the message, hold **Send**, and choose **Paper**. It can't include attachments. In the sent message's menu, **Show QR code** and **Copy paper link** show it again.

To open one, scan its QR code or open its link. With **Settings → General → Paper messages** on, **New message** also offers **Open a paper message**, where you can paste a link or scan the QR. Ratspeak shows the message first; **Add to chat** puts it in the conversation. A paper message addressed to someone else can't be opened.

## Avatars

Ratspeak generates an identicon from each LXMF address. The same address produces the same pattern in Ratspeak, which can help you recognize a contact.

An identicon is a visual aid, not proof of identity. Different addresses can produce similar patterns, and display names can be copied. Before sharing sensitive information with a new contact, compare the **full LXMF address** through a channel you already trust. Do the same if someone says they have changed addresses.

## Channels

Channels are shared text conversations hosted by a hub. **The hub can read and relay channel messages.** The private-message encryption described above does not protect messages from the hub operator or other channel participants. A private channel's access key restricts joining; it does not make the conversation end-to-end encrypted.

### Connect and join

1. Open **Channels**. It needs a network connection first; then hubs show under **Hubs nearby** as they announce, which can take a while. Choose one, a saved hub, or **Add a hub by address** to enter the hub's 32-character address.
2. Read the **Public channels** notice. On first use, the app requires acknowledgement of its age requirement and community terms before continuing.
3. In **Review hub**, check the hub and your nickname, then choose **Connect**. Use a hub whose operator you trust. A familiar name alone does not verify its address.
4. Choose **Join** beside one of the hub's public channels, or **Join a channel by name** for a channel name supplied by the operator. Under **Private channel?**, enter an **Access key** if required. **Remember for reconnect** saves the key after membership is confirmed; clear it to use the key only for this session.
5. Wait until the channel says **Live**, then type a message and send it. On desktop, Enter sends and Shift+Enter adds a line break.

A hub can require an invitation, access key, or other admission rules. Private or secret channels may be absent from its public list. If joining fails, read the error and ask the operator for the correct channel name and access details.

Only one hub is live at a time. Switching hubs ends your current live channel sessions. Your local history stays on this device.

### Messages, people, and moderation

The composer is available while you are connected and have joined the channel. It shows a byte counter near the hub's message-size limit; some characters use more than one byte. While the hub link recovers, the channel says it is reconnecting: you can keep reading, and sending resumes when the link is back. A disabled composer means the session is not ready to send. Wait for **Live** before trying again.

Channels are live conversations, not LXMF Offline Inboxes. Local history contains messages this device received; reconnecting does not fetch a backlog of everything you missed.

Open **People here** to see participants reported by the hub and people seen locally in the last day. The list can be incomplete. Channel permissions and moderation belong to the hub: an operator can restrict who may join or speak. Use a participant's actions to block them, or a message's **Report** action to prepare a report email. Review and send that email yourself; opening the report form does not submit it. Independent hub operators control moderation on their own hubs. Blocking in your app does not remove the person's messages from everyone else's device.

### Leave or reconnect

To end membership in one channel, select its name at the top and choose **Leave channel**. To end all live sessions on that hub, open the hub menu from the hub at the top of the list and choose **Disconnect**. Both retain local history. If the session ends on its own, **Reconnect** rejoins the hub you were on. From a history-only channel, use **Rejoin channel** or **Connect to hub** when you want to return. You may need a new invitation or access key if the operator has changed access.

Hosting is a separate task. See [Infrastructure and operations](../deployment/infrastructure-and-ops.md) for running a channel hub.

## Voice messages

To send a recording instead of a live call:

1. Open a conversation and leave the text composer empty, with no attachment selected. Tap the microphone button.
2. Grant microphone permission if prompted. Record your message; you can pause and resume.
3. Tap **Finish** to review the recording. Play it back, discard it, or send it.

The app chooses the audio format using information announced by the recipient and shows the recording limit. Standard recordings allow up to five minutes; compact recordings allow up to 15 seconds. Keep recordings short on slow radio links.

A voice message uses LXMF delivery, so check its delivery state just as you would for text. Recording is unavailable during a call. Finish or discard your recording before switching conversations or leaving the app: an unsent recording is not a saved draft. If sending fails and the review controls remain, retry there; if the app says the send status is unavailable, check the conversation before recording and sending a duplicate.

## Voice calls (experimental)

Ratspeak's experimental voice calls use [rsLXST](../products/rslxst.md) over a live Reticulum link. Both devices need a working path at the same time. Calls do not use Offline Inbox delivery, and the Reticulum path may pass through transport nodes.

### Placing a call

Open a conversation, contact, or peer and choose **Call**. The control is available in builds with voice support, and another active call prevents starting a second one.

Grant microphone access if prompted. The call strip shows the connection state. **Calling** or **Ringing** does not mean audio is connected; wait for **In call**. If the call fails or times out, check that the other person is reachable and accepts calls from you.

Use **Hang up** to end the call. Before connection, the same action cancels the attempt.

### Receiving a call

Incoming calls appear in the call strip, with an incoming-call sheet on mobile. Choose **Answer** or **Reject**. Answering may request microphone permission; audio starts after the live link is established.

### Who can ring you

Incoming calls are accepted from saved contacts or recognized direct peers. Ratspeak recognizes a direct peer from a recent zero-hop announce or a cached zero-hop path. Other non-contacts are rejected. If you expect a routed call, save the caller as a contact first.

Blocked contacts and identities on the network blackhole list cannot ring you. Repeated rejected calls from a non-contact can also trigger automatic network blocking. These rules are enabled by default.

### Audio details

Use **Mute** to stop sending microphone audio. On supported mobile audio routes, the speaker control switches between the phone's call output and speakerphone. Other input and output selection follows the operating system's audio settings.

Ratspeak selects and adjusts audio quality for the path. On constrained calls, a **Hold to talk** control replaces continuous microphone transmission: hold it while speaking and release it to listen. Each burst is limited to ten seconds. A slow or unstable radio path can still be unsuitable for live conversation; a short voice message may be more useful.

### What is not in voice yet

Calls are one-to-one and require a live connection. There is no group call or Offline Inbox fallback for a missed call. Voice messages are separate recordings you choose to send, not an automatic answering service.
