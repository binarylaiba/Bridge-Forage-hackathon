# BridgeForge — Pre-Submission Checklist

---

## Repository

- [ ] Final code merged to `main`
- [ ] No API keys or `.env` files committed
- [ ] `README.md` reviewed and accurate
- [ ] Installation/run instructions verified
- [ ] Final repository contains no accidental generated files, credentials, or debug artifacts

---

## Core Demo

- [ ] Backend starts successfully (`cd backend && npm start`)
- [ ] Frontend starts successfully (`cd frontend && npm run dev`)
- [ ] Watcher starts successfully (`cd watcher && npm start`)
- [ ] Clean baseline confirmed: `GET /api/products` returns the `title` field
- [ ] `bash demo.sh` correctly applies `title → productName`
- [ ] Watcher detects the backend change
- [ ] IBM Bob Shell runs successfully
- [ ] `docs/API.md` updates to `productName`
- [ ] `docs/openapi.json` updates to `productName`
- [ ] `bash demo-reset.sh` restores the clean baseline
- [ ] Demo is reset to the clean `title` state before final recording

---

## Dashboard

- [ ] Product Catalog renders correctly
- [ ] Contract Drift banner shows drift and in-sync states correctly
- [ ] Blast Radius visualization renders without errors
- [ ] Diff viewer displays the intended before/after states
- [ ] Simulated workflow components are presented as visualizations, not as live Bob subagents
- [ ] Dashboard terminology matches the actual `title → productName` product API scenario

---

## IBM Bob Evidence

- [ ] Required Bob session screenshots captured
- [ ] Every team member has the required individual Bob usage evidence
- [ ] Bob session output clearly shows the task performed
- [ ] Resulting Bob-generated file changes are visible in the relevant `git diff`
- [ ] No API key or credential appears in screenshots or recordings

---

## Video

- [ ] Final runtime is exactly 3 minutes
- [ ] At least 90 seconds contains active screen demonstration
- [ ] `docs/DEMO_SCRIPT.md` rehearsed at least once
- [ ] Terminal/editor text is large enough to read
- [ ] No API keys, credentials, or sensitive environment values are visible
- [ ] Actual Bob terminal output is shown where appropriate
- [ ] Simulated dashboard elements are not presented as real Bob execution
- [ ] Final video watched completely before upload

---

## Submission

- [ ] Project title finalized
- [ ] Project description finalized
- [ ] Repository link works correctly
- [ ] Demo video link works and is accessible to judges
- [ ] All six team members are listed correctly
- [ ] Required written responses completed
- [ ] IBM Bob evidence/screenshots included where required
- [ ] Final submission reviewed by at least two team members
- [ ] Submission completed before the deadline