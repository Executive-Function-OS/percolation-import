import type { ClassificationResult, SystemType } from "./types";

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/**
 * BMS 4.0 system typing and chaos score (research specification).
 */
export function classifySystem(
  fragmentation: number,
  coupling: number,
  spawningRate: number,
  observerOperatorLagDays: number
): ClassificationResult {
  const observerOperatorNormalized = clamp01(observerOperatorLagDays / 14);
  let systemType: SystemType = 1;
  let systemLabel = "Type 1 — Solvable";

  if (fragmentation > 0.85 || coupling > 0.85) {
    systemType = 4;
    systemLabel = "Type 4 — Paradox System";
  } else if (fragmentation > 0.6 && coupling > 0.6) {
    systemType = 3;
    systemLabel = "Type 3 — Fundamentally Corrupted (inverse returns)";
  } else if (fragmentation > 0.35 || coupling > 0.45) {
    systemType = 2;
    systemLabel = "Type 2 — Complex but Navigable";
  }

  const chaosScore =
    (0.35 * fragmentation +
      0.3 * coupling +
      0.2 * spawningRate +
      0.15 * observerOperatorNormalized) *
    100;

  const chaosMargin = 4 + 6 * (1 - clamp01(chaosScore / 100));

  return {
    systemType,
    systemLabel,
    chaosScore,
    chaosMargin,
    coupling,
    fragmentation,
    spawningRate,
    observerOperatorLagDays,
    observerOperatorNormalized,
  };
}

/**
 * Coupling strength: avg edge weight × density × (1 + sunk factor), normalized.
 */
export function computeCoupling(
  avgEdgeWeight: number,
  density: number,
  meanSunkNormalized: number
): number {
  const raw = avgEdgeWeight * density * (1 + meanSunkNormalized);
  return clamp01(raw * 4);
}
