import React, { useEffect, useRef, memo } from 'react';

function TopStoriesWidget() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "feedMode": "all_symbols",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "colorTheme": "dark",
        "locale": "en"
      }`;
    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col bg-[#131722] rounded-xl overflow-hidden border border-[#2A2E39]">
      <div className="px-4 py-3 border-b border-[#2A2E39]">
        <h2 className="text-white font-semibold text-sm font-sans">Top Stories</h2>
      </div>
      <div className="flex-1 w-full relative">
        <div className="tradingview-widget-container w-full h-full absolute inset-0" ref={container}>
          <div className="tradingview-widget-container__widget w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default memo(TopStoriesWidget);
