const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not configured");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected");
    console.log("Connected to database:", mongoose.connection.name);
};

connectDB.readyState = () => mongoose.connection.readyState;

module.exports = connectDB;