const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const UserInfo = require('../model/userDetails')

const JWT_SECRET = "fkgfdkfogd{}234jgkmmmmmkdjgfgfncddjsasqw87";

router.post("/", async (req, res) => {
  const data = Object.values(req.body);
  const [email, password] = data;
  const user = await UserInfo.findOne({ email });

  if (!user) {
    return res.status(401).send({ message: "User not found" });
  }

  if (await bcrypt.compare(password, user.password || "")) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "3h",
    });    const notes = user.notes;
    return res.json({ status: "ok", token, userId: user._id, notes });
  } else {
    return res.status(401).send({ message: "Incorrect password" });
  }
});

module.exports = router;