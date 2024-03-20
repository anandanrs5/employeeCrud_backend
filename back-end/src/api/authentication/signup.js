const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const Users = require("../../models/user");

const isEmailNotInUse = async (value) => {
  const user = await Users.findByEmail(value);
  if (user) {
    return Promise.reject("Email is already in use");
  }
  return Promise.resolve();
};

const signupValidation = [
  body("fullname")
    .isString()
    .notEmpty()
    .isLength({ min: 2, max: 25 })
    .withMessage("Full name must be between 2 and 25 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid Email, example:abc@gmail.com")
    .custom(isEmailNotInUse),

  body("phone")
    .isNumeric()
    .notEmpty()
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("password")
    .isString()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

router.post("/", signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const signupDetails = req.body;
    const hashedPassword = await bcrypt.hash(signupDetails.password, 10);
    signupDetails.password = hashedPassword;

    const signup = new Users(signupDetails);
    const savedUser = await signup.save();
    const authenticateUserData = {
      id: savedUser._id,
      username: savedUser.fullname,
      email: savedUser.email,
    };
    const token = jwt.sign(authenticateUserData, secretKey, {
      expiresIn: "8h",
    });

    const responseObj = {
      id: savedUser._id,
      username: savedUser.fullname,
      email: savedUser.email,
      token: token,
      message: "signup success",
    };
    res.json(responseObj);
  } catch (error) {
    return res.status(500).json({ error: "Unable to save data" });
  }
});

module.exports = router;
