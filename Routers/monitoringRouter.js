const express = require("express");
const {
  getWaterFlow,
  getWaterLevel,
  getEfficiency,
  getSupply,
} = require("../controllers/monitoringController");
//   getMonitoringByDuration,

const router = express.Router();

// Routes untuk Monitoring
router.get("/water-flow", getWaterFlow);
router.get('/water-flow/duration/:duration', getWaterFlow);
router.get("/water-level", getWaterLevel);
router.get('/water-level/duration/:duration', getWaterLevel);
router.get("/efficiency", getEfficiency);
router.get('/water-Efficiency/duration/:duration', getWaterLevel);
router.get("/supply", getSupply);
router.get('/supply/duration/:duration', getWaterLevel);
// router.get("/monitoring/duration", getMonitoringByDuration); // Endpoint untuk Monitoring by Duration

module.exports = router;
