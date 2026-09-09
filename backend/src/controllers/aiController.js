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

  // Guard against unconfigured API key by providing a realistic dynamic fallback
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    const courses = await Course.find({}, "title description category level");
    const p = prompt.toLowerCase();
    
    // Define intent mappings to categories/keywords
    const intents = [
      { keys: ["software", "engineer", "backend", "developer", "system", "api", "node", "sql"], categories: ["Backend", "Web Development"] },
      { keys: ["frontend", "ui", "ux", "design", "react", "css", "figma"], categories: ["Design", "Web Development"] },
      { keys: ["data", "machine learning", "ai", "python", "analytics", "deep learning"], categories: ["Data Science"] },
      { keys: ["business", "marketing", "product", "agile", "scrum", "strategy"], categories: ["Business"] }
    ];

    let targetCategories = new Set();
    intents.forEach(intent => {
      if (intent.keys.some(k => p.includes(k))) {
        intent.categories.forEach(c => targetCategories.add(c));
      }
    });

    // If no specific intent matched, default to showing a mix of fundamental courses
    if (targetCategories.size === 0) {
      targetCategories = new Set(["Web Development", "Business", "Data Science"]);
    }

    // Score courses based on category match and level relevance
    let matches = courses.map(course => {
      let score = 0;
      if (targetCategories.has(course.category)) score += 5;
      if (p.includes("beginner") && course.level === "Beginner") score += 3;
      if (p.includes("advanced") && course.level === "Advanced") score += 3;
      
      // Bonus points if the prompt directly mentions a word in the title
      course.title.toLowerCase().split(" ").forEach(word => {
        if (word.length > 3 && p.includes(word)) score += 2;
      });

      return { course, score };
    }).filter(m => m.score > 0);

    // Sort by score and take top 3
    matches.sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, 3);

    let recommendation = "";
    if (topMatches.length > 0) {
      recommendation = "Based on your career goals, here is a curated learning path with some highly recommended courses:\n\n";
      topMatches.forEach((m, i) => {
        const explanations = [
          "This is the perfect starting point to build a strong foundation.",
          "This will give you the practical skills needed in the industry.",
          "This is a great advanced course to level up your expertise."
        ];
        recommendation += `${i + 1}. **${m.course.title}** (${m.course.category} - ${m.course.level})\n`;
        recommendation += `   *Why take this?* ${m.course.description} ${explanations[i % 3]}\n\n`;
      });
      recommendation += "Would you like to narrow these down, or should we look at other topics?";
    } else {
      recommendation = "I couldn't find an exact match for that right now. Could you tell me a bit more about what you want to learn? For example, are you interested in Web Development, Design, Data Science, or Business?";
    }

    return ApiResponse.success(res, "Mock recommendations generated successfully", {
      recommendation
    });
  }

  // Instantiate client lazily so it always picks up the live env value
  const openai = new OpenAI({ apiKey });

  // Fetch all courses (lightweight projection)
  const courses = await Course.find({}, "title description category duration level");

  if (courses.length === 0) {
    throw new ApiError(404, "No courses available for recommendations");
  }

  // Build course list for the system prompt
  const courseList = courses
    .map((course, index) => `${index + 1}. "${course.title}" — ${course.description} [Category: ${course.category || "General"}, Level: ${course.level || "All Levels"}, Duration: ${course.duration || "Self-paced"}]`)
    .join("\n");

  const systemPrompt = `You are a helpful learning assistant for an online education platform.
The following courses are available:

${courseList}

Based on the student's goal, recommend the most relevant courses by name and briefly explain why each is a good fit.
If no courses match, say so honestly.
Format your response clearly with numbered recommendations.`;

  try {
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send an initial connected event just to establish the stream immediately
    res.write(`data: ${JSON.stringify({ text: "" })}\n\n`);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
      stream: true, // Enable streaming
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        // Send each chunk as it arrives
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    // Signal completion
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("OpenAI Stream Error:", error);
    // If headers are already sent, we can't send a standard JSON error response.
    // We send an error event stream message instead.
    if (!res.headersSent) {
      if (error.status === 429) {
        res.status(502).json({ success: false, message: "AI service rate limit exceeded. Please try again later." });
      } else if (error.status === 401) {
        res.status(502).json({ success: false, message: "AI service authentication failed. Please contact support." });
      } else {
        res.status(502).json({ success: false, message: `AI service error: ${error.message}` });
      }
    } else {
      res.write(`data: ${JSON.stringify({ error: true, text: "\n\nAn error occurred while generating the response." })}\n\n`);
      res.end();
    }
  }
});

module.exports = { getCourseRecommendations };
