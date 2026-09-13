import React, { useState } from 'react';
import { Code, CheckCircle, AlertTriangle, AlertCircle, Copy, Check, Sparkles, Zap, ShieldAlert, Cpu } from 'lucide-react';

export default function ReviewTab({ presetData }) {
  const [formData, setFormData] = useState({
    code: presetData?.code || '',
    language: presetData?.language || 'javascript',
    focusArea: presetData?.focusArea || 'Junior-to-Senior Refactor',
    context: presetData?.context || 'API client & data handler for client gig'
  });

  React.useEffect(() => {
    if (presetData) {
      setFormData(prev => ({ ...prev, ...presetData }));
    }
  }, [presetData]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to review code snippet');
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
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const loadSample = () => {
    setFormData({
      code: `// Junior freelance code submission for user data export
async function handleExport(req, res) {
  let user = req.body.user;
  var data = await db.query("SELECT * FROM orders WHERE user_id = " + user.id);
  var result = [];
  for(var i=0; i<data.length; i++) {
    result.push({
      orderId: data[i].id,
      amount: data[i].amount,
      raw: data[i]
    });
  }
  res.send({ status: 'ok', data: result });
}`,
      language: 'javascript',
      focusArea: 'Security & Senior Refactor',
      context: 'Express backend endpoint for client e-commerce platform'
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
              Review code before client handoff: catch edge bugs, eliminate security holes, and get an instant senior refactor.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSample}
          className="self-start md:self-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Load Sample Vulnerable Snippet</span>
        </button>
      </div>

      {/* Main Grid: Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <span>Code Review Configuration</span>
            </h3>

            {/* Language & Focus Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Language / Framework <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
                >
                  <option value="javascript">JavaScript / Node.js</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL Query</option>
                  <option value="html">HTML / CSS / Tailwind</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Review Focus
                </label>
                <select
                  value={formData.focusArea}
                  onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
                >
                  <option>Junior-to-Senior Refactor</option>
                  <option>Security & Vulnerability Audit</option>
                  <option>Performance & Async Optimization</option>
                  <option>Readability & Clean Code</option>
                </select>
              </div>
            </div>

            {/* Context */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Context / Feature Purpose (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Express endpoint handling order query and export for client"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Code Snippet <span className="text-cyan-400">*</span>
              </label>
              <textarea
                rows={10}
                required
                placeholder="Paste the function or file snippet you want reviewed..."
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-cyan-200 placeholder-slate-600 bg-slate-950"
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
                  <span>Auditing Code & Producing Refactor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Quality Review & Refactor</span>
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
                  <h3 className="text-base font-semibold text-white">Review & Refactor Verdict</h3>
                  {result && (
                    <span className={`text-[11px] px-2.5 py-0.5 rounded font-bold ${
                      (result.score || 80) >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      (result.score || 80) >= 60 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      Score: {result.score || 85}/100
                    </span>
                  )}
                </div>

                {result?.refactoredCode && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Refactor</span>
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
                  <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-slate-300">
                    Inspecting AST, analyzing vulnerabilities & structuring senior refactor...
                  </p>
                  <p className="text-xs text-slate-500">
                    Checking error handlers, security patterns, and idiomatic practices
                  </p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                  <Cpu className="w-12 h-12 stroke-[1.2] text-slate-600" />
                  <p className="text-sm font-medium text-slate-400">No code reviewed yet</p>
                  <p className="text-xs max-w-sm">
                    Paste a code snippet on the left or click "Load Sample Vulnerable Snippet" to see AI review and production refactor.
                  </p>
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Summary & Client Readiness */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        Executive Summary
                      </span>
                      {result.deliveryReadinessVerdict && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {result.deliveryReadinessVerdict}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">{result.summary}</p>
                  </div>

                  {/* Flagged Issues */}
                  {result.issues && result.issues.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300 block">
                        Flagged Issues & Risks:
                      </span>
                      <div className="space-y-2">
                        {result.issues.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                item.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                item.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {item.severity}
                              </span>
                              <span className="font-semibold text-white">{item.issue}</span>
                            </div>
                            <p className="text-slate-400 text-xs">{item.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Refactored Code Output */}
                  {result.refactoredCode && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-cyan-400 block">
                        ✨ Production-Ready Refactor:
                      </span>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto max-h-64 whitespace-pre">
                        {result.refactoredCode}
                      </div>
                    </div>
                  )}

                  {/* Key improvements bullet points */}
                  {result.keyImprovements && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                      <span className="font-semibold text-slate-300 block mb-1.5">Key Improvements Applied:</span>
                      <ul className="space-y-1">
                        {result.keyImprovements.map((imp, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-slate-300">
                            <span className="text-cyan-400">✓</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
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
