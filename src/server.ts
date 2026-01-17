import express = require("express");
import cors = require("cors");
import { CorsOptions } from "cors";
import path from "path";

import config = require("./config");
import limiter = require("./lib/express_rate_limit");
import cookieParser = require("cookie-parser");
import compression = require("compression");
import helmet from "helmet";
import v1Routes = require("./routes/v1");
import db = require("./lib/mongoose");
import logger = require("./lib/winston");


const app = express();
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    
    if (config.NODE_ENV === "development") {
      callback(null, true);
      return;
    }
    
    if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
      callback(null, true);
      return;
    }
    
    try {
      const url = new URL(origin);
      const hostname = url.hostname;
      if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        callback(null, true);
        return;
      }
    
      if (hostname.includes("ec2") || hostname.includes("amazonaws")) {
        callback(null, true);
        return;
      }
    } catch (e) {
      // Invalid URL, continue to whitelist check
    }
    
    
    if (config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS error: ${origin} nije dozvoljen`), false);
    logger.warn(`CORS error: ${origin} nije dozvoljen`);
  },
  credentials: true,
};

// app.use(cors(corsOptions));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());
// app.use(compression({ threshold: 1024 }));
// app.use(helmet());
// app.use(limiter);


(async () => {
  try {
    await db.connectToDatabase();
    
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], 
          styleSrc: ["'self'", "'unsafe-inline'"], 
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "http://*", "https://*"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          formAction: ["'self'", "http://*", "https://*"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" }, 
      crossOriginOpenerPolicy: false,
    }));
    
    app.use(cors(corsOptions)); 
    app.use(express.json()); 
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(compression({ threshold: 1024 }));
    app.use(limiter);
    app.use((req, _res, next) => {
      console.log(req.method, req.url);
      next();
    });
    
    const publicPath = path.join(__dirname, config.NODE_ENV === "production" ? "../public" : "./public");
    app.use(express.static(publicPath));
    
    app.get("/", (_req, res) => {
      const indexPath = path.join(publicPath, "index.html");
      res.sendFile(indexPath);
    });
    
    app.use("/api/v1", v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server radi na port-u: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error("Neuspelo pokretanje server", err);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await db.disconnectFromDatabase();
    logger.info("Server se gasi");
    process.exit(0);
  } catch (err) {
    logger.error("Greska na server-u.", err);
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
