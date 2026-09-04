"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import SymbolOverviewWidget from '../components/strategy/SymbolOverviewWidget';
import TopStoriesWidget from '../components/strategy/TopStoriesWidget';
import MarketQuotesWidget from '../components/strategy/MarketQuotesWidget';
import AdvancedChartWidget from '../components/strategy/AdvancedChartWidget';
import MarketSentimentWidget from '../components/strategy/MarketSentimentWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function MarketDashboardPage() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-white font-sans relative overflow-hidden flex flex-col p-4 lg:p-8">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-amber/15 via-coffee-100/40 dark:via-[#02040A] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3/4 h-[800px] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-brand-terracotta/10 via-coffee-50/20 dark:via-[#02040A] to-transparent pointer-events-none" />
      
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-amber/20 border border-brand-amber/50">
              <Activity size={12} className="text-brand-caramel dark:text-brand-amber animate-pulse" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-caramel dark:text-brand-amber uppercase">Live Market Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-slate-900 dark:text-white tracking-tight">
            MACRO <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-amber via-brand-caramel to-brand-terracotta">DASHBOARD</span>
          </h1>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-md flex items-center gap-3 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">SYSTEMS NOMINAL</span>
        </div>
      </motion.div>

      {/* Bento Box Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full grid grid-cols-12 gap-4 lg:gap-6 pb-12"
      >
        {/* Hero: Advanced Chart (Full Width) */}
        <motion.div variants={itemVariants} className="col-span-12 h-[600px] rounded-2xl bg-white/80 dark:bg-[#0A0F14]/40 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-1.5 shadow-xl overflow-hidden group hover:border-brand-amber/60 transition-colors duration-500">
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-brand-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <AdvancedChartWidget />
          </div>
        </motion.div>

        {/* Row 2: Symbol Overview (8 cols) + Sentiment Gauges (4 cols) */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 h-[500px] rounded-2xl bg-white/80 dark:bg-[#0A0F14]/40 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-1.5 shadow-xl overflow-hidden group hover:border-brand-caramel/60 transition-colors duration-500">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <SymbolOverviewWidget />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 h-[500px] rounded-2xl bg-white/80 dark:bg-[#0A0F14]/40 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-1.5 shadow-xl overflow-hidden group hover:border-brand-terracotta/60 transition-colors duration-500">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <MarketSentimentWidget />
          </div>
        </motion.div>

        {/* Row 3: Market Quotes (4 cols) + Top Stories (8 cols) */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 h-[500px] rounded-2xl bg-white/80 dark:bg-[#0A0F14]/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-1.5 shadow-xl overflow-hidden group hover:border-brand-amber/60 transition-colors duration-500">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <MarketQuotesWidget />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 h-[500px] rounded-2xl bg-white/80 dark:bg-[#0A0F14]/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-1.5 shadow-xl overflow-hidden group hover:border-brand-caramel/60 transition-colors duration-500">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <TopStoriesWidget />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
