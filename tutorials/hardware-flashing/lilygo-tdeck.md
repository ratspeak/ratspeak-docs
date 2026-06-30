---
sidebar_position: 1
sidebar_label: LilyGO T-Deck Plus
---

# Flashing the T-Deck Plus

This section provides step-by-step instructions for flashing the [LilyGO T-Deck Plus](https://lilygo.cc/en-ca/products/t-deck-plus-1) with Ratspeak using the web-based installer.


## Preparation

In order to begin, you will need:

- LilyGO T-Deck Plus device
- USB-C data transfer cable
- A computer with an appropriate browser


In order to use the web flasher, you must be using a browser that supports WebSerial (Firefox 151+, Chrome, Opera, or Edge) in order to detect and connect with the board.

:::warning
If this is the first time using the T-Deck Plus, ensure that the antenna is attached before powering it on, as using the device without it can damage the radio receiver.
:::

## Getting started

1. Navigate over to the [Ratspeak download page](https://ratspeak.org/download.html).

2. Select the T-Deck Plus from the available hardware options presented and select 'Flash in browser'.

## Connecting the T-Deck Plus

1. With your T-Deck Plus' main power switched off, connect it to your computer via a data transfer capable USB-C cable.

2. Press on the trackball until you hear a click, and hold it.

3. Turn on the main power of your device while continuing to hold the trackball for three seconds, then release the trackball. Note that the screen will be black, as it has been booted in 'download mode'; it will still be detectable by your computer.

## Flashing

1. On the T-Deck Plus download page, click '**Select USB Device**'. A menu will appear prompting you to select the proper device. Pair the T-Deck Plus; depending on the system hardware, it may have a variety of names.

2. It is recommended to also turn on **full erase** under advanced options.

:::note
For new users, it is advised to simply use the Full installation. This will provide access to a launcher page to select between booting in either Standalone or RNode modes.
:::

3. Click **Flash**. The installation process will now commence.

4. A successful flash will produce the below output:

![Complete flash](/img/tutorial/td_complete.png)

5. Simply reboot your device using the button on the left side of the T-Deck Plus. Ratspeak should boot up in a few seconds.

:::tip[Congratulations, you're now a Ratspeak user!]
Questions? Reach out in the **#documentation** channel on our [Discord](https://ratspeak.org/discord).
:::
