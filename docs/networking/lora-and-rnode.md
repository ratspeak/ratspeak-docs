---
sidebar_position: 2
---

# LoRa radio interfaces

An RNode is a compatible radio running the RNode control protocol. Check the exact board, radio chip, firmware and connection mode; a LoRa-capable board alone is not enough. This page covers Ratspeak **1.0.40** and Ratspeak Handheld **2.3.4 beta** defaults.

LoRa can provide a radio path without internet or cellular service. Range and throughput depend on the radio settings, antenna, terrain, interference and network load. Test a short direct exchange before adding hops or larger transfers.

## Connecting an RNode in Ratspeak

Open the Network view and tap **Add LoRa Device**. Four transports are available depending on platform:

- **USB / Serial** — desktop (Linux, macOS, Windows). The radio enumerates as a serial port; pick it from the dropdown.
- **USB-OTG** — Android phones with USB host mode, using a USB-C OTG cable. Grant the per-device permission prompt the first time you plug in.
- **Bluetooth** — desktop and mobile. Use the firmware’s pairing procedure, then scan. Follow the app/OS prompt for that radio; Android 1.0.40 presents the RNode PIN prompt inside Ratspeak. A retained bond can be reused, but pairing may be needed again after an OS/radio reset.
- **TCP** — desktop and mobile. Use this when the RNode's KISS stream is exposed over a local TCP bridge, for example by firmware with TCP support or by a nearby always-on host attached to the radio.

After choosing a transport, set a name, region, and preset. Ratspeak writes the interface config and brings it up immediately — no manual config file editing. Pause the old connection before switching the same radio between USB, BLE or TCP. Do not assume the app can identify every physical-device conflict across different endpoints or other hosts.

## RNode over TCP

RNode TCP is still a LoRa radio interface. It is not the same thing as a normal **TCP Client** interface. A TCP Client connects Ratspeak to another Reticulum node or hub; RNode TCP connects Ratspeak to the radio's RNode/KISS control stream, then packets still go over LoRa on the air.

In the TCP tab, enter an endpoint as `host`, `host:port`, `tcp://host`, or `tcp://host:port`. If you omit the port, Ratspeak uses the RNode TCP default port `7633`. IPv6 literals should use brackets when a port is present, for example `tcp://[fd00::10]:7633`.

Keep RNode TCP on a trusted LAN, hotspot, or VPN unless the bridge itself adds authentication. Anyone who can open the raw radio control stream can spend your airtime and change how the attached radio behaves.

## Choosing a radio preset {#the-8-firmware-presets}

Start with **Medium Fast (default)** for a balance of speed and reach. If you are
joining people who already use another preset, match their frequency and preset
instead. Check that messages get through in both directions before trying a
faster setting.

Faster presets mean shorter waits when the signal is good. Slower presets can
help messages get through when radios are farther apart or the signal is weak.
The range labels below are relative to these eight presets, using similar radios
and antennas in the same conditions. They are not estimates in miles or kilometres:
antenna placement, hills, buildings and interference can make a large difference.

| Preset | Approx. radio speed | Relative range | When to choose it |
|---|---:|---|---|
| Short Turbo | 21.9 kbit/s | Very short | Nearby radios with a strong signal, when you want the shortest waits. |
| Short Fast | 10.9 kbit/s | Short | Nearby radios when Short Turbo does not reach reliably. |
| Short Slow | 6.25 kbit/s | Short to medium | A little more reach than Short Fast, with longer waits. |
| **Medium Fast (default)** | **3.52 kbit/s** | **Medium** | **Start here for everyday messaging.** |
| Medium Slow | 1.95 kbit/s | Medium to long | Try this if messages are unreliable on Medium Fast and you can accept longer waits. |
| Long Turbo | 1.34 kbit/s | Long | Longer links when you want the fastest option in the Long group. |
| Long Fast | 1.07 kbit/s | Long | Longer links when the Medium presets do not reach reliably. |
| Long Moderate | 0.34 kbit/s | Very long | Weak or distant links where getting a message through matters more than speed. |

The speeds are calculated radio data rates, not measured message or file-transfer
speeds. Real transfers are slower because each message needs extra radio data,
and radios may have to wait or retry. “Turbo” means fastest within its group:
Long Turbo is still slower than Medium Slow.

These presets are shared by the app's RNode picker and handheld 2.3.4 Standalone
mode. New or reset settings use Medium Fast; existing saved settings are retained.
Older rsDeck, rsPager and rsCardputer releases used Long Fast as their default.

<details>
<summary>Technical settings for each preset</summary>

Use these values when comparing settings with another radio or entering them
manually. SF is spreading factor, BW is bandwidth, CR is coding rate, and TX is
transmit power.

| Preset | SF | BW (kHz) | CR | TX (dBm) |
|---|---:|---:|---|---:|
| Short Turbo | 7 | 500 | 4/5 | 14 |
| Short Fast | 7 | 250 | 4/5 | 14 |
| Short Slow | 8 | 250 | 4/5 | 14 |
| Medium Fast (default) | 9 | 250 | 4/5 | 17 |
| Medium Slow | 10 | 250 | 4/5 | 17 |
| Long Turbo | 11 | 500 | 4/8 | 22 |
| Long Fast | 11 | 250 | 4/5 | 22 |
| Long Moderate | 11 | 125 | 4/8 | 22 |

</details>

All eight handheld standalone presets use an **18-symbol preamble**. Coding rate
4/5 is entered as `5` in RNode configuration; 4/8 is entered as `8`. TX power
need not match between peers.

### Connecting to an EU868 handheld

For a handheld using **Europe + Medium Fast**, set the host's RNode interface to:

| Parameter | Value |
|---|---|
| Frequency | **868.000 MHz** (`868000000` Hz) |
| Bandwidth | **250 kHz** (`250000` Hz) |
| Spreading factor | **9** |
| Coding rate | **4/5** (`5`) |

The handheld preset also sets TX power to **17 dBm** and preamble to **18 symbols**.
Use the handheld's saved values if they were customized. Region selection sets
the frequency separately; changing the link preset does not change it. In RNode
mode, the connected host controls the radio settings.

## Tunable parameters

Presets are starting points. The underlying parameters Ratspeak writes to the RNode are:

- **Frequency** — center frequency in Hz. Must match the regional band, stay inside any sub-band restrictions, and ideally avoid channels heavily used by other LoRa traffic in your area.
- **Spreading factor (catalog range SF 5–12; hardware support varies)** — higher SF = greater sensitivity / range, exponentially longer airtime. Each increment doubles symbol duration at the same bandwidth; complete packet airtime also depends on payload, coding and preamble.
- **Bandwidth (presets use 125–500 kHz; custom values depend on hardware)** — wider BW = faster, less sensitive, more spectrum used. Narrow BW gains sensitivity (and range) at the cost of throughput, and is more vulnerable to oscillator drift between cheap radios.
- **Coding rate (4/5–4/8)** — forward error correction overhead. Higher coding overhead reduces the useful data rate.
- **TX power (typically 14–22 dBm)** — radio output. Cap depends on regional rules and the antenna gain you're feeding.
- **Preamble length** — symbols transmitted before each frame. Longer preambles use more airtime; use the value required by the firmware and receiving peers.

Frequency, spreading factor, bandwidth and packet format must be compatible. Matching presets is a useful starting point. In explicit-header mode, used by current handheld standalone firmware, the header communicates the payload coding rate; a different configured CR does not by itself establish incompatibility. TX power need not match. See Semtech’s [header explanation](https://www.semtech.com/design-support/faq/faq-lorawan) and [LoRa FAQ](https://www.semtech.com/design-support/faq/faq-lora) for the radio trade-offs.

## Regional bands

The region picker is a set of software defaults, not a radio authorization. Check the frequency, occupied bandwidth, power/EIRP, antenna and airtime rules for the place and radio service where you will transmit.

The exact handheld region defaults are **915000000 Hz** (Americas and Australia),
**868000000 Hz** (Europe / EU868), and **923000000 Hz** (Asia). The desktop/mobile
RNode picker also offers **433000000 Hz** (433 MHz / UHF); that is not a handheld
region preset and requires suitable radio hardware.

The handheld region picker sets a default center frequency without setting power
or airtime caps. The desktop/mobile RNode picker also prefills a long-window
airtime limit of **1%** for Europe; other regions leave it unset. These software
defaults do not establish compliance for your installation.

If the permitted settings are unclear, check your national regulator’s guidance before transmitting. A region label does not verify that a particular board, antenna or preset meets those rules.

## Airtime limits

For installations where you must stay under a regulatory duty cycle (notably the EU 868 MHz sub-bands), the RNode interface accepts two optional caps:

- **Long-window limit** — percent of a long rolling window the radio is allowed to transmit.
- **Short-window limit** — percent of a short rolling window the radio is allowed to transmit.

The app sends configured caps to compatible RNode firmware. They can delay outgoing traffic; inspect the reported airtime state when a radio stops sending. The setting does not certify regulatory compliance. Set them per-interface in the radio's advanced config; the Europe region prefills the long-window cap to **1%**, while short-window caps and other regions' long-window caps are unset by default. These are host-managed RNode settings, not handheld standalone region settings.

Leaving a cap unset sends no command for that limit; it does not explicitly clear a cap already on the radio.

Slower presets consume more airtime for a given payload. Choose a preset that provides a reliable link, and configure airtime limits independently.

## Multi-radio boards

Standalone rsReticulum supports `RNodeMultiInterface` for compatible multi-interface RNode firmware. Each configured sub-interface has its own virtual port and radio settings while sharing the physical serial endpoint.

The app’s normal Add LoRa Device flow configures an `RNodeInterface`; do not assume it automatically creates a multi-radio configuration. For a multi-interface installation, verify the firmware’s virtual-port layout and the selected daemon release’s configuration support. Use a single-radio setup until that mapping is established.

## Practical notes

- If two radios cannot exchange traffic, compare their saved frequency, preset and packet-format settings. A preset label alone does not verify compatibility.
- Antenna suitability, placement and obstructions matter alongside transmit power. Check the antenna and radio band together.
- A half-duplex radio cannot receive while it transmits. Overlapping transmissions can collide; a slower preset uses more airtime and can increase contention.
- LoRa is shared spectrum. Anyone in your area on the same channel sees your packets at the radio layer; private LXMF encryption protects message contents, but radio activity and some protocol metadata remain observable.
