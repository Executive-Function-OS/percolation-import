"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Activity,
  Network,
  Dna,
  ArrowRight,
  Crosshair,
  Flame,
  ArrowLeft,
} from "lucide-react";
import {
  runActivitySimulation,
  calculateCouplingStrength,
  getSystemStatus,
  type ActivityResults,
} from "@/lib/percolation";

export default function BMSProtocol() {
  const [rawData, setRawData] = useState("");
  const [results, setResults] = useState<
    (ActivityResults & { couplingStrength: number; systemStatus: string }) | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Micro-Survey State
  const [observations, setObservations] = useState(50);
  const [operations, setOperations] = useState(10);

  // Coupling Strength (Kappa) Calculation
  const couplingStrength = calculateCouplingStrength(observations, operations);
  const systemStatus = getSystemStatus(couplingStrength);

  const handleProcess = () => {
    setError(null);
    try {
      const graph = runActivitySimulation(rawData, observations, operations);
      setResults({ ...graph, couplingStrength, systemStatus });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--indigo-dim)] pb-24">
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

      {/* HERO: The Architecture of a Break */}
      <header className="bg-[var(--slate-950)] text-white pt-12 pb-28 px-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--indigo)]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <Compass className="text-[var(--indigo)] w-7 h-7" />
            <h2 className="text-[var(--indigo)] font-bold text-[10px] uppercase tracking-[0.4em]">
              BMS 4.0 Protocol
            </h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.95] mb-6 text-balance">
            The Architecture{" "}
            <span className="text-[var(--indigo)]">of a Break.</span>
          </h1>
          <p className="text-base text-slate-400 font-light leading-relaxed border-l-2 border-[var(--indigo)] pl-5">
            Stress is not just an emotion; it is a measurable network state. Like a
            forest fire percolating through densely packed trees, human systems
            shatter when the bridge between{" "}
            <strong className="text-white">Observation</strong> (seeing) and{" "}
            <strong className="text-white">Operation</strong> (doing) collapses.
            Map your agency below.
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 -mt-14 relative z-20 space-y-6">
        {/* THE SYSTEM THERMOMETER */}
        <div className="bg-card rounded-[2rem] p-6 md:p-10 shadow-2xl border border-border">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-6">
            <Flame className="w-4 h-4 text-[var(--orange)]" /> 1. The System
            Thermometer
          </h3>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-bold text-foreground mb-3">
                  <span>Daily Observations (Inputs, Emails, Slack)</span>
                  <span className="text-[var(--indigo)] bg-[var(--indigo-dim)] px-2.5 py-0.5 rounded-full text-xs">
                    {observations}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={observations}
                  onChange={(e) => setObservations(Number(e.target.value))}
                  className="w-full accent-[var(--indigo)] h-2"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-foreground mb-3">
                  <span>Daily Operations (Decisions, Outputs, Code)</span>
                  <span className="text-[var(--emerald)] bg-[var(--emerald-dim)] px-2.5 py-0.5 rounded-full text-xs">
                    {operations}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={operations}
                  onChange={(e) => setOperations(Number(e.target.value))}
                  className="w-full accent-[var(--emerald)] h-2"
                />
              </div>
            </div>

            <div
              className={`p-6 rounded-[1.5rem] border-2 text-center transition-colors duration-500 ${
                systemStatus === "Integrated"
                  ? "bg-[var(--emerald-dim)] border-[var(--emerald)]/30 text-[var(--slate-950)]"
                  : systemStatus === "Critical Slowing Down"
                    ? "bg-[var(--orange-dim)] border-[var(--orange)]/30 text-[var(--slate-950)]"
                    : "bg-[var(--red-dim)] border-[var(--red)]/30 text-[var(--slate-950)]"
              }`}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">
                Coupling Strength (kappa)
              </p>
              <h4 className="text-5xl font-black tracking-tighter mb-2">
                {couplingStrength}%
              </h4>
              <p className="text-xs font-bold uppercase tracking-widest">
                {systemStatus}
              </p>
            </div>
          </div>
        </div>

        {/* SUBSTRATE INGESTION */}
        <div className="bg-card rounded-[2rem] p-6 md:p-10 shadow-xl border border-border">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[var(--indigo)]" /> 2. Substrate
            Signal Ingestion
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Paste your raw Google Workspace activity. We will run temporal density
            clustering (DBSCAN) to identify your &quot;Noise Nodes&quot;—instances
            of stealth autonomy.
          </p>

          <textarea
            className="w-full h-32 bg-muted border-none rounded-[1.25rem] p-5 text-sm font-mono outline-none focus:ring-4 focus:ring-[var(--indigo)]/10 transition-all mb-5 resize-none"
            placeholder="Paste raw Google Activity text here... (e.g. 'You viewed Q3_Report')"
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
          />

          {error && (
            <p className="text-[var(--red)] text-sm mb-4 font-medium">{error}</p>
          )}

          <button
            onClick={handleProcess}
            className="w-full py-4 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-xs transition-all bg-[var(--slate-950)] text-white hover:bg-black active:scale-[0.98] shadow-xl"
          >
            Initiate Network X-Ray
          </button>
        </div>

        {/* RESULTS & EXIT BLUEPRINT */}
        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              {/* THE NETWORK X-RAY */}
              <div className="bg-[var(--slate-950)] text-white rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <Network className="absolute -bottom-8 -right-8 w-40 h-40 text-white/5" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--indigo)] mb-5">
                  The Network X-Ray
                </h3>
                <div className="flex gap-6 mb-6">
                  <div>
                    <p className="text-3xl font-black text-[var(--indigo)]">
                      {results.opCount}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Operator Nodes
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-400">
                      {results.obsCount}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Observer Nodes
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-xs leading-relaxed text-[var(--indigo)]/80">
                    <strong className="text-white">DBSCAN Analysis:</strong> If
                    your Operator nodes are isolated from the main cluster, you
                    are a &quot;Noise Node.&quot; In our system, being an outlier
                    is not bad—it is{" "}
                    <span className="text-[var(--indigo)] font-bold">
                      Stealth Autonomy
                    </span>
                    . You are maintaining a private network of integrity outside
                    the corrupted main system.
                  </p>
                </div>
              </div>

              {/* THE EXIT BLUEPRINT */}
              <div
                className={`rounded-[2rem] p-6 md:p-8 shadow-xl border-2 flex flex-col justify-center ${
                  results.couplingStrength < 20
                    ? "bg-[var(--red-dim)] border-[var(--red)]/30"
                    : results.couplingStrength < 40
                      ? "bg-[var(--orange-dim)] border-[var(--orange)]/30"
                      : "bg-[var(--emerald-dim)] border-[var(--emerald)]/30"
                }`}
              >
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-5 flex items-center gap-2">
                  <Crosshair size={14} /> The Exit Blueprint
                </h3>

                {results.couplingStrength < 20 ? (
                  <>
                    <h4 className="text-xl font-black text-[var(--red)] mb-3 leading-tight">
                      System is fundamentally corrupted.
                    </h4>
                    <p className="text-[var(--red)]/80 text-sm mb-5">
                      Optimization is no longer possible. The math shows the
                      connection between sensing and acting is severed.
                    </p>
                    <div className="p-3 bg-[var(--red)] text-white rounded-xl text-xs font-bold">
                      Prescription: Prioritize Psychological Decoupling and Exit
                      Sequencing.
                    </div>
                  </>
                ) : results.couplingStrength < 40 ? (
                  <>
                    <h4 className="text-xl font-black text-[var(--orange)] mb-3 leading-tight">
                      Critical Slowing Down detected.
                    </h4>
                    <p className="text-[var(--orange)]/80 text-sm mb-5">
                      You are nearing a phase transition. Your recovery time from
                      stress is increasing exponentially.
                    </p>
                    <div className="p-3 bg-[var(--orange)] text-white rounded-xl text-xs font-bold">
                      Prescription: Use Pattern Jamming to disrupt the system&apos;s
                      extraction of your energy.
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-xl font-black text-[var(--emerald)] mb-3 leading-tight">
                      System integrity maintained.
                    </h4>
                    <p className="text-[var(--emerald)]/80 text-sm mb-5">
                      Your Operator capabilities match your Observer inputs. The
                      network remains robust against localized stress.
                    </p>
                    <div className="p-3 bg-[var(--emerald)] text-white rounded-xl text-xs font-bold">
                      Prescription: Maintain operational tempo. Monitor for
                      external tipping points.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NATHAN LAZAR HOOK: BIOLOGICAL LINEAGE */}
      <footer className="max-w-2xl mx-auto px-5 mt-24">
        <div className="border-t border-border pt-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[var(--slate-950)] text-white rounded-full flex items-center justify-center">
              <Dna size={18} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              The Biological Lineage of Cognitive Networks
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Dr. Nathan Lazar&apos;s pioneering work in computational biology at
              Recursion Pharmaceuticals demonstrated how biological
              networks—specifically gene expression and morphology—can be mapped
              to understand how cellular systems undergo phase transitions under
              targeted perturbations.
            </p>
            <p className="text-base font-medium text-foreground border-l-4 border-[var(--slate-950)] pl-4 py-2">
              Our engine asks a radical question: Do the same laws of physics
              apply to human institutions?
            </p>
            <p>
              We are transitioning the mathematics of{" "}
              <em>Computational Biology</em> into{" "}
              <em>Computational Sociology</em>. If we can use perturbative maps
              to predict when a cell will shatter under stress, we can
              mathematically predict when a title chain, a workplace architecture,
              or a family system will experience systemic collapse.
            </p>

            <div className="mt-6 p-5 bg-muted rounded-2xl border border-border inline-block">
              <p className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                Open Invitation{" "}
                <ArrowRight size={14} className="text-[var(--indigo)]" />
              </p>
              <p className="text-sm mt-2">
                We invite Dr. Lazar and the broader complexity science community
                to review our{" "}
                <strong className="text-foreground">
                  Cognitive Stress Parameter
                </strong>
                .
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
