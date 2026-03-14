"use client";

import { useState } from "react";
import { Play, FileWarning, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  detectSpawningClusters,
  DEMO_SPAWNING_FILES,
  type SpawnCluster,
} from "@/lib/percolation";

function severityInfo(count: number) {
  if (count >= 5)
    return {
      label: "Critical",
      color: "#EF4444",
      icon: AlertCircle,
      bg: "rgba(239, 68, 68, 0.15)",
    };
  if (count >= 3)
    return {
      label: "Warning",
      color: "#F59E0B",
      icon: AlertTriangle,
      bg: "rgba(245, 158, 11, 0.15)",
    };
  return {
    label: "Info",
    color: "#00D4FF",
    icon: Info,
    bg: "rgba(0, 212, 255, 0.15)",
  };
}

function SpawnClusterCard({ cluster }: { cluster: SpawnCluster }) {
  const severity = severityInfo(cluster.count);
  const Icon = severity.icon;

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: severity.bg }}
          >
            <Icon className="w-4 h-4" style={{ color: severity.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground capitalize">
              {cluster.baseName}
            </p>
            <p className="text-xs text-muted-foreground">
              {cluster.count} versions detected
            </p>
          </div>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider"
          style={{
            color: severity.color,
            backgroundColor: severity.bg,
          }}
        >
          {severity.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {cluster.files.map((file, i) => (
          <span
            key={i}
            className="text-[10px] px-2 py-1 rounded-md bg-[#0F172A] text-muted-foreground border border-border"
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SpawningDetector() {
  const [clusters, setClusters] = useState<SpawnCluster[] | null>(null);
  const [running, setRunning] = useState(false);

  function runDetection() {
    if (running) return;
    setRunning(true);
    setClusters(null);

    setTimeout(() => {
      const detected = detectSpawningClusters(DEMO_SPAWNING_FILES);
      setClusters(detected);
      setRunning(false);
    }, 500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(255,107,43,0.2)] mb-3">
          <span className="text-[10px] font-bold tracking-widest text-[#FF6B2B] uppercase">
            Spawning Detector
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
          File Version Analysis
        </h2>
        <p className="text-sm text-muted-foreground">
          Detect files that have spawned multiple copies or versions
        </p>
      </div>

      {/* Info Card */}
      <div className="flex items-start gap-3 bg-card rounded-xl border border-border p-4">
        <FileWarning className="w-5 h-5 text-[#FF6B2B] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The spawning detector identifies file clusters by normalizing names
            and grouping variants like "Report Copy.docx", "Report_v2.docx",
            "Report (1).docx" under a common base name.
          </p>
        </div>
      </div>

      {/* Run Button */}
      <Button
        onClick={runDetection}
        disabled={running}
        className="w-full bg-[#FF6B2B] hover:bg-[#FF6B2B]/90 text-background font-bold py-6 text-base"
      >
        {running ? (
          <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
        ) : (
          <Play className="w-5 h-5 mr-2" />
        )}
        {running ? "Scanning..." : "Run Spawning Detection"}
      </Button>

      {/* Results */}
      {clusters && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {clusters.length} cluster{clusters.length !== 1 ? "s" : ""} detected
          </p>
          {clusters.map((cluster, i) => (
            <SpawnClusterCard key={i} cluster={cluster} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!clusters && !running && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileWarning className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">
            Run detection to scan for file version clusters
          </p>
        </div>
      )}
    </div>
  );
}
