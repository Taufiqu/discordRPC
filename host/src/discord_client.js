import { Client } from '@xhayper/discord-rpc';
import { logger } from './logger.js';

export class DiscordPresenceManager {
  constructor(clientId = '1538229883279380510') {
    this.clientId = clientId;
    this.client = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectTimer = null;
    this.lastActivity = null;
  }

  async connect() {
    if (this.isConnected || this.isConnecting) return;
    this.isConnecting = true;

    try {
      logger.log(`Attempting connection to Discord with Client ID: ${this.clientId}...`);
      this.client = new Client({ clientId: this.clientId });

      this.client.on('ready', () => {
        this.isConnected = true;
        this.isConnecting = false;
        logger.log(`Connected to Discord as user: ${this.client.user?.tag || this.client.user?.username || 'Unknown'}`);
        
        // If there was a pending activity, set it now
        if (this.lastActivity) {
          this.setActivity(this.lastActivity);
        }
      });

      this.client.on('disconnected', () => {
        logger.log('Disconnected from Discord IPC.');
        this._handleDisconnect();
      });

      await this.client.login();
    } catch (err) {
      logger.error('Failed to connect to Discord:', err.message);
      this._handleDisconnect();
    }
  }

  _handleDisconnect() {
    this.isConnected = false;
    this.isConnecting = false;
    if (this.client) {
      try {
        this.client.destroy();
      } catch (_) {}
      this.client = null;
    }

    // Attempt auto-reconnect every 15 seconds
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, 15000);
    }
  }

  async setActivity(payload) {
    this.lastActivity = payload;

    if (!this.isConnected || !this.client) {
      logger.log('Discord not connected yet. Storing activity for when connected.');
      this.connect();
      return { success: false, reason: 'DISCORD_NOT_CONNECTED' };
    }

    try {
      const activityData = {
        type: 2, // ActivityType.Listening ("Listening to ...")
        details: payload.details ? String(payload.details).substring(0, 128) : undefined,
        state: payload.state ? String(payload.state).substring(0, 128) : undefined,
        largeImageKey: payload.largeImageKey || 'ytmusic_logo',
        largeImageText: payload.largeImageText ? String(payload.largeImageText).substring(0, 128) : 'YouTube Music',
        smallImageKey: payload.smallImageKey,
        smallImageText: payload.smallImageText ? String(payload.smallImageText).substring(0, 128) : undefined,
        startTimestamp: payload.startTimestamp,
        endTimestamp: payload.endTimestamp,
        instance: false
      };

      if (payload.buttons && Array.isArray(payload.buttons) && payload.buttons.length > 0) {
        activityData.buttons = payload.buttons.slice(0, 2).map(btn => ({
          label: String(btn.label).substring(0, 32),
          url: btn.url
        }));
      }

      await this.client.user?.setActivity(activityData);
      logger.log(`Rich Presence updated: ${activityData.details} - ${activityData.state}`);
      return { success: true };
    } catch (err) {
      logger.error('Failed to set Discord activity:', err.message);
      return { success: false, error: err.message };
    }
  }

  async clearActivity() {
    this.lastActivity = null;
    if (!this.isConnected || !this.client) return { success: true };

    try {
      await this.client.user?.clearActivity();
      logger.log('Discord Rich Presence cleared.');
      return { success: true };
    } catch (err) {
      logger.error('Failed to clear Discord activity:', err.message);
      return { success: false, error: err.message };
    }
  }

  destroy() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.client) {
      try {
        this.client.destroy();
      } catch (_) {}
    }
    this.isConnected = false;
  }
}
