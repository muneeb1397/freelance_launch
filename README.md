# 🚀 FreelanceLaunch — All-in-One Gen-AI Freelance Platform

**Event:** Pak Angels Mid-Term Hackathon (Cohort 11)  
**Team Composition:** 1 Leader + 4 Members  
**Stack:** React + Vite + Tailwind CSS (Frontend) | Node.js + Express (Backend) | Groq API / Llama 3.3 (Gen-AI Engine)

---

## 🎯 Project Overview & Problem Statement

Young professionals and students entering freelancing struggle across the entire lifecycle of a client engagement:
1. **Winning the Gig:** Crafting personalized, compelling proposals instead of generic pitches.
2. **Quality Assurance:** Vetting code quality and edge-case security before client delivery.
3. **Formalizing Agreements:** Drafting clear Statements of Work (SOW) and matched milestone invoices.
4. **Navigating Difficult Client Comms:** Managing scope creep, timeline delays, and negotiations diplomatically.

**FreelanceLaunch** brings all 4 stages together into a single, cohesive developer-first application.

---

## 🏗️ Architecture & Modules

| Module # | Feature | Team Owner | API Endpoint |
|---|---|---|---|
| **Module 1** | **Proposal Generator** | Member 1 | `POST /api/proposal` |
| **Module 2** | **Code Quality Reviewer** | Member 3 | `POST /api/review` |
| **Module 3** | **Contract & Invoice Generator** | Member 4 | `POST /api/contract` |
| **Module 4** | **Client Communication Assistant** | Member 5 | `POST /api/message` |

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```
*(or run `npm install` inside both `server` and `client` folders)*

### 2. Configure Environment (Optional for Groq LLM)
Copy the environment template in `server/`:
```bash
cp server/.env.example server/.env
```
Add your Groq API key:
```env
PORT=5000
GROQ_API_KEY=gsk_your_actual_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```
> 💡 *Note: If `GROQ_API_KEY` is not provided, the built-in intelligent fallback generator will automatically generate realistic, high-quality responses for seamless offline demos.*

### 3. Start Both Backend & Frontend
```bash
npm run dev
```
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Run Automated Smoke Tests
```bash
cd server
node test-endpoints.js
```

---

## 📋 Leader's Integration & Member Handoff Workflow

When a team member finishes their module:
1. Ask them for their single route file (`routes/<module>.js`) and 2-3 sample request/response payloads.
2. Drop their route file into `server/routes/<module>.js`.
3. Run `node test-endpoints.js` in `server/` to verify their logic runs and conforms to `{ success: true, result: ... }`.
4. Open the frontend at `http://localhost:3000` and click the module tab to test the live UI.

---

## 🎥 Demo Script (3-Minute Presentation Guide)

1. **Problem (30s):** Show the 4 pain points young freelancers face (proposals, code delivery anxiety, lack of contracts, awkward client chats).
2. **Live Walkthrough (2 mins):**
   - **Tab 1 (Proposal):** Click *"Load Sample Job Brief"* → click *"Generate"* → show tailored subject hook & value highlights.
   - **Tab 2 (Code Review):** Click *"Load Sample Vulnerable Snippet"* → click *"Run Quality Review"* → show vulnerability flags, score, and instant senior refactor.
   - **Tab 3 (Contract & Invoice):** Click *"Load Sample SaaS Agreement"* → click *"Generate"* → toggle between the legal SOW and formatted Invoice.
   - **Tab 4 (Client Comms):** Click *"Sample: Scope Creep"* → click *"Generate"* → show diplomatic response + instant Slack/WhatsApp short version.
3. **Closing (30s):** Highlight team integration, Groq Llama 3.3 latency, and modular architecture.
