const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Article = require("./models/Articles");

// MongoDB Connection String from Environment Variables
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error("❌ MONGO_URI is not defined in environment variables!");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if the database connection fails
  });

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for the frontend

// ✅ Add a Root Route to Fix "Cannot GET /" Error
app.get("/", (req, res) => {
  res.send("Backend is running successfully! 🚀");
});

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

// 2. Fetch All Articles
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ timestamp: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// ✅ Use Render's Assigned Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
