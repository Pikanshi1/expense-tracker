const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createRecurring,
  getRecurring,
  deleteRecurring,
} = require("../controllers/recurringController");

const router = express.Router();

router.post("/", protect, createRecurring);

router.get("/", protect, getRecurring);

router.delete("/:id", protect, deleteRecurring);

module.exports = router;