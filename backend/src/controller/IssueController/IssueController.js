const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const mongoose = require('mongoose');
const IssueService = require('./Issue.service');
const Response = require('../responseHandeler');

class IssueController {
  async createIssue(req, res) {
    try {
      const { title, description, category, location, latitude, longitude } = req.body;
      const author = req.user.id;
      const _id = new mongoose.Types.ObjectId().toString();

      let imageUrl = '';

      // Handle file upload if exists
      if (req.file) {
        // Construct the URL where the image can be accessed
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/issues/${req.file.filename}`;

        // Verify the file was actually saved
        try {
          await fs.promises.access(req.file.path);
        } catch (err) {
          // If file wasn't saved properly, clean up and throw error
          if (req.file.path) {
            await unlinkAsync(req.file.path).catch(() => {});
          }
          throw new Error('Failed to save the uploaded image');
        }
      }

      const issueData = {
        _id,
        title,
        description,
        category,
        location,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        imageUrl,
        author,
      };

      const newIssue = await IssueService.createIssue(issueData);
      Response.success(res, newIssue, 'Issue created successfully', 201);
    } catch (err) {
      // Clean up uploaded file if an error occurred
      if (req.file?.path) {
        await unlinkAsync(req.file.path).catch(() => {});
      }
      Response.failure(res, err.message, 400);
    }
  }
  // Get paginated/filtered issues
  async getIssues(req, res) {
    try {
      const { page = 1, limit = 10, status, category, sort = -1 } = req.query;
      const result = await IssueService.getIssues({
        page: parseInt(page),
        limit: parseInt(limit),
        sort: parseInt(sort),
        status,
        category,
      });
      Response.success(res, result, 'Issues fetched successfully');
    } catch (err) {
      Response.failure(res, err.message, 400);
    }
  }

  // Get user's issues
  async getUserIssues(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 ,sort=-1} = req.query;
      const result = await IssueService.getUserIssues(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: parseInt(sort),
      });
      Response.success(res, result, 'User issues fetched successfully');
    } catch (err) {
      Response.failure(res, err.message, 400);
    }
  }

  // Get single issue details
  async getIssueById(req, res) {
    try {
      const issueId = req.params.id;
      const issue = await IssueService.getIssueById(issueId);
      Response.success(res, issue, 'Issue fetched successfully');
    } catch (err) {
      Response.failure(res, err.message, 404);
    }
  }

  // Update issue

  async updateIssue(req, res) {
    try {
      const issueId = req.params.id;
      const userId = req.user.id;
      const { title, description, category, location, latitude, longitude, removeImage } = req.body;

      // Get the existing issue first
      const existingIssue = await IssueService.getIssueById(issueId);
      if (!existingIssue) {
        throw new Error('Issue not found');
      }
      console.log(existingIssue, 'dd', userId);
      // Check authorization
      if (existingIssue.author._id !== userId) {
        throw new Error('Unauthorized to update this issue');
      }

      let imageUrl = existingIssue.imageUrl;
      let oldImagePath = '';

      // Handle image update/removal
      if (req.file) {
        // New image uploaded - prepare to delete old one
        if (existingIssue.imageUrl) {
          const filename = existingIssue.imageUrl.split('/').pop();
          oldImagePath = path.join(__dirname, '../../uploads/issues', filename);
        }

        // Set new image URL
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/issues/${req.file.filename}`;

        // Verify new file was saved
        try {
          await fs.promises.access(req.file.path);
        } catch (err) {
          if (req.file.path) await unlinkAsync(req.file.path).catch(() => {});
          throw new Error('Failed to save the uploaded image');
        }
      } else if (removeImage === 'true' && existingIssue.imageUrl) {
        // User requested to remove existing image
        const filename = existingIssue.imageUrl.split('/').pop();
        oldImagePath = path.join(__dirname, '../../uploads/issues', filename);
        imageUrl = '';
      }

      const updateData = {
        title,
        description,
        category,
        location,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        imageUrl,
      };

      const updatedIssue = await IssueService.updateIssue(issueId, updateData, userId);

      // Delete old image if it was replaced or removed
      if (oldImagePath) {
        await unlinkAsync(oldImagePath).catch(() => {});
      }

      Response.success(res, updatedIssue, 'Issue updated successfully');
    } catch (err) {
      // Clean up newly uploaded file if error occurred
      if (req.file?.path) {
        await unlinkAsync(req.file.path).catch(() => {});
      }
      Response.failure(res, err.message, err.message.includes('Unauthorized') ? 403 : 400);
    }
  }

  // Delete issue
  async deleteIssue(req, res) {
    try {
      const issueId = req.params.id;
      const userId = req.user._id;

      const result = await IssueService.deleteIssue(issueId, userId);
      Response.success(res, result, 'Issue deleted successfully');
    } catch (err) {
      Response.failure(res, err.message, err.message.includes('Unauthorized') ? 403 : 400);
    }
  }

  // Upvote an issue
  async upvoteIssue(req, res) {
    try {
      const issueId = req.params.id;
      const updatedIssue = await IssueService.upvoteIssue(issueId);
      Response.success(res, updatedIssue, 'Issue upvoted successfully');
    } catch (err) {
      Response.failure(res, err.message, 400);
    }
  }

  // Change issue status (admin only)
  async changeIssueStatus(req, res) {
    try {
      const issueId = req.params.id;
      const { status } = req.body;

      // You might want to add admin check here
      // if (!req.user.isAdmin) {
      //   return Response.failure(res, 'Unauthorized', 403);
      // }

      const updatedIssue = await IssueService.changeIssueStatus(issueId, status);
      Response.success(res, updatedIssue, 'Issue status updated successfully');
    } catch (err) {
      Response.failure(res, err.message, 400);
    }
  }
}

module.exports = new IssueController();
