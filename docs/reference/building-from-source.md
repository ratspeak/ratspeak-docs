---
sidebar_position: 3
---

# Building from source

Use this guide to build **Ratspeak 1.0.37**, or the separate **rsReticulum 1.3.0** and **rsLXMF 1.3.0** command-line releases. For an ordinary installation, use [Install & Platform Setup](../getting-started/install-and-platform-setup.md). iOS users can join the [public TestFlight](https://testflight.apple.com/join/AzzW4Jg6).

## What you are building

The shell examples use Bash on macOS/Linux, or Git Bash on Windows. The app needs five repositories in one parent directory:

| Repository | Role |
|---|---|
| [Ratspeak](https://github.com/ratspeak/Ratspeak) | Desktop/mobile app and frontend. |
| [rsReticulum](https://github.com/ratspeak/rsReticulum) | Reticulum networking. |
| [rsLXMF](https://github.com/ratspeak/rsLXMF) | LXMF messaging. |
| [rsLXST](https://github.com/ratspeak/rsLXST) | Experimental voice stack, enabled by default. |
| [lrgp-rs](https://github.com/ratspeak/lrgp-rs) | Game protocol. |

Keep all four siblings even when disabling voice: Cargo still needs to resolve the declared path dependencies. The app's protocol pins are newer than the standalone 1.3.0 releases. Use a separate directory for those standalone builds.

## Select an exact source set

For a released app, `release/dependency-set.json` at the **Ratspeak release tag** selects every sibling commit. A component's Cargo version is not its Git revision. Do not substitute a standalone tag or a branch tip for the manifest's commit.

Install Git and Node.js first; this release uses Node **22.22.0** for its source tooling. From a directory where you want to keep the sources:

```bash
git clone --branch v1.0.37 https://github.com/ratspeak/Ratspeak.git Ratspeak-source-tools
node Ratspeak-source-tools/scripts/release/checkout-release-source.mjs \
  --tag v1.0.37 --destination ratspeak-v1.0.37-source
cd ratspeak-v1.0.37-source
node Ratspeak/scripts/release/source-integrity.mjs verify-tags
```

The helper fetches the exact component commits and verifies their annotated integration tags. It refuses conflicting or modified destinations; choose a new destination for an existing development tree. Its `--plan` option fetches product metadata and shows the selection, but does not complete component verification.

The resulting layout is:

```text
ratspeak-v1.0.37-source/
├── Ratspeak/
├── rsReticulum/
├── rsLXMF/
├── rsLXST/
└── lrgp-rs/
```

GitHub's automatic Ratspeak source archive contains only the app repository. If packaging from archives, fetch all five exact revisions and retain these names. See the [versioned source-packaging guide](https://github.com/ratspeak/Ratspeak/blob/v1.0.37/docs/source-packaging.md) for manual/Nix packaging and offline source verification.

`Ratspeak/src-tauri` is a separate Cargo workspace. Its app build uses `src-tauri/Cargo.lock`; root workspace checks use `Ratspeak/Cargo.lock`. Keep both release lockfiles intact.

## Common prerequisites

Install [Rust through rustup](https://www.rust-lang.org/tools/install). The minimum supported Rust version is **1.89.0**; the release toolchain is **1.96.0**. Select the release toolchain for this checkout and install its Tauri CLI:

```bash
rustup toolchain install 1.96.0
# Run inside ratspeak-v1.0.37-source:
rustup override set 1.96.0
cargo install tauri-cli --version 2.11.1 --locked
```

On Windows, use the MSVC Rust toolchain, such as `1.96.0-x86_64-pc-windows-msvc`, for both the installation and override. Check the tools before continuing:

```bash
git --version
node --version
rustc --version
cargo tauri --version
```

The frontend is plain HTML, CSS and JavaScript. There is no npm install step. Its CSS helper needs Bash; on Windows, Git Bash supplies it.

## Platform setup

### macOS desktop

Install Xcode Command Line Tools:

```bash
xcode-select --install
```

For iOS, install the full Xcode app, launch it and finish its component setup. Release 1.0.37 records Xcode **26.3** and iOS SDK **26.2** in its dependency manifest.

### Linux desktop

Install the Tauri prerequisites and the app's native development libraries. On Debian/Ubuntu:

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libasound2-dev libudev-dev libpcsclite-dev libdbus-1-dev pkg-config
```

Other distributions use different package names. Follow [Tauri's prerequisites](https://v2.tauri.app/start/prerequisites/) for the WebView/toolchain setup, and install the corresponding ALSA, udev, PC/SC and D-Bus development packages. For Nix, assemble the source set and native dependencies in the package environment; the source-packaging guide above describes the sibling/lockfile contract.

### Windows desktop

Install Git for Windows, Microsoft C++ Build Tools with **Desktop development with C++**, and the Microsoft Edge WebView2 Runtime if it is absent. Use the MSVC Rust toolchain. See [Tauri's Windows prerequisites](https://v2.tauri.app/start/prerequisites/#windows) for installer details.

PowerShell can run the build commands. Run the CSS helper through Git Bash, or make its `bash` command available to that shell.

### Android

Install Android Studio and its SDK Manager components: Android SDK Platform **36**, Platform-Tools, Build-Tools, Command-line Tools and NDK **27.0.12077973**. The release uses Java **17**. Set `JAVA_HOME` and `ANDROID_HOME` following [Tauri's Android prerequisites](https://v2.tauri.app/start/prerequisites/#android), then add the targets you intend to build:

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
```

Tauri 2.11.1 can choose a different NDK when several are installed, even if `NDK_HOME` is set. On macOS or Linux x86_64, the release's SDK-view helper exposes only the pinned NDK without changing the installed SDK. Run this from the Ratspeak repository, with an existing temporary directory outside the SDK as `SDK_VIEW_PARENT`:

```bash
SDK_VIEW_PARENT="${TMPDIR:-/tmp}"
node scripts/release/android-sdk-view.mjs create \
  --sdk "$ANDROID_HOME" --ndk 27.0.12077973 --parent "$SDK_VIEW_PARENT"
```

Use the returned `view` path for `ANDROID_HOME` and `ANDROID_SDK_ROOT`, and its `ndk/27.0.12077973` subdirectory for `ANDROID_NDK_HOME` and `NDK_HOME`, in the build shell. Keep that view available through Gradle and packaging. Check the build log's **Using installed NDK** line. This helper does not support Windows; Windows source builders must establish the same NDK selection in their own SDK setup. The [Android release workflow](https://github.com/ratspeak/Ratspeak/blob/v1.0.37/.github/workflows/release-android.yml) shows the complete release environment and validation.

USB debugging and `adb devices` are needed when installing or debugging on a physical phone, not for producing an APK.

### iOS

iOS builds require macOS, full Xcode and CocoaPods:

```bash
rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
brew install cocoapods
```

Physical-device builds need your own Apple development team and provisioning. The source project uses `org.ratspeak.apple` and the multicast networking entitlement. Approval for Ratspeak's distribution team does not give another developer team that entitlement; configure signing and the capabilities your own profile permits. Simulator builds cannot establish Bluetooth, Local Network or background behavior on a phone. See [Tauri's iOS prerequisites](https://v2.tauri.app/start/prerequisites/#ios).

## Build Ratspeak for desktop

From the assembled source directory:

```bash
cd Ratspeak
bash dashboard/build-css.sh
cd src-tauri
cargo tauri dev -- --locked
```

For release bundles, use:

```bash
cargo tauri build -- --locked
```

To disable the experimental voice feature, pass the Cargo option after Tauri's `--` separator:

```bash
cargo tauri build -- --locked --no-default-features
```

Keep `rsLXST` in the source layout even for this build. Bundle output normally lands under `Ratspeak/src-tauri/target/release/bundle/` unless you override Cargo's target directory. Packaging produces the platform's `.app`/`.dmg`, `.msi`/`.exe`, or `.AppImage`/`.deb`/`.rpm`. A local build does not inherit the official release's signing credentials.

## Build Ratspeak for Android

From the assembled source directory, build an ARM64 debug APK:

```bash
cd Ratspeak
bash dashboard/build-css.sh
cd src-tauri
cargo tauri android build --debug --target aarch64 --apk -- --locked
```

The generated APK is normally under:

```text
Ratspeak/src-tauri/gen/android/app/build/outputs/apk/arm64/debug/app-arm64-debug.apk
```

A debug APK uses a different signing key from the official release and cannot replace it as an ordinary update. Use a development device/profile and preserve any existing identity and data before planning installation. For an interactive development run, use `cargo tauri android dev` from `src-tauri`.

For release packaging, the versioned Android workflow shows the ABI split and signing inputs. Supply your own signing configuration; do not expect an unsigned/local APK to be interchangeable with a published one.

## Build Ratspeak for iOS

For an Apple Silicon simulator build, start in the assembled source directory:

```bash
cd Ratspeak
bash dashboard/build-css.sh
cd src-tauri
cargo tauri ios build --debug --target aarch64-sim -- --locked
```

Use `cargo tauri ios dev` for interactive simulator/device development. Production IPA export additionally needs the appropriate signing/profile setup; the [iOS release workflow](https://github.com/ratspeak/Ratspeak/blob/v1.0.37/.github/workflows/release-ios.yml) records the build and entitlement checks.

If a packaged build tries to load a local development server, check for shell overrides such as `TAURI_CONFIG` and `TAURI_DEV_HOST`. A packaged app should load its bundled assets.

For normal device use, [TestFlight](https://testflight.apple.com/join/AzzW4Jg6) avoids the source/signing setup. iOS still controls permissions and background execution; an app build is not a headless daemon. Use BLE or an RNode TCP bridge for radios: iOS does not expose general USB serial devices to Ratspeak.

## Build rsReticulum

Use a **separate source directory** for the standalone 1.3.0 tools:

```bash
mkdir reticulum-v1.3.0-source
cd reticulum-v1.3.0-source
git clone --branch v1.3.0 https://github.com/ratspeak/rsReticulum.git
git clone --branch v1.3.0 https://github.com/ratspeak/rsLXMF.git
cd rsReticulum
cargo build --release --locked
```

These releases require Rust 1.89 or newer. The tools land in `target/release/`: `rnsd-rs`, `rnstatus-rs`, `rnpath-rs`, `rnid-rs`, `rnprobe-rs`, `rncp-rs`, `rnsh-rs` and `rnodeconf-rs`. The `-rs` suffix distinguishes the executable; it does not select a configuration directory.

Print the starter configuration to inspect it:

```bash
./target/release/rnsd-rs --exampleconfig
```

Choose your configuration and interfaces using [Configuration reference](configuration-reference.md) and [Infrastructure & Ops](../deployment/infrastructure-and-ops.md). Do not redirect the example over an existing configuration. Standalone defaults such as `~/.rsReticulum` are separate from the app's identity-specific network directory.

## Build rsLXMF

In that same standalone source directory, rsLXMF depends on the sibling rsReticulum 1.3.0 checkout:

```bash
cd ../rsLXMF
cargo build --release --locked
./target/release/lxmd-rs --exampleconfig
```

The daemon is `target/release/lxmd-rs`. Configure its LXMF directory and its Reticulum directory separately; see [Infrastructure & Ops](../deployment/infrastructure-and-ops.md). It can attach to a running shared Reticulum instance, or own an in-process runtime. Distinct directories alone do not avoid conflicts over shared-instance names, ports or radio devices.

## Mobile and the protocol repos

The mobile app compiles rsReticulum and rsLXMF as Rust libraries; it does not require separate `rnsd-rs` or `lxmd-rs` installations. For protocol development, edit the matching sibling, rebuild the app for that target and record the changed source set. That development tree is no longer an unchanged release reconstruction.

## Ratspeak Handheld

T-Deck Plus, T-Pager, Cardputer Adv and M9 use the unified `ratspeak-handheld` repository. Follow its [firmware build procedure](../hardware/flashing-firmware.md#build-from-source) for the selected release and board. Handheld 2.3.4 has an M9 Standalone image only; Launcher and RNode instructions apply to the other supported boards.

Normal firmware builds use the included Rust archives and do not need this desktop sibling layout. `tools/release_identity.json` records the firmware/source identity. Keep firmware components from the same build and validate the package before flashing. The earlier `rsDeck`, `rsPager` and `rsCardputer` repositories describe their historical releases.

## Common build problems

**Cargo cannot find a sibling crate.** Check the five-directory layout and the manifest commits. Disabling voice does not make a missing `rsLXST` path valid.

**`cargo tauri` is missing or rejects an option.** Check `cargo tauri --version`; this release uses 2.11.1. Cargo options such as `--locked` and `--no-default-features` go after the `--` separator.

**Linux fails while linking native libraries.** Install the matching development packages, including WebKitGTK 4.1, ALSA, PC/SC and D-Bus. Include the missing library name and distribution/version in a report.

**Windows fails while compiling native code.** Check the C++ workload and the MSVC Rust target in the build terminal.

**Android cannot find or selects the wrong NDK.** Check the SDK paths, the installed pinned NDK and the actual Tauri selection in the build log. A working `adb` connection does not verify the build toolchain.

**iOS signing fails.** Check the chosen team, bundle identifier, profile and multicast entitlement together. Use a simulator build to separate compilation problems from device provisioning problems.
