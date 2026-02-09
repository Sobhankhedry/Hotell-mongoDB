// File: src/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true
  },
  foodId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);