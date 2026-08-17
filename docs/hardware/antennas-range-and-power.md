---
sidebar_position: 3
---

# Antennas, range and power

The antenna is the single most important factor for LoRa range. A better antenna improves both transmit distance and receive sensitivity.

## Antenna Types

| Type | Gain | Pattern | Best For |
|------|------|---------|----------|
| **Stub / rubber duck** | 0-2 dBi | Omnidirectional | Included with boards, basic testing |
| **1/4 wave ground plane** | 2-3 dBi | Omnidirectional | Fixed stations, simple to build |
| **Collinear** | 5-8 dBi | Omnidirectional | Fixed stations, best all-around coverage |
| **Yagi** | 8-15 dBi | Directional | Point-to-point links, maximum range |
| **Dipole** | 2 dBi | Omnidirectional | Compact, good for indoor/portable |

### Frequency Matching

Your antenna must be tuned for your operating frequency:

| Band | Antenna Label |
|------|--------------|
| 433 MHz | 433 MHz antenna |
| 868 MHz | 868 MHz or 900 MHz antenna |
| 915 MHz | 915 MHz or 900 MHz antenna |

> **Warning**: Never transmit without an antenna connected. Operating a LoRa radio with no antenna (or a mismatched antenna) can permanently damage the radio module.

### Connectors

Most RNode-compatible boards use **SMA** or **U.FL/IPEX** connectors:

- **SMA** - larger, threaded, more durable. Common on T-Beam, LoRa32.
- **U.FL / IPEX** - tiny snap-on connector on smaller boards. Use a U.FL-to-SMA pigtail for external antennas.

## Range by Terrain

| Scenario | Typical Range | Notes |
|----------|--------------|-------|
| **Urban, indoor** | 0.5-2 km | Buildings absorb signal heavily |
| **Urban, rooftop** | 2-10 km | Line-of-sight helps significantly |
| **Suburban** | 5-15 km | Mix of clear and obstructed paths |
| **Rural, flat terrain** | 10-30 km | Near line-of-sight |
| **Hilltop to hilltop** | 20-50+ km | Clear line-of-sight, elevation advantage |
| **Mountain peak** | 50-100+ km | Extreme range with directional antennas |

### What Improves Range

- Higher antenna placement (elevation is the single biggest factor)
- Higher-gain antenna
- Clear line-of-sight to target
- Higher TX power (up to legal limits)

### What Reduces Range

- Buildings, trees, and terrain between nodes
- Indoor placement
- Antenna mismatched to frequency

For spreading factor and bandwidth trade-offs, see [LoRa Radio Interfaces](../networking/lora-and-rnode.md).

## Transmit Power

TX power is set in dBm (decibels relative to 1 milliwatt):

| dBm | Milliwatts | Use Case |
|-----|-----------|----------|
| 2 | 1.6 mW | Very short range, battery saving |
| 7 | 5 mW | Short range, low power |
| 10 | 10 mW | Moderate range |
| 14 | 25 mW | Fast preset |
| 17 | 50 mW | Balanced preset |
| 20 | 100 mW | Near maximum |
| 22 | 160 mW | Maximum for most boards |

Doubling TX power adds only ~3 dB (marginally more range). Improving your antenna or raising its height is almost always more effective than increasing power.

## Regulatory Compliance

LoRa operates on **ISM bands** (Industrial, Scientific, Medical) - unlicensed but regulated:

| Region | Band | Key Rules |
|--------|------|-----------|
| **US (FCC)** | 915 MHz | Power/channel rules apply (FCC Part 15.247); no duty-cycle limit |
| **EU (ETSI)** | 868 MHz | ETSI EN 300 220-2 Table 4: 25 mW e.r.p. and 1 % duty cycle per hour in 865–868.6 MHz; 869.4–869.65 MHz allows 500 mW e.r.p. at 10 %; other sub-bands are 0.1 % |
| **EU** | 433 MHz | ETSI EN 300 220-2 Table 4 row H: 10 mW e.r.p. and 10 % duty cycle per hour in 433.05–434.79 MHz |

For the Europe region (868.0 MHz default), Ratspeak prefills the published hourly duty cycle for that sub-band:

```ini
airtime_limit_long = 1.0
```

The figure is the regulation's, not a rule of thumb: the duty cycle is the cumulative on-time over one hour (EN 300 220-2 clause 4.4.3.2). No short-term cap is prefilled because none is published; you can still set `airtime_limit_short` per interface. If you move to another sub-band (for example 869.525 MHz), adjust the cap to that sub-band's limit. Reticulum then rate-limits transmissions against the configured caps. That does not replace checking the exact sub-band, antenna gain, and power rules for your country.

> **Warning**: Verify the legal frequency band and power limits for your country before transmitting. ISM bands are unlicensed but usage rules vary by jurisdiction.

## Optimizing Your Setup

**For maximum range:** mount a collinear or Yagi antenna as high as possible, set TX power to the maximum legal limit, and ensure clear line-of-sight. Use a long-range LoRa preset. See [LoRa Radio Interfaces](../networking/lora-and-rnode.md) for preset details.

**For best throughput:** use a fast LoRa preset and accept shorter range in exchange for ~11 Kbps. Good for local networks where range is not the priority.

**For battery life:** use the lowest TX power that maintains your connection, disable WiFi on rsDeck/rsCardputer when not needed, and use a balanced or fast preset to minimize airtime per packet.
