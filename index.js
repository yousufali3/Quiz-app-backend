const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const quizRoutes = require("./routes/quizRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB database connect successfull");
  })
  .catch(() => {
    console.log("failed to connect database");
  });

// Set up routes
app.use("/api", quizRoutes);
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
