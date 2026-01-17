import { Router } from "express";

const router = Router();

// route
import authRoutes = require("./auth");
import travelRoutes = require("./travels");
import userRoutes = require("./users");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API je operativan",
    status: "ok",
    version: "1.0",
    docs: "https://docs.nsavanovic-api.com",
    timeStamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/travels", travelRoutes);
router.use("/users", userRoutes);

export = router;