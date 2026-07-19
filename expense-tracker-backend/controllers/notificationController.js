const Notification = require("../models/notification");
const Expense = require("../models/Expense");

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create notification
const createNotification = async (userId, title, message, type = "info") => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
    });
  } catch (error) {
    console.log(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json({
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete one notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await notification.deleteOne();

    res.json({
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete all notifications
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user.id,
    });

    res.json({
      message: "All notifications cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const monthlySummary = async (req, res) => {
  try {
    const today = new Date();

    const start = new Date(today.getFullYear(), today.getMonth(), 1);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: start },
    });

    let income = 0;
    let expense = 0;

    expenses.forEach((item) => {
      if (item.type === "Income") {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    });

    const savings = income - expense;

    await Notification.create({
      user: req.user.id,
      title: "Monthly Summary",
      message: `This month you spent ₹${expense} and saved ₹${savings}.`,
      type: "info",
    });

    res.json({
      message: "Summary created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },

      {
        $set: {
          isRead: true,
        },
      },
    );

    res.json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  monthlySummary,
};
