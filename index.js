const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "fkgfdkfogd{}234jgkmmmmmkdjgfgfncddjsasqw87";


// connection link to mongoose 
mongoose.connect("mongodb+srv://davidwale2003:david-notes@cluster1.peh0jab.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserInfo = require("./userDetails");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.email;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
};

app.post("/signup", async (req, res) => {
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




app.post("/", async (req, res) => {
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

app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const user = await UserInfo.findOne({ email: req.userId });
    const notes = user.notes;
    res.send(notes);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/notes", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const user = await UserInfo.findOne({ email: req.userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const newNote = {
      sequenceNumber: user.notes.length,
      title,
      content,
    };

    user.notes.push(newNote);
    await user.save();

    res.send({ message: "Note added successfully", note: newNote });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});


app.delete("/notes/:id", authMiddleware, async (req, res) => {
  const noteId = req.params.id;
  try {
    const user = await UserInfo.findOne({ email: req.userId }).populate("notes");

    const noteToDelete = user.notes.find((note) => note.sequenceNumber.toString() === noteId);
    if (!noteToDelete) {
      return res.status(404).send({ message: "Note not found" });
    }

    const noteIndex = user.notes.indexOf(noteToDelete);
    user.notes.splice(noteIndex, 1);
    await user.save();

    res.send({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/userinfo", authMiddleware, async (req, res) => {
  try {
    const user = await UserInfo.findOne({ email: req.userId });
    const firstName = user.fname;
    res.send({ firstName });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});


  // 