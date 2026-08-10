import express from "express";
import cors from "cors";
import { buildTripPlan } from "./tripPlanner.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/plan-trip", async (req, res) => {
  try {
    const formData = req.body;
    if (!formData.destination || !formData.destination.trim()) {
      return res.status(400).json({ error: "Destination is required", code: "DESTINATION_REQUIRED" });
    }
    if (!formData.tripDate || !formData.tripDate.trim()) {
      return res.status(400).json({ error: "Trip start date is required", code: "TRIP_DATE_REQUIRED" });
    }
    const plan = await buildTripPlan(formData);
    res.json(plan);
  } catch (err) {
    if (err.code === "DESTINATION_REQUIRED") {
      return res.status(400).json({ error: "Destination is required", code: "DESTINATION_REQUIRED" });
    }
    if (err.code === "TRIP_DATE_REQUIRED") {
      return res.status(400).json({ error: "Trip start date is required", code: "TRIP_DATE_REQUIRED" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Concierge backend running at http://localhost:${PORT}`);
});
