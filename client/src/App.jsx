import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ProposalTab from './components/ProposalTab.jsx';
import ReviewTab from './components/ReviewTab.jsx';
import ContractTab from './components/ContractTab.jsx';
import MessageTab from './components/MessageTab.jsx';
import { 
  FileText, 
  Code, 
  ScrollText, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Terminal
} from 'lucide-react';

const TABS = [
  {
    id: 'proposal',
    name: '1. Proposal Generator',
    subtitle: 'Win client gigs',
    owner: 'Member 1',
    icon: FileText,
    color: 'emerald',
    badge: 'Module 1'
  },
  {
    id: 'review',
    name: '2. Code Reviewer',
    subtitle: 'Deliver senior-grade code',
    owner: 'Member 3',
    icon: Code,
    color: 'cyan',
    badge: 'Module 2'
  },
  {
    id: 'contract',
    name: '3. Contract & Invoice',
    subtitle: 'SOWs & payment terms',
    owner: 'Member 4',
    icon: ScrollText,
    color: 'violet',
    badge: 'Module 3'
  },
  {
    id: 'message',
    name: '4. Client Assistant',
    subtitle: 'Tricky conversations & scope',
    owner: 'Member 5',
    icon: MessageSquare,
    color: 'amber',
    badge: 'Module 4'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('proposal');

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 bg-grid-pattern relative">
      {/* Background ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 left-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero & Tab Navigation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">FreelanceLaunch</span>
            <span className="text-slate-500">•</span>
            <span>Empowering Next-Gen Freelancers End-to-End</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            The Complete Freelance Lifecycle in One AI Suite
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            From winning the proposal, to vetting production code, generating formal legal agreements, and navigating client communication smoothly.
          </p>
        </div>

        {/* 4 Interactive Module Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 relative overflow-hidden group ${
                  isActive
                    ? 'bg-slate-900/90 border-2 border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/40 border border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-xl ${
                    isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/60 text-slate-400'
                  }`}>
                    {tab.owner}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {tab.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {tab.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        <div className="transition-opacity duration-300">
          {activeTab === 'proposal' && <ProposalTab />}
          {activeTab === 'review' && <ReviewTab />}
          {activeTab === 'contract' && <ContractTab />}
          {activeTab === 'message' && <MessageTab />}
        </div>

        {/* Team Architecture & Hackathon Status Footer Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">System Architecture & API Endpoints</h3>
            </div>
            <span className="text-xs text-slate-400">
              Pak Angels Mid-Term Hackathon (Cohort 11) • Team 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-emerald-400 font-mono font-semibold block">POST /api/proposal</span>
              <span className="text-slate-400 text-[11px]">Member 1 • Tailored Upwork/Job Proposals</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-cyan-400 font-mono font-semibold block">POST /api/review</span>
              <span className="text-slate-400 text-[11px]">Member 3 • Quality & Security Code Review</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-violet-400 font-mono font-semibold block">POST /api/contract</span>
              <span className="text-slate-400 text-[11px]">Member 4 • SOW Contracts & Invoicing</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-amber-400 font-mono font-semibold block">POST /api/message</span>
              <span className="text-slate-400 text-[11px]">Member 5 • Scope Creep & Client Comms</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
