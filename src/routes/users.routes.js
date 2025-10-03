const express = require("express");
const router = express.Router();
const { authenticate, permit } = require("../middleware/auth");
const { listUsers, createUser, deleteUser } = require("../controllers/users.controller");

// admin và manager có thể xem users; manager tự động bị giới hạn trong controller
router.get("/", authenticate, permit("admin","manager"), listUsers);

// admin & manager tạo user (manager chỉ tạo trong branch)
router.post("/", authenticate, permit("admin","manager"), createUser);

// admin xóa user
router.delete("/:id", authenticate, permit("admin"), deleteUser);

module.exports = router;
