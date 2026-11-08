---
sidebar_position: 7
---

# LRGP

LRGP, the Lightweight Reticulum Gaming Protocol, carries game actions in LXMF messages. Its built-in games are **Tic-Tac-Toe, Chess and Four in a Row**. If you want to play in Ratspeak, use the [Games guide](../using-ratspeak/games.md); the details below are for application and game developers.

The standalone Rust release is [**lrgp-rs 0.4.1**](https://github.com/ratspeak/lrgp-rs/releases/tag/v0.4.1). The Python source package identifies itself as **0.4.0** at the [documented revision](https://github.com/ratspeak/lrgp-py/tree/6b9938342832be6b98eab940ac38679588e02b5e). Package versions are separate from the wire marker, which remains `lrgp.v1`. Ratspeak 1.0.40 pins its own Rust source commit in the app dependency manifest.

## Wire format and delivery

An LRGP message uses these LXMF fields:

| Field | Value |
|---|---|
| `0xFB` | Protocol marker `lrgp.v1`. |
| `0xFD` | MessagePack envelope containing the game action. |
| Standard message content | Human-readable fallback for clients without an LRGP UI. |

The envelope uses five compact keys: game/version (`a`), action (`c`), session (`s`), game payload (`p`) and an eight-byte random nonce (`n`). The session ID is represented as 16 lowercase hex characters. The packed envelope is capped at **200 bytes**.

That is an envelope budget, not a guarantee that the complete signed LXMF message fits one opportunistic packet. Fallback text, fields and other message overhead also count. A host application chooses delivery according to its capabilities and policy. Ratspeak's Auto game actions start with Direct delivery; an eligible terminal failure can use Offline Inbox when configured. The small wire representation still matters on slow links.

For exact encodings and validation, use the [Rust release specification](https://github.com/ratspeak/lrgp-rs/blob/v0.4.1/SPEC.md) and the corresponding implementation's tests.

## Sessions and validation

A challenge starts a session. The other participant can accept or decline; active games exchange moves and finish through a game result, resignation or an agreed draw where supported. Both peers validate actions against local state.

The host must supply an **authenticated remote sender** and the receiving local identity to inbound dispatch. A display name, fallback message or sender field supplied by an untrusted caller is not authentication. The router binds sessions to their participant and rejects mismatches before applying state changes.

Replay state is scoped by receiving identity and session. The current implementations bound it to 512 nonces per scope and 1,024 scopes, with an absolute ten-minute TTL. Ending a game does not clear its replay entries; normal TTL expiry and bounded-cache eviction still apply. The cache is not a durable record of every action received.

SQLite store helpers persist sessions and actions, but an embedding application owns its transaction and retention policy. Follow the router's rollback contract if dispatch succeeds and durable storage fails. Expiry policies differ by game; do not apply one app's timeout to every LRGP integration.

## Built-in games

- **Tic-Tac-Toe** provides a small example of challenge, turn and terminal-state validation.
- **Chess** uses `cozy-chess` in Rust and the optional `chess` dependency in Python. Moves use UCI strings such as `e2e4`; peers reconstruct and validate the board locally.
- **Four in a Row** uses a 7×6 board with gravity. Its compact move identifies a column; peers reconstruct the board instead of sending a full board snapshot on each turn.

A non-LRGP LXMF client can display fallback text such as a move notice, but that text does not give it an interactive game implementation.

## Embedding or adding a game

For Rust envelope construction, validation and LXMF embedding, start with **`lrgp::protocol`** and the [API guide](https://github.com/ratspeak/lrgp-rs/blob/v0.4.1/api/README.md). Router, game, session and store APIs remain provisional and module-qualified.

Implement `GameApp` in Rust or `GameBase` in Python, declare the game's manifest, validate incoming actions and render fallback text. Register the game with the router. A game included in the Rust package's built-in set also belongs in `apps::builtin_games()`.

Use the existing [Rust examples](https://github.com/ratspeak/lrgp-rs/tree/v0.4.1/examples) or [Python examples](https://github.com/ratspeak/lrgp-py/tree/6b9938342832be6b98eab940ac38679588e02b5e/examples) as a starting point. Keep action validation deterministic, stay within the envelope budget and handle retransmission without applying the same move twice.

For LXMF integration, `pack_lxmf_fields` supplies native MessagePack values. If using the pre-encoded-field helper with `lxmf-core`, install each value with `set_msgpack_field`; `set_field` would encode it as binary data and change the wire representation.

## Build and license

The Rust crate requires **Rust 1.87+**. From a checkout of standalone v0.4.1:

```bash
cargo test
cargo run --features test-helpers --example chess_game
```

The Python package requires **Python 3.8+**. From its checkout, use an isolated environment:

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -e '.[chess,dev]'
python examples/chess_local.py
```

On Windows, activate with `.venv\Scripts\Activate.ps1` in PowerShell instead. The optional `rns` extra adds the Reticulum/LXMF network bridge; the local game examples do not need a network.

Both standalone implementations are MIT-licensed. LRGP's license does not change the license of the Ratspeak application that embeds it (see [Licenses](../reference/licenses.md)).
