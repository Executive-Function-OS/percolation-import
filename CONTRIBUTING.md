# Contributing to Executive Function OS (EFOS)

Thank you for your interest in contributing to EFOS! This project represents a collaboration between software engineers, network scientists, and computational psychiatry researchers. Our goal is to build privacy-preserving digital phenotyping infrastructure for life-sciences research.

By contributing to this project, you help advance open-source, reproducible methodology in cognitive assessment and computational psychiatry.

---

## 🔒 The Core Commandment: Local-Only Computation

To protect participant privacy and maintain compliance with Institutional Review Boards (IRB) and international data protection standards (GDPR/HIPAA):

1. **No Data Exfiltration:** All naturalistic interaction logs, document metadata, and activity traces MUST be processed exclusively in the client's browser sandbox.
2. **Zero-Knowledge API:** No server-side endpoints may receive raw interaction or document logs. All network construction, DBSCAN clustering, and phase transition modeling must occur locally.
3. **Anonymized Export:** Exported files (e.g., GraphML, Metrics Package JSON) must contain ONLY structural graph topologies and aggregated metrics. No personally identifiable information (PII), raw text content, filenames, or specific document identifiers may be exported.

Any Pull Request that violates local-only processing or risks exposing raw user traces will be rejected immediately.

---

## 👥 Collaborative Roles

EFOS welcomes contributions from two primary tracks:

### 1. Methods & Clinical Collaborators (Research Track)
* **OSF Pre-registration:** Help write and refine our clinical validation protocols on the Open Science Framework (OSF).
* **Validation Studies:** Sponsor IRB protocols to test EFOS phase transitions ($p_c$) against gold-standard cognitive assessments (CANTAB, BRIEF-A, BDEFS).
* **Advisors:** Suggest new network perturbation models, mode-clustering algorithms, or behavioral Mode metrics.

### 2. Software Developers (Technical Track)
* **Adapters:** Build new local ingestors for activity streams (e.g., window managers, local filesystem logs).
* **Performance:** Optimize DBSCAN clustering and graph fragmentation computations to run efficiently on lower-spec client devices.
* **Visualization:** Improve interactive phase-transition curves and real-time observer-operator graph rendering.

---

## 🛠️ Contribution Workflow

We follow a standard Git branch-and-merge model:

1. **Find or Open an Issue:** Before writing code, ensure a GitHub Issue exists describing the bug or feature.
2. **Branching Strategy:**
   * Fork the repository and create your branch from `main`: `git checkout -b feature/your-feature-name`.
   * Keep branch scopes small and focused.
3. **Write Tests:** If adding a new metric, adapter, or classifier, you MUST write corresponding unit tests using Vitest in the appropriate `__tests__` directory.
4. **Local Verification:**
   * Run the linter: `npm run lint`
   * Run the test suite: `npm run test`
   * Build the project: `npm run build`
5. **Open a Pull Request:** Submit a PR against the `main` branch. Provide a clear description of changes, link to the relevant Issue, and attach test coverage details if applicable.

---

## 🧪 Testing Philosophy

EFOS maintains a strict test coverage target of **>80%** for all core classifiers, clustering algorithms, and network metrics.
* Tests should verify mathematical bounds (e.g., coupling strength $\kappa \in [0, 1]$).
* Include edge cases for network fragmentation (e.g., disconnected graphs, fully connected graphs).
* Use simulated Mock data for testing OAuth adapters; never include real user activity logs in the test suite.

---

## ⚖️ Governance

EFOS is maintained by the **Executive Function OS Steering Committee**.
* **Project Maintainers:** Annika Eriksson (@erikssonaicloud-gif) and core research partners.
* **Decision Making:** Major changes to the underlying mathematical model (e.g., phase transition calculations) or data intake formats require consensus among the Steering Committee and academic advisors.
* **Release Cycle:** Stable versions are tagged and released following successful multi-site validation runs.

---

## 💬 Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment. Please be respectful of others, focus on constructive feedback, and prioritize the scientific rigor and safety of our participants.
