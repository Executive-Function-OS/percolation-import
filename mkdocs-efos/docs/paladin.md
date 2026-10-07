# PALADIN: Computational Legal Biophysics & Docket Integrity Network

[![Live Portal](https://img.shields.io/badge/Web%20Portal-Live-38bdf8.svg)](https://executive-function-os.github.io/paladin/)
[![GitHub](https://img.shields.io/badge/GitHub-Executive--Function--OS%2Fpaladin-10b981.svg)](https://github.com/Executive-Function-OS/paladin)
[![Rule 8 Gate](https://img.shields.io/badge/Rule%208(a)(2)%20Gate-100%25%20PASS-brightgreen.svg)](https://executive-function-os.github.io/paladin/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://github.com/Executive-Function-OS/paladin/blob/main/LICENSE)

## Overview

**P.A.L.A.D.I.N.** (Pleadings, Audit, Litigation Analytics, & Docket Integrity Network) is an explainable computational law and forensic docket auditing platform developed under the **Executive Function OS (EFOS)** and **Precedent Systems** research umbrella.

While EFOS analyzes how personal cognitive interaction networks fragment under simulated stress to generate quantitative digital phenotypes, **PALADIN** applies biophysical simulation mechanics to protect traumatized and neurodivergent litigants from procedural forfeiture in federal court.

<div class="grid cards" markdown>

-   :material-web: **[Interactive Research Portal](https://executive-function-os.github.io/paladin/)** · Live Cellular Potts Model simulation, trajectory explorer, and manuscript reader.
-   :material-github: **[GitHub Repository](https://github.com/Executive-Function-OS/paladin)** · Complete Python 3.10+ engine, AST pleading parser, and Rule 8 screening gate.
-   :material-file-document-outline: **[Academic Pre-Print](https://github.com/Executive-Function-OS/paladin/blob/main/docs/PALADIN_Academic_Preprint_Manuscript.md)** · *Multi-Scale Forensic Informatics, Monte Carlo Energy Minimization, and Cellular Potts Modeling for Pro Se Civil Rights Defense*.
-   :material-scale-balance: **[Case Study: Eriksson v. Oregon City](https://executive-function-os.github.io/paladin/#case-study)** · Empirical validation across Case No. 3:26-cv-01885-IM (D. Or., Immergut, J.).

</div>

---

## The Neurodivergent Cognitive Bottleneck in Pro Se Defense

Pro se litigants facing severe municipal overreach or utility deprivation experience documented trauma, executive dysfunction, and decision paralysis. Under stress, natural human cognition produces hyper-associative, highly detailed narratives attempting to capture the entire systemic injustice at once.

In federal court, however, **Federal Rule of Civil Procedure 8(a)(2)** requires a *"short and plain statement of the claim."* Federal screening judges routinely dismiss narrative-dense complaints that introduce non-party entities or anticipate affirmative defenses.

PALADIN functions as an **externalized executive function prosthesis**:
1. **Parses Pleading AST**: Extracts counts, elements, and factual statements into discrete lattice tokens.
2. **Flags Procedural Entropy**: Identifies non-party noise, preambles, and uncorroborated assertions.
3. **Applies Simulated Annealing**: Spontaneously collapses bloated pleadings into compact 5-element claim clusters.
4. **Enforces Evidentiary Anchoring**: Requires 100% of factual assertions to bind to immutable, Bates-stamped exhibits.

---

## The Biophysical Mathematical Formulation

PALADIN establishes a rigorous isomorphism with the **Graner-Glazier Cellular Potts Model (CPM)** of biological tissue morphogenesis:

$$\mathcal{H}_{\text{legal}} = \mathcal{H}_{\text{corroboration}} + \mathcal{H}_{\text{sufficiency}} - \mathcal{H}_{\text{chemotaxis}} + \mathcal{H}_{\text{defect}}$$

### 1. Corroboration Adhesion ($\mathcal{H}_{\text{corroboration}}$)
$$\mathcal{H}_{\text{corroboration}} = \sum_{\langle i, j \rangle} J(\tau_i, \tau_j)(1 - \delta_{\sigma_i, \sigma_j})$$
- Verified documents coupled to matching claims yield negative adhesion ($J = -4.0$).
- Uncorroborated hearsay repels with positive energy ($J = +6.0$).
- Non-party narrative poison generates severe energetic penalties ($J = +18.0$).

### 2. Element Volume Elasticity ($\mathcal{H}_{\text{sufficiency}}$)
$$\mathcal{H}_{\text{sufficiency}} = \lambda_v \sum_{\sigma} (V(\sigma) - V_0)^2$$
Penalizes both under-pleading (missing essential statutory elements under Rule 12(b)(6)) and over-pleading (violating Rule 8(a)(2)).

### 3. Infinite Defect Barrier ($\mathcal{H}_{\text{defect}}$)
$$\mathcal{H}_{\text{defect}} = \sum_k \Omega_k$$
Assigns infinite energy barriers ($\Omega = 1000.0$) to fatal defects (e.g., non-party claims, unserved entities, defense negation).

---

## Longitudinal Case Study: *Eriksson & Buckhout v. City of Oregon City*

Evaluated across the 3-stage lifecycle in the District of Oregon (Case No. 3:26-cv-01885-IM):

| Metric | [Phase 1] Initial (ECF 1/4) | [Phase 2] Screening (ECF 8) | [Phase 3] Native State (ECF 9) |
| :--- | :--- | :--- | :--- |
| **Filing Date** | Sept 9, 2026 | Sept 14, 2026 | Oct 5, 2026 |
| **Length** | 33 Pages (8,420 words) | 6 Pages (1,840 words) | 15 Pages (4,310 words) |
| **Non-Party Violations** | 🚨 6 Fatal Entanglements | Screening Notice Issued | ✓ 0 Purged Clean |
| **Defect Penalty ($\Omega$)** | 6,750.0 | Potential Barrier | 0.0 (Eliminated) |
| **Sufficiency Error ($\lambda_v$)** | 1,692.8 (Bloated) | Element Mandate | 50.0 (Balanced) |
| **Total Hamiltonian ($\mathcal{H}$)** | 9,102.8 (High Chaos) | Judicial Quench | 92.0 (Ground State) |
| **Evidentiary Coverage (ECR)** | 48.0% | Defect Flagged | 100.0% Pinned |
| **Rule 8(a)(2) Gate** | ❌ **FAIL (DISMISSED)** | **LEAVE TO AMEND** | ✅ **PASS (100% READY)** |

---

## Quickstart

```bash
# Clone the PALADIN repository
git clone https://github.com/Executive-Function-OS/paladin.git
cd paladin

# Run pleading ingestion and Metropolis simulation
python3 src/ingest_to_cpm.py --pleading data/FIRST_AMENDED_CIVIL_RIGHTS_COMPLAINT.md --run-cpm

# Generate visual report
python3 src/view_cpm_trajectory.py --html reports/cpm_report.html

# Run full federal case lifecycle audit
python3 src/audit_full_federal_case.py
```

## Links & Resources

* **Live Web Portal**: [https://executive-function-os.github.io/paladin/](https://executive-function-os.github.io/paladin/)
* **GitHub Repository**: [https://github.com/Executive-Function-OS/paladin](https://github.com/Executive-Function-OS/paladin)
* **DocSplit Integration**: [https://github.com/Precedent-Systems/DocSplit](https://github.com/Precedent-Systems/DocSplit)
* **EFOS Main Demo**: [https://demo.executivefunctionos.com/](https://demo.executivefunctionos.com/)
