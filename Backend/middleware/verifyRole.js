module.exports = (allowedRole) => {
  return (req, res, next) => {

    //  Check token exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    //  Only allow these 2 roles in system
    const validRoles = ["user", "restaurant"];
    if (!validRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Invalid system role detected. Access denied." });
    }

    //  Ensure user is accessing correct portal
    if (req.user.role !== allowedRole) {
      return res.status(403).json({
        message: `Access denied. Only ${allowedRole} can access this portal.`
      });
    }

    next();
  };
};
