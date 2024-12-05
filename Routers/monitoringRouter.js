const express = require('express');
const { getWaterFlow, getWaterLevel, getEfficiency, getSupplyVsDemand } = require('../Controllers/monitoringController');
const router = express.Router();

// Rute spesifik untuk setiap jenis sensor
router.get('/water-flow', getWaterFlow);
router.get('/water-level', getWaterLevel);
router.get('/water-efficiency', getEfficiency);
router.get('/sup-dem', getSupplyVsDemand);

module.exports = router;
