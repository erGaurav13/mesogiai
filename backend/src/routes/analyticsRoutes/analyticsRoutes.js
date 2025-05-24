const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/index.middleware');
const { AnalyticsController } = require('../../controller/index.controller');

// Get issue count per category
router.get('/category-count', auth, (req, res) =>
  AnalyticsController.getIssuesByCategory(req, res)
);

// Get daily submissions for last 7 days
router.get('/daily-submissions', auth, (req, res) =>
  AnalyticsController.getDailySubmissions(req, res)
);

// Get most voted issues by category
router.get('/most-voted', auth, (req, res) =>
  AnalyticsController.getMostVotedIssues(req, res)
);

module.exports = router;