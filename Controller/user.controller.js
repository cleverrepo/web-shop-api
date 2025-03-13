const mongoose = require("mongoose");
const User = require("../Model/user.model.js");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const { response } = require("express");
const nodemailer = require("nodemailer");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
});
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const verification = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    const newUser = new User({
      name,
      email,
      verification,
      password: hashedPassword,
      verificationExpires,
    });

    await newUser.save();
    generateToken(res, newUser._id);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Welcome, ${name}! 🎉</h2>
          <p style="font-size: 16px; color: #555;">Thank you for signing up! Use the verification code below to verify your email:</p>
          <h3 style="color: #fff; background: #28a745; padding: 10px; display: inline-block; border-radius: 5px;">
            ${verification}
          </h3>
          <p style="font-size: 14px; color: #777;">This code will expire in 3 minutes.</p>
          <p style="color: #777;">If you didn’t request this, please ignore this email.</p>
        </div>
      </div>
    `,

    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      sucess: true,
      message: "User registered successfully",
      newUser: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
};

  exports.resendVerificationCode = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Check if user is already verified
      if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }
  
      // Check if the existing verification code is still valid
      if (user.verificationExpires && user.verificationExpires > Date.now()) {
        return res.status(400).json({
          message: "A verification code was already sent. Please wait before requesting a new one.",
        });
      }
  
      // Generate new verification code
      const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const newVerificationExpires = new Date(Date.now() + 3 * 60 * 1000); // Code expires in 3 minutes
  
      // Update user data
      user.verification = newVerificationCode;
      user.verificationExpires = newVerificationExpires;
      await user.save();
  
      // Send email with the new verification code
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Resend Verification Code",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">Welcome to Our App! 🎉</h2>
            <p style="font-size: 16px; color: #555;">Thank you for signing up! Use the verification code below to complete your registration:</p>
            <h3 style="color: #fff; background: #007bff; padding: 10px; display: inline-block; border-radius: 5px;">
              ${newVerificationCode}
            </h3>
            <p style="font-size: 14px; color: #777;">This code will expire in 3 minutes.</p>
            <p style="color: #777;">If you didn’t request this, please ignore this email.</p>
          </div>
        </div>
      `,
        text: `Your new verification code is: ${newVerificationCode}`,
      };
  
      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "New verification code sent successfully" });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        res.status(500).json({ message: "Failed to send email. Please try again later." });
      }
    } catch (error) {
      console.error("Error in resending verification code:", error);
      res.status(500).json({ message: "Failed to resend verification code", error: error.message });
    }
  };
  

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateToken(res, existingUser._id);
    // Generate token

    // Send response
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
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
      return res.status(400).json({
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

exports.verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log("Code received:", code);

  try {
    const user = await User.findOne({
      verification: code, 
      verificationExpires: { $gt: Date.now() }, 
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Verification code expired or invalid" });
    }

  
    user.isVerified = true;
    user.verification = undefined; 
    user.verificationExpires = undefined; 

    await user.save(); 

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};
exports.logout=async(req,res)=>{
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out  successfully!" });
}