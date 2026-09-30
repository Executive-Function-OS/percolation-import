export type Doc = {
  id: string;
  name: string;
  text: string;
  size: number;
  type: string;
  source: 'demo' | 'upload';
};

export type Chunk = {
  id: string;
  docId: string;
  docName: string;
  index: number;
  text: string;
  tokens: string[];
  entities: string[];
  citations: string[];
  dates: string[];
};

export type Edge = {
  from: string;
  to: string;
  label: string;
  evidence: string;
};

export type RetrievalHit = Chunk & {
  lexical: number;
  semantic: number;
  graph: number;
  score: number;
  matchedTerms: string[];
};

export type Analysis = {
  query: string;
  chunks: Chunk[];
  hits: RetrievalHit[];
  entities: string[];
  citations: string[];
  dates: string[];
  edges: Edge[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  metrics: {
    docs: number;
    chunks: number;
    entities: number;
    edges: number;
    score: number;
    coverage: number;
  };
};

export const ARCHITECTURE = [
  {
    title: '01 PDF Processing',
    text: 'Extract structured text using unstructured for standard PDFs or OCR for scans, then clean and chunk for LLM ingestion.'
  },
  {
    title: '02 Knowledge Graph Construction',
    text: 'Extract actors, obligations, deadlines, case numbers, citations, and relationships such as dependencies, contradictions, and procedural sequence.'
  },
  {
    title: '03 HybridRAG Retrieval',
    text: 'Fuse semantic/vector-like chunk retrieval with graph-aware structural retrieval so answers are grounded in both similar language and document relationships.'
  },
  {
    title: 'Visualizations',
    text: 'Conversation State, Executive Function Gaps, Procedural Bottlenecks, and Observer vs Operator divergence are represented here as retrieval diagnostics.'
  }
];

const STOPWORDS = new Set(
  'a an and are as at be because been but by can could did do does for from had has have he her here him his if in into is it its may no not of on or our she should so than that the their them then there these they this to under was were when where which who will with would you your'.split(' ')
);

export const EXPANSIONS: Record<string, string[]> = {
  void: ['nullity', 'jurisdiction', 'dismissed', 'dismissal', 'ab initio', 'vacated', 'lack'],
  jurisdiction: ['subject', 'authority', 'dismissed', 'reinstated', 'void'],
  judgment: ['order', 'foreclosure', 'general', 'entry', 'signed'],
  dismissal: ['dismissed', 'closed', 'reinstated', 'july'],
  stay: ['enjoin', 'pause', 'pending', 'irreparable', 'equities'],
  objection: ['utcr', 'certificate', 'readiness', 'unresolved'],
  foreclosure: ['property', 'title', 'recorded', 'reform', 'reformation'],
  nunc: ['pro', 'tunc', 'retroactive', 'lavitsky'],
  party: ['dismissed', 'entities', 'relief', 'limited'],
  motion: ['orcp', 'summary', 'pending', 'set aside']
};

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9§.\-\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function extractCitations(text: string): string[] {
  const patterns = [
    /\b(?:ORCP|UTCR)\s*\d+(?:\.\d+)?(?:\s*B\(1\)\(d\))?/gi,
    /\b[A-Z][A-Za-z&'. ]+ v\. [A-Z][A-Za-z&'. ]+,\s*\d+\s+Or App\s+\d+(?:,\s*\d+)?(?:,\s*\d+\s*P3d\s*\d+)?\s*\(\d{4}\)/g,
    /\b\d{2}CV\d{5}\b/g
  ];
  return uniq(patterns.flatMap(p => text.match(p) || []).map(x => x.trim())).slice(0, 80);
}

export function extractDates(text: string): string[] {
  return uniq(
    text.match(
      /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+\d{4}\b/gi
    ) || []
  ).slice(0, 80);
}

export function extractEntities(text: string): string[] {
  const found = [
    ...(text.match(/\bAnnika Eriksson\b/g) || []),
    ...(text.match(/\bThe Bank of New York Mellon\b/gi) || []),
    ...(text.match(/\bNewrez, LLC\b/gi) || []),
    ...(text.match(/\bShellpoint Mortgage Servicing\b/gi) || []),
    ...(text.match(/\bChancellor K\. Eagle\b/g) || []),
    ...(text.match(/\bClackamas County\b/g) || []),
    ...(text.match(/\b12054 Chapin Court\b/gi) || []),
    ...(text.match(/\b[A-Z][a-z]+ v\. [A-Z][A-Za-z]+\b/g) || []),
    ...extractCitations(text),
    ...extractDates(text)
  ];
  return uniq(found.map(x => x.replace(/\s+/g, ' ').trim())).filter(Boolean).slice(0, 120);
}

export function chunkDocument(doc: Doc): Chunk[] {
  const clean = doc.text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const parts = clean
    .split(/(?=\n\s*(?:DOCUMENT \d+|I\.|II\.|III\.|OBJECTION|PRAYER FOR RELIEF|DECLARATION|UTCR|MOTION)\b)/i)
    .filter(p => p.trim().length > 120);
  const fallback = parts.length ? parts : clean.match(/[\s\S]{1,1400}(?=\s|$)/g) || [clean];
  return fallback
    .flatMap((part, i) => {
      const slices = part.length > 1800 ? part.match(/[\s\S]{1,1600}(?=\s|$)/g) || [part] : [part];
      return slices.map((slice, j) => {
        const text = slice.trim();
        return {
          id: `${doc.id}-${i}-${j}`,
          docId: doc.id,
          docName: doc.name,
          index: i + j,
          text,
          tokens: tokenize(text),
          entities: extractEntities(text),
          citations: extractCitations(text),
          dates: extractDates(text)
        };
      });
    })
    .filter(c => c.text.length > 80);
}

export function buildEdges(chunks: Chunk[]): Edge[] {
  const edges: Edge[] = [];
  for (const c of chunks) {
    const t = c.text.toLowerCase();
    const add = (from: string, to: string, label: string) =>
      edges.push({
        from,
        to,
        label,
        evidence: c.text.slice(0, 260).replace(/\s+/g, ' ') + '…'
      });
    if (t.includes('dismissed') && t.includes('judgment'))
      add('Dismissal', 'Foreclosure Judgment', 'temporal jurisdiction conflict');
    if (t.includes('july 26, 2019') && t.includes('july 30, 2019'))
      add('July 26 Dismissal', 'July 30 Judgment', 'signed after dismissal');
    if (t.includes('utcr 5.100') && t.includes('certificate'))
      add('UTCR 5.100 Certificate', 'Proposed Judgment', 'readiness defect');
    if (t.includes('orcp 71') || t.includes('set aside'))
      add('ORCP 71 Motion', 'Void Judgment', 'vacatur path');
    if (t.includes('nunc pro tunc'))
      add('Nunc Pro Tunc Theory', 'Void Judgment', 'cannot cure jurisdiction');
    if (t.includes('dismissed as parties') || t.includes('dismissed parties'))
      add('Dismissed Parties', 'Affirmative Relief', 'party status defect');
  }
  return edges.slice(0, 40);
}

export function expandedQuery(query: string): string[] {
  const base = tokenize(query);
  return uniq([...base, ...base.flatMap(t => EXPANSIONS[t] || [])].map(t => t.toLowerCase()));
}

export function scoreChunks(query: string, chunks: Chunk[], edges: Edge[]): RetrievalHit[] {
  const q = expandedQuery(query);
  const qSet = new Set(q);
  const qEntities = extractEntities(query).map(e => e.toLowerCase());
  return chunks
    .map(c => {
      const tokenSet = new Set(c.tokens);
      const matches = q.filter(t => tokenSet.has(t) || c.text.toLowerCase().includes(t));
      const lexical = matches.length / Math.max(1, q.length);
      const semantic = q.reduce((sum, term) => sum + (c.text.toLowerCase().includes(term) ? 1 : 0), 0) / Math.max(1, q.length);
      const entityBoost = qEntities.filter(e => c.text.toLowerCase().includes(e)).length * 0.08;
      const relatedEdges = edges.filter(
        e =>
          c.text.includes(e.evidence.slice(0, 30)) ||
          qSet.has(e.from.toLowerCase()) ||
          qSet.has(e.to.toLowerCase())
      );
      const graph = Math.min(
        1,
        (c.entities.length / 18) * 0.35 + relatedEdges.length * 0.18 + entityBoost
      );
      const score = Math.min(1, lexical * 0.46 + semantic * 0.34 + graph * 0.20);
      return {
        ...c,
        lexical,
        semantic,
        graph,
        score,
        matchedTerms: uniq(matches).slice(0, 16)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export function analyze(query: string, docs: Doc[]): Analysis {
  const chunks = docs.flatMap(chunkDocument);
  const edges = buildEdges(chunks);
  const hits = scoreChunks(query, chunks, edges);
  const allText = docs.map(d => d.text).join('\n');
  const entities = extractEntities(allText);
  const citations = extractCitations(allText);
  const dates = extractDates(allText);
  const coverage = hits.filter(h => h.score > 0.08).length / Math.max(1, Math.min(8, chunks.length));
  const graphDensity = edges.length / Math.max(1, chunks.length);
  const score = Math.round(
    Math.min(100, 35 + coverage * 35 + Math.min(20, graphDensity * 20) + Math.min(10, citations.length / 2))
  );

  const strengths = [
    'Hybrid retrieval surfaces both direct keyword matches and structurally important passages with dates, citations, and procedural dependencies.',
    'The knowledge-graph pass identifies legal anchors such as case numbers, ORCP/UTCR references, party names, and key date conflicts.',
    'For this case set, timeline-heavy issues are well suited to graph augmentation because the core argument depends on event sequence.'
  ];

  const weaknesses = [
    'This browser prototype uses lexical/entity expansion rather than true embeddings, Neo4j, Qdrant, or an LLM extractor, so it tests pipeline shape rather than production accuracy.',
    'Uploaded PDFs are parsed with a lightweight text heuristic; court-ready PDF extraction should use server-side pdftotext/unstructured/OCR.',
    'Contradiction detection is rule-based and may miss nuanced legal relationships not expressed with expected terms.'
  ];

  const recommendations = [
    'Use the consolidated text file for the most reliable local test, then compare top evidence chunks against the original PDFs.',
    'For production, replace the semantic scorer with embeddings and replace rule edges with LLM-extracted triples validated against source spans.',
    'Add gold-standard queries such as “why is the 2019 judgment void?” and “what UTCR 5.100 defect is alleged?” to regression-test retrieval quality.'
  ];

  return {
    query,
    chunks,
    hits,
    entities,
    citations,
    dates,
    edges,
    strengths,
    weaknesses,
    recommendations,
    metrics: {
      docs: docs.length,
      chunks: chunks.length,
      entities: entities.length,
      edges: edges.length,
      score,
      coverage: Math.round(coverage * 100)
    }
  };
}
