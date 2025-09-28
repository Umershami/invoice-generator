// backend/routes/authRoutes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// ✅ User Signup & Login Routes
router.post("/signup", signup);
router.post("/login", login);

// ✅ Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Logout Route
router.post("/logout", logout);

// =====================
// Google OAuth Routes
// =====================

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  async (req, res) => {
    try {
      // ✅ Generate JWT token
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // ✅ Set secure cookie for live site
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS required in production
        sameSite: "None", // For cross-origin (frontend + backend)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // ✅ Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    } catch (err) {
      console.error("Google OAuth error:", err);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
  }
);

export default router;
