"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, Pencil } from "lucide-react";
import NetworkGraph from "@/components/network-graph";
import MetricBadge, {
  fragmentColor,
  fragmentLabel,
} from "@/components/metric-badge";
import type {
  PercolationMetrics,
  PercolationNetwork,
} from "@/lib/percolation";
import { DAY_LABELS } from "@/lib/percolation";

interface DayResult {
  day: string;
  metrics: PercolationMetrics;
  network: PercolationNetwork;
}

interface DayCardProps {
  result: DayResult;
  isExpanded: boolean;
  onToggle: () => void;
  graphWidth: number;
}

export default function DayCard({
  result,
  isExpanded,
  onToggle,
  graphWidth,
}: DayCardProps) {
  const { frag, kappa, poo } = result.metrics;
  const fragColor = fragmentColor(frag);

  return (
    <div className="bg-card rounded-2xl border border-border p-4 overflow-hidden transition-all duration-300">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: fragColor }}
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              {DAY_LABELS[result.day]}
            </p>
            <p className="text-xs text-muted-foreground">{result.day}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              color: fragColor,
              borderColor: fragColor,
              backgroundColor: `${fragColor}20`,
            }}
          >
            {fragmentLabel(frag)}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Metrics Row */}
      <div className="flex gap-2 mb-4">
        <MetricBadge
          value={frag.toFixed(2)}
          label="Fragmentation"
          sublabel={frag >= 0.8 ? "Crisis" : undefined}
          color={fragColor}
        />
        <MetricBadge
          value={kappa.toFixed(2)}
          label="Coupling (κ)"
          color="#00D4FF"
        />
        <MetricBadge
          value={poo.toFixed(2)}
          label="P∞"
          color="#10B981"
        />
      </div>

      {/* Expandable Network Graph */}
      <div
        className={`overflow-hidden transition-all duration-350 ease-out ${
          isExpanded ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-foreground">
              Percolation Network
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-[#00D4FF]" />
                <span className="text-[10px] text-muted-foreground">
                  Observer
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Pencil className="w-3 h-3 text-[#FF6B2B]" />
                <span className="text-[10px] text-muted-foreground">
                  Operator
                </span>
              </div>
            </div>
          </div>
          <NetworkGraph
            network={result.network}
            width={graphWidth}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
