"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Activity, TerminalSquare, AlertCircle, RefreshCw, BarChart3, Fingerprint } from "lucide-react";

export default function FlightRecorderHero() {
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  // Reusable SVG configs
  const nodeRadius = 3;
  const strokeColor = (isActive: boolean, defaultColor: string) => isActive ? defaultColor : 'rgba(255,255,255,0.2)';

  return (
    <div className="w-full bg-[#0a0f18] border-b border-indigo-900/30 overflow-hidden text-slate-300 font-sans p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER ROW */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold bg-slate-900 px-2 py-1 rounded">Executive Function OS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              Cognitive Flight Recorder
              <span className="block text-slate-400 font-light mt-1 text-2xl md:text-3xl">/ Translation Manual</span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-md">
              Trace data translated into system state, then into action.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/simulator" className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded font-medium text-sm transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
              <Activity className="w-4 h-4" /> Try Phase Predictor <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/architecture" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium text-sm transition-colors flex items-center gap-2 border border-slate-700">
              <TerminalSquare className="w-4 h-4" /> Architecture
            </Link>
          </div>
        </div>

        {/* GRID DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* COLUMN 1: Raw Trace (Span 4) */}
          <div 
            className={`lg:col-span-4 rounded-xl border ${hoveredPanel === 'trace' ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-800/50 bg-[#0d141f]'} p-6 transition-all duration-300 flex flex-col`}
            onMouseEnter={() => setHoveredPanel('trace')}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-slate-400" />
                Observer Layer
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">Raw Trace</span>
            </div>
            <p className="text-xs text-slate-500 mb-6 flex-grow">The raw, unfiltered digital footprint of activity before interpretation.</p>
            
            {/* Trace Visualization */}
            <div className="h-48 w-full bg-[#0a0f18] rounded border border-slate-800 relative overflow-hidden mb-6 flex items-center justify-center p-4">
              {/* grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible">
                {/* Lines */}
                <line x1="20" y1="50" x2="40" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="20" y1="50" x2="40" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="40" y1="30" x2="60" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="40" y1="70" x2="60" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="60" y1="50" x2="80" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="60" y1="50" x2="80" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="80" y1="30" x2="80" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="40" y1="30" x2="80" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                
                {/* Nodes */}
                <circle cx="20" cy="50" r={nodeRadius} fill="none" stroke="white" strokeWidth="1" />
                <circle cx="40" cy="30" r={nodeRadius} fill="none" stroke="white" strokeWidth="1" />
                <circle cx="40" cy="70" r={nodeRadius} fill="none" stroke="white" strokeWidth="1" />
                <circle cx="60" cy="50" r={nodeRadius} fill="none" stroke="white" strokeWidth="1" />
                <circle cx="80" cy="30" r={nodeRadius} fill="none" stroke="white" strokeWidth="1" />
                <circle cx="80" cy="70" r={nodeRadius} fill="none" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                <span className="block text-slate-500 mb-1">Density</span>
                <span className="text-white font-mono">Variable</span>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                <span className="block text-slate-500 mb-1">Status</span>
                <span className="text-white font-mono">Monitoring</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
              <span>Timestamp: {new Date().toISOString().substring(11, 19)} GMT</span>
              <span className="flex gap-1"><span className="w-1 h-3 bg-indigo-500 block"></span><span className="w-3 h-3 border border-slate-600 block"></span></span>
            </div>
          </div>

          {/* COLUMN 2 & 3: Types & Outcomes (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* ROW 1: Type 1 & Type 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Type 1 Container */}
              <div 
                className={`rounded border ${hoveredPanel === 'type1' ? 'border-cyan-500/50 bg-cyan-950/10' : 'border-slate-800/50 bg-[#0d141f]'} p-5 transition-all duration-300`}
                onMouseEnter={() => setHoveredPanel('type1')}
                onMouseLeave={() => setHoveredPanel(null)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">Type 1 — Solvable System</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">Type 1</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-[#0a0f18] rounded border border-slate-800 flex-shrink-0 flex items-center justify-center p-2 relative overflow-hidden">
                     <svg viewBox="0 0 100 40" className="w-full h-full relative z-10 overflow-visible">
                        <line x1="10" y1="20" x2="35" y2="20" stroke={strokeColor(hoveredPanel === 'type1', '#06b6d4')} strokeWidth="1" />
                        <line x1="35" y1="20" x2="65" y2="20" stroke={strokeColor(hoveredPanel === 'type1', '#06b6d4')} strokeWidth="1" />
                        <line x1="65" y1="20" x2="90" y2="20" stroke={strokeColor(hoveredPanel === 'type1', '#06b6d4')} strokeWidth="1" />
                        <circle cx="10" cy="20" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type1', '#06b6d4')} strokeWidth="1.5" />
                        <circle cx="35" cy="20" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type1', '#06b6d4')} strokeWidth="1.5" />
                        <circle cx="65" cy="20" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type1', '#06b6d4')} strokeWidth="1.5" />
                        <circle cx="90" cy="20" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type1', '#06b6d4')} strokeWidth="1.5" />
                     </svg>
                  </div>
                  <div className="text-xs">
                    <p className="text-slate-400 mb-1">A healthy system with clear goals.</p>
                    <p><span className="text-white">Observer:</span> Predictable outcome loops</p>
                    <p><span className="text-white">Operator:</span> Belief aligns with reality</p>
                  </div>
                </div>
              </div>

              {/* Type 2 Container */}
              <div 
                className={`rounded border ${hoveredPanel === 'type2' ? 'border-orange-500/50 bg-orange-950/10' : 'border-slate-800/50 bg-[#0d141f]'} p-5 transition-all duration-300`}
                onMouseEnter={() => setHoveredPanel('type2')}
                onMouseLeave={() => setHoveredPanel(null)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">Type 2 — Complex Navigable</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">Type 2</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-[#0a0f18] rounded border border-slate-800 flex-shrink-0 flex items-center justify-center p-2 relative overflow-hidden">
                     <svg viewBox="0 0 100 60" className="w-full h-full relative z-10 overflow-visible">
                        <line x1="10" y1="30" x2="30" y2="30" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1" />
                        <line x1="30" y1="30" x2="50" y2="15" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1" />
                        <line x1="30" y1="30" x2="50" y2="45" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1" />
                        <line x1="50" y1="15" x2="70" y2="10" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1" />
                        <line x1="50" y1="15" x2="70" y2="20" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1" />
                        <circle cx="10" cy="30" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1.5" />
                        <circle cx="30" cy="30" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1.5" />
                        <circle cx="50" cy="15" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1.5" />
                        <circle cx="50" cy="45" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1.5" />
                        <circle cx="70" cy="10" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1.5" />
                        <circle cx="70" cy="20" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type2', '#f97316')} strokeWidth="1.5" />
                     </svg>
                  </div>
                  <div className="text-xs">
                    <p className="text-slate-400 mb-1">Intricate system requiring navigation.</p>
                    <p><span className="text-white">Observer:</span> Branching clusters</p>
                    <p><span className="text-white">Operator:</span> Probabilistic heuristics</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: Type 3 & Threshold */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Type 3 Container */}
              <div 
                className={`rounded border ${hoveredPanel === 'type3' ? 'border-fuchsia-500/50 bg-fuchsia-950/10' : 'border-slate-800/50 bg-[#0d141f]'} p-5 transition-all duration-300`}
                onMouseEnter={() => setHoveredPanel('type3')}
                onMouseLeave={() => setHoveredPanel(null)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">Type 3 — Corrupted</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded border border-fuchsia-400/20">Type 3</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-[#0a0f18] rounded border border-slate-800 flex-shrink-0 flex items-center justify-center p-2 relative overflow-hidden">
                     <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible">
                        <path d="M20,50 Q40,20 60,50 T100,50" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="0.5" opacity="0.5" />
                        <path d="M30,30 Q50,70 70,30" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="0.5" opacity="0.5" />
                        <path d="M40,20 L60,80" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="0.5" opacity="0.5" />
                        <path d="M20,40 L80,60" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="0.5" opacity="0.5" />
                        <circle cx="40" cy="40" r="1.5" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="1" />
                        <circle cx="60" cy="60" r="1.5" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="1" />
                        <circle cx="50" cy="50" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="1.5" />
                        <circle cx="30" cy="60" r="1.5" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="1" />
                        <circle cx="70" cy="40" r="1.5" fill="none" stroke={strokeColor(hoveredPanel === 'type3', '#c026d3')} strokeWidth="1" />
                     </svg>
                  </div>
                  <div className="text-xs">
                    <p className="text-slate-400 mb-1">Repetitive, unproductive cycling.</p>
                    <p><span className="text-white">Observer:</span> Inverse outcomes</p>
                    <p><span className="text-white">Operator:</span> Dominated by corrupted installations</p>
                  </div>
                </div>
              </div>

              {/* Threshold Display */}
              <div 
                className={`rounded border ${hoveredPanel === 'threshold' ? 'border-red-500/50 bg-red-950/10' : 'border-slate-800/50 bg-[#0d141f]'} p-5 transition-all duration-300 flex flex-col`}
                onMouseEnter={() => setHoveredPanel('threshold')}
                onMouseLeave={() => setHoveredPanel(null)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">Intervention Threshold</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">Alert</span>
                </div>
                <div className="flex gap-4 flex-grow">
                  <div className="w-24 h-24 bg-[#0a0f18] rounded border border-slate-800 flex-shrink-0 relative overflow-hidden flex items-end">
                     {/* CSS Grid BG */}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:5px_5px]" />
                     <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 preserve-3d" preserveAspectRatio="none">
                        <path d="M0,20 C40,20 50,20 60,60 C70,90 80,95 100,95" fill="none" stroke={strokeColor(hoveredPanel === 'threshold', '#ef4444')} strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                     </svg>
                     <div className="absolute left-[60%] top-[20%] bottom-0 w-px bg-red-500/50 border-r border-dashed border-red-500/50"></div>
                  </div>
                  <div className="text-xs self-center">
                     <p className="text-slate-400 mb-2">Critical point prior to collapse.</p>
                     <p className="font-mono text-[10px] text-red-400 bg-red-950/50 px-2 py-1 rounded border border-red-500/20">Trigger BMS 4.0 Protocols <ArrowRight className="w-3 h-3 inline-block" /></p>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 3: Operator Output (New 5th Panel) */}
            <div 
                className={`rounded border ${hoveredPanel === 'output' ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800/50 bg-[#0d141f]'} p-5 transition-all duration-300`}
                onMouseEnter={() => setHoveredPanel('output')}
                onMouseLeave={() => setHoveredPanel(null)}
              >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500" />
                  Operator Output Layer
                </h4>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Resolved</span>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                 <div className="w-full max-w-[200px] h-16 bg-[#0a0f18] rounded border border-slate-800 flex-shrink-0 flex items-center justify-center p-2 relative overflow-hidden">
                     <svg viewBox="0 0 100 40" className="w-full h-full relative z-10 overflow-visible">
                        <line x1="20" y1="10" x2="50" y2="10" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1" />
                        <line x1="50" y1="10" x2="80" y2="10" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1" />
                        <line x1="20" y1="30" x2="50" y2="30" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1" />
                        <line x1="50" y1="30" x2="80" y2="30" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1" />
                        <line x1="50" y1="10" x2="50" y2="30" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="20" cy="10" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1.5" />
                        <circle cx="50" cy="10" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1.5" />
                        <circle cx="80" cy="10" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1.5" />
                        <circle cx="20" cy="30" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1.5" />
                        <circle cx="50" cy="30" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1.5" />
                        <circle cx="80" cy="30" r={nodeRadius} fill="none" stroke={strokeColor(hoveredPanel === 'output', '#10b981')} strokeWidth="1.5" />
                     </svg>
                  </div>
                  <div className="text-xs flex-grow">
                    <p className="text-slate-400 mb-1">Post-intervention state. The clean, optimized action layer.</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-[#0a0f18] p-2 rounded border border-slate-800">
                        <span className="block text-slate-500 mb-1">Fragmentation</span>
                        <span className="text-emerald-400 font-mono">0.42% (Stabilized)</span>
                      </div>
                      <div className="bg-[#0a0f18] p-2 rounded border border-slate-800">
                        <span className="block text-slate-500 mb-1">Operator Inferrence</span>
                        <span className="text-emerald-400 font-mono">Successfully Exited</span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
