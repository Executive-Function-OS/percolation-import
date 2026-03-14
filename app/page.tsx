"use client";

import { useState, useEffect } from "react";
import { Play, Brain, Eye, Pencil, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import DayCard from "@/components/day-card";
import SpawningDetector from "@/components/spawning-detector";
import {
  buildPercolationNetwork,
  calculatePercolationMetrics,
  DEMO_EVENTS,
  DAYS,
  type PercolationMetrics,
  type PercolationNetwork,
} from "@/lib/percolation";

interface DayResult {
  day: string;
  metrics: PercolationMetrics;
  network: PercolationNetwork;
}

export default function PercolationDashboard() {
  const [results, setResults] = useState<DayResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"percolation" | "spawning">(
    "percolation"
  );
  const [graphWidth, setGraphWidth] = useState(320);

  useEffect(() => {
    const updateWidth = () => {
      setGraphWidth(Math.min(window.innerWidth - 80, 400));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function runAnalysis() {
    if (running) return;
    setRunning(true);
    setResults(null);
    setExpandedDay(null);

    setTimeout(() => {
      const dayResults: DayResult[] = DAYS.map((day) => {
        const events = DEMO_EVENTS.filter((e) => e.day === day);
        const network = buildPercolationNetwork(events);
        const metrics = calculatePercolationMetrics(network);
        return { day, metrics, network };
      });
      setResults(dayResults);
      setRunning(false);
      setExpandedDay(DAYS[0]);
    }, 600);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-5 py-8 pb-24">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(0,212,255,0.2)] mb-4">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Cognitive Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight mb-3 text-balance">
            Percolation Dashboard
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Observer - Operator network analysis from file interaction events
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-card rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("percolation")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "percolation"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="w-4 h-4" />
            Percolation
          </button>
          <button
            onClick={() => setActiveTab("spawning")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "spawning"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Brain className="w-4 h-4" />
            Spawning
          </button>
        </div>

        {activeTab === "percolation" ? (
          <>
            {/* Attribution Card */}
            <div className="bg-card rounded-xl border border-border p-4 mb-6">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Built on Nathan Lazar, PhD&apos;s insight
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                    Computational Biology - Cognitive Networks
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-card rounded-xl border border-border p-4 mb-6">
              <p className="text-xs text-muted-foreground italic leading-relaxed mb-3">
                &quot;Run a clustering method (I like DBSCAN because it
                doesn&apos;t require every point to be in a cluster). Label each
                cluster by decoding the embedding...&quot;
              </p>
              <p className="text-xs text-foreground leading-relaxed">
                That&apos;s exactly the detector layer. Percolation theory adds
                what clustering can&apos;t: a continuous stress parameter that
                predicts when the whole system tips.
              </p>
            </div>

            {/* Legend */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2.5">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Observer nodes view/open files
                </span>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2.5">
                <Pencil className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">
                  Operator nodes edit/save/export
                </span>
              </div>
            </div>

            {/* Run Button */}
            <Button
              onClick={runAnalysis}
              disabled={running}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base mb-8"
            >
              {running ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {running ? "Computing..." : "Run Percolation Analysis"}
            </Button>

            {/* Results */}
            {results && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  {results.length} days analyzed
                </p>
                {results.map((result) => (
                  <DayCard
                    key={result.day}
                    result={result}
                    isExpanded={expandedDay === result.day}
                    onToggle={() =>
                      setExpandedDay(
                        expandedDay === result.day ? null : result.day
                      )
                    }
                    graphWidth={graphWidth}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!results && !running && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Run analysis to compute percolation metrics across demo days
                </p>
              </div>
            )}
          </>
        ) : (
          <SpawningDetector />
        )}
      </div>
    </main>
  );
}
