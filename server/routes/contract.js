import express from 'express';
import { generateWithGroq } from '../utils/groqClient.js';

const router = express.Router();

/**
 * POST /api/contract
 * Request Body:
 * {
 *   "freelancerName": "Jane Developer",
 *   "clientName": "Acme Corp (Alex Smith)",
 *   "projectTitle": "Custom E-Commerce Storefront",
 *   "scopeOfWork": "Design and development of 5 responsive pages in Next.js...",
 *   "deliverables": "Source code repository, staging deployment, 14 days bug fix support",
 *   "totalAmount": 1500,
 *   "currency": "USD" | "PKR" | "EUR" | "GBP",
 *   "paymentStructure": "50% upfront, 50% on milestone completion" | "100% upfront" | "Milestone based",
 *   "deadline": "2026-10-15",
 *   "revisions": "2 rounds of feedback"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const {
      freelancerName = '',
      clientName = '',
      projectTitle = '',
      scopeOfWork = '',
      deliverables = '',
      totalAmount = 0,
      currency = 'USD',
      paymentStructure = '50% upfront, 50% upon final delivery',
      deadline = '14 business days from kickoff',
      revisions = 'Up to 2 rounds of included revisions'
    } = req.body;

    if (!projectTitle && !scopeOfWork) {
      return res.status(400).json({
        success: false,
        error: 'Please provide project title or scope of work.'
      });
    }

    const fName = freelancerName || 'Freelance Service Provider';
    const cName = clientName || 'Client / Company Name';
    const todayStr = new Date().toISOString().split('T')[0];
    const invoiceNum = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const systemPrompt = `You are a legal and freelance operations expert. Generate a professional, clean Statement of Work (SOW) / Freelance Service Agreement along with a structured matching invoice.
Respond ONLY with a valid JSON object matching this structure:
{
  "contractTitle": "Freelance Services Agreement: Project Name",
  "contractAgreementText": "Full formatted legal agreement in clean markdown covering Parties, Scope, Deliverables, Payment Terms, Intellectual Property, Revision Policy, and Termination clauses.",
  "invoice": {
    "invoiceNumber": "INV-1001",
    "issueDate": "YYYY-MM-DD",
    "dueDate": "Upon receipt / Milestone completion",
    "billFrom": "Freelancer details",
    "billTo": "Client details",
    "lineItems": [
      { "description": "Item 1", "quantity": 1, "rate": "$X", "amount": "$X" }
    ],
    "subtotal": "$X",
    "tax": "$0",
    "total": "$X",
    "paymentNotes": "Payment instructions & terms"
  },
  "keyClausesSummary": [
    "50% upfront deposit required prior to project kickoff",
    "2 rounds of revisions included within agreed scope",
    "Client assumes full IP ownership upon receipt of full final payment"
  ]
}`;

    const userPrompt = `Freelancer Name: ${fName}
Client Name: ${cName}
Project Title: ${projectTitle || 'Web Development & Consulting Project'}
Scope of Work: ${scopeOfWork}
Deliverables: ${deliverables}
Total Amount: ${totalAmount} ${currency}
Payment Structure: ${paymentStructure}
Deadline / Timeline: ${deadline}
Revisions: ${revisions}
Date: ${todayStr}
Invoice Number: ${invoiceNum}`;

    const fallbackGenerator = () => {
      const formattedTotal = `${currency} ${Number(totalAmount || 1200).toLocaleString()}`;
      return {
        contractTitle: `Freelance Agreement & SOW: ${projectTitle || 'Custom Software Development'}`,
        contractAgreementText: `### FREELANCE SERVICES AGREEMENT & STATEMENT OF WORK\n\n**Date:** ${todayStr}\n**Agreement ID:** AGR-${Math.floor(10000 + Math.random() * 90000)}\n\n---\n\n#### 1. PARTIES\n- **Service Provider:** ${fName} ("Freelancer")\n- **Client:** ${cName} ("Client")\n\n#### 2. PROJECT SCOPE & OBJECTIVES\n${scopeOfWork || 'Provision of custom software engineering, frontend/backend integration, and responsive design services as outlined in project brief.'}\n\n#### 3. DELIVERABLES\n${deliverables || '- Complete source code repository\n- Production-ready deployment\n- 14 days warranty bug-fix period'}\n\n#### 4. COMPENSATION & PAYMENT TERMS\n- **Total Contract Price:** ${formattedTotal}\n- **Payment Schedule:** ${paymentStructure}\n- Payments shall be made within 7 business days of invoice submission.\n\n#### 5. TIMELINE & MILESTONES\n- Project Delivery Target: ${deadline}\n- Revisions: ${revisions}\n\n#### 6. INTELLECTUAL PROPERTY & TRANSFER\nUpon receipt of full and final payment, all custom intellectual property and code created under this agreement transfers exclusively to the Client.\n\n#### 7. SIGNATURES & ACCEPTANCE\nBy paying the upfront deposit or signing below, both parties agree to these terms.\n\n*Client Signature:* _________________________ Date: _______\n*Freelancer Signature:* ____________________ Date: _______`,
        invoice: {
          invoiceNumber: invoiceNum,
          issueDate: todayStr,
          dueDate: 'Upon Receipt (Kickoff Milestone)',
          billFrom: `${fName}\nIndependent Freelance Consultant`,
          billTo: `${cName}\nClient Account`,
          lineItems: [
            {
              description: `${projectTitle || 'Freelance Services'} - Phase 1 Milestone / Kickoff`,
              quantity: 1,
              rate: formattedTotal,
              amount: formattedTotal
            }
          ],
          subtotal: formattedTotal,
          tax: '0.00',
          total: formattedTotal,
          paymentNotes: `Payment terms: ${paymentStructure}. Please remit payment via Bank Wire, Wise, or preferred platform transfer.`
        },
        keyClausesSummary: [
          `Payment terms defined as: ${paymentStructure}`,
          `Delivery target set for: ${deadline}`,
          `IP rights transfer automatically upon full payment settlement (${formattedTotal})`,
          `${revisions}`
        ]
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
    console.error('Contract route error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate contract & invoice.'
    });
  }
});

export default router;
