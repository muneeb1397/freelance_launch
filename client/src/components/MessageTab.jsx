import React, { useState } from 'react';
import { MessageSquare, Send, Copy, Check, Sparkles, Zap, Shield, HelpCircle, Mail, MessageCircle } from 'lucide-react';

export default function MessageTab({ presetData }) {
  const [formData, setFormData] = useState({
    scenario: presetData?.scenario || 'scope_creep',
    clientName: presetData?.clientName || '',
    freelancerName: presetData?.freelancerName || '',
    projectDetails: presetData?.projectDetails || '',
    tone: presetData?.tone || 'Diplomatic & Firm',
    extraNotes: presetData?.extraNotes || ''
  });

  React.useEffect(() => {
    if (presetData) {
      setFormData(prev => ({ ...prev, ...presetData }));
    }
  }, [presetData]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to draft client message');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred while connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (type) => {
    if (!result) return;
    if (type === 'main') {
      const text = `Subject: ${result.subjectLine}\n\n${result.messageBody}`;
      navigator.clipboard.writeText(text);
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } else {
      navigator.clipboard.writeText(result.alternativeShortVersion || result.messageBody);
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2000);
    }
  };

  const loadSample = (type = 'scope_creep') => {
    if (type === 'scope_creep') {
      setFormData({
        scenario: 'scope_creep',
        clientName: 'Alex Rivera',
        freelancerName: 'David Dev',
        projectDetails: 'Client just sent an email asking to also add multi-language i18n support and a custom export-to-PDF feature, which were not in our original SOW contract.',
        tone: 'Diplomatic & Firm',
        extraNotes: 'Offer to add it as Phase 2 add-on for +$350, or adjust the timeline by +4 days.'
      });
    } else if (type === 'delay_warning') {
      setFormData({
        scenario: 'delay_warning',
        clientName: 'Alex Rivera',
        freelancerName: 'David Dev',
        projectDetails: 'Encountered unexpected breaking third-party API changes with the payment gateway, need 1 extra day for safe testing.',
        tone: 'Proactive & Reassuring',
        extraNotes: 'Will deliver finished milestone by tomorrow at 5 PM EST.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mt-1">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Client Communication Assistant</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                Module 4 (Member 5)
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">
              Handle tricky client situations with confidence: navigate scope creep, communicate delays gracefully, and negotiate without stress.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadSample('scope_creep')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center space-x-1 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Sample: Scope Creep</span>
          </button>
          <button
            type="button"
            onClick={() => loadSample('delay_warning')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center space-x-1 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Sample: Delay Warning</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <span>Communication Scenario</span>
            </h3>

            {/* Scenario Picker */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Freelance Scenario <span className="text-amber-400">*</span>
              </label>
              <select
                value={formData.scenario}
                onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
              >
                <option value="scope_creep">🛡️ Scope Creep (Client asked for extra work)</option>
                <option value="delay_warning">⏳ Delay Notification (Need deadline extension politely)</option>
                <option value="payment_reminder">💰 Payment Follow-up (Friendly overdue invoice reminder)</option>
                <option value="status_update">🚀 Milestone Status Update (Proactive report)</option>
                <option value="price_negotiation">🤝 Price Negotiation (Defend value without losing gig)</option>
                <option value="asking_for_testimonial">⭐ Testimonial / Review Request (After successful delivery)</option>
                <option value="custom">✍️ Custom Awkward Freelance Situation</option>
              </select>
            </div>

            {/* Client & Freelancer Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David"
                  value={formData.freelancerName}
                  onChange={(e) => setFormData({ ...formData, freelancerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Situation Details */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                What happened? (Context & details) <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Explain the situation (e.g. client requested 3 new features not in scope, or API crashed causing delay)..."
                value={formData.projectDetails}
                onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Tone & Extra Pricing notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tone of Message
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
                >
                  <option>Diplomatic & Firm</option>
                  <option>Friendly & Positive</option>
                  <option>Proactive & Reassuring</option>
                  <option>Formal & Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Extra Options / Quotes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quote +$300 or +3 days"
                  value={formData.extraNotes}
                  onChange={(e) => setFormData({ ...formData, extraNotes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Drafting Professional Client Message...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Diplomatic Client Message</span>
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
                  <h3 className="text-base font-semibold text-white">Polished Client Response</h3>
                  {result && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {result.recommendedChannel || 'Email / Chat'}
                    </span>
                  )}
                </div>

                {result && (
                  <button
                    onClick={() => handleCopy('main')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                  >
                    {copiedMain ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email</span>
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
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-slate-300">
                    Applying behavioral communication & negotiation framing...
                  </p>
                  <p className="text-xs text-slate-500">
                    Balancing firm boundaries with client relationship retention
                  </p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-12 h-12 stroke-[1.2] text-slate-600" />
                  <p className="text-sm font-medium text-slate-400">No message drafted yet</p>
                  <p className="text-xs max-w-sm">
                    Select a situation on the left or click sample buttons to generate an expertly phrased response.
                  </p>
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Subject Line */}
                  {result.subjectLine && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block mb-0.5">
                        Subject Line
                      </span>
                      <p className="text-slate-200 font-medium">{result.subjectLine}</p>
                    </div>
                  )}

                  {/* Main Message Body */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-sm">
                    {result.messageBody}
                  </div>

                  {/* Short instant messaging version (Slack / WhatsApp) */}
                  {result.alternativeShortVersion && (
                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Short Version (for Slack / WhatsApp / Upwork Chat)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy('short')}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center space-x-1 transition-all"
                        >
                          {copiedShort ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedShort ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-slate-300 text-xs italic">
                        "{result.alternativeShortVersion}"
                      </p>
                    </div>
                  )}

                  {/* Strategy Note */}
                  {result.negotiationStrategy && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-amber-400 font-semibold block mb-0.5">💡 Strategy & Why This Works:</span>
                      <p className="text-slate-400">{result.negotiationStrategy}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
