import React, { useState } from 'react';

/**
 * Company Logo Component supporting direct external Image URLs with authentic fallback vectors.
 * Styled cleanly for dark and high-contrast dashboards.
 */
export default function CompanyLogo({ 
  companyId, 
  ticker, 
  logoUrl, 
  className = "w-10 h-10", 
  size = 40, 
  logoColor 
}) {
  const [imgError, setImgError] = useState(false);
  const id = (companyId || '').toLowerCase();
  const tick = (ticker || '').toUpperCase();

  // If a valid image link/URL is provided and hasn't errored, render it directly
  if (logoUrl && !imgError) {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 p-1.5 shadow-sm flex-shrink-0 overflow-hidden ${className}`}
      >
        <img 
          src={logoUrl} 
          alt={tick || id} 
          className="w-full h-full object-contain rounded-xl"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 1. Apple Inc.
  if (id === 'apple' || tick === 'AAPL') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 text-white shadow-sm flex-shrink-0 ${className}`}
        title="Apple Inc."
      >
        <svg viewBox="0 0 170 170" width={size * 0.55} height={size * 0.55} fill="currentColor">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.7-7.96-12-14.73-5.77-9.05-10.42-19.4-13.96-31.06-3.53-11.66-5.3-22.7-5.3-33.12 0-14.54 3.73-26.69 11.2-36.46 7.46-9.76 17.06-14.76 28.79-15 4.9 0 10.37 1.34 16.42 4.02 6.05 2.68 10.13 4.08 12.24 4.2 1.63 0 5.86-1.42 12.68-4.27 6.83-2.85 12.56-4.14 17.2-3.86 13.16.8 23.47 5.75 30.93 14.86-11.53 6.94-17.18 16.51-16.96 28.7.23 9.53 3.97 17.48 11.22 23.86 7.25 6.37 16.03 10.05 26.33 11.05-2.28 6.96-4.75 13.6-7.41 19.92zM119.22 31.84c0-7.39 2.65-14.46 7.95-21.2 5.3-6.75 12.01-10.64 20.13-11.68.22 1.52.33 2.93.33 4.24 0 7.39-2.78 14.61-8.34 21.66-5.55 7.05-12.25 11.07-20.1 12.06-.11-1.41-.17-2.77-.17-4.08z"/>
        </svg>
      </div>
    );
  }

  // 2. Microsoft Corp. (4 Colored Squares)
  if (id === 'microsoft' || tick === 'MSFT') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 shadow-sm flex-shrink-0 p-1.5 ${className}`}
        title="Microsoft Corp."
      >
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <div className="bg-[#f25022] rounded-[2px]" />
          <div className="bg-[#7fba00] rounded-[2px]" />
          <div className="bg-[#00a4ef] rounded-[2px]" />
          <div className="bg-[#ffb900] rounded-[2px]" />
        </div>
      </div>
    );
  }

  // 3. Tesla Inc.
  if (id === 'tesla' || tick === 'TSLA') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 shadow-sm flex-shrink-0 text-red-600 ${className}`}
        title="Tesla, Inc."
      >
        <svg viewBox="0 0 342 342" width={size * 0.65} height={size * 0.65} fill="#E82127">
          <path d="M171 78.4c41.3 0 76.5 12.5 105.8 34.6l17-31.5C259.9 55.4 217.4 42 171 42s-88.9 13.4-122.8 39.5l17 31.5C94.5 90.9 129.7 78.4 171 78.4zM302.2 119.5c-4.4 0-8.3 2.1-10.7 5.5l-63.4 90.7c-3.1 4.4-8.1 7.1-13.6 7.1h-87c-5.4 0-10.5-2.7-13.6-7.1L50.5 125c-2.4-3.4-6.3-5.5-10.7-5.5-8.5 0-14.7 8-12.4 16.1l42.6 148.6c1.8 6.4 7.6 10.9 14.3 10.9h173.4c6.7 0 12.5-4.5 14.3-10.9l42.6-148.6c2.4-8.1-3.8-16.1-12.3-16.1z"/>
        </svg>
      </div>
    );
  }

  // 4. Amazon.com Inc.
  if (id === 'amazon' || tick === 'AMZN') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 shadow-sm flex-shrink-0 text-white ${className}`}
        title="Amazon.com Inc."
      >
        <span className="font-black text-xl tracking-tighter text-white leading-none">
          a<span className="text-[#ff9900]">.</span>
        </span>
      </div>
    );
  }

  // 5. Alphabet Inc. (Google G)
  if (id === 'alphabet' || tick === 'GOOGL' || tick === 'GOOG') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 shadow-sm flex-shrink-0 ${className}`}
        title="Alphabet Inc."
      >
        <svg viewBox="0 0 48 48" width={size * 0.65} height={size * 0.65}>
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      </div>
    );
  }

  // 6. Netflix Inc.
  if (id === 'netflix' || tick === 'NFLX') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-black border border-slate-800 shadow-sm flex-shrink-0 ${className}`}
        title="Netflix Inc."
      >
        <svg viewBox="0 0 111 150" width={size * 0.5} height={size * 0.6}>
          <path d="M0 0h24.8v150H0z" fill="#E50914" />
          <path d="M86.2 0H111v150H86.2z" fill="#E50914" />
          <path d="M0 0h24.8l61.4 150H61.4z" fill="#B81D24" />
        </svg>
      </div>
    );
  }

  // 7. Walmart Inc.
  if (id === 'walmart' || tick === 'WMT') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#0071ce] shadow-sm flex-shrink-0 text-white ${className}`}
        title="Walmart Inc."
      >
        <svg viewBox="0 0 100 100" width={size * 0.65} height={size * 0.65} fill="#ffc220">
          <circle cx="50" cy="50" r="10" />
          <rect x="46" y="10" width="8" height="24" rx="4" />
          <rect x="46" y="66" width="8" height="24" rx="4" />
          <rect x="10" y="46" width="24" height="8" rx="4" />
          <rect x="66" y="46" width="24" height="8" rx="4" />
          <rect x="22" y="22" width="24" height="8" rx="4" transform="rotate(45 34 26)" />
          <rect x="58" y="58" width="24" height="8" rx="4" transform="rotate(45 70 62)" />
        </svg>
      </div>
    );
  }

  // 8. JPMorgan Chase
  if (id === 'jpmorgan' || tick === 'JPM') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#11295b] shadow-sm flex-shrink-0 text-white font-serif font-black ${className}`}
        title="JPMorgan Chase"
      >
        <span className="text-[11px] tracking-tight">JPM</span>
      </div>
    );
  }

  // 9. Meta Platforms
  if (id === 'meta' || tick === 'META') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 shadow-sm flex-shrink-0 text-[#0081fb] ${className}`}
        title="Meta Platforms"
      >
        <svg viewBox="0 0 24 24" width={size * 0.7} height={size * 0.7} fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      </div>
    );
  }

  // 10. NVIDIA Corp.
  if (id === 'nvidia' || tick === 'NVDA') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 shadow-sm flex-shrink-0 text-[#76b900] ${className}`}
        title="NVIDIA Corp."
      >
        <svg viewBox="0 0 24 24" width={size * 0.65} height={size * 0.65} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
      </div>
    );
  }

  // 11. Intel Corp.
  if (id === 'intel' || tick === 'INTC') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#121624] border border-slate-700/60 shadow-sm flex-shrink-0 text-[#00a3e0] font-sans font-black ${className}`}
        title="Intel Corp."
      >
        <span className="text-xs tracking-tighter">intel</span>
      </div>
    );
  }

  // 12. Coca-Cola Co.
  if (id === 'coca-cola' || tick === 'KO') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#f40009] shadow-sm flex-shrink-0 text-white font-serif font-black ${className}`}
        title="Coca-Cola Co."
      >
        <span className="text-[9px] tracking-tight italic">Coke</span>
      </div>
    );
  }

  // Other known companies
  if (id === 'bestbuy' || tick === 'BBY') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#0046be] shadow-sm flex-shrink-0 text-white ${className}`}
        title="Best Buy Co., Inc."
      >
        <div className="bg-[#ffe000] text-black font-black px-1.5 py-0.5 rounded rotate-[-6deg] text-[9px] leading-tight">
          BEST BUY
        </div>
      </div>
    );
  }

  if (id === 'lego') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#d11013] border border-[#ffe000] text-white font-black italic shadow-sm flex-shrink-0 ${className}`}
        title="The LEGO Group"
      >
        <span className="text-[10px]">LEGO</span>
      </div>
    );
  }

  // Default Initials Badge
  return (
    <div 
      className={`flex items-center justify-center rounded-2xl font-bold text-xs text-white shadow-sm flex-shrink-0 border border-slate-700/60 ${className}`}
      style={{ backgroundColor: logoColor || '#1e3a8a' }}
    >
      {tick ? tick.slice(0, 2) : id.slice(0, 2).toUpperCase()}
    </div>
  );
}
