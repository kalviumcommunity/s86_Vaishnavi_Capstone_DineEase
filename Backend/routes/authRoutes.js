const express = require('express');
const router = express.Router();
const {signup,login, forgotPassword,resetPassword} = require('../controllers/authController');
const passport = require('../config/passport');

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
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: "user",
        name: user.userName
      }
    });
  }
);

module.exports = router;