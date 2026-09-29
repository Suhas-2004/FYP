import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function SentinelAlerts() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alerts = [
    { type: 'critical', msg: 'High Volatility Detected in $TSLA Options.', time: 'Just now', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
    { type: 'info', msg: 'New Crisis Survival Playbook generated for Web3.', time: '2m ago', icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { type: 'warn', msg: 'Sentiment drop identified in European tech sector.', time: '14m ago', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-white/70"
      >
        <Bell className="w-3.5 h-3.5" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#111116] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-[#16161c]">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Sentinel Alerts</span>
            <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">3 New</span>
          </div>
          <div className="flex flex-col max-h-[300px] overflow-y-auto">
            {alerts.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/[0.02] transition cursor-pointer">
                  <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${a.bg}`}>
                    <Icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/90 leading-relaxed">{a.msg}</span>
                    <span className="text-[9px] text-white/40 uppercase font-semibold">{a.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-2 bg-[#16161c] border-t border-white/5">
            <button className="w-full py-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 uppercase tracking-widest font-semibold transition">
              View All Diagnostics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
