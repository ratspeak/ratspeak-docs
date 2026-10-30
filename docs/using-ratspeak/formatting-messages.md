---
sidebar_position: 1.5
---

# Formatting messages

Ratspeak messages support Markdown. There's nothing to turn on: type the symbols below and Ratspeak sends the message as Markdown. Messages without formatting are sent exactly as typed.

## Text styles

| Type this | To get |
|---|---|
| `**bold**` or `__bold__` | **bold** |
| `*italic*` or `_italic_` | *italic* |
| `***bold italic***` | ***bold italic*** |
| `~~strikethrough~~` | ~~strikethrough~~ |
| `` `inline code` `` | `inline code` |
| `\|\|spoiler\|\|` | a hidden [spoiler](#spoilers) |

Underscores inside a word stay as typed, so `snake_case_name` isn't italicized.

On desktop, select text in the message box and press **Cmd** (macOS) or **Ctrl** (Windows, Linux) with:

- **B** for bold
- **I** for italic
- **E** for code
- **Shift+X** for strikethrough

Press the same keys again to remove the formatting.

## Headings, lists, and quotes

```
# Heading
## Smaller heading
### Smallest heading

- Bulleted item
  - Nested item
1. Numbered item

> Quote
```

Headings and quotes need a space after the `#` or `>`. Bullets can also start with `*` or `+`, and nested items are indented two spaces. A single line break stays a line break; a blank line starts a new paragraph.

## Code blocks

Put three backticks on the lines before and after your code:

````
```toml
[interfaces.lora]
frequency = 915000000
```
````

The language after the opening backticks is optional and appears as a label above the block. Long lines scroll sideways, and the copy button copies just the code.

## Spoilers

Wrap text in `||` to hide it, or start lines with `>! ` to hide them whole:

```
The relay goes on ||the old fire lookout||.

>! The lookout key is under the third rock.
>! Don't tell anyone.
```

Tap or click a spoiler to reveal it. Each one is revealed separately and stays revealed until you leave the conversation. Until then, message previews, reply quotes, notifications, and copied text show `[Spoiler]` in its place.

Ratspeak sends spoilers as `>!hidden!<`, the format Sideband uses.

Spoilers only cover text on screen. They add no privacy: the hidden text is part of the message like any other.

## Links

Web addresses become links automatically. To link different text:

```
See [the band plan](https://example.org/bandplan).
```

Only `http://` and `https://` links are clickable.

### Opening links

Opening a link shows **Leaving Ratspeak**, with the site name in bold and the start of the address. Choose **Open Link** to continue or **Cancel** to stay.

The prompt shows a warning, and you choose **Open Anyway** to continue, when:

- the link text names a different site than the one it opens
- the address hides its real destination, like `bank.example@another.example`
- the address uses international characters that imitate another site's name

To skip the prompt for a site you trust, tick **Don't ask again for** that site. `www.example.org` and `example.org` count as the same site. Manage the list under **Settings → Privacy → Trusted websites**. Links with a warning always ask.

On desktop, right-click a link to open the message menu, which has **Copy Link**.

## Escaping symbols

Put a backslash before a symbol to show it as typed: `\*not italic\*` shows as \*not italic\*.

A message whose only special characters are backslash escapes is sent as plain text, so `¯\_(ツ)_/¯` arrives intact.

## Not supported

These are shown exactly as typed:

- tables
- images (send them as attachments)
- HTML tags
- horizontal rules (`---`)
- underlined headings (a line of `===` or `---` under text)

## Other apps and older messages

Ratspeak formats a message only when its sender marked it as Markdown, using LXMF's renderer field. Plain messages from other apps are never reformatted, and messages you received before updating stay as they were.

Other apps decide how to show messages Ratspeak marks as Markdown:

- Sideband shows the text without the symbols.
- Apps without Markdown support show the symbols as typed.
