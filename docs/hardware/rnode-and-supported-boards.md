---
sidebar_position: 1
---

# RNode and supported boards

An RNode is a radio interface for a host running Reticulum, such as the Ratspeak
app. The host handles the network and messages; the RNode sends and receives
radio packets. RNode is an open system implemented on several boards, not one
particular manufacturer's device. See the upstream
[RNode overview](https://reticulum.network/manual/hardware.html#rnode).

RNode uses LoRa radio modulation without LoRaWAN. A LoRaWAN gateway or sensor is
not automatically an RNode: it needs compatible hardware and RNode firmware.

## Radio for a host, or standalone messenger?

Choose an **RNode** if you want to add a LoRa connection to an app or computer.
Choose a **Standalone** handheld if you want to read and send messages on the
device itself. Ratspeak Handheld's **Full** package includes both modes and a
launcher for switching between them.

The **Ratspeak Handheld v2.3.4** release provides these images:

| Device | Released modes | Hardware detail |
| --- | --- | --- |
| LilyGO T-Deck Plus | Full, Standalone, RNode | Use the image for T-Deck Plus. |
| LilyGO T-Pager | Full, Standalone, RNode | The released target uses the SX1262 radio. |
| M5Stack Cardputer Adv | Full, Standalone, RNode | LoRa requires the Cap LoRa-1262 module. |
| ThinkNode M9 | Standalone | This release has no M9 Full or RNode image. |

The [release downloads](https://github.com/ratspeak/ratspeak-handheld/releases/tag/v2.3.4)
and [flashing guide](./flashing-firmware.md) identify each package. Do not use an
image for a similarly named board or substitute an older rsDeck, rsPager or
rsCardputer image in the current installation procedure.

## Other RNode boards

Upstream RNode firmware has its own device support and release list. Use its
[automated installer](https://github.com/markqvist/RNode_Firmware#getting-started-fast)
or the **RNode** tab on the
[Ratspeak advanced flasher](https://ratspeak.org/flash.html) to check the exact
variant. Select the board revision and hardware band; do not choose by the
radio chip name alone.

For Heltec LoRa32, follow the [browser tutorial](/tutorials/webinstaller-flashing/heltec-lora32)
or [rnodeconf tutorial](/tutorials/flashing-from-source/heltec-lora32).
Upstream labels its Heltec firmware experimental, so a listed installer target
should not be read as a production qualification.

Before choosing hardware, check:

- **Exact model and revision:** firmware and pin assignments can differ between
  revisions of the same product.
- **Radio band and antenna:** both must cover the frequency you intend to use.
- **Host connection:** confirm the firmware and your host platform support the
  intended USB, Bluetooth or network connection.
- **Power and enclosure:** include the cable, battery or supply and the physical
  protection needed at the installation site.

Price and quoted maximum range do not establish whether a board will work in
your location. See [antennas, range and power](./antennas-range-and-power.md).

## Connect an RNode to Ratspeak

On a host that supports USB serial, use a USB data cable for a first connection and close any flasher or serial
monitor that has the port open. A handheld must be running **RNode** mode when
used as the host's USB/BLE radio.

Add an RNode interface in the app, select its connection and configure the radio
for the other nodes you intend to reach. Follow
[LoRa and RNode](../networking/lora-and-rnode.md) for the complete setup and
matching radio parameters. A successful serial connection alone does not prove
radio reachability; announce and exchange a message with a known peer.
