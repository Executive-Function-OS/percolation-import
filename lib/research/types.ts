/**
 * Shared types for BMS 4.0 Percolation Engine (client-side research pipeline).
 */

export interface NormalizedActivity {
  /** Unix ms */
  t: number;
  action: string;
  fileId: string;
  fileName: string;
}

export interface PreprocessOptions {
  windowDays: 30 | 60 | 90 | 180;
  /** Minimum file touch count to keep file in graph */
  minFileTouches: number;
  /** Included action substrings; empty = all */
  actionInclude: string[];
  /** Excluded action substrings */
  actionExclude: string[];
}

export interface ExpertOptions {
  binHours: number;
  dbscanEps: number | null;
  dbscanMinSamples: number;
  /** Max lag (windows) for similarity edges */
  similarityLag: number;
}

export interface WindowFeatures {
  index: number;
  startMs: number;
  endMs: number;
  actionCount: number;
  fileCount: number;
  switchingRate: number;
  timeInvestedMs: number;
  actionDiversity: number;
  sunkCostIndex: number;
  narrativeCoherence: number;
  fileIds: Set<string>;
}

export interface DbscanResult {
  labels: number[];
  epsUsed: number;
  minSamples: number;
  noiseRatio: number;
  clusterCount: number;
  silhouette: number;
}

export interface NetworkStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
  density: number;
  clusteringCoefficient: number;
  avgEdgeWeight: number;
  giantComponentFraction: number;
}

export interface PercolationPoint {
  fractionRemoved: number;
  giantComponentFraction: number;
}

export interface PercolationResult {
  curve: PercolationPoint[];
  /** Fraction of nodes removed at which giant component first drops below 50% of initial (median sim) */
  criticalThreshold: number;
  fragility: number;
  /** Current fragmentation = 1 - giantComponentFraction */
  fragmentation: number;
}

export type SystemType = 1 | 2 | 3 | 4;

export interface ClassificationResult {
  systemType: SystemType;
  systemLabel: string;
  chaosScore: number;
  chaosMargin: number;
  coupling: number;
  fragmentation: number;
  spawningRate: number;
  observerOperatorLagDays: number;
  observerOperatorNormalized: number;
}

export interface ClusterInterpretation {
  id: number;
  keywords: string[];
}

import type Graph from "graphology";

export interface EngineAnalysis {
  /** Retained for GraphML export (not JSON-serializable — omit when persisting). */
  graph?: Graph;
  nodeIds?: string[];
  summary: {
    totalActivities: number;
    uniqueFiles: number;
    startDate: string;
    endDate: string;
    actionsPerDay: number;
    dataQualityScore: number;
  };
  windows: WindowFeatures[];
  dbscan: DbscanResult;
  clusterInterpretations: ClusterInterpretation[];
  network: NetworkStats;
  percolation: PercolationResult;
  classification: ClassificationResult;
  /** Distance from current fragmentation to critical threshold (0–1 scale) */
  distanceToPercolationThreshold: number;
}
