
# SoundSend.

> Visit the web app at [soundsend.ml](https://www.soundsend.ml/)

## Share your Files using sound

SoundSend is a web based application that allows you to send and receive files to and from nearby devices through the help of sound waves.

![enter image description here](https://raw.githubusercontent.com/imsudip/sound_send_web/main/images/screengrab.png)
# How it  works
The Functionality is based on a Open Source Library [ggwave](https://github.com/ggerganov/ggwave)
This library allows you to communicate small amounts of data between air-gapped devices using sound. It implements a simple FSK-based transmission protocol that can be easily integrated in various projects. The bandwidth rate is between 8-16 bytes/sec depending on the protocol parameters. Error correction codes (ECC) are used to improve demodulation robustness.

This library is used only to generate and analyze the RAW waveforms that are played and captured from your audio devices (speakers, microphones, etc.). You are free to use any audio backend (e.g. PulseAudio, ALSA, etc.) as long as you provide callbacks for queuing and dequeuing audio samples.

> For more Details visit the Library itself
> [ggwave](https://github.com/ggerganov/ggwave)
# How the File Transmission works
Since the bandwidth/Data transmission rate through sound is capped at 8-16 bytes/sec depending on the protocol parameters. We can't use sound only to transfer the whole file. Instead the file is first uploaded to a anonymous cloud storage and then get the minimal encoded data (In our case the FileId and the File Name) that to be transferred between decives. 

We used [anonfiles](https://anonfiles.com/) for that which provides us with a REST API interface to upload the file.After uploading the file we fetch the file-id of the uploaded file and and filename and broadcast to nearby devices using sound. Upon receiving the data from the sender we do some processing to get the direct download URL of the file.

No user data is transferred during the whole process which makes it more seamless.
## Technical details

Below is a short summary of the modulation and demodulation algorithm used in `ggwave` for encoding and decoding data into sound.

### Modulation (Tx)

The current approach uses a multi-frequency [Frequency-Shift Keying (FSK)](https://en.wikipedia.org/wiki/Frequency-shift_keying) modulation scheme. The data to be transmitted is first split into 4-bit chunks. At each moment of time, 3 bytes are transmitted using 6 tones - one tone for each 4-bit chunk. The 6 tones are emitted in a 4.5kHz range divided in 96 equally-spaced frequencies:

| Freq, [Hz]   | Value, [bits]   | Freq, [Hz]   | Value, [bits]   | ... | Freq, [Hz]   | Value, [bits]   |
| ------------ | --------------- | ------------ | --------------- | --- | ------------ | --------------- |
| `F0 + 00*dF` | Chunk 0: `0000` | `F0 + 16*dF` | Chunk 1: `0000` | ... | `F0 + 80*dF` | Chunk 5: `0000` |
| `F0 + 01*dF` | Chunk 0: `0001` | `F0 + 17*dF` | Chunk 1: `0001` | ... | `F0 + 81*dF` | Chunk 5: `0001` |
| `F0 + 02*dF` | Chunk 0: `0010` | `F0 + 18*dF` | Chunk 1: `0010` | ... | `F0 + 82*dF` | Chunk 5: `0010` |
| ...          | ...             | ...          | ...             | ... | ...          | ...             |
| `F0 + 14*dF` | Chunk 0: `1110` | `F0 + 30*dF` | Chunk 1: `1110` | ... | `F0 + 94*dF` | Chunk 5: `1110` |
| `F0 + 15*dF` | Chunk 0: `1111` | `F0 + 31*dF` | Chunk 1: `1111` | ... | `F0 + 95*dF` | Chunk 5: `1111` |

For all protocols: `dF = 46.875 Hz`. For non-ultrasonic protocols: `F0 = 1875.000 Hz`. For ultrasonic protocols: `F0 = 15000.000 Hz`.

The original data is encoded using [Reed-Solomon error codes](https://github.com/ggerganov/ggwave/blob/master/src/reed-solomon). The number of ECC bytes is determined based on the length of the original data. The encoded data is the one being transmitted.

### Demodulation (Rx)

Beginning and ending of the transmission are marked with special sound markers . The receiver listens for these markers and records the in-between sound data. The recorded data is then Fourier transformed to obtain a frequency spectrum. The detected frequencies are decoded back to binary data in the same way they were encoded.

Reed-Solomon decoding is finally performed to obtain the original data.



