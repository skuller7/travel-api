import mongoose, { ConnectOptions } from "mongoose";
import config = require("../config");
import logger = require("./winston");

const clientOptions: ConnectOptions = {
  dbName: "zveb-db",
  appName: "API-info",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI || config.MONGO_URI.trim() === "") {
    throw new Error("Mongo URI nije definisan u konfiguraciji. MONGO_URI environment variable is required.");
  }
  
  // Validate URI format
  if (!config.MONGO_URI.startsWith("mongodb://") && !config.MONGO_URI.startsWith("mongodb+srv://")) {
    throw new Error(`Invalid MONGO_URI format. Must start with "mongodb://" or "mongodb+srv://". Got: ${config.MONGO_URI.substring(0, 20)}...`);
  }
  
  try {
    console.log("Pokušavam konekciju prema bazi...");
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info("Konekcija prema bazi je uspesna.", {
      dbName: clientOptions.dbName,
      appName: clientOptions.appName,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    logger.error("Greska prilikom kacenja na bazu", err);
    throw err;
  }
};

const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info("Diskonekcija prema bazi je uspesna.", {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    logger.error("Greska prilikom diskonektovanja sa bazom", err);
    throw err;
  }
};


export = {
  connectToDatabase,
  disconnectFromDatabase,
};