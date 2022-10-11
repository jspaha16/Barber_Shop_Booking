const router = require("express").Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

const { User } = require("../db/models");

//Login route
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    res.status(400).json({ message: "All fields must be filled" });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ message: "Incorrect email" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    res.status(400).json({ message: "Invalid credentials" });
  } else {

    res
      .status(200)
      .json({ id: user._id, email, userType: user.userType });
  }
});

//Signup route
router.post("/signup", async (req, res, next) => {
  const { fname, lname, email, password, phone, userType } = req.body;

  // validation
  if (!fname || !lname || !email || !password || !phone || !userType) {
    res.status(400).json({ message: "All fields must be filled" });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email" });
    return;
  }

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400).json({ message: "Email already in use" });
    return;
  }

  // encrypting/hashing password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    // creating userF
    const user = await User.create({
      fname,
      lname,
      email,
      phone,
      password: hash,
      userType,
    });

    res
      .status(200)
      .json({ id: user._id, email, userType: user.userType });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
