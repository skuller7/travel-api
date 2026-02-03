import winston from "winston";
import config = require("../config");

const { combine, timestamp, align, printf, colorize } = winston.format;

// Format za console output
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

const transports: winston.transport[] = [];

// Console transport - prikazuje logove u terminalu
transports.push(
  new winston.transports.Console({
    format: consoleFormat,
  })
);

// Kreiraj logger
const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: combine(timestamp()),
  transports,
  silent: config.NODE_ENV === "test",
});

export = logger;