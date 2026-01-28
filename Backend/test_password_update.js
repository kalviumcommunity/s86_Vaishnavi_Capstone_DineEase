const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/user');
const Restaurant = require('./models/Restaurant');

const testPasswordUpdate = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Test with a user email (replace with actual email from your database)
    const testEmail = 'test@example.com'; // Replace with actual email
    const testRole = 'user'; // or 'restaurant'
    const newPassword = 'newpass123';

    console.log('Testing password update for:', { email: testEmail, role: testRole });

    const Model = testRole === 'restaurant' ? Restaurant : User;

    // Find user
    const user = await Model.findOne({ email: testEmail });
    if (!user) {
      console.log('User not found with email:', testEmail);
      await mongoose.disconnect();
      return;
    }

    console.log('User found:', { id: user._id, email: user.email });
    console.log('Current password hash:', user.password);

    // Test old password
    const testOldPassword = 'oldpass123'; // Replace with the old password you know
    const isOldPasswordValid = await bcrypt.compare(testOldPassword, user.password);
    console.log('Old password valid:', isOldPasswordValid);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('New hashed password:', hashedPassword);

    // Update password using the same method as forgot password
    user.password = hashedPassword;
    const saveResult = await user.save();
    console.log('Password updated successfully');

    // Verify new password
    const updatedUser = await Model.findById(user._id);
    console.log('Updated password hash:', updatedUser.password);

    const isNewPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('New password validation:', isNewPasswordValid);

    const isOldStillValid = await bcrypt.compare(testOldPassword, updatedUser.password);
    console.log('Old password still valid (should be false):', isOldStillValid);

    await mongoose.disconnect();
    console.log('Test completed');

  } catch (error) {
    console.error('Test error:', error);
    await mongoose.disconnect();
  }
};

testPasswordUpdate();