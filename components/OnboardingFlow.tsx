"use client";

import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { ArrowRight, Shield, UploadCloud, FileText, Activity, BrainCircuit, CheckCircle2, FlaskConical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

import { runEngineAnalysis } from "@/lib/research/pipeline";
import type { EngineAnalysis, NormalizedActivity } from "@/lib/research/types";

type Step = "welcome" | "upload" | "processing" | "results" | "donate";

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("welcome");
  const [data, setData] = useState<NormalizedActivity[]>([]);
  const [analysis, setAnalysis] = useState<EngineAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [donationStatus, setDonationStatus] = useState<"idle" | "donating" | "success">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated progress bar for processing step
  useEffect(() => {
    if (step === "processing") {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setStep("processing");
    setError(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        runPipeline(results.data as any[]);
      },
      error: (err: any) => {
        setError(err.message);
        setStep("upload");
      }
    });
  };

  const runDemoMode = async () => {
    setStep("processing");
    setError(null);
    try {
      const response = await fetch("/data/rescuetime-n1.csv");
      if (!response.ok) throw new Error("Failed to load demo data");
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          runPipeline(results.data as any[]);
        },
        error: (err: any) => {
          setError(err.message);
          setStep("upload");
        }
      });
    } catch (err: any) {
      setError(err.message);
      setStep("upload");
    }
  };

  const runPipeline = (rows: any[]) => {
    setTimeout(() => {
      try {
        const mapped: NormalizedActivity[] = [];
        for (const row of rows) {
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

        if (mapped.length > 0) {
          const result = runEngineAnalysis(mapped, {
            windowDays: 90,
            minFileTouches: 1,
            actionInclude: [],
            actionExclude: []
          }, {
            binHours: 4,
            dbscanEps: null,
            dbscanMinSamples: 3,
            similarityLag: 3
          });
          setAnalysis(result);
          setStep("results");
        } else {
          setError("No valid activity data found in CSV.");
          setStep("upload");
        }
      } catch (err: any) {
        setError(err.message);
        setStep("upload");
      }
    }, 1000); // Artificial delay to show progress bar
  };

  const handleDonate = () => {
    setDonationStatus("donating");
    setTimeout(() => {
      setDonationStatus("success");
      setTimeout(() => setStep("donate"), 1000); // Move to final thank you
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* STEPS HEADER */}
      <div className="flex items-center justify-between mb-8 px-4 text-sm font-medium">
        <div className={`flex flex-col items-center gap-2 ${step === "welcome" ? "text-brand-blue" : "text-slate-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "welcome" ? "bg-brand-blue text-white" : "bg-slate-100"}`}>1</div>
          <span>Consent</span>
        </div>
        <div className="h-px bg-slate-200 flex-1 mx-4"></div>
        <div className={`flex flex-col items-center gap-2 ${step === "upload" || step === "processing" ? "text-brand-blue" : "text-slate-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "upload" || step === "processing" ? "bg-brand-blue text-white" : "bg-slate-100"}`}>2</div>
          <span>Data</span>
        </div>
        <div className="h-px bg-slate-200 flex-1 mx-4"></div>
        <div className={`flex flex-col items-center gap-2 ${step === "results" ? "text-brand-blue" : "text-slate-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "results" ? "bg-brand-blue text-white" : "bg-slate-100"}`}>3</div>
          <span>Snapshot</span>
        </div>
        <div className="h-px bg-slate-200 flex-1 mx-4"></div>
        <div className={`flex flex-col items-center gap-2 ${step === "donate" ? "text-brand-blue" : "text-slate-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "donate" ? "bg-brand-blue text-white" : "bg-slate-100"}`}>4</div>
          <span>Impact</span>
        </div>
      </div>

      {/* CONTENT AREAS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[400px]">
        
        {/* STEP 1: WELCOME */}
        {step === "welcome" && (
          <div className="p-10">
            <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-6 text-brand-teal">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Get Your Cognitive Snapshot</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              In less than 5 minutes, you can map your cognitive fragmentation score. 
              We use percolation theory to analyze your digital trace data, providing an objective look at your task switching, focus depth, and network breakdown.
            </p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Our Data Contribution Promise</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We will never sell your data, you can delete it anytime, and you'll see exactly how aggregated insights improve the model. This entire analysis runs <strong>locally in your browser</strong>—your raw data never touches our servers.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep("upload")} size="lg" className="bg-brand-blue hover:bg-brand-blue-hover text-white px-8 rounded-xl w-full sm:w-auto text-lg flex items-center gap-2">
              Start Free Analysis <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* STEP 2: UPLOAD */}
        {step === "upload" && (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Your Data</h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Upload a <strong>RescueTime Activity Export (.csv)</strong> covering at least 30 days. The more data, the more accurate your percolation network will be.
            </p>

            <div 
              className="border-2 border-dashed border-slate-300 rounded-3xl p-12 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
              />
              <UploadCloud className="w-12 h-12 text-slate-400 group-hover:text-brand-blue mx-auto mb-4 transition-colors" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">Click to browse or drag and drop</h3>
              <p className="text-sm text-slate-500">CSV file containing Activity, Category, Date, and Time columns</p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Or</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <Button onClick={runDemoMode} variant="outline" className="mt-8 w-full sm:w-auto border-slate-300 text-slate-600 hover:bg-slate-50 flex items-center gap-2 mx-auto">
              <Play className="w-4 h-4" /> Run with Open Source Demo Data
            </Button>
          </div>
        )}

        {/* STEP 3: PROCESSING */}
        {step === "processing" && (
          <div className="p-16 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mb-8 relative">
               <FlaskConical className="w-10 h-10 text-brand-blue animate-pulse" />
               <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="301.59" strokeDashoffset={301.59 - (progress / 100) * 301.59} className="text-brand-teal transition-all duration-300 ease-out" />
               </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Simulating Network Percolation</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Applying DBSCAN clustering to your behavioral trace data. Extracting modalities and mapping cognitive state limits...
            </p>
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}

        {/* STEP 4: RESULTS */}
        {step === "results" && analysis && (
          <div className="p-10 bg-slate-50">
            <div className="mb-8 text-center">
               <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Cognitive Snapshot</h2>
               <p className="text-slate-600">Based on {data.length.toLocaleString()} activities over {(analysis.summary.dataQualityScore)} quality days.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Fragmentation Score</p>
                  <h3 className="text-5xl font-black text-emerald-900 mb-2">{(analysis.percolation.fragmentation * 100).toFixed(1)}%</h3>
                  <p className="text-sm text-emerald-700/80">Network Breakdown State</p>
                </CardContent>
              </Card>
              <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">System Type</p>
                  <h3 className="text-3xl font-black text-indigo-900 mb-3 mt-2">{analysis.classification.systemType}</h3>
                  <p className="text-sm text-indigo-700/80">{analysis.classification.systemLabel}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200 shadow-sm mb-8">
              <CardContent className="p-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-teal" /> Network Criticality
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Your working memory giant component fractures at a critical threshold of <strong>{analysis.percolation.criticalThreshold.toFixed(2)}</strong>. 
                  You are currently <strong>{(analysis.distanceToPercolationThreshold * 100).toFixed(1)}%</strong> away from systemic fragmentation (task paralysis).
                </p>
                <Progress value={(1 - analysis.distanceToPercolationThreshold) * 100} className="h-3" />
                <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                  <span>Stable</span>
                  <span>Critical (Paralysis)</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setStep("donate")} size="lg" className="flex-1 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl">
                Contribute Anonymized Metrics to EFOS Research
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: DONATE / CTA */}
        {step === "donate" && (
          <div className="p-10 text-center">
            {donationStatus === "success" ? (
              <div className="py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
                <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
                  Your anonymized network metrics have been securely added to the EFOS Open Science dataset. You are directly contributing to the future of computational psychiatry.
                </p>
                <Button onClick={() => window.location.href = '/open-human-pilots'} variant="outline" className="border-slate-300">
                  View Full Report Details
                </Button>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Donate Your Metrics</h2>
                <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
                  By clicking donate, you agree to share your <strong>anonymized fragmentation score and cluster counts</strong> with the EFOS Research Network. No raw files, timestamps, or personal data will ever be transmitted.
                </p>

                <div className="max-w-md mx-auto space-y-4">
                  <Button 
                    onClick={handleDonate} 
                    size="lg" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                    disabled={donationStatus === "donating"}
                  >
                    {donationStatus === "donating" ? "Securely Transmitting..." : "Yes, Donate Anonymized Metrics"}
                  </Button>
                  <Button onClick={() => window.location.href = '/open-human-pilots'} variant="ghost" className="w-full text-slate-500 hover:text-slate-800">
                    Skip & View Full Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
