const express = require("express");
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
} = require("../controllers/userController");


router.get("/profile", protect, (req,res)=>{
res.json({
message:"Protected Route",
user:req.user
});
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/profile",protect,updateProfile);

router.put("/profile/image", protect, upload.single("profileImage"), uploadProfileImage);

router.delete("/profile/image", protect, removeProfileImage);

router.put("/change-password", protect, changePassword);

module.exports = router;