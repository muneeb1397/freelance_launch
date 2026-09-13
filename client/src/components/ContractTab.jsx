import { API_BASE } from '../config.js';
import React, { useState } from 'react';
import { ScrollText, Sparkles, Copy, Check, Zap } from 'lucide-react';

export default function ContractTab() {
  const [formData, setFormData] = useState({
    clientName: '',
    freelancerName: '',
    projectScope: '',
    paymentAmount: '',
    paymentTerms: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null); // 'contract' | 'invoice' | null

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('${API_BASE}/api/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentAmount: Number(formData.paymentAmount)
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to generate contract/invoice');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred while connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (which) => {
    if (!result) return;
    navigator.clipboard.writeText(which === 'contract' ? result.contract : result.invoice);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  const loadSample = () => {
    setFormData({
      clientName: 'NovaGrowth Technologies (Alex Rivera)',
      freelancerName: 'Sarah Jenkins (Full-Stack Dev)',
      projectScope: 'Build a React + Express analytics dashboard with charting, user auth, and a responsive UI.',
      paymentAmount: '1400',
      paymentTerms: '50% upfront, 50% on delivery'
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-900 border border-violet-500/20">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 mt-1">
            <ScrollText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Contract & Invoice Generator</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium border border-violet-500/30">
                Module 3 (Member 4)
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">
              Turn project details into a plain-English SOW draft and a matching invoice.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSample}
          className="self-start md:self-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Load Sample SaaS Agreement</span>
        </button>
      </div>

      {/* Main Grid: Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <span>Project & Payment Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NovaGrowth Technologies"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Freelancer Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.freelancerName}
                  onChange={(e) => setFormData({ ...formData, freelancerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Scope <span className="text-violet-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Brief description of the work"
                value={formData.projectScope}
                onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payment Amount ($) <span className="text-violet-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="e.g. 1400"
                  value={formData.paymentAmount}
                  onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payment Terms <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50% upfront, 50% on delivery"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-slate-950 font-bold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Drafting Contract & Invoice...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Contract & Invoice</span>
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
                <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-slate-300">Drafting SOW and invoice...</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                <ScrollText className="w-12 h-12 stroke-[1.2] text-slate-600" />
                <p className="text-sm font-medium text-slate-400">No contract generated yet</p>
                <p className="text-xs max-w-sm">
                  Fill out the details on the left or click "Load Sample SaaS Agreement."
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <h3 className="text-sm font-semibold text-white">Contract / SOW Draft</h3>
                    <button
                      onClick={() => handleCopy('contract')}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                    >
                      {copied === 'contract' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-violet-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed text-xs">
                    {result.contract}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <h3 className="text-sm font-semibold text-white">Invoice</h3>
                    <button
                      onClick={() => handleCopy('invoice')}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                    >
                      {copied === 'invoice' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-violet-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed text-xs font-mono">
                    {result.invoice}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
