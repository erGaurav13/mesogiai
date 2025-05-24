const authService = require('./auth.service');
const mongoose = require('mongoose');
class AuthController {
  async signup(req, res) {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        throw new Error('Email must be in a valid format (e.g., user@example.com)');
      }

      // Validate password requirements
      const password = req.body.password;
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new Error('Password must contain at least one special character');
      }
      if (!/\d/.test(password)) {
        throw new Error('Password must contain at least one number');
      }

      const _id = new mongoose.Types.ObjectId().toString();
      const result = await authService.signup({ ...req.body, _id });
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
