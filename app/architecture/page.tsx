import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Construction, 
  Database, 
  FileText, 
  LayoutTemplate, 
  Map, 
  Network, 
  Search, 
  ShieldCheck,
  Code2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--indigo-dim)] pb-24">
      {/* HEADER */}
      <header className="relative overflow-hidden bg-brand-dark px-5 pb-20 pt-16 text-white">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(ellipse_at_top_right,#0F766E_0%,transparent_60%)]" />
        
        <div className="relative z-10 mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research Preview
          </Link>
          
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-4 py-2 backdrop-blur-sm text-brand-teal">
            <LayoutTemplate className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              Technical Expansion
            </span>
          </div>
          
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-5xl">
            HybridRAG Case-File Analysis Pipeline
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            This page describes the planned architecture for processing large case-file corpora and generating the four core visualizations: conversation state, executive-function gaps, procedural bottlenecks, and Observer/Operator reasoning splits.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 relative z-20 space-y-16 -mt-8">
        
        {/* CORE ARCHITECTURE */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-1">
            <Construction className="w-6 h-6 text-brand-blue" />
            <h2 className="text-2xl font-bold text-foreground">Core Architecture</h2>
          </div>
          <p className="text-muted-foreground mb-6 px-1">A three-stage pipeline combining document processing, knowledge graph construction, and hybrid retrieval:</p>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <Database className="w-7 h-7 text-brand-blue" />
                  <span className="text-4xl font-black text-slate-200">01</span>
                </div>
                <CardTitle className="text-lg mt-4">PDF Processing</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                Extract structured text from case files using unstructured (standard PDFs) or Tesseract OCR (scanned documents). Chunk and clean for LLM ingestion.
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <Network className="w-7 h-7 text-brand-teal" />
                  <span className="text-4xl font-black text-slate-200">02</span>
                </div>
                <CardTitle className="text-lg mt-4">Knowledge Graph Construction</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                LLM extracts entities (actors, obligations, deadlines) and relationships (dependencies, contradictions). Store in Neo4j as nodes and edges for relational reasoning.
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <Search className="w-7 h-7 text-[var(--indigo)]" />
                  <span className="text-4xl font-black text-slate-200">03</span>
                </div>
                <CardTitle className="text-lg mt-4">HybridRAG Retrieval</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                Combine vector embeddings (Qdrant/FAISS) for semantic search with graph queries for structural analysis.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CORE VISUALIZATIONS TABLE */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-1">
            <Map className="w-6 h-6 text-brand-blue" />
            <h2 className="text-2xl font-bold text-foreground">Core Visualizations</h2>
          </div>
          <p className="text-muted-foreground mb-6 px-1">Four primary outputs mapped to the pipeline:</p>

          <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-foreground">Visualization</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Data Source</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Technical Implementation</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Conversation State</td>
                    <td className="px-6 py-4 text-muted-foreground">Knowledge Graph + Timeline</td>
                    <td className="px-6 py-4 text-muted-foreground">React Force Graph (D3.js), date sliders</td>
                    <td className="px-6 py-4 text-muted-foreground">Dynamic network of actors, obligations, status</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Executive Function Gaps</td>
                    <td className="px-6 py-4 text-muted-foreground">LLM Pattern Detection</td>
                    <td className="px-6 py-4 text-muted-foreground">Linguistic markers of avoidance/paralysis</td>
                    <td className="px-6 py-4 text-muted-foreground">Identify decision friction, deferral patterns</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Procedural Bottlenecks</td>
                    <td className="px-6 py-4 text-muted-foreground">Graph Analysis</td>
                    <td className="px-6 py-4 text-muted-foreground">Cycle detection, dead-end identification</td>
                    <td className="px-6 py-4 text-muted-foreground">Circular dependencies, unresolved paths</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Observer vs Operator</td>
                    <td className="px-6 py-4 text-muted-foreground">Text Classification</td>
                    <td className="px-6 py-4 text-muted-foreground">Explicit vs inferred reasoning contrast</td>
                    <td className="px-6 py-4 text-muted-foreground">Ground truth vs belief divergence</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* CHALLENGES */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-teal" />
              Key Challenges Addressed
            </h3>
            <ul className="space-y-3">
              {[
                { title: "Scale", desc: "Efficient chunking + graph query optimization for 2400+ pages." },
                { title: "Accuracy", desc: "LLM verifiers + human-in-loop validation." },
                { title: "Traceability", desc: "Full provenance from source text to visualization." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0" />
                  <div>
                    <strong className="text-foreground">{item.title}:</strong> <span className="text-muted-foreground">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* STATUS */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-blue" />
              Current Status
            </h3>
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-brand-blue bg-white text-brand-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] text-sm p-3 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                  <strong className="block text-brand-blue mb-1">Phase 1 (PoC)</strong>
                  <span className="text-muted-foreground">2-3 sample PDFs → basic pipeline → conversation state visualization.</span>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] text-sm p-3 bg-card rounded-lg border border-border">
                  <strong className="block text-foreground mb-1">Phase 2</strong>
                  <span className="text-muted-foreground">Full corpus processing + bottleneck detection.</span>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] text-sm p-3 bg-card rounded-lg border border-border">
                  <strong className="block text-foreground mb-1">Phase 3</strong>
                  <span className="text-muted-foreground">Executive function and Observer/Operator analysis.</span>
                </div>
              </div>
            </div>
          </section>

          {/* TECH STACK */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-[var(--indigo)]" />
              Tech Stack
            </h3>
            <div className="bg-slate-950 rounded-xl p-5 border border-border">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-400 font-medium mb-1">PDF Processing</dt>
                  <dd className="text-slate-200 font-mono text-xs">unstructured, Tesseract OCR</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium mb-1">LLM</dt>
                  <dd className="text-slate-200 font-mono text-xs">OpenAI GPT-4o / Claude 3.5 Sonnet</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium mb-1">Vector Store / Graph DB</dt>
                  <dd className="text-slate-200 font-mono text-xs">Qdrant / Neo4j</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium mb-1">Frontend / Backend</dt>
                  <dd className="text-slate-200 font-mono text-xs">React + D3.js (Force Graph) / FastAPI + LangChain</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* VALIDATION */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Validation Approach
            </h3>
            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <strong className="text-foreground">Internal consistency:</strong> <span className="text-muted-foreground">Graph queries reproduce expected relationships.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <strong className="text-foreground">Face validity:</strong> <span className="text-muted-foreground">Human review of flagged bottlenecks/gaps.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <strong className="text-foreground">Convergent validity:</strong> <span className="text-muted-foreground">Compare LLM outputs to manual analysis.</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <section className="border-t border-border pt-12 text-center">
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl mx-auto">
            This architecture enables computational analysis of case-file corpora while preserving transparency and reproducibility.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/simulator" className="px-6 py-2 rounded-full border border-border bg-card hover:bg-slate-50 transition-colors text-sm font-semibold">
              Live Simulator
            </Link>
            <Link href="/" className="px-6 py-2 rounded-full border border-border bg-card hover:bg-slate-50 transition-colors text-sm font-semibold">
              Methods Overview
            </Link>
            <a href="mailto:contact@example.com" className="px-6 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-colors text-sm font-semibold">
              Questions? Contact
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
