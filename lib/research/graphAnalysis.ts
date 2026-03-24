import Graph from "graphology";
import { connectedComponents } from "graphology-components";
import type { WindowFeatures } from "./types";

export interface BuiltGraph {
  graph: Graph;
  nodeIds: string[];
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union > 0 ? inter / union : 0;
}

/**
 * Builds an undirected weighted graph on time windows (percolation substrate).
 * Edges: temporal adjacency, behavioral similarity, topic overlap.
 */
export function buildWindowGraph(
  windows: WindowFeatures[],
  clusterLabels: number[],
  similarityLag: number
): BuiltGraph {
  const graph = new Graph({ type: "undirected", allowSelfLoops: false });
  const n = windows.length;
  const nodeIds = windows.map((_, i) => `w${i}`);

  for (let i = 0; i < n; i++) {
    graph.addNode(nodeIds[i], {
      cluster: clusterLabels[i] ?? -1,
      startMs: windows[i].startMs,
    });
  }

  const maxSunk = Math.max(1e-6, ...windows.map((w) => w.sunkCostIndex));

  const addEdge = (i: number, j: number, baseWeight: number) => {
    if (i === j) return;
    const a = nodeIds[i];
    const b = nodeIds[j];
    const ci = clusterLabels[i] ?? -1;
    const cj = clusterLabels[j] ?? -1;
    const clusterMatch = ci >= 0 && ci === cj ? 1 : 0.35;
    const sunk =
      0.5 * (windows[i].sunkCostIndex + windows[j].sunkCostIndex) / maxSunk;
    const w = baseWeight * clusterMatch * (1 + sunk);
    if (!graph.hasEdge(a, b)) graph.addEdge(a, b, { weight: w });
    else {
      const prev = graph.getEdgeAttribute(a, b, "weight") as number;
      graph.setEdgeAttribute(a, b, "weight", Math.max(prev, w));
    }
  };

  for (let i = 0; i < n - 1; i++) addEdge(i, i + 1, 1);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < Math.min(n, i + 1 + similarityLag); j++) {
      if (clusterLabels[i] >= 0 && clusterLabels[i] === clusterLabels[j]) {
        addEdge(i, j, 0.55);
      }
      const jac = jaccard(windows[i].fileIds, windows[j].fileIds);
      if (jac > 0.2) addEdge(i, j, 0.4 + 0.6 * jac);
    }
  }

  return { graph, nodeIds };
}

export function graphMetrics(graph: Graph, nodeIds: string[]) {
  const n = nodeIds.length;
  if (n === 0) {
    return {
      nodeCount: 0,
      edgeCount: 0,
      avgDegree: 0,
      density: 0,
      clusteringCoefficient: 0,
      avgEdgeWeight: 0,
      giantComponentFraction: 0,
    };
  }

  const comps = connectedComponents(graph);
  const gcc = Math.max(...comps.map((c) => c.length));
  const gccFraction = gcc / n;

  let edgeCount = 0;
  let weightSum = 0;
  graph.forEachEdge((_key, attributes) => {
    edgeCount++;
    weightSum += (typeof attributes.weight === "number" ? attributes.weight : 1);
  });

  const maxEdges = (n * (n - 1)) / 2;
  const density = maxEdges > 0 ? edgeCount / maxEdges : 0;
  const avgDegree = n > 0 ? (2 * edgeCount) / n : 0;
  const avgEdgeWeight = edgeCount > 0 ? weightSum / edgeCount : 0;

  // Local clustering (Watts-Strogatz) sampled
  let cSum = 0;
  let cN = 0;
  for (const id of nodeIds) {
    const neighbors = graph.neighbors(id);
    const k = neighbors.length;
    if (k < 2) continue;
    let links = 0;
    for (let i = 0; i < k; i++) {
      for (let j = i + 1; j < k; j++) {
        if (graph.hasEdge(neighbors[i], neighbors[j])) links++;
      }
    }
    cSum += (2 * links) / (k * (k - 1));
    cN++;
  }
  const clusteringCoefficient = cN > 0 ? cSum / cN : 0;

  return {
    nodeCount: n,
    edgeCount,
    avgDegree,
    density,
    clusteringCoefficient,
    avgEdgeWeight,
    giantComponentFraction: gccFraction,
  };
}
