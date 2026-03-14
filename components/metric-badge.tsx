"use client";

import { cn } from "@/lib/utils";

interface MetricBadgeProps {
  value: string;
  label: string;
  sublabel?: string;
  color: string;
}

export default function MetricBadge({
  value,
  label,
  sublabel,
  color,
}: MetricBadgeProps) {
  return (
    <div className="flex-1 relative overflow-hidden rounded-xl border border-border bg-[#0F172A] p-4 flex flex-col items-center">
      {/* Top glow bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: color }}
      />
      <span
        className="text-2xl font-extrabold tracking-tight"
        style={{ color }}
      >
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-center mt-1">
        {label}
      </span>
      {sublabel && (
        <span
          className="text-[9px] font-medium uppercase tracking-wider mt-0.5"
          style={{ color }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
}

export function fragmentColor(frag: number): string {
  if (frag >= 0.8) return "#EF4444"; // red
  if (frag >= 0.5) return "#F59E0B"; // yellow
  return "#10B981"; // green
}

export function fragmentLabel(frag: number): string {
  if (frag >= 0.8) return "Crisis";
  if (frag >= 0.5) return "Fragmented";
  if (frag >= 0.2) return "Partial";
  return "Flow";
}
