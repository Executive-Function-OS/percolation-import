import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/engine"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to engine
      </Link>
      <h1 className="ef-heading mb-2 text-3xl font-bold text-[#1E40AF]">How BMS 4.0 works</h1>
      <p className="mb-8 text-muted-foreground">
        Open methodology summary. Algorithms run entirely in your browser; this page describes the
        research intent, not a clinical claim.
      </p>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Theoretical framework</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm text-muted-foreground">
            <p>
              Digital interactions are modeled as a graph where stress proxies (sprawl, switching,
              repeated returns) play a role analogous to a percolation parameter. Phase-like
              transitions are heuristics for research visualization, not physical law claims about
              cognition.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>DBSCAN clustering</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm text-muted-foreground">
            <p>
              Density-based spatial clustering of applications with noise (DBSCAN) separates dense
              behavioral modes from sparse &quot;noise&quot; periods that may correspond to spawning
              unrelated sub-problems. Eps can be auto-tuned via silhouette score over a candidate
              grid.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Network construction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm text-muted-foreground">
            <p>
              Time bins are nodes. Edges combine temporal adjacency, shared cluster membership within
              a lag window, and file co-occurrence (Jaccard overlap). Weights incorporate a sunk-cost
              proxy from repeat depth within each bin.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Validation & limitations</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm text-muted-foreground">
            <p>
              Ground-truth crisis dates are user-annotated; predictive statistics require
              prospective studies and IRB oversight. N=1 designs (e.g., dense self-tracking) can
              complement population work when hypotheses are pre-registered.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
