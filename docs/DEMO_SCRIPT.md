# BridgeForge — 3-Minute Demo Script

| | |
|---|---|
| **Total runtime** | ~3 minutes |
| **Approximate word count** | ~370–390 spoken words |
| **Presenter setup** | Split-view dashboard open in browser; backend running on port 3001; watcher running in a terminal |

---

## 0:00 – 0:25 · Problem / Hook

**Screen:** Slide or blank dashboard. No app running yet.

> "Every team building across a backend and a frontend hits the same wall: a backend engineer renames one field, saves the file, and suddenly the frontend is broken, the API docs are wrong, and nobody finds out until a build, a test suite, or a client call exposes it. The documentation drift problem is invisible until it's expensive. BridgeForge is our answer to that."

---

## 0:25 – 0:45 · The BridgeForge Solution

**Screen:** BridgeForge dashboard loads in split-view mode — product catalog on the right, visualization panels on the left. Status banner shows green: *API Contract in Sync*.

> "BridgeForge is a three-part system. A real Node.js Express backend serving a product catalog API. A chokidar file watcher that monitors changes in the backend routes folder. And IBM Bob Shell, which the watcher invokes when a backend contract change is detected. Bob reads the changed source and rewrites the API documentation automatically. The React dashboard visualizes the contract drift, blast radius, code differences, and synchronization workflow so we can understand what BridgeForge is doing across the stack."

---

## 0:45 – 1:10 · Healthy Baseline

**Screen:** Switch to Catalog view. Product list renders correctly — Widget A and Widget B visible. ContractDriftBanner is green.

> "Let's start from a clean baseline. Our Express API is running on port 3001. The React frontend is fetching from it through a Vite proxy. Every product in the list has an `id`, a `title`, and a `price`. The contract drift banner is green — the API and the frontend agree on the field name. Swagger UI at `/api-docs` reflects the same initial schema. Everything is aligned."

---

## 1:10 – 1:30 · Introduce the Breaking Change

**Screen:** Open `backend/routes/products.js` in an editor. Run `bash demo.sh` in the terminal, or type the rename live. Show the watcher terminal.

> "Now the backend engineer renames the field. `title` becomes `productName` — a completely normal refactor. They save the file. In any other project, the documentation can become stale immediately. Here, the watcher detects the backend change, loads the Bob prompt, injects the changed file path, and hands the task to IBM Bob Shell."

---

## 1:30 – 2:10 · Detection, Bob, and the Dashboard

**Screen:** Show the watcher/Bob terminal while the real synchronization runs. Then return to the split-view dashboard and use the *Trigger Drift* and *Auto-Sync via Bob* controls to visualize the same workflow. SubagentsMonitor, BlastRadiusGraph, and MonacoDiffVisualizer represent the synchronization stages.

> "The dashboard now shows exactly what drifted: the backend has moved from `title` to `productName`, while dependent artifacts still reflect the old contract. Behind the scenes, our watcher invokes IBM Bob Shell with the changed backend file. Bob reads the current source of truth and updates the two documentation artifacts we target today: `docs/API.md` and `docs/openapi.json`. At the same time, the dashboard visualizes the blast radius, the contract difference, and the synchronization workflow so the developer can understand the impact instead of treating the change as a black box."

---

## 2:10 – 2:35 · Verify the Result

**Screen:** Open `docs/API.md` and `docs/openapi.json` in the editor or diff viewer. Scroll to the Data Model table and the `components/schemas/Product` section. Both now show `productName`.

> "Let's verify. In `docs/API.md`, the documented contract now uses `productName`. In `docs/openapi.json`, the Product and ProductInput schemas reflect the same change. These files were updated by IBM Bob from the backend source of truth rather than manually edited by a developer. The documentation is back in sync with the code without someone manually hunting through and editing each affected document."

---

## 2:35 – 3:00 · Value Proposition and Closing

**Screen:** Return to split-view dashboard, status green. Optionally show the BridgeForge logo or a summary slide.

> "Today's prototype automatically synchronizes two API documentation artifacts — `docs/API.md` and `docs/openapi.json` — when a monitored backend contract changes. The same pattern can be extended to frontend bindings, test fixtures, client SDKs, and other downstream consumers. BridgeForge shows how IBM Bob can move beyond interactive coding assistance and become part of an automated engineering workflow that detects contract drift and helps keep dependent artifacts synchronized. Thank you."

---

## Presenter Notes

| Cue | What actually happens in the system |
|---|---|
| `bash demo.sh` saves `products.js` | chokidar fires in `watcher/watch.js`; `bob -p <prompt>` is called with the changed file path injected |
| Bob runs | Bob reads `backend/routes/products.js`, derives the current schema, and rewrites `docs/API.md` and `docs/openapi.json` only |
| Dashboard "subagents" animate | The SubagentsMonitor is a **visualization** of the sync workflow; the actual Bob process is a single `bob -p` invocation |
| BlastRadiusGraph / Diff Viewer | These visualize the impact and before/after contract state; they are not direct live telemetry from Bob |
| ContractDriftBanner turns green | Simulated state change in the React dashboard representing that the backend field and client binding field now agree |
| Swagger UI updates | `server.js` loads `openapi.json` at startup via `require('../docs/openapi.json')`; a backend restart may be needed before Swagger UI reflects the updated schema |

> **Scope reminder:**  
> The real automation pipeline rewrites `docs/API.md` and `docs/openapi.json`. The dashboard visualizes the wider BridgeForge concept, including blast-radius analysis and synchronization stages. Frontend source-code rewriting, test repair, and parallel Bob subagents are future extensions rather than functionality that should be presented as fully implemented in the current prototype.