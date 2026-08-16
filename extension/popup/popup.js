// Popup Script for Discord RPC Extension

document.addEventListener('DOMContentLoaded', () => {
  const rpcToggle = document.getElementById('rpcToggle');
  const overallStatusDot = document.getElementById('overallStatusDot');
  const bridgeBadge = document.getElementById('bridgeBadge');
  const bridgeStatusText = document.getElementById('bridgeStatusText');
  const discordBadge = document.getElementById('discordBadge');
  const discordStatusText = document.getElementById('discordStatusText');

  const trackArtwork = document.getElementById('trackArtwork');
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const trackAlbum = document.getElementById('trackAlbum');
  const playStateBadge = document.getElementById('playStateBadge');

  function renderStatus(state) {
    if (!state) return;

    // Toggle state
    if (state.isEnabled !== undefined) {
      rpcToggle.checked = state.isEnabled;
    }

    // Bridge Status
    if (state.isNativeConnected) {
      bridgeBadge.className = 'status-badge connected';
      bridgeStatusText.textContent = 'Connected';
    } else {
      bridgeBadge.className = 'status-badge';
      bridgeStatusText.textContent = 'Disconnected';
    }

    // Discord Status
    if (state.isDiscordConnected) {
      discordBadge.className = 'status-badge connected';
      discordStatusText.textContent = 'Active';
    } else {
      discordBadge.className = 'status-badge';
      discordStatusText.textContent = 'Disconnected';
    }

    // Overall Dot
    if (state.isNativeConnected && state.isDiscordConnected && state.isEnabled) {
      overallStatusDot.className = 'status-indicator online';
    } else {
      overallStatusDot.className = 'status-indicator';
    }

    // Track info
    const track = state.currentTrack;
    if (track) {
      trackTitle.textContent = track.title || 'Untitled';
      trackArtist.textContent = track.artist || 'Unknown Artist';
      trackAlbum.textContent = track.album || '';
      trackArtwork.src = track.artworkUrl || '../icons/icon128.png';
      playStateBadge.textContent = track.isPaused ? '⏸' : '▶';
    } else {
      trackTitle.textContent = 'No track playing';
      trackArtist.textContent = 'Open YouTube Music';
      trackAlbum.textContent = '';
      trackArtwork.src = '../icons/icon128.png';
      playStateBadge.textContent = '⏹';
    }
  }

  // Request status from background
  chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (res) => {
    if (res) renderStatus(res);
  });

  // Listen for real-time status updates from service worker
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'STATUS_UPDATE') {
      renderStatus(msg);
    }
  });

  // Handle Toggle Switch
  rpcToggle.addEventListener('change', () => {
    const isEnabled = rpcToggle.checked;
    chrome.runtime.sendMessage({ action: 'TOGGLE_RPC', enabled: isEnabled }, (res) => {
      if (res) {
        chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (status) => {
          if (status) renderStatus(status);
        });
      }
    });
  });
});
