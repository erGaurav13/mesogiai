const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Use env var in production
const EXPIRES_IN = "7d"; // Token expiry

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode in token
 * @param {String} [expiresIn] - Optional expiry
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn = EXPIRES_IN) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

/**
 * Verify JWT Token
 * @param {String} token - Token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If invalid or expired
 */
const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

/**
 * Decode JWT Token without verifying signature
 * @param {String} token - Token to decode
 * @returns {Object} Decoded payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
