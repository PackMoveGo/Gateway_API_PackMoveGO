import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple console logging functions
export const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${message}`, error);
};

export const logWarn = (message: string) => {
  console.warn(`[WARN] ${message}`);
};

export const logInfo = (message: string) => {
  console.log(`[INFO] ${message}`);
};

export const logHttp = (message: string) => {
  console.log(`[HTTP] ${message}`);
};

export const logDebug = (message: string) => {
  console.log(`[DEBUG] ${message}`);
};

export const stream = {
  write: (message: string) => {
    console.log(`[HTTP] ${message.trim()}`);
  },
};

export default {
  error: logError,
  warn: logWarn,
  info: logInfo,
  http: logHttp,
  debug: logDebug
}; 