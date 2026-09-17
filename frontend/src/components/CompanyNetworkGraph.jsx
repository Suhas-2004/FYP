import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ZoomIn, ZoomOut, Maximize2, RefreshCw, Filter, X, Info } from 'lucide-react';

const REL_COLORS = {
  competitor: '#ef4444',
  partner:    '#3b82f6',
  rival_vc:   '#f97316',
  investor:   '#f59e0b',
  acquirer:   '#8b5cf6',
  supplier:   '#10b981',
};

const REL_LABELS = {
  competitor: 'Competitor',
  partner:    'Strategic Partner',
  rival_vc:   'Rival / Adjacent Threat',
  investor:   'Investor',
  acquirer:   'Acquirer / M&A',
  supplier:   'Supplier',
};

export default function CompanyNetworkGraph({ theme }) {
  const svgRef    = useRef(null);
  const simRef    = useRef(null);
  const zoomRef   = useRef(null);

  const [graphData,     setGraphData]     = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [selected,      setSelected]      = useState(null);   // clicked node data
  const [hoveredEdge,   setHoveredEdge]   = useState(null);
  const [relFilter,     setRelFilter]     = useState('All');
  const [showInternal,  setShowInternal]  = useState(false);  // false = show all

  // ── Fetch graph data ─────────────────────────────────────────────────────
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/graph')
      .then(r => r.json())
      .then(data => { setGraphData(data); setLoading(false); })
      .catch(e  => { setError(e.message); setLoading(false); });
  }, []);

  // ── Build / redraw D3 whenever data or filters change ───────────────────
  const buildGraph = useCallback(() => {
    if (!graphData || !svgRef.current) return;

    const container = svgRef.current.parentElement;
    const W = container.clientWidth  || 900;
    const H = container.clientHeight || 580;

    // --- Filter nodes / edges -----------------------------------------------
    let nodes = graphData.nodes.map(n => ({ ...n }));
    let edges = graphData.edges.map(e => ({ ...e }));

    if (showInternal) nodes = nodes.filter(n => n.is_internal);
    if (relFilter !== 'All') edges = edges.filter(e => e.relationship === relFilter);

    // Ensure edges only reference existing nodes (prevents D3 "missing: id" error)
    const validNodeIds = new Set(nodes.map(n => n.id));
    edges = edges.filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target));

    // Keep only nodes that appear in filtered edges if a relationship filter is active
    if (relFilter !== 'All') {
      const usedIds = new Set(edges.flatMap(e => [e.source, e.target]));
      nodes = nodes.filter(n => usedIds.has(n.id));
    }

    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Kill any previous simulation
    if (simRef.current) simRef.current.stop();

    // --- SVG setup ----------------------------------------------------------
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', W).attr('height', H);

    const isDark = theme === 'dark';
    svg.style('background', 'transparent');

    // Defs: arrowhead markers per relationship type
    const defs = svg.append('defs');
    Object.entries(REL_COLORS).forEach(([rel, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${rel}`)
        .attr('viewBox', '0 -4 10 8')
        .attr('refX', 20).attr('refY', 0)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L10,0L0,4')
        .attr('fill', color)
        .attr('opacity', 0.8);
    });

    // Glow filter
    const glow = defs.append('filter').attr('id', 'glow');
    glow.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Main group (zoom target)
    const g = svg.append('g').attr('class', 'graph-root');

    // --- Zoom ---------------------------------------------------------------
    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', (e) => g.attr('transform', e.transform));
    zoomRef.current = zoom;
    svg.call(zoom);

    // Fit to initial view
    svg.call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.7));

    // --- Force simulation ---------------------------------------------------
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges)
        .id(d => d.id)
        .distance(d => d.relationship === 'competitor' ? 140 : 110)
        .strength(0.5))
      .force('charge',  d3.forceManyBody().strength(-320).distanceMax(400))
      .force('center',  d3.forceCenter(0, 0))
      .force('collide', d3.forceCollide().radius(d => (d.is_internal ? 22 : 16) + 6))
      .alphaDecay(0.02);
    simRef.current = sim;

    // --- Edges --------------------------------------------------------------
    const edgeGroup = g.append('g').attr('class', 'edges');
    const link = edgeGroup.selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke',       d => REL_COLORS[d.relationship] || '#94a3b8')
      .attr('stroke-width', d => d.relationship === 'competitor' ? 1.8 : 1.4)
      .attr('stroke-opacity', 0.55)
      .attr('stroke-dasharray', d => d.relationship === 'rival_vc' ? '5,3' : null)
      .attr('marker-end', d => `url(#arrow-${d.relationship})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2.8);
        setHoveredEdge(d);
      })
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke-opacity', 0.55)
          .attr('stroke-width', d.relationship === 'competitor' ? 1.8 : 1.4);
        setHoveredEdge(null);
      });

    // --- Nodes --------------------------------------------------------------
    const nodeGroup = g.append('g').attr('class', 'nodes');

    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (e, d) => {
          if (!e.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end',  (e, d) => {
          if (!e.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelected(prev => prev?.id === d.id ? null : d);
      });

    // Node circle
    node.append('circle')
      .attr('r', d => d.is_internal ? 20 : 13)
      .attr('fill',         d => d.color + (isDark ? 'cc' : 'dd'))
      .attr('stroke',       d => d.color)
      .attr('stroke-width', d => d.is_internal ? 2.5 : 1.5)
      .attr('filter',       d => d.is_internal ? 'url(#glow)' : null);

    // Internal node inner ring
    node.filter(d => d.is_internal)
      .append('circle')
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', '#ffffff44')
      .attr('stroke-width', 1);

    // Ticker label inside node
    node.append('text')
      .text(d => d.is_internal ? (d.ticker || d.label.slice(0, 4)).toUpperCase() : '')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', 7)
      .attr('font-weight', 700)
      .attr('font-family', 'monospace')
      .attr('fill', '#ffffff')
      .attr('pointer-events', 'none');

    // Company name below node
    node.append('text')
      .text(d => d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', d => (d.is_internal ? 30 : 22))
      .attr('font-size', d => d.is_internal ? 9.5 : 8)
      .attr('font-weight', d => d.is_internal ? 600 : 400)
      .attr('fill', isDark ? '#e2e8f0' : '#1e293b')
      .attr('pointer-events', 'none');

    // Click on background to deselect
    svg.on('click', () => setSelected(null));

    // Highlight on selected
    node.on('mouseenter', (event, d) => {
      d3.select(event.currentTarget).select('circle')
        .attr('stroke-width', d.is_internal ? 4 : 3)
        .attr('filter', 'url(#glow)');
    }).on('mouseleave', (event, d) => {
      d3.select(event.currentTarget).select('circle')
        .attr('stroke-width', d.is_internal ? 2.5 : 1.5)
        .attr('filter', d.is_internal ? 'url(#glow)' : null);
    });

    // --- Tick ---------------------------------------------------------------
    sim.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }, [graphData, relFilter, showInternal, theme]);

  useEffect(() => { buildGraph(); }, [buildGraph]);

  // Zoom controls
  const zoomIn  = () => d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.4);
  const zoomOut = () => d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.7);
  const resetZoom = () => {
    const W = svgRef.current?.parentElement?.clientWidth || 900;
    const H = svgRef.current?.parentElement?.clientHeight || 580;
    d3.select(svgRef.current).transition().duration(500)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.7));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-10 h-10 border-2 border-brand-amber border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Loading company network graph…</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-rose-500 text-sm font-mono">
      Failed to load graph: {error}
    </div>
  );

  const meta       = graphData?.meta || {};
  const allRels    = meta.relationship_types || [];
  const nodeCount  = graphData?.nodes?.length || 0;
  const edgeCount  = graphData?.edges?.length || 0;

  // Neighbour edges for selected node panel
  const neighbourEdges = selected
    ? (graphData?.edges || []).filter(e => e.source === selected.id || e.target === selected.id)
    : [];

  return (
    <div className="space-y-5">

      {/* ── Header strip ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Corporate Relationship Intelligence Graph</span>
          </div>
          <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
            Company Network — DS-6
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {nodeCount} companies · {edgeCount} relationships · Drag nodes · Click to inspect · Scroll to zoom
          </p>
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(REL_COLORS).map(([rel, color]) => {
            const count = (graphData?.edges || []).filter(e => e.relationship === rel).length;
            if (!count) return null;
            return (
              <span key={rel}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold font-mono rounded-full border"
                style={{ borderColor: color + '60', backgroundColor: color + '18', color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                {REL_LABELS[rel]} ({count})
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {['All', ...allRels].map(rel => (
          <button
            key={rel}
            onClick={() => setRelFilter(rel)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all duration-150 ${
              relFilter === rel
                ? 'bg-brand-amber text-dark-950 border-brand-amber shadow-glow-amber'
                : 'bg-white/80 dark:bg-dark-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
            }`}
            style={relFilter === rel || rel === 'All' ? {} : { borderColor: REL_COLORS[rel] + '60' }}
          >
            {rel === 'All' ? 'All Relationships' : REL_LABELS[rel] || rel}
          </button>
        ))}
        <label className="ml-3 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
          <div
            onClick={() => setShowInternal(p => !p)}
            className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${showInternal ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${showInternal ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
          Internal only
        </label>
      </div>

      {/* ── Main graph canvas ────────────────────────────────────────────── */}
      <div className="relative glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-lg"
        style={{ height: 580 }}>

        <svg ref={svgRef} className="w-full h-full" />

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
          {[
            { icon: ZoomIn,    fn: zoomIn,    label: 'Zoom in'  },
            { icon: ZoomOut,   fn: zoomOut,   label: 'Zoom out' },
            { icon: Maximize2, fn: resetZoom, label: 'Reset'    },
            { icon: RefreshCw, fn: buildGraph,label: 'Refresh'  },
          ].map(({ icon: Icon, fn, label }) => (
            <button key={label} onClick={fn} title={label}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/90 dark:bg-dark-900/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-brand-amber hover:border-brand-amber shadow-sm transition-all duration-150">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Edge tooltip */}
        <AnimatePresence>
          {hoveredEdge && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <div className="px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-dark-900/95 border border-slate-200 dark:border-slate-700 shadow-xl max-w-xs text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: REL_COLORS[hoveredEdge.relationship] }} />
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider"
                    style={{ color: REL_COLORS[hoveredEdge.relationship] }}>
                    {REL_LABELS[hoveredEdge.relationship]}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-snug">
                  {hoveredEdge.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {graphData?.nodes?.length === 0 && !loading && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-mono">
            No nodes match current filter.
          </div>
        )}
      </div>

      {/* ── Selected node detail panel ───────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Colour badge */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-mono font-bold text-xs shadow-md"
                  style={{ backgroundColor: selected.color }}>
                  {(selected.ticker || selected.label.slice(0, 4)).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white">{selected.label}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-slate-500">{selected.ticker}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: selected.color + '22', color: selected.color }}>
                      {selected.sector}
                    </span>
                    {selected.market_cap && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{selected.market_cap}</span>
                    )}
                    {selected.is_internal && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                        ICLAS Company
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Connections */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> {neighbourEdges.length} Connections
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {neighbourEdges.slice(0, 10).map((e, i) => {
                  const otherId = e.source === selected.id ? e.target : e.source;
                  const otherNode = (graphData?.nodes || []).find(n => n.id === otherId);
                  const relColor = REL_COLORS[e.relationship] || '#94a3b8';
                  return (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 dark:bg-dark-950/60 border border-slate-100 dark:border-slate-800">
                      <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: relColor }} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {otherNode?.label || otherId}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: relColor + '20', color: relColor }}>
                            {REL_LABELS[e.relationship] || e.relationship}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                          {e.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {neighbourEdges.length > 10 && (
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  +{neighbourEdges.length - 10} more connections
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-900/60 border border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-5 gap-y-2">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider self-center mr-1">Legend:</span>
        {Object.entries(REL_COLORS).map(([rel, color]) => (
          <span key={rel} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-3 h-1 rounded-full inline-block" style={{ backgroundColor: color }} />
            {REL_LABELS[rel]}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
          <span className="w-3 h-0 border-t border-dashed border-slate-400 inline-block" style={{ borderWidth: 1.5 }} />
          Dashed = Rival/Adjacent
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
          <span className="w-4 h-4 rounded-full border-2 border-indigo-400 inline-block" />
          Large = ICLAS Company
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
          <span className="w-3 h-3 rounded-full border border-slate-400 inline-block" />
          Small = External
        </span>
      </div>
    </div>
  );
}
