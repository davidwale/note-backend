const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserInfo = require('../model/userDetails')

router.post("/signup", async (req, res) => {
  const data = Object.values(req.body);
  const [fname, lname, email, password, userType] = data;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await UserInfo.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ error: { message: "User already exists" } });
    }

    const newUser = new UserInfo({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });

    await newUser.save();

    res.send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
