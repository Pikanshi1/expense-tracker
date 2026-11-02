const Notification = require("../models/notification");
const Expense = require("../models/expense");
const AdaptiveBudget = require("../models/AdaptiveBudget");
const { calculateAdaptiveBudget, partsFor } = require("../services/adaptiveBudgetService");

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
const createNotification = async (userId, title, message, type = "info", dedupeKey = "") => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      dedupeKey,
    });
  } catch (error) {
    if (error.code !== 11000) console.error("Notification creation failed:", error.message);
  }
};

const evaluateAdaptiveNotifications = async (userId, options = {}) => {
  const budget = await AdaptiveBudget.findOne({ user: userId }).sort({ year: -1, month: -1 }).lean();
  if (!budget || !budget.notificationsEnabled) return;
  const calculation = await calculateAdaptiveBudget(userId, { timezone: budget.timezone, now: options.now });
  const dayKey = calculation.date;
  if (options.daily) {
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: budget.timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(options.now || new Date());
    if (time === budget.notificationTime) {
      await createNotification(userId, "Daily spending allowance", `Your spending allowance for today is ₹${Math.round(calculation.dailyAllowance)}.`, "info", `daily:${dayKey}`);
    }
    if (options.changeType === "Income" || (options.changeType === "Expense" && calculation.exceededBy > 0)) {
      await createNotification(userId, "Daily allowance updated", `Your new daily spending allowance is ₹${Math.round(calculation.futureDailyAllowance)}.`, "info", `allowance:${dayKey}:${Math.round(calculation.futureDailyAllowance)}`);
    }
  }
  let threshold = "";
  if (calculation.dailyAllowance > 0) {
    if (calculation.percentageUsed >= 100) threshold = "exceeded";
    else if (calculation.percentageUsed >= 80) threshold = "80";
    else if (calculation.percentageUsed >= 50) threshold = "50";
  }
  if (threshold) {
    const messages = {
      50: ["50% of daily allowance used", "You've used 50% of today's spending allowance.", "warning"],
      80: ["80% of daily allowance used", "You've used 80% of today's spending allowance. Spend carefully.", "warning"],
      exceeded: ["Daily allowance exceeded", `You've exceeded today's spending allowance by ₹${Math.round(calculation.exceededBy)}.`, "danger"],
    };
    const [title, message, type] = messages[threshold];
    await createNotification(userId, title, message, type, `threshold:${dayKey}:${threshold}`);
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
  evaluateAdaptiveNotifications,
};
