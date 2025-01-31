const mongoose = require("mongoose");

// Define Article Schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
