"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Compass,
  FlaskConical,
  Layers,
  Map,
  Microscope,
  Network,
  Shield,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Correctly imports from the ROOT components folder using the @ alias
import AIEngine from "@/components/AIEngine";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--indigo-dim)]">
      <header className="relative overflow-hidden bg-brand-dark px-5 pb-28 pt-20 text-white">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,#1E40AF_0%,transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Microscope className="h-4 w-4 text-brand-teal" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
              Executive Function OS · Research preview 0.9.0-beta
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Executive Function OS
          </h1>
          <p className="text-lg text-brand-teal md:text-xl font-medium">A computational model of cognitive network breakdown.</p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            This application is a <strong>framework and model</strong> designed to simulate and visualize how cognitive load impacts the ability to translate intention into action. The visualisations provided are representations within this specific theoretical framework, not direct or clinical measurements of brain activity.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-brand-blue-hover active:scale-[0.98]"
            >
              <Network className="h-5 w-5" />
              Try the Phase Predictor
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/engine"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/15"
            >
              <FlaskConical className="h-5 w-5" />
              Raw Analysis Engine
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-20 mx-auto max-w-5xl -mt-16 px-5 space-y-6">
        <Card className="border-border shadow-2xl">
          <CardContent className="space-y-6 p-8 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Methods & Assumptions</h3>
              <p className="mb-3">
                This platform implements a <strong className="text-foreground">percolation-theoretic</strong>{" "}
                framing to model cognitive network fragmentation.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Data Flow:</strong> Behavioral digital trace data is ingested and projected into a multi-dimensional state space.</li>
                <li><strong>Transformations:</strong> DBSCAN (Density-Based Spatial Clustering of Applications with Noise) identifies irregular behavioral mode clusters based on these traces. Network edges are then constructed by combining temporal adjacency, cluster similarity, and file co-occurrence.</li>
                <li><strong>Assumptions:</strong> The core assumption is that "Observer" (intent) and "Operator" (execution) states function as a network bridged by executive function nodes. We assume stress degrades these bridges preferentially.</li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Interpretation & Limitations</h3>
              <p><strong>How to read the results:</strong> The percolation simulation demonstrates the <em>probability</em> of network collapse under stress. A connected state means the system has pathways to execute intent. A broken state represents localized hyper-focus or task-paralysis.</p>
              <p className="mt-2 text-amber-600 dark:text-amber-400"><strong>Limitations:</strong> This is a theoretical model. The outputs do not represent clinical diagnoses, nor do they perfectly map to physical neural pathways. Claims regarding broad cognitive capacity or treatment efficacy are not justified based on this framework.</p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Validation & Next Steps</h3>
              <p>Current feedback mechanisms act as <strong>internal checks</strong> (face validity and logical verification of the model's behavior under assumed parameters). <strong>External validation</strong> and rigorous tuning against empirical N=1 or larger cohort datasets are ongoing. This represents a preliminary step toward building robust, reproducible tools for computational psychiatry.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue md:text-3xl">
          Core Tools
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/simulator" className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-brand-blue/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 transition group-hover:bg-brand-blue">
              <Network className="h-7 w-7 text-brand-blue group-hover:text-white" />
            </div>
            <h3 className="mb-3 text-lg font-bold">Phase Simulator</h3>
            <p className="text-sm text-muted-foreground">Interactive visualization of cognitive breakdown.</p>
          </Link>

          <Link href="/engine" className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-brand-teal/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--emerald-dim)] transition group-hover:bg-[var(--emerald)]">
              <FlaskConical className="h-7 w-7 text-[var(--emerald)] group-hover:text-white" />
            </div>
            <h3 className="mb-3 text-lg font-bold">Analysis Engine</h3>
            <p className="text-sm text-muted-foreground">OAuth data ingestion and percolation exports.</p>
          </Link>

          <Link href="/battle-map" className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--indigo)]/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--indigo-dim)] transition group-hover:bg-[var(--indigo)]">
              <Map className="h-7 w-7 text-[var(--indigo)] group-hover:text-white" />
            </div>
            <h3 className="mb-3 text-lg font-bold">Battle map</h3>
            <p className="text-sm text-muted-foreground">Original navigation framework for corrupted systems.</p>
          </Link>

          <Link href="/bms" className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-pink-500/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 transition group-hover:bg-pink-500">
              <Brain className="h-7 w-7 text-pink-500 group-hover:text-white" />
            </div>
            <h3 className="mb-3 text-lg font-bold">BMS Protocol</h3>
            <p className="text-sm text-muted-foreground">Earlier paste-based coupling view with notes.</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">Four system types</h2>
        <div className="grid gap-4 md:grid-cols-2 mt-10">
          {[
            { title: "Type 1 — Solvable", body: "Low fragmentation; effort–outcome relationship remains tractable.", tone: "border-emerald-200 bg-emerald-50/50" },
            { title: "Type 2 — Complex but navigable", body: "Moderate connectivity; probabilistic but still steerable with strategy.", tone: "border-blue-200 bg-blue-50/50" },
            { title: "Type 3 — Fundamentally corrupted", body: "High fragmentation and coupling — inverse returns.", tone: "border-amber-300 bg-amber-50/80" },
            { title: "Type 4 — Paradox system", body: "Extreme fragmentation or lock-in — both pathological extremes in this model.", tone: "border-red-300 bg-red-50/80" },
          ].map((t) => (
            <div key={t.title} className={`rounded-2xl border p-6 ${t.tone}`}>
              <h4 className="mb-2 font-bold">{t.title}</h4>
              <p className="text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- AI ENGINE SECTION --- */}
      <section className="bg-slate-50 border-y border-border px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-brand-blue md:text-3xl">
            Consult the Engine
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
            Interact directly with the Executive Function OS logic core to structure your working memory.
          </p>
          
          <AIEngine />
          
        </div>
      </section>

      <section className="bg-brand-dark px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 flex items-center justify-center gap-2 text-xl font-bold md:text-2xl">
            <Layers className="h-6 w-6 text-brand-teal" />
            Collaborators & participation
          </h2>
          <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue-hover mt-4">
            <Link href="/engine">
              <Shield className="mr-2 h-4 w-4" />
              Join the research (open engine)
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Compass className="h-6 w-6 text-brand-blue" />
              <span className="font-semibold text-foreground">Executive Function OS</span>
            </div>
          </div>
          <div className="max-w-md text-left md:text-right">
            <h4 className="font-semibold text-foreground mb-1">Author Background</h4>
            <p className="text-xs leading-relaxed">
              M.S. Bioinformatics, OHSU 2017<br/>
              Capstone in reproducibility in imaging genetics.<br/>
              Co-author on a computational model of mouse ovarian development.<br/>
              Aiming to bring rigorous, reproducible methods to cognitive modeling.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


