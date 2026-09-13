// routes/review.js
//
// PLACEHOLDER — matches the documented /api/review contract exactly so the
// frontend works end-to-end for the demo. Replace with Member 3's real
// route file once it lands (see integration notes).

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "openai/gpt-oss-120b";

function validateInput({ code, language }) {
  if (!code || typeof code !== "string" || !code.trim()) {
    return "code is required and must be a non-empty string.";
  }
  const lang = (language || "").toLowerCase();
  if (!["javascript", "python"].includes(lang)) {
    return "language must be either 'javascript' or 'python'.";
  }
  return null;
}

router.post("/", async (req, res) => {
  const validationError = validateInput(req.body || {});
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const { code, language } = req.body;

  try {
    // Step A — Reviewer: list concrete issues
    const reviewerCompletion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `You are a senior code reviewer. Review this ${language} snippet and list concrete issues (bugs, bad practices, readability, naming). Return ONLY a JSON array of short issue strings, nothing else.

\`\`\`${language}
${code}
\`\`\``,
        },
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    let issues;
    try {
      issues = JSON.parse(reviewerCompletion.choices[0]?.message?.content?.trim() || "[]");
      if (!Array.isArray(issues)) throw new Error("not an array");
    } catch {
      // Fallback: split on newlines if the model didn't return clean JSON
      issues = (reviewerCompletion.choices[0]?.message?.content || "")
        .split("\n")
        .map((l) => l.replace(/^[-*\d.]+\s*/, "").trim())
        .filter(Boolean);
    }

    // Step B — Explainer: why the issues matter, in plain English
    const explainerCompletion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `You are explaining code issues to someone learning to code. Given these issues found in a ${language} snippet:
${issues.map((i) => `- ${i}`).join("\n")}

Write a short plain-English paragraph (3-5 sentences) explaining why these matter.`,
        },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const explanation = explainerCompletion.choices[0]?.message?.content?.trim();

    // Step C — Refactorer: fix the issues, keep original logic
    const refactorCompletion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `Rewrite this ${language} code fixing these issues, while keeping the original logic/intent intact:
${issues.map((i) => `- ${i}`).join("\n")}

Original code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the refactored code, no explanation, no markdown fences.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const refactoredCode = refactorCompletion.choices[0]?.message?.content?.trim();

    if (!issues.length || !explanation || !refactoredCode) {
      return res.status(502).json({ success: false, error: "The AI service returned an incomplete review. Please try again." });
    }

    return res.status(200).json({
      success: true,
      result: {
        issues,
        explanation,
        refactoredCode,
      },
    });
  } catch (err) {
    console.error("Review route error:", err.message);
    return res.status(502).json({ success: false, error: "Failed to generate code review via LLM" });
  }
});

export default router;
