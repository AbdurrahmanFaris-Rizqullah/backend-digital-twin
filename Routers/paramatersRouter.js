const express = require("express");
const router = express.Router();
const { insertParameters, getParameters, insertParametersAuto } = require("../Controllers/parametersController");

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

module.exports = router;
