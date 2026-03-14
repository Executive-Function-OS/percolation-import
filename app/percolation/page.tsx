"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Brain, Activity, Info, Eye, Pencil, ArrowLeft, Network, Sparkles } from "lucide-react";
import {
  buildPercolationNetwork,
  calculatePercolationMetrics,
  DEMO_EVENTS,
  DAY_LABELS,
  type PercolationResults,
} from "@/lib/percolation";
import DayCard from "@/components/day-card";
import SpawningDetector from "@/components/spawning-detector";
import AboutTab from "@/components/about-tab";

export default function PercolationEngine() {
  const [activeTab, setActiveTab] = useState<"percolation" | "spawning" | "about">(
    "percolation"
  );
  const [results, setResults] = useState<PercolationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAnalysis = async () => {
    setIsRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const dayResults: PercolationResults["days"] = {};
    const dates = [...new Set(DEMO_EVENTS.map((e) => e.timestamp.split("T")[0]))];

    dates.forEach((date) => {
      const dayEvents = DEMO_EVENTS.filter((e) => e.timestamp.startsWith(date));
      const network = buildPercolationNetwork(dayEvents);
      const metrics = calculatePercolationMetrics(network, dayEvents);
      dayResults[date] = { network, metrics };
    });

    setResults({ days: dayResults });
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* BACK NAV */}
      <div className="bg-[var(--slate-950)] px-5 py-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Framework
          </Link>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-[var(--slate-950)] text-white pt-8 pb-24 px-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--orange)]/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Network className="text-[var(--orange)] w-6 h-6" />
            <h2 className="text-[var(--orange)] font-bold text-[10px] uppercase tracking-[0.4em]">
              Percolation Engine
            </h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            Observer-Operator{" "}
            <span className="text-[var(--orange)]">Network Analysis</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Demo visualization with sample data. Explore network fragmentation,
            spawning detection, and coupling metrics across three simulated days.
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 -mt-12 relative z-20">
        {/* TAB NAVIGATION */}
        <div className="bg-card rounded-[1.5rem] p-1.5 flex gap-1 mb-6 shadow-xl border border-border">
          <button
            onClick={() => setActiveTab("percolation")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.25rem] text-sm font-bold transition-all ${
              activeTab === "percolation"
                ? "bg-[var(--orange)] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Activity className="w-4 h-4" />
            Percolation
          </button>
          <button
            onClick={() => setActiveTab("spawning")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.25rem] text-sm font-bold transition-all ${
              activeTab === "spawning"
                ? "bg-[var(--indigo)] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Brain className="w-4 h-4" />
            Spawning
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.25rem] text-sm font-bold transition-all ${
              activeTab === "about"
                ? "bg-[var(--emerald)] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Info className="w-4 h-4" />
            About
          </button>
        </div>

        {/* PERCOLATION TAB */}
        {activeTab === "percolation" && (
          <div className="space-y-6">
            {/* Run Analysis */}
            {!results && (
              <div className="bg-card rounded-[2rem] p-8 text-center border border-border shadow-xl">
                <div className="w-20 h-20 bg-[var(--orange-dim)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-[var(--orange)]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Run Percolation Analysis
                </h3>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                  Analyze 3 days of demo file interaction events to compute
                  Fragmentation, Coupling (kappa), and P-infinity metrics.
                </p>
                <button
                  onClick={runAnalysis}
                  disabled={isRunning}
                  className="inline-flex items-center gap-3 bg-[var(--slate-950)] text-white px-8 py-4 rounded-full font-black uppercase text-sm tracking-wide hover:bg-black transition-all active:scale-[0.98] shadow-xl disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Load Demo Data
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-6">
                {/* Legend */}
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Network Node Types
                  </h4>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[var(--indigo)]" />
                        <div className="w-3 h-3 bg-[var(--indigo)] rounded-full" />
                      </div>
                      <span className="text-sm font-medium">
                        Observer (View/Read)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-[var(--orange)]" />
                        <div className="w-3 h-3 bg-[var(--orange)] rounded-full" />
                      </div>
                      <span className="text-sm font-medium">
                        Operator (Edit/Create)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Day Cards */}
                {Object.entries(results.days)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, dayData]) => (
                    <DayCard
                      key={date}
                      date={date}
                      label={DAY_LABELS[date] || date}
                      network={dayData.network}
                      metrics={dayData.metrics}
                    />
                  ))}

                {/* Reset Button */}
                <button
                  onClick={() => setResults(null)}
                  className="w-full py-4 rounded-2xl font-bold text-sm border border-border hover:bg-muted transition-colors"
                >
                  Reset Analysis
                </button>
              </div>
            )}
          </div>
        )}

        {/* SPAWNING TAB */}
        {activeTab === "spawning" && <SpawningDetector />}

        {/* ABOUT TAB */}
        {activeTab === "about" && <AboutTab />}
      </div>
    </div>
  );
}
