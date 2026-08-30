import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Building, Mail, DollarSign, User } from 'lucide-react';
import { api } from '../services/api';

export default function ContactModal({ startup, onClose }) {
  const [formData, setFormData] = useState({
    investor_name: '',
    investor_organization: '',
    investor_email: '',
    proposed_ticket_size: '$250,000 - $500,000',
    message: `Hi ${startup?.founder_name || 'Founder'},\n\nWe reviewed your pitch on ICLAS for ${startup?.name} and are impressed by your solution in the ${startup?.industry} space. We would like to schedule an introductory partner call to discuss your seed financing round.`
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!startup) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.contactStartup({
        startup_id: startup.id,
        ...formData
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to dispatch inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative w-full max-w-xl bg-white dark:bg-dark-900 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-dark-950/70">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-cyan/20 text-brand-cyan rounded border border-brand-cyan/40 font-mono">
                Official Investor Channel
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {startup.id}</span>
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mt-1">
              Contact {startup.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto shadow-glow-emerald"
              >
                <CheckCircle2 className="w-8 h-8" />
              </motion.div>
              <h4 className="text-xl font-heading font-bold text-slate-900 dark:text-white">Inquiry Dispatched Successfully!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Your investment inquiry has been delivered directly to <span className="text-brand-cyan font-bold">{startup.founder_email}</span>. A copy has been logged in the ICLAS dealflow registry.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo text-white font-bold text-sm shadow-glow-cyan"
              >
                Done
              </motion.button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Startup Quick Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-dark-950/70 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Founder:</span>{' '}
                  <span className="text-slate-900 dark:text-slate-200 font-bold">{startup.founder_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Funding Goal:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{startup.funding_requirement}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Industry:</span>{' '}
                  <span className="text-brand-cyan font-bold">{startup.industry}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name / Lead Partner *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.investor_name}
                      onChange={(e) => setFormData({ ...formData, investor_name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fund / Venture Firm *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Ventures"
                      value={formData.investor_organization}
                      onChange={(e) => setFormData({ ...formData, investor_organization: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Investor Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@apexvc.com"
                      value={formData.investor_email}
                      onChange={(e) => setFormData({ ...formData, investor_email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Ticket Size
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={formData.proposed_ticket_size}
                      onChange={(e) => setFormData({ ...formData, proposed_ticket_size: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
                    >
                      <option value="$100,000 - $250,000">$100,000 - $250,000 (Angel/Pre-seed)</option>
                      <option value="$250,000 - $500,000">$250,000 - $500,000 (Seed Co-lead)</option>
                      <option value="$500,000 - $1,500,000">$500,000 - $1.5M (Seed Lead)</option>
                      <option value="$1,500,000 - $5,000,000">$1.5M - $5.0M (Series A)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message to Founders *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 text-xs bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-cyan resize-none shadow-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-cyan to-brand-indigo hover:opacity-95 transition-opacity disabled:opacity-50 shadow-glow-cyan"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Dispatching...' : 'Dispatch Investor Inquiry'}</span>
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
