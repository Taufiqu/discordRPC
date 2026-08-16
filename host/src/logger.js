import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logPath = path.resolve(__dirname, '../debug.log');

export const logger = {
  log: (...args) => {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] [INFO] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}\n`;
    try {
      fs.appendFileSync(logPath, msg);
    } catch (_) {}
    process.stderr.write(msg);
  },
  error: (...args) => {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] [ERROR] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}\n`;
    try {
      fs.appendFileSync(logPath, msg);
    } catch (_) {}
    process.stderr.write(msg);
  }
};
