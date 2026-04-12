"use client";

import React, { useState, useEffect, useMemo } from "react";
import SimulatorGraph from "@/components/simulator-graph";
import { dbscan, Point } from "@/lib/algorithms/dbscan";
import {
  buildGraphFromClusters,
  applyPercolationStress,
  isObserverOperatorConnected,
} from "@/lib/algorithms/percolation";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, BrainCircuit, Activity, RefreshCw } from "lucide-react";

// Gaussian random helper for synthetic node placement
function randomGaussian(mean: number, stdev: number) {
    let u = 1 - Math.random();
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdev + mean;
}

export default function SimulatorPage() {
  const [rawNodes, setRawNodes] = useState<Point[]>([]);
  const [stress, setStress] = useState<number>(0);
  const [useDbscan, setUseDbscan] = useState<boolean>(true);

  useEffect(() => {
    generateRandomSystem();
  }, []);

  const generateRandomSystem = () => {
    const nodes: Point[] = [];
    
    // Observer nodes grouped around x=0.2, y=0.5
    for (let i = 0; i < 30; i++) {
        nodes.push({
          id: `O-${i}`,
          type: "O",
          x: Math.max(0, Math.min(1, randomGaussian(0.2, 0.1))),
          y: Math.max(0, Math.min(1, randomGaussian(0.5, 0.2))),
        });
     }

    // Operator nodes grouped around x=0.8, y=0.5
    for (let i = 0; i < 30; i++) {
       nodes.push({
         id: `A-${i}`,
         type: "A",
         x: Math.max(0, Math.min(1, randomGaussian(0.8, 0.1))),
         y: Math.max(0, Math.min(1, randomGaussian(0.5, 0.2))),
       });
    }

    // Executive Function (Bridge) nodes grouped around center x=0.5
    for (let i = 0; i < 15; i++) {
        nodes.push({
          id: `EF-${i}`,
          type: "EF",
          x: Math.max(0, Math.min(1, randomGaussian(0.5, 0.1))),
          y: Math.max(0, Math.min(1, randomGaussian(0.5, 0.25))),
        });
     }

     setRawNodes(nodes);
     setStress(0);
  };

  const clusteredNodes = useMemo(() => {
    if (!useDbscan) return rawNodes;
    // eps = 0.15 makes separated tight clusters
    return dbscan(rawNodes, 0.15, 3);
  }, [rawNodes, useDbscan]);

  const baseGraph = useMemo(() => {
    return buildGraphFromClusters(clusteredNodes, 0.25); 
  }, [clusteredNodes]);

  const stressedGraph = useMemo(() => {
    return applyPercolationStress(baseGraph, stress);
  }, [baseGraph, stress]);

  const isConnected = isObserverOperatorConnected(stressedGraph);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 flex flex-col font-sans">
      <header className="max-w-5xl mx-auto w-full mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Phase Breakdown Predictor</h1>
        <p className="text-slate-600 mt-2">
          Mapping the transition from stable executive function to disconnected operator modes.
        </p>
      </header>

      <main className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        <div className="space-y-6 flex flex-col">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> Cognitive State
                </h2>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-slate-700">Percolation Stress</span>
                            <span className="font-mono">{Math.round(stress * 100)}%</span>
                        </div>
                        <Slider 
                            value={[stress]} 
                            onValueChange={(val) => setStress(val[0])} 
                            max={1.0} 
                            step={0.01} 
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Executive bridge links fail at 1.5x probability compared to internal cluster nodes.
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                                type="checkbox" 
                                checked={useDbscan} 
                                onChange={(e) => setUseDbscan(e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            Enable DBSCAN Vector Clustering
                        </label>
                    </div>
                    
                    <button 
                        onClick={generateRandomSystem}
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-md font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Reset Topography
                    </button>
                </div>
            </div>

            <div className={`p-6 rounded-xl border flex-grow flex flex-col justify-center items-center text-center transition-all duration-300 ${isConnected ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900 shadow-inner"}`}>
                {isConnected ? (
                    <>
                        <Activity className="w-12 h-12 mb-3 text-emerald-500" />
                        <h3 className="text-xl font-bold">System Integrated</h3>
                        <p className="text-sm mt-2 opacity-80">Pathways exist between Observer logic and Operator execution via Executive nodes.</p>
                    </>
                ) : (
                    <>
                        <AlertCircle className="w-12 h-12 mb-3 text-red-600 animate-pulse" />
                        <h3 className="text-xl font-bold">Breakdown Detected</h3>
                        <p className="text-sm mt-2 opacity-80">Executive bridges shattered. Operator is isolated from Observer input.</p>
                    </>
                )}
            </div>
        </div>

        <div className="md:col-span-2 flex flex-col space-y-4">
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold text-slate-800">Observer-Operator Network Visualization</h3>
                <p className="text-sm text-slate-600 mt-2">
                    <strong className="text-slate-800">Takeaway:</strong> Watch how increasing the 'Percolation Stress' slider probabilistically degrades the executive bridges (center nodes), ultimately isolating intended actions (Observer, left) from actual execution (Operator, right).
                </p>
                <div className="mt-3 text-xs text-amber-800 bg-amber-50 p-3 rounded border border-amber-200">
                    <strong className="text-amber-900 mb-1 block">Caveat:</strong> This spatial layout is synthetic and randomized on generation. The coordinates do not map to physical brain regions, but rather represent a constructed topology for the percolation simulation.
                </div>
            </div>
            <div className="bg-white p-2 rounded-xl border shadow-sm aspect-square md:aspect-auto min-h-[500px] flex-grow">
                <SimulatorGraph graph={stressedGraph} width={800} height={600} />
            </div>
        </div>
      </main>
    </div>
  );
}
