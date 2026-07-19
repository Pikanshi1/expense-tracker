const mongoose = require("mongoose");

// Create the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
   type: String,
   default: ""
    }

}, {
    timestamps: true
});

// Create the model
const User = mongoose.model("User", userSchema);

// Export it
module.exports = User;