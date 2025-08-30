//authroute.js

import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
dotenv.config();
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(403).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user instance
  const newUser = new User({
    email,
    password: hashedPassword,
    username,
  });

  // Save the new user to the database
  await newUser.save();

  return res
    .status(200)
    .json({ status: true, message: "Successfully registered" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Incorrect Password" });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.KEY,
      { expiresIn: "1d" }
    );
    

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // Respond with token
    res.status(200).json({ status: true, message: "Login Successfully",user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});


export { router as userRouter };