import express from 'express';
import { generateWithGroq } from '../utils/groqClient.js';

const router = express.Router();

/**
 * POST /api/proposal
 * Request Body:
 * {
 *   "jobTitle": "Full Stack React Developer",
 *   "jobDescription": "We need someone to build an MVP dashboard in 2 weeks...",
 *   "clientName": "Alex (Optional)",
 *   "skills": "React, Node.js, Tailwind CSS, REST APIs",
 *   "experienceYears": "2 years",
 *   "tone": "Confident & Professional" | "Friendly & Approachable" | "Direct & Results-Oriented",
 *   "proposedRate": "$35/hr or $1,200 fixed",
 *   "portfolioLinks": "https://github.com/johndoe"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const {
      jobTitle = '',
      jobDescription = '',
      clientName = '',
      skills = '',
      experienceYears = '',
      tone = 'Confident & Professional',
      proposedRate = '',
      portfolioLinks = ''
    } = req.body;

    if (!jobDescription && !jobTitle) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a job title or job description brief.'
      });
    }

    const systemPrompt = `You are a high-performing freelance strategist and proposal writer who helps freelancers win high-value contracts on platforms like Upwork, Contra, and direct outreach.
Generate a winning, non-generic, high-converting freelance proposal.
Always respond in JSON format with the following keys:
{
  "subjectLine": "A compelling hook or subject line",
  "openingHook": "An engaging first 2 sentences that immediately show you read the job post",
  "proposalBody": "The full proposal text formatted with clear paragraphs, value proposition, and call to action",
  "keyHighlights": ["Highlight 1: relevant experience", "Highlight 2: relevant tech stack or solution", "Highlight 3: quick turnaround / milestone approach"],
  "callToAction": "A low-friction closing question/call to action",
  "estimatedDeliverySuggestion": "Estimated timeframe or milestone breakdown recommendation"
}`;

    const userPrompt = `Job Title: ${jobTitle}
Job Description / Brief: ${jobDescription}
Client Name: ${clientName || 'Hiring Manager'}
Freelancer Skills: ${skills || 'Full stack development'}
Experience: ${experienceYears || '1-2 years freelancing experience'}
Desired Tone: ${tone}
Proposed Rate / Budget: ${proposedRate || 'Flexible based on scope'}
Portfolio / Links: ${portfolioLinks || 'Available on request'}`;

    const fallbackGenerator = () => {
      const clientGreeting = clientName ? `Hi ${clientName}` : 'Hi there';
      const cleanTitle = jobTitle || 'your project';
      return {
        subjectLine: `Experienced Freelancer for ${cleanTitle} — Ready to Deliver`,
        openingHook: `${clientGreeting}, I saw your post looking for help with ${cleanTitle} and immediately knew this aligns with my hands-on experience in building fast, responsive solutions.`,
        proposalBody: `${clientGreeting},\n\nI reviewed your requirements for ${cleanTitle} and understand that you need a dependable, communicative developer who can deliver clean code quickly without constant back-and-forth.\n\nHere is how I would tackle this for you:\n1. Quick Discovery & Requirements Confirmation: Review design/specs and align on key milestones.\n2. Rapid Implementation: Build with clean, maintainable code (${skills || 'modern stack'}) and regular video/message check-ins.\n3. Testing & Delivery: Thorough QA, responsive bug-fixing, and a smooth handoff.\n\nMy background includes ${experienceYears ? `${experienceYears} of experience` : 'extensive project work'} delivering high-performance applications with ${skills || 'relevant technologies'}.\n\nI am available to start immediately and can deliver this within your required timeframe.`,
        keyHighlights: [
          `Specialized in ${skills || 'Full Stack Development'} with clean architecture`,
          'Milestone-driven delivery with daily async updates',
          'Post-delivery support included to ensure smooth launch'
        ],
        callToAction: 'Would you be open to a quick 10-minute chat or exchanging a few messages to discuss your timeline and milestones?',
        estimatedDeliverySuggestion: 'Phase 1 MVP: 5-7 days | Final polish & review: 2-3 days'
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
    console.error('Proposal route error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate proposal.'
    });
  }
});

export default router;
