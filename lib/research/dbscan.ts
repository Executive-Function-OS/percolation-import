import type { DbscanResult } from "./types";
import { mean } from "mathjs";

const NOISE = -1;
const UNSET = -2;

function euclidean(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

function regionQuery(points: number[][], p: number, eps: number): number[] {
  const nb: number[] = [];
  for (let i = 0; i < points.length; i++) {
    if (euclidean(points[p], points[i]) <= eps) nb.push(i);
  }
  return nb;
}

/**
 * Classic DBSCAN. Returns label per point; -1 = noise.
 * Density-based behavioral modes (computational biology collaborator suggestion).
 */
export function dbscan(points: number[][], eps: number, minPts: number): number[] {
  const n = points.length;
  if (n === 0) return [];
  const labels = new Array<number>(n).fill(UNSET);
  const visited = new Array<boolean>(n).fill(false);
  let clusterId = 0;

  const expandCluster = (p: number, neighbors: number[], cid: number) => {
    labels[p] = cid;
    const seeds = [...neighbors];
    for (let s = 0; s < seeds.length; s++) {
      const q = seeds[s];
      if (!visited[q]) {
        visited[q] = true;
        const n2 = regionQuery(points, q, eps);
        if (n2.length >= minPts) {
          for (const o of n2) if (!seeds.includes(o)) seeds.push(o);
        }
      }
      if (labels[q] === NOISE || labels[q] === UNSET) labels[q] = cid;
    }
  };

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = true;
    const neighbors = regionQuery(points, i, eps);
    if (neighbors.length < minPts) {
      labels[i] = NOISE;
      continue;
    }
    expandCluster(i, neighbors, clusterId);
    clusterId++;
  }

  for (let i = 0; i < n; i++) {
    if (labels[i] === UNSET) labels[i] = NOISE;
  }
  return labels;
}

function silhouetteForLabels(points: number[][], labels: number[]): number {
  const n = points.length;
  if (n < 2) return 0;
  const clusters = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const L = labels[i];
    if (L < 0) continue;
    if (!clusters.has(L)) clusters.set(L, []);
    clusters.get(L)!.push(i);
  }
  if (clusters.size < 2) return 0;

  let sum = 0;
  let counted = 0;
  for (let i = 0; i < n; i++) {
    const own = labels[i];
    if (own < 0) continue;
    const same = clusters.get(own)!.filter((j) => j !== i);
    const ai =
      same.length === 0
        ? 0
        : (mean(same.map((j) => euclidean(points[i], points[j]))) as number);

    let bi = Infinity;
    for (const [k, members] of clusters) {
      if (k === own) continue;
      if (members.length === 0) continue;
      const dist = mean(members.map((j) => euclidean(points[i], points[j]))) as number;
      bi = Math.min(bi, dist);
    }
    if (!Number.isFinite(bi)) continue;
    const denom = Math.max(ai, bi) || 1;
    sum += (bi - ai) / denom;
    counted++;
  }
  return counted ? sum / counted : 0;
}

/**
 * Grid-search eps to maximize silhouette among configs with ≥2 clusters.
 */
export function autoTuneDbscan(
  points: number[][],
  minSamples: number,
  epsCandidates: number[]
): DbscanResult {
  if (points.length < minSamples * 2) {
    const labels = points.map(() => 0);
    return {
      labels,
      epsUsed: epsCandidates[0] ?? 0.5,
      minSamples,
      noiseRatio: 0,
      clusterCount: 1,
      silhouette: 0,
    };
  }

  let best: DbscanResult | null = null;
  for (const eps of epsCandidates) {
    const labels = dbscan(points, eps, minSamples);
    const clusterIds = new Set(labels.filter((l) => l >= 0));
    if (clusterIds.size < 2) continue;
    const sil = silhouetteForLabels(points, labels);
    const noise = labels.filter((l) => l < 0).length;
    const cand: DbscanResult = {
      labels,
      epsUsed: eps,
      minSamples,
      noiseRatio: noise / labels.length,
      clusterCount: clusterIds.size,
      silhouette: sil,
    };
    if (!best || sil > best.silhouette) best = cand;
  }
  if (!best) {
    const eps = epsCandidates[Math.floor(epsCandidates.length / 2)] ?? 0.5;
    const labels = dbscan(points, eps, minSamples);
    const clusterIds = new Set(labels.filter((l) => l >= 0));
    return {
      labels,
      epsUsed: eps,
      minSamples,
      noiseRatio: labels.filter((l) => l < 0).length / labels.length,
      clusterCount: Math.max(1, clusterIds.size),
      silhouette: silhouetteForLabels(points, labels),
    };
  }
  return best;
}

export function defaultEpsGrid(): number[] {
  const out: number[] = [];
  for (let e = 0.2; e <= 2.01; e += 0.15) out.push(Number(e.toFixed(3)));
  return out;
}
