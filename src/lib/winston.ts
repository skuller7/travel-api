import winston from "winston";
import path from "path";
import fs from "fs";
import { Writable } from "stream";
import config = require("../config");
import graylog2 from "graylog2";

const { combine, timestamp, align, printf, colorize, json } = winston.format;

// Kreiraj logs folder ako ne postoji (u root direktorijumu projekta)
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Format za console output (samo u development)
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  align(),
  printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
  })
);

// Format za file output- JSON
const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  json()
);

const transports: winston.transport[] = [];

// Console transport - prikazuje logove u terminalu (samo u development)
if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// ============================================
// FILE TRANSPORTS - Čuvaju logove u fajlove
// ============================================

// 1. ERROR log - samo greške (error)
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, "error.log"),
    level: "error",
    format: fileFormat,
    maxsize: 5242880, 
    maxFiles: 5,
  })
);

// 2. COMBINED log - svi logovi
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, "combined.log"),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
);

// 3. DEBUG log - detaljni logovi (samo u development)
if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "debug.log"),
      level: "silly",
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 3,
    })
  );
}

// ============================================
// GRAYLOG TRANSPORT - Šalje logove na Graylog server
// ============================================

// Initialize graylog2 client samo ako je Graylog omogućen
let graylogClient: any = null;

if (config.GRAYLOG_ENABLED) {
  console.log('🟢 Initializing Graylog client...');
  console.log(`   Host: ${config.GRAYLOG_HOST}`);
  console.log(`   Port: ${config.GRAYLOG_PORT}`);
  console.log(`   Hostname: ${config.GRAYLOG_HOSTNAME}`);
  console.log(`   Facility: ${config.GRAYLOG_FACILITY}`);
  
  graylogClient = new graylog2.graylog({
    servers: [{ 
      host: config.GRAYLOG_HOST,
      port: config.GRAYLOG_PORT 
    }],
    hostname: config.GRAYLOG_HOSTNAME,
    facility: config.GRAYLOG_FACILITY,
    bufferSize: 1350,
  });

  // Handle Graylog errors
  graylogClient.on('error', (error: Error) => {
    console.error('Graylog error:', error);
  });
  
  console.log('Graylog client initialized');
  
  // Test connection after 2 seconds
  setTimeout(() => {
    console.log('Sending test message to Graylog...');
    graylogClient.info('Winston logger initialized', 'Test connection from Node.js application', {
      test: true,
      startup: true,
      environment: config.NODE_ENV
    });
    console.log('Test message sent!');
  }, 2000);
}


class GraylogStream extends Writable {
  _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
    if (!config.GRAYLOG_ENABLED || !graylogClient) {
      callback();
      return;
    }

    try {
      const logEntry = JSON.parse(chunk.toString());
      const { level, message, timestamp, ...meta } = logEntry;
      
      console.log('Graylog: Sending log ->', level.toUpperCase(), ':', message);
      
      // Map Winston levels to Graylog severity levels
      const levelMap: { [key: string]: string } = {
        'error': 'error',
        'warn': 'warning',
        'info': 'info',
        'http': 'info',
        'verbose': 'debug',
        'debug': 'debug',
        'silly': 'debug'
      };
      
      const graylogLevel = levelMap[level.toLowerCase()] || 'info';
      const shortMessage = message || 'No message';
      const fullMessage = Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : undefined;
      
      const additionalFields: any = {
        level: level,
        environment: config.NODE_ENV,
        ...meta
      };
      
      // Send to Graylog using the appropriate method
      switch (graylogLevel) {
        case 'error':
          graylogClient.error(shortMessage, fullMessage, additionalFields);
          break;
        case 'warning':
          graylogClient.warning(shortMessage, fullMessage, additionalFields);
          break;
        case 'debug':
          graylogClient.debug(shortMessage, fullMessage, additionalFields);
          break;
        default:
          graylogClient.info(shortMessage, fullMessage, additionalFields);
      }
      
      console.log('Graylog: Message sent successfully');
      callback();
    } catch (error) {
      console.error('Error sending log to Graylog:', error);
      callback();
    }
  }
}

if (config.GRAYLOG_ENABLED) {
  transports.push(
    new winston.transports.Stream({
      stream: new GraylogStream(),
      level: config.LOG_LEVEL || "info",
      format: fileFormat,
    })
  );
}

// Kreiraj logger
const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: combine(timestamp()),
  transports,
  silent: config.NODE_ENV === "test",
});

export = logger;