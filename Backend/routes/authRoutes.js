const express = require('express');
const router = express.Router();
const {signup,login, forgotPassword,resetPassword} = require('../controllers/authController');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.post('/signup', signup);

router.post('/login', login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// Google Auth start (user clicks login)
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = jwt.sign(
        { id: user._id, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userData = {
        id: user._id,
        email: user.email,
        role: "user",
        name: user.userName
      };

      // Redirect to frontend with token and user data
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectURL = `${frontendURL}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      
      return res.redirect(redirectURL);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendURL}/auth/google/callback?error=${encodeURIComponent('Authentication failed')}`);
    }
  }
);

module.exports = router;