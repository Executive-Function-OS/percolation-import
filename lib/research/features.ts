import type { NormalizedActivity, PreprocessOptions, WindowFeatures } from "./types";
import { mean, std } from "mathjs";

/**
 * Filters activities by preprocessing options.
 */
export function filterActivities(
  events: NormalizedActivity[],
  opts: PreprocessOptions
): NormalizedActivity[] {
  const now = Date.now();
  const start = now - opts.windowDays * 24 * 60 * 60 * 1000;
  const fileCounts = new Map<string, number>();
  for (const e of events) {
    if (e.t < start || e.t > now) continue;
    fileCounts.set(e.fileId, (fileCounts.get(e.fileId) ?? 0) + 1);
  }
  const allowedFiles = new Set(
    [...fileCounts.entries()]
      .filter(([, c]) => c >= opts.minFileTouches)
      .map(([id]) => id)
  );

  return events.filter((e) => {
    if (e.t < start || e.t > now) return false;
    if (!allowedFiles.has(e.fileId)) return false;
    const a = e.action.toLowerCase();
    if (opts.actionExclude.some((x) => a.includes(x.toLowerCase()))) return false;
    if (opts.actionInclude.length > 0 && !opts.actionInclude.some((x) => a.includes(x.toLowerCase())))
      return false;
    return true;
  });
}

function shannonEntropy(counts: Map<string, number>): number {
  const total = [...counts.values()].reduce((s, v) => s + v, 0);
  if (total === 0) return 0;
  let h = 0;
  for (const c of counts.values()) {
    const p = c / total;
    h -= p * Math.log2(p);
  }
  return h;
}

/**
 * Bins events into fixed-duration windows and computes per-window research metrics.
 */
export function buildWindowFeatures(
  events: NormalizedActivity[],
  binHours: number
): WindowFeatures[] {
  if (events.length === 0) return [];
  const sorted = [...events].sort((a, b) => a.t - b.t);
  const binMs = binHours * 60 * 60 * 1000;
  const t0 = sorted[0].t;
  const t1 = sorted[sorted.length - 1].t;
  const nBins = Math.max(1, Math.ceil((t1 - t0 + 1) / binMs));
  const byBin: NormalizedActivity[][] = Array.from({ length: nBins }, () => []);

  for (const e of sorted) {
    const idx = Math.min(nBins - 1, Math.floor((e.t - t0) / binMs));
    byBin[idx].push(e);
  }

  const windows: WindowFeatures[] = [];
  let prevFiles: Set<string> | null = null;

  for (let i = 0; i < nBins; i++) {
    const slice = byBin[i];
    const startMs = t0 + i * binMs;
    const endMs = startMs + binMs;
    if (slice.length === 0) continue;

    const actionHist = new Map<string, number>();
    const files = new Set<string>();
    let switches = 0;
    let lastId: string | null = null;
    for (const ev of slice) {
      actionHist.set(ev.action, (actionHist.get(ev.action) ?? 0) + 1);
      files.add(ev.fileId);
      if (lastId !== null && ev.fileId !== lastId) switches++;
      lastId = ev.fileId;
    }
    const actionCount = slice.length;
    const switchingRate = actionCount > 1 ? switches / (actionCount - 1) : 0;
    const span = Math.max(1, slice[slice.length - 1].t - slice[0].t);
    const timeInvestedMs = span;
    const actionDiversity = shannonEntropy(actionHist);
    const visitsByFile = new Map<string, number>();
    for (const ev of slice) {
      visitsByFile.set(ev.fileId, (visitsByFile.get(ev.fileId) ?? 0) + 1);
    }
    let sunk = 0;
    for (const c of visitsByFile.values()) {
      sunk += (c * c) / actionCount;
    }
    let coherence = 0;
    if (prevFiles && prevFiles.size > 0 && files.size > 0) {
      let inter = 0;
      for (const f of files) if (prevFiles.has(f)) inter++;
      const union = new Set([...prevFiles, ...files]).size;
      coherence = union > 0 ? inter / union : 0;
    }
    prevFiles = files;

    windows.push({
      index: windows.length,
      startMs,
      endMs,
      actionCount,
      fileCount: files.size,
      switchingRate,
      timeInvestedMs,
      actionDiversity,
      sunkCostIndex: sunk,
      narrativeCoherence: coherence,
      fileIds: files,
    });
  }

  return windows;
}

/**
 * Z-score standardization (column-wise) for DBSCAN input.
 */
export function standardizeFeatureMatrix(windows: WindowFeatures[]): number[][] {
  if (windows.length === 0) return [];
  const raw = windows.map((w) => [
    w.actionCount,
    w.fileCount,
    w.switchingRate,
    Math.log1p(w.timeInvestedMs),
    w.actionDiversity,
    w.sunkCostIndex,
    w.narrativeCoherence,
  ]);
  const cols = raw[0].length;
  const mus: number[] = [];
  const sigs: number[] = [];
  for (let c = 0; c < cols; c++) {
    const col = raw.map((r) => r[c]);
    const m = mean(col) as number;
    const s = (std(col) as number) || 1;
    mus.push(m);
    sigs.push(s);
  }
  return raw.map((row) => row.map((v, c) => (v - mus[c]) / sigs[c]));
}
