const Expense = require("../models/expense");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const Budget = require("../models/Budget");
const { createNotification } = require("./notificationController");
const Notification = require("../models/notification");

const exportPDF = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    if (expenses.length === 0) {
      return res.status(404).json({
        message: "No expenses found",
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach((expense) => {
      if (expense.type === "Income") {
        totalIncome += expense.amount;
      } else {
        totalExpense += expense.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Expense_Report.pdf",
    );

    doc.pipe(res);

    // Title
    doc.fontSize(22).text("Expense Tracker Report", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Generated On: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    doc.text(`Total Income : ₹${totalIncome}`);

    doc.text(`Total Expense : ₹${totalExpense}`);

    doc.text(`Balance : ₹${balance}`);

    doc.text(`Transactions : ${expenses.length}`);

    doc.moveDown();

    doc.fontSize(16).text("Transactions");

    doc.moveDown();

    expenses.forEach((expense) => {
      doc.fontSize(12).text(
        `${expense.title}

Amount : ₹${expense.amount}

Category : ${expense.category}

Type : ${expense.type}

Date : ${expense.date.toDateString()}

------------------------------------`,
      );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const exportCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    if (expenses.length === 0) {
      return res.status(404).json({
        message: "No expenses found",
      });
    }

    const fields = [
      "title",
      "amount",
      "type",
      "category",
      "description",
      "date",
    ];

    const parser = new Parser({
      fields,
    });

    const csv = parser.parse(expenses);

    res.header("Content-Type", "text/csv");

    res.attachment("expenses.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date, type } = req.body;

    // Validation
    if (!title || !amount || !category || !type) {
      return res.status(400).json({
        message: "Title, amount, category and type are required",
      });
    }

    // Create Expense
    const expense = await Expense.create({
      title,
      amount,
      category,
      type,
      description,
      date,
      user: req.user.id,
    });

    // Only check budget for expenses
    // Welcome notification
    const count = await Expense.countDocuments({
      user: req.user.id,
    });

    if (count === 1) {
      await createNotification(
        req.user.id,
        "🎉 Welcome",
        "Congratulations on adding your first transaction!",
        "success",
      );
    }

    // Large expense notification
    if (type === "Expense" && amount >= 10000) {
      await createNotification(
        req.user.id,
        "💸 Large Expense",
        `You spent ₹${amount} on ${category}.`,
        "info",
      );
    }

    // Salary notification
    if (type === "Income" && category === "Salary") {
      await createNotification(
        req.user.id,
        "💰 Salary Received",
        `₹${amount} has been added to your account.`,
        "success",
      );
    }

    // Budget notifications
    if (type === "Expense") {
      const expenseDate = date ? new Date(date) : new Date();

      const month = expenseDate.getMonth();
      const year = expenseDate.getFullYear();

      const budget = await Budget.findOne({
        user: req.user.id,
        category,
        month,
        year,
      });

      if (budget) {
        const totalSpent = await Expense.aggregate([
          {
            $match: {
              user: expense.user,
              category,
              type: "Expense",
              $expr: {
                $and: [
                  { $eq: [{ $month: "$date" }, month + 1] },
                  { $eq: [{ $year: "$date" }, year] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const spent = totalSpent[0]?.total || 0;

        if (type === "Expense" && amount >= 10000) {
          await createNotification(
            req.user.id,
            "Large Expense",
            `You spent ₹${amount} on ${category}.`,
            "info",
          );
        }

        if (type === "Income" && category === "Salary") {
          await createNotification(
            req.user.id,
            "Salary Received",
            `₹${amount} has been added to your account.`,
            "success",
          );
        }

        const count = await Expense.countDocuments({
          user: req.user.id,
        });

        if (count === 1) {
          await createNotification(
            req.user.id,
            "Welcome",
            "Congratulations on adding your first expense!",
            "success",
          );
        }

        const existingWarning = await Notification.findOne({
          user: req.user.id,
          title: "Budget Warning",
          message: { $regex: category },
        });

        const existingExceeded = await Notification.findOne({
          user: req.user.id,
          title: "Budget Exceeded",
          message: { $regex: category },
        });

        if (spent >= budget.amount && !existingExceeded) {
          await createNotification(
            req.user.id,
            "Budget Exceeded",
            `You have exceeded your ${category} budget.`,
            "danger",
          );
        } else if (
          spent >= budget.amount * 0.8 &&
          spent < budget.amount &&
          !existingWarning
        ) {
          await createNotification(
            req.user.id,
            "Budget Warning",
            `You have used ${Math.round(
              (spent / budget.amount) * 100,
            )}% of your ${category} budget.`,
            "warning",
          );
        }
      }
    }

    res.status(201).json({
      message: "Expense Added Successfully",
      expense,
    });
  } catch (error) {
    console.log("ADD EXPENSE ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to view this expense",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const {
      search,
      category,
      type,
      startDate,
      endDate,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Base query (only logged-in user's expenses)
    const query = {
      user: req.user.id,
    };

    // Search by title
    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Date filter
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte = new Date(startDate);
      }

      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Sorting
    let sortOption = { date: -1 };

    if (sort === "oldest") {
      sortOption = { date: 1 };
    }

    if (sort === "highest") {
      sortOption = { amount: -1 };
    }

    if (sort === "lowest") {
      sortOption = { amount: 1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const expenses = await Expense.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalExpenses = await Expense.countDocuments(query);

    res.status(200).json({
      currentPage: Number(page),

      totalPages: Math.ceil(totalExpenses / Number(limit)),

      totalExpenses,

      expenses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the expense
    const expense = await Expense.findById(id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Check if the logged-in user owns this expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this expense",
      });
    }

    // Update the expense
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Delete expense
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDashboard = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach((expense) => {
      if (expense.type === "Income") {
        totalIncome += expense.amount;
      } else {
        totalExpense += expense.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    const recentTransactions = expenses
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    res.status(200).json({
      totalIncome,

      totalExpense,

      balance,

      totalTransactions: expenses.length,

      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach((expense) => {
      if (expense.type === "Income") {
        totalIncome += expense.amount;
      } else {
        totalExpense += expense.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    // Category Breakdown
    const categoryMap = {};

    expenses.forEach((expense) => {
      if (expense.type === "Expense") {
        categoryMap[expense.category] =
          (categoryMap[expense.category] || 0) + expense.amount;
      }
    });

    const categoryBreakdown = Object.keys(categoryMap).map((category) => ({
      category,
      total: categoryMap[category],
    }));

    // Monthly Expenses
    const monthMap = {};

    expenses.forEach((expense) => {
      if (expense.type === "Expense") {
        const month = new Date(expense.date).toLocaleString("default", {
          month: "short",
        });

        monthMap[month] = (monthMap[month] || 0) + expense.amount;
      }
    });

    const monthlyExpenses = Object.keys(monthMap).map((month) => ({
      month,
      total: monthMap[month],
    }));

    const recentTransactions = expenses
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    res.status(200).json({
      summary: {
        totalIncome,
        totalExpense,
        balance,
        totalTransactions: expenses.length,
      },

      categoryBreakdown,

      monthlyExpenses,

      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDashboard,
  getAnalytics,
  exportCSV,
  exportPDF,
};
