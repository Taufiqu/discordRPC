// Background Service Worker for Discord RPC Extension

const HOST_NAME = 'com.discordrpc.bridge';
let nativePort = null;
let isNativeConnected = false;
let isDiscordConnected = false;
let currentTrack = null;
let isEnabled = true;

// Initialize enabled state from storage
chrome.storage.local.get(['rpcEnabled'], (res) => {
  if (res.rpcEnabled !== undefined) {
    isEnabled = res.rpcEnabled;
  }
});

function connectNative() {
  if (nativePort) return;

  try {
    nativePort = chrome.runtime.connectNative(HOST_NAME);

    nativePort.onMessage.addListener((msg) => {
      if (msg.discordConnected !== undefined) {
        isDiscordConnected = msg.discordConnected;
      }
      isNativeConnected = true;

      // Broadcast status to popup if open
      chrome.runtime.sendMessage({
        action: 'STATUS_UPDATE',
        isNativeConnected,
        isDiscordConnected,
        currentTrack
      }).catch(() => {});
    });

    nativePort.onDisconnect.addListener(() => {
      const lastError = chrome.runtime.lastError?.message;
      console.warn('Native host disconnected:', lastError);
      nativePort = null;
      isNativeConnected = false;
      isDiscordConnected = false;

      chrome.runtime.sendMessage({
        action: 'STATUS_UPDATE',
        isNativeConnected: false,
        isDiscordConnected: false,
        currentTrack: null
      }).catch(() => {});
    });

    // Send initial ping
    nativePort.postMessage({ action: 'PING' });
  } catch (err) {
    console.error('Failed to connect to native host:', err);
    nativePort = null;
  }
}

function sendToNative(msg) {
  if (!nativePort) {
    connectNative();
  }
  if (nativePort) {
    try {
      nativePort.postMessage(msg);
    } catch (err) {
      console.error('Failed to postMessage to native host:', err);
      nativePort = null;
    }
  }
}

function updatePresence(trackData) {
  if (!isEnabled) return;
  if (!trackData) {
    clearPresence();
    return;
  }

  currentTrack = trackData;

  if (trackData.isPaused) {
    // Clear Discord presence when paused to avoid ghost stopwatch timer
    sendToNative({ action: 'CLEAR_ACTIVITY' });
  } else {
    sendToNative({
      action: 'SET_ACTIVITY',
      payload: {
        details: trackData.title,
        state: trackData.album ? `${trackData.artist} — ${trackData.album}` : trackData.artist,
        largeImageKey: trackData.artworkUrl || 'ytmusic_logo',
        largeImageText: trackData.album || trackData.title,
        smallImageKey: 'ytmusic_logo',
        smallImageText: 'Playing on YouTube Music',
        startTimestamp: trackData.startTimestamp,
        endTimestamp: trackData.endTimestamp,
        buttons: trackData.songUrl ? [
          { label: 'Listen on YT Music', url: trackData.songUrl }
        ] : undefined
      }
    });
  }
}

function clearPresence() {
  currentTrack = null;
  sendToNative({ action: 'CLEAR_ACTIVITY' });
}

// Listen to messages from content scripts and popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'YT_MUSIC_UPDATE') {
    updatePresence(msg.data);
    sendResponse({ received: true });
  } else if (msg.action === 'YT_MUSIC_CLEAR') {
    clearPresence();
    sendResponse({ received: true });
  } else if (msg.action === 'GET_STATUS') {
    sendToNative({ action: 'PING' });
    sendResponse({
      isNativeConnected,
      isDiscordConnected,
      isEnabled,
      currentTrack
    });
  } else if (msg.action === 'TOGGLE_RPC') {
    isEnabled = !!msg.enabled;
    chrome.storage.local.set({ rpcEnabled: isEnabled });
    if (!isEnabled) {
      clearPresence();
    } else if (currentTrack) {
      updatePresence(currentTrack);
    }
    sendResponse({ isEnabled });
  }
  return true;
});

// Track tab closure
chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ url: '*://music.youtube.com/*' }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      clearPresence();
    }
  });
});

// Initial connection
connectNative();
