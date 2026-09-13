import React, { useState } from 'react';
import { MessageSquare, Sparkles, Copy, Check, Zap } from 'lucide-react';

const SITUATIONS = ['Scope creep', 'Project delay', 'Status update', 'Rate negotiation'];
const TONES = ['Professional (default)', 'Firm', 'Friendly', 'Formal'];

export default function MessageTab() {
  const [formData, setFormData] = useState({
    situation: 'Scope creep',
    context: '',
    tone: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: formData.situation,
          context: formData.context,
          tone: formData.tone === '' || formData.tone === 'Professional (default)' ? undefined : formData.tone
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to generate message');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred while connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setFormData({
      situation: 'Scope creep',
      context: 'The client keeps asking for extra dashboard widgets that were not in the original agreed scope, without offering extra budget or timeline.',
      tone: 'Firm'
    });
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
              Draft a professional client message for scope creep, delays, updates, or negotiation.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSample}
          className="self-start md:self-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Sample: Scope Creep</span>
        </button>
      </div>

      {/* Main Grid: Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <span>Situation Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Situation <span className="text-amber-400">*</span>
                </label>
                <select
                  value={formData.situation}
                  onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
                >
                  {SITUATIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tone
                </label>
                <select
                  value={formData.tone || 'Professional (default)'}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
                >
                  {TONES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Context <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Briefly describe what's actually going on..."
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Drafting Message...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-6 rounded-2xl min-h-[400px] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white">Drafted Client Message</h3>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
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
                  <p className="text-sm font-medium text-slate-300">Writing your message...</p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-12 h-12 stroke-[1.2] text-slate-600" />
                  <p className="text-sm font-medium text-slate-400">No message generated yet</p>
                  <p className="text-xs max-w-sm">
                    Fill out the context on the left or click "Sample: Scope Creep."
                  </p>
                </div>
              )}

              {!loading && result && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                  {result}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
