const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  monthlySummary,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);

router.put("/:id", protect, markAsRead);

router.delete("/:id", protect, deleteNotification);

router.delete("/", protect, clearNotifications);

router.get(
  "/monthly-summary",
  protect,
  monthlySummary
);

router.patch(
"/read-all",
protect,
markAllAsRead
);


module.exports = router;