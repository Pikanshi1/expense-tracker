const express = require("express");
const rateLimit = require("express-rate-limit");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();
const {
    registerUser,
    loginUser,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
    changePassword,
    forgotPassword,
    resetPassword,
} = require("../controllers/userController");

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many password reset attempts. Please try again later." }
});

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Protected Route",
        user: req.user
    });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, resetPassword);
router.put("/profile", protect, updateProfile);
router.put("/profile/image", protect, upload.single("profileImage"), uploadProfileImage);
router.delete("/profile/image", protect, removeProfileImage);
router.put("/change-password", protect, changePassword);

module.exports = router;
