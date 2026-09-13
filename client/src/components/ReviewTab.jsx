import { API_BASE } from '../config.js';
import React, { useState } from 'react';
import { Code, Sparkles, Copy, Check, Zap } from 'lucide-react';

export default function ReviewTab() {
  const [formData, setFormData] = useState({
    code: '',
    language: 'javascript'
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
      const response = await fetch(`${API_BASE}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to review code');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred while connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.refactoredCode) return;
    navigator.clipboard.writeText(result.refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setFormData({
      language: 'javascript',
      code: `function getUser(id) {
  var data = fetch('/api/users/' + id).then(r => r.json())
  return data
}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mt-1">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Code Quality Reviewer</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30">
                Module 2 (Member 3)
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">
              Flag issues in a code snippet, explain why they matter, and get a clean refactor.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSample}
          className="self-start md:self-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Load Sample Snippet</span>
        </button>
      </div>

      {/* Main Grid: Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <span>Code Snippet</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Language <span className="text-cyan-400">*</span>
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Code <span className="text-cyan-400">*</span>
              </label>
              <textarea
                rows={10}
                required
                placeholder="Paste your code snippet here..."
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Reviewing Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Quality Review</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-6 rounded-2xl min-h-[400px] shadow-xl">
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-slate-300">Reviewing your code...</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                <Code className="w-12 h-12 stroke-[1.2] text-slate-600" />
                <p className="text-sm font-medium text-slate-400">No review yet</p>
                <p className="text-xs max-w-sm">
                  Paste code on the left or click "Load Sample Snippet."
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-4 text-sm">
                {result.issues?.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block mb-2">Flagged Issues:</span>
                    <ul className="space-y-1.5">
                      {result.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.explanation && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                    <span className="text-xs font-semibold text-cyan-400 block mb-1.5">Why This Matters:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>
                  </div>
                )}

                {result.refactoredCode && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-cyan-400 block">Refactored Code:</span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-all"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto max-h-64 whitespace-pre">
                      {result.refactoredCode}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
