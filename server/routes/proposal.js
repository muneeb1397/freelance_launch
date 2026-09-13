import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildPrompt(jobDescription, skills) {
  return `You are a freelancer writing a short, personal proposal to a potential client in response to their job post. Write in a natural, human voice — not generic AI filler, not a bulleted list, not marketing-speak.

Client's job post/brief:
"""
${jobDescription}
"""

Freelancer's relevant skills/experience:
"""
${skills}
"""

Write a proposal (150-200 words) that:
1. Opens with a short, specific line showing you actually read their brief (not a generic greeting).
2. Explains briefly why this freelancer is a good fit, tying their skills directly to what the client needs.
3. Ends with a light, low-pressure call-to-action (e.g. inviting a quick chat or asking a clarifying question).

Do not use headers, bullet points, or placeholders like [Client Name]. Write it as plain, ready-to-send text.`;
}

router.post("/", async (req, res) => {
  try {
    const { jobDescription, skills } = req.body;

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        error: "jobDescription is required and must be a non-empty string.",
      });
    }
    if (!skills || typeof skills !== "string" || !skills.trim()) {
      return res.status(400).json({
        success: false,
        error: "skills is required and must be a non-empty string.",
      });
    }

    const prompt = buildPrompt(jobDescription.trim(), skills.trim());

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
        reasoning_effort: "low",
      });
    } catch (groqError) {
      console.error("Groq API error:", groqError.message);
      return res.status(502).json({
        success: false,
        error: "Failed to generate proposal — the AI service is currently unavailable. Please try again.",
      });
    }

    const result = completion.choices?.[0]?.message?.content?.trim();

    if (!result) {
      return res.status(502).json({
        success: false,
        error: "The AI service returned an empty response. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    console.error("Unexpected error in /api/proposal:", err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while generating the proposal.",
    });
  }
});

export default router;
