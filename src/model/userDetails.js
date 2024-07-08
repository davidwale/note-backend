const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    userType: String,
    notes: [
      {
        sequenceNumber: { type: Number, required: true },
        title: String,
        content: String,
      },
    ],
  },
  {
    collection: "UserInfo",
  }
);

const UserInfo = mongoose.model("UserInfo", UserDetailsSchema);

module.exports = UserInfo;
