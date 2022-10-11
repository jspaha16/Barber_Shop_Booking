const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: { type: String, required: true, unique: true },
  userType: { type: String, enum: ["mg", "bb", "cs"], required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
