const express = require('express');
const router = express.Router();
const { VoteController } = require('../../controller/index.controller');
const { auth } = require('../../middleware/index.middleware');

// Upvote an issue
router.post('/issues/:issueId/upvote', auth, (req, res) => 
  VoteController.upvote(req, res)
);

// Remove vote from issue
router.delete('/issues/:issueId/vote', auth, (req, res) => 
  VoteController.removeVote(req, res)
);

// Check user's vote status for an issue
router.get('/issues/:issueId/vote-status', auth, (req, res) => 
  VoteController.getVoteStatus(req, res)
);

module.exports = router;