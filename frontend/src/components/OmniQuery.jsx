import React, { useState, useEffect } from 'react';
import { Search, Command, Activity, ShieldAlert, Building2 } from 'lucide-react';

export default function OmniQuery({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    const handleCustomOpen = () => setIsOpen(true);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-omni-query', handleCustomOpen);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-omni-query', handleCustomOpen);
    };
  }, []);

  if (!isOpen) return null;

  const mockResults = [
    { type: 'module', title: 'Crisis Engine: Downfall Detection', tab: 'search-condition', icon: ShieldAlert },
    { type: 'company', title: 'Lehman Brothers (Historical)', tab: 'companies', icon: Building2 },
    { type: 'market', title: 'Live SSE Data Feed', tab: 'market-dashboard', icon: Activity },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (tab) => {
    setIsOpen(false);
    onNavigate(tab);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Console */}
      <div className="relative w-full max-w-2xl bg-[#111116] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden flex flex-col">
        {/* Input */}
        <div className="flex items-center px-4 h-16 border-b border-white/5 bg-[#16161c]">
          <Search className="w-5 h-5 text-indigo-400 mr-3" />
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Intelligence System..."
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-white/30"
          />
          <div className="flex items-center gap-1 text-[10px] text-white/40 font-semibold tracking-wider">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10">ESC</kbd> to close
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {mockResults.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-sm">No intelligence records found.</div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Suggested Intelligence
              </div>
              {mockResults.map((res, i) => {
                const Icon = res.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(res.tab)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-indigo-500/10 hover:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)] text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                      <Icon className="w-4 h-4 text-white/40 group-hover:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-indigo-200">{res.title}</div>
                      <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">{res.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
