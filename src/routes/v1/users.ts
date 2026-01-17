import { Router } from "express";

const router = Router();

// GET /api/v1/users/me
router.get("/me", async (_req, res) => {
  res.json({
    name: "Uros",
    email: "uros@test.com",
    role: "PUTNIK",
  });
});

export = router;
