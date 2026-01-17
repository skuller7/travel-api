import { Router } from "express";

const router = Router();

import register = require("../../controllers/v1/auth/register");

router.post("/register", register);

// CommonJS-style export for use with `require("./auth")`
export = router;