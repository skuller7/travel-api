import { configDotenv } from "dotenv";

import type ms from "ms";

// Load .env file if it exists (for local development), but don't fail if it doesn't
configDotenv();

const config = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  WHITELIST_ORIGINS: [
    'https://docs.nsavanovic-api.com',
    'https://app.skuller78.click',
    'http://app.skuller78.click',
  ],
  MONGO_URI: process.env.MONGO_URI || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  GRAYLOG_ENABLED: process.env.GRAYLOG_ENABLED === "true",
  GRAYLOG_HOST: process.env.GRAYLOG_HOST || "57.129.100.83",
  GRAYLOG_PORT: parseInt(process.env.GRAYLOG_PORT || "12201", 10),
  GRAYLOG_FACILITY: process.env.GRAYLOG_FACILITY || "Node.js",
  GRAYLOG_HOSTNAME: process.env.GRAYLOG_HOSTNAME || "server-api"
};


if (!config.MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is not set!");
  console.error("Please set MONGO_URI when running the container:");
  console.error('  docker run -e MONGO_URI="mongodb://..." ...');
}

// CommonJS-style export for use with `require("./config")`
export = config;
