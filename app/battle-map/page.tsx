"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Map,
  Target,
  Layers,
  Flame,
  Shield,
  Eye,
  Brain,
  Zap,
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

type Section =
  | "compass"
  | "repatterning"
  | "collective"
  | "postexit"
  | "permissions";

export default function BattleMapNavigator() {
  const [activeSection, setActiveSection] = useState<Section>("compass");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* BACK NAV */}
      <div className="bg-[var(--slate-950)] px-5 py-4">
        <div className="max-w-4xl mx-auto">
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
      <header className="bg-[var(--slate-950)] text-white pt-8 pb-20 px-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Map className="text-[var(--indigo)] w-6 h-6" />
            <h2 className="text-[var(--indigo)] font-bold text-[10px] uppercase tracking-[0.4em]">
              Battle Map System Version 5.0
            </h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            The Terrain Before{" "}
            <span className="text-[var(--indigo)]">the Theory</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            This is the archive of the conceptual system that helped define the territory before it could be modeled computationally. It is an entry point for people who need to recognize the terrain before they can name it.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 -mt-8 relative z-20">
        
        {/* ARCHIVE NOTE / INTRO */}
        <div className="bg-[var(--slate-950)] text-white rounded-2xl p-6 md:p-8 mb-8 shadow-xl border border-[var(--indigo)]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--indigo)]/10 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
          <p className="text-slate-300 mb-6 text-sm md:text-base leading-relaxed">
            <span className="font-bold text-white">Battle Map</span> began as a way to describe, in semantic terms, the internal terrain of strain, fragmentation, and survival. Over time, it became the language layer that made the computational model possible. This page preserves that origin.
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-[var(--emerald)] block mb-1">Core claim:</strong> Sometimes you have to describe the terrain before you can model it. Sometimes the first useful system is the one that helps you recognize your own patterning clearly enough to build something real.
            </p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
            <strong>Archive Note:</strong> This archive mode is not the research preview. It is the older, more dramatic interface: a place for metaphor, origin stories, and earlier frameworks that shaped the current model. Earlier Battle Map versions remain here as conceptual source material, not as the main public interface. Their value is that they helped turn lived experience into modelable structure.
          </p>
        </div>
        {/* SECTION NAV */}
        <div className="bg-card rounded-2xl p-2 flex flex-wrap gap-2 mb-8 shadow-xl border border-border">
          {[
            { id: "compass", label: "Compass", icon: Compass },
            { id: "repatterning", label: "Re-Patterning", icon: Zap },
            { id: "collective", label: "Collective", icon: Users },
            { id: "postexit", label: "Post-Exit", icon: Heart },
            { id: "permissions", label: "Permissions", icon: Shield },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as Section)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeSection === id
                  ? "bg-[var(--slate-950)] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* COMPASS FRAMEWORK */}
        {activeSection === "compass" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                The Compass Framework
              </h3>
              <p className="text-muted-foreground mb-8">
                Static diagnosis is insufficient. Real navigation requires
                continuous reassessment as conditions change. The Compass
                Framework is a four-layer decision matrix that generates
                personalized navigation prescriptions.
              </p>

              {/* Four Layers */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    num: "01",
                    title: "Internal State Assessment",
                    desc: "Map current emotional, cognitive, and physical resources. Your capacity changes daily.",
                    output: "Internal State Score (0-100)",
                    color: "indigo",
                  },
                  {
                    num: "02",
                    title: "External System Assessment",
                    desc: "Classify system type and temperature. Track extraction mechanisms and temporal constraints.",
                    output: "System Profile with Type & Timeline",
                    color: "emerald",
                  },
                  {
                    num: "03",
                    title: "Resource Inventory",
                    desc: "Map financial, time, social, attention, skill, and health resources. Identify critical gaps.",
                    output: "Resource Matrix",
                    color: "orange",
                  },
                  {
                    num: "04",
                    title: "Action Set Selection",
                    desc: "Generate specific action plan based on Layers 1-3. Decision logic matches capacity to strategy.",
                    output: "Navigation Prescription",
                    color: "slate",
                  },
                ].map((layer) => (
                  <div
                    key={layer.num}
                    className={`p-5 rounded-xl border-2 border-[var(--${layer.color})]/20 bg-[var(--${layer.color}-dim)]`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span
                        className={`text-2xl font-black text-[var(--${layer.color})]`}
                      >
                        {layer.num}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm">{layer.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {layer.desc}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Output: {layer.output}
                    </p>
                  </div>
                ))}
              </div>

              {/* Spoon Inventory */}
              <div className="bg-muted rounded-xl p-5 mb-6">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--indigo)]" />
                  Spoon Inventory (from disability activism)
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- How many units of energy available today?</li>
                  <li>- How many committed to survival tasks?</li>
                  <li>- How many available for navigation work?</li>
                </ul>
              </div>

              {/* When to Run Emergency Compass */}
              <div className="bg-[var(--red-dim)] border border-[var(--red)]/30 rounded-xl p-5">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[var(--red)]" />
                  Run Emergency Compass When:
                </h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>- System suddenly degrades</li>
                  <li>- Major resource loss</li>
                  <li>- Internal state crisis</li>
                  <li>- New exit possibilities emerge</li>
                  <li>- Installation capture preventing critical action</li>
                </ul>
              </div>
            </div>

            {/* System Temperature */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-lg font-black uppercase tracking-tight mb-4">
                Layer 2: System Assessment Questions
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-xl">
                  <h5 className="font-bold text-sm mb-2">System Temperature</h5>
                  <p className="text-sm text-muted-foreground">
                    Is system deteriorating, stable, or improving? Has it changed
                    type in past 30 days? Early warning signs visible?
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <h5 className="font-bold text-sm mb-2">Extraction Mechanisms</h5>
                  <p className="text-sm text-muted-foreground">
                    What is system taking? Time, money, emotional energy, health,
                    relationships, autonomy. What is it giving back? Is exchange
                    ratio worsening?
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <h5 className="font-bold text-sm mb-2">Temporal Assessment</h5>
                  <p className="text-sm text-muted-foreground">
                    How long in system? How long survivable at current extraction
                    rate? Realistic exit timeline if started today?
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RE-PATTERNING PROTOCOLS */}
        {activeSection === "repatterning" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                System Re-Patterning Protocols
              </h3>
              <p className="text-muted-foreground mb-6">
                When exit is impossible but transformation is necessary. Create
                agency within systems you cannot escape.
              </p>

              {/* When to Use */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-muted rounded-xl text-center">
                  <CheckCircle className="w-6 h-6 text-[var(--emerald)] mx-auto mb-2" />
                  <p className="text-sm font-bold">Diagnosed Type 3 or 4</p>
                  <p className="text-xs text-muted-foreground">
                    Corruption is confirmed
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <Clock className="w-6 h-6 text-[var(--orange)] mx-auto mb-2" />
                  <p className="text-sm font-bold">Exit 18+ months away</p>
                  <p className="text-xs text-muted-foreground">
                    Current mode depletes resources
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <Brain className="w-6 h-6 text-[var(--indigo)] mx-auto mb-2" />
                  <p className="text-sm font-bold">Internal State above 40</p>
                  <p className="text-xs text-muted-foreground">
                    Enough capacity to execute
                  </p>
                </div>
              </div>

              {/* Protocols */}
              <div className="space-y-4">
                {[
                  {
                    title: "Protocol 1: Stealth Autonomy",
                    content: (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Create invisible pockets of agency that corrupted systems
                          cannot see or control.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-[var(--indigo-dim)] rounded-lg">
                            <h5 className="font-bold text-sm mb-2">
                              Micro-Boundaries
                            </h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>- Time: No email after 7 PM</li>
                              <li>- Attention: Surface responses outside core</li>
                              <li>- Energy: Best hours for own projects</li>
                            </ul>
                          </div>
                          <div className="p-4 bg-[var(--emerald-dim)] rounded-lg">
                            <h5 className="font-bold text-sm mb-2">
                              Hidden Projects
                            </h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>- Side business in hidden time</li>
                              <li>- Skill development for exit</li>
                              <li>- Creative work restoring agency</li>
                            </ul>
                          </div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-2">
                            Psychological Decoupling
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Separate internal identity from system role. System Self
                            performs minimally. Actual Self remains hidden and
                            protected.
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Protocol 2: Pattern Jamming",
                    content: (
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-2">Over-Compliance</h5>
                          <p className="text-xs text-muted-foreground">
                            Follow rules to absurdity to expose dysfunction. Document
                            everything exhaustively.
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-2">
                            Data Transparency
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Make hidden corruption visible through documentation.
                            Track promises vs. delivery.
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-2">
                            Stochastic Behavior
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Introduce unpredictability. Vary response times. Be
                            inconsistently available.
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Protocol 3: Proxy Navigation",
                    content: (
                      <p className="text-sm text-muted-foreground">
                        Use intermediaries to interact with corrupted systems. AI
                        tools handle depleting communications. Human proxies navigate
                        for you. Automation manages repetitive tasks.
                      </p>
                    ),
                  },
                  {
                    title: "Protocol 4: Energy Recycling",
                    content: (
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-2">Trauma Coding</h5>
                          <p className="text-xs text-muted-foreground">
                            Transform corruption into data. Journal dysfunction.
                            Create pattern logs.
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-2">Art as Resistance</h5>
                          <p className="text-xs text-muted-foreground">
                            Channel anger into creative output. Externalize rather
                            than internalize.
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-2">Network Building</h5>
                          <p className="text-xs text-muted-foreground">
                            Use shared experience to build relationships. Create
                            support networks.
                          </p>
                        </div>
                      </div>
                    ),
                  },
                ].map((protocol) => (
                  <div
                    key={protocol.title}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(protocol.title)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors"
                    >
                      <h4 className="font-bold text-sm">{protocol.title}</h4>
                      {expandedItems[protocol.title] ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {expandedItems[protocol.title] && (
                      <div className="p-4 pt-0 border-t border-border">
                        {protocol.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COLLECTIVE NAVIGATION */}
        {activeSection === "collective" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                Collective Navigation Modules
              </h3>
              <p className="text-muted-foreground mb-8">
                Many corrupted systems affect groups. Collective navigation
                accomplishes what individual navigation cannot. Coordinate exits,
                share resources, build power through numbers.
              </p>

              {/* Shared Battle Mapping */}
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-4">
                  Module 1: Shared Battle Mapping
                </h4>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    {
                      step: 1,
                      title: "Convening",
                      desc: "Identify who else sees what you see. Assess trust levels.",
                    },
                    {
                      step: 2,
                      title: "First Meeting",
                      desc: "Establish confidentiality. Each person shares experience.",
                    },
                    {
                      step: 3,
                      title: "Diagnosis",
                      desc: "Each independently classifies system. Compare results.",
                    },
                    {
                      step: 4,
                      title: "Pattern Pooling",
                      desc: "Document extraction mechanisms collectively.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="p-4 bg-muted rounded-xl">
                      <div className="w-8 h-8 bg-[var(--indigo)] text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">
                        {item.step}
                      </div>
                      <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role-Based Allocation */}
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-4">
                  Module 2: Role-Based Resource Allocation
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      role: "Researcher",
                      desc: "Gathers system intelligence. High cognitive capacity. Enjoys analysis.",
                    },
                    {
                      role: "Connector",
                      desc: "Builds external relationships. Identifies allies and opportunities.",
                    },
                    {
                      role: "Documenter",
                      desc: "Maintains detailed records. Keeps collective battle map current.",
                    },
                    {
                      role: "Strategist",
                      desc: "Synthesizes information into action plans. Thinks moves ahead.",
                    },
                    {
                      role: "Support",
                      desc: "Provides emotional stability. Helps members through crisis.",
                    },
                    {
                      role: "Scout",
                      desc: "Tests new strategies at lower risk. Reports back on effectiveness.",
                    },
                  ].map((item) => (
                    <div
                      key={item.role}
                      className="p-4 border border-border rounded-xl"
                    >
                      <h5 className="font-bold text-sm mb-1">The {item.role}</h5>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordinated Exit */}
              <div className="bg-[var(--orange-dim)] border border-[var(--orange)]/30 rounded-xl p-5">
                <h4 className="font-bold text-sm mb-3">
                  Module 3: Coordinated Exit Sequencing
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-bold mb-2">Exit Mapping</h5>
                    <p className="text-xs text-muted-foreground">
                      Who needs to exit first? Most at risk or most prepared. Who
                      should exit last? Most protected or helping others.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-2">Cover and Support</h5>
                    <p className="text-xs text-muted-foreground">
                      Staggered departures 2-4 weeks apart. Consistent but vague
                      explanations. Early exiters provide references.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POST-EXIT INTEGRATION */}
        {activeSection === "postexit" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                Post-Exit Integration
              </h3>
              <p className="text-muted-foreground mb-8">
                The corrupted system provided structure, identity, and meaning
                despite causing harm. When you exit, you lose all of this. The
                freedom is real. The void is also real.
              </p>

              {/* Phases */}
              <div className="space-y-6">
                {[
                  {
                    phase: "Phase 1: Identity Reassembly",
                    time: "Months 1-6",
                    quote:
                      '"I spent 5 years in that role. Now I\'m not that. Who am I?"',
                    items: [
                      {
                        title: "Archaeology of Self",
                        desc: "Who were you before the system? What did you enjoy? What came naturally before performance?",
                      },
                      {
                        title: "Inventory of Current Self",
                        desc: "Who are you right now? What do you actually value? What brings energy vs. depletion?",
                      },
                      {
                        title: "Permission to Be Undefined",
                        desc: 'You don\'t need coherent identity immediately. "I don\'t know yet" is accurate acknowledgment.',
                      },
                    ],
                  },
                  {
                    phase: "Phase 2: Meaning Reconstruction",
                    time: "Months 3-12",
                    quote: null,
                    items: [
                      {
                        title: "Values Clarification",
                        desc: 'Complete: "I feel most alive when..." "Time disappears when I\'m..." "I would do this even if no one knew..."',
                      },
                      {
                        title: "Small Bets Strategy",
                        desc: "Explore meaning without overcommitting. Time-bounded experiments. Multiple simultaneous bets.",
                      },
                    ],
                  },
                  {
                    phase: "Phase 3: Trust Rehabilitation",
                    time: "Months 6-18",
                    quote: null,
                    items: [
                      {
                        title: "Micro-Trust (Months 1-3)",
                        desc: "Make tiny trust commitments. Share minor vulnerability. Accept small help.",
                      },
                      {
                        title: "Incremental Trust (Months 3-9)",
                        desc: "Increase stakes. Join community. Take on collaborative project.",
                      },
                      {
                        title: "System Trust (Months 9-18)",
                        desc: "Engage with larger systems. Enter new workplace. Make longer-term commitments.",
                      },
                    ],
                  },
                ].map((phase) => (
                  <div
                    key={phase.phase}
                    className="border border-border rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold">{phase.phase}</h4>
                      <span className="text-xs font-bold text-[var(--indigo)] bg-[var(--indigo-dim)] px-3 py-1 rounded-full">
                        {phase.time}
                      </span>
                    </div>
                    {phase.quote && (
                      <p className="text-sm italic text-muted-foreground mb-4 border-l-2 border-border pl-4">
                        {phase.quote}
                      </p>
                    )}
                    <div className="grid md:grid-cols-3 gap-4">
                      {phase.items.map((item) => (
                        <div key={item.title} className="p-3 bg-muted rounded-lg">
                          <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Integrated Narrative */}
              <div className="mt-8 p-6 bg-[var(--emerald-dim)] border border-[var(--emerald)]/30 rounded-xl">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--emerald)]" />
                  The Integrated Narrative (Phase 4)
                </h4>
                <p className="text-sm leading-relaxed italic">
                  &quot;I entered a system that appeared functional but was
                  corrupted. I stayed longer than I wish for reasons that made
                  sense given my constraints. I was harmed and developed
                  capabilities. I exited when I could. I learned things I wish I
                  didn&apos;t have to. I am recovering and building something
                  new.&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PERMISSIONS */}
        {activeSection === "permissions" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                The Explicit Permission Structure
              </h3>
              <p className="text-muted-foreground mb-8">
                Users trapped in corrupted systems need explicit permission to
                operate in ways they have been trained to view as wrong. The
                installations will protest. The permission is granted anyway.
              </p>

              <div className="bg-[var(--emerald-dim)] border border-[var(--emerald)]/30 rounded-2xl p-6 mb-8">
                <h4 className="font-black uppercase tracking-wide mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--emerald)]" />
                  You Have Permission To:
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Quit, even though you invested years",
                    "Give minimal effort to systems that deserve minimal effort",
                    "Lie to corrupted systems about your intentions",
                    "Take resources from systems that are taking from you",
                    "Stay in bad situations while looking for better ones",
                    "Do what is necessary rather than what is right",
                    "Prioritize your survival over the system's smooth operation",
                    'Be a "bad employee/student/partner" to bad systems',
                    "Waste the time of people who are wasting yours",
                    "Not try your best",
                    "Give up on things that cannot be fixed",
                    "Pursue your interests instead of your obligations",
                    "Disappoint people who have unreasonable expectations",
                    "Fail to live up to standards you did not agree to",
                    "Be selfish in self-preservation",
                    "Exit without explanation or justification",
                    "Succeed less than you are capable of succeeding",
                    "Let corrupted systems fail",
                    "Stop performing conscientiousness for systems that don't reward it",
                  ].map((permission) => (
                    <div
                      key={permission}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-[var(--emerald)] shrink-0 mt-0.5" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shame-Override Language */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Shame-Override Language Set</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  For users whose Substrate Installations produce overwhelming
                  shame about staying in diagnosed corrupted systems:
                </p>

                {[
                  {
                    replace:
                      '"I should exit but I\'m not, which proves I\'m the problem"',
                    with: '"I see the system is corrupted. I am not yet able to exit. This gap is data about installation strength, not evidence of my deficiency."',
                  },
                  {
                    replace: '"Everyone else would have left by now"',
                    with: '"I do not know what everyone else would do. I know what I am currently capable of doing, and I am doing it."',
                  },
                  {
                    replace: '"I\'m wasting my life in this corrupted system"',
                    with: '"I am surviving a corrupted system while building capacity to exit it. Survival is not waste."',
                  },
                  {
                    replace:
                      '"I must be getting something out of staying or I would leave"',
                    with: '"I am operated by installations that prevent exit. This is not evidence of hidden benefit. This is evidence of installation strength."',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 border border-border rounded-xl">
                    <div className="flex items-start gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-[var(--red)] shrink-0 mt-0.5" />
                      <p className="text-sm line-through text-muted-foreground">
                        {item.replace}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-[var(--emerald)] shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{item.with}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Truth */}
            <div className="bg-[var(--slate-950)] text-white rounded-2xl p-8 text-center">
              <Lightbulb className="w-10 h-10 text-[var(--indigo)] mx-auto mb-4" />
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">
                The Core Truth
              </h4>
              <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto">
                You are navigating systems that were not designed for your
                flourishing. Some systems are corrupted deliberately. Some degraded
                over time. Some were functional once and are not anymore.
                <br />
                <br />
                <strong className="text-white">
                  This framework does not fix those systems. It helps you survive
                  them and, when possible, escape them.
                </strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
