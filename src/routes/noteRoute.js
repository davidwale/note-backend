const express = require('express');
const authMiddleware = require('../middleware/auth')
const router = express.Router();
const UserInfo = require('../model/userDetails')

router.get("/notes", authMiddleware, async (req, res) => {
  try {
    const user = await UserInfo.findOne({ email: req.userId });
    const notes = user.notes;
    res.send(notes);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});


router.post("/notes", authMiddleware, async (req, res) => {
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

router.delete("/notes/:id", authMiddleware, async (req, res) => {
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

module.exports = router;