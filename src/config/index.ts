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
};


if (!config.MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is not set!");
  console.error("Please set MONGO_URI when running the container:");
  console.error('  docker run -e MONGO_URI="mongodb://..." ...');
}

// CommonJS-style export for use with `require("./config")`
export = config;
