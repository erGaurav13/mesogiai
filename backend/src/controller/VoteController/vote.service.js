const { VoteModel,IssueModel } = require('../../model/index.model');
const mongoose = require('mongoose');
class VoteService {
  async upvoteIssue(issueId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if issue exists
      const issue = await IssueModel.findById(issueId).session(session);
      if (!issue) {
        throw new Error('Issue not found');
      }

      // Check if user already voted
      const existingVote = await VoteModel.findOne({
        user: userId,
        issue: issueId
      }).session(session);

      if (existingVote) {
        throw new Error('You have already voted on this issue');
      }

      // Create new vote
      const vote = new VoteModel({
        _id: new mongoose.Types.ObjectId().toString(),
        user: userId,
        issue: issueId
      });

      // Increment vote count on issue
      await IssueModel.findByIdAndUpdate(
        issueId,
        { $inc: { voteCount: 1 } },
        { session }
      );

      // Save vote
      await vote.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        voteCount: issue.voteCount + 1
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async removeVote(issueId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if issue exists
      const issue = await IssueModel.findById(issueId).session(session);
      if (!issue) {
        throw new Error('Issue not found');
      }

      // Find and remove vote
      const vote = await VoteModel.findOneAndDelete({
        user: userId,
        issue: issueId
      }).session(session);

      if (!vote) {
        throw new Error('You have not voted on this issue');
      }

      // Decrement vote count on issue
      await IssueModel.findByIdAndUpdate(
        issueId,
        { $inc: { voteCount: -1 } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        voteCount: issue.voteCount - 1
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getUserVoteStatus(issueId, userId) {
    try {
      const vote = await VoteModel.findOne({
        user: userId,
        issue: issueId
      });

      return {
        hasVoted: !!vote,
        voteId: vote?._id
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new VoteService();