import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Info,
  Layers,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';

export default function StartupIntel({ setActiveTab, setSelectedCompanyId, theme }) {
  const [matrix, setMatrix] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatrix() {
      try {
        const data = await api.getEvidenceMatrix();
        setMatrix(data || []);
      } catch (err) {
        console.error('Failed to load evidence matrix:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatrix();
  }, []);

  const handleCaseClick = (companyName) => {
    const idMap = {
      'Apple Inc. (1997)': 'apple',
      'Netflix Inc. (2011)': 'netflix',
      'Best Buy (2012)': 'bestbuy',
      'The LEGO Group (2004)': 'lego',
      'Marvel Entertainment (1996)': 'marvel',
      'Tesla, Inc. (2018)': 'tesla',
      'Block, Inc. (2023)': 'block',
      'Ford Motor Company (2008)': 'ford',
      'PayPal (2022)': 'paypal',
      'Opendoor (2022)': 'opendoor'
    };
    const compId = idMap[companyName] || 'apple';
    setSelectedCompanyId(compId);
    setActiveTab('strategy-steps');
  };

  const filteredItems = matrix.filter(item => {
    const matchesSearch = 
      item.startup_condition.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.historical_company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.turnaround_strategy.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSector = sectorFilter === 'All' || item.sector.toLowerCase() === sectorFilter.toLowerCase();
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <MotionSection direction="down" duration={0.5}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Case-Based Evidence & Trust Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Startup Intel Matrix
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Empirical evidence bridging early-stage startup failure modes with documented established corporate precedents, strategic maneuvers, and measurable outcomes.
            </p>
          </div>

          {/* Methodology Note */}
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 max-w-xs space-y-1 shadow-sm">
            <div className="flex items-center text-brand-cyan font-bold text-[11px]">
              <Info className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span>Empirical Heuristics</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Evidence matrix validates that recommended strategies are grounded in verified turnaround track records.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* Filter Bar */}
      <MotionSection direction="up" delay={0.05}>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search startup condition, company precedent, or strategy..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Sector:
            </span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
            >
              <option value="All">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Retail">Retail</option>
              <option value="FinTech">FinTech</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Automobile">Automobile</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Media">Media</option>
            </select>
          </div>
        </div>
      </MotionSection>

      {/* Evidence Table */}
      <MotionSection direction="up" delay={0.1}>
        <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100/90 dark:bg-dark-950/90 text-slate-600 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th className="px-6 py-4">Startup Distress Condition</th>
                  <th className="px-6 py-4">Historical Corporate Precedent</th>
                  <th className="px-6 py-4">Turnaround Strategy Deployed</th>
                  <th className="px-6 py-4">Proven Outcome</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono">Loading evidence matrix...</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono">No matching matrix records found.</td>
                  </tr>
                ) : (
                  filteredItems.map((row) => (
                    <tr 
                      key={row.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-dark-850/60 transition-colors group cursor-pointer"
                      onClick={() => handleCaseClick(row.historical_company)}
                    >
                      {/* Condition */}
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            row.severity === 'Critical' ? 'bg-rose-500' : 'bg-amber-400'
                          }`} />
                          <span className="leading-snug">{row.startup_condition}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 ml-4 font-normal">{row.severity} Severity</span>
                      </td>

                      {/* Precedent */}
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-3.5 h-3.5 text-brand-cyan" />
                          <span>{row.historical_company}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5 font-normal">{row.sector}</span>
                      </td>

                      {/* Strategy */}
                      <td className="px-6 py-4">
                        <div className="font-heading font-bold text-brand-cyan">{row.turnaround_strategy}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo text-[10px] font-semibold border border-brand-indigo/20">
                          {row.strategy_type}
                        </span>
                      </td>

                      {/* Outcome */}
                      <td className="px-6 py-4 text-emerald-700 dark:text-emerald-300 max-w-xs leading-relaxed font-medium">
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{row.outcome}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCaseClick(row.historical_company);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs font-bold inline-flex items-center space-x-1 transition-colors"
                        >
                          <span>Study Case</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
