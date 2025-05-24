// models/CaseStudy.js
const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema(
  {
    _id: { type: String }, // Now _id will be a string instead of ObjectId

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    overview: String,
    media: [
      {
        type: { type: String, enum: ['image', 'video'], required: true },
        url: { type: String, required: true },
      },
    ],
    timeline: [
      {
        title: String,
        description: String,
        date: Date,
      },
    ],
    tools: [String],
    outcomes: {
      metrics: String,
      testimonials: [
        {
          name: String,
          content: String,
        },
      ],
    },
    isPublished: { type: Boolean, default: false },
    theme: { 
      type: Number, 
      enum: [1, 2, 3], 
      default: 1 
    },
  
  },
  { timestamps: true },
);

module.exports = mongoose.model('CaseStudy', caseStudySchema);
