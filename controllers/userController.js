const User = require("../models/User"); // Assuming you have a User model
const jwt = require("jsonwebtoken");

const getUserProfile = async (req, res) => {
  try {
    const userId=req.user.id;

    // Find the user by ID
    const user = await User.findById(userId).select("-password"); // Don't send password in the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Return the user's details
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile };
