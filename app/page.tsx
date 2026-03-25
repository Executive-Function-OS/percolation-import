"use client";

import AIEngine from '@/components/AIEngine'; // Adjust path as needed

// Inside your main render function:
<AIEngine />

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

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--indigo-dim)]">
      <header className="relative overflow-hidden bg-[#0F172A] px-5 pb-28 pt-20 text-white">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,#1E40AF_0%,transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Microscope className="h-4 w-4 text-[#0D9488]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
              Executive Function OS · Research preview 0.9.0-beta
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-6xl">
            BMS 4.0 Percolation Engine
          </h1>
          <p className="text-lg text-[#0D9488] md:text-xl">Network topology analysis for cognitive resilience research</p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Detecting observer–operator dynamics through percolation on digital interaction graphs and
            DBSCAN clustering — a collaborative platform for N=1 validation, neurodivergent pattern
            recognition, and computational biology analogies to stress in cellular networks.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/engine"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E40AF] px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-[#1E3A8A] active:scale-[0.98]"
            >
              <Network className="h-5 w-5" />
              Analyze my network
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/engine/methodology"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/15"
            >
              <FlaskConical className="h-5 w-5" />
              Learn about the research
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs text-slate-500">
            🔒 Client-side processing only — your Drive metadata is analyzed in your browser; configure{" "}
            <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> for OAuth.
          </p>
        </div>
      </header>

      <section className="relative z-20 mx-auto max-w-5xl -mt-16 px-5">
        <Card className="border-border shadow-2xl">
          <CardContent className="space-y-4 p-8 text-sm leading-relaxed text-muted-foreground">
            <p>
              This platform implements a <strong className="text-foreground">percolation-theoretic</strong>{" "}
              framing for early signals of cognitive network fragmentation in digital trace data.
              Conceptually parallel to cellular stress responses, we model interactions as a graph where
              sprawl, switching, and version fragmentation act as stress proxies.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>DBSCAN identifies irregular behavioral mode clusters (vs. k-means).</li>
              <li>Network edges combine temporal adjacency, cluster similarity, and file co-occurrence.</li>
              <li>Percolation simulations estimate proximity to a modeled collapse of the giant component.</li>
              <li>Ground truth: user-annotated crisis dates for exploratory validation (prospective studies + IRB for claims).</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-[#1E40AF] md:text-3xl">
          Entry points
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/engine"
            onMouseEnter={() => setHoveredCard("engine")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-[#1E40AF]/40"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E40AF]/10 transition group-hover:bg-[#1E40AF]">
              <Network
                className={`h-7 w-7 ${hoveredCard === "engine" ? "text-white" : "text-[#1E40AF]"}`}
              />
            </div>
            <h3 className="mb-3 text-lg font-bold">Percolation engine</h3>
            <p className="text-sm text-muted-foreground">
              OAuth (Drive Activity), preprocessing, DBSCAN, percolation curves, exports — full research
              workflow in the browser.
            </p>
          </Link>

          <Link
            href="/battle-map"
            onMouseEnter={() => setHoveredCard("battle-map")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--indigo)]/40"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--indigo-dim)] transition group-hover:bg-[var(--indigo)]">
              <Map
                className={`h-7 w-7 ${hoveredCard === "battle-map" ? "text-white" : "text-[var(--indigo)]"}`}
              />
            </div>
            <h3 className="mb-3 text-lg font-bold">Battle map</h3>
            <p className="text-sm text-muted-foreground">
              Original navigation framework for corrupted systems — installations, compass, exit
              protocols.
            </p>
          </Link>

          <Link
            href="/bms"
            onMouseEnter={() => setHoveredCard("bms")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--emerald)]/40"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--emerald-dim)] transition group-hover:bg-[var(--emerald)]">
              <Brain
                className={`h-7 w-7 ${hoveredCard === "bms" ? "text-white" : "text-[var(--emerald)]"}`}
              />
            </div>
            <h3 className="mb-3 text-lg font-bold">BMS 4.0 protocol (classic)</h3>
            <p className="text-sm text-muted-foreground">
              Earlier paste-based coupling view with biological lineage notes — preserved for continuity.
            </p>
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="framework">
              <AccordionTrigger className="text-left font-semibold text-[#1E40AF]">
                Theoretical framework (expandable)
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Network biology parallel:</strong> metabolic stress
                  can reorganize cellular interaction networks; here we use analogous{" "}
                  <em>heuristics</em> on digital traces — not a claim of biological identity.
                </p>
                <p>
                  <strong className="text-foreground">Substrate vs. observable:</strong> Tier 1 patterns
                  (surface behaviors) vs Tier 2 installations (meaning preservation, sunk cost) — aligned
                  with Rarebrain-style framing for high-functioning neurodivergent cognition.
                </p>
                <p>
                  <strong className="text-foreground">Observer–operator split:</strong> the critical
                  transition where meta-awareness of the workload pattern degrades relative to continued
                  operator engagement — quantified approximately via lag metrics in the engine.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">Four system types</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
          Academic framing for the classifier used in the engine (research heuristics, not diagnosis).
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Type 1 — Solvable",
              body: "Low fragmentation; effort–outcome relationship remains tractable.",
              tone: "border-emerald-200 bg-emerald-50/50",
            },
            {
              title: "Type 2 — Complex but navigable",
              body: "Moderate connectivity; probabilistic but still steerable with strategy.",
              tone: "border-blue-200 bg-blue-50/50",
            },
            {
              title: "Type 3 — Fundamentally corrupted",
              body: "High fragmentation and coupling — inverse returns; key research interest (Nathan’s curiosity point).",
              tone: "border-amber-300 bg-amber-50/80",
            },
            {
              title: "Type 4 — Paradox system",
              body: "Extreme fragmentation or lock-in — both pathological extremes in this model.",
              tone: "border-red-300 bg-red-50/80",
            },
          ].map((t) => (
            <div key={t.title} className={`rounded-2xl border p-6 ${t.tone}`}>
              <h4 className="mb-2 font-bold">{t.title}</h4>
              <p className="text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0F172A] px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 flex items-center justify-center gap-2 text-xl font-bold md:text-2xl">
            <Layers className="h-6 w-6 text-[#0D9488]" />
            Collaborators & participation
          </h2>
          <ul className="mb-8 space-y-2 text-left text-sm text-slate-400">
            <li>• Computational biology — network topology & phase-transition metaphors</li>
            <li>• Cognitive networks — N=1 methodology and dense longitudinal designs</li>
            <li>• Rarebrain Institute — observable vs substrate framing for neurodivergent cognition</li>
          </ul>
          <Button asChild size="lg" className="bg-[#1E40AF] hover:bg-[#1E3A8A]">
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
            <Compass className="h-6 w-6 text-[#1E40AF]" />
            <span className="font-semibold text-foreground">Executive Function OS</span>
          </div>
          <div>
            <p>BMS 4.0 Percolation Engine — Annika Eriksson</p>
            <p className="mt-1">
              <Link href="/engine/methodology" className="underline">
                Methodology
              </Link>
              {" · "}
              <Link href="/percolation" className="underline">
                Legacy demo
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
