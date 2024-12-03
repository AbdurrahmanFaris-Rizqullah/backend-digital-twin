const express = require("express");
const router = express.Router();
const { insertParameters, getParameters, insertParametersAuto, getParametersByDuration, getAllParametersByDuration } = require("../Controllers/parametersController");

// Auto-generate parameter data
router.post("/:pointName", async (req, res, next) => {
  try {
    const { pointName } = req.params;
    await insertParameters(pointName, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/", insertParametersAuto);

// Fetch all parameters or filter by point
router.get("/", getParameters);

// Fetch parameters for a specific point (dynamic routing)
router.get("/:pointName", async (req, res, next) => {
  const { pointName } = req.params;
  try {
    req.query.point = pointName; // Inject parameter to query for controller reuse
    await getParameters(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Fetch parameters by duration for a specific point (dynamic routing with duration)
router.get("/:pointName/duration/:duration", async (req, res, next) => {
  const { pointName, duration } = req.params; // Get pointName and duration from URL params
  try {
    req.query.pointName = pointName; // Pass pointName as query parameter for reuse in controller
    req.query.duration = duration; // Pass duration as query parameter
    await getParametersByDuration(req, res, next); // Call the controller function
  } catch (error) {
    next(error);
  }
});

router.get("/duration/:duration", async (req, res, next) => {
  const { duration } = req.params; // Get pointName and duration from URL params
  try {
    req.query.pointName = null; // Pass pointName as query parameter for reuse in controller
    req.query.duration = duration; // Pass duration as query parameter
    await getParametersByDuration(req, res, next); // Call the controller function
  } catch (error) {
    next(error);
  }
});

module.exports = router;
