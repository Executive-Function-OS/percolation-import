import type { PercolationPoint, PercolationResult } from "./types";
import Graph from "graphology";
import { connectedComponents } from "graphology-components";

function giantFraction(
  graph: Graph,
  nodeIds: string[],
  active: Set<string>,
  nOriginal: number
): number {
  if (active.size === 0 || nOriginal === 0) return 0;
  const sub = new Graph({ type: "undirected" });
  for (const id of active) sub.addNode(id);
  graph.forEachEdge((_edge, _attr, a, b) => {
    if (active.has(a) && active.has(b)) {
      if (!sub.hasEdge(a, b)) sub.addEdge(a, b);
    }
  });
  const comps = connectedComponents(sub);
  const gcc = Math.max(...comps.map((c) => c.length));
  return gcc / nOriginal;
}

/**
 * Random node removal percolation experiment (median over repetitions).
 */
export function simulatePercolation(
  graph: Graph,
  nodeIds: string[],
  repetitions = 12
): PercolationResult {
  const n = nodeIds.length;
  if (n === 0) {
    return {
      curve: [],
      criticalThreshold: 0,
      fragility: 0,
      fragmentation: 1,
    };
  }

  const activeAll = new Set(nodeIds);
  const initial = giantFraction(graph, nodeIds, activeAll, n);

  const fractions = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];

  const curve: PercolationPoint[] = fractions.map((f) => {
    const trials: number[] = [];
    const removeCount = Math.min(n - 1, Math.floor(f * n));
    for (let r = 0; r < repetitions; r++) {
      const order = [...nodeIds].sort(() => Math.random() - 0.5);
      const keep = new Set(order.slice(removeCount));
      trials.push(giantFraction(graph, nodeIds, keep, n));
    }
    trials.sort((a, b) => a - b);
    const med = trials[Math.floor(trials.length / 2)];
    return { fractionRemoved: f, giantComponentFraction: med };
  });

  const ref = initial || 1;
  let critical = 0.95;
  for (const p of curve) {
    if (p.giantComponentFraction < 0.5 * ref) {
      critical = p.fractionRemoved;
      break;
    }
  }

  const fragility = critical > 1e-6 ? Math.min(10, 1 / critical) : 10;
  const fragmentation = 1 - initial;

  return { curve, criticalThreshold: critical, fragility, fragmentation };
}
