<div align="center">

<img src="Youtube_Music_icon.svg.webp" alt="YouTube Music Discord RPC Logo" width="100" height="100" />

# YouTube Music Discord Rich Presence

A lightweight, high-performance browser extension (Manifest V3) paired with a local Native Messaging Host (Node.js) that seamlessly broadcasts your active YouTube Music playback directly to Discord Desktop Rich Presence in real-time.

[![GitHub License](https://img.shields.io/github/license/Taufiqu/discordRPC?style=for-the-badge&logo=opensourceinitiative&logoColor=white&color=blue)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/Taufiqu/discordRPC?style=for-the-badge&logo=github&color=34d058)](https://github.com/Taufiqu/discordRPC/releases)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20Windows-blueviolet?style=for-the-badge&logo=linux&logoColor=white)](#)
[![Browsers](https://img.shields.io/badge/Browsers-Firefox%20%7C%20Chromium-ff7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](#)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success?style=for-the-badge&logo=googlechrome&logoColor=white)](#)

</div>

---

## 🌟 Key Features

- 🎵 **Full Track Details**: Displays song title, artist, album name, and high-resolution album artwork dynamically.
- ⏱️ **Real-Time Timeline Synchronization**: Accurately synchronizes elapsed time and remaining duration with Discord's native media timestamps.
- ⏸️ **Smart Pause Detection**: Automatically clears the active status or resets presence timers upon pause, preventing annoying "ghost stopwatch" counters when playback stops.
- 🚀 **Zero Standalone Daemons**: Uses native browser messaging to launch the lightweight Node.js IPC bridge on-demand. No heavy 24/7 background servers required.
- 🔒 **100% Local & Privacy-Respecting**: All communication occurs directly on your local machine via stdio IPC (`/tmp/discord-ipc-0` on Linux or named pipes on Windows). No analytics or remote telemetry.
- 🌐 **Cross-Browser & Multi-Platform**: Native support for **Mozilla Firefox**, **Google Chrome**, **Brave**, **Microsoft Edge**, and other Chromium variants across **Linux** and **Windows**.

---

## 🚀 Installation & Setup

Choose your preferred path below. For complete step-by-step instructions, see the **[Detailed Installation Guide](docs/INSTALLATION.md)**.

### 👤 Option A: General User Installation (No Git / Coding Needed)

1. **Install Extension:**
   - **Firefox:** Download the signed `.xpi` file from [Releases](https://github.com/Taufiqu/discordRPC/releases) and drag-and-drop it into Firefox (or install directly from Firefox Add-ons).
   - **Chromium (Chrome / Brave / Edge):** Download `extension.zip` from [Releases](https://github.com/Taufiqu/discordRPC/releases), unpack it, and load it via `chrome://extensions` (Developer Mode ➔ Load unpacked).
2. **Register the Local Discord Bridge:**
   - Download the bridge files from [Releases](https://github.com/Taufiqu/discordRPC/releases).
   - **Windows:** Double-click `register_host.bat`.
   - **Linux:** Run `./register_host.sh` in terminal.
3. **Play Music:**
   - Make sure Discord Desktop is open and your activity status is enabled.
   - Open [music.youtube.com](https://music.youtube.com/) and play your favorite tracks!

👉 **[Read Full User Guide](docs/INSTALLATION.md#-method-a-general-user-installation-recommended)**

---

### 💻 Option B: Developer & Manual Setup

For developers who want to modify code, build locally, or contribute:

```bash
# 1. Clone repository
git clone https://github.com/Taufiqu/discordRPC.git
cd discordRPC

# 2. Install host dependencies & register bridge
cd host
npm install

# Linux:
chmod +x register_host.sh host.sh && ./register_host.sh

# Windows (PowerShell):
powershell -ExecutionPolicy Bypass -File register_host.ps1

# 3. Load extension in Developer Mode
# - Firefox: about:debugging -> Load Temporary Add-on -> select extension/manifest.json
# - Chrome/Brave/Edge: chrome://extensions -> Developer Mode -> Load unpacked -> select extension/
```

👉 **[Read Full Developer Guide](docs/INSTALLATION.md#-method-b-developer--manual-installation)**

---

## 🏗️ Architecture & How It Works

```
┌─────────────────────────────────┐
│     YouTube Music Web Tab       │
│  (DOM + MediaSession Extractor) │
└────────────────┬────────────────┘
                 │ (DOM events / tick updates)
                 ▼
┌─────────────────────────────────┐
│   Extension Background Worker   │
│       (Manifest V3 / MV2)       │
└────────────────┬────────────────┘
                 │ (Native Messaging stdio pipe)
                 ▼
┌─────────────────────────────────┐
│   Local Native Host (Node.js)   │
│  (Discord IPC Protocol Handler) │
└────────────────┬────────────────┘
                 │ (Local IPC Socket / Named Pipe)
                 ▼
┌─────────────────────────────────┐
│      Discord Desktop Client     │
│   "Listening to YouTube Music"  │
└─────────────────────────────────┘
```

---

## 📁 Repository Structure

```
discordRPC/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Structured issue templates for bugs and features
│   └── workflows/
│       └── build-and-sign.yml # CI/CD for automated AMO signing & release builds
├── docs/
│   └── INSTALLATION.md        # Comprehensive installation guide (User & Dev)
├── extension/                 # Browser Extension (Manifest V3)
│   ├── background/
│   │   └── service_worker.js  # Manages Native Host lifecycle & message relay
│   ├── content/
│   │   └── ytmusic.js         # Scrapes DOM playback state & track metadata
│   ├── popup/                 # Interactive status popup UI
│   ├── icons/                 # Extension toolbar & browser icons
│   └── manifest.json          # Web Extension manifest
├── host/                      # Native Messaging Host (Node.js)
│   ├── src/
│   │   ├── discord_client.js  # Discord IPC presence manager
│   │   ├── native_protocol.js # Stdio framing buffer parser (uint32 LE)
│   │   └── index.js           # Host process entrypoint
│   ├── manifests/             # Native messaging manifests
│   ├── register_host.sh       # Linux setup script
│   ├── register_host.ps1      # Windows PowerShell setup script
│   ├── register_host.bat      # Windows batch helper
│   ├── unregister_host.sh     # Linux removal script
│   └── unregister_host.ps1    # Windows PowerShell removal script
├── package_extension.py       # Helper for packaging release zip archives
├── CONTRIBUTING.md            # Guidelines for open-source contributors
├── LICENSE                    # MIT License
└── README.md                  # Project documentation
```

---

## ❓ Troubleshooting & FAQ

<details>
<summary><b>1. Rich Presence is not appearing on my Discord profile</b></summary>

- Ensure the **Discord Desktop application** is running.
- In Discord, verify that **Settings ➔ Activity Privacy ➔ "Display current activity as a status message"** is toggled **ON**.
- Check if Discord is running under a sandboxed container (like Flatpak or Snap on Linux). Discord Flatpak may need access to the IPC socket located in `/tmp` or `$XDG_RUNTIME_DIR`.
- Click the extension icon in your browser toolbar to confirm the connection state displays **Connected**.
</details>

<details>
<summary><b>2. Extension popup says "Disconnected"</b></summary>

- Ensure Node.js is installed and accessible in your system `PATH` (`node -v`).
- Re-run the registration script (`./host/register_host.sh` on Linux or `register_host.bat` on Windows) to verify host manifest paths point to valid executable locations.
- Verify that `host/node_modules` exists by running `npm install` inside the `host/` folder.
</details>

<details>
<summary><b>3. Timers or song durations are desynced</b></summary>

- The extension tracks HTML5 video progress directly from YouTube Music. If you scrub through a track or adjust playback speed, the extension automatically recalibrates timestamps within 1–2 seconds.
</details>

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for details on our workflow, issue templates, and submission guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) &copy; 2026 Taufiqu. Feel free to use, modify, and distribute this software in accordance with the license terms.
