
const express = require("express");
const router = express.Router();
const { authenticate, permit } = require("../middleware/auth");
const { listSchedules, createSchedule } = require("../controllers/schedules.controller");

router.get("/", authenticate, permit("admin","manager","employee"), listSchedules);
router.post("/", authenticate, permit("admin","manager"), createSchedule);

module.exports = router;
