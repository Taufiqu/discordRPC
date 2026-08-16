// YouTube Music Content Script for Discord Rich Presence
(() => {
  let lastTrackInfo = null;
  let pollInterval = null;

  function cleanString(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
  }

  function getMediaElement() {
    return document.querySelector('video');
  }

  function isAdPlaying() {
    return !!(
      document.querySelector('.ad-showing') ||
      document.querySelector('.ytp-ad-player-overlay') ||
      document.querySelector('ytmusic-player-bar .yt-formatted-string[title*="Ad"]')
    );
  }

  function extractTrackData() {
    const video = getMediaElement();
    if (!video) return null;

    // Check if player bar exists
    const playerBar = document.querySelector('ytmusic-player-bar');
    if (!playerBar) return null;

    // Title extraction
    const titleEl = playerBar.querySelector('.title.ytmusic-player-bar');
    let title = titleEl ? cleanString(titleEl.textContent) : '';
    if (!title && navigator.mediaSession?.metadata?.title) {
      title = navigator.mediaSession.metadata.title;
    }

    // Artist & Album extraction from byline
    const bylineEl = playerBar.querySelector('.byline.ytmusic-player-bar');
    let artist = '';
    let album = '';

    if (bylineEl) {
      // Byline often has links for artist and album
      const links = bylineEl.querySelectorAll('a');
      if (links.length >= 1) {
        artist = cleanString(links[0].textContent);
      }
      if (links.length >= 2) {
        album = cleanString(links[1].textContent);
      }

      if (!artist) {
        const fullByline = cleanString(bylineEl.textContent);
        const parts = fullByline.split('•').map(p => p.trim());
        artist = parts[0] || '';
        album = parts[1] || '';
      }
    }

    if (!artist && navigator.mediaSession?.metadata?.artist) {
      artist = navigator.mediaSession.metadata.artist;
    }
    if (!album && navigator.mediaSession?.metadata?.album) {
      album = navigator.mediaSession.metadata.album;
    }

    // Artwork image
    let artworkUrl = '';
    const imgEl = playerBar.querySelector('.image.ytmusic-player-bar img') || playerBar.querySelector('img.image');
    if (imgEl && imgEl.src && !imgEl.src.startsWith('data:')) {
      artworkUrl = imgEl.src;
    } else if (navigator.mediaSession?.metadata?.artwork?.[0]?.src) {
      artworkUrl = navigator.mediaSession.metadata.artwork[0].src;
    }

    // Clean up low-res YouTube thumbnails to high-res if applicable
    if (artworkUrl && artworkUrl.includes('=')) {
      artworkUrl = artworkUrl.replace(/=w\d+-h\d+.*$/, '=w512-h512-l90-rj');
    }

    // Current Watch URL
    let songUrl = '';
    const linkEl = playerBar.querySelector('a.ytp-title-link') || playerBar.querySelector('.title.ytmusic-player-bar a');
    if (linkEl && linkEl.href) {
      songUrl = linkEl.href;
    } else if (window.location.href.includes('watch')) {
      songUrl = window.location.href;
    }

    const isPaused = video.paused || video.ended;
    const currentTime = Math.floor(video.currentTime || 0);
    const duration = Math.floor(video.duration || 0);

    if (!title || title === '' || isAdPlaying()) {
      return null;
    }

    // Compute timestamps for Discord timeline sync
    const now = Math.floor(Date.now() / 1000);
    const startTimestamp = !isPaused ? now - currentTime : undefined;
    const endTimestamp = (!isPaused && duration > 0) ? startTimestamp + duration : undefined;

    return {
      title,
      artist: artist || 'Unknown Artist',
      album: album || '',
      artworkUrl,
      songUrl,
      isPaused,
      currentTime,
      duration,
      startTimestamp,
      endTimestamp
    };
  }

  function notifyBackground(trackData) {
    try {
      if (!trackData) {
        if (lastTrackInfo !== null) {
          lastTrackInfo = null;
          chrome.runtime.sendMessage({ action: 'YT_MUSIC_CLEAR' });
        }
        return;
      }

      // Check if data actually changed to prevent message spam
      const dataChanged =
        !lastTrackInfo ||
        lastTrackInfo.title !== trackData.title ||
        lastTrackInfo.artist !== trackData.artist ||
        lastTrackInfo.isPaused !== trackData.isPaused ||
        Math.abs((lastTrackInfo.currentTime || 0) - trackData.currentTime) > 3;

      if (dataChanged) {
        lastTrackInfo = trackData;
        chrome.runtime.sendMessage({
          action: 'YT_MUSIC_UPDATE',
          data: trackData
        });
      }
    } catch (err) {
      // Extension context invalidated (e.g. extension reloaded)
      clearInterval(pollInterval);
    }
  }

  function checkState() {
    const data = extractTrackData();
    notifyBackground(data);
  }

  function attachListeners() {
    const video = getMediaElement();
    if (video) {
      ['play', 'pause', 'seeked', 'ratechange', 'ended'].forEach((evt) => {
        video.addEventListener(evt, checkState);
      });
    }

    // MutationObserver on player bar
    const playerBar = document.querySelector('ytmusic-player-bar');
    if (playerBar) {
      const observer = new MutationObserver(() => checkState());
      observer.observe(playerBar, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['src', 'title', 'aria-valuenow']
      });
    }
  }

  // Periodic polling for time changes & SPA navigation resilience
  pollInterval = setInterval(checkState, 2000);

  // Initial check & listener binding
  setTimeout(() => {
    attachListeners();
    checkState();
  }, 1500);

  // Handle page unload
  window.addEventListener('beforeunload', () => {
    try {
      chrome.runtime.sendMessage({ action: 'YT_MUSIC_CLEAR' });
    } catch (_) {}
  });
})();
