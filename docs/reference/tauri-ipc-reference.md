---
sidebar_position: 2
---

# Tauri IPC reference

Ratspeak's desktop and mobile app is a Tauri v2 shell. The Rust core exposes a typed command surface that the WebView frontend calls; the core pushes asynchronous updates back as named events. This page documents the shape of that surface for app contributors, alternate frontends, automation, and test harnesses.

For the canonical, version-correct command list, browse the source on GitHub: <https://github.com/ratspeak/Ratspeak>.

## How IPC works in Ratspeak

The Rust core registers just over 120 functions tagged `#[tauri::command]`, grouped into nine domain modules. Each command is async, takes typed arguments, and returns an `AppResult<T>` where `T` is JSON-serializable. The WebView calls them via Tauri's `invoke` bridge.

In the other direction, the core stashes the Tauri `AppHandle` at startup and uses `AppHandle::emit(name, payload)` to broadcast events to every open window. There is no embedded HTTP server, no WebSocket, and no localhost port — all traffic is Tauri's process-internal IPC.

Because everything runs in-process, integrations must either live in the app's WebView or be Rust code calling the core directly. There is no remote IPC surface.

## Calling a command

```js
const { invoke } = window.__TAURI__.core;

try {
  const conversations = await invoke("api_lxmf_conversations");
  console.log(conversations);
} catch (err) {
  // err is { code, message }
  console.error(err.code, err.message);
}
```

For direct command parameters, use the Tauri argument names registered by Rust. Many Ratspeak commands take a single nested `args` struct; those nested fields intentionally mirror the Rust struct and may be snake_case, for example `dest_hash`, `delivery_method`, and `client_msg_id` in `send_lxmf_message`. Treat the source and dashboard callers as canonical when wiring a new integration.

## Listening for events

```js
const { listen } = window.__TAURI__.event;

const unlisten = await listen("lxmf_message", (e) => {
  // e.payload is the event body, shape depends on event name
  appendMessage(e.payload);
});

// later
unlisten();
```

Events fire on a single global channel — every listener for a given name receives every emit. Payloads are JSON objects whose schema is defined by the emitting site in the core.

## Command domains

Commands live under ten domain modules. Counts shift between releases; the current truth is the registered `generate_handler!` list and the command modules in source.

| Domain       | Approx. count | Covers                                                                  |
|--------------|---------------|-------------------------------------------------------------------------|
| `interfaces` | ~30           | AutoInterface, LoRa/RNode, RNode TCP endpoint setup, BLE RNode scan, serial discovery, TCP client/server, Backbone client/server, notifications, transport mode, connection history. |
| `system`     | ~18           | Lifecycle, status, restart, app metadata, reset/clear actions.          |
| `network`    | ~20           | Announces, paths, Offline Inbox/propagation nodes, blackholes, hub interfaces, network log state and level. |
| `messaging`  | ~14           | Send, list, mark-read, attachments, conversation CRUD.                  |
| `identity`   | ~12           | Identity create/import/export/activate/switch, hashes, display name.    |
| `ble`        | ~10           | Bluetooth Peer, BLE RNode discovery, pairing prompts, cancellation, disconnects. |
| `contacts`   | ~9            | Address book, trust state, custom names, hash lookup.                   |
| `games`      | ~8            | LRGP game sessions, action submission, session deletion.                |
| `voice`      | 7             | Experimental LXST voice surface — service start/stop, status, call/answer/reject/hangup. Only compiled in when the `lxst-voice` Cargo feature is on; see [rsLXST](../products/rslxst.md). |
| `peers`      | ~1            | Live peer roster snapshot (mostly event-driven).                        |

For the full per-command signature and argument schema, inspect the source with `rg -n '#\[tauri::command\]|generate_handler!' crates/ratspeak-tauri/src/commands src-tauri/src/lib.rs` in the [Ratspeak repo](https://github.com/ratspeak/Ratspeak).

## Event vocabulary

Names the core broadcasts; subscribe to whichever your integration cares about.

| Event                  | Payload                                                                  |
|------------------------|--------------------------------------------------------------------------|
| `system_status`        | Coarse lifecycle marker, for example ready, stopping, or stopped.        |
| `lxmf_identity`        | Active identity hash and display name when loaded or switched.           |
| `contacts_update`      | Full contact list snapshot after any contact mutation.                   |
| `conversations_update` | Conversation roster — last message, unread, peer hash.                   |
| `lxmf_message`         | A single inbound or outbound LXMF message in canonical form.             |
| `lxmf_step`            | Per-message send or attachment progress, including validation errors.    |
| `unread_total`         | Aggregate unread count across all conversations.                         |
| `stats_update`         | Transport, link, and traffic counters; see Notes for cadence.            |
| `peers_updated`        | Live peer mesh roster snapshot.                                          |
| `all_game_sessions`    | LRGP session list after any session-state change.                        |
| `node_operation_status`| Interface add/remove/update progress for long-running network operations.|
| `propagation_sync_result` | Propagation-node sync completion or failure.                          |
| `voice_call_update`    | Active LXST call lifecycle: status changes, profile, audio side state. Only emitted when the `lxst-voice` Cargo feature is on. |
| `voice_incoming_call`  | A new incoming LXST call that passed the contacts-only/zero-hop policy gate.                |

Other narrower events exist (`identity_reset`, `identity_switched`, `auto_announce_updated`, `propagation_update`, `ble_peer_status_update`, `hub_interfaces_update`, `transport_mode_updated`, etc.). Treat them as live; check the source if you depend on one.

## Error model

Every command returns `AppResult<T>`. Tauri serializes the error variant directly, so on the JS side a rejected `invoke` Promise yields:

```json
{ "code": "not_found", "message": "no contact for hash a1b2c3d4" }
```

Standard codes in use:

- `bad_request` — argument validation failure
- `unauthorized` / `forbidden` — capability gate refused the call
- `not_found` — referenced row, hash, or session does not exist
- `conflict` — state precondition violated (e.g. duplicate identity, or no active identity)
- `locked` — the active identity is locked, and only app settings, setup and identity management answer until it is unlocked
- `service_unavailable` — RNS or transport not ready yet
- `database_unavailable` — SQLite pool exhausted or migration mid-flight
- `lxmf_not_initialized` — LXMF stack not up; retry after `system_status` reports ready
- `files_not_removed` — the messages were deleted, but some of their files could not be removed yet; Ratspeak removes them later
- `phrase_not_saved` — the new identity's recovery phrase could not be stored, so the identity was not created
- `internal_error` — unexpected; the message is human-readable, the cause is logged
- `startup_error` — the core could not open its data at startup, so no command runs (see Startup errors below)

Treat unknown codes as fatal for that call but not for the session.

## Notes for integrators

**Subscribe, don't poll.** Every domain that matters emits when state changes. Polling commands in a loop wastes IPC bandwidth and races the broadcast.

**Stats are the exception.** The core emits `stats_update` on a 2.5-second cadence. Listen for that event instead of inventing a polling command.

**Wait for readiness.** On cold start, RNS comes up before LXMF. Calls into the messaging or identity domain before LXMF is ready return `lxmf_not_initialized` or `service_unavailable`. Wait for `system_status` to report `ready`, or retry with backoff after setup.

**Startup errors.** If the core can't open its data, no command is available: every `invoke` fails with `startup_error`, and the window shows a screen with the cause instead of the app. The window's initialization script sets `window.__RATSPEAK_STARTUP_ERROR__` to `{ "code": string }`, where `code` is `profile_in_use` (another Ratspeak app holds the same data), `schema_newer` (the database was written by a newer version; `found` and `supported` give both schema versions) or `storage`. Data in use by another app is left untouched. The data of a newer version is not reconciled, and its database is only read, never written. On Android, leaving that screen in any way (Back, Home, another app or the lock screen) closes Ratspeak and removes it from the recent apps, which ends its process, so opening it again retries. On iOS, swiping Ratspeak away in the app switcher ends it; Home only moves it to the background. On a drive that can't lock files, the core starts but can't refuse a second app, and `api_startup_progress` reports `profile_lock_warning` next to `storage_warning`.

**Identity is implicit.** Commands operate against the currently loaded identity. The exceptions are `api_set_display_name` (`args.identity_id`) and `set_identity_status` (`identityId`), which take the identity the caller shows: when another identity is active they answer `conflict` and change nothing. Rename, status, `block_contact` and `unblock_contact` wait for an identity switch in progress; one asked for before or during the switch then answers `conflict`. A switch can overtake a block or unblock that has already begun: its database changes still apply to the identity it was asked for, and its events reach no window. If that identity's runtime stopped before taking the network block or lift, the block waits until that identity next receives the contact's announce, and the lift until that identity's runtime is up again; blocking the contact before then cancels the lift. Listen for `identity_switched` to know when that context changes underneath you. A switch that begins (`identity_switching`) but doesn't finish ends with `identity_switch_failed` (`{ "hash": string, "generation": string, "error": string }`) instead, and the previous identity, if there was one, runs again; with none, no identity is left active. A `hw_activate_and_unlock` that cannot activate its identity sends `identity_switch_failed` too, with no `identity_switching` before it, and the previous identity runs again. Removing the active hardware identity makes the most recently used remaining identity active; a protected one comes up locked. Switching away from a protected identity and back asks for its passcode or PIN again. A hardware PIN unlock does not survive a runtime restart. `unlock_identity` answers `bad_request` when no identity is locked. While the active identity is locked, a command that works on its data answers `locked`; `api_setup_complete`, `api_lxmf_limits` and `voice_status` also answer `locked`. App settings, the Bluetooth availability probes and identity management remain available. `hardware_locked` (`{ "hash": string, "kind": "hardware" | "passcode", "reason": string }`) reports a lock: `reason` is `secret_required` when the identity loads locked and `timeout` for Auto-Lock, which locks it once the set time has passed since its unlock, counting time the device slept, whether or not its network is running. `set_identity_passcode` on the active, unlocked identity starts its Auto-Lock over, and `remove_identity_passcode` ends it. A failed protected-identity load can instead emit `{ "hash": string, "kind": "hardware" | "passcode", "error": string }`. While no identity is active, a command that works on an identity's data may answer `conflict` with the message `no active identity`. The admission check in front of every command refuses such calls only once Ratspeak knows that no identity is active. With no active identity, app settings, first-run setup, platform probes and identity management remain available.

**Keys and secrets.** `export_shared_access`, `api_export_identity_reticulum_base64` and `api_export_identity_reticulum_base32` take the identity's `passcode` when it has one, otherwise `confirmed: true`; `api_export_identity_backup_base64` takes them as `identityPasscode` and `confirmed`, beside the backup's own `passcode`. Exports work while the identity is locked. `api_setup_complete`, `api_create_identity`, `restore_seed_identity` and an import of a backup that holds a recovery phrase store the phrase before they create the identity: one whose phrase cannot be stored answers `phrase_not_saved` and creates nothing, and one that arrives while another identity encryption runs answers `service_unavailable`. `reveal_identity_mnemonic` takes `args.passcode` or `args.confirmed` the same way as the exports, and answers `forbidden` for an identity that isn't active. A missing or wrong PIN answers `unauthorized`, and a missing confirmation `bad_request`. `copy_secret` (`{ text }`) puts a key or phrase on the clipboard, out of clipboard history where the platform allows, and clears it after a minute unless something else was copied since; on Android, while the app is in the background, it clears it either way.

**Notifications.** `api_notification_settings` answers `{ "enabled": bool, "ios_stubbed": bool, "preview": string }`. `set_notification_preview` takes `preview`, one of `name_and_message`, `name_only` or `neither`, answers the same object and keeps the choice across restarts; any other value answers `bad_request`. Both answer while no identity is active or the active one is locked.

**Bulk clears.** `api_clear_messages`, `api_clear_contacts` and `api_reset_database` act on the active identity only and keep its blocked users. A clear that waited out an identity switch answers `conflict` and deletes nothing. A finished clear first emits `identity_data_cleared` (`{ "messages": bool, "contacts": bool }`), then re-sends `contacts_update`, `unread_total` and `conversations_update`. When a clear or `delete_conversation` deletes messages whose files cannot all be removed yet, its events and lists still go out and it answers `files_not_removed`.

**Attachments.** The app exposes its current message, attachment, efficient-resource, and Offline Inbox/propagation-node transfer limits through `api_lxmf_limits`. Do not hard-code UI limits; they depend on the protocol resource ceiling and, for Offline Inbox delivery, the selected propagation node's advertised transfer limit.

**Threading.** Commands are async on a Tokio runtime; long work does not block the WebView. Events are emitted from whatever task produced them, so handlers must be reentrant.

**Versioning.** The IPC surface is not a stable public API. Pin to a Ratspeak release when shipping integrations and re-verify against [the source](https://github.com/ratspeak/Ratspeak) on upgrade.
