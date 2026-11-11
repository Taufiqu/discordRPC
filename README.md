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

## 📋 Prerequisites

Before installing, make sure your system meets the following requirements:

1. **[Node.js](https://nodejs.org/)** (v18.0.0 or higher recommended).
2. **Discord Desktop Client** (Discord Stable, PTB, or Canary).
   > *Note:* Discord Web in a browser cannot receive local IPC Rich Presence events. The native Discord desktop app must be running.
3. **Discord Activity Settings Enabled**:
   - Open Discord ➔ **User Settings** (⚙️) ➔ **Activity Privacy**.
   - Enable **"Display current activity as a status message"**.

---

## 🚀 Quick Start & Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Taufiqu/discordRPC.git
cd discordRPC
```

---

### Step 2: Register Native Messaging Host

The Native Messaging Host connects your browser to Discord's local socket. Automated registration scripts are provided for both Linux and Windows.

#### 🐧 On Linux:
Run the automated bash registration script:
```bash
chmod +x host/register_host.sh host/host.sh
./host/register_host.sh
```
*This installs required `npm` dependencies, resolves absolute script paths, and registers host manifests for Firefox, Google Chrome, Chromium, Brave, and Edge.*

#### 🪟 On Windows:
Right-click `host/register_host.bat` and select **Run as Administrator**, or execute via PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File host/register_host.ps1
```
*This updates the manifest paths and registers the necessary keys into `HKCU:\Software\` registry hives.*

---

### Step 3: Install the Browser Extension

#### 🦊 Mozilla Firefox:

- **Option A: Official Release / Signed XPI (Recommended)**
  1. Go to the [Releases](https://github.com/Taufiqu/discordRPC/releases) page.
  2. Download the latest `youtube_music_discord_rpc-x.x.x.xpi`.
  3. Drag and drop the `.xpi` file into Firefox, or visit `about:addons` ➔ click the gear icon (⚙️) ➔ **Install Add-on From File...**.

- **Option B: Temporary Developer Load**
  1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
  2. Click **Load Temporary Add-on...**.
  3. Select the `extension/manifest.json` file.

#### 🌐 Google Chrome / Brave / Edge (Chromium):

1. Open your browser's extension management page:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** in the top-left toolbar.
4. Select the `extension/` folder inside this repository.

---

## 📁 Repository Structure

```
discordRPC/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Structured issue templates for bugs and features
│   └── workflows/
│       └── build-and-sign.yml # CI/CD for automated AMO signing & release builds
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
- Re-run the registration script (`./host/register_host.sh` on Linux or `register_host.ps1` on Windows) to verify host manifest paths point to valid executable locations.
- Verify that `host/node_modules` exists by running `npm install` inside the `host/` folder.
</details>

<details>
<summary><b>3. Timers or song durations are desynced</b></summary>

- The extension tracks HTML5 video progress directly from YouTube Music. If you scrub through a track or adjust playback speed, the extension automatically recalibrates timestamps within 1–2 seconds.
</details>

---

## 🧹 Uninstallation

To remove the native messaging host registration from your system:

- **Linux:**
  ```bash
  chmod +x host/unregister_host.sh
  ./host/unregister_host.sh
  ```
- **Windows:**
  Run `host/unregister_host.bat` or run in PowerShell:
  ```powershell
  powershell -ExecutionPolicy Bypass -File host/unregister_host.ps1
  ```
- Then remove the extension from your browser's Add-ons / Extensions page.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for details on our workflow, issue templates, and submission guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) &copy; 2026 Taufiqu. Feel free to use, modify, and distribute this software in accordance with the license terms.
