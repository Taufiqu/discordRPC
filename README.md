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

## 🚀 Quick Installation

### Step 1: Install the Extension
- **Mozilla Firefox:** Download the signed `.xpi` file from the [Releases](https://github.com/Taufiqu/discordRPC/releases) page and drag-and-drop it into Firefox (or install via Firefox Add-ons).
- **Chromium (Chrome / Brave / Edge):** Download `youtube_music_discord_rpc-chromium-*.zip` from [Releases](https://github.com/Taufiqu/discordRPC/releases), extract it, and load it via `chrome://extensions` (Enable **Developer Mode** ➔ click **Load unpacked**).

### Step 2: Install the Discord Bridge (1-Line Command)
Open your terminal and paste one command to automatically download, install dependencies, and register the bridge:

#### 🪟 Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/Taufiqu/discordRPC/main/install.ps1 | iex
```

#### 🐧 Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/Taufiqu/discordRPC/main/install.sh | bash
```

> **Prefer manual zip download?** Download `discord_rpc_host-*.zip` from [Releases](https://github.com/Taufiqu/discordRPC/releases), extract it, and double-click `register_host.bat` (Windows) or execute `./register_host.sh` (Linux).

👉 *Need more details or manual developer instructions? See the **[Detailed Installation Guide](docs/INSTALLATION.md)**.*

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
│       └── build-and-sign.yml # CI/CD for automated AMO signing & GitHub releases
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
├── install.sh                 # 1-liner Linux installer
├── install.ps1                # 1-liner Windows installer
├── uninstall.sh               # 1-liner Linux uninstaller
├── uninstall.ps1              # 1-liner Windows uninstaller
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
- Re-run the installer or registration script to verify host manifest paths point to valid executable locations.
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
