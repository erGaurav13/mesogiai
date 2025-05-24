const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  _id: { type: String, required: true },

  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  issue: {
    type: String,
    ref: 'Issue',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate votes
VoteSchema.index({ user: 1, issue: 1 }, { unique: true });

module.exports =  mongoose.model('Vote', VoteSchema);
