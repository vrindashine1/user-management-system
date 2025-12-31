const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../middleware/auth");
const error = require("../middleware/errorHandler");
const { isValidEmail, isStrongPassword } = require("../utils/validators");

const router = express.Router();

/* VIEW PROFILE */
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, data: user });
});

/* UPDATE PROFILE */
router.put("/profile", auth, async (req, res) => {
  const { fullName, email } = req.body;

  if (email && !isValidEmail(email))
    return error(res, 400, "Invalid email format");

  await User.findByIdAndUpdate(req.user.id, { fullName, email });
  res.json({ success: true, message: "Profile updated" });
});

/* CHANGE PASSWORD */
router.put("/change-password", auth, async (req, res) => {
  if (!isStrongPassword(req.body.password))
    return error(res, 400, "Password not strong enough");

  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.findByIdAndUpdate(req.user.id, { password: hashed });

  res.json({ success: true, message: "Password changed" });
});

module.exports = router;

