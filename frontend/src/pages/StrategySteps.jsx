import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ListOrdered, 
  Download, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ShieldAlert, 
  ArrowLeft, 
  Sparkles, 
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';
import CompanyLogo from '../components/CompanyLogo';

export default function StrategySteps({ selectedCompanyId, setActiveTab, setSelectedCompanyId, theme }) {
  const [strategyData, setStrategyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState({});
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

  const activeCompanyId = selectedCompanyId || 'apple';

  useEffect(() => {
    async function loadStrategy() {
      setLoading(true);
      try {
        const data = await api.getStrategySteps(activeCompanyId);
        setStrategyData(data);
      } catch (err) {
        console.error('Failed to load strategy:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStrategy();
  }, [activeCompanyId]);

  const toggleStep = (stepNumber) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: theme === 'dark' ? '#070a13' : '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ICLAS-Strategy-Report-${strategyData?.ticker || 'Corporate'}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Synthesizing case-based strategy roadmap...</p>
      </div>
    );
  }

  if (!strategyData) {
    return (
      <div className="p-12 text-center glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">No Strategy Steps Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select a case from the Search Condition or Companies module.</p>
        <button
          onClick={() => setActiveTab('search-condition')}
          className="px-5 py-2.5 rounded-xl bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 text-xs font-bold"
        >
          Go to Search Condition
        </button>
      </div>
    );
  }

  const totalSteps = strategyData.steps?.length || 0;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Action Bar */}
      <MotionSection direction="down" duration={0.4}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6 no-print">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  setActiveTab('companies');
                }
              }}
              title="Go back to previous page"
              className="p-2.5 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-100 dark:hover:bg-dark-850 border border-slate-300/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-cyan/15 text-brand-cyan rounded border border-brand-cyan/35 font-mono">
                  Actionable Strategy Blueprint
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">{strategyData.ticker}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                Strategy Steps & Turnaround Roadmap
              </h1>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.03, translateY: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo hover:opacity-95 text-white font-bold text-xs transition-all shadow-glow-cyan disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting ? 'Generating PDF...' : 'Export Strategy as PDF'}</span>
            </motion.button>
          </div>
        </div>
      </MotionSection>

      {/* Printable Report Container */}
      <div ref={reportRef} className="space-y-8 p-4 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-dark-950/60 border border-slate-200/80 dark:border-slate-850">
        
        {/* Executive Case Header Dossier */}
        <MotionSection direction="up" delay={0.1}>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center space-x-4">
                <CompanyLogo 
                  companyId={strategyData.company_id} 
                  ticker={strategyData.ticker} 
                  logoUrl={strategyData.logo_url}
                  logoColor={strategyData.logo_color} 
                  className="w-14 h-14 shadow-lg"
                  size={52}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">{strategyData.company_name}</h2>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-dark-950 text-slate-800 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700">
                      {strategyData.sector}
                    </span>
                  </div>
                  <p className="text-xs text-brand-cyan font-bold mt-0.5">
                    Precedent Case: {strategyData.crisis_title}
                  </p>
                </div>
              </div>

              {/* Turnaround Strategy Category Tag */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/90 border border-slate-200/80 dark:border-slate-800/80 text-right shadow-sm w-fit">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono font-semibold">Strategy Framework</div>
                <div className="text-base font-heading font-bold text-emerald-600 dark:text-emerald-400">
                  {strategyData.strategy_category}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{strategyData.strategy_name}</div>
              </div>
            </div>

            {/* 4-Block Structured Case Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* 1. What Happened */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mr-1.5 flex-shrink-0" />
                  <span>1. What Happened to the Company (The Crisis):</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {strategyData.condition_summary}
                </p>
              </div>

              {/* 2. Why it Occurred */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 mr-1.5 flex-shrink-0" />
                  <span>2. Why the Problem Occurred (Root Causes):</span>
                </div>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                  {strategyData.root_causes?.map((cause, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-amber-500">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Strategy Used */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan mr-1.5 flex-shrink-0" />
                  <span>3. Turnaround Strategy Deployed:</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {strategyData.strategy_summary}
                </p>
              </div>

              {/* 4. After Implementation Outcome */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0" />
                  <span>4. Outcome After Implementation:</span>
                </div>
                <p className="text-emerald-700 dark:text-emerald-300 font-semibold leading-relaxed">
                  {strategyData.recovery_outcome}
                </p>
              </div>
            </div>

            {/* Implementation Progress Bar */}
            <div className="pt-2 no-print">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Founder Execution Progress:</span>
                <span className="text-brand-cyan font-mono font-bold">{completedCount} of {totalSteps} Steps Complete ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-dark-950 h-3 rounded-full overflow-hidden border border-slate-300/80 dark:border-slate-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-brand-cyan via-emerald-400 to-brand-indigo h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </MotionSection>

        {/* Structured Phased Steps Sequence */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                Recommended Structured Execution Steps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chronological execution sequence tailored for early-stage and distressed operators
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-dark-900 px-3 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-sm font-semibold">
              {totalSteps} Milestone Steps
            </span>
          </div>

          <StaggerContainer className="space-y-4">
            {strategyData.steps?.map((step) => {
              const isChecked = !!completedSteps[step.step_number];
              return (
                <StaggerItem key={step.step_number}>
                  <div
                    className={`glass-panel p-6 rounded-2xl border transition-all duration-300 shadow-sm ${
                      isChecked 
                        ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-500/5' 
                        : 'border-slate-200/80 dark:border-slate-800/80 hover:border-brand-cyan/40'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Interactive Checkbox */}
                      <button
                        onClick={() => toggleStep(step.step_number)}
                        className="mt-1 flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-transform active:scale-90 no-print"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>

                      <div className="space-y-3 flex-1">
                        {/* Step Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-brand-cyan/15 text-brand-cyan text-xs font-bold font-mono border border-brand-cyan/30">
                              STEP 0{step.step_number}
                            </span>
                            <h4 className={`text-base font-heading font-bold ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                              {step.title}
                            </h4>
                          </div>
                          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-dark-950/90 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-800/80 flex items-center shadow-sm">
                            <Clock className="w-3 h-3 mr-1 text-brand-cyan" />
                            {step.phase}
                          </span>
                        </div>

                        {/* Action Detail */}
                        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200 leading-relaxed shadow-sm">
                          <span className="text-brand-cyan font-bold block mb-1">Recommended Action:</span>
                          {step.action}
                        </div>

                        {/* Risk Mitigation */}
                        {step.risk_mitigation && (
                          <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-800 dark:text-amber-300">Risk Mitigation Note: </span>
                              {step.risk_mitigation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Mandatory Research & Case Disclaimer Alert */}
        <MotionSection direction="up" delay={0.2}>
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-dark-900/90 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Case-Based Methodology Notice & Strategic Disclaimer</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-normal">
              {strategyData.disclaimer}
            </p>
            <div className="pt-2 text-[11px] text-slate-400 font-mono">
              Report synthesized by ICLAS • Intelligent Corporate & Leadership Advisory System
            </div>
          </div>
        </MotionSection>

      </div>
    </div>
  );
}
