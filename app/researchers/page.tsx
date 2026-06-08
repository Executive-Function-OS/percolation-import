"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Users, Database, Github, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function ResearchersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--indigo-dim)] pb-20">
      {/* Header */}
      <header className="border-b border-border bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-5 py-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2 text-brand-blue">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">For Researchers</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Executive Function OS (EFOS) is an open-science platform applying percolation theory and computational network analysis to cognitive modeling.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 mt-12 space-y-16">
        
        {/* Methodology & Framework */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 border-b border-border pb-2">Methodology & Framework</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-teal">Percolation-Theoretic Cognitive Modeling</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our core framework treats "Observer" and "Operator" states as networked processes bridged by executive-function nodes. We use DBSCAN to identify irregular behavioral clusters from digital trace data, and construct network edges based on temporal adjacency and semantic co-occurrence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By modeling how these networks fragment under stress, we aim to quantify task paralysis and decision friction outside of traditional clinical diagnostic boundaries.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Github className="w-5 h-5 text-slate-600" />
                Open Science & Reproducibility
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span><strong>Open Source:</strong> Core engine and analysis pipelines are open to audit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span><strong>Pre-Registration:</strong> Forthcoming protocols on the Open Science Framework (OSF).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span><strong>Client-Side Processing:</strong> Local computation pipeline for secure data handling.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Collaboration Tiers */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Collaboration Opportunities</h2>
            <p className="text-slate-600">
              We are actively seeking interdisciplinary partnerships across computational psychiatry, network science, and cognitive psychology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-brand-blue">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Core Collaborators</h3>
              <p className="text-sm text-slate-600 mb-4">
                For researchers looking to co-author methodology papers, design validation studies, and integrate EFOS into existing grant proposals.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-brand-teal">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Affiliate Researchers</h3>
              <p className="text-sm text-slate-600 mb-4">
                For labs interested in testing our models, providing methodological feedback, or applying our open-source tools to their own cohorts.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-[var(--indigo)]">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Contributors</h3>
              <p className="text-sm text-slate-600 mb-4">
                For N=1 self-trackers and pilot participants willing to donate anonymized longitudinal data for model training and refinement.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-xl text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Research Team
            </Button>
          </div>
        </section>

        {/* Resources */}
        <section className="bg-brand-dark rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-brand-teal">Academic Resources</h2>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-brand-teal transition-colors">EFOS Methodology Preprint (Draft)</h4>
                  <p className="text-sm text-slate-400">Detailed explanation of the DBSCAN and percolation pipeline.</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-brand-teal" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-brand-teal transition-colors">API Documentation (Beta)</h4>
                  <p className="text-sm text-slate-400">Integrate the EFOS HybridRAG engine into your analysis workflows.</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-brand-teal" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-brand-teal transition-colors">Open Science Framework (OSF) Project</h4>
                  <p className="text-sm text-slate-400">Pre-registrations, IRB templates, and reproducibility scripts.</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-brand-teal" />
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section>
          <NewsletterSignup />
        </section>
      </main>
    </div>
  );
}
