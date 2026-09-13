import express from 'express';
import { generateWithGroq } from '../utils/groqClient.js';

const router = express.Router();

/**
 * POST /api/message
 * Request Body:
 * {
 *   "scenario": "scope_creep" | "delay_warning" | "status_update" | "price_negotiation" | "asking_for_testimonial" | "payment_reminder" | "custom",
 *   "clientName": "Alex",
 *   "freelancerName": "Sarah",
 *   "projectDetails": "Client requested 3 new features not in original SOW...",
 *   "tone": "Diplomatic & Firm" | "Friendly & Positive" | "Formal & Direct" | "Empathic",
 *   "extraNotes": "Need to quote +$300 for the extra work"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const {
      scenario = 'scope_creep',
      clientName = '',
      freelancerName = '',
      projectDetails = '',
      tone = 'Diplomatic & Firm',
      extraNotes = ''
    } = req.body;

    if (!projectDetails && !scenario) {
      return res.status(400).json({
        success: false,
        error: 'Please select a scenario or provide details.'
      });
    }

    const scenarioDescriptions = {
      scope_creep: 'Client requested extra features/tasks outside of original agreed scope',
      delay_warning: 'Need to communicate an unexpected timeline delay politely and professionally',
      status_update: 'Proactive weekly/milestone progress update with next steps',
      price_negotiation: 'Client wants a discount or lower rate, explaining value without underselling',
      asking_for_testimonial: 'Project completed successfully, requesting a review/5-star rating or testimonial',
      payment_reminder: 'Gentle but firm reminder regarding an overdue invoice or milestone payment',
      custom: 'Custom freelance communication situation'
    };

    const friendlyScenario = scenarioDescriptions[scenario] || scenario;

    const systemPrompt = `You are a freelance communication coach and negotiation expert.
Draft a high-impact, professional message that protects the freelancer's boundaries and value while maintaining a great relationship with the client.
Respond ONLY with a valid JSON object matching this structure:
{
  "subjectLine": "Email or Slack subject line",
  "recommendedChannel": "Email / Slack / Upwork Message",
  "messageBody": "The full polished message ready to copy and send",
  "negotiationStrategy": "Brief tip on why this wording works and how to handle pushback",
  "alternativeShortVersion": "A condensed 2-3 sentence version for instant messaging apps (Slack/WhatsApp)"
}`;

    const userPrompt = `Scenario: ${friendlyScenario}
Client Name: ${clientName || 'Client'}
Freelancer Name: ${freelancerName || 'Freelancer'}
Specific Situation / Context: ${projectDetails}
Desired Tone: ${tone}
Special Instructions / Numbers: ${extraNotes || 'None'}`;

    const fallbackGenerator = () => {
      const cGreeting = clientName ? `Hi ${clientName}` : 'Hi there';
      const fSign = freelancerName ? `Best regards,\n${freelancerName}` : 'Best regards';

      let subject = `Project Update: Next Steps`;
      let body = `${cGreeting},\n\nI wanted to share a quick update on our progress...`;
      let strat = 'Clear, proactive communication builds long-term trust.';
      let shortVer = `${cGreeting}, quick update on our milestones...`;

      if (scenario === 'scope_creep') {
        subject = `Regarding the new feature requests & timeline`;
        body = `${cGreeting},\n\nThanks for sharing the additional details regarding the new requests! These look like great enhancements that will add real value to the project.\n\nSince these items are outside our original agreed scope in the Statement of Work, I’d love to help you build them in one of two ways:\n\n1. **Add as Phase 2:** We wrap up our current milestone as planned, and immediately follow up with these new additions in a separate mini-milestone.\n2. **Adjust Scope & Budget:** We incorporate them right now by adjusting the timeline and budget accordingly (${extraNotes || 'approx. 2-3 extra days'}).\n\nLet me know which option works best for your schedule, and I'll prepare the updated task list!\n\n${fSign}`;
        strat = 'Acknowledge the idea positively, clearly frame it as outside original scope without saying a harsh "No", and give 2 clear actionable paths.';
        shortVer = `${cGreeting}! Love the new ideas. Since they are outside our original milestone scope, should we add them as a Phase 2 add-on or adjust our current milestone budget & timeline? Let me know!`;
      } else if (scenario === 'delay_warning') {
        subject = `Timeline update regarding our upcoming milestone`;
        body = `${cGreeting},\n\nI wanted to give you a quick and proactive heads-up regarding our delivery timeline.\n\nWhile working through ${projectDetails || 'the current feature set'}, I encountered a few technical edge cases that need extra testing to ensure everything is secure, performant, and bug-free.\n\nTo ensure top quality, I anticipate delivering the updated build by ${extraNotes || 'Friday afternoon'} instead.\n\nThank you for your understanding—I am committed to giving you the best possible result!\n\n${fSign}`;
        strat = 'Own the timeline early before the client asks, emphasize quality control as the primary reason, and give a specific realistic new date.';
        shortVer = `${cGreeting}, giving you an early heads-up that I am putting the finishing touches on our milestone to ensure zero bugs. Will have everything ready by tomorrow afternoon!`;
      } else if (scenario === 'payment_reminder') {
        subject = `Friendly Follow-up: Invoice #${Math.floor(1000 + Math.random() * 9000)}`;
        body = `${cGreeting},\n\nHope you're having a productive week!\n\nThis is a quick friendly reminder regarding Invoice for our recent milestone. Please let me know if you need another copy of the invoice or have any questions regarding payment details.\n\nLooking forward to kicking off our next steps once this is settled!\n\n${fSign}`;
        strat = 'Keep the tone polite and assume good intentions while clearly stating the invoice status.';
        shortVer = `${cGreeting}, just following up on the invoice sent over last week. Let me know if you need anything else from my end to process it!`;
      } else {
        subject = `Update regarding ${projectDetails ? projectDetails.slice(0, 30) : 'our project'}`;
        body = `${cGreeting},\n\n${projectDetails || 'I am writing to share a brief update on our progress and confirm the next steps.'}\n\n${extraNotes ? `Additional note: ${extraNotes}\n\n` : ''}Please let me know your thoughts so we can keep our momentum going.\n\n${fSign}`;
        strat = 'Stay concise, friendly, and close with a single clear call-to-action.';
        shortVer = `${cGreeting}, quick touch-base regarding our project status. Please let me know if everything looks good to proceed!`;
      }

      return {
        subjectLine: subject,
        recommendedChannel: 'Email or Project Chat (Slack/Discord/Upwork)',
        messageBody: body,
        negotiationStrategy: strat,
        alternativeShortVersion: shortVer
      };
    };

    const result = await generateWithGroq({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      fallbackFn: fallbackGenerator
    });

    return res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Message route error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate client message.'
    });
  }
});

export default router;
