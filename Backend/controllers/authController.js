const User = require('../models/user');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const jwt = require('jsonwebtoken');

// -------------------- COMMON AUTH HANDLER -------------------- //

// Unified Signup
exports.signup = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !['user', 'restaurant'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const Model = role === 'restaurant' ? Restaurant : User;

    const existing = await Model.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: `${role} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newEntity;

    if (role === 'user') {
      const { userName, phoneNumber } = req.body;
      newEntity = new User({
        userName,
        email,
        phoneNumber,
        password: hashedPassword,
        role: "user"
      });
    } else {
      const { name, restaurantName, phoneNumber, city, state } = req.body;
      newEntity = new Restaurant({
        name,
        email,
        restaurantName,
        phoneNumber,
        city,
        state,
        password: hashedPassword,
        role: "restaurant"
      });
    }

    await newEntity.save();

    // Generate token for auto-login after signup
    const token = jwt.sign(
      { id: newEntity._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare user data
    const userData = {
      id: newEntity._id,
      email: newEntity.email,
      role,
    };

    if (role === "restaurant") {
      userData.name = newEntity.name;
      userData.restaurantName = newEntity.restaurantName;
      userData.phoneNumber = newEntity.phoneNumber;
    } else {
      userData.name = newEntity.userName;
      userData.phoneNumber = newEntity.phoneNumber;
    }

    res.status(201).json({
      message: `${role} registered successfully`,
      token,
      id: newEntity._id,
      user: userData
    });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Unified Login
exports.login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !['user', 'restaurant'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const Model = role === 'restaurant' ? Restaurant : User;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please create an account first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Clean response object (no nulls)
    const userData = {
      id: user._id,
      email: user.email,
      role,
    };

    if (role === "restaurant") {
      userData.name = user.name;
      userData.restaurantName = user.restaurantName;
      userData.phoneNumber = user.phoneNumber;
    } else {
      userData.name = user.userName;
      userData.phoneNumber = user.phoneNumber;
    }

    return res.status(200).json({
      message: `${role} login successful`,
      token,
      id: user._id,      // ✅ easiest way to get id
      user: userData
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =================== RESET PASSWORD ===================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const Model = decoded.role === "restaurant" ? Restaurant : User;

    const hashedPassword = await bcrypt.hash(password, 10);

    await Model.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return res.status(200).json({
      message: "Password reset successful. Please login again."
    });

  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }
};


// =================== FORGOT PASSWORD ===================
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;

    if (!email || !role || !newPassword) {
      return res.status(400).json({ message: "Email, role, and new password are required" });
    }

    // Validate role
    if (!['user', 'restaurant'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const Model = role === "restaurant" ? Restaurant : User;

    // Check if user exists
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: `${role} not found with this email` });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Verify the update by checking if new password matches
    const passwordMatches = await bcrypt.compare(newPassword, user.password);
    if (!passwordMatches) {
      return res.status(500).json({ message: "Password update verification failed" });
    }

    return res.status(200).json({
      message: "Password updated successfully. You can now login with your new password."
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};


