import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  const { situation, context, tone } = req.body;

  if (!situation || !context) {
    return res.status(400).json({
      success: false,
      error: "Both 'situation' and 'context' are required.",
    });
  }

  const finalTone = tone || "professional-neutral";

  const prompt = `You are writing an email on behalf of a freelancer to their client.

Situation type: ${situation}
Context/details: ${context}
Desired tone: ${finalTone}

Write a short, ready-to-send client message (80-150 words) that:
- Handles this situation professionally and confidently
- Is honest but not overly apologetic
- Pushes back when needed, without sounding rude or confrontational
- Sounds natural, not robotic
- Requires no further editing before sending

Return ONLY the message text, nothing else (no subject line, no explanation).`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
    });

    const result = completion.choices[0].message.content;

    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Something went wrong generating the message.",
    });
  }
});

export default router;
