---
sidebar_position: 6
---

# Licenses

| Component | License | Copyright |
|---|---|---|
| Ratspeak app | [Reticulum License](https://github.com/ratspeak/Ratspeak/blob/main/LICENSE) | Ratspeak LLC |
| ratspeak-handheld firmware, launcher, and tools | [Reticulum License](https://github.com/ratspeak/ratspeak-handheld/blob/main/LICENSE) | Ratspeak LLC |
| rsNode firmware and tools | Reticulum License | Ratspeak LLC |
| [rsReticulum](https://github.com/ratspeak/rsReticulum) | [Reticulum License](https://github.com/ratspeak/rsReticulum/blob/main/LICENSE) | Mark Qvist, unless otherwise noted; additions and modifications Ratspeak LLC |
| [rsLXMF](https://github.com/ratspeak/rsLXMF) | [Reticulum License](https://github.com/ratspeak/rsLXMF/blob/main/LICENSE) | Mark Qvist, unless otherwise noted; additions and modifications Ratspeak LLC |
| [rsReticulumLite](https://github.com/ratspeak/rsReticulumLite) | [Reticulum License](https://github.com/ratspeak/rsReticulumLite/blob/main/LICENSE) | Mark Qvist, unless otherwise noted; additions and modifications Ratspeak LLC |
| [rsLXMFLite](https://github.com/ratspeak/rsLXMFLite) | [Reticulum License](https://github.com/ratspeak/rsLXMFLite/blob/main/LICENSE) | Mark Qvist, unless otherwise noted; additions and modifications Ratspeak LLC |
| [rsLXST](https://github.com/ratspeak/rsLXST) | [LXST license](https://github.com/ratspeak/rsLXST/blob/main/LICENSE) | Mark Qvist |
| [lrgp-rs](https://github.com/ratspeak/lrgp-rs), [lrgp-py](https://github.com/ratspeak/lrgp-py), [lxmface](https://github.com/ratspeak/lxmface) | MIT | Ratspeak |
| RNode firmware bundled in ratspeak-handheld | GPL-3.0-or-later | Mark Qvist and contributors |
| microReticulum, used by the legacy handheld firmware | Apache-2.0 | its author |
| [jsQR](https://github.com/cozmo/jsQR) 1.4.0, which reads contact-card QR codes in the Ratspeak app | Apache-2.0 | its authors |
| [Outfit](https://github.com/Outfitio/Outfit-Fonts), the Ratspeak app's interface typeface | SIL Open Font License 1.1 | The Outfit Project Authors |
| [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), the Ratspeak app's typeface for addresses and codes | SIL Open Font License 1.1 | The JetBrains Mono Project Authors |
| Other third-party components | Their own licenses, listed in each repository's third-party notices | |

Each repository's `LICENSE` file is the binding text. Repositories that bundle other
components list them in `NOTICE` or `third_party/`. The Ratspeak app ships the jsQR
and font license texts next to those files, and shows its notices under
**Settings → About → Licenses**.

## Reticulum License

The license of the [Reticulum](https://github.com/markqvist/Reticulum) and
[LXMF](https://github.com/markqvist/LXMF) reference implementations by Mark Qvist,
also published at [reticulum.network/license.html](https://reticulum.network/license.html).
It permits use, modification, distribution, and sale, on three conditions:

- the software shall not be used in any kind of system which includes amongst its
  functions the ability to purposefully do harm to human beings;
- the software shall not be used, directly or indirectly, in the creation of an
  artificial intelligence, machine learning or language model training dataset,
  including but not limited to any use that contributes to the training or
  development of such a model or algorithm;
- the copyright notice and the permission notice shall be included in all copies
  or substantial portions of the software.

## LXST

rsLXST is derived from the [LXST](https://github.com/markqvist/LXST) reference
implementation, which is published under CC BY-NC-ND 4.0, and is used under the
following license from its author:

```
LXST Copyright 2026 Mark Qvist.

This implementation of LXST is derived from the LXST reference implementation,
and used under license for Ratspeak, for non-commercial use only.
No derivatives or use outside Ratspeak is permitted.

For commercial licensing inquiries, contact license@unsigned.io
```

Builds that include rsLXST (voice calls in the app, voice memos on the handhelds)
are non-commercial. The Ratspeak app's `NOTICE` adds:

```
Because of those terms, any build of Ratspeak that includes rsLXST is
non-commercial, and no derivative of rsLXST or use of it outside Ratspeak is
permitted. The Reticulum License's permission to sell covers the rest of the
software; no builds or software outside of Ratspeak-owned projects are allowed
to utilize rsLXST in any form.
```
