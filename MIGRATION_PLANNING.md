# Executive Function OS (EFOS) — Planning & Migration Log

**Date Saved:** 2026-08-18  
**Source Prototype URL:** `https://wo042d9qvsdtx.space.minimax.io/`

---

## 🎯 Primary Migration & Domain Target
- **Target Repository:** [`Executive-Function-OS/percolation-import`](https://github.com/Executive-Function-OS/percolation-import)
- **Target Domain:** `executivefunctionos.vercel.app` (and associated custom domain)

### ⚠️ Pre-Migration Checklist (Before Pointing Vercel & Domain)
1. **Audit Private Repository:** Audit `erikssonaicloud-gif/percolation-import` to ensure all unique code, experimental branches, or local datasets are saved or merged into `Executive-Function-OS/percolation-import`.
2. **Environment & Keys Audit:** Verify Firebase, OAuth, and API environment keys are copied to Vercel production settings.
3. **Lockfile & Build Verification:** Ensure `pnpm-lock.yaml` is kept in sync with `package.json` for frozen-lockfile deployment.

---

## 🎨 Interactive Prototype & Design Direction (`minimax.io` Mockup)

The prototype at `https://wo042d9qvsdtx.space.minimax.io/` defines the visual and messaging direction for merging the EFOS experience:

### 1. Headline & Hook
> **"You know what to do. You still can't do it."**  
> *Privacy-Preserving Digital Phenotyping Infrastructure for Executive Function.*

### 2. Design Foundation & Merge Plan
- **The Two Source Sites**: Combine the clean computational science overview with the interactive behavioral trace simulation.
- **The Merged Direction**:
  - **Screen 1**: Source Site Synthesis (Research/Clinician overview + Pipeline Integrators + Code Auditors).
  - **Screen 2**: Interactive Simulation & Hero Element ("First 60-seconds" EF-impaired experience).
  - **Screen 3**: Implementation Roadmap (Design Foundation → Content & Depth → Polish & Launch).

### 3. Implementation Roadmap Phases
- **Phase 1: Design Foundation**
  - Standardize typography, color tokens, and responsive layout grid.
  - Implement client-side local calculation core (DBSCAN + percolation graph analysis).
- **Phase 2: Content & Depth**
  - Integrate interactive simulation runner.
  - Format structured local exports (PDF, GraphML, CSV, JSON).
- **Phase 3: Polish & Launch**
  - Verify complete client-side privacy boundaries (zero server data transmission).
  - Deploy to Vercel and attach custom domain.
