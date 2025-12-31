const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const error = require("../middleware/errorHandler");
const { isValidEmail, isStrongPassword } = require("../utils/validators");

const router = express.Router();

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return error(res, 400, "All fields are required");

    if (!isValidEmail(email))
      return error(res, 400, "Invalid email format");

    if (!isStrongPassword(password))
      return error(res, 400, "Password must be strong");

    const exists = await User.findOne({ email });
    if (exists)
      return error(res, 409, "Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ success: true, token });
  } catch {
    error(res, 500, "Signup failed");
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return error(res, 401, "Invalid credentials");

    if (user.status === "inactive")
      return error(res, 403, "Account is deactivated");

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return error(res, 401, "Invalid credentials");

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });
  } catch {
    error(res, 500, "Login failed");
  }
});

/* CURRENT USER */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, data: user });
});

/* LOGOUT */
router.post("/logout", auth, (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
