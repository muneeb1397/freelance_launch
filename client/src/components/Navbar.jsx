import { API_BASE } from '../config.js';
import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, ShieldCheck, Github } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (res.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (e) {
        setServerStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  FreelanceLaunch
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Cohort 11 MVP
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                All-in-One Gen-AI Freelancer Suite • Pak Angels Hackathon
              </p>
            </div>
          </div>

          {/* Right Status Badges & Quick Info */}
          <div className="flex items-center space-x-3">
            {/* Live API indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${
                serverStatus === 'online' ? 'bg-emerald-400 animate-pulse' :
                serverStatus === 'offline' ? 'bg-amber-400' : 'bg-slate-400'
              }`} />
              <span className="font-medium hidden sm:inline">
                {serverStatus === 'online' ? 'Express API: Connected' :
                 serverStatus === 'offline' ? 'API Offline (Mock Fallback Ready)' : 'Connecting...'}
              </span>
              <span className="font-medium sm:hidden">
                {serverStatus === 'online' ? 'Live' : 'Demo'}
              </span>
            </div>

            <div className="hidden md:flex items-center text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
              <span>Team: 1 Leader + 4 Members</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
