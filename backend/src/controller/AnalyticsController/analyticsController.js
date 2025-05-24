const Response = require('../responseHandeler');
const AnalyticsService = require('./analytics.service');

class AnalyticsController {
  async getIssuesByCategory(req, res) {
    try {
      const data = await AnalyticsService.getIssuesByCategory();
      Response.success(res, data, 'Category-wise issue count retrieved');
    } catch (error) {
      Response.failure(res, error.message, 400);
    }
  }

  async getDailySubmissions(req, res) {
    try {
      const data = await AnalyticsService.getDailySubmissions();
      Response.success(res, data, 'Daily submissions retrieved');
    } catch (error) {
      Response.failure(res, error.message, 400);
    }
  }

  async getMostVotedIssues(req, res) {
    try {
      const data = await AnalyticsService.getMostVotedIssues();
      Response.success(res, data, 'Most voted issues retrieved');
    } catch (error) {
      Response.failure(res, error.message, 400);
    }
  }
}

module.exports = new AnalyticsController();