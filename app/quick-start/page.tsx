"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OnboardingFlow from "@/components/OnboardingFlow";

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[var(--indigo-dim)] pb-20">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-5 py-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 mt-12">
        <OnboardingFlow />
      </main>
    </div>
  );
}
