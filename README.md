# YouTube Music Discord Rich Presence (RPC)

A lightweight, seamless browser extension (Manifest V3) and Native Messaging Host (Node.js) that connects YouTube Music playback to your Discord Desktop Rich Presence in real-time with zero 24/7 server requirements.

![Discord Rich Presence Preview](Youtube_Music_icon.svg.webp)

---

## 🌟 Features

- **Rich Presence Integration**: Shows track title, artist, album, and high-res cover art.
- **Accurate Timeline Sync**: Matches song start/end time directly on Discord.
- **Smart Pause & Play Handling**: Instantly clears presence on pause to avoid ghost stopwatch timers; immediately resumes on play.
- **Native Messaging Host (Auto-Spawn)**: Spawns the local Node.js IPC bridge seamlessly via browser without opening manual terminals.
- **Cross-Browser Support**: Mozilla Firefox, Google Chrome, Microsoft Edge, Brave.
- **Automated CI/CD**: Automatic signing and release build generation via GitHub Actions & Mozilla AMO.

---

## 📁 Repository Structure

```
├── .github/workflows/
│   └── build-and-sign.yml   # Automated Mozilla AMO signing & releases
├── extension/               # Browser Extension (Manifest V3)
│   ├── manifest.json
│   ├── background/
│   ├── content/
│   ├── popup/
│   └── icons/
├── host/                    # Native Messaging Host (Node.js)
│   ├── src/
│   │   ├── discord_client.js
│   │   ├── native_protocol.js
│   │   └── index.js
│   ├── manifests/
│   ├── register_host.ps1    # 1-click Windows registry registration
│   └── host.bat
└── package_extension.py     # Local packaging script
```

---

## 🚀 Quick Setup & Installation

### 1. Register Native Messaging Host

#### **Linux:**
Jalankan script registrasi di folder `host/`:
```bash
chmod +x host/register_host.sh host/host.sh
./host/register_host.sh
```

#### **Windows:**
Run PowerShell script or batch file inside `host/`:
```powershell
powershell -ExecutionPolicy Bypass -File host/register_host.ps1
```

### 2. Install Extension

#### **Mozilla Firefox (Permanent XPI via Releases / AMO):**
1. Download the signed `.xpi` file from the [Releases](https://github.com/Taufiqu/discordRPC/releases) page.
2. Drag and drop the `.xpi` into Firefox or load it from `about:addons` ➔ ⚙️ ➔ *Install Add-on From File...*.

#### **Chromium (Chrome / Brave / Edge):**
1. Open `chrome://extensions` (or `brave://extensions` / `edge://extensions`).
2. Enable **Developer Mode**.
3. Click **Load unpacked** and select the `extension/` folder.

---

## ⚙️ Configuration

- **Discord Application ID**: `1538229883279380510`
- **Activity Type**: `Listening to YouTube Music` (Type 2)
- **Fallback Asset Key**: `ytmusic_logo`

---

## 📄 License
MIT License.
