'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  FileText,
  Folder,
  Network,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  Doc,
  Chunk,
  Edge,
  RetrievalHit,
  Analysis,
  analyze,
  ARCHITECTURE,
} from '@/lib/hyperrag/engine';

async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const raw = new TextDecoder('latin1').decode(buf);
  const strings = Array.from(raw.matchAll(/\((?:\\.|[^\\)]){3,}\)\s*(?:Tj|TJ|'|")/g)).map(m =>
    m[0].replace(/\\[()]/g, '').replace(/^\(|\)\s*(Tj|TJ|'|")$/g, '')
  );
  const readable = strings.join(' ').replace(/\s+/g, ' ');
  if (readable.length > 300) return readable;
  return raw
    .replace(/[^A-Za-z0-9.,;:()\-\n\/ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 50000);
}

async function readUploadedFile(file: File): Promise<Doc> {
  let text = '';
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    text = await extractPdfText(file);
  } else {
    text = await file.text();
  }
  return {
    id: `${Date.now()}-${file.name}`,
    name: file.name,
    text,
    size: file.size,
    type: file.type || 'text/plain',
    source: 'upload',
  };
}

export default function HyperRAGPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [query, setQuery] = useState(
    'Why is the 2019 foreclosure judgment allegedly void, and what evidence supports staying entry of the proposed judgment?'
  );
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'docs'>('summary');

  const totalChars = useMemo(() => docs.reduce((s, d) => s + d.text.length, 0), [docs]);

  const loadDemo = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch('/case_files_consolidated_verified.txt');
      const text = await res.text();
      const demo: Doc = {
        id: 'eriksson-demo',
        name: 'Eriksson consolidated case file demo',
        text,
        size: text.length,
        type: 'text/plain',
        source: 'demo',
      };
      setDocs([demo]);
      setAnalysis(analyze(query, [demo]));
    } catch (err) {
      console.error('Failed to load demo:', err);
    } finally {
      setBusy(false);
    }
  }, [query]);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      setBusy(true);
      try {
        const incoming = await Promise.all(files.map(readUploadedFile));
        const next = [...docs, ...incoming];
        setDocs(next);
        setAnalysis(analyze(query, next));
      } catch (err) {
        console.error('Failed to process upload:', err);
      } finally {
        setBusy(false);
        e.target.value = '';
      }
    },
    [docs, query]
  );

  const run = useCallback(() => {
    if (!docs.length || !query.trim()) return;
    setAnalysis(analyze(query, docs));
  }, [docs, query]);

  const reset = useCallback(() => {
    setDocs([]);
    setAnalysis(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Executive Function OS
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-200/60 px-3 py-1.5 rounded-full font-mono">
            <span>Status: Client-Side Simulator Live</span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-slate-900 text-slate-100 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
              Advanced HybridRAG & GraphRAG Simulator
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              HyperRAG Pipeline Tester
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              An interactive test bench for the proposed PDF → Knowledge Graph → Hybrid Retrieval pipeline.
              Import legal documents, parse timeline relationships, and diagnostic observer-operator dynamics
              with robust client-side heuristics.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={loadDemo}
                disabled={busy}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs py-3 px-6 rounded-full transition shadow-lg shadow-emerald-500/10 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {busy ? 'Processing…' : 'Load Eriksson Demo'}
              </button>
              <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs py-3 px-6 rounded-full transition cursor-pointer flex items-center gap-2">
                <FileText className="w-4 h-4" /> Upload Custom Files
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.csv,.pdf,.doc,.docx"
                  onChange={onUpload}
                  className="hidden"
                />
              </label>
              {docs.length > 0 && (
                <button
                  onClick={reset}
                  className="bg-transparent border border-slate-700 hover:bg-slate-800/40 text-slate-400 font-bold text-xs py-3 px-5 rounded-full transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              )}
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center w-full md:w-64 space-y-2 shrink-0">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block">
              Pipeline Readiness Score
            </span>
            <strong className="text-5xl font-black text-emerald-400 block tracking-tight leading-none">
              {analysis ? analysis.metrics.score : 0}
            </strong>
            <p className="text-xs text-slate-400">
              {analysis
                ? `${analysis.metrics.docs} docs · ${analysis.metrics.chunks} chunks · ${analysis.metrics.edges} graph edges`
                : 'Load or upload files to begin'}
            </p>
          </div>
        </section>

        {/* Query Input Panel */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Prompt & Test Query
            </label>
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full min-h-[80px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition resize-y leading-relaxed"
              placeholder="Ask a question about the case materials..."
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={run}
              disabled={!docs.length || !query.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-8 rounded-full transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> Run HybridRAG Test
            </button>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" /> Documents
            </span>
            <strong className="text-2xl font-black text-slate-800 block leading-tight">
              {docs.length}
            </strong>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Text Volume
            </span>
            <strong className="text-2xl font-black text-slate-800 block leading-tight">
              {totalChars.toLocaleString()} <span className="text-xs font-medium text-slate-400">chars</span>
            </strong>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Entity Anchors
            </span>
            <strong className="text-2xl font-black text-slate-800 block leading-tight">
              {analysis?.metrics.entities || 0}
            </strong>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Retrieval Coverage
            </span>
            <strong className="text-2xl font-black text-slate-800 block leading-tight">
              {analysis ? `${analysis.metrics.coverage}%` : '0%'}
            </strong>
          </div>
        </section>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Architecture Blueprint Panel */}
          <aside className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md lg:col-span-4 space-y-6">
            <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-500" /> Architecture Blueprint
            </h2>
            <div className="space-y-4">
              {ARCHITECTURE.map(stage => (
                <article key={stage.title} className="space-y-1.5 border-l-2 border-slate-100 hover:border-emerald-400 pl-4 transition py-1">
                  <h3 className="text-sm font-bold text-slate-800">{stage.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{stage.text}</p>
                </article>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
              Source verified against active research benchmarks:{' '}
              <a
                href="https://demo.executivefunctionos.com/methodology/"
                target="_blank"
                className="text-emerald-600 hover:underline font-bold inline"
              >
                EFOS Methodology / HybridRAG Expansion
              </a>.
            </div>
          </aside>

          {/* Retrieval Evidence (Hits) Panel */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-800">Retrieval Evidence</h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                {analysis ? `${analysis.hits.length} hits` : 'No run yet'}
              </span>
            </div>
            
            {!analysis ? (
              <p className="text-slate-400 text-xs text-center py-12 leading-relaxed">
                Load the demo dataset or upload custom case materials, then run a query to retrieve,
                rank, and evaluate grounded evidence chunks.
              </p>
            ) : (
              <div className="space-y-5">
                {analysis.hits.map((hit, i) => (
                  <article
                    className="border border-slate-100 hover:border-slate-200 hover:shadow-sm rounded-2xl p-4 transition bg-slate-50/50 space-y-3"
                    key={hit.id}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <strong className="text-slate-700 truncate max-w-[180px]" title={hit.docName}>
                        #{i + 1} {hit.docName}
                      </strong>
                      <span className="text-emerald-600 font-mono">
                        {Math.round(hit.score * 100)}% Match
                      </span>
                    </div>
                    
                    {/* Diagnostic Scoring Bars */}
                    <div className="grid grid-cols-3 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                      <div
                        className="bg-indigo-400 transition-all duration-300"
                        style={{ width: `${hit.lexical * 100}%` }}
                        title={`Lexical: ${Math.round(hit.lexical * 100)}%`}
                      />
                      <div
                        className="bg-emerald-400 transition-all duration-300"
                        style={{ width: `${hit.semantic * 100}%` }}
                        title={`Semantic: ${Math.round(hit.semantic * 100)}%`}
                      />
                      <div
                        className="bg-amber-400 transition-all duration-300"
                        style={{ width: `${hit.graph * 100}%` }}
                        title={`Graph proximity: ${Math.round(hit.graph * 100)}%`}
                      />
                    </div>
                    
                    <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                      &ldquo;{hit.text.slice(0, 520)}
                      {hit.text.length > 520 ? '…' : ''}&rdquo;
                    </p>
                    
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100/60">
                      {hit.matchedTerms.map(t => (
                        <em
                          key={t}
                          className="not-italic text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md"
                        >
                          {t}
                        </em>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Diagnostics / Graph Tab Panel */}
          <aside className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md lg:col-span-3 space-y-6">
            <div className="flex border-b border-slate-100 p-0.5 bg-slate-100/80 rounded-full">
              <button
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition ${
                  activeTab === 'summary' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => setActiveTab('summary')}
              >
                Evaluation
              </button>
              <button
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition ${
                  activeTab === 'docs' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => setActiveTab('docs')}
              >
                Graph/Data
              </button>
            </div>

            {activeTab === 'summary' ? (
              <div className="space-y-5">
                <h3 className="text-xs uppercase tracking-widest text-slate-400 font-black">
                  Theoretical Analysis
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Strengths
                    </h4>
                    {(analysis?.strengths || ['Run an analysis to populate findings.']).map(x => (
                      <p className="text-slate-600 text-[11px] leading-relaxed border-l-2 border-emerald-100 pl-3.5" key={x}>
                        {x}
                      </p>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Limitations
                    </h4>
                    {(analysis?.weaknesses || ['Analysis limitations show here.']).map(x => (
                      <p className="text-slate-600 text-[11px] leading-relaxed border-l-2 border-rose-100 pl-3.5" key={x}>
                        {x}
                      </p>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-500 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Recommendations
                    </h4>
                    {(analysis?.recommendations || ['Actionable guidance populated on run.']).map(x => (
                      <p className="text-slate-600 text-[11px] leading-relaxed border-l-2 border-indigo-100 pl-3.5" key={x}>
                        {x}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-xs uppercase tracking-widest text-slate-400 font-black">
                  Knowledge Graph Preview
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700">Inferred Edges</h4>
                    {analysis?.edges.length ? (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {analysis.edges.slice(0, 10).map((e, idx) => (
                          <div
                            className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] space-y-1"
                            key={idx}
                          >
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-slate-800">{e.from}</span>
                              <span className="text-slate-400 font-normal">&rarr;</span>
                              <span className="text-slate-800">{e.to}</span>
                            </div>
                            <p className="text-emerald-600 font-semibold">{e.label}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic">No edges extracted yet.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700">Citations Found</h4>
                    {analysis?.citations.length ? (
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {analysis.citations.slice(0, 15).map(c => (
                          <em
                            key={c}
                            className="not-italic text-[9px] font-bold bg-indigo-50 border border-indigo-100/50 text-indigo-600 px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </em>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic">No citations found.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700">Dates Found</h4>
                    {analysis?.dates.length ? (
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {analysis.dates.slice(0, 12).map(d => (
                          <em
                            key={d}
                            className="not-italic text-[9px] font-bold bg-amber-50 border border-amber-100/50 text-amber-700 px-2 py-0.5 rounded-md"
                          >
                            {d}
                          </em>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic">No dates found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}
