"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Activity,
  Brain,
  Network,
  ArrowRight,
  Map,
  Shield,
  Zap,
  Target,
  Eye,
  Flame,
  Layers,
} from "lucide-react";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--indigo-dim)]">
      {/* HERO */}
      <header className="bg-[var(--slate-950)] text-white pt-20 pb-32 px-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
          }}
        />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--indigo)]/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--emerald)]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-8">
            <Compass className="text-[var(--indigo)] w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
              Navigation Framework for Corrupted Systems
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
            Your System Isn&apos;t{" "}
            <span className="text-[var(--indigo)]">Broken.</span>
            <br />
            <span className="text-slate-400 text-3xl md:text-5xl">
              You&apos;re Running the Wrong Software.
            </span>
          </h1>

          <p className="text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto mb-12">
            A unified framework for diagnosing corrupted systems, mapping cognitive
            stress to biological network phase transitions, and navigating exit
            when optimization fails.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/battle-map"
              className="inline-flex items-center gap-2 bg-white text-[var(--slate-950)] px-8 py-4 rounded-full font-black uppercase text-sm tracking-wide hover:bg-slate-100 transition-all active:scale-[0.98] shadow-xl"
            >
              <Map className="w-5 h-5" />
              Enter Battle Map
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/bms"
              className="inline-flex items-center gap-2 bg-[var(--indigo)] text-white px-8 py-4 rounded-full font-black uppercase text-sm tracking-wide hover:bg-[var(--indigo)]/90 transition-all active:scale-[0.98] shadow-xl"
            >
              <Activity className="w-5 h-5" />
              BMS 4.0 Protocol
            </Link>
          </div>
        </div>
      </header>

      {/* ENTRY POINTS */}
      <section className="max-w-5xl mx-auto px-5 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* BATTLE MAP SYSTEM */}
          <Link
            href="/battle-map"
            onMouseEnter={() => setHoveredCard("battle-map")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group bg-card rounded-[2rem] p-8 shadow-2xl border border-border hover:border-[var(--indigo)]/50 transition-all hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-[var(--indigo-dim)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--indigo)] transition-colors">
              <Map
                className={`w-7 h-7 transition-colors ${hoveredCard === "battle-map" ? "text-white" : "text-[var(--indigo)]"}`}
              />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">
              Battle Map System
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The complete navigation framework. Diagnose system types, identify
              installations, run the Compass, and execute exit protocols.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-muted px-3 py-1 rounded-full">
                v4.0
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[var(--indigo-dim)] text-[var(--indigo)] px-3 py-1 rounded-full">
                Full Framework
              </span>
            </div>
          </Link>

          {/* BMS 4.0 PROTOCOL */}
          <Link
            href="/bms"
            onMouseEnter={() => setHoveredCard("bms")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group bg-card rounded-[2rem] p-8 shadow-2xl border border-border hover:border-[var(--emerald)]/50 transition-all hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-[var(--emerald-dim)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--emerald)] transition-colors">
              <Activity
                className={`w-7 h-7 transition-colors ${hoveredCard === "bms" ? "text-white" : "text-[var(--emerald)]"}`}
              />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">
              BMS 4.0 Protocol
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Map cognitive stress to biological network phase transitions. Ingest
              your activity data and calculate coupling strength.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-muted px-3 py-1 rounded-full">
                Interactive
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[var(--emerald-dim)] text-[var(--emerald)] px-3 py-1 rounded-full">
                Data Analysis
              </span>
            </div>
          </Link>

          {/* PERCOLATION ENGINE */}
          <Link
            href="/percolation"
            onMouseEnter={() => setHoveredCard("percolation")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group bg-card rounded-[2rem] p-8 shadow-2xl border border-border hover:border-[var(--orange)]/50 transition-all hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-[var(--orange-dim)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--orange)] transition-colors">
              <Network
                className={`w-7 h-7 transition-colors ${hoveredCard === "percolation" ? "text-white" : "text-[var(--orange)]"}`}
              />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">
              Percolation Engine
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Demo visualization with sample data. Explore network fragmentation,
              spawning detection, and Observer-Operator metrics.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-muted px-3 py-1 rounded-full">
                Demo Data
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[var(--orange-dim)] text-[var(--orange)] px-3 py-1 rounded-full">
                Visualization
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* CORE CONCEPTS */}
      <section className="max-w-5xl mx-auto px-5 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            The Four System Types
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not all systems can be solved. Understanding which type you&apos;re in
            determines whether to optimize or exit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--emerald-dim)] rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--emerald)]" />
              </div>
              <div>
                <h4 className="font-black uppercase text-sm">Type 1: Solvable</h4>
                <p className="text-xs text-muted-foreground">
                  Clear variables. Effort correlates with results.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Success is definable and achievable through standard problem-solving.
              Keep optimizing.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--indigo-dim)] rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-[var(--indigo)]" />
              </div>
              <div>
                <h4 className="font-black uppercase text-sm">
                  Type 2: Complex but Navigable
                </h4>
                <p className="text-xs text-muted-foreground">
                  Many variables. Strategy matters.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Probability improves with skill but outcomes aren&apos;t guaranteed.
              Navigate strategically.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-[var(--orange)]/30 bg-[var(--orange-dim)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--orange)] rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-black uppercase text-sm">
                  Type 3: Fundamentally Corrupted
                </h4>
                <p className="text-xs text-[var(--orange)]">
                  Rules change without notice.
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              Effort produces inverse returns. <strong>Exit is the answer</strong>,
              not optimization.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-[var(--red)]/30 bg-[var(--red-dim)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--red)] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-black uppercase text-sm">
                  Type 4: Paradox System
                </h4>
                <p className="text-xs text-[var(--red)]">
                  Every action validates punishment.
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              No-win scenarios by design. <strong>Stop playing entirely.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* INSTALLATION ARCHITECTURE */}
      <section className="bg-[var(--slate-950)] text-white py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              Installation Architecture
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The software running your decisions exists in two tiers. Tier 1 you
              can observe. Tier 2 is the ground you stand on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-[var(--indigo)]" />
                <h3 className="font-black uppercase tracking-wide">
                  Tier 1: Observable
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  {
                    name: "Academic Installation",
                    desc: "Every problem has an answer",
                  },
                  {
                    name: "Trauma Installation",
                    desc: "Hypervigilance for collapse",
                  },
                  {
                    name: "Codependent Installation",
                    desc: "Others' needs before yours",
                  },
                  {
                    name: "Executive Hijack",
                    desc: "Reliance on stimulants for function",
                  },
                ].map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[var(--indigo)] rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-[var(--orange)]/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-[var(--orange)]" />
                <h3 className="font-black uppercase tracking-wide">
                  Tier 2: Substrate (Pre-conscious)
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  {
                    name: "Sunk Cost Installation",
                    desc: '"I invested too much to leave"',
                  },
                  {
                    name: "Meaning Preservation",
                    desc: '"Exit makes past suffering meaningless"',
                  },
                  {
                    name: "Identity Continuity",
                    desc: '"I am who my history says I am"',
                  },
                  {
                    name: "Moral Worth Installation",
                    desc: '"Good people don\'t quit"',
                  },
                  {
                    name: "Future Justification",
                    desc: '"Suffering now will be redeemed later"',
                  },
                ].map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[var(--orange)] rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto">
              <strong className="text-white">The Hypocrisy Paradox:</strong> You
              are not a hypocrite for seeing the corruption and staying anyway. You
              are correctly observing a Tier 1 installation while being operated by
              a Tier 2 installation that is invisible because it is the foundation
              of your observational capacity.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
            Ready to Map Your System?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Choose your entry point based on what you need right now.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/battle-map"
              className="inline-flex items-center gap-2 bg-[var(--slate-950)] text-white px-8 py-4 rounded-full font-black uppercase text-sm tracking-wide hover:bg-black transition-all active:scale-[0.98] shadow-xl"
            >
              <Map className="w-5 h-5" />
              Full Battle Map Framework
            </Link>
            <Link
              href="/percolation"
              className="inline-flex items-center gap-2 bg-muted text-foreground border border-border px-8 py-4 rounded-full font-black uppercase text-sm tracking-wide hover:bg-muted/80 transition-all active:scale-[0.98]"
            >
              <Network className="w-5 h-5" />
              Demo with Sample Data
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-[var(--indigo)]" />
            <span className="font-black uppercase tracking-tight">
              Battle Map System
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            A navigation framework for corrupted systems.
            <br />
            Versions 2.1 through 4.0.
          </p>
        </div>
      </footer>
    </div>
  );
}
