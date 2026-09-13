import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Send, User, Briefcase, Zap, HelpCircle } from 'lucide-react';

export default function ProposalTab({ presetData, onClearPreset }) {
  const [formData, setFormData] = useState({
    jobTitle: presetData?.jobTitle || '',
    jobDescription: presetData?.jobDescription || '',
    clientName: presetData?.clientName || '',
    skills: presetData?.skills || '',
    experienceYears: presetData?.experienceYears || '2 years',
    tone: presetData?.tone || 'Confident & Professional',
    proposedRate: presetData?.proposedRate || '$35/hr',
    portfolioLinks: presetData?.portfolioLinks || ''
  });

  // Update if preset changes
  React.useEffect(() => {
    if (presetData) {
      setFormData(prev => ({ ...prev, ...presetData }));
    }
  }, [presetData]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to generate proposal');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred while connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `Subject: ${result.subjectLine}\n\n${result.proposalBody}\n\nCall to action:\n${result.callToAction}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setFormData({
      jobTitle: 'Full-Stack React & Node.js Developer for SaaS Analytics Dashboard',
      jobDescription: 'Looking for a fast, communicative developer to build a modern React dashboard connected to an Express REST API with charts, user auth, and responsive UI in 10-14 days. Must have experience with Tailwind and clean code.',
      clientName: 'Alex Rivera',
      skills: 'React 18, Vite, Tailwind CSS, Express, PostgreSQL, REST APIs',
      experienceYears: '2+ years freelancing',
      tone: 'Confident & Professional',
      proposedRate: '$40/hr (or $1,400 fixed milestone)',
      portfolioLinks: 'https://github.com/alex-dev'
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mt-1">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Proposal Generator</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                Module 1 (Member 1)
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">
              Turn client job briefs into tailored, high-converting freelance proposals with custom hooks & value propositions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSample}
          className="self-start md:self-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Load Sample Job Brief</span>
        </button>
      </div>

      {/* Main Grid: Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <span>Job Post & Freelancer Profile</span>
            </h3>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Title / Project Headline <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Stack React & Node.js Developer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client Job Description / Brief <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Paste the client's job requirements, what they need built, and expectations..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Client Name & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Name (if known)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex (Optional)"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tone & Style
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
                >
                  <option>Confident & Professional</option>
                  <option>Friendly & Approachable</option>
                  <option>Direct & Results-Oriented</option>
                  <option>Consultative Expert</option>
                </select>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Tech Stack / Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Tailwind"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Experience Level
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1-2 years freelancing"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Rate & Portfolio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Proposed Rate / Budget
                </label>
                <input
                  type="text"
                  placeholder="e.g. $35/hr or $1,200 fixed"
                  value={formData.proposedRate}
                  onChange={(e) => setFormData({ ...formData, proposedRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Portfolio / GitHub Link
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  value={formData.portfolioLinks}
                  onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Winning Proposal with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Tailored Proposal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-6 rounded-2xl min-h-[500px] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-white">Generated Client Proposal</h3>
                  {result && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Ready to Send
                    </span>
                  )}
                </div>

                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Proposal</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-slate-300">
                    Analyzing job specifications & engineering proposal hooks...
                  </p>
                  <p className="text-xs text-slate-500">
                    Applying value-based pricing and milestone breakdown
                  </p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                  <FileText className="w-12 h-12 stroke-[1.2] text-slate-600" />
                  <p className="text-sm font-medium text-slate-400">No proposal generated yet</p>
                  <p className="text-xs max-w-sm">
                    Fill out the job brief on the left or click "Load Sample Job Brief" to see a full tailored proposal.
                  </p>
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4 text-sm">
                  {/* Subject Line Pill */}
                  {result.subjectLine && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5">
                        Subject Line Hook
                      </span>
                      <p className="text-slate-200 font-medium">{result.subjectLine}</p>
                    </div>
                  )}

                  {/* Proposal Body */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-sm">
                    {result.proposalBody}
                  </div>

                  {/* Key Highlights */}
                  {result.keyHighlights && result.keyHighlights.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                      <span className="text-xs font-semibold text-emerald-400 block mb-2">
                        Key Selling Points Highlighted:
                      </span>
                      <ul className="space-y-1.5">
                        {result.keyHighlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Call to action */}
                  {result.callToAction && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 font-medium block mb-1">Closing Call-To-Action:</span>
                      <p className="text-emerald-300 font-medium italic">"{result.callToAction}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer metadata */}
            {result?.estimatedDeliverySuggestion && (
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>⏱️ Timeline Suggestion:</span>
                <span className="text-slate-300 font-medium">{result.estimatedDeliverySuggestion}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
