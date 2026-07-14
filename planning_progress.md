# Water Quality Model Planning Progress

## Deployment Status (as of 2026-07-14)
| Platform | Status | Notes |
|----------|--------|-------|
| Render (Docker) | LIVE | Multi-stage Dockerfile builds frontend (node:20) then serves backend + static via uvicorn. WeasyPrint system libs (pango/cairo/gdk-pixbuf) installed. |
| Vercel (Frontend) | LIVE | Root `vercel.json` builds `frontend/` and proxies `/api/*` to Render. Framework Preset set to `Other`; `.vercelignore` excludes backend (`/src/`, `/requirements.txt`) so no Python serverless function is created. |
| Fly.io | PENDING | `fly.toml` exists and reuses the same Dockerfile; not yet deployed/verified. |

### Deployment fixes applied this session
- `Dockerfile`: multi-stage build (node build -> python serve); copy built `dist` to `/app/frontend/static`; added WeasyPrint native libs (`libgdk-pixbuf-2.0-0` is the Debian 12 name).
- `src/main.py`: serve `index.html` from `frontend/static`; mount `/assets` + `/static`; SPA catch-all route.
- `vercel.json` (root): `buildCommand: "cd frontend && npm ci && npm run build"`, `outputDirectory: frontend/dist`, `/api` rewrite to Render backend.
- `.vercelignore`: anchored backend-only exclusions (`/src/`, `/requirements.txt`, etc.) so `frontend/src` is preserved.
- `frontend/index.html`: entry script uses `./src/main.tsx` (relative) so Vite build resolves it on Vercel.

## Remaining Needed Features
| Feature/Action | Priority | Status   | Owner    | Notes |
|----------------|----------|----------|----------|-------|
| Finalize WHO compliance thresholds | High | Pending | Data Team | Must match local regulations |
| Validate dosage formulas with real data | High | Pending | Engineering | Use River Ndarugu historical data |
| Define confidence index formula | Medium | Pending | Math Team | Formula for input completeness |
| Create UI mockups for dashboard | Medium | Pending | Design Team | Focus on real-time dosage preview |
| Document compliance PASS/FAIL logic | Medium | Pending | QA Team | Prioritize pH, chlorine thresholds |

## Critical Planning Actions Before Build
| Feature/Action | Priority | Status   | Owner    | Notes |
|----------------|----------|----------|----------|-------|
| Refine dosage min/max feasibility | High | Pending | Engineering | Avoid impractical dosage ranges |
| Sample data collection for testing | High | In-Progress | Field Team | Collect 3 seasonal datasets |
| Finalize PASS/FAIL rules for compliance | High | Pending | Legal Team | Include WHO and local standards |
| Create confidence index calculation script | Medium | Pending | Math Team | Use input data completeness as metric |

## Progress Checklist
| Feature/Action | Priority | Status   | Notes |
|----------------|----------|----------|-------|
| [ ] Finalize WHO compliance thresholds | High | Not Started | Critical for compliance engine |
| [ ] Validate dosage formulas with sample data | High | Not Started | Blocking for Phase 1 |
| [ ] Draft confidence index formula | Medium | Not Started | Affects reporting reliability |
| [ ] Complete UI mockups | Medium | Not Started | Needed for Phase 2 design |