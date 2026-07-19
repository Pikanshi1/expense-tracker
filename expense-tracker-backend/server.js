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
const helmet = require("helmet");
const rateLimit=require("express-rate-limit");

const limiter=rateLimit({
    windowMs:15*60*1000, //15 minutes
    max:100 // limit each IP to 100 requests per windowMs
});

connectDB();
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/goals", goalRoutes);


app.get("/", (req, res) => {
    res.send("Expense Tracker Backend Running...");
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});