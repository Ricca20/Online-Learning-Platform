const OpenAI = require("openai");
const Course = require("../models/Course");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * @desc    Get AI-powered course recommendations based on student's goal
 * @route   POST /api/v1/ai/recommend
 * @access  Private (student only)
 */
const getCourseRecommendations = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    throw new ApiError(400, "Please provide a prompt describing your learning goal");
  }

  // Guard against unconfigured API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    throw new ApiError(503, "AI service is not configured. Please contact the administrator.");
  }

  // Instantiate client lazily so it always picks up the live env value
  const openai = new OpenAI({ apiKey });

  // Fetch all courses (lightweight projection)
  const courses = await Course.find({}, "title description category");

  if (courses.length === 0) {
    throw new ApiError(404, "No courses available for recommendations");
  }

  // Build course list for the system prompt
  const courseList = courses
    .map((course, index) => `${index + 1}. "${course.title}" — ${course.description} [Category: ${course.category || "General"}]`)
    .join("\n");

  const systemPrompt = `You are a helpful learning assistant for an online education platform.
The following courses are available:

${courseList}

Based on the student's goal, recommend the most relevant courses by name and briefly explain why each is a good fit.
If no courses match, say so honestly.
Format your response clearly with numbered recommendations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const recommendation = completion.choices[0].message.content;

    ApiResponse.success(res, "Recommendations generated successfully", { recommendation });
  } catch (error) {
    // Handle OpenAI-specific errors
    if (error.status === 429) {
      throw new ApiError(502, "AI service rate limit exceeded. Please try again later.");
    }
    if (error.status === 401) {
      throw new ApiError(502, "AI service authentication failed. Please contact support.");
    }
    throw new ApiError(502, `AI service error: ${error.message}`);
  }
});

module.exports = { getCourseRecommendations };
