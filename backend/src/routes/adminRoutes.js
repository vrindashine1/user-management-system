const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

/* GET USERS WITH PAGINATION */
router.get("/users", auth, role("admin"), async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;

  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-password");

  const total = await User.countDocuments();

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    },
  });
});

/* ACTIVATE USER */
router.patch("/users/:id/activate", auth, role("admin"), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "active" });
  res.json({ success: true, message: "User activated" });
});

/* DEACTIVATE USER */
router.patch("/users/:id/deactivate", auth, role("admin"), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "inactive" });
  res.json({ success: true, message: "User deactivated" });
});

module.exports = router;
