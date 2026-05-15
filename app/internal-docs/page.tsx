"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Lock } from "lucide-react";

export default function InternalDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Internal Drafts & Documents</h1>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 mt-10 space-y-12">
        {/* Collaboration Pitch */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 max-w-none">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
            <div className="p-3 bg-blue-50 text-brand-blue rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Collaboration Pitch</h2>
              <p className="text-sm text-slate-500">1-page outreach document for potential lab partners.</p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">The Problem</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Traditional assessments of executive function (EF) rely on cross-sectional self-reports (like the BDEFS or BRIEF-A) or artificial lab-based tasks that often fail to capture real-world cognitive friction and task paralysis. We lack objective, continuous measures of EF in naturalistic settings.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">The Proposal</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Executive Function OS (EFOS) is an open-science platform that models cognitive network fragmentation using percolation theory. We project longitudinal digital trace data (e.g., Google Workspace activity) into a multidimensional state space and apply DBSCAN clustering to identify behavioral irregularites and network connectivity under stress.
          </p>
          <p className="text-slate-600 mb-4 leading-relaxed">
            We are launching our <strong>first intensive longitudinal N=1 validation study</strong> (N=30-50) and are seeking an academic partner to collaborate on the clinical validation, data analysis, and co-authorship of the resulting paper.
          </p>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">The Study Design</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">A hybrid 8-week intensive longitudinal study evaluating the convergent validity of our client-side computed "Fragmentation Score."</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Data Collection:</strong> Participants run our zero-knowledge, client-side engine on ≥6 months of digital trace data.</li>
            <li><strong>Clinical Measures:</strong> Baseline and endpoint BDEFS, BRIEF-A, PHQ-9, GAD-7, and PSS-10.</li>
            <li><strong>EMA:</strong> Weekly 3-minute ecological momentary assessments of subjective EF and life events.</li>
            <li><strong>Hypothesis:</strong> EFOS fragmentation scores will correlate strongly with BDEFS/BRIEF-A scores and demonstrate temporal stability, offering a novel digital phenotype for task paralysis.</li>
          </ul>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">Why Collaborate?</h3>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Novel Methodology:</strong> Be at the forefront of applying percolation theory and complex network analysis to computational psychiatry.</li>
            <li><strong>Privacy-First Data:</strong> Our architecture processes data entirely client-side; participants only donate anonymized derived metrics, bypassing typical digital phenotyping privacy hurdles.</li>
            <li><strong>Ready-to-Deploy Infrastructure:</strong> The software, onboarding flow, and data extraction pipelines are already built and ready to collect data.</li>
          </ul>

          <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">The Ask</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">We are looking for a partner to:</p>
          <ol className="list-decimal pl-6 text-slate-600 mb-4 space-y-2">
            <li>Provide feedback on the clinical measure battery and study design.</li>
            <li>Serve as the academic anchor/IRB sponsor for the validation study.</li>
            <li>Co-author the methodology and validation findings for submission to journals such as <em>Computational Psychiatry</em> or <em>Nature Mental Health</em>.</li>
          </ol>
          <p className="text-slate-600 mb-4 leading-relaxed">I would love to schedule a 20-minute call to show you a demo of the engine and discuss potential alignment.</p>
        </section>

        {/* OSF Pre-Registration */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 max-w-none">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
            <div className="p-3 bg-indigo-50 text-[var(--indigo)] rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">OSF Pre-Registration Template</h2>
              <p className="text-sm text-slate-500">Formal study design and analysis plan for Open Science Framework.</p>
            </div>
          </div>

          <p className="text-slate-600 mb-4 leading-relaxed"><strong>Study Title:</strong> Validating a Percolation-Based Digital Phenotype of Executive Function Fragmentation: An Intensive Longitudinal Study with Convergent Cognitive and Clinical Measures</p>

          <h3 className="text-xl font-bold text-[var(--indigo)] mt-8 mb-4">1. Study Information</h3>
          <p className="text-slate-600 mb-4 leading-relaxed"><strong>Description:</strong> This study evaluates the convergent and divergent validity of the Executive Function OS (EFOS) fragmentation score, a novel digital phenotype based on percolation theory and computational network analysis of digital trace data.</p>

          <h3 className="text-xl font-bold text-[var(--indigo)] mt-8 mb-4">2. Design Plan</h3>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Study Type:</strong> Observational Study</li>
            <li><strong>Blinding:</strong> No blinding is involved in this study.</li>
            <li><strong>Study Design:</strong> A hybrid design combining an intensive longitudinal N=1 arm (weekly measurements for 8 weeks) with a cross-sectional group comparison using baseline survey data.</li>
          </ul>

          <h3 className="text-xl font-bold text-[var(--indigo)] mt-8 mb-4">3. Sampling Plan</h3>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Existing Data:</strong> Registration prior to creation of data.</li>
            <li><strong>Data Collection Procedures:</strong> Participants will be recruited via the EFOS platform, academic partners, and Quantified Self communities. Participants must be adults (18-65) with daily active use of Google Workspace over the past 6 months. After providing tiered informed consent, participants will run the EFOS client-side engine to generate derived network metrics (fragmentation score, system type). They will complete a baseline clinical battery, 8 weeks of EMA (Ecological Momentary Assessment), and an endpoint clinical battery.</li>
            <li><strong>Sample Size:</strong> Target N = 30-50 participants.</li>
            <li><strong>Sample Size Rationale:</strong> 30 participants provides 80% power to detect a correlation of r = 0.5 (alpha = 0.05) for convergent validity.</li>
          </ul>

          <h3 className="text-xl font-bold text-[var(--indigo)] mt-8 mb-4">4. Variables</h3>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Primary Predictor:</strong> EFOS Fragmentation Score (continuous) and EFOS System Type (categorical: Solvable, Complex Navigable, Corrupted, Paradox).</li>
            <li><strong>Primary Outcomes:</strong> BDEFS total score, BRIEF-A score.</li>
            <li><strong>Secondary Outcomes:</strong> PHQ-9, GAD-7, PSS-10.</li>
            <li><strong>EMA Variables:</strong> Weekly single-item EF difficulty rating (0-10), PSS-4, PHQ-2, Life event checklist.</li>
          </ul>

          <h3 className="text-xl font-bold text-[var(--indigo)] mt-8 mb-4">5. Analysis Plan</h3>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>H1 (Convergent Validity):</strong> Pearson correlation between baseline EFOS fragmentation score and baseline BDEFS total score.</li>
            <li><strong>H2 (System Type Differences):</strong> MANOVA comparing BDEFS and BRIEF-A subscales across the 4 EFOS System Types, followed by post-hoc Tukey tests.</li>
            <li><strong>H3 (Temporal Stability & Sensitivity):</strong> Intraclass correlation coefficient (ICC) for weekly fragmentation scores. Multilevel modeling will test if self-reported life events significantly predict intra-individual variance in fragmentation scores.</li>
            <li><strong>H4 (Divergent Validity):</strong> Steiger’s Z-test will compare the correlation magnitude between (EFOS Score & BDEFS) versus (EFOS Score & Cognitive Task Performance).</li>
          </ul>
          
          <p className="text-slate-600 mb-4 leading-relaxed"><strong>Transformations:</strong> Raw digital trace data will be transformed client-side via DBSCAN clustering and percolation network modeling. Only derived metrics (node counts, edge weights, percolation thresholds) will be exported to the research dataset.</p>
          <p className="text-slate-600 mb-4 leading-relaxed"><strong>Inference Criteria:</strong> We will use standard criteria (p &lt; .05, two-tailed) for statistical significance.</p>

          <h3 className="text-xl font-bold text-[var(--indigo)] mt-8 mb-4">6. Other</h3>
          <p className="text-slate-600 mb-4 leading-relaxed"><strong>Data Sharing:</strong> De-identified, aggregated dataset and analysis scripts will be made publicly available upon publication. Code for the client-side EFOS extraction engine is fully open source.</p>
        </section>
      </main>
    </div>
  );
}
