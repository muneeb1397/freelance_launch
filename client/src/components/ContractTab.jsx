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
      const response = await fetch('/api/contract', {
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


/*


import React, { useState } from 'react';
import { ScrollText, FileCheck, Copy, Check, Sparkles, Zap, DollarSign, Receipt, Printer } from 'lucide-react';

export default function ContractTab({ presetData }) {
  const [formData, setFormData] = useState({
    freelancerName: presetData?.freelancerName || '',
    clientName: presetData?.clientName || '',
    projectTitle: presetData?.projectTitle || '',
    scopeOfWork: presetData?.scopeOfWork || '',
    deliverables: presetData?.deliverables || '',
    totalAmount: presetData?.totalAmount || 1500,
    currency: presetData?.currency || 'USD',
    paymentStructure: presetData?.paymentStructure || '50% upfront deposit, 50% upon final delivery',
    deadline: presetData?.deadline || '14 business days from kickoff',
    revisions: presetData?.revisions || 'Up to 2 rounds of included revisions'
  });

  React.useEffect(() => {
    if (presetData) {
      setFormData(prev => ({ ...prev, ...presetData }));
    }
  }, [presetData]);

  const [activeSubTab, setActiveSubTab] = useState('contract'); // 'contract' | 'invoice'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to generate contract & invoice');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred while connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    let textToCopy = '';
    if (activeSubTab === 'contract') {
      textToCopy = `${result.contractTitle}\n\n${result.contractAgreementText}`;
    } else {
      const inv = result.invoice;
      textToCopy = `INVOICE #${inv?.invoiceNumber || '1001'}\nDate: ${inv?.issueDate}\nDue: ${inv?.dueDate}\n\nFrom:\n${inv?.billFrom}\n\nTo:\n${inv?.billTo}\n\nTotal: ${inv?.total}\n\nPayment Notes:\n${inv?.paymentNotes}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setFormData({
      freelancerName: 'Sarah Jenkins (Full-Stack Dev)',
      clientName: 'NovaGrowth Technologies (Alex Rivera)',
      projectTitle: 'Custom Next.js SaaS MVP & Stripe Billing Integration',
      scopeOfWork: 'Design and implementation of a 6-page responsive SaaS application, user onboarding flow, Supabase database setup, and Stripe webhook subscription billing.',
      deliverables: '- GitHub source code repository\n- Production deployment on Vercel\n- Video walkthrough & documentation\n- 14 days post-launch warranty support',
      totalAmount: 1800,
      currency: 'USD',
      paymentStructure: '50% ($900) upfront deposit, 50% ($900) upon deployment',
      deadline: '3 weeks from contract signing',
      revisions: '2 rounds of design & feature adjustments'
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
              Instantly generate bulletproof Statement of Work (SOW) agreements, scope boundaries, and formatted milestone invoices.
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
              <span>Agreement & Payment Details</span>
            </h3>

            {/* Freelancer & Client Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Freelancer / Agency Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Dev"
                  value={formData.freelancerName}
                  onChange={(e) => setFormData({ ...formData, freelancerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client / Company Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Title / SOW Headline <span className="text-violet-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Custom Web Application Development"
                value={formData.projectTitle}
                onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Scope & Deliverables */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Scope of Work (What is included) <span className="text-violet-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detailed breakdown of what is being built..."
                value={formData.scopeOfWork}
                onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Deliverables Checklist
              </label>
              <textarea
                rows={2}
                placeholder="Source code, deployed URL, docs..."
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Pricing & Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Total Amount <span className="text-violet-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900"
                >
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (₨)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 days"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Payment Structure */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Payment Schedule Structure
              </label>
              <input
                type="text"
                placeholder="e.g. 50% upfront deposit, 50% on delivery"
                value={formData.paymentStructure}
                onChange={(e) => setFormData({ ...formData, paymentStructure: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Drafting Legal Agreement & Invoice...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate SOW Agreement & Matching Invoice</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-6 rounded-2xl min-h-[500px] flex flex-col justify-between shadow-xl">
            <div>
              {/* Header with Sub-tabs for Contract vs Invoice */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('contract')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
                      activeSubTab === 'contract'
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>SOW Contract</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('invoice')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
                      activeSubTab === 'invoice'
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Matching Invoice</span>
                  </button>
                </div>

                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-violet-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy {activeSubTab === 'contract' ? 'Agreement' : 'Invoice'}</span>
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
                  <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-slate-300">
                    Drafting legally structured clauses & calculating invoice balances...
                  </p>
                  <p className="text-xs text-slate-500">
                    Embedding IP transfer, revision scope, and milestone terms
                  </p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                  <ScrollText className="w-12 h-12 stroke-[1.2] text-slate-600" />
                  <p className="text-sm font-medium text-slate-400">No contract or invoice generated</p>
                  <p className="text-xs max-w-sm">
                    Enter project details on the left or click "Load Sample SaaS Agreement" to generate full documents.
                  </p>
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4 text-xs sm:text-sm">
                  {activeSubTab === 'contract' ? (
                    /* Contract View */
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Document</span>
                        <h4 className="text-sm font-bold text-white">{result.contractTitle}</h4>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed font-sans text-xs max-h-[380px] overflow-y-auto">
                        {result.contractAgreementText}
                      </div>

                      {result.keyClausesSummary && (
                        <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs">
                          <span className="font-semibold text-violet-300 block mb-1">Key Legal Protections Included:</span>
                          <ul className="space-y-1">
                            {result.keyClausesSummary.map((clause, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5 text-slate-300">
                                <span className="text-violet-400 font-bold">•</span>
                                <span>{clause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Invoice View */
                    <div className="space-y-3">
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-4">
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                          <div>
                            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">INVOICE</span>
                            <h4 className="text-base font-extrabold text-white">{result.invoice?.invoiceNumber || 'INV-1001'}</h4>
                          </div>
                          <div className="text-right text-xs text-slate-400">
                            <p>Date: <span className="text-slate-200">{result.invoice?.issueDate}</span></p>
                            <p>Due: <span className="text-slate-200">{result.invoice?.dueDate}</span></p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium block">Billed From:</span>
                            <p className="text-slate-200 font-semibold whitespace-pre-line">{result.invoice?.billFrom}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Billed To:</span>
                            <p className="text-slate-200 font-semibold whitespace-pre-line">{result.invoice?.billTo}</p>
                          </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                          <div className="grid grid-cols-12 bg-slate-900 px-3 py-2 text-slate-400 font-semibold">
                            <div className="col-span-8">Description</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-right">Amount</div>
                          </div>
                          {result.invoice?.lineItems?.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 px-3 py-2.5 border-t border-slate-850 text-slate-300">
                              <div className="col-span-8 font-medium text-white">{item.description}</div>
                              <div className="col-span-2 text-center text-slate-400">{item.quantity || 1}</div>
                              <div className="col-span-2 text-right font-semibold text-violet-300">{item.amount || item.rate}</div>
                            </div>
                          ))}
                        </div>

                        {/* Total Summary */}
                        <div className="flex justify-end pt-2">
                          <div className="w-48 space-y-1 text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>Subtotal:</span>
                              <span>{result.invoice?.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Tax (0%):</span>
                              <span>{result.invoice?.tax || '$0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                              <span>Total Due:</span>
                              <span className="text-emerald-400">{result.invoice?.total}</span>
                            </div>
                          </div>
                        </div>

                        {result.invoice?.paymentNotes && (
                          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                            <span className="text-slate-300 font-semibold block mb-0.5">Payment Instructions:</span>
                            {result.invoice.paymentNotes}
                          </div>
                        )}
                      </div>
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
