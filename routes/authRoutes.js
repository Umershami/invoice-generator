// backend/routes/authRoutes.js
import express from "express";
import { signup, login,forgotPassword,resetPassword } from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  async (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // ✅ Send to frontend with token
      res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
    } catch (err) {
      console.error("Google OAuth error:", err);
      res.redirect("http://localhost:5173/login?error=google_auth_failed");
    }
  }
);

export default router;
