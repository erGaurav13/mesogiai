const { IssueModel } = require('../../model/index.model');

class IssueService {
  // Create new issue
  async createIssue(issueData) {
    try {
      const newIssue = await IssueModel.create(issueData);
      return newIssue;
    } catch (error) {
      throw new Error(`Error creating issue: ${error.message}`);
    }
  }

  // Get paginated/filtered issues
  async getIssues({ page = 1, limit = 10, status, category }) {
    try {
      const query = {};
      if (status) query.status = status;
      if (category) query.category = category;

      const issues = await IssueModel.find(query)
        .populate('author', 'username email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await IssueModel.countDocuments(query);

      return {
        issues,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error fetching issues: ${error.message}`);
    }
  }

  // Get user's issues
  async getUserIssues(userId, { page = 1, limit = 10 }) {
    try {
      const issues = await IssueModel.find({ author: userId })
        .populate('author', 'email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await IssueModel.countDocuments({ author: userId });

      return {
        issues,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error fetching user issues: ${error.message}`);
    }
  }

  // Get single issue details
  async getIssueById(issueId) {
    try {
      const issue = await IssueModel.findById(issueId).populate('author', 'email');
      if (!issue) {
        throw new Error('Issue not found');
      }
      return issue;
    } catch (error) {
      throw new Error(`Error fetching issue: ${error.message}`);
    }
  }

  // Update issue
  // async updateIssue(issueId, updateData, userId) {
  //   try {
  //     const issue = await IssueModel.findById(issueId);
  //     if (!issue) {
  //       throw new Error('Issue not found');
  //     }

  //     // Check if the user is the author or admin
  //     if (issue.author !== userId) {
  //       throw new Error('Unauthorized to update this issue');
  //     }
  //     console.log(updateData)

  //     const updatedIssue = await IssueModel.findByIdAndUpdate(
  //       issueId,
  //       updateData,
  //       { new: true, runValidators: true }
  //     ).populate('author', 'email');

  //     return updatedIssue;
  //   } catch (error) {
  //     throw new Error(`Error updating issue: ${error.message}`);
  //   }
  // }

async updateIssue(issueId, updateData, userId) {
  try {
    const issue = await IssueModel.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.author.toString() !== userId.toString()) {
      throw new Error('Unauthorized to update this issue');
    }

    // Update only allowed fields
    const allowedUpdates = ['title', 'description', 'category', 'location', 'latitude', 'longitude', 'imageUrl', 'status'];
    const updates = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    Object.assign(issue, updates);
    await issue.save();

    return issue;
  } catch (error) {
    throw new Error(`Error updating issue: ${error.message}`);
  }
}

  // Delete issue
  async deleteIssue(issueId, userId) {
    try {
      const issue = await IssueModel.findById(issueId);
      if (!issue) {
        throw new Error('Issue not found');
      }

      // Check if the user is the author or admin
      if (issue.author.toString() !== userId.toString()) {
        throw new Error('Unauthorized to delete this issue');
      }

      await IssueModel.findByIdAndDelete(issueId);
      return { message: 'Issue deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting issue: ${error.message}`);
    }
  }

  // Upvote an issue
  async upvoteIssue(issueId) {
    try {
      const issue = await IssueModel.findByIdAndUpdate(
        issueId,
        { $inc: { voteCount: 1 } },
        { new: true }
      );
      if (!issue) {
        throw new Error('Issue not found');
      }
      return issue;
    } catch (error) {
      throw new Error(`Error upvoting issue: ${error.message}`);
    }
  }

  // Change issue status (for admin/moderation)
  async changeIssueStatus(issueId, status) {
    try {
      const validStatuses = ['Pending', 'In Progress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      const issue = await IssueModel.findByIdAndUpdate(
        issueId,
        { status },
        { new: true }
      );
      if (!issue) {
        throw new Error('Issue not found');
      }
      return issue;
    } catch (error) {
      throw new Error(`Error changing issue status: ${error.message}`);
    }
  }
}

module.exports = new IssueService();