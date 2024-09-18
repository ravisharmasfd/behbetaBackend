const jwt = require('jsonwebtoken');
const User = require('../model/user'); // Assuming user.js is your User schema
const { jwtSecret } = require('../config/env');

const JWT_SECRET = jwtSecret

// Register API
exports.register =async (req, res) => {
  const { first_name, last_name, email, password, phone_number, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    user = new User({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      role
    });

    // Save the user to the database
    await user.save();

    // Create JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

// Login API
exports.login =  async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

// Middleware to protect routes
exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


