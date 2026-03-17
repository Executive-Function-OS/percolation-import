'use client';

import React, { useState } from 'react';
import { Upload, FileText, Send, ChevronDown, ChevronUp, Activity, Database, Network, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PercolationEngine() {
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [dataInput, setDataInput] = useState('');
  const [activeDrillDown, setActiveDrillDown] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dataInput }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleDrillDown = (section: string) => {
    setActiveDrillDown(activeDrillDown === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-slate-300 pb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Percolation Engine: Diagnostic Pipeline</h1>
          <p className="text-slate-600 mt-2 text-lg">BMS 4.0: Mapping cognitive stress to biological network phase transitions.</p>
        </header>

        {results && (
          <section className={`p-6 rounded-xl border-2 ${results.system_status === 'STABLE' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200 shadow-lg'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {results.system_status === 'STABLE' ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-red-600 animate-pulse" />}
                System Status: {results.system_status}
              </h2>
              <span className="text-3xl font-black">{results.metrics.percolation_stress_percent}% Stress</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
              {['Nodes', 'Clusters', 'Noise', 'GCC Size'].map((label, idx) => (
                <div key={idx} className="bg-white p-3 rounded shadow-sm text-center">
                  <div className="text-slate-500">{label}</div>
                  <div className="text-lg">
                    {idx === 0 ? results.metrics.total_nodes_analyzed : 
                     idx === 1 ? results.metrics.clusters_identified :
                     idx === 2 ? results.metrics.noise_nodes_isolated :
                     `${results.metrics.percolation_stress_percent}%`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-blue-600" /> Data Ingestion</h2>
          <div className="flex gap-4 border-b mb-6 font-medium">
            <button onClick={() => setInputMode('paste')} className={`pb-2 ${inputMode === 'paste' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Paste Text</button>
            <button onClick={() => setInputMode('upload')} className={`pb-2 ${inputMode === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Takeout Upload</button>
          </div>
          {inputMode === 'paste' ? (
            <textarea className="w-full h-32 p-3 border rounded-md" placeholder="Paste MyActivity text..." value={dataInput} onChange={(e) => setDataInput(e.target.value)} />
          ) : (
            <div className="border-2 border-dashed p-8 text-center bg-slate-50 rounded-lg text-slate-500">Google Takeout Support Coming Soon</div>
          )}
          <button disabled={isAnalyzing || !dataInput} onClick={runAnalysis} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:bg-slate-300 font-medium">
            {isAnalyzing ? "Processing Network Math..." : "Run Diagnostic"}
          </button>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Network className="w-5 h-5 text-indigo-600" /> Methodology</h2>
          <div className="space-y-2">
            {[ { id: 'embeddings', t: '1. Vector Embeddings', d: 'Encodes metadata to find semantic adjacency.' },
               { id: 'clustering', t: '2. DBSCAN Clustering', d: 'Identifies dense hubs of cognitive sprawl.' }
            ].map(m => (
              <div key={m.id} className="border rounded-md">
                <button onClick={() => toggleDrillDown(m.id)} className="w-full flex justify-between p-4 bg-slate-50 font-medium">{m.t} {activeDrillDown === m.id ? <ChevronUp/> : <ChevronDown/>}</button>
                {activeDrillDown === m.id && <div className="p-4 bg-white text-sm text-slate-600">{m.d}</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Feedback Review</h2>
          <form action="https://formspree.io/f/mdawpwlj" method="POST" className="text-left space-y-4 max-w-md mx-auto">
            <input type="text" name="name" placeholder="Name / Affiliation" className="w-full p-3 rounded bg-slate-800 border-none text-white" required />
            <textarea name="message" placeholder="Observations for Annika..." className="w-full h-32 p-3 rounded bg-slate-800 border-none text-white" required />
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-medium">Submit to erikssona@icloud.com</button>
          </form>
        </section>
      </div>
    </div>
  );
}
