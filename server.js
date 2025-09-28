import dotenv from "dotenv";
dotenv.config();   // Load env first!
console.log("SERVER GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import passport from "passport";
import settingsRoutes from "./routes/settingsRoutes.js";
// Passport config (uses env vars, so load AFTER dotenv)
import "./config/passport.js";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",  // ✅ Vite frontend ka address
  credentials: true                
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Connect Database
connectDB();

// Routes
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.use("/api/settings", settingsRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
