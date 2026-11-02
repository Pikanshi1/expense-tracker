const mongoose = require("mongoose");

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
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profileImage: {
        type: String,
        default: ""
    },
    passwordResetTokenHash: {
        type: String,
        default: null,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        default: null,
        select: false
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;