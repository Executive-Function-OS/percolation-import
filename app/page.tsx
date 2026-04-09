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
          <p className="text-lg text-brand-teal md:text-xl font-medium">A tool to help you break free from overwhelming systems and regain clarity.</p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Detecting observer–operator dynamics through percolation on digital interaction graphs and
            DBSCAN clustering — a collaborative platform for N=1 validation, neurodivergent pattern
            recognition, and computational biology analogies to stress in cellular networks.
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

      <section className="relative z-20 mx-auto max-w-5xl -mt-16 px-5">
        <Card className="border-border shadow-2xl">
          <CardContent className="space-y-4 p-8 text-sm leading-relaxed text-muted-foreground">
            <p>
              This platform implements a <strong className="text-foreground">percolation-theoretic</strong>{" "}
              framing for early signals of cognitive network fragmentation in digital trace data.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>DBSCAN identifies irregular behavioral mode clusters (vs. k-means).</li>
              <li>Network edges combine temporal adjacency, cluster similarity, and file co-occurrence.</li>
              <li>Percolation simulations estimate proximity to a modeled collapse of the giant component.</li>
            </ul>
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
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-brand-blue" />
            <span className="font-semibold text-foreground">Executive Function OS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


