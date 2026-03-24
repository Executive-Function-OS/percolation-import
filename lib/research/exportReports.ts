import type { EngineAnalysis, NormalizedActivity } from "./types";
import { jsPDF } from "jspdf";
import Papa from "papaparse";
import Graph from "graphology";

/**
 * Builds a minimal GraphML string for external tools (Cytoscape, Gephi, etc.).
 */
export function toGraphML(graph: Graph, title: string): string {
  const nodes: string[] = [];
  const edges: string[] = [];
  graph.forEachNode((id, attr) => {
    nodes.push(
      `  <node id="${escapeXml(id)}"><data key="cluster">${(attr as { cluster?: number }).cluster ?? ""}</data></node>`
    );
  });
  let eid = 0;
  graph.forEachEdge((key, attr, source, target) => {
    const w = (attr as { weight?: number }).weight ?? 1;
    edges.push(
      `  <edge id="e${eid++}" source="${escapeXml(source)}" target="${escapeXml(target)}"><data key="weight">${w}</data></edge>`
    );
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <key id="cluster" for="node" attr.name="cluster" attr.type="int"/>
  <key id="weight" for="edge" attr.name="weight" attr.type="double"/>
  <graph id="${escapeXml(title)}" edgedefault="undirected">
${nodes.join("\n")}
${edges.join("\n")}
  </graph>
</graphml>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function exportGraphMLDocument(analysis: EngineAnalysis, title = "bms40_network") {
  if (!analysis.graph) return;
  const xml = toGraphML(analysis.graph, title);
  downloadText("bms40_network.graphml", xml, "application/xml");
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRawActivitiesCsv(events: NormalizedActivity[]) {
  const rows = events.map((e) => ({
    timestamp_iso: new Date(e.t).toISOString(),
    action: e.action,
    file_id: e.fileId,
    file_name: e.fileName,
  }));
  downloadText("bms40_raw_activities.csv", Papa.unparse(rows), "text/csv");
}

export function exportTimeSeriesCsv(analysis: EngineAnalysis) {
  const rows = analysis.windows.map((w, i) => ({
    window_index: i,
    start_iso: new Date(w.startMs).toISOString(),
    end_iso: new Date(w.endMs).toISOString(),
    action_count: w.actionCount,
    file_count: w.fileCount,
    switching_rate: w.switchingRate,
    action_diversity: w.actionDiversity,
    sunk_cost_index: w.sunkCostIndex,
    narrative_coherence: w.narrativeCoherence,
    cluster: analysis.dbscan.labels[i] ?? -1,
  }));
  const csv = Papa.unparse(rows);
  downloadText("bms40_time_series.csv", csv, "text/csv");
}

export function exportClustersJson(analysis: EngineAnalysis) {
  const payload = {
    eps: analysis.dbscan.epsUsed,
    minSamples: analysis.dbscan.minSamples,
    noiseRatio: analysis.dbscan.noiseRatio,
    interpretations: analysis.clusterInterpretations,
    labels: analysis.dbscan.labels,
  };
  downloadText("bms40_dbscan_clusters.json", JSON.stringify(payload, null, 2), "application/json");
}

export function exportPdfReport(analysis: EngineAnalysis) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;
  const line = (t: string, size = 11) => {
    doc.setFontSize(size);
    doc.text(t, margin, y);
    y += size + 6;
    if (y > 780) {
      doc.addPage();
      y = margin;
    }
  };

  line("BMS 4.0 Percolation Engine — Research Summary", 14);
  line(`Generated: ${new Date().toISOString()}`, 9);
  y += 8;
  line(`System: ${analysis.classification.systemLabel}`);
  line(`Chaos score: ${analysis.classification.chaosScore.toFixed(1)} ± ${analysis.classification.chaosMargin.toFixed(1)}`);
  line(`Fragmentation: ${(analysis.classification.fragmentation * 100).toFixed(1)}%`);
  line(`Coupling (norm.): ${analysis.classification.coupling.toFixed(3)}`);
  line(`Activities: ${analysis.summary.totalActivities} | Files: ${analysis.summary.uniqueFiles}`);
  line(`Span: ${analysis.summary.startDate} → ${analysis.summary.endDate}`);
  line(`Data quality: ${analysis.summary.dataQualityScore}%`);
  y += 8;
  line("Network statistics", 12);
  line(`Nodes: ${analysis.network.nodeCount} | Edges: ${analysis.network.edgeCount}`);
  line(`Density: ${analysis.network.density.toFixed(4)} | Avg degree: ${analysis.network.avgDegree.toFixed(2)}`);
  line(`Giant component: ${(analysis.network.giantComponentFraction * 100).toFixed(1)}%`);
  y += 8;
  line("Percolation", 12);
  line(`Critical removal fraction ~ ${(analysis.percolation.criticalThreshold * 100).toFixed(0)}%`);
  line(`Fragility index: ${analysis.percolation.fragility.toFixed(2)}`);
  doc.save("bms40_report.pdf");
}
