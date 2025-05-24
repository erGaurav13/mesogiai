const { IssueModel } = require('../../model/index.model');
const mongoose = require('mongoose');

class AnalyticsService {
  // Get issue count per category
  async getIssuesByCategory() {
    try {
      const result = await IssueModel.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            category: '$_id',
            count: 1,
            _id: 0
          }
        },
        { $sort: { count: -1 } }
      ]);
      return result;
    } catch (error) {
      throw new Error(`Error getting issues by category: ${error.message}`);
    }
  }

  // Get daily issue submissions for last 7 days
  async getDailySubmissions() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await IssueModel.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            date: '$_id',
            count: 1,
            _id: 0
          }
        },
        { $sort: { date: 1 } }
      ]);
      return result;
    } catch (error) {
      throw new Error(`Error getting daily submissions: ${error.message}`);
    }
  }

  // Get most voted issues by category
  async getMostVotedIssues() {
    try {
      const result = await IssueModel.aggregate([
        {
          $sort: { voteCount: -1 }
        },
        {
          $group: {
            _id: '$category',
            issues: {
              $push: {
                id: '$_id',
                title: '$title',
                voteCount: '$voteCount',
                status: '$status'
              }
            }
          }
        },
        {
          $project: {
            category: '$_id',
            topIssues: { $slice: ['$issues', 3] }, // Get top 3 per category
            _id: 0
          }
        }
      ]);
      return result;
    } catch (error) {
      throw new Error(`Error getting most voted issues: ${error.message}`);
    }
  }
}

module.exports = new AnalyticsService();