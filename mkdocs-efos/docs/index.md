---
hide:
  - navigation
  - toc
---

# Executive Function OS (EFOS)

## Privacy-Preserving Digital Phenotyping Infrastructure

<div class="grid cards" markdown>

-   :material-run-fast: **Demo** · **Run the interactive simulation**
-   :material-chart-line: **Methodology** · **From behavioral trace to structural phenotype**
-   :material-code-braces: **Tools** · **Integrate with analysis pipelines**
-   :material-science: **Research** · **Computational psychiatry & digital phenotyping**

</div>

<p style="font-size: 1.2rem;">
Executive Function OS (EFOS) is an open-source, client-side framework that converts naturalistic behavioral trace data into quantitative structural phenotypes of executive function using DBSCAN clustering and percolation-based network analysis.
</p>

## :material-account-group: Core Audiences & Enablement

=== "🧠 Researchers & Clinicians"

    Explore the percolation model, DBSCAN pipeline, and how client-side processing enables quantitative digital phenotyping for privacy-sensitive cohorts. See the [Methodology](methodology.md) and [Research](research.md) sections.

=== "📊 Data Pipeline Integrators"

    Leverage our structured local outputs (PDF, GraphML, CSV, JSON) for downstream statistical analysis and AI pipelines without exposure of raw interaction data. See the [Tools](tools.md) page.

=== "🛠️ Code Contributors & Auditors"

    Audit our local calculation core or contribute to the open codebase. Read the [architecture overview](https://github.com/erikssonaicloud-gif/percolation-import) and explore the [HybridRAG pipeline](methodology.md#hybridrag-expansion).

---

## About the Project

EFOS is a privacy-preserving digital phenotyping infrastructure for computational psychiatry and life-sciences research. By modeling how cognitive interaction networks fragment under simulated stress, it translates passive behavioral trace data into reproducible structural metrics of executive function. All computation runs locally – no raw data leaves the user’s device.

[Check the Demo :material-arrow-right:](demo.md){ .md-button .md-button--primary }
[Read the full methodology :material-arrow-right:](methodology.md){ .md-button }

!!! info "Privacy-first design"
    All processing happens in your browser. No file contents or activity traces are uploaded to any server. EFOS is a research tool, not a clinical diagnostic.

