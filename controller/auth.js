const jwt = require("jsonwebtoken");
const User = require("../model/user"); // Assuming user.js is your User schema
const crypto = require("crypto"); // For generating referral codes

const { jwtSecret } = require("../config/env");

const JWT_SECRET = jwtSecret;

// Register API for admin
exports.register = async (req, res, next) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    let referralCode = crypto.randomBytes(4).toString("hex");

    let match = true;
    while (!match) {
      const userByReferralCode = User.findOne({ referralCode });
      if (!userByReferralCode) {
        match = false;
        break;
      } else {
        referralCode = crypto.randomBytes(4).toString("hex");
      }
    }
    if (referredBy) {
      const referralUser = await User.findOne({ referralCode: referredBy });
      if (!referralUser) {
        return res.status(400).json({ message: "Refer code is not exist" });
      }
    }
    // Create a new user
    user = new User({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      role: 1,
      referralCode,
    });

    // Save the user to the database
    await user.save();

    // Create JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Login API
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT Token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    let data = user.toObject();
    delete data.password;
    res.json({ token, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Middleware to protect routes
exports.authMiddleware = (role) => {
  return async (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded._id;
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(409).json({
          message: "User not found",
        });
      }
      if (user?.role != role) {
        return res.status(409).json({
          message: "Role not have access",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid" });
    }
  };
};
