const express = require("express");
const router = express.Router();
const { authenticate, permit } = require("../middleware/auth");
const { listBranches, createBranch } = require("../controllers/branches.controller");

router.get("/", authenticate, permit("admin","manager"), listBranches);
router.post("/", authenticate, permit("admin"), createBranch);

module.exports = router;
