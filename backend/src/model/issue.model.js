const mongoose= require('mongoose');

const IssueSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Road', 'Water', 'Sanitation', 'Electricity', 'Other'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  latitude: Number,
  longitude: Number,
  imageUrl: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  author: {
    type: String,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =  mongoose.model('Issue', IssueSchema);
