import React from 'react';
import { Activity, ShieldAlert, Cpu, Database, Network, Sparkles, Layers } from 'lucide-react';
import { MotionSection } from './MotionReveal';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="mt-20 border-t border-[#dcceb9]/80 dark:border-slate-800/80 bg-[#f8f3eb]/95 dark:bg-dark-950/90 text-[#6c4f38] dark:text-slate-400 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-3">
            <div 
              onClick={() => setActiveTab('about')}
              className="flex items-center space-x-2.5 cursor-pointer group inline-flex"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-glow-amber group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#fdfaf5] dark:bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <span className="text-lg font-heading font-extrabold text-[#24160d] dark:text-white tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">ICLAS</span>
            </div>
            <p className="text-[#6c4f38] dark:text-slate-400 text-xs leading-relaxed font-normal">
              Intelligent Corporate & Leadership Advisory System. Transforming historical corporate crisis playbooks into structured decision heuristics.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#84654f] dark:text-slate-400 font-mono">
              <Cpu className="w-3.5 h-3.5 text-amber-600" />
              <span>Full-Stack Node.js & React AI Engine</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-[#24160d] dark:text-slate-200 font-heading font-bold mb-3 uppercase tracking-wider text-[11px]">Intelligence Modules</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('companies')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium">
                  6-Year Company Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('search-condition')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium">
                  Search Condition Matcher
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('strategy-steps')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium">
                  Strategy Steps Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('startup-intel')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium">
                  Startup Intel Evidence Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-[#24160d] dark:text-slate-200 font-heading font-bold mb-3 uppercase tracking-wider text-[11px]">Ecosystem Portals</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium flex items-center space-x-1">
                  <span>About ICLAS Architecture</span>
                  <Sparkles className="w-3 h-3 text-amber-600" />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('overview')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium">
                  Overview Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('investors-startups')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium">
                  Investors & Startups Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('graph-analysis')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-[#6c4f38] dark:text-slate-400 font-medium">
                  Graph Analysis & Stock AI
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 - Research & Methodology */}
          <div>
            <h4 className="text-[#24160d] dark:text-slate-200 font-heading font-bold mb-3 uppercase tracking-wider text-[11px]">Academic & System Note</h4>
            <p className="text-[#6c4f38] dark:text-slate-400 text-xs leading-relaxed mb-3 font-normal">
              ICLAS utilizes Case-Based Reasoning (CBR), vector cosine similarity, and longitudinal corporate balance sheet indicators across 8 commercial sectors.
            </p>
            <div className="p-3 rounded-2xl bg-amber-100/70 dark:bg-dark-900/80 border border-amber-300/80 dark:border-slate-800 text-[11px] text-amber-950 dark:text-amber-300 flex items-start space-x-2 shadow-sm">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>Recommendations are heuristic models derived from historical turnarounds, not financial guarantees.</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#dcceb9]/80 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[#84654f] text-[11px]">
          <div>
            © 2026 ICLAS Platform • Intelligent Corporate & Leadership Advisory System
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0 font-mono">
            <span className="flex items-center text-amber-700 dark:text-amber-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5 shadow-[0_0_6px_#d97706]"></span>
              Full-Stack Node.js + React Ecosystem
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
