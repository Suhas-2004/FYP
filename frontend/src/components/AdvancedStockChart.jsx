import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function AdvancedStockChart({ data, compareData, chartType, chartStyle = 'candlestick', indicators = { sma20: true, ema50: true, bb: false }, theme }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 320;
    
    // Clear previous chart
    d3.select(container).selectAll('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

    const margin = { top: 20, right: 45, bottom: 30, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const isDark = theme === 'dark';
    
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#33415533' : '#e2e8f088';
    const candleGreen = '#10b981';
    const candleRed = '#ef4444';
    const compareColor = '#eab308'; // yellow for comparison line

    // Parse dates
    const parseData = (dataset) => dataset.map((d, i) => {
      let dateObj = new Date(d.date);
      if (isNaN(dateObj)) dateObj = new Date(Date.now() - (dataset.length - i) * 86400000);
      return { ...d, dateObj };
    }).filter(d => !isNaN(d.dateObj));

    const parsedData = parseData(data);
    const parsedCompare = compareData ? parseData(compareData) : null;
    if (parsedData.length === 0) return;

    const isCompare = !!parsedCompare;
    const basePrice = parsedData[0].close;
    const compBasePrice = isCompare ? (parsedCompare[0]?.close || 1) : 1;

    // --- Scales ---
    const minDate = d3.min([
      ...parsedData.map(d => d.dateObj), 
      ...(isCompare ? parsedCompare.map(d => d.dateObj) : [])
    ]);
    const maxDate = d3.max([
      ...parsedData.map(d => d.dateObj), 
      ...(isCompare ? parsedCompare.map(d => d.dateObj) : [])
    ]);

    const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, innerWidth]);
    const candleWidth = Math.max(2, (innerWidth / parsedData.length) * 0.7);
    const defs = svg.append('defs');

    // Grid Lines (X)
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6).tickSize(-innerHeight).tickFormat(''))
      .selectAll('line').attr('stroke', gridColor).attr('stroke-dasharray', '3,3');
    
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat('%b %d')))
      .selectAll('text').attr('fill', textColor).style('font-size', '10px').style('font-family', 'mono');
    g.selectAll('.domain').attr('stroke', gridColor);

    if (chartType === 'price-indicators') {
      
      // Calculate Y domains
      let yDomain = [];
      if (isCompare) {
        // Percentage scale
        const getPct = (val, base) => ((val - base) / base) * 100;
        let minPct = d3.min(parsedData, d => Math.min(
          getPct(d.low, basePrice),
          indicators.sma20 ? getPct(d.sma20 || d.low, basePrice) : Infinity,
          indicators.bb && d.lower_band ? getPct(d.lower_band, basePrice) : Infinity
        ));
        let maxPct = d3.max(parsedData, d => Math.max(
          getPct(d.high, basePrice),
          indicators.sma20 ? getPct(d.sma20 || d.high, basePrice) : -Infinity,
          indicators.bb && d.upper_band ? getPct(d.upper_band, basePrice) : -Infinity
        ));
        
        const compMin = d3.min(parsedCompare, d => getPct(d.low, compBasePrice));
        const compMax = d3.max(parsedCompare, d => getPct(d.high, compBasePrice));
        
        yDomain = [Math.min(minPct, compMin) - 2, Math.max(maxPct, compMax) + 2];
      } else {
        // Absolute scale
        let minPrice = d3.min(parsedData, d => Math.min(
          d.low,
          indicators.sma20 ? (d.sma20 || d.low) : Infinity,
          indicators.ema50 ? (d.ema50 || d.low) : Infinity,
          indicators.bb && d.lower_band ? d.lower_band : Infinity
        ));
        let maxPrice = d3.max(parsedData, d => Math.max(
          d.high,
          indicators.sma20 ? (d.sma20 || 0) : -Infinity,
          indicators.ema50 ? (d.ema50 || 0) : -Infinity,
          indicators.bb && d.upper_band ? d.upper_band : -Infinity
        ));
        yDomain = [minPrice * 0.98, maxPrice * 1.02];
      }

      const yPriceScale = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]);
      const yVolumeScale = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.volume) * 4]) 
        .range([innerHeight, 0]);

      // Grid Lines (Y)
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisRight(yPriceScale).ticks(5).tickSize(innerWidth).tickFormat(''))
        .selectAll('line').attr('stroke', gridColor).attr('stroke-dasharray', '3,3');

      // Y-Axis
      g.append('g')
        .attr('transform', `translate(${innerWidth},0)`)
        .call(d3.axisRight(yPriceScale).ticks(5).tickFormat(d => isCompare ? `${d > 0 ? '+' : ''}${d.toFixed(1)}%` : d.toFixed(2)))
        .selectAll('text').attr('fill', textColor).style('font-size', '10px').style('font-family', 'mono');

      // Volume Bars
      if (!isCompare) {
        g.selectAll('.vol-bar')
          .data(parsedData)
          .enter()
          .append('rect')
          .attr('class', 'vol-bar')
          .attr('x', d => xScale(d.dateObj) - candleWidth / 2)
          .attr('y', d => yVolumeScale(d.volume || 0))
          .attr('width', candleWidth)
          .attr('height', d => Math.max(0, innerHeight - yVolumeScale(d.volume || 0)))
          .attr('fill', d => d.close >= d.open ? candleGreen : candleRed)
          .attr('opacity', isDark ? 0.3 : 0.2);
      }

      // Helper for Y values
      const valY = (d, key) => {
        if (isCompare) return yPriceScale(((d[key] - basePrice) / basePrice) * 100);
        return yPriceScale(d[key]);
      };

      // Bollinger Bands Shading
      if (indicators.bb) {
        const bbArea = d3.area()
          .defined(d => d.upper_band != null && d.lower_band != null)
          .x(d => xScale(d.dateObj))
          .y0(d => valY(d, 'lower_band'))
          .y1(d => valY(d, 'upper_band'))
          .curve(d3.curveMonotoneX);
        
        g.append('path')
          .datum(parsedData)
          .attr('fill', isDark ? '#3b82f61a' : '#3b82f615')
          .attr('stroke', '#3b82f633')
          .attr('stroke-width', 1)
          .attr('d', bbArea);
      }

      // Main Price Chart
      if (chartStyle === 'candlestick') {
        const candles = g.selectAll('.candle').data(parsedData).enter().append('g').attr('class', 'candle');
        candles.append('line')
          .attr('x1', d => xScale(d.dateObj)).attr('x2', d => xScale(d.dateObj))
          .attr('y1', d => valY(d, 'high')).attr('y2', d => valY(d, 'low'))
          .attr('stroke', d => d.close >= d.open ? candleGreen : candleRed).attr('stroke-width', 1.5);
        candles.append('rect')
          .attr('x', d => xScale(d.dateObj) - candleWidth / 2)
          .attr('y', d => Math.min(valY(d, 'open'), valY(d, 'close')))
          .attr('width', candleWidth)
          .attr('height', d => Math.max(1.5, Math.abs(valY(d, 'open') - valY(d, 'close'))))
          .attr('fill', d => d.close >= d.open ? candleGreen : candleRed);
      } else if (chartStyle === 'area') {
        const grad = defs.append('linearGradient').attr('id', 'area-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        grad.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.25);
        grad.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.0);
        
        const area = d3.area().x(d => xScale(d.dateObj)).y0(innerHeight).y1(d => valY(d, 'close')).curve(d3.curveMonotoneX);
        g.append('path').datum(parsedData).attr('fill', 'url(#area-grad)').attr('d', area);
        
        const line = d3.line().x(d => xScale(d.dateObj)).y(d => valY(d, 'close')).curve(d3.curveMonotoneX);
        g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2.5).attr('d', line);
      } else {
        const line = d3.line().x(d => xScale(d.dateObj)).y(d => valY(d, 'close')).curve(d3.curveMonotoneX);
        g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2.5).attr('d', line);
      }

      // Moving Averages
      const lineGen = (key) => d3.line().defined(d => d[key] != null).x(d => xScale(d.dateObj)).y(d => valY(d, key)).curve(d3.curveMonotoneX);
      if (indicators.ema50) g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').attr('d', lineGen('ema50'));
      if (indicators.sma20) g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', '#f97316').attr('stroke-width', 1.5).attr('d', lineGen('sma20'));

      // Comparison Line
      if (isCompare) {
        const compLine = d3.line().defined(d => d.close != null)
          .x(d => xScale(d.dateObj))
          .y(d => yPriceScale(((d.close - compBasePrice) / compBasePrice) * 100))
          .curve(d3.curveMonotoneX);
        g.append('path').datum(parsedCompare).attr('fill', 'none').attr('stroke', compareColor).attr('stroke-width', 2).attr('d', compLine);
      }

    } else {
      // --- RSI & MACD ---
      const yRsiScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
      const macdExtent = d3.extent(parsedData.flatMap(d => [d.macd, d.macd_signal]).filter(v => v != null));
      const maxMacdAbs = Math.max(Math.abs(macdExtent[0] || 0), Math.abs(macdExtent[1] || 0));
      const yMacdScale = d3.scaleLinear().domain([-maxMacdAbs * 1.2, maxMacdAbs * 1.2]).range([innerHeight, 0]);

      g.append('rect').attr('x', 0).attr('y', yRsiScale(70)).attr('width', innerWidth).attr('height', yRsiScale(30) - yRsiScale(70)).attr('fill', isDark ? '#10b98111' : '#10b9810a');
      g.append('line').attr('x1', 0).attr('x2', innerWidth).attr('y1', yRsiScale(70)).attr('y2', yRsiScale(70)).attr('stroke', '#10b98144').attr('stroke-dasharray', '5,5');
      g.append('line').attr('x1', 0).attr('x2', innerWidth).attr('y1', yRsiScale(30)).attr('y2', yRsiScale(30)).attr('stroke', '#10b98144').attr('stroke-dasharray', '5,5');

      g.append('g').call(d3.axisLeft(yRsiScale).tickValues([30, 50, 70])).selectAll('text').attr('fill', '#10b981').style('font-size', '10px');
      g.append('g').attr('transform', `translate(${innerWidth},0)`).call(d3.axisRight(yMacdScale).ticks(5)).selectAll('text').attr('fill', '#d97706').style('font-size', '10px');

      g.selectAll('.macd-hist').data(parsedData.filter(d => d.macd != null && d.macd_signal != null)).enter().append('rect').attr('class', 'macd-hist')
        .attr('x', d => xScale(d.dateObj) - candleWidth / 2).attr('width', candleWidth)
        .attr('y', d => (d.macd - d.macd_signal) > 0 ? yMacdScale(d.macd - d.macd_signal) : yMacdScale(0))
        .attr('height', d => Math.abs(yMacdScale(d.macd - d.macd_signal) - yMacdScale(0)))
        .attr('fill', d => (d.macd - d.macd_signal) > 0 ? candleGreen : candleRed).attr('opacity', 0.8);

      const lRsi = d3.line().defined(d => d.rsi != null).x(d => xScale(d.dateObj)).y(d => yRsiScale(d.rsi)).curve(d3.curveMonotoneX);
      const lMacd = d3.line().defined(d => d.macd != null).x(d => xScale(d.dateObj)).y(d => yMacdScale(d.macd)).curve(d3.curveMonotoneX);
      const lSig = d3.line().defined(d => d.macd_signal != null).x(d => xScale(d.dateObj)).y(d => yMacdScale(d.macd_signal)).curve(d3.curveMonotoneX);

      g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', '#10b981').attr('stroke-width', 2).attr('d', lRsi);
      g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', '#d97706').attr('stroke-width', 2).attr('d', lMacd);
      g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', '#f43f5e').attr('stroke-width', 1.5).attr('stroke-dasharray', '3,3').attr('d', lSig);
    }

    // --- Interaction ---
    const crosshair = g.append('g').style('display', 'none');
    const xLine = crosshair.append('line').attr('y1', 0).attr('y2', innerHeight).attr('stroke', isDark ? '#94a3b8aa' : '#64748baa').attr('stroke-dasharray', '4,4');

    const overlay = g.append('rect').attr('width', innerWidth).attr('height', innerHeight).attr('fill', 'none').attr('pointer-events', 'all');

    overlay.on('mousemove', (event) => {
      const [mx, my] = d3.pointer(event);
      const dateVal = xScale.invert(mx);
      const bisect = d3.bisector(d => d.dateObj).left;
      
      const i = bisect(parsedData, dateVal, 1);
      let d = parsedData[i - 1];
      if (parsedData[i] && (dateVal - parsedData[i-1].dateObj > parsedData[i].dateObj - dateVal)) {
        d = parsedData[i];
      }
      
      let compD = null;
      if (isCompare) {
        const ci = bisect(parsedCompare, dateVal, 1);
        compD = parsedCompare[ci - 1];
        if (parsedCompare[ci] && (dateVal - parsedCompare[ci-1].dateObj > parsedCompare[ci].dateObj - dateVal)) {
          compD = parsedCompare[ci];
        }
      }

      if (!d) return;
      
      const xPos = xScale(d.dateObj);
      crosshair.style('display', null);
      xLine.attr('x1', xPos).attr('x2', xPos);
      
      const boxRect = container.getBoundingClientRect();
      const tooltipX = mx + margin.left + 15;
      const tooltipY = Math.max(0, event.clientY - boxRect.top - 80);

      setTooltip({
        x: tooltipX > width - 200 ? mx + margin.left - 200 : tooltipX,
        y: tooltipY,
        data: d,
        compData: compD,
        basePrice,
        compBasePrice
      });
    });

    overlay.on('mouseleave', () => {
      crosshair.style('display', 'none');
      setTooltip(null);
    });

  }, [data, compareData, chartType, chartStyle, indicators, theme]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {tooltip && (
        <div 
          className="absolute z-50 pointer-events-none p-3 rounded-xl border shadow-xl bg-white/95 dark:bg-[#151a23]/95 border-slate-200 dark:border-slate-800 backdrop-blur-md"
          style={{ left: tooltip.x, top: tooltip.y, minWidth: '160px' }}
        >
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1 flex justify-between">
            <span>{d3.timeFormat('%B %d, %Y')(tooltip.data.dateObj)}</span>
            {compareData && <span className="text-[9px] uppercase bg-slate-100 dark:bg-slate-800 px-1 rounded">% Mode</span>}
          </div>
          
          {chartType === 'price-indicators' ? (
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-x-4 text-[10px] font-mono">
                <span className="text-slate-500">Open</span>
                <span className="text-right text-slate-800 dark:text-slate-200">{tooltip.data.open?.toFixed(2)}</span>
                <span className="text-slate-500">High</span>
                <span className="text-right text-emerald-600 dark:text-emerald-400">{tooltip.data.high?.toFixed(2)}</span>
                <span className="text-slate-500">Low</span>
                <span className="text-right text-rose-600 dark:text-rose-400">{tooltip.data.low?.toFixed(2)}</span>
                <span className="text-slate-500 font-bold">Close</span>
                <span className={`text-right font-bold ${tooltip.data.close >= tooltip.data.open ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {tooltip.data.close?.toFixed(2)}
                </span>
              </div>
              
              {/* Compare Data */}
              {tooltip.compData && (
                <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-500 font-bold">Main ∆</span>
                    <span className={`font-bold ${tooltip.data.close >= tooltip.basePrice ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {(((tooltip.data.close - tooltip.basePrice) / tooltip.basePrice) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-yellow-600 dark:text-yellow-500 font-bold">Compare ∆</span>
                    <span className={`font-bold ${tooltip.compData.close >= tooltip.compBasePrice ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {(((tooltip.compData.close - tooltip.compBasePrice) / tooltip.compBasePrice) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Indicators */}
              {(indicators.sma20 || indicators.ema50 || indicators.bb) && (
                <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  {indicators.sma20 && tooltip.data.sma20 && (
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-orange-500 font-semibold">SMA-20</span>
                      <span className="text-orange-600 dark:text-orange-400">{tooltip.data.sma20?.toFixed(2)}</span>
                    </div>
                  )}
                  {indicators.ema50 && tooltip.data.ema50 && (
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-purple-500 font-semibold">EMA-50</span>
                      <span className="text-purple-600 dark:text-purple-400">{tooltip.data.ema50?.toFixed(2)}</span>
                    </div>
                  )}
                  {indicators.bb && tooltip.data.upper_band && (
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-blue-500 font-semibold">BBands</span>
                      <span className="text-blue-600 dark:text-blue-400">{tooltip.data.lower_band?.toFixed(0)} - {tooltip.data.upper_band?.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              {tooltip.data.rsi && (
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-emerald-500">RSI (14)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{tooltip.data.rsi?.toFixed(1)}</span>
                </div>
              )}
              {tooltip.data.macd && (
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-brand-amber">MACD</span>
                  <span className="font-semibold text-brand-amber">{tooltip.data.macd?.toFixed(2)}</span>
                </div>
              )}
              {tooltip.data.macd_signal && (
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-rose-500">Signal</span>
                  <span className="font-semibold text-rose-500">{tooltip.data.macd_signal?.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
