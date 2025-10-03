const express = require("express");
const router = express.Router();
const { authenticate, permit } = require("../middleware/auth");
const { listShifts, createShift } = require("../controllers/shifts.controller");

router.get("/", authenticate, permit("admin","manager","employee"), listShifts);
router.post("/", authenticate, permit("admin","manager"), createShift);

module.exports = router;
