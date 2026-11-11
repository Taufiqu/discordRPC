# 📖 Installation & Setup Guide

This guide will help you install and configure **YouTube Music Discord Rich Presence**.

Choose the installation method that suits your needs:
- [Method A: General User Installation (Recommended)](#-method-a-general-user-installation-recommended)
  - [Option 1: 1-Line Terminal Command (Fastest)](#option-1-1-line-terminal-command-fastest)
  - [Option 2: Manual ZIP Download](#option-2-manual-zip-download)
- [Method B: Developer & Manual Installation](#-method-b-developer--manual-installation) — For contributors or developers running from source code.
- [How to Uninstall](#-how-to-uninstall)

---

## ⚡ Method A: General User Installation (Recommended)

You don't need `git` or development tools.

### Step 1: Install the Browser Extension

- **Mozilla Firefox:**
  1. Go to the [Latest Releases](https://github.com/Taufiqu/discordRPC/releases) page.
  2. Download the `youtube_music_discord_rpc-x.x.x.xpi` file.
  3. Open Firefox and drag-and-drop the `.xpi` file into your browser window, then click **Add** when prompted.
  *(Or install directly from the Firefox Add-ons store once published).*

- **Google Chrome / Brave / Microsoft Edge:**
  1. Download `youtube_music_discord_rpc-chromium-*.zip` from [Latest Releases](https://github.com/Taufiqu/discordRPC/releases).
  2. Extract the zip file to a folder on your computer.
  3. Open your browser's extension page:
     - Chrome: `chrome://extensions`
     - Brave: `brave://extensions`
     - Edge: `edge://extensions`
  4. Enable **Developer mode** (toggle in the top-right corner).
  5. Click **Load unpacked** and select the extracted folder.

---

### Step 2: Install the Discord Bridge (Native Host)

Choose either Option 1 (automatic 1-line script) or Option 2 (manual zip).

#### Option 1: 1-Line Terminal Command (Fastest)

Make sure you have [Node.js](https://nodejs.org/) installed. Open your terminal and paste:

- **🪟 Windows (PowerShell):**
  ```powershell
  irm https://raw.githubusercontent.com/Taufiqu/discordRPC/main/install.ps1 | iex
  ```
- **🐧 Linux:**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/Taufiqu/discordRPC/main/install.sh | bash
  ```
*This downloads the latest bridge to your user app data folder, installs dependencies, and registers the host manifests automatically.*

#### Option 2: Manual ZIP Download

1. Download `discord_rpc_host-*.zip` from [Releases](https://github.com/Taufiqu/discordRPC/releases).
2. Extract it anywhere on your computer (e.g. `Documents/discordRPC-host`).
3. Run the registration script:
   - **Windows:** Double-click `register_host.bat`.
   - **Linux:** Open terminal in the folder and run `chmod +x register_host.sh host.sh && ./register_host.sh`.

---

### Step 3: Enjoy!
1. Make sure your **Discord Desktop App** is running.
2. In Discord: go to **Settings (⚙️)** ➔ **Activity Privacy** ➔ Ensure **"Display current activity as a status message"** is turned **ON**.
3. Open [music.youtube.com](https://music.youtube.com/) and play any song.
4. Your Discord profile will now automatically display your music!

---

## 🛠️ Method B: Developer & Manual Installation

For developers who want to modify code, debug, or contribute.

### 1. Clone & Setup
```bash
git clone https://github.com/Taufiqu/discordRPC.git
cd discordRPC
```

### 2. Setup Host Dependencies
```bash
cd host
npm install
```

### 3. Register Native Messaging Host Locally
- **Linux:**
  ```bash
  chmod +x register_host.sh host.sh
  ./register_host.sh
  ```
- **Windows:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File register_host.ps1
  ```

### 4. Load Extension in Developer Mode
- **Firefox:** Navigate to `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on...**, and select `extension/manifest.json`.
- **Chromium (Chrome/Brave/Edge):** Navigate to `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the `extension/` directory.

---

## 🧹 How to Uninstall

### If installed via 1-Line Command:
- **🪟 Windows (PowerShell):**
  ```powershell
  irm https://raw.githubusercontent.com/Taufiqu/discordRPC/main/uninstall.ps1 | iex
  ```
- **🐧 Linux:**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/Taufiqu/discordRPC/main/uninstall.sh | bash
  ```

### If installed manually from ZIP:
- **Windows:** Double-click `unregister_host.bat` inside the host folder.
- **Linux:** Run `./unregister_host.sh` inside the host folder.
