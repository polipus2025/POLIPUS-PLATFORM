import express from "express";
import { storage } from "./simple-storage";

const router = express.Router();

// Farmer routes
router.get("/farmers", async (req, res) => {
  try {
    const farmers = await storage.getFarmers();
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

router.post("/farmers", async (req, res) => {
  try {
    const farmer = await storage.createFarmer(req.body);
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create farmer" });
  }
});

// Commodity routes
router.get("/commodities", async (req, res) => {
  try {
    const commodities = await storage.getCommodities();
    res.json(commodities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch commodities" });
  }
});

router.post("/commodities", async (req, res) => {
  try {
    const commodity = await storage.createCommodity(req.body);
    res.json(commodity);
  } catch (error) {
    res.status(500).json({ error: "Failed to create commodity" });
  }
});

export default router;