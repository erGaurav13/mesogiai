// models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  _id: { type: String }, // Now _id will be a string instead of ObjectId

  caseStudyId: { type: String, ref: 'CaseStudy' },
  userId: { type: String, ref: 'User' },
  visitorIP: String,
  timestamp: { type: Date, default: Date.now },
  event: { type: String, enum: ['view', 'click'] },
  additionalData: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Analytics', analyticsSchema);
