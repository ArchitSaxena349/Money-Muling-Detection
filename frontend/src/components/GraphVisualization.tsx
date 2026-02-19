import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AnalysisResult, GraphData, GraphNode, SuspiciousAccount } from '../types';

interface GraphVisualizationProps {
  data: GraphData | null;
  analysisResult: AnalysisResult | null;
}

export default function GraphVisualization({ data, analysisResult }: GraphVisualizationProps) {
  const [selectedAccount, setSelectedAccount] = useState<SuspiciousAccount | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, id: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Use parent container dimensions
    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        // @ts-ignore
        .on('start', dragstarted)
        // @ts-ignore
        .on('drag', dragged)
        // @ts-ignore
        .on('end', dragended);
    }

    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(20));

    const svgElement = svg
      .attr('viewBox', [0, 0, width, height])
      .call(d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
        g.attr('transform', event.transform);
      }));

    const g = svg.append('g');

    // Arrowhead marker
    g.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25) // Adjusted for larger nodes
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#64748b') // slate-500
      .style('stroke', 'none');

    const link = g.append('g')
      .attr('stroke', '#475569') // slate-600
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrowhead)');

    const node = g.append('g')
      .attr('stroke', '#1e293b') // slate-900 (background color)
      .attr('stroke-width', 2)
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', d => d.isSuspicious ? 12 : 8)
      .attr('fill', d => d.isSuspicious ? '#ef4444' : '#3b82f6') // red-500 : blue-500
      .attr('class', 'cursor-pointer transition-all duration-200 hover:opacity-80')
      .on('mouseover', (event, d) => {
        setTooltip({ x: event.pageX, y: event.pageY, id: d.id });
      })
      .on('mouseout', () => {
        setTooltip(null);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        const accountDetails = analysisResult?.suspicious_accounts.find(acc => acc.account_id === d.id) || null;
        setSelectedAccount(accountDetails);
      })
      .call(drag(simulation) as any);

    // Click background to deselect
    svg.on('click', () => {
      setSelectedAccount(null);
    });

    node.append('title')
      .text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => (d as any).x)
        .attr('cy', d => (d as any).y);
    });

  }, [data]);

  // ... drag function remains same ...

  // Update JSX to use glassmorphism and improve tooltip/modal
  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} width="100%" height="100%"></svg>
      {tooltip && (
        <div
          className="fixed p-2 px-3 text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 rounded-lg shadow-xl pointer-events-none z-50 backdrop-blur-md"
          style={{ top: tooltip.y - 40, left: tooltip.x - 20 }}
        >
          {tooltip.id}
        </div>
      )}
      {selectedAccount && (
        <div className="absolute top-4 left-4 p-5 glass-panel rounded-xl shadow-2xl max-w-sm border-l-4 border-l-red-500 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                {selectedAccount.account_id}
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">Suspicious</span>
              </h3>
            </div>
            <button onClick={() => setSelectedAccount(null)} className="text-slate-400 hover:text-slate-200 transition-colors">&times;</button>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span>Score</span>
              <span className="font-mono text-red-400 font-bold">{selectedAccount.suspicion_score.toFixed(1)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span>Ring ID</span>
              <span className="font-mono text-violet-400">{selectedAccount.ring_id || 'N/A'}</span>
            </div>
            <div>
              <span className="block mb-1 text-slate-400 text-xs uppercase tracking-wider">Detected Patterns</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedAccount.detected_patterns.map(p => (
                  <span key={p} className="px-2 py-1 rounded-md bg-slate-700/50 border border-slate-600 text-xs font-mono text-blue-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
