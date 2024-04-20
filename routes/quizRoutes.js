const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");

// Create a new quiz
router.post("/quizzes", async (req, res) => {
  try {
    console.log(req.body);
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get the currently active quiz
router.get("/quizzes/active", async (req, res) => {
  try {
    const currentDate = new Date();
    const activeQuiz = await Quiz.findOne({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });
    res.json(activeQuiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get quiz result after 5 minutes of end time
router.get("/quizzes/:id/result", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const currentTime = new Date();
    if (quiz.endDate.getTime() + 5 * 60 * 1000 > currentTime.getTime()) {
      res.status(400).json({ message: "Quiz result not available yet." });
    } else {
      res.json({ correctAnswer: quiz.options[quiz.rightAnswer] });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all quizzes
router.get("/quizzes/all", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
