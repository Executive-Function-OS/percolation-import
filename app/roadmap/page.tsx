import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  FlaskConical,
  Github,
  Globe2,
  Map,
  Microscope,
  Network,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Milestone = {
  quarter: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const YEAR_ONE: Milestone[] = [
  {
    quarter: "Q1",
    title: "Pre-Registration & Lab Partnerships",
    description:
      "Protocol pre-registration on the Open Science Framework (OSF); anchor academic lab partnerships for IRB sponsorship.",
    icon: BookMarked,
  },
  {
    quarter: "Q2",
    title: "External Pilot Cohort",
    description:
      "Recruit the external pilot cohort (N=30–50) via the Participate portal to correlate Fragmentation Scores with BRIEF-A/BDEFS profiles.",
    icon: Users,
  },
  {
    quarter: "Q3",
    title: "Open API Specifications",
    description:
      "Publish open API specifications for custom interaction data adapters.",
    icon: Network,
  },
  {
    quarter: "Q4",
    title: "Independent Security Audit",
    description:
      "Conduct an independent security audit of the browser-based zero-knowledge engine.",
    icon: ShieldCheck,
  },
];

const YEAR_TWO: Milestone[] = [
  {
    quarter: "Q5",
    title: "Multi-Site Data Adapters",
    description:
      "Add data adapters for local filesystems and window tracking services (e.g., RescueTime logs).",
    icon: Globe2,
  },
  {
    quarter: "Q6",
    title: "Clinical Validation Trials",
    description:
      "Launch multi-site clinical validation trials with partner psychiatric clinics.",
    icon: Microscope,
  },
  {
    quarter: "Q7",
    title: "Pipeline Integrations",
    description:
      "Integrate structured EFOS GraphML exports with Python (networkx) and R (igraph) pipelines.",
    icon: FlaskConical,
  },
  {
    quarter: "Q8",
    title: "Peer-Reviewed Publication",
    description:
      "Publish peer-reviewed methodology and validation results in computational psychiatry journals.",
    icon: BookMarked,
  },
];

function MilestoneList({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {milestones.map((m) => (
        <Card key={m.quarter} className="border-border shadow-md">
          <CardHeader className="bg-slate-50/50 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <m.icon className="w-6 h-6 text-brand-blue" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {m.quarter}
              </span>
            </div>
            <CardTitle className="text-lg mt-4">{m.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm text-muted-foreground">
            {m.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function RoadmapPage() {
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
            <Map className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              2-Year Project Roadmap
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-5xl">
            Development & Validation Roadmap
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Our development and validation roadmap is aligned with the Renaissance
            Philanthropy OS4LS Track 1 goals — from protocol pre-registration
            through multi-site clinical validation and peer-reviewed publication.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 relative z-20 space-y-16 -mt-8">
        {/* YEAR ONE */}
        <section>
          <div className="flex items-center gap-3 mb-2 px-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
              1
            </span>
            <h2 className="text-2xl font-bold text-foreground">
              Year 1: Convergent Validation & API Hardening
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 px-1">
            Establishing scientific footing and hardening the platform for external
            partners.
          </p>
          <MilestoneList milestones={YEAR_ONE} />
        </section>

        {/* YEAR TWO */}
        <section>
          <div className="flex items-center gap-3 mb-2 px-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal text-sm font-bold text-white">
              2
            </span>
            <h2 className="text-2xl font-bold text-foreground">
              Year 2: Multi-Site Ingestors & Pipeline Integrations
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 px-1">
            Scaling data ingestion, clinical validation, and downstream research
            tooling.
          </p>
          <MilestoneList milestones={YEAR_TWO} />
        </section>

        {/* FOOTER */}
        <section className="border-t border-border pt-12 text-center">
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl mx-auto">
            This roadmap is a living document. Track progress, open issues, and
            propose changes on the public issue tracker.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/Executive-Function-OS/percolation-import"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-teal/50 bg-brand-teal/5 hover:bg-brand-teal/10 transition-colors text-sm font-semibold text-brand-teal"
            >
              <Github className="w-4 h-4" />
              View Issue Tracker
            </a>
            <Link
              href="/researchers"
              className="px-6 py-2 rounded-full border border-border bg-card hover:bg-slate-50 transition-colors text-sm font-semibold"
            >
              For Researchers
            </Link>
            <Link
              href="/"
              className="px-6 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-colors text-sm font-semibold"
            >
              Back Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
