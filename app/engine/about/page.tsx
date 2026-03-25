import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/engine"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to engine
      </Link>
      <h1 className="ef-heading mb-2 text-3xl font-bold text-[#1E40AF]">About this research</h1>
      <p className="mb-8 text-muted-foreground">
        Executive Function OS — BMS 4.0 Percolation Engine: a collaborative, exploratory platform
        for cognitive network signals in digital trace data.
      </p>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Principal developer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Annika Eriksson — architecture, implementation, and research framing.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Collaborator acknowledgments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Computational biology:</strong> network topology and phase-transition metaphors;
              DBSCAN suggested over k-means for irregular behavioral modes.
            </p>
            <p>
              <strong>Cognitive networks / N=1:</strong> methodology alignment with intensive
              longitudinal self-measurement traditions.
            </p>
            <p>
              <strong>Rarebrain Institute framing:</strong> observable (Tier 1) vs substrate (Tier 2)
              interpretations in the UI copy and metrics.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open science</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Source code is intended for audit and replication. Aggregated anonymized metrics may be
              published as the research program matures; no file names or contents are collected by
              this client-only build.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
