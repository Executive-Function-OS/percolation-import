"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { formatISO } from "date-fns";
import { ArrowLeft, BookOpen, Download, FlaskConical, Lock, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { EngineAnalysis, NormalizedActivity, PreprocessOptions } from "@/lib/research/types";
import type { ExpertOptions } from "@/lib/research/types";
import { fetchAllDriveActivities } from "@/lib/research/driveActivity";
import { eventsFromDemo, runEngineAnalysis } from "@/lib/research/pipeline";
import { standardizeFeatureMatrix } from "@/lib/research/features";
import {
  exportClustersJson,
  exportGraphMLDocument,
  exportPdfReport,
  exportRawActivitiesCsv,
  exportTimeSeriesCsv,
} from "@/lib/research/exportReports";

const LS_CONSENT = "bms40_consent_v1";
const LS_RESULTS = "bms40_analysis_snapshot_v1";

const githubRepo =
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? "https://github.com/erikssonaicloud-gif/percolation-import";

function stripGraphForStorage(a: EngineAnalysis): EngineAnalysis {
  const { graph: _g, nodeIds: _n, ...rest } = a;
  return rest as EngineAnalysis;
}

function dailyIntensity(events: NormalizedActivity[]): { day: string; count: number }[] {
  const m = new Map<string, number>();
  for (const e of events) {
    const d = formatISO(new Date(e.t), { representation: "date" });
    m.set(d, (m.get(d) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

function WindowNetworkSvg({ analysis }: { analysis: EngineAnalysis }) {
  const g = analysis.graph;
  const ids = analysis.nodeIds ?? [];
  if (!g || ids.length === 0) return <p className="text-sm text-muted-foreground">No graph.</p>;

  const w = 560;
  const h = 320;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 28;
  const labels = analysis.dbscan.labels;
  const palette = ["#059669", "#0D9488", "#D97706", "#DC2626", "#1E40AF", "#7C3AED"];

  const pos = ids.map((id, i) => {
    const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2;
    return { id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), i };
  });
  const map = Object.fromEntries(pos.map((p) => [p.id, p]));

  const edges: { a: string; b: string; wt: number }[] = [];
  g.forEachEdge((_k, attr, s, t) => {
    edges.push({ a: s, b: t, wt: (attr as { weight?: number }).weight ?? 1 });
  });
  const maxWt = Math.max(1, ...edges.map((e) => e.wt));

  return (
    <svg width={w} height={h} className="rounded-lg border bg-card">
      <text x={12} y={18} className="fill-muted-foreground text-[10px]">
        Figure: window graph (nodes = time bins, colored by DBSCAN cluster)
      </text>
      {edges.map((e, idx) => {
        const A = map[e.a];
        const B = map[e.b];
        if (!A || !B) return null;
        const op = 0.12 + 0.45 * (e.wt / maxWt);
        return (
          <line
            key={idx}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke="#64748B"
            strokeOpacity={op}
            strokeWidth={1.2}
          />
        );
      })}
      {pos.map((p) => {
        const lab = labels[p.i] ?? -1;
        const col = lab < 0 ? "#94A3B8" : palette[lab % palette.length];
        return (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={col}
            stroke="#334155"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}

function ForceDirectedNetworkCanvas({ analysis }: { analysis: EngineAnalysis }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = analysis.graph;
    const ids = analysis.nodeIds ?? [];
    if (!canvas || !g || ids.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Keep rendering lightweight.
    const maxNodes = 220;
    const nodeIds = ids.slice(0, maxNodes);
    const labelByIndex = analysis.dbscan.labels;
    const palette = ["#059669", "#0D9488", "#D97706", "#DC2626", "#1E40AF", "#7C3AED"];
    const colorFor = (lab: number) => (lab < 0 ? "#94A3B8" : palette[lab % palette.length]);

    const W = canvas.width;
    const H = canvas.height;

    // Initialize positions in a ring.
    const pos = new Map<string, { x: number; y: number; vx: number; vy: number }>();
    const N = nodeIds.length;
    nodeIds.forEach((id, i) => {
      const a = (i / Math.max(1, N)) * 2 * Math.PI;
      pos.set(id, {
        x: W * (0.5 + 0.32 * Math.cos(a)),
        y: H * (0.5 + 0.32 * Math.sin(a)),
        vx: 0,
        vy: 0,
      });
    });

    const edges: { a: string; b: string; w: number }[] = [];
    g.forEachEdge((_k, attr, s, t) => {
      if (!pos.has(s) || !pos.has(t)) return;
      edges.push({ a: s, b: t, w: (attr as { weight?: number }).weight ?? 1 });
    });
    const maxW = Math.max(1, ...edges.map((e) => e.w));

    let frame = 0;
    const tick = () => {
      // A few solver iterations per frame.
      for (let iter = 0; iter < 3; iter++) {
        // Repulsion.
        for (let i = 0; i < nodeIds.length; i++) {
          const aId = nodeIds[i];
          const A = pos.get(aId)!;
          for (let j = i + 1; j < nodeIds.length; j++) {
            const bId = nodeIds[j];
            const B = pos.get(bId)!;
            const dx = A.x - B.x;
            const dy = A.y - B.y;
            const d2 = dx * dx + dy * dy + 0.01;
            const f = 26 / d2;
            A.vx += dx * f * 0.002;
            A.vy += dy * f * 0.002;
            B.vx -= dx * f * 0.002;
            B.vy -= dy * f * 0.002;
          }
        }

        // Attraction along edges.
        for (const e of edges) {
          const A = pos.get(e.a)!;
          const B = pos.get(e.b)!;
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const f = 0.0009 * (0.4 + 0.6 * (e.w / maxW));
          A.vx += dx * f;
          A.vy += dy * f;
          B.vx -= dx * f;
          B.vy -= dy * f;
        }

        // Centering + damping + bounds.
        for (const id of nodeIds) {
          const p = pos.get(id)!;
          p.vx += (W / 2 - p.x) * 0.0008;
          p.vy += (H / 2 - p.y) * 0.0008;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x = Math.max(18, Math.min(W - 18, p.x));
          p.y = Math.max(18, Math.min(H - 18, p.y));
        }
      }

      // Render.
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0B1220";
      ctx.fillRect(0, 0, W, H);

      // Edges.
      for (const e of edges) {
        const A = pos.get(e.a)!;
        const B = pos.get(e.b)!;
        const op = 0.06 + 0.38 * (e.w / maxW);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.strokeStyle = `rgba(148,163,184,${op})`;
        ctx.lineWidth = 0.7 + 1.4 * (e.w / maxW);
        ctx.stroke();
      }

      // Nodes.
      for (let i = 0; i < nodeIds.length; i++) {
        const id = nodeIds[i];
        const p = pos.get(id)!;
        const lab = labelByIndex[i] ?? -1;
        const col = colorFor(lab);
        ctx.beginPath();
        ctx.arc(p.x, p.y, lab < 0 ? 3 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = "rgba(15,23,42,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      frame++;
      // Render ~2 seconds then stop (static snapshot is fine).
      if (frame < 120) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [analysis]);

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={720}
        height={380}
        className="w-full rounded-lg border bg-card"
      />
      <p className="text-xs text-muted-foreground">
        Force-directed layout (lightweight). Colors map to DBSCAN clusters; gray = noise.
      </p>
    </div>
  );
}

function PipelineStageInspector({ analysis }: { analysis: EngineAnalysis }) {
  const [stage, setStage] = useState<
    "summary" | "windows" | "matrixPreview" | "dbscan" | "network" | "percolation" | "classification"
  >("windows");

  const matrixPreview = useMemo(() => {
    if (!analysis.windows.length) return [];
    const mat = standardizeFeatureMatrix(analysis.windows);
    return mat.slice(0, 10).map((row, i) => ({ i, row: row.map((x) => Number(x.toFixed(4))) }));
  }, [analysis]);

  const payload = useMemo(() => {
    switch (stage) {
      case "summary":
        return analysis.summary;
      case "windows":
        return analysis.windows.slice(0, 10).map((w) => ({
          index: w.index,
          startMs: w.startMs,
          endMs: w.endMs,
          actionCount: w.actionCount,
          fileCount: w.fileCount,
          switchingRate: Number(w.switchingRate.toFixed(4)),
          sunkCostIndex: Number(w.sunkCostIndex.toFixed(4)),
          narrativeCoherence: Number(w.narrativeCoherence.toFixed(4)),
        }));
      case "matrixPreview":
        return matrixPreview;
      case "dbscan":
        return analysis.dbscan;
      case "network":
        return analysis.network;
      case "percolation":
        return {
          criticalThreshold: analysis.percolation.criticalThreshold,
          fragility: analysis.percolation.fragility,
          fragmentation: analysis.percolation.fragmentation,
          curvePreview: analysis.percolation.curve.slice(0, 10),
        };
      case "classification":
        return analysis.classification;
      default:
        return null;
    }
  }, [analysis, matrixPreview, stage]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["summary", "Summary"],
            ["windows", "Windows (first 10)"],
            ["matrixPreview", "Feature matrix (preview)"],
            ["dbscan", "DBSCAN"],
            ["network", "Network"],
            ["percolation", "Percolation"],
            ["classification", "Classification"],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            variant={stage === id ? "default" : "outline"}
            size="sm"
            onClick={() => setStage(id)}
          >
            {label}
          </Button>
        ))}
      </div>
      <pre className="max-h-72 overflow-auto rounded-lg border bg-muted p-3 text-xs">
        {JSON.stringify(payload, null, 2)}
      </pre>
      <p className="text-xs text-muted-foreground">
        Preview only (truncated). This exposes intermediate artifacts for research inspection without
        exporting raw Drive data.
      </p>
    </div>
  );
}

export default function BmsEngineApp() {
  const [consent, setConsent] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [extractStep, setExtractStep] = useState<string>("");
  const [extracting, setExtracting] = useState(false);
  const [preprocess, setPreprocess] = useState<PreprocessOptions>({
    windowDays: 180,
    minFileTouches: 1,
    actionInclude: [],
    actionExclude: [],
  });
  const [expert, setExpert] = useState<ExpertOptions>({
    binHours: 1,
    dbscanEps: null,
    dbscanMinSamples: 5,
    similarityLag: 4,
  });
  const [analysis, setAnalysis] = useState<EngineAnalysis | null>(null);
  const [crisisDates, setCrisisDates] = useState<string>("");
  const [researchEmail, setResearchEmail] = useState("");
  const [researchNote, setResearchNote] = useState("");

  const usingEnvOverride = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const [rawEvents, setRawEvents] = useState<NormalizedActivity[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if ((session as any).isMock) {
        setAccessToken("mock-sandbox-token");
      } else {
        setAccessToken((session as any).accessToken ?? null);
      }
    }
  }, [session]);

  const runExtract = useCallback(async () => {
    if (!accessToken) return;
    
    // Developer Sandbox mock bypass
    if (accessToken === "mock-sandbox-token") {
      setExtracting(true);
      setExtractStep("Simulating extraction natively in Developer Sandbox...");
      setTimeout(() => {
        setRawEvents(eventsFromDemo());
        setExtractStep("");
        setExtracting(false);
      }, 1500);
      return;
    }

    setExtracting(true);
    setExtractStep("Fetching activity logs (last 180 days)…");
    try {
      const ev = await fetchAllDriveActivities(accessToken, ({ totalSoFar }) => {
        setExtractStep(`Parsing ${totalSoFar} activities across files…`);
      });
      setExtractStep("Building temporal graph…");
      await new Promise((r) => setTimeout(r, 400));
      setExtractStep("Identifying behavioral clusters…");
      await new Promise((r) => setTimeout(r, 400));
      setRawEvents(ev);
      setExtractStep("");
    } catch (e) {
      setExtractStep(e instanceof Error ? e.message : "Extraction failed");
    } finally {
      setExtracting(false);
    }
  }, [accessToken]);

  const runAnalysisClick = useCallback(() => {
    const a = runEngineAnalysis(rawEvents, preprocess, expert);
    setAnalysis(a);
    try {
      localStorage.setItem(LS_RESULTS, JSON.stringify(stripGraphForStorage(a)));
    } catch {
      /* ignore */
    }
  }, [rawEvents, preprocess, expert]);

  const heatmapData = useMemo(() => dailyIntensity(rawEvents), [rawEvents]);
  const clusterTimeline = useMemo(() => {
    if (!analysis) return [];
    return analysis.windows.map((w, i) => ({
      t: w.startMs,
      cluster: analysis.dbscan.labels[i] ?? -1,
      noise: (analysis.dbscan.labels[i] ?? 0) < 0 ? 1 : 0,
    }));
  }, [analysis]);

  const percolationChartData = useMemo(() => {
    if (!analysis) return [];
    return analysis.percolation.curve.map((p) => ({
      removedPct: Math.round(p.fractionRemoved * 100),
      gccPct: Math.round(p.giantComponentFraction * 100),
    }));
  }, [analysis]);

  const onLoadSample = () => {
    setRawEvents(eventsFromDemo());
    setExtractStep("");
  };

  const onLogout = () => {
    signOut();
    setAccessToken(null);
    setRawEvents([]);
    setAnalysis(null);
  };

  useEffect(() => {
    setHydrated(true);
    if (localStorage.getItem(LS_CONSENT) === "1") setConsent(true);
    try {
      const s = localStorage.getItem(LS_RESULTS);
      if (s) setAnalysis(JSON.parse(s) as EngineAnalysis);
    } catch {
      /* ignore */
    }
  }, []);

  const persistConsent = (v: boolean) => {
    setConsent(v);
    if (v) localStorage.setItem(LS_CONSENT, "1");
    else localStorage.removeItem(LS_CONSENT);
  };

  const crisisList = crisisDates
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const validationSummary = useMemo(() => {
    if (!analysis || crisisList.length === 0) return null;
    const frags = analysis.windows.map((w) => w.switchingRate);
    const m = frags.reduce((a, b) => a + b, 0) / Math.max(1, frags.length);
    const sd = Math.sqrt(
      frags.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, frags.length - 1)
    );
    let hits = 0;
    for (const d of crisisList) {
      const dayMs = new Date(d).getTime();
      if (Number.isNaN(dayMs)) continue;
      const idx = analysis.windows.findIndex(
        (w) => w.startMs <= dayMs && w.endMs >= dayMs
      );
      if (idx < 0) continue;
      const prev = analysis.windows
        .slice(Math.max(0, idx - 3), idx)
        .some((w) => w.switchingRate > m + sd);
      if (prev) hits++;
    }
    return { hits, total: crisisList.length };
  }, [analysis, crisisList]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-[#1E40AF] text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            <span>
              Client-side processing only — zero server access to your Drive.{" "}
              <span className="font-semibold">Research-grade privacy.</span>
            </span>
          </div>
          <a href={githubRepo} className="underline decoration-white/40 hover:decoration-white">
            Audit source
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Research landing
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/engine/methodology">
                <BookOpen className="mr-1 h-4 w-4" />
                How BMS 4.0 works
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/engine/about">About this research</Link>
            </Button>
          </div>
        </div>

        <header className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
            Executive Function OS
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#1E40AF] md:text-4xl">
            BMS 4.0 Percolation Engine
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Network topology analysis for cognitive resilience research. Detecting observer–operator
            dynamics through percolation on digital interaction graphs and DBSCAN behavioral modes
            (density-based clustering suggested by computational biology collaborators).
          </p>
        </header>

        {!hydrated ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !consent ? (
          <Card className="max-w-2xl border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Shield className="h-5 w-5" />
                Informed consent (research ethics)
              </CardTitle>
              <CardDescription className="text-amber-900/80">
                This is experimental research software, not a medical device. Results require
                professional interpretation. You may withdraw at any time. No file contents are
                uploaded — processing stays in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(c) => persistConsent(c === true)}
                  className="mt-1"
                />
                <span>I understand this is research software and consent to participate.</span>
              </label>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Connect & extract</CardTitle>
                  <CardDescription>
                    OAuth scope:{" "}
                    <code className="rounded bg-muted px-1 text-xs">
                      drive.activity.readonly
                    </code>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!usingEnvOverride && (
                    <p className="text-sm text-muted-foreground">
                      Using Google OAuth credentials from setup or Developer Sandbox.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {!session ? (
                      <Button
                        onClick={() => signIn()}
                        className="bg-[#1E40AF] hover:bg-[#1E3A8A]"
                      >
                        Sign in to connect
                      </Button>
                    ) : (
                      <>
                        <Button variant="secondary" onClick={runExtract} disabled={extracting}>
                          {extracting ? "Extracting…" : "Extract network data"}
                        </Button>
                        <Button variant="ghost" onClick={onLogout}>
                          Sign out ((session as any)?.isMock ? "Sandbox" : "Google")
                        </Button>
                      </>
                    )}
                    <Button variant="outline" onClick={onLoadSample}>
                      View sample results
                    </Button>
                  </div>
                  {extractStep && <p className="text-sm text-muted-foreground">{extractStep}</p>}
                  {extracting && <Progress value={44} className="h-2 animate-pulse" />}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preprocessing (research)</CardTitle>
                  <CardDescription>Time window, filters, expert DBSCAN parameters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Activity window (days)</Label>
                    <Select
                      value={String(preprocess.windowDays)}
                      onValueChange={(v) =>
                        setPreprocess((p) => ({
                          ...p,
                          windowDays: Number(v) as PreprocessOptions["windowDays"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="60">60</SelectItem>
                        <SelectItem value="90">90</SelectItem>
                        <SelectItem value="180">180</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Minimum touches per file ({preprocess.minFileTouches})</Label>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[preprocess.minFileTouches]}
                      onValueChange={([v]) =>
                        setPreprocess((p) => ({ ...p, minFileTouches: v }))
                      }
                    />
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="expert">
                      <AccordionTrigger>Expert mode (parameters)</AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        <div className="grid gap-2">
                          <Label>Time bin (hours)</Label>
                          <Slider
                            min={1}
                            max={6}
                            step={1}
                            value={[expert.binHours]}
                            onValueChange={([v]) => setExpert((e) => ({ ...e, binHours: v }))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>DBSCAN min_samples</Label>
                          <Input
                            type="number"
                            min={2}
                            max={50}
                            value={expert.dbscanMinSamples}
                            onChange={(ev) =>
                              setExpert((e) => ({
                                ...e,
                                dbscanMinSamples: Number(ev.target.value) || 5,
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>DBSCAN eps (empty = auto-tune via silhouette)</Label>
                          <Input
                            placeholder="auto"
                            value={expert.dbscanEps ?? ""}
                            onChange={(ev) => {
                              const t = ev.target.value.trim();
                              const n = Number(t);
                              setExpert((e) => ({
                                ...e,
                                dbscanEps: t === "" || !Number.isFinite(n) ? null : n,
                              }));
                            }}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Similarity edge lag (windows)</Label>
                          <Slider
                            min={1}
                            max={12}
                            step={1}
                            value={[expert.similarityLag]}
                            onValueChange={([v]) =>
                              setExpert((e) => ({ ...e, similarityLag: v }))
                            }
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Button
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E]"
                    disabled={rawEvents.length === 0}
                    onClick={runAnalysisClick}
                  >
                    Run BMS 4.0 analysis
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {rawEvents.length} activities loaded (after connect or sample).
                  </p>
                </CardContent>
              </Card>
            </div>

            {analysis && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Executive summary</CardTitle>
                    <CardDescription>
                      {analysis.classification.systemType >= 3
                        ? "Network approaching critical threshold — prioritize stabilization and professional support."
                        : "Network appears relatively resilient — continue monitoring."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">System type</p>
                      <p className="text-lg font-semibold">{analysis.classification.systemLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Chaos score</p>
                      <p className="text-lg font-semibold">
                        {analysis.classification.chaosScore.toFixed(1)} / 100 ±{" "}
                        {analysis.classification.chaosMargin.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Observer–operator lag (est.)
                      </p>
                      <p className="text-lg font-semibold">
                        {analysis.classification.observerOperatorLagDays.toFixed(1)} days
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gap between awareness proxy spikes and action dips (rolling windows).
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="metrics" className="mb-10">
                  <TabsList className="flex flex-wrap h-auto gap-1">
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="percolation">Percolation</TabsTrigger>
                    <TabsTrigger value="dbscan">DBSCAN</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="viz">Additional viz</TabsTrigger>
                    <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                    <TabsTrigger value="substrate">Substrate</TabsTrigger>
                    <TabsTrigger value="ground">Ground truth</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                  </TabsList>

                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Data summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2 text-sm">
                          <div>Total activities</div>
                          <div className="font-mono">{analysis.summary.totalActivities}</div>
                          <div>Unique files (nodes)</div>
                          <div className="font-mono">{analysis.summary.uniqueFiles}</div>
                          <div>Span</div>
                          <div className="font-mono text-xs">
                            {analysis.summary.startDate} → {analysis.summary.endDate}
                          </div>
                          <div>Actions / day</div>
                          <div className="font-mono">
                            {analysis.summary.actionsPerDay.toFixed(1)}
                          </div>
                          <div>Data quality</div>
                          <div className="font-mono">{analysis.summary.dataQualityScore}%</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Network statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2 text-sm">
                          <div>Nodes (windows)</div>
                          <div className="font-mono">{analysis.network.nodeCount}</div>
                          <div>Edges</div>
                          <div className="font-mono">{analysis.network.edgeCount}</div>
                          <div>Avg degree</div>
                          <div className="font-mono">{analysis.network.avgDegree.toFixed(2)}</div>
                          <div>Density</div>
                          <div className="font-mono">{analysis.network.density.toFixed(4)}</div>
                          <div>Clustering C</div>
                          <div className="font-mono">
                            {analysis.network.clusteringCoefficient.toFixed(3)}
                          </div>
                          <div>Fragmentation</div>
                          <div className="font-mono">
                            {(analysis.classification.fragmentation * 100).toFixed(1)}%
                          </div>
                          <div>Coupling (norm.)</div>
                          <div className="font-mono">{analysis.classification.coupling.toFixed(3)}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="percolation">
                    <Card>
                      <CardHeader>
                        <CardTitle>Figure: Percolation curve (random node removal)</CardTitle>
                        <CardDescription>
                          Giant component size vs. fraction removed. Critical threshold ≈{" "}
                          {(analysis.percolation.criticalThreshold * 100).toFixed(0)}%. Your network
                          is approximately{" "}
                          {(analysis.distanceToPercolationThreshold * 100).toFixed(0)}% (normalized
                          heuristic) from the modeled collapse region — interpret with care.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={percolationChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="removedPct" name="% removed" />
                            <YAxis dataKey="gccPct" name="GCC %" />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="gccPct"
                              stroke="#1E40AF"
                              dot={false}
                              name="Giant component %"
                            />
                            <ReferenceLine
                              x={Math.round(analysis.percolation.criticalThreshold * 100)}
                              stroke="#D97706"
                              strokeDasharray="4 4"
                              label={{ value: "Critical (model)", fill: "#D97706", fontSize: 10 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="dbscan">
                    <Card>
                      <CardHeader>
                        <CardTitle>DBSCAN behavioral modes</CardTitle>
                        <CardDescription>
                          Detected {analysis.dbscan.clusterCount} modes; noise (spawning / unrelated
                          sub-problems) ≈ {(analysis.dbscan.noiseRatio * 100).toFixed(1)}%. Thank you
                          to computational biology collaborators for suggesting density-based
                          clustering over k-means for irregular cognitive mode shapes.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              type="number"
                              dataKey="t"
                              domain={["auto", "auto"]}
                              tickFormatter={(v) => new Date(v).toLocaleDateString()}
                              name="Time"
                            />
                            <YAxis dataKey="cluster" name="Cluster" />
                            <ZAxis range={[40, 400]} />
                            <Tooltip
                              formatter={(v, name) => [v, name]}
                              labelFormatter={(l) => new Date(l as number).toLocaleString()}
                            />
                            <Scatter data={clusterTimeline} fill="#0D9488" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </CardContent>
                      <CardContent>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                          {analysis.clusterInterpretations.map((c) => (
                            <li key={c.id}>
                              <span className="font-medium">Cluster {c.id}:</span>{" "}
                              {c.keywords.length ? c.keywords.join(", ") : "(keywords sparse)"}
                            </li>
                          ))}
                          <li>
                            <span className="font-medium">Noise (-1):</span> spawning-style periods
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="network">
                    <Card>
                      <CardHeader>
                        <CardTitle>Window graph topology</CardTitle>
                        <CardDescription>
                          Analogous to mapping interaction networks in biology: nodes are temporal
                          bins; edges combine temporal adjacency, behavioral similarity, and file
                          co-occurrence. Highlight emphasizes giant component (approximate ring
                          segment).
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <WindowNetworkSvg analysis={analysis} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="viz" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Force-directed window graph</CardTitle>
                        <CardDescription>
                          An additional visualization inspired by the prototype: a lightweight
                          force-directed layout of the window graph for structural intuition.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ForceDirectedNetworkCanvas analysis={analysis} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Pipeline stage inspector (preview)</CardTitle>
                        <CardDescription>
                          Quick inspection of intermediate outputs (first 10 windows, feature matrix
                          preview, DBSCAN parameters).
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PipelineStageInspector analysis={analysis} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="heatmap">
                    <Card>
                      <CardHeader>
                        <CardTitle>Activity heatmap (daily)</CardTitle>
                        <CardDescription>
                          Pattern recognition for high-functioning signatures (exploratory): intensity
                          = actions per day.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={heatmapData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={6} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" name="Actions">
                              {heatmapData.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={i % 2 === 0 ? "#1E40AF" : "#0D9488"}
                                  fillOpacity={0.85}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="substrate">
                    <Card>
                      <CardHeader>
                        <CardTitle>Observable vs. substrate (Rarebrain-style framing)</CardTitle>
                        <CardDescription>
                          Tier 2 proxies from window metrics: sunk-cost binding (repeat depth) and
                          meaning preservation (narrative coherence across bins).
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                        <div>
                          <p className="font-medium">Sunk cost binding (mean index)</p>
                          <p className="font-mono text-lg">
                            {(
                              analysis.windows.reduce((s, w) => s + w.sunkCostIndex, 0) /
                              Math.max(1, analysis.windows.length)
                            ).toFixed(3)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Meaning preservation (mean coherence)</p>
                          <p className="font-mono text-lg">
                            {(
                              analysis.windows.reduce((s, w) => s + w.narrativeCoherence, 0) /
                              Math.max(1, analysis.windows.length)
                            ).toFixed(3)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ground">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ground truth validation</CardTitle>
                        <CardDescription>
                          Mark known paralysis / crisis dates (one per line). We check for switching
                          spikes in the prior bins (heuristic only).
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="2026-02-21"
                          value={crisisDates}
                          onChange={(e) => setCrisisDates(e.target.value)}
                          rows={4}
                        />
                        {validationSummary && (
                          <p className="text-sm">
                            Algorithm flagged elevated switching before{" "}
                            <strong>{validationSummary.hits}</strong> of{" "}
                            <strong>{validationSummary.total}</strong> annotated events (exploratory
                            metric).
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="export">
                    <Card>
                      <CardHeader>
                        <CardTitle>Research exports</CardTitle>
                        <CardDescription>All generated locally in your browser.</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => exportPdfReport(analysis)}>
                          <Download className="mr-2 h-4 w-4" />
                          PDF report
                        </Button>
                        <Button variant="outline" onClick={() => exportGraphMLDocument(analysis)}>
                          GraphML
                        </Button>
                        <Button variant="outline" onClick={() => exportTimeSeriesCsv(analysis)}>
                          Time series CSV
                        </Button>
                        <Button variant="outline" onClick={() => exportClustersJson(analysis)}>
                          DBSCAN JSON
                        </Button>
                        <Button variant="outline" onClick={() => exportRawActivitiesCsv(rawEvents)}>
                          Raw activities CSV
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="research">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FlaskConical className="h-5 w-5" />
                          Contribute to cognitive networks research
                        </CardTitle>
                        <CardDescription>
                          Opt-in is local-only for this demo (no backend). Email is not transmitted
                          unless you configure a form endpoint. Use exports to share anonymized
                          metrics with collaborators.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox disabled />
                          Share anonymized network metrics (requires backend)
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox disabled />
                          Share ground-truth validation outcomes (requires backend)
                        </label>
                        <Input
                          placeholder="Research mailing list email (not sent in this build)"
                          value={researchEmail}
                          onChange={(e) => setResearchEmail(e.target.value)}
                        />
                        <Textarea
                          placeholder="Feedback: was the prediction useful?"
                          value={researchNote}
                          onChange={(e) => setResearchNote(e.target.value)}
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary">Participation info</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Research participation</DialogTitle>
                              <DialogDescription>
                                Collaborators: computational biology (network topology parallels),
                                cognitive N=1 methodology, Rarebrain Institute framing for
                                neurodivergent pattern recognition. Pre-registration and OSF links can
                                be added as the study matures.
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <footer className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
                  <p>BMS 4.0 Percolation Engine — research preview</p>
                  <p>Developed by Annika Eriksson · Version 0.9.0-beta</p>
                  <p className="mt-2">
                    Last updated: {new Date().toISOString().slice(0, 10)} ·{" "}
                    <a href={githubRepo} className="underline">
                      GitHub
                    </a>
                  </p>
                </footer>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
