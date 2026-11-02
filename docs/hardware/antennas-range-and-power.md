---
sidebar_position: 3
---

# Antennas, range and power

A working LoRa link depends on both radios, their antennas, the path between them
and the radio settings. A board's advertised range is not a coverage guarantee
for your installation. Test the route where you intend to use it.

## Choose a suitable antenna

Check the antenna's specified frequency range against your operating frequency.
A label such as “900 MHz” is not enough to establish that it works well at both
868 and 915 MHz. The radio board must also support the chosen band.

Check the connector on both ends, including its center contact. SMA and RP-SMA
are different; matching threads alone do not establish a correct connection.
For a board with a small snap-on antenna socket, use the matching cable assembly
and avoid pulling on the cable or twisting the socket.

Attach the antenna before transmitting. Do not transmit with the antenna removed
or a damaged feed cable.

| Antenna arrangement | What to consider |
| --- | --- |
| A short antenna fitted to a handheld | Convenient to carry; your hand, body and nearby metal can change its performance. |
| An outdoor omnidirectional antenna | Useful for peers in several directions. Check its radiation pattern, mounting requirements and cable loss. |
| A directional antenna | Useful for a fixed link when you can aim it at the other site. It provides less coverage in other directions. |

Higher gain concentrates radiation into particular directions; it does not
improve coverage equally everywhere. Choose the pattern for the locations you
need to reach, not just the largest dBi number. RAK's
[antenna-gain explanation](https://news.rakwireless.com/antenna-gain-explained-what-dbi-actually-means-for-your-iot-network/)
shows this tradeoff.

## Placement and range

Start with two devices that work at a short distance, then test the intended
locations. Keep their radio settings matched as described in
[LoRa and RNode](../networking/lora-and-rnode.md).

- Move antennas clear of nearby metal and obstructions. Compare a window,
  an outdoor position and a higher position before changing radio settings.
- Keep the antennas' orientation consistent. For ordinary vertical whips, start
  with both upright.
- Check both directions: receiving a peer's announce does not prove that the
  peer can receive your messages.
- Record the antenna, location, radio settings and delivery results. Change one
  thing at a time so you can tell what helped.

Hills, buildings, vegetation, interference and antenna placement can all change
coverage. A successful test from a hilltop does not establish the range of the
same equipment at street level. Long antenna cables also lose signal; use a
cable specified for your frequency and account for its length.

For the underlying antenna principles, see STMicroelectronics'
[antenna selection guidelines](https://www.st.com/resource/en/application_note/dm00068254-antenna-selection-guidelines-stmicroelectronics.pdf).

## Transmit power

Transmit power is commonly shown in dBm. These are power conversions, not
recommended settings or permitted limits:

| Power | Approximate milliwatts |
| --- | --- |
| 10 dBm | 10 mW |
| 14 dBm | 25 mW |
| 17 dBm | 50 mW |
| 20 dBm | 100 mW |
| 22 dBm | 158 mW |

More transmit power does not fix a mismatched antenna, an incompatible radio
setting or a peer that cannot send a reply. It can also increase the demand on
the power supply. Check those causes before raising it.

Use settings permitted for your country, frequency, equipment and antenna.
A region preset is a starting configuration, not a certification that your
installation meets local radio rules. Check the applicable regulator's limits
on frequency, radiated power and channel use. Antenna gain and cable loss matter
when a limit is expressed as radiated power rather than transmitter output.

## When a link is unreliable

First confirm the board revision, antenna band and connections. Then compare
frequency, bandwidth, spreading factor, coding rate and preamble at both ends.
Test with a stable power supply and a clear path before increasing range.

If a slower radio preset improves delivery, allow for its longer airtime and
lower throughput. Keep messages short during testing. See
[LoRa and RNode](../networking/lora-and-rnode.md) for settings and
[troubleshooting](../reference/troubleshooting.md) for connection failures.
