---
sidebar_position: 4
---

# Games

The **Games** view lets you play **Tic-Tac-Toe**, **Chess**, and **Four in a Row** with your contacts. Challenges and moves travel as LXMF messages using [LRGP](../products/lrgp.md). You do not need a separate game server.

Ratspeak tries live delivery first. If that fails and Offline Inbox is enabled with a reachable node, it can store the move for later pickup. Check the delivery status before assuming your opponent has received a challenge or move. **Stored in Offline Inbox** is not confirmation that they have received it; see [delivery states](messaging-and-contacts.md#delivery-states).

## What the Games view does

Open **Games** from the navigation. On a wide screen, the view has two columns:

- **Sessions** on the left, grouped by status — pending challenges, active games, finished games.
- **Board** on the right, showing whichever session you've selected.

Sessions with a move waiting on you show an unread badge, the same way the Messages view marks unread threads.

On a narrow screen, select a session to open its board. Use the back button to return to the list.

## Starting a game

1. Open **Games**.
2. Tap **New Game**.
3. Pick Tic-Tac-Toe, Chess, or Four in a Row.
4. Select a contact, then tap **Send Challenge**.

When your contact receives the challenge, they can open it and choose **Accept** or **Decline**. Until they answer, you can choose **Cancel** to withdraw it. Challenges expire after about a day without a response.

Both peers hold their own copy of the game state locally. Each client applies moves to its own board. Transport or Offline Inbox nodes can carry the messages, but do not run the game.

## Tic-Tac-Toe

You'll see a 3×3 grid. The challenger plays X and moves first.

- Click an empty cell to place your mark.
- Three in a row wins. A full board with no winner is a draw.
- Illegal moves are blocked client-side, so you can't accidentally overwrite a square.

## Chess

Chess checks legal moves, including castling, en passant, and promotion.

- Click a piece to see its legal destinations highlighted.
- Click a destination to move.
- Pawn promotion prompts you for the promotion piece.
- The board flips to your perspective: White at the bottom if you're playing White, Black at the bottom if you're playing Black.

The challenger plays White. Move history appears alongside the board.

## Four in a Row

The board has seven columns and six rows. Select a column to drop your piece into its lowest empty space. The challenger moves first. Make a line of four horizontally, vertically, or diagonally to win. A full board with no winning line is a draw.

## If a move fails

The board shows whether the last action is sending, stored, sent, or failed. If it fails, use **Resend last move**. This retries the same action; it does not make a second move. If repeated attempts fail, check [your network connection](network-and-peers.md) and your opponent's availability.

## How a session ends

A game ends one of four ways:

- **Resign** — either player can resign from an active game's board controls.
- **Draw** — use the draw controls to offer or answer a draw. Tic-Tac-Toe and Four in a Row also draw when the board fills with no winner. Chess detects automatic draw conditions and offers **Claim threefold** or **Claim 50-move** when applicable.
- **Checkmate / win** — three in a row wins Tic-Tac-Toe, four in a row wins Four in a Row, and checkmate wins Chess.
- **Expiry** — inactive Tic-Tac-Toe games expire after about a day; Chess and Four in a Row allow about seven days between actions. These limits include a one-hour allowance for differences between device clocks. An expired game cannot accept further moves.

Finished sessions remain in the list. **Rematch** sends a new challenge for the same game and opponent. You can remove a finished, declined, or expired session with its **Remove from history** control; active games must end first. Removing a session deletes its local game history, not your opponent’s copy.

## What non-Ratspeak clients see

LRGP actions include a text fallback for LXMF clients that do not implement the game. For example:

- `[LRGP TTT] Move 3` for a Tic-Tac-Toe move.
- `[LRGP Chess] e2e4` for a chess move.

Receiving that text does not let the other client play the game. Both players need compatible LRGP game support for an interactive board.
