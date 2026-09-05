const express = require("express");
const router = express.Router();
const { getCourseRecommendations } = require("../controllers/aiController");
const { verifyToken, authorise } = require("../middleware/authMiddleware");

// POST /api/v1/ai/recommend — get AI course recommendations (student only)
router.post("/recommend", verifyToken, authorise("student"), getCourseRecommendations);

module.exports = router;
