---
sidebar_position: 8
---

# LXMFace

LXMFace generates a circular SVG avatar from an LXMF address string. Its Rust and JavaScript implementations produce the same image for the same canonical ASCII address seed. It runs locally without an image server or lookup service.

Use it when building a contact list or another interface that needs recognizable address markers. An avatar is a visual aid, **not identity verification**: different inputs can produce similar or identical patterns. Compare the full address through a trusted channel when the identity matters.

This page describes source package **0.1.0** at [revision 297bd18](https://github.com/ratspeak/LXMFace/tree/297bd18b70bf6030a4746afca659e7d555dfa4f0).

## Rust

From an application with the `lxmface` crate available:

```rust
let address = "0123456789abcdef0123456789abcdef";
let svg = lxmface::lxmface_svg(address, 64);
assert!(svg.starts_with("<svg"));
```

`lxmface_svg` returns a self-contained SVG `String`; the size sets its width and height in pixels. `lxmface_data(address)` instead returns the primary, background and spot colors plus an 8×8 grid for custom rendering.

The default Rust build uses `std` and has no runtime dependencies. The declared `no_std` mode does not compile at this revision; keep default features enabled. Its declared minimum is Rust **1.85**. Obtain the source from the [repository](https://github.com/ratspeak/LXMFace); its manifest and API comments define the integration.

## Browser JavaScript

Copy `js/lxmface.js` from the selected source revision into your site's assets, then load it as a regular script:

```html
<div id="avatar"></div>
<script src="lxmface.js"></script>
<script>
  document.getElementById('avatar').innerHTML =
    lxmface('0123456789abcdef0123456789abcdef', 64);
</script>
```

The file exposes the global `lxmface` function, CommonJS exports and an AMD wrapper. Although package metadata has a `module` field, this distribution does not define native ES-module exports; use its documented loading form or your bundler's interop support.

The input is a seed string, not an address validator. Use one canonical address representation in your application; changing the seed text can change the avatar.

## Compatibility and Ratspeak

Shared vectors check Rust/JavaScript compatibility for address seeds. Arbitrary Unicode strings are not guaranteed to match: Rust uses Unicode scalar values while JavaScript uses UTF-16 code units. Keep the vectors when adapting the algorithm, and test the exact output format your renderer consumes.

Ratspeak **1.0.40** still uses its inline Blockies-style avatar implementation. It does not depend on the standalone LXMFace package, so do not assume changing this library will change the app's avatars.

LXMFace is [MIT-licensed](https://github.com/ratspeak/LXMFace/blob/297bd18b70bf6030a4746afca659e7d555dfa4f0/LICENSE), adapted from the Blockies algorithm with circular SVG rendering.
