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
  Activity,
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
import FlightRecorderHero from "@/components/FlightRecorderHero";
import FAQSection from "@/components/FAQSection";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--indigo-dim)]">
      <FlightRecorderHero />

      <section className="relative z-20 mx-auto max-w-5xl -mt-16 px-5 space-y-6">
        <Card className="border-border shadow-2xl">
          <CardContent className="space-y-6 p-8 text-sm leading-relaxed text-muted-foreground">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-foreground">Methods & Assumptions</h3>
                <Link href="/architecture" className="text-sm font-semibold text-brand-blue hover:underline inline-flex items-center gap-1">
                  Technical Architecture <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="mb-3">
                This platform uses a percolation-theoretic framing to model cognitive network fragmentation.
              </p>
              <ul className="list-disc space-y-2 pl-5 mb-6">
                <li><strong>Data flow:</strong> Behavioral digital trace data are projected into a multidimensional state space.</li>
                <li><strong>Transformations:</strong> DBSCAN identifies irregular behavioral clusters. Network edges are then constructed from temporal adjacency, cluster similarity, and file co-occurrence.</li>
                <li><strong>Assumptions:</strong> The model treats "Observer" and "Operator" states as networked processes bridged by executive-function nodes. Stress preferentially degrades those bridges.</li>
              </ul>
              
              <h4 className="font-semibold text-foreground mb-2">Planned HybridRAG Expansion</h4>
              <div className="rounded-xl border border-border overflow-hidden bg-slate-50/50 mb-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/50 border-b border-border text-foreground">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Output</th>
                        <th className="px-4 py-2 font-semibold">Data Source</th>
                        <th className="px-4 py-2 font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-muted-foreground">
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Conversation State</td>
                        <td className="px-4 py-2">Knowledge Graph + Timeline</td>
                        <td className="px-4 py-2">Near real-time after initial indexing; dynamic filters query cached graph.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Executive Function Gaps</td>
                        <td className="px-4 py-2">LLM Pattern Detection</td>
                        <td className="px-4 py-2">Identify decision friction, deferral patterns</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Procedural Bottlenecks</td>
                        <td className="px-4 py-2">Graph Analysis</td>
                        <td className="px-4 py-2">Circular dependencies, unresolved paths</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Observer vs Operator</td>
                        <td className="px-4 py-2">Text Classification</td>
                        <td className="px-4 py-2">Ground truth vs belief divergence (e.g. inferred vs recorded paths)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Interpretation & Limitations</h3>
              <p>The percolation simulation shows how network connectivity changes under stress. A connected state indicates pathways for execution. A broken state indicates reduced coordination, localized fixation, or task paralysis.</p>
              <p className="mt-2 text-amber-600 dark:text-amber-400"><strong>Limitations:</strong> This is a theoretical model. It does not represent a clinical diagnosis or a direct map of neural pathways. It should not be used to infer treatment efficacy or broad cognitive capacity.</p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Comparative Analysis</h3>
              <p className="mb-4">
                Established open-source digital phenotyping platforms like <strong>mindLAMP</strong> (BIDMC/Harvard; 120+ publications, deployed in multi-site trials) and <strong>Beiwe</strong> (Onnela Lab, Harvard; used in hundreds of studies) provide rich data capture and feature extraction. They typically rely on centralized servers and do not apply network-level structural modeling. EFOS complements these tools by offering a fully client-side, percolation-based structural analysis of cognitive fragmentation, producing privacy-preserving outputs designed for AI-native research.
              </p>
              <div className="rounded-xl border border-border overflow-hidden bg-slate-50/50 mb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/50 border-b border-border text-foreground">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Differentiator</th>
                        <th className="px-4 py-2 font-semibold">mindLAMP (BIDMC/Harvard)</th>
                        <th className="px-4 py-2 font-semibold">Beiwe (Onnela Lab, Harvard)</th>
                        <th className="px-4 py-2 font-semibold text-brand-blue font-bold">EFOS (Ours)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-muted-foreground">
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Primary Data Source</td>
                        <td className="px-4 py-2">Active surveys & passive sensor logs</td>
                        <td className="px-4 py-2">Passive sensors (GPS, accelerometer)</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">Passive interaction logs (Google OAuth)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Data Processing</td>
                        <td className="px-4 py-2">Centralized database (Cortex)</td>
                        <td className="px-4 py-2">Centralized backend server</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">Fully local client-side (local computation)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Modeling Method</td>
                        <td className="px-4 py-2">Statistical time-series feature sets</td>
                        <td className="px-4 py-2">Statistical behavioral metrics</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">Percolation graph theory & DBSCAN</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Security Footprint</td>
                        <td className="px-4 py-2">Decoupled server database</td>
                        <td className="px-4 py-2">Server database & service center</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">No raw data leaves the client device</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Output Type</td>
                        <td className="px-4 py-2">Direct sensor aggregates</td>
                        <td className="px-4 py-2">Raw/aggregated sensor metrics</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">Anonymized structural phenotypes</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-foreground">Diagnostic Status</td>
                        <td className="px-4 py-2">Clinical research tool</td>
                        <td className="px-4 py-2">Clinical research tool</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">Research tool (Not clinical diagnostic)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Current Status & Traction</h3>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li><strong>Public codebase:</strong> Full source code, unit tests (Vitest), and DBSCAN/percolation pipeline <a href="https://github.com/Executive-Function-OS/percolation-import" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">publicly available under MIT license</a> with an active issue tracker and roadmap.</li>
                <li><strong>Interactive demo:</strong> A live client-side analysis engine and <Link href="/simulator" className="text-brand-blue hover:underline">Phase Simulator</Link> demonstrating ingestion, clustering, and percolation simulation.</li>
                <li><strong>Validation:</strong> Internal proof-of-concept completed on simulated and limited real data (n=1). An external pilot validation cohort (target N=30–50) is actively recruiting via the <Link href="/open-human-pilots" className="text-brand-blue hover:underline">Pilot page</Link> to test convergent validity against BRIEF-A/BDEFS. Early sign-ups and community feedback indicate growing interest from computational psychiatry researchers.</li>
              </ul>
              <Link href="/architecture" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:underline mt-2">
                Planned Case-File Pipeline <ArrowRight className="w-4 h-4" />
              </Link>
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

          <Link href="/open-human-pilots" className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--indigo)]/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--indigo-dim)] transition group-hover:bg-[var(--indigo)]">
              <Activity className="h-7 w-7 text-[var(--indigo)] group-hover:text-white" />
            </div>
            <h3 className="mb-3 text-lg font-bold">Pilot Dashboard</h3>
            <p className="text-sm text-muted-foreground">Interactive open-science cohort visualization.</p>
          </Link>

          <Link href="/researchers" className="group rounded-[2rem] border border-border bg-card p-8 shadow-xl transition hover:-translate-y-1 hover:border-pink-500/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 transition group-hover:bg-pink-500">
              <Brain className="h-7 w-7 text-pink-500 group-hover:text-white" />
            </div>
            <h3 className="mb-3 text-lg font-bold">Research Framework</h3>
            <p className="text-sm text-muted-foreground">Academic collaboration and pre-registration details.</p>
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
            Collaborators & Participation
          </h2>
          <p className="text-brand-teal/80 mb-8 max-w-xl mx-auto">
            EFOS relies on open-source contributions, independent N=1 pilots, and interdisciplinary academic partnerships. 
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue-hover">
              <Link href="/researchers">
                <Microscope className="mr-2 h-4 w-4" />
                For Researchers & Labs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-brand-dark">
              <Link href="/open-human-pilots">
                <Activity className="mr-2 h-4 w-4" />
                View OpenHuman Pilots (n=1)
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 text-left max-w-2xl mx-auto backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-brand-teal shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-2 text-lg">Our Data Contribution Promise</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We will never sell your data, you can delete it anytime, and you'll see exactly how aggregated insights improve the model. This is a privacy-first platform built for computational psychiatry, not targeted advertising.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="px-5 py-12 bg-white">
        <FAQSection />
      </section>

      {/* --- NEWSLETTER SECTION --- */}
      <section className="px-5 py-20 bg-slate-100 border-t border-border">
        <NewsletterSignup />
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
              M.S. Bioinformatics, OHSU, 2017.<br/>
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


