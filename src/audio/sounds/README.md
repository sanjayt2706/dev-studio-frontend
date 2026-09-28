# Dev Studio Audio SFX Directory

This directory is the dedicated location for custom UI sound effect assets for the Dev Studio website.

## Default Architecture
The website includes a **built-in procedural Web Audio API synthesizer** in `src/audio/AudioManager.js`.
It generates pristine, zero-latency micro-sounds without requiring any audio downloads.

## Adding Custom Sound Files
To override procedural synthesis with custom `.mp3` sound files, place your files here with the exact filenames listed below:

| Sound Filename | Interaction Trigger | Recommended Duration | Recommended Format |
| :--- | :--- | :--- | :--- |
| `nav-hover.mp3` | Hovering over desktop navigation links | 15ms - 25ms | MP3, 44.1kHz, 128kbps, Stereo/Mono |
| `button-hover.mp3` | Hovering over primary buttons / CTAs | 20ms - 35ms | MP3, 44.1kHz, 128kbps, Stereo/Mono |
| `button-click.mp3` | Clicking any interactive button or link | 25ms - 45ms | MP3, 44.1kHz, 128kbps, Stereo/Mono |
| `menu-open.mp3` | Opening the mobile fullscreen menu | 80ms - 140ms | MP3, 44.1kHz, 128kbps, Stereo/Mono |
| `menu-close.mp3` | Closing the mobile fullscreen menu | 70ms - 120ms | MP3, 44.1kHz, 128kbps, Stereo/Mono |
| `card-hover.mp3` | Hovering over project / team cards | 25ms - 40ms | MP3, 44.1kHz, 128kbps, Stereo/Mono |
| `page-transition.mp3`| Navigating between pages | 120ms - 200ms| MP3, 44.1kHz, 128kbps, Stereo/Mono |
| `success.mp3` | Successful form submission / Admin CRUD | 180ms - 280ms| MP3, 44.1kHz, 128kbps, Stereo/Mono |

## Audio Guidelines
- **Restraint**: Keep volumes subtle (-18dB to -24dB LUFS equivalent).
- **Tactile**: Prefer soft clicks, high-pass micro ticks, and warm resonant pulses.
- **Autoplay Safe**: Audio only triggers after initial user interaction.
