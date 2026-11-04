---
sidebar_position: 9
---

# Ratkey

Hardware-backed Reticulum identities keep private-key operations on a PIV token. Desktop Ratspeak uses this through the experimental **`rns-ratkey` Rust crate**. The separate public **Ratkey Python package** provides integration with Python Reticulum and the `rnid-hw` CLI. They are different implementations with different setup and recovery flows.

## Using a hardware identity in Ratspeak

For Ratspeak **1.0.40**, follow [Settings and identity](../using-ratspeak/settings-and-identity.md). The desktop app can create a hardware identity, add an existing one, restore its recoverable form, unlock it with a PIN and manage its lock behavior. Mobile Ratspeak uses software identities.

Two provisioning choices have different backup properties:

- **Hardware-only** generates private keys on the token. Losing or resetting that token loses the identity; this mode does not provide a recovery phrase.
- **Recoverable** derives keys on the host and imports them into the token. Ratspeak's flow supplies a **12-word recovery phrase**. Anyone with that phrase can recreate the identity independently of the token PIN.

The token performs Ed25519 signing and X25519 key agreement. Public identity material remains wire-compatible with Reticulum. Hardware protection does not encrypt the app's message database or prevent a compromised unlocked host from asking the connected token to perform an allowed operation.

The app stores `.hwid` metadata and public keys, not an exportable token private key. Those metadata alone cannot restore a lost hardware-only identity. A PIN is an access control, not a backup.

## Hardware and PIV scope

The current app path is YubiKey/PIV-focused. Ed25519/X25519 support requires a compatible model and firmware; standard, non-FIPS YubiKey 5 firmware **5.7+** is the documented target. YubiKey 5 FIPS does not provide the required Ed25519/X25519 PIV pair. Check [Yubico’s algorithm table](https://docs.yubico.com/hardware/yubikey/yk-tech-manual/yk5-apps-piv.html) and [FIPS exceptions](https://docs.yubico.com/hardware/yubikey/yk-tech-manual/yk5-fips-piv.html). A detected PC/SC reader name does not establish that another token supports the required algorithms or has been qualified with Ratspeak.

PIV operations use system smart-card services, including PC/SC access on desktop platforms. Linux installations may need `pcscd` and suitable permissions. Check the exact reader/error state before changing the token.

**Reset PIV** removes PIV user keys and certificates, including those used by other PIV applications, and restores the default PIV credentials. YubiKey's F9 attestation material and its other applications are unaffected. Reset is not limited to Ratspeak's signing/encryption slots. See [Yubico's reset documentation](https://docs.yubico.com/yesdk/yubikey-api/Yubico.YubiKey.Piv.PivSession.html#Yubico_YubiKey_Piv_PivSession_ResetApplication). Use the app's detailed warning and preserve a valid recovery method before choosing it.

## For Rust developers

`rns-ratkey` lives inside [rsReticulum](https://github.com/ratspeak/rsReticulum/tree/5b38cae702a5b3984adf12a435f6d3012fcf90e1/crates/rns-ratkey). Ratspeak 1.0.40 pins that crate as part of the **1.4.0** component source set; standalone rsReticulum 1.3.0 is a separate source line.

The crate provides bound hardware identities, `.hwid` metadata, provisioning and restore operations, seed derivation, PIN/session handling and mock transports for tests. Real PC/SC support is behind the `hardware` Cargo feature. An application must handle token removal, failed PIN checks, locking and identity changes; wire compatibility does not provide that UI or lifecycle management for it.

Use the crate source and the [rsReticulum API guide](https://github.com/ratspeak/rsReticulum/blob/5b38cae702a5b3984adf12a435f6d3012fcf90e1/api/README.md) for the selected revision. The crate remains experimental and is not published to crates.io by this workspace.

## The Python Ratkey tool

The separate [ratspeak/ratkey repository](https://github.com/ratspeak/ratkey) contains the **0.1.0** Python package and `rnid-hw` command. It requires Python **3.9+** and has optional hardware/backup dependencies. Its source is at [revision a06e9a5](https://github.com/ratspeak/ratkey/tree/a06e9a5cf2bcccc31c3e490e82959cf9b5b7173d).

Use its repository instructions for that tool's provisioning, verification and application integration. Its recoverable provisioning describes a **24-word phrase**. Do not substitute those instructions for Ratspeak's 12-word app flow or assume backup files and phrases are interchangeable without a verified import path.

The Python package is MIT-licensed. The Rust `rns-ratkey` crate is part of the AGPL-3.0-or-later rsReticulum workspace. Both need implementation-specific testing; this page makes no blanket claim that every PIV token or third-party Reticulum application is supported.
