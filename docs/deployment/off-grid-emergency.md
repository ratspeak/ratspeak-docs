---
sidebar_position: 4
---

# Off-grid and emergency

A local LoRa network can carry short messages where internet or cellular service is unavailable. Its usefulness depends on coverage, power, compatible settings and practice with the actual equipment. Treat it as one communication method in your plan, with agreed fallback procedures when messages do not arrive.

## When to use this

Use this pattern for field exercises, remote worksites, expeditions or local preparedness. Keep traffic short: status, meeting points and concise instructions. A radio path that carries text may be unsuitable for attachments, games or live voice.

Agree in advance on who should receive a message, how they acknowledge it and when the sender should use another method. A sent indicator, a discovered peer or a propagation-node receipt is not proof that a person has read the message.

## Hardware

Each participant needs either:

- A supported [Ratspeak Handheld](../hardware/handheld-guide.md) device in standalone mode, with the radio hardware required by that board.
- A phone or computer running Ratspeak, connected to a compatible RNode over USB, Bluetooth or a local TCP bridge supported by that host and radio.

For participants outside direct radio range, add a properly placed transport node with an RNode, reliable power and transport enabled. A bare RNode controlled by a host is a radio interface; forwarding is performed by the host's Reticulum stack.

Do not assume every handheld has the same relay, Wi-Fi bridge or RNode modes. Check the released firmware and [supported-board guide](../hardware/rnode-and-supported-boards.md), then test the chosen mode before deployment.

## Power budget

Measure the entire kit with its intended display, radio, host and connection settings. Transmit power, message rate, screen use, Bluetooth/Wi-Fi and sleep behavior all change consumption. Battery labels alone do not establish runtime.

For an always-on installation, estimate daily energy from measured average power: watts × 24 hours gives watt-hours per day. Allow for conversion losses, usable battery capacity, temperature and the period you must operate without charging. Size solar charging using local seasonal conditions and measured recovery after poor weather.

Carry suitable charging cables and a spare power source. Test restart after an exhausted battery. Switching a relay off to save power can disconnect everyone relying on it; decide which nodes must remain available.

## Picking a LoRa preset

Match frequency, bandwidth, spreading factor and coding rate across the group. Use the actual values in the [LoRa guide](../networking/lora-and-rnode.md) and your device's settings; a preset name alone may not mean the same thing across firmware.

Test short messages at the intended locations with the expected number of users. Slower settings use more airtime and may worsen congestion even when they improve a marginal radio link. If settings change, coordinate the change across every participant and relay.

## Frequency and regs

Check the rules for the country and location where the radios will transmit. Hardware sold as “868 MHz” or “915 MHz” does not establish permission for every frequency, power, antenna or duty cycle. For example, the UK's [short-range device guidance](https://www.ofcom.org.uk/spectrum/radio-equipment/short-range-devices) points to the conditions that apply there; other countries have their own requirements.

Prepare configurations before crossing borders. Keep the permitted operating parameters with the kit, and use an antenna appropriate to the radio and band.

## Setting up a transport node

On the host running rsReticulum, enable transport in its chosen configuration:

```ini
[reticulum]
  enable_transport = yes
```

This is only the transport setting, not a complete configuration. Add the working RNode interface with the group's radio parameters as shown in [Community mesh](community-mesh.md#setting-up-a-gateway-node). An internet backhaul is optional; leave it out for a radio-only network.

Place the antenna where the intended participants have usable paths, and test the complete route. To check that the relay contributes, compare results with it available and unavailable during a planned test. Do not infer coverage solely from its height or a signal indicator.

## Locking the mesh with IFAC

IFAC can restrict participation on an interface when all devices support and use matching settings. Decide whether the deployment needs that restriction or needs to interoperate with an open local network. Make that decision before an incident.

On a standalone host, add the chosen `networkname` and `passphrase` to the already working RNode interface. Do not replace its frequency, bandwidth, spreading factor or other required settings with an incomplete IFAC-only block. Use the appropriate controls for each handheld's firmware and mode.

Distribute the secret privately and keep a recovery plan for a forgotten or mistyped value. IFAC does not hide transmissions, prevent jamming or guarantee availability. A lost device may expose the shared secret; rotating it requires updating all affected interfaces.

## Field tips

- Exchange and verify contact addresses before leaving. Save contacts while you have time to check a successful round trip.
- Walk the intended area with the actual kit. Record gaps, message delays and where a relay is needed.
- Label devices, charging cables and the agreed radio configuration.
- Keep messages short and wait for the relevant delivery or human acknowledgment before assuming success.
- Test restart, a lost connection and the fallback communication procedure during an exercise.

Use [Troubleshooting](../reference/troubleshooting.md) for failures. Preserve identities and configuration while diagnosing; resetting them does not repair a missing radio path.
