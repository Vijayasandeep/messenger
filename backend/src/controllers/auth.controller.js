import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  console.log(req.body);
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.lenght < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    }
    else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({ message: "internal servor error" });
  }
  // res.send("Signup Route");
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    generateToken(user._id, res);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log("internal server error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout", error);
    res.status(500).json({ message: "internal server error" });

  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    const uploadRepsonse = await cloudinary.uploader.upload(profilePic);
    const user = await User.findByIdAndUpdate(userId, { profilePic: uploadRepsonse.secure_url }, { new: true });
    res.status(200).json({ message: "Profile pic updated successfully", data: user });
  } catch (error) {
    console.log("Error in updateProfile", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(500).json({ message: "internal server error" });
  }
}