const mongoose = require("mongoose");
const User = require("../Model/user.model.js");
const bcryptjs = require("bcryptjs");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
dotenv.config();
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // 1. Ensure only email and password are being used

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcryptjs.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is correctly set in your environment variables
      { expiresIn: "1h" }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.log(error); // Log the error to debug
    res.status(500).json({ message: "Failed to log in", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { UserId } = req.user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          message: "Please provide both current password and new password",
        });
    }
    const user = await User.findById(UserId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update password", error });
  }
};
