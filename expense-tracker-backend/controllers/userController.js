const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { createNotification } = require("./notificationController");
const crypto = require("crypto");
const sendPasswordResetEmail = require("../utils/sendPasswordResetEmail");


const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();

        // Validation
        if (!name || !normalizedEmail || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        if (String(password).length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters and include an uppercase letter and a number" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword
        });

        // Save user
        await user.save();

        res.status(201).json({
            message: "User Registered Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid Email or Password"
            });

        }

        // Generate Token
        const token = generateToken(user._id);

        res.status(200).json({

            message: "Login Successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                profileImage: user.profileImage,
            }

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    await createNotification(
  req.user.id,
  "Profile Updated",
  "Your profile has been updated successfully.",
  "success"
);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    user.profileImage = `/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.profileImage = "";

    await user.save();

    res.status(200).json({
      message: "Profile image removed successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (String(newPassword).length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({ message: "New password must be at least 8 characters and include an uppercase letter and a number" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    await createNotification(
  req.user.id,
  "Password Changed",
  "Your password has been changed successfully.",
  "warning"
);

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};



const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.FRONTEND_URL) {
      return res.status(503).json({ message: "Password reset is temporarily unavailable. Please try again later." });
    }

    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

      user.passwordResetTokenHash = tokenHash;
      user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const frontendUrl = process.env.FRONTEND_URL.endsWith("/") ? process.env.FRONTEND_URL.slice(0, -1) : process.env.FRONTEND_URL;
      const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

      try {
        await sendPasswordResetEmail(user.email, resetUrl);
      } catch (emailError) {
        user.passwordResetTokenHash = null;
        user.passwordResetExpires = null;
        await user.save();
        throw emailError;
      }
    }

    return res.status(200).json({
      message: "If an account exists for that email, a password reset link has been sent."
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Unable to process your request right now." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "A reset token and new password are required" });
    }

    if (String(password).length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include an uppercase letter and a number"
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    }).select("+passwordResetTokenHash +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ message: "This password reset link is invalid or has expired. Request a new one." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ message: "Unable to reset your password right now." });
  }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
};

