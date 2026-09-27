# BridgeForge — Pre-Submission Checklist

---

## Repository

- [ ] Final code merged to `main`
- [ ] No API keys or `.env` files committed (check `git log` and `git status`)
- [ ] `README.md` reviewed and accurate
- [ ] Installation instructions verified end-to-end on a clean checkout

---

## Core Demo

- [ ] Backend starts successfully (`cd backend && npm run dev` — no errors)
- [ ] Frontend starts successfully (`cd frontend && npm run dev` — no errors)
- [ ] Watcher starts successfully (`cd watcher && node watch.js` — no errors)
- [ ] Clean baseline confirmed: `GET /api/products` returns `"title"` field
- [ ] `bash demo.sh` applies `title → productName` rename correctly
- [ ] Watcher detects the save and logs the change
- [ ] IBM Bob Shell invokes without error (`bob -p` exits 0)
- [ ] `docs/API.md` updated to `productName` after Bob runs
- [ ] `docs/openapi.json` updated to `productName` after Bob runs
- [ ] `bash demo-reset.sh` restores baseline cleanly

---

## Dashboard

- [ ] Product Catalog renders and CRUD operations work
- [ ] Contract Drift banner correctly shows drift and in-sync states
- [ ] Blast Radius visualization renders without errors
- [ ] Diff viewer shows before/after for relevant files
- [ ] Simulated visualization is described as visualizing the workflow — not presented as live Bob subagents

---

## IBM Bob Evidence

- [ ] Required Bob session screenshots captured and included in `bob_sessions/`
- [ ] Every team member has the required individual Bob usage evidence
- [ ] Bob-generated file changes are visible and attributable in `git diff`

---

## Video

- [ ] Runtime is approximately 3 minutes
- [ ] Demo script (`docs/DEMO_SCRIPT.md`) rehearsed at least once
- [ ] Active screen demonstration requirement satisfied
- [ ] Terminal text is large enough to read on screen
- [ ] No API keys or credentials visible in any frame
- [ ] Final video watched in full before upload

---

## Submission

- [ ] Project title and description finalized
- [ ] Repository link is public and resolves correctly
- [ ] Demo video link is public and plays correctly
- [ ] All team members listed correctly on the submission form
- [ ] Required written responses completed
- [ ] Final submission reviewed by at least two team members before submitting
