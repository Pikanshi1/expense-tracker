const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const goalRoutes = require("./routes/goalRoutes");
const smartRoutes = require("./routes/smartRoutes");
const AdaptiveBudget = require("./models/AdaptiveBudget");
const { evaluateAdaptiveNotifications } = require("./controllers/notificationController");
const helmet = require("helmet");
const rateLimit=require("express-rate-limit");
const path = require("path");

const requiredEnvironment = ["MONGO_URL", "JWT_SECRET", "FRONTEND_URL"];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);
if (!process.env.SMTP_USER && !process.env.EMAIL_USER) missingEnvironment.push("SMTP_USER or EMAIL_USER");
if (!process.env.SMTP_APP_PASSWORD && !process.env.EMAIL_PASS) missingEnvironment.push("SMTP_APP_PASSWORD or EMAIL_PASS");
if (missingEnvironment.length) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
}

const limiter=rateLimit({
    windowMs:15*60*1000, //15 minutes
    max:100 // limit each IP to 100 requests per windowMs
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://expense-tracker-five-silk-48.vercel.app",
  "https://expense-tracker-git-main-pikanshi1s-projects.vercel.app",
  "https://expense-tracker-1hp1y1t4f-pikanshi1s-projects.vercel.app",
  ...process.env.FRONTEND_URL.split(",").map((origin) => origin.trim()),
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(limiter);
app.use(express.json({ limit: "1mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/smart", smartRoutes);


app.get("/", (req, res) => {
    res.send("Expense Tracker Backend Running...");
});

app.get("/health", (req, res) => {
  const database = connectDB.readyState() === 1 ? "connected" : "disconnected";
  res.status(database === "connected" ? 200 : 503).json({
    status: "ok",
    database,
  });
});

const PORT = process.env.PORT || 5000;

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
  return res.status(status).json({ message: error.code === "LIMIT_FILE_SIZE" ? "Receipt image must be 5 MB or smaller." : "Request could not be processed." });
});

let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    const runDailyNotifications = async () => {
      const budgets = await AdaptiveBudget.find({ notificationsEnabled: true }).select("user").lean();
      await Promise.all(budgets.map((budget) => evaluateAdaptiveNotifications(budget.user.toString(), { daily: true })));
    };
    setInterval(() => runDailyNotifications().catch((error) => console.error("Scheduled notification job failed:", error.message)), 60 * 1000);
  })
  .catch((error) => {
    console.error("Database startup failed:", error.message);
    process.exit(1);
  });

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);
  if (!server) {
    process.exit(0);
    return;
  }
  server.close(() => process.exit(0));
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));