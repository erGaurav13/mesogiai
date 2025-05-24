const authController = require('./AuthController/auth.controller');
const IssueController = require('./IssueController/IssueController');
const VoteController = require('./VoteController/vote.controller');
const AnalyticsController = require('./AnalyticsController/analyticsController');
module.exports = { authController, IssueController, VoteController, AnalyticsController };
