const Response = require('../responseHandeler');
const VoteService = require('./vote.service');

class VoteController {
  async upvote(req, res) {
    try {
      const issueId = req.params.issueId;
      const userId = req.user.id; // From auth middleware

      const result = await VoteService.upvoteIssue(issueId, userId);
      Response.success(res, result, 'Vote added successfully');
    } catch (error) {
      Response.failure(res, error.message, 400);
    }
  }

  async removeVote(req, res) {
    try {
      const issueId = req.params.issueId;
      const userId = req.user.id;

      const result = await VoteService.removeVote(issueId, userId);
      Response.success(res, result, 'Vote removed successfully');
    } catch (error) {
      Response.failure(res, error.message, 400);
    }
  }

  async getVoteStatus(req, res) {
    try {
      const issueId = req.params.issueId;
      const userId = req.user.id;

      const result = await VoteService.getUserVoteStatus(issueId, userId);
      Response.success(res, result, 'Vote status retrieved');
    } catch (error) {
      Response.failure(res, error.message, 400);
    }
  }
}

module.exports = new VoteController();
