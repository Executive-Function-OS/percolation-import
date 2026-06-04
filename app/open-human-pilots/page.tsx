"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Papa from "papaparse";
import { 
  ArrowLeft, FileText, Database, Compass, Activity, 
  BrainCircuit, Share2, Download, Upload, RefreshCw, 
  Sliders, Link2, HelpCircle, Check, Loader2, Network,
  AlertCircle
} from "lucide-react";
import { formatISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { runEngineAnalysis } from "@/lib/research/pipeline";
import type { EngineAnalysis, NormalizedActivity } from "@/lib/research/types";

// ==========================================
// MOCK / INTERACTIVE OAUTH MODAL WIZARD
// ==========================================
interface OAuthWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: NormalizedActivity[], filename: string) => void;
}

function OAuthWizard({ isOpen, onClose, onSuccess }: OAuthWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const startConnection = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const syncData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  const importFile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/data/rescuetime-n1.csv");
      if (!response.ok) throw new Error("Failed to load CSV");
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const mapped: NormalizedActivity[] = [];
          for (const row of results.data as any[]) {
            if (!row.Date || !row.Time || !row.Activity || !row.Category) continue;
            const t = new Date(`${row.Date}T${row.Time}`).getTime();
            if (isNaN(t)) continue;
            mapped.push({
              t,
              action: row.Category,
              fileId: row.Activity,
              fileName: row.Activity,
            });
          }
          mapped.sort((a, b) => a.t - b.t);
          setLoading(false);
          onSuccess(mapped, "Synced: OpenHumans_RescueTime_Log.csv");
          onClose();
        }
      });
    } catch (e) {
      alert("Error syncing dataset.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-slate-200 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
        <CardHeader>
          <div className="flex items-center gap-2 text-brand-blue mb-1">
            <Link2 className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Open Humans Integration</span>
          </div>
          <CardTitle>Authorize Data Sharing</CardTitle>
          <CardDescription>
            Import your RescueTime window activity logs securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect your account via the Open Humans API. The BMS Percolation Engine processes all logs entirely inside your browser—no data is sent to our servers.
              </p>
              <Button onClick={startConnection} className="w-full bg-brand-blue hover:bg-brand-blue-hover" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Link2 className="w-4 h-4 mr-2" />}
                Connect with Open Humans OAuth
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Successfully authenticated member ID: <b>OH_7392_BMS</b></span>
              </div>
              <p className="text-sm text-slate-600">
                Found the following active data integration exports:
              </p>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex justify-between items-center text-sm">
                <div>
                  <div className="font-semibold">RescueTime Activity Logs</div>
                  <div className="text-xs text-slate-400">90-day retrospective (478 KB)</div>
                </div>
                <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal text-xs font-bold rounded-full">Available</span>
              </div>
              <Button onClick={syncData} className="w-full bg-brand-blue hover:bg-brand-blue-hover" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Request Member Data Stream"}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Stream ready! Datasets match schemas.</span>
              </div>
              <Button onClick={importFile} className="w-full bg-brand-teal text-brand-dark hover:bg-brand-teal/90" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Import & Analyze in Engine"}
              </Button>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// NETWORK GRAPH DRAWER COMPONENT
// ==========================================
interface SVGGraphProps {
  nodes: Record<string, any>;
  edges: any[];
  threshold: number;
}

function SVGNetworkGraph({ nodes, edges, threshold }: SVGGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600;
  const height = 400;

  // Filter edges based on threshold
  const filteredEdges = useMemo(() => {
    return edges.filter(e => e.weight >= threshold);
  }, [edges, threshold]);

  const maxWeight = useMemo(() => {
    if (edges.length === 0) return 1;
    return Math.max(...edges.map(e => e.weight));
  }, [edges]);

  // Compute positions dynamically (ring/circular layout based on chronological windows)
  const layoutNodes = useMemo(() => {
    const list = Object.values(nodes);
    if (list.length === 0) return [];
    
    const padding = 35;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - padding;

    return list.map((node: any, i: number) => {
      const angle = (2 * Math.PI * i) / list.length - Math.PI / 2;
      return {
        ...node,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      };
    });
  }, [nodes]);

  const nodeMap = useMemo(() => {
    const map: Record<string, any> = {};
    layoutNodes.forEach(n => (map[n.id] = n));
    return map;
  }, [layoutNodes]);

  // Handle Union-Find Component sizes for color highlighting
  const unionFindStats = useMemo(() => {
    const parent: Record<string, string> = {};
    layoutNodes.forEach(n => (parent[n.id] = n.id));

    function find(x: string): string {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function union(x: string, y: string) {
      const px = find(x);
      const py = find(y);
      if (px !== py) parent[px] = py;
    }

    filteredEdges.forEach(e => {
      if (parent[e.from] && parent[e.to]) {
        union(e.from, e.to);
      }
    });

    const rootSizes: Record<string, number> = {};
    layoutNodes.forEach(n => {
      const r = find(n.id);
      rootSizes[r] = (rootSizes[r] || 0) + 1;
    });

    const giantRoot = Object.entries(rootSizes).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    
    return { find, giantRoot, rootSizes };
  }, [layoutNodes, filteredEdges]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-4 shadow-inner flex flex-col items-center">
      <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-full border border-slate-800">
        Window Adjacency Network ({layoutNodes.length} bins)
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full max-w-2xl h-auto">
        {/* Draw Edges */}
        {filteredEdges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          
          // Highlight connection if in the Giant component
          const isGiantComp = unionFindStats.find(edge.from) === unionFindStats.giantRoot;
          const strokeCol = isGiantComp ? "rgba(99, 102, 241, 0.25)" : "rgba(100, 116, 139, 0.15)";
          
          return (
            <line
              key={`edge-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={strokeCol}
              strokeWidth={isGiantComp ? 1.5 : 1}
            />
          );
        })}

        {/* Draw Nodes */}
        {layoutNodes.map((node) => {
          const isGcc = unionFindStats.find(node.id) === unionFindStats.giantRoot;
          
          // Color based on cluster label and component state
          let fillCol = "#94A3B8"; // Slate for noise
          if (node.cluster >= 0) {
            const palette = ["#10B981", "#06B6D4", "#F59E0B", "#EF4444", "#8B5CF6"];
            fillCol = palette[node.cluster % palette.length];
          }

          return (
            <g key={node.id} className="transition-all hover:scale-125 cursor-pointer">
              <title>{`Window ID: ${node.id}\nCluster: ${node.cluster < 0 ? 'Noise' : node.cluster}\nDate: ${new Date(node.startMs).toLocaleDateString()}`}</title>
              {isGcc && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={8}
                  fill={fillCol}
                  fillOpacity={0.2}
                  className="animate-ping"
                  style={{ animationDuration: '3s' }}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={isGcc ? 4.5 : 3.5}
                fill={fillCol}
                stroke={isGcc ? "#ffffff" : "transparent"}
                strokeWidth={0.8}
              />
            </g>
          );
        })}
      </svg>
      
      {/* Network Legend */}
      <div className="flex flex-wrap gap-4 mt-2 justify-center text-xs text-slate-400">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Noise</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Cluster 0</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#06B6D4]"></div> Cluster 1</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div> Cluster 2</div>
        <div className="flex items-center gap-1.5"><div className="w-2 /2 border-b border-indigo-400/40"></div> Giant Component Connection</div>
      </div>
    </div>
  );
}

// ==========================================
// HELPERS FOR METADATA DISPLAY
// ==========================================
function StatsCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <Card className={`border-${color}-200/50 bg-${color}-50/30 overflow-hidden relative shadow-md transition-all hover:shadow-lg`}>
      <div className={`absolute -right-4 -top-4 text-${color}-200/20 pointer-events-none`}>
        <Icon size={120} />
      </div>
      <CardContent className="p-6">
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-${color}-100 text-${color}-600`}>
          <Icon size={20} />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h4 className={`text-2xl font-bold text-${color}-950 mb-1`}>{value}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function TimelineBar({ analysis }: { analysis: EngineAnalysis }) {
  const windows = analysis.windows;
  const labels = analysis.dbscan.labels;
  const palette = ["#059669", "#0D9488", "#D97706", "#DC2626", "#1E40AF", "#7C3AED"];
  
  return (
    <div className="flex h-12 w-full overflow-hidden rounded-xl border border-border bg-muted/20 mt-4">
      {windows.map((w, i) => {
        const lab = labels[i] ?? -1;
        const col = lab < 0 ? "#94A3B8" : palette[lab % palette.length];
        return (
          <div
            key={i}
            style={{ width: `${100 / windows.length}%`, backgroundColor: col }}
            className="h-full transition-opacity hover:opacity-80 border-r border-background/20 last:border-0"
            title={`Window ${i}: ${new Date(w.startMs).toLocaleDateString()} - ${lab < 0 ? 'Noise' : 'Cluster ' + lab}`}
          />
        );
      })}
    </div>
  );
}

// ==========================================
// CORE COMPONENT
// ==========================================
export default function RescueTimePilotPage() {
  const [data, setData] = useState<NormalizedActivity[]>([]);
  const [analysis, setAnalysis] = useState<EngineAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom data source metrics
  const [isCustomData, setIsCustomData] = useState(false);
  const [customFilename, setCustomFilename] = useState("");
  const [customSize, setCustomSize] = useState("");
  
  // Interactive control parameters
  const [windowDays, setWindowDays] = useState<30 | 60 | 90 | 180>(90);
  const [binHours, setBinHours] = useState(4);
  const [dbscanEps, setDbscanEps] = useState<number>(0.6);
  const [autoEps, setAutoEps] = useState(true);
  const [dbscanMinSamples, setDbscanMinSamples] = useState(3);
  const [similarityLag, setSimilarityLag] = useState(3);
  const [minFileTouches, setMinFileTouches] = useState(1);
  const [showConfig, setShowConfig] = useState(false);

  // Network filter slider
  const [networkEdgeThreshold, setNetworkEdgeThreshold] = useState(0.4);

  // Modals / Toasts
  const [isOAuthOpen, setIsOAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // file ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadDefaultPilot = async () => {
    setLoading(true);
    setIsCustomData(false);
    try {
      const response = await fetch("/data/rescuetime-n1.csv");
      if (!response.ok) throw new Error("Failed to load CSV data");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const mapped: NormalizedActivity[] = [];
          for (const row of results.data as any[]) {
            if (!row.Date || !row.Time || !row.Activity || !row.Category) continue;
            
            const t = new Date(`${row.Date}T${row.Time}`).getTime();
            if (isNaN(t)) continue;

            mapped.push({
              t,
              action: row.Category,
              fileId: row.Activity,
              fileName: row.Activity,
            });
          }
          
          mapped.sort((a, b) => a.t - b.t);
          setData(mapped);
          setLoading(false);
          showToast("Loaded default RescueTime (n=1) dataset");
        },
        error: (err: any) => {
          setError(err.message);
          setLoading(false);
        }
      });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultPilot();
  }, []);

  // Recalculate analysis when inputs or parameters change
  const currentAnalysis = useMemo(() => {
    if (data.length === 0) return null;
    
    const configData = {
      windowDays,
      minFileTouches,
      actionInclude: [],
      actionExclude: []
    };
    
    const expertData = {
      binHours,
      dbscanEps: autoEps ? null : dbscanEps,
      dbscanMinSamples,
      similarityLag
    };

    try {
      return runEngineAnalysis(data, configData, expertData);
    } catch (err) {
      console.error("Analysis calculation failed", err);
      return null;
    }
  }, [data, windowDays, binHours, dbscanEps, autoEps, dbscanMinSamples, similarityLag, minFileTouches]);

  // Extract Nodes and Edges from Graphology dynamically for rendering
  const networkData = useMemo(() => {
    if (!currentAnalysis || !currentAnalysis.graph) return { nodes: {}, edges: [] };
    
    const graph = currentAnalysis.graph;
    const nodes: Record<string, any> = {};
    
    graph.forEachNode((nodeId, attrs) => {
      nodes[nodeId] = {
        id: nodeId,
        cluster: attrs.cluster,
        startMs: attrs.startMs
      };
    });

    const edges: any[] = [];
    graph.forEachEdge((edgeId, attrs, source, target) => {
      edges.push({
        from: source,
        to: target,
        weight: attrs.weight || 1
      });
    });

    return { nodes, edges };
  }, [currentAnalysis]);

  // Union-Find dynamic component metrics based on edge threshold slider
  const liveComponentStats = useMemo(() => {
    const list = Object.keys(networkData.nodes);
    if (list.length === 0) return { gccSize: 0, gccFraction: 0, compCount: 0 };

    const activeEdges = networkData.edges.filter(e => e.weight >= networkEdgeThreshold);
    const parent: Record<string, string> = {};
    list.forEach(id => (parent[id] = id));

    function find(x: string): string {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function union(x: string, y: string) {
      const px = find(x);
      const py = find(y);
      if (px !== py) parent[px] = py;
    }

    activeEdges.forEach(e => {
      if (parent[e.from] && parent[e.to]) {
        union(e.from, e.to);
      }
    });

    const sizes: Record<string, number> = {};
    list.forEach(id => {
      const r = find(id);
      sizes[r] = (sizes[r] || 0) + 1;
    });

    const sizeValues = Object.values(sizes);
    const gccSize = Math.max(...sizeValues);
    
    return {
      gccSize,
      gccFraction: gccSize / list.length,
      compCount: sizeValues.length
    };
  }, [networkData, networkEdgeThreshold]);

  // Local CSV Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const mapped: NormalizedActivity[] = [];
          for (const row of results.data as any[]) {
            const normalizedRow: Record<string, any> = {};
            for (const key of Object.keys(row)) {
              normalizedRow[key.toLowerCase().replace(/[\s_\-]+/g, '')] = row[key];
            }
            
            const dateStr = normalizedRow['date'] || normalizedRow['timestamp'] || normalizedRow['time'] || '';
            const timeStr = normalizedRow['time'] || '';
            const activity = normalizedRow['activity'] || normalizedRow['application'] || normalizedRow['filename'] || normalizedRow['title'] || '';
            const category = normalizedRow['category'] || normalizedRow['action'] || 'Default';
            
            if (!dateStr || !activity) continue;
            
            let t = 0;
            if (timeStr && dateStr.indexOf('T') === -1) {
              t = new Date(`${dateStr}T${timeStr}`).getTime();
            } else {
              t = new Date(dateStr).getTime();
            }
            
            if (isNaN(t)) continue;
            
            mapped.push({
              t,
              action: category,
              fileId: activity,
              fileName: activity
            });
          }
          
          if (mapped.length === 0) {
            alert("No activities mapped. Ensure your CSV has columns like Date, Time, Activity/Application, and Category.");
            setLoading(false);
            return;
          }
          
          mapped.sort((a, b) => a.t - b.t);
          setData(mapped);
          setCustomFilename(file.name);
          setCustomSize(Math.round(file.size / 1024) + " KB");
          setIsCustomData(true);
          setLoading(false);
          showToast(`Successfully imported ${mapped.length} rows from ${file.name}`);
        },
        error: (err) => {
          alert("Error parsing CSV: " + err.message);
          setLoading(false);
        }
      });
    };
    reader.readAsText(file);
  };

  // Client-side PDF Exporter using dynamic jsPDF import
  const handleExportPDF = async () => {
    if (!currentAnalysis) return;
    try {
      showToast("Preparing PDF generation...");
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      // Header Band
      doc.setFillColor(26, 43, 74); // Deep Navy
      doc.rect(0, 0, 210, 38, "F");
      
      doc.setFont("times", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text("EXECUTIVE FUNCTION PERCOLATION REPORT", 15, 18);
      
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text("BMS 4.0 Percolation Engine Retro-Analysis — Open Human Pilot", 15, 26);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 150, 26);

      // Section 1: Data Metadata
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(26, 43, 74);
      doc.text("1. Dataset Summary & Quality Logs", 15, 50);
      doc.line(15, 52, 195, 52);
      
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      let y = 60;
      doc.text(`* Total Activity Logs Analyzed: ${currentAnalysis.summary.totalActivities.toLocaleString()}`, 20, y);
      doc.text(`* Unique Files / Active Nodes: ${currentAnalysis.summary.uniqueFiles.toLocaleString()}`, 20, y + 6);
      doc.text(`* Coverage Timeline Span: ${currentAnalysis.summary.startDate} to ${currentAnalysis.summary.endDate}`, 20, y + 12);
      doc.text(`* Mean Actions / Intensity Level: ${currentAnalysis.summary.actionsPerDay.toFixed(1)} operations per day`, 20, y + 18);
      doc.text(`* Quality / Density Index: ${currentAnalysis.summary.dataQualityScore}%`, 20, y + 24);

      // Section 2: Cognitive System Classification
      y = 100;
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(26, 43, 74);
      doc.text("2. Cognitive Typology Classification", 15, y);
      doc.line(15, y + 2, 195, y + 2);
      
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`* Vested Cognitive Model: System Type ${currentAnalysis.classification.systemType} (${currentAnalysis.classification.systemLabel})`, 20, y + 10);
      doc.text(`* Network Fragmentation Rate: ${(currentAnalysis.percolation.fragmentation * 100).toFixed(1)}%`, 20, y + 16);
      doc.text(`* Critical Boundary Percolation Threshold (pc): ${(currentAnalysis.percolation.criticalThreshold).toFixed(2)}`, 20, y + 22);
      doc.text(`* Observer-Operator Interaction Lag: ${currentAnalysis.classification.observerOperatorLagDays.toFixed(1)} days`, 20, y + 28);
      doc.text(`* Dynamic Coupling Degree: ${(currentAnalysis.classification.coupling * 100).toFixed(1)}%`, 20, y + 34);

      // Section 3: DBSCAN Clusters
      y = 155;
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(26, 43, 74);
      doc.text("3. Retrospective Behavioral Clusters (DBSCAN)", 15, y);
      doc.line(15, y + 2, 195, y + 2);
      
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      y = y + 10;
      currentAnalysis.clusterInterpretations.forEach((cluster) => {
        doc.text(`* Cluster ${cluster.id} Keywords: ${cluster.keywords.join(", ")}`, 20, y);
        y += 7;
      });

      // Disclaimer / Sign-off
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(140, 140, 140);
      doc.text("Disclaimer: This report uses temporal graphology and percolation modeling on client-side activity traces.", 15, 275);
      doc.text("For research and informational purposes only. Executive Function OS platform (c) 2026.", 15, 280);

      doc.save(`EFOS_Percolation_Report_n1.pdf`);
      showToast("PDF Export completed successfully!");
    } catch (e) {
      alert("Failed to export PDF: " + e);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-brand-blue mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Loading Pipeline Substrate</h2>
        <p className="text-slate-500 mt-2 text-sm">Processing activity CSV logs & preparing window networks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 relative">
      
      {/* Toast Alert Popups */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-4 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <Activity className="w-4 h-4 text-brand-teal animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* OAuth Connecting Modal */}
      <OAuthWizard 
        isOpen={isOAuthOpen} 
        onClose={() => setIsOAuthOpen(false)} 
        onSuccess={(syncedData, filename) => {
          setData(syncedData);
          setIsCustomData(true);
          setCustomFilename(filename);
          setCustomSize("478 KB (OAuth Stream)");
        }} 
      />

      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Core Systems
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider rounded-full">OpenHuman Cohort</span>
              <span className="px-2.5 py-0.5 bg-brand-teal/10 text-brand-teal text-[10px] font-bold uppercase tracking-wider rounded-full">Retrospective n=1</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pilot Executive Function Dashboard
            </h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setIsOAuthOpen(true)}>
              <Link2 className="w-3.5 h-3.5 mr-2 text-brand-blue" />
              Sync Open Humans
            </Button>
            <Button size="sm" className="bg-brand-blue hover:bg-brand-blue-hover" onClick={handleExportPDF} disabled={!currentAnalysis}>
              <Download className="w-3.5 h-3.5 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-8">
        
        {/* UPPER STATUS BAR (Displays current data source state) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              📊
            </div>
            <div>
              <div className="text-sm font-semibold">Active Data Source</div>
              <div className="text-xs text-slate-400">
                {isCustomData ? `Custom: ${customFilename} (${customSize})` : "Default: rescuetime-n1.csv (478 KB)"}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv" 
              className="hidden" 
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-3.5 h-3.5 mr-2 text-slate-500" />
              Upload local CSV
            </Button>
            {isCustomData && (
              <Button variant="ghost" size="sm" onClick={loadDefaultPilot} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Reset default
              </Button>
            )}
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR: Configuration & Tuning Sliders */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interactive Sliders Tuning Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">Engine Calibration</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 font-semibold" onClick={() => setShowConfig(!showConfig)}>
                    {showConfig ? "Hide" : "Show Options"}
                  </Button>
                </div>
                <CardDescription>
                  Tune DBSCAN and graph thresholds in real-time.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                
                {/* Advanced toggles */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Temporal Binning Range</span>
                      <span className="text-indigo-600 font-bold">{binHours}h intervals</span>
                    </div>
                    <input 
                      type="range" min="1" max="24" step="1" 
                      value={binHours} 
                      onChange={(e) => setBinHours(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>DBSCAN Epsilon (Radius)</span>
                      <span className="text-indigo-600 font-bold">{autoEps ? "Auto-tuned" : dbscanEps.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" min="0.1" max="2.5" step="0.05" 
                        disabled={autoEps}
                        value={dbscanEps} 
                        onChange={(e) => setDbscanEps(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
                      />
                      <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                        <input type="checkbox" checked={autoEps} onChange={(e) => setAutoEps(e.target.checked)} />
                        Auto
                      </label>
                    </div>
                  </div>

                  {showConfig && (
                    <>
                      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-medium">
                          <span>DBSCAN Min Samples</span>
                          <span className="text-indigo-600 font-bold">{dbscanMinSamples} windows</span>
                        </div>
                        <input 
                          type="range" min="2" max="10" step="1" 
                          value={dbscanMinSamples} 
                          onChange={(e) => setDbscanMinSamples(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Graph Similarity Lag</span>
                          <span className="text-indigo-600 font-bold">{similarityLag} units</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" step="1" 
                          value={similarityLag} 
                          onChange={(e) => setSimilarityLag(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Min File Interactivity filter</span>
                          <span className="text-indigo-600 font-bold">{minFileTouches} counts</span>
                        </div>
                        <input 
                          type="range" min="1" max="5" step="1" 
                          value={minFileTouches} 
                          onChange={(e) => setMinFileTouches(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cognitive Spawning Insight */}
            {currentAnalysis && (
              <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6">
                <h3 className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-2">Percolation Insight</h3>
                <p className="text-indigo-200/90 leading-relaxed text-sm mb-4">
                  The window network displays a critical threshold of <b>{currentAnalysis.percolation.criticalThreshold.toFixed(2)}</b>. 
                  When your cognitive load causes scattered context switching (spawning noise ratio reaches <b>{(currentAnalysis.classification.spawningRate * 100).toFixed(0)}%</b>), the working-memory component fractures.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-indigo-300">
                    <span>Percolation Critical Threshold</span>
                    <span className="font-bold text-white">{(currentAnalysis.percolation.criticalThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={currentAnalysis.percolation.criticalThreshold * 100} className="h-1.5 bg-indigo-950" />
                </div>
              </Card>
            )}

          </div>

          {/* MAIN WORKSPACE: Metrics Grid, Timeline, and Network Graph */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Engine Summary Stats Grid */}
            {currentAnalysis && (
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard title="Trace Activities" value={currentAnalysis.summary.totalActivities.toLocaleString()} subtitle="Anonymized events" icon={Database} color="indigo" />
                <StatsCard title="Behavioral Clusters" value={currentAnalysis.dbscan.clusterCount} subtitle="Distinct functional modes" icon={BrainCircuit} color="teal" />
                <StatsCard title="System Fragmentation" value={`${(currentAnalysis.percolation.fragmentation * 100).toFixed(1)}%`} subtitle="Substrate breakdown state" icon={Activity} color="rose" />
                <StatsCard title="System Typology" value={`Type ${currentAnalysis.classification.systemType}`} subtitle={currentAnalysis.classification.systemLabel} icon={FileText} color="amber" />
              </div>
            )}

            {/* Timeline component */}
            {currentAnalysis && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Behavioral Modalities Timeline</CardTitle>
                  <CardDescription>
                    DBSCAN identifies periods of focused clustering versus noise/scattered switches. Hover to view details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TimelineBar analysis={currentAnalysis} />
                  
                  {/* Interpretations display */}
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Cluster Keywords (Activity Themes)</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {currentAnalysis.clusterInterpretations.map((c) => (
                        <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1 text-xs">
                          <div className="font-bold text-slate-700">Cluster {c.id} focus:</div>
                          <div className="text-indigo-600 font-semibold">{c.keywords.join(", ")}</div>
                        </div>
                      ))}
                      {currentAnalysis.clusterInterpretations.length === 0 && (
                        <div className="text-xs text-slate-400 font-medium">No distinct clusters identified with current Epsilon/MinSamples parameters. Try lowering Epsilon.</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* GRAPH VISUALIZATION & PERCOLATION FILTER CONTROLS */}
            {currentAnalysis && networkData.nodes && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Critical Percolation Simulator</span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-brand-blue" /> Interactive Playground
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Filter similarity edges using the slider to watch the network fragment into isolated components.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* SVG Network Canvas */}
                  <SVGNetworkGraph 
                    nodes={networkData.nodes} 
                    edges={networkData.edges} 
                    threshold={networkEdgeThreshold} 
                  />

                  {/* Filter controls */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">Criticality Edge-Weight Filter (pc)</span>
                        <span className="text-brand-blue font-bold">Threshold &gt;= {networkEdgeThreshold.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" min="0.1" max="1.5" step="0.05" 
                        value={networkEdgeThreshold} 
                        onChange={(e) => setNetworkEdgeThreshold(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200">
                      <div>
                        <div className="text-slate-400 font-medium">Giant Component</div>
                        <div className="font-bold text-slate-800 text-sm">
                          {liveComponentStats.gccSize} / {Object.keys(networkData.nodes).length} Bins
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-medium">Isolated Parts</div>
                        <div className="font-bold text-slate-800 text-sm">
                          {liveComponentStats.compCount} components
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-medium">Local Fragility</div>
                        <div className="font-bold text-rose-600 text-sm">
                          {((1.0 - liveComponentStats.gccFraction) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            )}

            {/* PLATFORM ARCHITECTURE CARD */}
            <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Computational Psychiatry Integration</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                OpenHuman pilots utilize detailed trace logs of window-focus dynamics. Rather than relying on subjective manual diaries, this engine applies <b>structural percolation models</b> to measure executive function directly and client-side. The network fragmentation metrics ($p_c$ threshold margins) reveal limits on focus and working components dynamically.
              </p>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
}
