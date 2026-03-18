'use client';

import React, { useState } from 'react';
import { Upload, Send, ChevronDown, ChevronUp, Database, Network, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PercolationPage() {
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [dataInput, setDataInput] = useState('');
  const [activeDrillDown, setActiveDrillDown] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runAnalysis = async () => {
    if (!dataInput) return;
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      // This calls the Python logic in /api/analyze.py
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dataInput }),
      });

      if (!response.ok) {
        const err = await response.text();
        alert(`Analysis Error (${response.status}): ${err}`);
        return;
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      alert("Could not connect to the math engine. Check if Vercel finished building the 'api' folder.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="border-b border-slate-300 pb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Percolation Engine</h1>
          <p className="text-slate-600 mt-2 text-lg">
            Diagnostic Framework BMS 4.0: Mapping cognitive stress to biological network phase transitions.
          </p>
        </header>

        {results && (
          <section className={`p-6 rounded-xl border-2 transition-all ${results.system_status === 'STABLE' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200 shadow-lg animate-in fade-in'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {results.system_status === 'STABLE' ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-red-600 animate-pulse" />}
                {results.system_status}
              </h2>
              <span className="text-3xl font-black">{results.metrics.percolation_stress_percent}% Stress</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <div className="text-slate-500 text-xs">Nodes</div>
                <div className="text-lg">{results.metrics.total_nodes_analyzed}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <div className="text-slate-500 text-xs">Clusters</div>
                <div className="text-lg">{results.metrics.clusters_identified}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <div className="text-slate-500 text-xs">Noise</div>
                <div className="text-lg">{results.metrics.noise_nodes_isolated}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm text-center">
                <div className="text-slate-500 text-xs">GCC Size</div>
                <div className="text-lg">{results.metrics.percolation_stress_percent}%</div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Ingest Activity Data
          </h2>
          
          <div className="flex gap-4 border-b border-slate-200 mb-6 font-medium">
            <button 
              className={`pb-2 px-1 ${inputMode === 'paste' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
              onClick={() => setInputMode('paste')}
            >
              Copy/Paste
            </button>
            <button 
              className={`pb-2 px-1 ${inputMode === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
              onClick={() => setInputMode('upload')}
            >
              Takeout Upload
            </button>
          </div>

          {inputMode === 'paste' ? (
            <textarea 
              className="w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Paste Google Activity data..."
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
            />
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 text-slate-500 italic">
              Google Takeout JSON ingestion logic is pending validation.
            </div>
          )}
          
          <button 
            disabled={isAnalyzing || !dataInput}
            onClick={runAnalysis}
            className="mt-6 w-full py-3 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 disabled:bg-slate-300 transition-all"
          >
            {isAnalyzing ? "Processing Percolation Threshold..." : "Run Diagnostic"}
          </button>
        </section>

        {/* Technical Drill-Downs for Peers */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600" />
            Methodology
          </h2>
          <div className="space-y-3 text-sm">
            <div className="border border-slate-200 rounded-md">
              <button 
                onClick={() => setActiveDrillDown(activeDrillDown === 'math' ? null : 'math')}
                className="w-full flex justify-between p-4 bg-slate-50 font-medium"
              >
                <span>Vector Embeddings & DBSCAN</span>
                {activeDrillDown === 'math' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeDrillDown === 'math' && (
                <div className="p-4 bg-white border-t text-slate-600 leading-relaxed">
                  Nodes represent discrete activity events. Semantic adjacency is determined via TF-IDF vectorization and Cosine Similarity. Density-Based Spatial Clustering (DBSCAN) identifies high-density cognitive load hubs without forcing disparate noise into clusters.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Submit Peer Feedback</h2>
          <form action="https://formspree.io/f/mdawpwlj" method="POST" className="text-left space-y-4 max-w-md mx-auto">
            <input name="name" placeholder="Name / Affiliation" className="w-full p-3 rounded bg-slate-800 border-none text-white" required />
            <textarea name="message" placeholder="Observations..." className="w-full h-32 p-3 rounded bg-slate-800 border-none text-white" required />
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-medium">Send to Annika</button>
          </form>
        </section>

      </div>
    </div>
  );
}
