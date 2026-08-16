import { EventEmitter } from 'node:events';
import { logger } from './logger.js';

export class NativeMessagingProtocol extends EventEmitter {
  constructor() {
    super();
    this.buffer = Buffer.alloc(0);

    process.stdin.on('data', (chunk) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this._processBuffer();
    });

    process.stdin.on('end', () => {
      logger.log('Native messaging stdin stream ended.');
      this.emit('end');
    });

    process.stdin.on('error', (err) => {
      logger.error('Native messaging stdin error:', err.message);
      this.emit('error', err);
    });
  }

  _processBuffer() {
    while (this.buffer.length >= 4) {
      const messageLength = this.buffer.readUInt32LE(0);

      // Validate reasonable message size (max 1MB)
      if (messageLength > 1024 * 1024) {
        logger.error(`Message length exceeded safe threshold: ${messageLength}`);
        this.buffer = Buffer.alloc(0);
        return;
      }

      if (this.buffer.length < 4 + messageLength) {
        // Wait for more chunks to arrive
        break;
      }

      const rawJson = this.buffer.subarray(4, 4 + messageLength).toString('utf-8');
      this.buffer = this.buffer.subarray(4 + messageLength);

      try {
        const parsed = JSON.parse(rawJson);
        this.emit('message', parsed);
      } catch (err) {
        logger.error('Failed to parse JSON message:', rawJson, err.message);
      }
    }
  }

  sendMessage(obj) {
    try {
      const jsonStr = JSON.stringify(obj);
      const payloadBuf = Buffer.from(jsonStr, 'utf-8');
      const headerBuf = Buffer.alloc(4);
      headerBuf.writeUInt32LE(payloadBuf.length, 0);

      process.stdout.write(Buffer.concat([headerBuf, payloadBuf]));
    } catch (err) {
      logger.error('Failed to send Native Message:', err.message);
    }
  }
}
