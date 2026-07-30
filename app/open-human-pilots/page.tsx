"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Papa from "papaparse";
import { ArrowLeft, FileText, Database, Compass, Activity, BrainCircuit, Share2, Download } from "lucide-react";
import { formatISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { runEngineAnalysis } from "@/lib/research/pipeline";
import type { EngineAnalysis, NormalizedActivity } from "@/lib/research/types";

// Helper components for the visualizations
function TimelineBar({ analysis }: { analysis: EngineAnalysis }) {
  const windows = analysis.windows;
  const labels = analysis.dbscan.labels;
  const palette = ["#059669", "#0D9488", "#D97706", "#DC2626", "#1E40AF", "#7C3AED"];
  
  return (
    <div className="flex h-12 w-full overflow-hidden rounded-xl border border-border bg-muted/20 mt-4">
      {windows.map((w, i) => {
        const lab = labels[i] ?? -1;
        const col = lab < 0 ? "#94A3B8" : palette[lab % palette.length];
        return (
          <div
            key={i}
            style={{ width: `${100 / windows.length}%`, backgroundColor: col }}
            className="h-full transition-opacity hover:opacity-80 border-r border-background/20 last:border-0"
            title={`Window ${i}: ${new Date(w.startMs).toLocaleString()} - ${lab < 0 ? 'Noise' : 'Cluster ' + lab}`}
          />
        );
      })}
    </div>
  );
}

function StatsCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <Card className={`border-${color}-200/50 bg-${color}-50/30 overflow-hidden relative`}>
      <div className={`absolute -right-4 -top-4 text-${color}-200/20 pointer-events-none`}>
        <Icon size={120} />
      </div>
      <CardContent className="p-6">
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-${color}-100 text-${color}-600`}>
          <Icon size={20} />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h4 className={`text-3xl font-bold text-${color}-950 mb-1`}>{value}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function RescueTimePilotPage() {
  const [data, setData] = useState<NormalizedActivity[]>([]);
  const [analysis, setAnalysis] = useState<EngineAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAndAnalyze() {
      try {
        const response = await fetch("/data/rescuetime-n1.csv");
        if (!response.ok) throw new Error("Failed to load CSV data");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const mapped: NormalizedActivity[] = [];
            for (const row of results.data as any[]) {
              if (!row.Date || !row.Time || !row.Activity || !row.Category) continue;
              
              const t = new Date(`${row.Date}T${row.Time}`).getTime();
              if (isNaN(t)) continue;

              mapped.push({
                t,
                action: row.Category,
                fileId: row.Activity,
                fileName: row.Activity,
              });
            }
            
            // Sort chronologically
            mapped.sort((a, b) => a.t - b.t);
            setData(mapped);

            if (mapped.length > 0) {
              const result = runEngineAnalysis(mapped, {
                windowDays: 90,
                minFileTouches: 1,
                actionInclude: [],
                actionExclude: []
              }, {
                binHours: 4,
                dbscanEps: null,
                dbscanMinSamples: 3,
                similarityLag: 3
              });
              setAnalysis(result);
            }
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message);
            setLoading(false);
          }
        });
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    loadAndAnalyze();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <Activity className="h-10 w-10 animate-bounce text-brand-blue mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Running Pilot Pipeline</h2>
        <p className="text-slate-500 mt-2">Ingesting RescueTime data & simulating percolation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-teal selection:text-white pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Core Systems
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider rounded-full">OpenHuman Pilot n=1</span>
                <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider rounded-full">RescueTime</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                Executive Function Report
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                A 90-day retrospective applying the BMS 4.0 Percolation Engine to personal productivity data.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white"><Share2 className="w-4 h-4 mr-2" /> Share Report</Button>
              <Button className="bg-brand-blue hover:bg-brand-blue-hover"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 mt-12 space-y-12">
        {/* EXECUTIVE SUMMARY */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Compass className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold">Executive Summary</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <StatsCard title="Total Activities Logged" value={data.length.toLocaleString()} subtitle="90 days of continuous tracing" icon={Database} color="indigo" />
            <StatsCard title="Behavioral Clusters" value={analysis?.dbscan.clusterCount ?? 0} subtitle="Distinct functional modes via DBSCAN" icon={BrainCircuit} color="teal" />
            <StatsCard title="System Fragmentation" value={((analysis?.percolation.fragmentation ?? 0) * 100).toFixed(1) + "%"} subtitle="Current network breakdown state" icon={Activity} color="rose" />
            <StatsCard title="System Type" value={analysis?.classification.systemType ?? "N/A"} subtitle={analysis?.classification.systemLabel ?? ""} icon={FileText} color="amber" />
          </div>
        </section>

        {/* BEHAVIORAL MODES */}
        <section className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <Card className="h-full shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Behavioral Modalities Timeline</CardTitle>
                <CardDescription>
                  DBSCAN identifies periods of focus versus scattered context switching. Colors represent distinct behavioral signatures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis && <TimelineBar analysis={analysis} />}
                <div className="flex flex-wrap gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Noise (Scattered)</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-600"></div> Cluster 0 (Deep Focus)</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-600"></div> Cluster 1 (Coordination)</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-600"></div> Cluster 2 (Research)</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-4 space-y-6">
            <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white">
              <CardHeader>
                <CardTitle className="text-indigo-100 text-lg">Percolation Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-200/90 leading-relaxed text-sm mb-4">
                  The temporal activity graph shows signs of <strong className="text-white">localized critical points</strong>. During high-noise periods, the "giant component" of working memory fractures, indicating cognitive load limits being reached.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-indigo-300">
                    <span>Critical Threshold</span>
                    <span className="font-bold text-white">{(analysis?.percolation.criticalThreshold ?? 0).toFixed(2)}</span>
                  </div>
                  <Progress value={(analysis?.percolation.criticalThreshold ?? 0) * 100} className="h-1 bg-indigo-950" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* METHODOLOGY BLURB */}
        <section className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <h3 className="text-2xl font-bold mb-4 relative z-10 text-slate-800">Why RescueTime?</h3>
          <p className="text-slate-600 leading-relaxed max-w-3xl relative z-10">
            OpenHuman pilots utilize precise digital trace data. RescueTime logs (window-focus data) mirror the exact structure of Google Drive activity logs—they capture the digital objects interacted with over time. By feeding this into our BMS 4.0 Percolation Engine, we can model human executive function dynamically without requiring clinical oversight or manual journaling.
          </p>
          <div className="mt-8 flex gap-4 relative z-10">
             <Link href="/engine" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-10 px-4 py-2">
               Try Your Own Data
             </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
