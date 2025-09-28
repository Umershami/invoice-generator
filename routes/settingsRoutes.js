import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get user settings
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update user settings
// ✅ Update user settings
router.put("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Profile update
    if (req.body.name) {
      const [firstName, ...lastNameParts] = req.body.name.split(" ");
      user.firstName = firstName;
      user.lastName = lastNameParts.join(" ");
    }
    if (req.body.email) user.email = req.body.email;

    // ✅ Password update: only if new password provided
    if (req.body.password && req.body.password.trim() !== "") {
      user.password = req.body.password; // plain-text -> hashed in pre-save
    }

    // Company update
    if (req.body.companyName) user.companyName = req.body.companyName;
    if (req.body.address) user.address = req.body.address;
    if (req.body.taxId) user.taxId = req.body.taxId;

    const updatedUser = await user.save();
    res.json({ message: "Settings updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
