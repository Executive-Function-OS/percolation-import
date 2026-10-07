# Tools & Framework Comparisons

## BMS 4.0 Percolation Engine

[**Analysis Engine**](/engine) — Client-side only. OAuth data ingestion and percolation exports. 
All processing stays in your browser — zero server access to your Drive.

> **Research-grade privacy.** [Audit source](https://github.com/Executive-Function-OS/percolation-import)

---

## Phase Simulator

[**Interactive Visualization**](/simulator) — Watch how increasing stress degrades executive bridges between Observer and Operator.

**Cognitive State Percolation:** Executive bridge links fail at 1.5× probability compared to internal cluster nodes under simulated cognitive load.

---

## Compare Section: Digital Phenotyping Frameworks

To contextualize EFOS within the computational psychiatry landscape, the following matrix compares EFOS with the two leading open-source digital phenotyping platforms:

| Feature / Metric | mindLAMP (Cortex) | Beiwe | Executive Function OS (EFOS) |
| :--- | :--- | :--- | :--- |
| **Primary Focus** | Active surveys & passive sensor logs | High-throughput raw passive sensors | Passive naturalistic trace processing |
| **Architecture** | Centralized server database | Centralized backend service center | **Fully local client-side (Zero-Knowledge)** |
| **Model Type** | Statistical time-series features | High-throughput behavioral metrics | **Percolation network analysis + DBSCAN** |
| **Data Ingestion** | Custom app logs, centralized API | Custom app logs, centralized API | Local document/activity trace import (OAuth) |
| **Cohort Suitability** | General clinical studies | Monitored clinical cohorts | **Privacy-sensitive research cohorts** |
| **Diagnostics** | Research/clinical capture support | Research capture support | **Research tool (Not a clinical diagnostic)** |

### Differentiating Claims

1. **Fully Local Computation:** Unlike mindLAMP and Beiwe, which rely on centralized databases and server-side feature extraction, EFOS executes all algorithms (DBSCAN and percolation graphs) directly on the user's device. No raw trace data leaves the client.
2. **Structural percolation modeling:** Instead of simple statistical aggregates of activity, EFOS models the structural topology of executive function as a network, estimating percolation thresholds ($p_c$) to model task-paralysis states.
3. **Privacy-Preserving Outputs:** EFOS generates structured phenotypes (PDF, GraphML, CSV, JSON) directly on-device. Researchers receive high-level network metrics rather than raw interaction logs, drastically reducing IRB friction.

---

## PALADIN: Forensic Docket Auditing & Legal Biophysics Engine

[**PALADIN Research Portal & Simulator**](https://executive-function-os.github.io/paladin/) · [**Documentation**](paladin.md)

PALADIN formalizes the isomorphism between the Cellular Potts Model (CPM) of biophysical tissue morphogenesis and court evidentiary structures, providing pro se litigants with an externalized executive function prosthesis.

* **Simulation Engine**: Metropolis Monte Carlo simulated annealing minimizing pleading entropy.
* **Procedural Safeguard**: Automatic Rule 8(a)(2) defect purging and 5-element claim volume enforcement.
* **Zero External Overhead**: 100% local Python 3.10+ execution with zero API or token costs.
* **Source Repository**: [github.com/Executive-Function-OS/paladin](https://github.com/Executive-Function-OS/paladin)

---

## Upcoming Tools

- **Conversation State Visualizer** (Knowledge Graph + Timeline)
- **Executive Function Gap Detector** (LLM Pattern Detection)
- **Procedural Bottleneck Analyzer** (Graph Analysis)
- **Observer/Operator Divergence Tracker** (Text Classification)

