const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const UserInfo = require('../model/userDetails')

router.get("/userinfo", authMiddleware, async (req, res) => {
  try {
    const user = await UserInfo.findOne({ email: req.userId });
    const firstName = user.fname;
    res.send({ firstName });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;