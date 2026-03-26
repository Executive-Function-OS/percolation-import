import type {
  ClusterInterpretation,
  DbscanResult,
  EngineAnalysis,
  ExpertOptions,
  NormalizedActivity,
  PreprocessOptions,
} from "./types";
import { filterActivities, buildWindowFeatures, standardizeFeatureMatrix } from "./features";
import { autoTuneDbscan, dbscan, defaultEpsGrid } from "./dbscan";
import { buildWindowGraph, graphMetrics } from "./graphAnalysis";
import { simulatePercolation } from "./percolationSim";
import { classifySystem, computeCoupling } from "./classify";
import { DEMO_EVENTS } from "@/lib/percolation";
import { formatISO } from "date-fns";

function tokenizeFileName(name: string): string[] {
  return name
    .replace(/\.[^.]+$/, "")
    .split(/[\s/_\-]+/)
    .map((s) => s.toLowerCase())
    .filter((s) => s.length > 2)
    .slice(0, 12);
}

function topKeywordsForCluster(
  windows: { fileIds: Set<string> }[],
  labels: number[],
  clusterId: number,
  idToName: Map<string, string>
): string[] {
  const freq = new Map<string, number>();
  for (let i = 0; i < windows.length; i++) {
    if (labels[i] !== clusterId) continue;
    for (const fid of windows[i].fileIds) {
      const name = idToName.get(fid) ?? fid;
      for (const tok of tokenizeFileName(name)) {
        freq.set(tok, (freq.get(tok) ?? 0) + 1);
      }
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
}

/** Rolling std of array */
function rollingStd(values: number[], win: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - win + 1);
    const slice = values.slice(start, i + 1);
    const m = slice.reduce((a, b) => a + b, 0) / slice.length;
    const v =
      slice.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, slice.length - 1);
    out.push(Math.sqrt(v));
  }
  return out;
}

/**
 * Approximates observer–operator lag from daily “awareness” (fragmentation proxy) vs “action” dips.
 */
export function estimateObserverOperatorLagDays(events: NormalizedActivity[]): number {
  if (events.length < 20) return 2.5;
  const byDay = new Map<string, NormalizedActivity[]>();
  for (const e of events) {
    const d = formatISO(new Date(e.t), { representation: "date" });
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(e);
  }
  const days = [...byDay.keys()].sort();
  if (days.length < 8) return 2.5;

  const spread: number[] = [];
  const actions: number[] = [];
  for (const d of days) {
    const evs = byDay.get(d)!;
    const files = new Set(evs.map((x) => x.fileId));
    actions.push(evs.length);
    spread.push(files.size / Math.max(1, evs.length));
  }

  const stdSpread = rollingStd(spread, 7);
  const meanAct = actions.reduce((a, b) => a + b, 0) / actions.length;
  const sAct = Math.sqrt(
    actions.reduce((s, x) => s + (x - meanAct) ** 2, 0) / Math.max(1, actions.length - 1)
  );

  const awarenessIdx: number[] = [];
  const actionIdx: number[] = [];
  const ms = meanAct + 1e-6;
  for (let i = 1; i < days.length; i++) {
    if (stdSpread[i] > 0.15 && stdSpread[i] > (stdSpread[i - 1] ?? 0)) awarenessIdx.push(i);
    if (actions[i] < meanAct - 0.5 * sAct) actionIdx.push(i);
  }

  if (!awarenessIdx.length || !actionIdx.length) return 2.5;
  const lags: number[] = [];
  for (const a of awarenessIdx) {
    const next = actionIdx.find((x) => x > a);
    if (next !== undefined) lags.push(next - a);
  }
  if (!lags.length) return 2.5;
  return lags.reduce((s, x) => s + x, 0) / lags.length;
}

export function eventsFromDemo(): NormalizedActivity[] {
  return DEMO_EVENTS.map((e) => ({
    t: new Date(e.timestamp.replace(" ", "T")).getTime(),
    action: e.action,
    fileId: e.file_id,
    fileName: e.file_name,
  }));
}

export function summarizeEvents(events: NormalizedActivity[]): EngineAnalysis["summary"] {
  if (events.length === 0) {
    return {
      totalActivities: 0,
      uniqueFiles: 0,
      startDate: "—",
      endDate: "—",
      actionsPerDay: 0,
      dataQualityScore: 0,
    };
  }
  const files = new Set(events.map((e) => e.fileId));
  const ts = events.map((e) => e.t).sort((a, b) => a - b);
  const spanDays = Math.max(1, (ts[ts.length - 1] - ts[0]) / (86400 * 1000));
  const daysWithActivity = new Set(events.map((e) => formatISO(new Date(e.t), { representation: "date" })))
    .size;
  const calendarDays = Math.ceil(spanDays);
  const dataQualityScore = Math.min(100, Math.round((daysWithActivity / Math.max(1, calendarDays)) * 100));

  return {
    totalActivities: events.length,
    uniqueFiles: files.size,
    startDate: formatISO(new Date(ts[0]), { representation: "date" }),
    endDate: formatISO(new Date(ts[ts.length - 1]), { representation: "date" }),
    actionsPerDay: events.length / spanDays,
    dataQualityScore,
  };
}

/**
 * End-to-end BMS 4.0 analysis (runs fully in the browser).
 */
export function runEngineAnalysis(
  rawEvents: NormalizedActivity[],
  preprocess: PreprocessOptions,
  expert: ExpertOptions
): EngineAnalysis {
  const filtered = filterActivities(rawEvents, preprocess);
  const summary = summarizeEvents(filtered);
  const windows = buildWindowFeatures(filtered, expert.binHours);

  if (windows.length === 0) {
    const classification = classifySystem(1, 0, 0, 2.5);
    return {
      summary,
      windows: [],
      dbscan: {
        labels: [],
        epsUsed: expert.dbscanEps ?? 0.5,
        minSamples: expert.dbscanMinSamples,
        noiseRatio: 0,
        clusterCount: 0,
        silhouette: 0,
      },
      clusterInterpretations: [],
      network: {
        nodeCount: 0,
        edgeCount: 0,
        avgDegree: 0,
        density: 0,
        clusteringCoefficient: 0,
        avgEdgeWeight: 0,
        giantComponentFraction: 0,
      },
      percolation: {
        curve: [],
        criticalThreshold: 0,
        fragility: 0,
        fragmentation: 1,
      },
      classification: { ...classification, chaosScore: 0 },
      distanceToPercolationThreshold: 0,
    };
  }

  const matrix = standardizeFeatureMatrix(windows);

  let dbscanResult: DbscanResult;
  const manualEps =
    expert.dbscanEps != null && Number.isFinite(expert.dbscanEps) ? expert.dbscanEps : null;
  if (manualEps != null) {
    const labels = dbscan(matrix, manualEps, expert.dbscanMinSamples);
    dbscanResult = {
      labels,
      epsUsed: manualEps,
      minSamples: expert.dbscanMinSamples,
      noiseRatio: labels.length ? labels.filter((l) => l < 0).length / labels.length : 0,
      clusterCount: Math.max(1, new Set(labels.filter((l) => l >= 0)).size),
      silhouette: 0,
    };
  } else {
    dbscanResult = autoTuneDbscan(matrix, expert.dbscanMinSamples, defaultEpsGrid());
  }

  const idToName = new Map<string, string>();
  for (const e of filtered) idToName.set(e.fileId, e.fileName);

  const clusterIds = [...new Set(dbscanResult.labels.filter((l) => l >= 0))].sort((a, b) => a - b);
  const clusterInterpretations: ClusterInterpretation[] = clusterIds.map((id) => ({
    id,
    keywords: topKeywordsForCluster(windows, dbscanResult.labels, id, idToName),
  }));

  const { graph, nodeIds } = buildWindowGraph(windows, dbscanResult.labels, expert.similarityLag);
  const net = graphMetrics(graph, nodeIds);
  const perc = simulatePercolation(graph, nodeIds);

  const meanSunk =
    windows.length > 0
      ? windows.reduce((s, w) => s + w.sunkCostIndex, 0) / windows.length
      : 0;
  const meanSunkNorm = meanSunk / Math.max(1e-6, ...windows.map((w) => w.sunkCostIndex));

  const coupling = computeCoupling(net.avgEdgeWeight, net.density, meanSunkNorm);
  const spawningRate = dbscanResult.noiseRatio;
  const lagDays = estimateObserverOperatorLagDays(filtered);

  const classification = classifySystem(
    perc.fragmentation,
    coupling,
    spawningRate,
    lagDays
  );

  const distanceToPercolationThreshold = Math.max(
    0,
    Math.min(1, perc.criticalThreshold - perc.fragmentation)
  );

  return {
    graph,
    nodeIds,
    summary,
    windows,
    dbscan: dbscanResult,
    clusterInterpretations,
    network: net,
    percolation: perc,
    classification,
    distanceToPercolationThreshold,
  };
}
