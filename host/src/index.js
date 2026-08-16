import { NativeMessagingProtocol } from './native_protocol.js';
import { DiscordPresenceManager } from './discord_client.js';
import { logger } from './logger.js';

logger.log('Native Messaging Host starting...');

const protocol = new NativeMessagingProtocol();
const discord = new DiscordPresenceManager('1538229883279380510');

// Initial attempt to connect to Discord client
discord.connect();

protocol.on('message', async (msg) => {
  logger.log('Received command from browser extension:', msg?.action);

  if (!msg || !msg.action) {
    protocol.sendMessage({ status: 'ERROR', message: 'Missing action field' });
    return;
  }

  switch (msg.action) {
    case 'PING':
      protocol.sendMessage({
        status: 'PONG',
        discordConnected: discord.isConnected,
        user: discord.client?.user ? {
          username: discord.client.user.username,
          tag: discord.client.user.tag
        } : null
      });
      break;

    case 'SET_ACTIVITY': {
      const result = await discord.setActivity(msg.payload || {});
      protocol.sendMessage({
        status: result.success ? 'OK' : 'ERROR',
        action: 'SET_ACTIVITY',
        discordConnected: discord.isConnected,
        error: result.error || result.reason
      });
      break;
    }

    case 'CLEAR_ACTIVITY': {
      const result = await discord.clearActivity();
      protocol.sendMessage({
        status: result.success ? 'OK' : 'ERROR',
        action: 'CLEAR_ACTIVITY',
        discordConnected: discord.isConnected
      });
      break;
    }

    case 'UPDATE_CLIENT_ID': {
      if (msg.clientId && msg.clientId !== discord.clientId) {
        logger.log(`Updating Discord Client ID to: ${msg.clientId}`);
        discord.destroy();
        discord.clientId = msg.clientId;
        discord.connect();
      }
      protocol.sendMessage({ status: 'OK', action: 'UPDATE_CLIENT_ID' });
      break;
    }

    default:
      logger.error(`Unknown action: ${msg.action}`);
      protocol.sendMessage({ status: 'ERROR', message: `Unknown action: ${msg.action}` });
      break;
  }
});

protocol.on('end', () => {
  logger.log('Native Messaging host terminating (browser closed connection).');
  discord.destroy();
  process.exit(0);
});

protocol.on('error', (err) => {
  logger.error('Protocol error:', err.message);
});

// Handle graceful process termination
process.on('SIGINT', () => {
  discord.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  discord.destroy();
  process.exit(0);
});
