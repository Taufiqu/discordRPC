# 📖 Installation & Setup Guide

This guide will help you install and configure **YouTube Music Discord Rich Presence**.

Choose the installation method that suits your needs:
- [Method A: General User Installation (Recommended)](#-method-a-general-user-installation-recommended) — For users who just want to use the extension without coding or building from source.
- [Method B: Developer & Manual Installation](#-method-b-developer--manual-installation) — For contributors or developers running from source code.

---

## ⚡ Method A: General User Installation (Recommended)

You don't need `git` or development tools. Just follow these 2 simple steps:

### Step 1: Install the Browser Extension

- **Mozilla Firefox:**
  1. Go to the [Latest Releases](https://github.com/Taufiqu/discordRPC/releases) page.
  2. Download the `youtube_music_discord_rpc-x.x.x.xpi` file.
  3. Open Firefox and drag-and-drop the `.xpi` file into your browser window, then click **Add** when prompted.
  *(Alternatively, install it directly from the Firefox Add-ons store once published).*

- **Google Chrome / Brave / Microsoft Edge:**
  1. Download `extension.zip` from the [Latest Releases](https://github.com/Taufiqu/discordRPC/releases).
  2. Extract `extension.zip` to a folder on your computer.
  3. Open your browser's extension page:
     - Chrome: `chrome://extensions`
     - Brave: `brave://extensions`
     - Edge: `edge://extensions`
  4. Enable **Developer mode** (toggle in the top-right corner).
  5. Click **Load unpacked** and select the extracted folder.
  *(Once published to the Chrome Web Store, you can simply click "Add to Chrome").*

---

### Step 2: Install the Discord Bridge (Native Host)

Because browser security sandboxes prevent websites/extensions from directly accessing local Discord desktop sockets, a small local bridge is required.

1. Download the `host-bridge.zip` from [Releases](https://github.com/Taufiqu/discordRPC/releases) (or download the `host/` folder from this repo).
2. Extract it anywhere on your computer (e.g. `Documents/discordRPC-host`).
3. Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

#### 🪟 Windows:
- Open the extracted folder.
- **Double-click `register_host.bat`**.
- Done! The bridge is now registered.

#### 🐧 Linux:
- Open your terminal in the extracted folder and run:
  ```bash
  chmod +x register_host.sh host.sh
  ./register_host.sh
  ```
- Done!

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

### 5. Debugging
- Check extension console logs via the background service worker inspection page.
- Native host logs can be inspected by reviewing output redirected to `host/debug.log` if enabled.

---

## 🧹 How to Uninstall

- **Windows:** Double-click `host/unregister_host.bat` or run PowerShell:
  ```powershell
  powershell -ExecutionPolicy Bypass -File host/unregister_host.ps1
  ```
- **Linux:**
  ```bash
  chmod +x host/unregister_host.sh
  ./host/unregister_host.sh
  ```
- Remove the extension from your browser's extensions page.
