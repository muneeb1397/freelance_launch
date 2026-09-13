// routes/contract.js
// Self-contained route for POST /api/contract.

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "openai/gpt-oss-120b";

function validateInput(body) {
  const { clientName, freelancerName, projectScope, paymentAmount, paymentTerms } = body;

  const missing = [];
  if (!clientName || typeof clientName !== "string" || !clientName.trim()) missing.push("clientName");
  if (!freelancerName || typeof freelancerName !== "string" || !freelancerName.trim()) missing.push("freelancerName");
  if (!projectScope || typeof projectScope !== "string" || !projectScope.trim()) missing.push("projectScope");
  if (!paymentTerms || typeof paymentTerms !== "string" || !paymentTerms.trim()) missing.push("paymentTerms");
  if (paymentAmount === undefined || paymentAmount === null || paymentAmount === "") missing.push("paymentAmount");

  if (missing.length > 0) {
    return `Missing or invalid field(s): ${missing.join(", ")}`;
  }

  const amount = Number(paymentAmount);
  if (Number.isNaN(amount)) {
    return "paymentAmount must be a number";
  }
  if (amount <= 0) {
    return "paymentAmount must be a positive number";
  }

  return null;
}

function buildContractPrompt({ clientName, freelancerName, projectScope, paymentAmount, paymentTerms }) {
  return `Write a short, plain-English Statement of Work (SOW) draft for a freelance engagement. Use simple language, not legal jargon. Structure it with these sections: Parties, Scope of Work, Payment, Timeline, and a final disclaimer line.

Details:
- Client: ${clientName}
- Freelancer: ${freelancerName}
- Scope of work: ${projectScope}
- Payment amount: $${Number(paymentAmount).toFixed(2)}
- Payment terms: ${paymentTerms}

Requirements:
- Timeline section should use a clear placeholder like "[Insert project start and end dates]" since no dates were provided.
- End with this exact disclaimer on its own line: "This is a starting template only and does not constitute legal advice. Consult a licensed attorney before using it as a binding agreement."
- Keep it concise — aim for around 200-300 words.
- Do not include markdown formatting like ** or #, just plain text with line breaks and section labels.`;
}

function buildInvoiceDescriptionPrompt({ projectScope }) {
  return `Summarize the following freelance project scope into a single, professional invoice line-item description (max 15 words, no filler, plain text only):

"${projectScope}"`;
}

function buildInvoice({ clientName, freelancerName, paymentAmount, paymentTerms, lineItemDescription }) {
  const amount = Number(paymentAmount);
  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
  const issueDate = new Date().toISOString().slice(0, 10);

  return `INVOICE
Invoice #: ${invoiceNumber}
Date: ${issueDate}

Billed To: ${clientName}
From: ${freelancerName}

--------------------------------------------------
Description: ${lineItemDescription}
Amount Due: $${amount.toFixed(2)}
--------------------------------------------------

Payment Terms: ${paymentTerms}

Please remit payment per the terms above. Thank you for your business.`;
}

router.post("/", async (req, res) => {
  const validationError = validateInput(req.body || {});
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const { clientName, freelancerName, projectScope, paymentAmount, paymentTerms } = req.body;

  try {
    const [contractCompletion, lineItemCompletion] = await Promise.all([
      groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: buildContractPrompt(req.body) }],
        temperature: 0.4,
        max_tokens: 600,
      }),
      groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: buildInvoiceDescriptionPrompt({ projectScope }) }],
        temperature: 0.3,
        max_tokens: 60,
      }),
    ]);

    const contractText = contractCompletion.choices[0]?.message?.content?.trim();
    const lineItemDescription = lineItemCompletion.choices[0]?.message?.content?.trim() || projectScope;

    if (!contractText) {
      return res.status(502).json({ success: false, error: "LLM returned an empty contract response" });
    }

    const invoiceText = buildInvoice({
      clientName,
      freelancerName,
      paymentAmount,
      paymentTerms,
      lineItemDescription,
    });

    return res.status(200).json({
      success: true,
      result: {
        contract: contractText,
        invoice: invoiceText,
      },
    });
  } catch (err) {
    console.error("Groq API error:", err.message);
    return res.status(502).json({ success: false, error: "Failed to generate contract/invoice via LLM" });
  }
});

export default router;
