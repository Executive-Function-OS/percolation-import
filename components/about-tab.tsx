"use client";

import { Brain, Eye, GitBranch, Zap, Network, TrendingUp, AlertTriangle } from "lucide-react";

export default function AboutTab() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--cyan-dim)] flex items-center justify-center">
            <Network className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">What is Percolation Theory?</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Percolation theory is a branch of mathematics and statistical physics that studies the behavior of connected clusters in random graphs or networks. Originally developed to model fluid flow through porous materials, it has found applications in epidemiology, network science, and cognitive systems.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          In this tool, we apply percolation concepts to analyze <span className="text-primary font-medium">cognitive workflow patterns</span> by treating file interactions as a network where connections form and strengthen over time.
        </p>
      </section>

      {/* Observer-Operator Model */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--cyan-dim)] flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Observer-Operator Model</h2>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-1.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Observer Nodes (Cyan)</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Represent passive file interactions: viewing, opening, reading. These nodes indicate information consumption without modification.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-3 h-3 rounded-full bg-accent shrink-0 mt-1.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Operator Nodes (Orange)</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Represent active file interactions: editing, saving, exporting, creating. These nodes indicate productive work and content generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--orange-dim)] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Key Metrics Explained</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
              <p className="text-sm font-semibold text-foreground">Fragmentation</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Measures how scattered your work is across disconnected file clusters. High fragmentation suggests context-switching overhead and potential workflow inefficiency. Range: 0 (fully connected) to 1 (completely fragmented).
            </p>
          </div>
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Kappa (Coupling)</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The observer-operator coupling coefficient. Measures how well viewing activities translate into productive editing. High kappa indicates efficient information-to-action conversion. Ideal range: 0.4-0.7.
            </p>
          </div>
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-[var(--success)]" />
              <p className="text-sm font-semibold text-foreground">P-infinity</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The probability that a random node belongs to the giant connected component. High P-infinity means most of your work is interconnected. Low values indicate isolated work silos. Target: greater than 0.5 for cohesive workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Spawning Detection */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--green-dim)] flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-[var(--success)]" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Spawning Detection</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The spawning detector identifies files that have &quot;spawned&quot; multiple versions or copies. This is a common pattern in knowledge work where documents evolve through iterations.
        </p>
        <div className="bg-background rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">How it works:</span> Files are grouped by semantic similarity using string matching on filenames. Clusters with multiple related files are flagged, with severity based on the number of spawned versions and their naming patterns.
          </p>
        </div>
      </section>

      {/* Attribution */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--cyan-dim)] flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Research Foundation</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          This tool builds on insights from <span className="text-foreground font-medium">Nathan Lazar, PhD</span> (Computational Biology) regarding the application of clustering methods and percolation theory to cognitive network analysis.
        </p>
        <blockquote className="border-l-2 border-primary pl-4 py-2 bg-background rounded-r-lg">
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            &quot;Percolation theory adds what clustering can&apos;t: a continuous stress parameter that predicts when the whole system tips.&quot;
          </p>
        </blockquote>
      </section>

      {/* Use Cases */}
      <section className="bg-card rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold text-foreground mb-4">Practical Applications</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-primary font-medium">1.</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Workflow Optimization:</span> Identify fragmented work patterns and consolidate related tasks.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-medium">2.</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Knowledge Management:</span> Detect file sprawl and version proliferation before it becomes unmanageable.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-medium">3.</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Productivity Analysis:</span> Track observer-to-operator ratios to measure information-to-action efficiency.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-medium">4.</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Team Collaboration:</span> Understand how work clusters form and identify isolated contributors.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
