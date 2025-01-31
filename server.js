const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Article = require("./models/Articles");

// MongoDB Connection String (Replace with your actual string)
const dbURI =
  "mongodb+srv://kshiteeshdesai:2002%40Kshiteesh@blog-cluster.rc7y4.mongodb.net/?retryWrites=true&w=majority&appName=blog-cluster";

// Connect to MongoDB
mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for the frontend

// 1. Create a new article
app.post("/api/articles", async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check if content is within 100 words
    if (content.split(" ").length > 100) {
      return res.status(400).json({ error: "Content exceeds 100 words" });
    }

    const newArticle = new Article({ title, content });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: "Failed to create article" });
  }
});
//2:Fetch All Articles

app.get("/api/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ timestamp: -1 }); // Fetch all articles sorted by newest
    res.json(articles); // Return as an array
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});


// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
