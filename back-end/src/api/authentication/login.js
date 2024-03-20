const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const signupUser = await User.findOne({ email });
    if (!signupUser) {
      return res.status(401).json({ error: "Entered account doesn't exists" });
    }
    const passwordMatch = await bcrypt.compare(password, signupUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const authenticateUserData = {
      id: signupUser._id,
      username: signupUser.fullname,
      email: signupUser.email,
    };
    const token = jwt.sign(authenticateUserData, secretKey, {
      expiresIn: "8h",
    });
    const responseObj = {
      id: signupUser._id,
      username: signupUser.fullname,
      email: signupUser.email,
      token: token,
      message: "login success",
    };
    res.json(responseObj);
  } catch (error) {
    return res.status(500).json({ error: "Unable to save data" });
  }
});

module.exports = router;
