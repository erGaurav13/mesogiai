const express = require('express');
const CORS = require('cors');
const app = express();
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const AllRoutes = require('./src/routes/index.routes');

require('dotenv').config();

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 1000 });

// Logging requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware
app.use(helmet()); // For securing HTTP headers
app.use(compression()); // To compress the response body
app.use(Cors({
  origin: 'http://localhost:5173', // allow your frontend
  credentials: true                // if using cookies or auth headers
}));
 // For Cross-Origin Resource Sharing
app.use(express.urlencoded({ extended: true })); // For handling URL-encoded data
app.use(express.json({ limit: '10kb' })); // For handling JSON data
app.use(limiter); // For rate limiting requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Timeout handler
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(408).send('Request Timeout');
  });
  next();
});

// Routes

app.use('/api', AllRoutes.IssueRoutes);
app.use('/api/auth', AllRoutes.authRoutes);
app.use('/api/vote', AllRoutes.VoteRoutes);
app.use('/api/analytics', AllRoutes.AnalyticsRoutes);

app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'ok',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: Date.now(),
  };
  res.json(healthStatus);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Graceful shutdown

module.exports = app;
