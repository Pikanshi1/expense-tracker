const Goal = require("../models/Goal");
const { createNotification } = require("./notificationController");

// Create Goal
const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    const goal = await Goal.create({
      user: req.user.id,
      title,
      targetAmount,
      deadline,
      savedAmount: 0,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(goals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Goal
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    goal.title = req.body.title || goal.title;
    goal.targetAmount =
      req.body.targetAmount || goal.targetAmount;
    goal.deadline = req.body.deadline || goal.deadline;

    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Goal
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await goal.deleteOne();

    res.json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Savings
const addSavings = async (req, res) => {
  try {
    const { amount } = req.body;

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    goal.savedAmount += Number(amount);

    if (goal.savedAmount >= goal.targetAmount) {
      goal.savedAmount = goal.targetAmount;
      goal.completed = true;

      await createNotification(
        req.user.id,
        "🎉 Goal Completed",
        `Congratulations! You completed your "${goal.title}" savings goal.`,
        "success"
      );
    }

    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dashboard Goal Summary
const getGoalSummary = async (req, res) => {
  try {
    const totalGoals = await Goal.countDocuments({
      user: req.user.id,
    });

    const completedGoals = await Goal.countDocuments({
      user: req.user.id,
      completed: true,
    });

    const activeGoals = totalGoals - completedGoals;

    const totalTarget = await Goal.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$targetAmount",
          },
        },
      },
    ]);

    const totalSaved = await Goal.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$savedAmount",
          },
        },
      },
    ]);

    res.json({
      totalGoals,
      activeGoals,
      completedGoals,
      totalTarget: totalTarget[0]?.total || 0,
      totalSaved: totalSaved[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  addSavings,
  getGoalSummary,
};