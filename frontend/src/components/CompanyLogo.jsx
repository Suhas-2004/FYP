import React, { useState } from 'react';

/**
 * Company Logo Component supporting direct external Image URLs with fallback vectors.
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
        className={`flex items-center justify-center rounded-2xl bg-white dark:bg-dark-900 border border-slate-200/80 dark:border-slate-800 p-1.5 shadow-md flex-shrink-0 overflow-hidden ${className}`}
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

  // Fallback Vector Artwork for all 11 companies
  if (id === 'apple' || tick === 'AAPL') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md flex-shrink-0 border border-slate-700/50 ${className}`}
        title="Apple Inc."
      >
        <svg viewBox="0 0 170 170" width={size * 0.6} height={size * 0.6} fill="currentColor">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.7-7.96-12-14.73-5.77-9.05-10.42-19.4-13.96-31.06-3.53-11.66-5.3-22.7-5.3-33.12 0-14.54 3.73-26.69 11.2-36.46 7.46-9.76 17.06-14.76 28.79-15 4.9 0 10.37 1.34 16.42 4.02 6.05 2.68 10.13 4.08 12.24 4.2 1.63 0 5.86-1.42 12.68-4.27 6.83-2.85 12.56-4.14 17.2-3.86 13.16.8 23.47 5.75 30.93 14.86-11.53 6.94-17.18 16.51-16.96 28.7.23 9.53 3.97 17.48 11.22 23.86 7.25 6.37 16.03 10.05 26.33 11.05-2.28 6.96-4.75 13.6-7.41 19.92zM119.22 31.84c0-7.39 2.65-14.46 7.95-21.2 5.3-6.75 12.01-10.64 20.13-11.68.22 1.52.33 2.93.33 4.24 0 7.39-2.78 14.61-8.34 21.66-5.55 7.05-12.25 11.07-20.1 12.06-.11-1.41-.17-2.77-.17-4.08z"/>
        </svg>
      </div>
    );
  }

  if (id === 'netflix' || tick === 'NFLX') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#141414] shadow-md flex-shrink-0 border border-red-900/30 ${className}`}
        title="Netflix Inc."
      >
        <svg viewBox="0 0 111 150" width={size * 0.55} height={size * 0.65}>
          <path d="M0 0h24.8v150H0z" fill="#E50914" />
          <path d="M86.2 0H111v150H86.2z" fill="#E50914" />
          <path d="M0 0h24.8l61.4 150H61.4z" fill="#B81D24" />
        </svg>
      </div>
    );
  }

  if (id === 'tesla' || tick === 'TSLA') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 shadow-md flex-shrink-0 border border-rose-900/40 text-red-600 ${className}`}
        title="Tesla, Inc."
      >
        <svg viewBox="0 0 342 342" width={size * 0.65} height={size * 0.65} fill="#E82127">
          <path d="M171 78.4c41.3 0 76.5 12.5 105.8 34.6l17-31.5C259.9 55.4 217.4 42 171 42s-88.9 13.4-122.8 39.5l17 31.5C94.5 90.9 129.7 78.4 171 78.4zM302.2 119.5c-4.4 0-8.3 2.1-10.7 5.5l-63.4 90.7c-3.1 4.4-8.1 7.1-13.6 7.1h-87c-5.4 0-10.5-2.7-13.6-7.1L50.5 125c-2.4-3.4-6.3-5.5-10.7-5.5-8.5 0-14.7 8-12.4 16.1l42.6 148.6c1.8 6.4 7.6 10.9 14.3 10.9h173.4c6.7 0 12.5-4.5 14.3-10.9l42.6-148.6c2.4-8.1-3.8-16.1-12.3-16.1z"/>
        </svg>
      </div>
    );
  }

  if (id === 'bestbuy' || tick === 'BBY') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#0046be] shadow-md flex-shrink-0 border border-blue-400/30 text-white ${className}`}
        title="Best Buy Co., Inc."
      >
        <div className="relative flex flex-col items-center justify-center bg-[#ffe000] text-black font-black px-2 py-1 rounded rotate-[-6deg] shadow-sm">
          <span className="text-[10px] leading-none tracking-tighter">BEST</span>
          <span className="text-[10px] leading-none tracking-tighter">BUY</span>
        </div>
      </div>
    );
  }

  if (id === 'lego') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#d11013] shadow-md flex-shrink-0 border-2 border-[#ffe000] text-white ${className}`}
        title="The LEGO Group"
      >
        <span className="font-black italic tracking-tighter text-sm sm:text-base text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]" style={{ fontFamily: 'Impact, sans-serif' }}>
          LEGO
        </span>
      </div>
    );
  }

  if (id === 'marvel' || tick === 'DIS-MVL') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#e23636] shadow-md flex-shrink-0 border border-red-500/50 text-white px-1 ${className}`}
        title="Marvel Entertainment"
      >
        <span className="font-black tracking-tighter text-xs sm:text-sm text-white uppercase" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          MARVEL
        </span>
      </div>
    );
  }

  if (id === 'block' || tick === 'SQ') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#00D632]/10 dark:bg-dark-950 border-2 border-[#00D632] text-[#00D632] shadow-md flex-shrink-0 ${className}`}
        title="Block, Inc. (Square / Cash App)"
      >
        <div className="w-5 h-5 rounded-md border-[3px] border-[#00D632] flex items-center justify-center">
          <div className="w-2 h-2 rounded-[2px] bg-[#00D632]" />
        </div>
      </div>
    );
  }

  if (id === 'ford' || tick === 'F') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#002c6c] border border-blue-400/40 text-white shadow-md flex-shrink-0 ${className}`}
        title="Ford Motor Company"
      >
        <div className="border-2 border-white/80 rounded-full px-2 py-0.5 transform -rotate-6">
          <span className="font-serif italic font-black text-xs text-white">Ford</span>
        </div>
      </div>
    );
  }

  if (id === 'paypal' || tick === 'PYPL') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#003087] to-[#0079C1] border border-blue-400/40 text-white shadow-md flex-shrink-0 ${className}`}
        title="PayPal Holdings, Inc."
      >
        <div className="relative font-black italic text-lg text-[#0079C1] flex items-center">
          <span className="text-white drop-shadow">P</span>
          <span className="text-[#00cfde] -ml-2 drop-shadow">P</span>
        </div>
      </div>
    );
  }

  if (id === 'opendoor' || tick === 'OPEN') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#0052FF] border border-blue-400/40 text-white shadow-md flex-shrink-0 ${className}`}
        title="Opendoor Technologies Inc."
      >
        <svg viewBox="0 0 100 100" width={size * 0.6} height={size * 0.6} fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 40 L50 15 L80 40 L80 85 L20 85 Z" />
          <path d="M42 85 L42 50 L58 50 L58 85" fill="white" />
        </svg>
      </div>
    );
  }

  if (id === 'teladoc' || tick === 'TDOC') {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl bg-[#5c2d91] border border-purple-400/40 text-white shadow-md flex-shrink-0 ${className}`}
        title="Teladoc Health, Inc."
      >
        <div className="relative flex items-center justify-center">
          <div className="w-5 h-2 bg-[#00a3e0] rounded-sm" />
          <div className="w-2 h-5 bg-[#ff6900] rounded-sm absolute" />
        </div>
      </div>
    );
  }

  // Fallback Initials Badge
  return (
    <div 
      className={`flex items-center justify-center rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md flex-shrink-0 ${className}`}
      style={{ backgroundColor: logoColor || '#06b6d4' }}
    >
      {tick ? tick.slice(0, 2) : id.slice(0, 2).toUpperCase()}
    </div>
  );
}
