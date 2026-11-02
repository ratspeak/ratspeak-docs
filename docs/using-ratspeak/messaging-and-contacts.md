---
sidebar_position: 1
---

# Messaging and contacts

Use **Messages** for private LXMF conversations and **Channels** for shared conversations through a hub. This page covers sending messages, delivery status, contacts, voice messages, and calls.

## Sending a message

Open the Messages tab. If you have an existing conversation, tap the thread to open it and start typing in the composer at the bottom. To start a new conversation, tap the new-message button and either pick a saved contact or paste an LXMF address (the long hex hash that uniquely identifies a destination on the network).

A faster path: open the Peers tab. It lists peers this device has learned about. Tap a peer to open their detail panel — from there you can start a conversation immediately, or save them as a contact for later.

Press send, then check the delivery indicator. A message can be waiting for a path, stored for later pickup, or delivered; these states mean different things.

## Conversations

The thread list shows your visible conversations, most-recent first. Each row shows the contact name (or address, if they're not saved), a one-line preview of the last message, the time, and any unread count.

Inside a thread, your messages appear on the right and theirs on the left. Messages can include bold, lists, code, links, and spoilers; see [Formatting messages](formatting-messages.md). Scroll up to read older messages. Tap and hold (or right-click on desktop) any message to react, reply, or copy it.

To delete messages, choose **Select** from a message's menu, tap any others you want, then choose **Delete**. This removes them from this device only; the other person keeps their copy. Messages still sending can't be selected.

You can hide a thread you're done with — it disappears from the list but the messages aren't deleted. If you want it back, sending or receiving a message in that conversation brings it back to the top of the list.

## Attachments

Use the paperclip icon in the composer to attach a file. Ratspeak checks the attachment size before sending. If a file is too large, the app shows the file size and asks you to pick something smaller. Large attachments may take a long time, and Offline Inbox delivery can be limited by the propagation node you use, so keep files small when the path might include LoRa or another slow link.

The recipient can impose a smaller incoming-message limit; Ratspeak defaults to **1 MB** for incoming messages and attachments. A file passing your sending check does not guarantee the recipient can accept it.

For supported photos, the **Photo size** dialog offers smaller versions before sending. Smaller images travel faster over slow links. Ratspeak shows received images inline; other attachments appear with their filename and size.

## Delivery states

Every outgoing message gets a small status indicator that tells you what happened to it.

- **Sending** — Ratspeak is preparing, routing, or transmitting the message.
- **Delivered** — the orange check means Ratspeak received an authenticated delivery proof from the recipient's destination.
- **Sent** — the gray check means the message left your node, but no delivery proof has come back yet.
- **Stored in Offline Inbox** — the message was accepted by an LXMF propagation node for later pickup. This proves the inbox node received the encrypted message; it is not the same as end-to-end recipient delivery.
- **Sending cancelled** — you stopped the remaining local delivery work. This does not recall data already transmitted.
- **Rejected** — the recipient rejected the message.
- **Failed** — delivery did not succeed. The destination may be unreachable, or the transfer may have failed. You can resend.

Ratspeak sends in Auto mode by default. Auto tries live delivery first, even if the recipient has not announced recently: a quiet device can still be online and listening. The app chooses the live delivery method using its current link and recipient-key information. Attachments and game actions start with Direct delivery; ordinary text can use Opportunistic delivery when suitable recipient-key information is available. If that live method reaches a terminal failure and Offline Inbox is enabled with a reachable node, Auto retries once by storing the encrypted message there. If no inbox node is ready, the message fails instead of claiming it was stored.

The underlying LXMF delivery modes are:

- **Direct** uses an encrypted live link to the recipient, with Link packet or Resource confirmation. Best when both sides are online or the message is too large for one packet.
- **Opportunistic** sends the message as a single packet without setting up a link. It's lightweight and works well over slow radios, has a small single-packet size limit (message fields and stamps also take space), and can return an authenticated Reticulum packet proof. If no proof returns, Ratspeak cannot distinguish non-delivery from a lost proof.
- **Offline Inbox** is Ratspeak's name for LXMF propagated delivery. It hands the encrypted message to a propagation node, which holds it until the recipient asks for waiting mail.

Most users do not have to choose a mode by hand. The state icon reports the observable delivery result rather than the transport method.

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

The Contacts tab is your address book. Each contact has a name (or nickname) you choose, the LXMF address itself, and an avatar. Tap a contact to open their detail panel, where you can start a conversation, edit their name, or remove them.

There are three ways to add a contact:

- **From the Peers tab** — open any peer's detail panel and use the add-contact action. Their address fills in automatically; just give them a name.
- **From a conversation** — open a thread with someone unsaved and use the add-contact action.
- **Manually** — tap the add button in the Contacts tab and paste an address.

Names are local to your device. The other side has no idea what you've named them, and they can name you whatever they like on their end.

## Avatars

Ratspeak generates an identicon from each LXMF address. The same address produces the same pattern in Ratspeak, which can help you recognize a contact.

An identicon is a visual aid, not proof of identity. Different addresses can produce similar patterns, and display names can be copied. Before sharing sensitive information with a new contact, compare the **full LXMF address** through a channel you already trust. Do the same if someone says they have changed addresses.

## Channels

Channels are shared text conversations hosted by a hub. **The hub can read and relay channel messages.** The private-message encryption described above does not protect messages from the hub operator or other channel participants. A private channel's access key restricts joining; it does not make the conversation end-to-end encrypted.

### Connect and join

1. Open **Channels**, then **Find a hub** or **Connect to a hub**. Choose an available or saved hub, or enter the hub's 32-character address.
2. Read the **Public channels** notice. On first use, the app requires acknowledgement of its age requirement and community terms before continuing.
3. Review the hub and your nickname, then connect. Use a hub whose operator you trust. A familiar name alone does not verify its address.
4. Choose an advertised channel, or select **Join** and enter a channel name supplied by the operator. Under **Private channel?**, enter an access key if required. **Remember for reconnect** saves the key after membership is confirmed; clear it to use the key only for this session.
5. Wait until the channel says **Live**, then type a message and send it. On desktop, Enter sends and Shift+Enter adds a line break.

A hub can require an invitation, access key, or other admission rules. Private or secret channels may be absent from its public list. If joining fails, read the error and ask the operator for the correct channel name and access details.

Only one hub is live at a time. Switching hubs ends your current live channel sessions. Your local history stays on this device.

### Messages, people, and moderation

The composer is available while you are connected and have joined the channel. It shows a byte counter near the hub's message-size limit; some characters use more than one byte. A disabled composer or **Connection recovering…** means the session is not ready to send. Wait for **Live** before trying again.

Channels are live conversations, not LXMF Offline Inboxes. Local history contains messages this device received; reconnecting does not fetch a backlog of everything you missed.

Open **Members** to see participants reported by the hub and people seen locally. The list can be incomplete. Channel permissions and moderation belong to the hub: an operator can restrict who may join or speak. Use a participant's actions to block them, or a message's **Report** action to prepare a report email. Review and send that email yourself; opening the report form does not submit it. Independent hub operators control moderation on their own hubs. Blocking in your app does not remove the person's messages from everyone else's device.

### Leave or reconnect

Use **Channel options → Leave channel** to end membership in one channel. Use the hub menu's **Disconnect** to end all live sessions on that hub. Both retain local history. From a history-only channel, use **Rejoin channel** or **Connect to hub** when you want to return. You may need a new invitation or access key if the operator has changed access.

Hosting is a separate task. See [Infrastructure and operations](../deployment/infrastructure-and-ops.md) for running a channel hub.

## Voice messages

To send a recording instead of a live call:

1. Open a conversation and leave the text composer empty, with no attachment selected. Tap the microphone button.
2. Grant microphone permission if prompted. Record your message; you can pause and resume.
3. Tap stop to review the recording. Play it back, discard it, or send it.

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
