import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  res.json([
    {
      name: "Pariz 2026",
      slug: "pariz-2026",
      price: 500,
    },
    {
      name: "Rim 2026",
      slug: "rim-2026",
      price: 450,
    },
  ]);
});

router.get("/:slug", async (req, res) => {
  res.json({
    slug: req.params.slug,
    name: "Demo putovanje",
    price: 999,
  });
});

export = router;
