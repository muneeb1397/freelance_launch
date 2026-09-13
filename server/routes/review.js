// routes/review.js
//
// Module 3 — Code Quality Reviewer.
// POST /api/review — { code, language } -> { issues, explanation, refactoredCode }
//
// 3-agent chain: Reviewer -> (Explainer + Refactorer in parallel).
// Explainer and Refactorer only depend on the issues list, not on each
// other, so running them together roughly halves total latency vs. doing
// all three calls back to back.

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "openai/gpt-oss-120b";
const MAX_CODE_LENGTH = 6000; // guards against runaway token usage / timeouts

function validateInput({ code, language }) {
  if (!code || typeof code !== "string" || !code.trim()) {
    return "code is required and must be a non-empty string.";
  }
  if (code.length > MAX_CODE_LENGTH) {
    return `code is too long (max ${MAX_CODE_LENGTH} characters) for the MVP reviewer.`;
  }
  const lang = (language || "").toLowerCase().trim();
  if (!["javascript", "python"].includes(lang)) {
    return "language must be either 'javascript' or 'python'.";
  }
  return null;
}

// Strips ```lang fences a model adds despite being told not to.
function stripCodeFences(text) {
  if (!text) return text;
  return text
    .replace(/^```[a-zA-Z]*\n?/, "")
    .replace(/```$/, "")
    .trim();
}

// Tolerant parse of the reviewer's issue list: handles clean JSON, JSON
// wrapped in ```json fences, or a plain bullet/numbered list as fallback.
function parseIssues(raw) {
  const cleaned = stripCodeFences((raw || "").trim());
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.every((i) => typeof i === "string")) {
      return parsed.map((i) => i.trim()).filter(Boolean);
    }
  } catch {
    // fall through to line-based parsing below
  }
  return cleaned
    .split("\n")
    .map((l) => l.replace(/^[-*\d.]+\s*/, "").trim())
    .filter(Boolean);
}

router.post("/", async (req, res) => {
  const validationError = validateInput(req.body || {});
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const { code } = req.body;
  const language = req.body.language.toLowerCase().trim();

  try {
    // Step A — Reviewer: list concrete issues
    const reviewerCompletion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `You are a senior code reviewer. Review this ${language} snippet and list concrete issues: bugs, bad practices, missing error handling, and naming/readability problems. Return ONLY a JSON array of short issue strings (no markdown fences, no commentary).

\`\`\`${language}
${code}
\`\`\``,
        },
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    const issues = parseIssues(reviewerCompletion.choices[0]?.message?.content);

    if (!issues.length) {
      return res.status(502).json({
        success: false,
        error: "The AI service did not find any parseable issues. Please try again.",
      });
    }

    const issuesList = issues.map((i) => `- ${i}`).join("\n");

    // Step B + C — Explainer and Refactorer both only need `issues`, so run
    // them concurrently instead of chaining three sequential calls.
    const [explainerResult, refactorResult] = await Promise.allSettled([
      groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: `You are explaining code issues to someone learning to code. Given these issues found in a ${language} snippet:
${issuesList}

Write a short plain-English paragraph (3-5 sentences) explaining why these matter.`,
          },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
      groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: `Rewrite this ${language} code fixing these issues, while keeping the original logic/intent intact:
${issuesList}

Original code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the refactored code — no explanation, no markdown fences.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    ]);

    if (explainerResult.status === "rejected" || refactorResult.status === "rejected") {
      console.error(
        "Review route: sub-call failed —",
        explainerResult.reason?.message,
        refactorResult.reason?.message
      );
      return res.status(502).json({
        success: false,
        error: "The AI service failed to complete the review. Please try again.",
      });
    }

    const explanation = explainerResult.value.choices[0]?.message?.content?.trim();
    const refactoredCode = stripCodeFences(refactorResult.value.choices[0]?.message?.content);

    if (!explanation || !refactoredCode) {
      return res.status(502).json({
        success: false,
        error: "The AI service returned an incomplete review. Please try again.",
      });
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
