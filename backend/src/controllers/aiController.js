const OpenAI = require("openai");
const Course = require("../models/Course");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

/**
 * @desc    Get AI-powered course recommendations based on student's goal
 * @route   POST /api/v1/ai/recommend
 * @access  Private (student only)
 */
const getCourseRecommendations = asyncHandler(async (req, res) => {
  const { prompt, history = [] } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    throw new ApiError(400, "Please provide a prompt describing your learning goal");
  }

  // Fetch all courses (lightweight projection)
  const courses = await Course.find({}, "title description category duration level");

  if (courses.length === 0) {
    throw new ApiError(404, "No courses available for recommendations");
  }

  // Build a compact course catalog for the system prompt
  const courseList = courses
    .map(
      (c, i) =>
        `${i + 1}. "${c.title}" [${c.category} | ${c.level} | ${c.duration || "Self-paced"}] — ${c.description}`
    )
    .join("\n");

  const systemPrompt = `You are LearnHub AI, a friendly and knowledgeable course advisor for an online learning platform called LearnHub. Your job is to help students find the right courses and guide their learning journey.

Here is the complete course catalog available on LearnHub:

${courseList}

INSTRUCTIONS:
- Answer questions conversationally and naturally. You don't always need to list courses; sometimes the student just wants advice or clarification.
- When recommending courses, ONLY recommend courses that are actually listed above. Never invent course names.
- If the student asks about a topic that has no matching course, honestly say so and suggest the closest available alternatives.
- Keep recommendations concise and relevant. Explain WHY each course is a good fit based on the student's specific goal.
- If the student asks a follow-up question (e.g. "narrow it down", "which is best for beginners?"), look at the conversation history and refine your previous answer accordingly.
- If the student asks something not related to courses or learning (e.g. jokes, weather), politely redirect them back to learning topics.
- Format recommendations clearly using numbered lists when listing multiple courses.`;

  // Set SSE headers immediately (before any branching) so the client is never left waiting
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Guard against unconfigured API key by providing a realistic dynamic fallback
  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback if no real API key is configured
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    const p = prompt.toLowerCase();

    const intents = [
      { keys: ["backend", "api", "node", "sql", "database", "server"], categories: ["Backend"] },
      { keys: ["frontend", "ui", "ux", "design", "react", "css", "figma"], categories: ["Design", "Frontend"] },
      { keys: ["software", "engineer", "developer", "system", "web"], categories: ["Backend", "Web Development", "Frontend"] },
      { keys: ["data", "machine learning", "ai", "python", "analytics", "deep"], categories: ["Data Science"] },
      { keys: ["business", "marketing", "product", "agile", "scrum", "strategy"], categories: ["Business"] },
    ];

    let targetCategories = new Set();
    let hasSpecificIntent = false;

    intents.forEach((intent) => {
      if (intent.keys.some((k) => p.includes(k))) {
        intent.categories.forEach((c) => targetCategories.add(c));
        hasSpecificIntent = true;
      }
    });

    let matches = courses
      .map((course) => {
        let score = 0;
        if (targetCategories.has(course.category)) score += 10;
        else if (hasSpecificIntent && targetCategories.has("Web Development") && (course.category === "Frontend" || course.category === "Backend")) score += 5;
        if (p.includes("beginner") && course.level === "Beginner") score += 3;
        if (p.includes("advanced") && course.level === "Advanced") score += 3;
        if (p.includes("intermediate") && course.level === "Intermediate") score += 3;
        course.title.toLowerCase().split(" ").forEach((word) => {
          if (word.length > 3 && p.includes(word)) score += 5;
        });
        return { course, score };
      })
      .filter((m) => m.score > 0);

    matches.sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, 3);

    let recommendation = "";
    if (topMatches.length > 0) {
      recommendation = "Based on your goal, here are the most relevant courses from our catalog:\n\n";
      topMatches.forEach((m, i) => {
        recommendation += `${i + 1}. **${m.course.title}** (${m.course.category} — ${m.course.level})\n`;
        recommendation += `   ${m.course.description}\n\n`;
      });
      recommendation += "Would you like more details on any of these, or shall I narrow them down further?";
    } else {
      recommendation =
        "I couldn't find a specific match for that topic in our current catalog. Could you tell me more about your goal? For example, are you interested in Web Development, Backend, Design, Data Science, or Business?";
    }

    res.write(`data: ${JSON.stringify({ text: recommendation })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
    return;
  }

  // Build messages with conversation history for context awareness
  const messages = [
    { role: "system", content: systemPrompt },
    // Include prior turns (last 10 max) so the AI can answer follow-up questions
    ...history.slice(-10).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    { role: "user", content: prompt },
  ];

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 800,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("OpenAI Stream Error:", error);
    let errorMsg = "An error occurred while generating the response.";
    if (error.status === 429) errorMsg = "The AI service is currently busy. Please try again in a moment.";
    else if (error.status === 401) errorMsg = "AI service authentication failed. Please check your API key.";
    else if (error.message) errorMsg = error.message;

    res.write(`data: ${JSON.stringify({ error: true, text: "\n\n⚠️ " + errorMsg })}\n\n`);
    res.end();
  }
});

module.exports = { getCourseRecommendations };
