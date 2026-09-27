# AI Sync Demo — Production Plan (Revised)

## Top-Level Overview

Build a backend sandbox and an AI-powered documentation pipeline. The frontend is **out of scope** — a separate team will implement it using the documentation this plan produces.

### What this plan delivers

| Deliverable | Description |
|---|---|
| **Express backend** | Full CRUD API for `{ id, title, price }` products, JSON-file persistence, nodemon dev-runner |
| **Watcher script** | chokidar monitors `backend/routes/`; on any change it shells out to Bob CLI to regenerate docs |
| **Bob prompt template** | `update-docs.md` — instructs Bob to read the backend and overwrite both doc artifacts |
| **`docs/openapi.json`** | OpenAPI 3.0 machine-readable contract — initial version hand-written, subsequent versions auto-regenerated |
| **`docs/API.md`** | Human-readable technical reference — endpoints, request/response shapes, curl examples |
| **`docs/FRONTEND_GUIDE.md`** | UI/UX requirements, component suggestions, field names, and integration checklist for the frontend team |
| **`README.md`** | Project overview, how to run the backend and watcher, link to all docs |

### Repository layout after completion

```
Bridge-Forage-hackathon/
├── backend/
│   ├── package.json          (express, cors, uuid; nodemon devDep)
│   ├── server.js
│   ├── routes/
│   │   └── products.js
│   └── data/
│       └── products.json     (seeded with 2 sample products)
├── watcher/
│   ├── package.json          (chokidar dep)
│   ├── watch.js
│   └── prompts/
│       └── update-docs.md
├── docs/
│   ├── openapi.json          (OpenAPI 3.0 spec)
│   ├── API.md                (technical contract for all consumers)
│   └── FRONTEND_GUIDE.md     (UI requirements + integration guide for frontend team)
└── README.md
```

---

## Sub-Tasks

---

### Sub-Task 1 — Backend: Express + JSON-file CRUD

**Status:** `[x] done`

**Intent**
Establish the Express application with a full CRUD API for products. Data is stored in `backend/data/products.json` so it persists across restarts. `nodemon` is wired as the dev-runner so the server reloads automatically when any backend file is saved.

**Expected Outcomes**
- `GET /api/products` returns the full list as a JSON array.
- `POST /api/products` creates a product; auto-generates `id` (uuid v4), accepts `title` and `price`.
- `PUT /api/products/:id` updates an existing product by id.
- `DELETE /api/products/:id` removes a product by id; returns 404 if not found.
- `npm run dev` (inside `backend/`) starts nodemon on port 3001.
- `backend/data/products.json` is seeded with 2 sample products using `{ id, title, price }`.
- All responses include appropriate HTTP status codes and a `Content-Type: application/json` header.

**Todo List**
1. Create `backend/package.json` — dependencies: `express`, `cors`, `uuid`; devDependency: `nodemon`; scripts: `start` → `node server.js`, `dev` → `nodemon server.js`.
2. Create `backend/server.js` — initialise Express, enable JSON body parsing, mount CORS for all origins (or restrict to `localhost:5173`), mount `/api/products` router, listen on port 3001.
3. Create `backend/routes/products.js` — implement all four handlers; each reads `products.json`, mutates in memory, writes back with `fs.writeFileSync`.
4. Create `backend/data/products.json` — seed with exactly 2 products: `{ "id": "<uuid>", "title": "Widget A", "price": 9.99 }` and `{ "id": "<uuid>", "title": "Widget B", "price": 19.99 }`.
5. Smoke-test all four endpoints with curl; document the exact curl commands used in a comment block at the top of `routes/products.js`.

**Relevant Context**
- Initial field shape: `{ id: string (uuid v4), title: string, price: number }`.
- File I/O uses `fs.readFileSync`/`fs.writeFileSync` with `utf8` encoding and `JSON.parse`/`JSON.stringify`.
- This is the only file that needs to change to simulate the breaking-change demo (`title` → `productName`).

---

### Sub-Task 2 — Initial API Documentation

**Status:** `[x] done`

**Intent**
Write the first version of both technical doc artifacts by hand, reflecting the original `{ id, title, price }` schema. These become the baseline that Bob will overwrite during the demo, making the before/after diff immediately visible.

**Expected Outcomes**
- `docs/openapi.json` is a valid OpenAPI 3.0 document with all four endpoints and a `Product` schema component using `title`.
- `docs/API.md` is a complete Markdown reference covering each endpoint with method, path, request body, response body, status codes, and a curl example — all referencing `title`.
- Both files are consistent with each other and with the actual running backend.

**Todo List**
1. Create `docs/openapi.json`:
   - `openapi: "3.0.3"`, `info` block (title, version, description).
   - `servers`: `[{ url: "http://localhost:3001" }]`.
   - `paths`: entries for `/api/products` (GET, POST) and `/api/products/{id}` (PUT, DELETE).
   - `components/schemas/Product`: properties `id` (string, read-only), `title` (string, required), `price` (number, required).
   - `components/schemas/ProductInput`: same minus `id` — used as the request body schema for POST and PUT.
2. Create `docs/API.md`:
   - Header section: project name, base URL, content-type, authentication note (none).
   - One section per endpoint: method + path as a heading, description, request body table (field, type, required, description), response body table, status codes table, curl example.
   - Final section: **Data Model** — a Markdown table of all Product fields (`id`, `title`, `price`) with type and description.

**Relevant Context**
- The OpenAPI schema component named `Product` is what Bob's update-docs prompt will target precisely.
- Both files must be in `docs/` — the watcher's Bob command hardcodes these output paths.

---

### Sub-Task 3 — Frontend Developer Guide

**Status:** `[x] done`

**Intent**
Produce a standalone guide for the frontend team so they can build the React UI independently without needing to read backend source code. The guide covers: what to build, which endpoints to call, what field names to use, and a component-level integration checklist.

**Expected Outcomes**
- `docs/FRONTEND_GUIDE.md` exists and is self-contained — a frontend developer with no backend knowledge can read it and know exactly what to build.
- The guide references `docs/API.md` for the technical contract and does not duplicate endpoint details.
- The guide explicitly names the `title` field so the frontend team can update their code if Bob renames it after a breaking change.

**Todo List**
1. Create `docs/FRONTEND_GUIDE.md` with the following sections:

   **a. Project Context** — explain the product catalog, the AI-sync pipeline, and why docs are auto-generated.

   **b. Tech Stack Recommendation** — Vite + React (JavaScript), port 5173, proxy `/api` to `http://localhost:3001`. Explain the proxy so no CORS configuration is needed client-side.

   **c. API Integration** — link to `docs/API.md`; list the four endpoints with the exact fetch call pattern (URL, method, headers, body). Provide a minimal `api/products.js` code snippet showing each function signature (the team fills in the body).

   **d. Current Data Model** — table: `id` (string, read-only), `title` (string), `price` (number). Note: *this field may be renamed by the AI pipeline — always check `docs/API.md` for the current contract.*

   **e. Suggested Component Map** — list the components the team should build:
   - `ProductList` — renders a table of all products; columns: Title, Price, Actions.
   - `ProductForm` — controlled form for create/edit; fields: Title (text input), Price (number input).
   - `App` — root component; owns state, fetches on mount, wires form and list.

   **f. State Management Notes** — local React state is sufficient (no Redux/Zustand needed); describe the shape of component state.

   **g. Integration Checklist** — ordered checklist the frontend developer ticks off before considering the integration done: backend running on 3001, proxy configured, all four CRUD operations reachable, field names match `docs/API.md`, `git diff` shows no unintended changes.

   **h. Breaking-Change Notice** — explain that `watcher/watch.js` + Bob will rewrite `docs/API.md` and `docs/openapi.json` when backend fields change. The frontend team must watch for doc changes and update their code accordingly.

2. Review the guide for consistency with Sub-Tasks 1 and 2 before marking done.

**Relevant Context**
- This document is the primary hand-off artifact. It should read like internal documentation, not marketing copy.
- Do not include any React source code files — only code snippets inside Markdown fences.

---

### Sub-Task 4 — Bob Prompt Template

**Status:** `[x] done`

**Intent**
Write the Bob prompt that the watcher feeds to the CLI whenever a backend file changes. It must instruct Bob to read `backend/routes/products.js`, derive the current Product schema, and overwrite both `docs/openapi.json` and `docs/API.md` to reflect the latest field names and shapes.

**Expected Outcomes**
- `watcher/prompts/update-docs.md` is a well-structured prompt with clear context, task, and constraints sections.
- When Bob executes this prompt after `title` is renamed to `productName`, the resulting `docs/openapi.json` and `docs/API.md` use `productName` everywhere `title` previously appeared.
- The prompt explicitly forbids Bob from modifying any file outside `docs/`.
- OpenAPI 3.0 structure and Markdown heading hierarchy are preserved across regenerations.

**Todo List**
1. Create `watcher/prompts/update-docs.md` with three sections:

   **Context** — Describe the project: Express backend, product catalog model, two doc artifacts that must always mirror the backend. Mention that the changed file path will be provided as `{{changedFile}}`.

   **Task** — Instruct Bob to:
   1. Read `{{changedFile}}` and `backend/routes/products.js` to determine the current Product schema fields.
   2. Rewrite `docs/openapi.json`: update the `Product` and `ProductInput` schema component properties to match; preserve all other OpenAPI structure.
   3. Rewrite `docs/API.md`: update all field-name references in tables, examples, and curl commands; preserve all Markdown headings and section structure.

   **Constraints** — Only modify `docs/openapi.json` and `docs/API.md`. Do not touch any file in `backend/`, `frontend/`, or `watcher/`. Preserve OpenAPI `3.0.3` version. Preserve all Markdown headings in `API.md`.

2. Add a `{{changedFile}}` placeholder note at the top explaining it will be substituted by the watcher at runtime.

**Relevant Context**
- The watcher (Sub-Task 5) interpolates `{{changedFile}}` before writing a temp file and passing it to Bob.
- Bob's CLI flag for passing additional context files must be confirmed when writing Sub-Task 5.

---

### Sub-Task 5 — Watcher Script

**Status:** `[x] done`

**Intent**
Build the Node.js script that ties the AI pipeline together. chokidar watches `backend/routes/` for saves; on any change it interpolates the prompt template with the changed file path and shells out to the Bob CLI to regenerate both doc files.

**Expected Outcomes**
- `node watcher/watch.js` starts and prints a ready message to stdout.
- Saving any file under `backend/routes/` triggers the Bob doc-regeneration command.
- Bob's stdout and stderr are piped to the watcher's console.
- A non-zero Bob exit code is logged clearly; the watcher continues watching (does not crash).
- `watcher/package.json` lists `chokidar` as the only dependency.

**Todo List**
1. Create `watcher/package.json` — dependency: `chokidar ^3`; script: `start` → `node watch.js`.
2. Create `watcher/watch.js`:
   - Import `chokidar`, `child_process.spawnSync`, `fs`, `path`, `os`.
   - Watch glob: `../backend/routes/**/*.js` relative to `watcher/` directory; options: `{ ignoreInitial: true, persistent: true }`.
   - On `change` event:
     1. Log `[watcher] Change detected: <filePath>`.
     2. Read `prompts/update-docs.md`, replace all occurrences of `{{changedFile}}` with the absolute path of the changed file, write to a temp file in `os.tmpdir()`.
     3. Shell out: `bob run --prompt <tempFile>` using `spawnSync` with `stdio: 'inherit'`.
     4. Delete the temp file.
     5. Wrap steps 3–4 in try/catch; on error log `[watcher] Bob error: <message>` and continue.
3. Confirm exact Bob CLI flag syntax (`bob run --prompt`) against Bob documentation before finalising the shell command string.

**Relevant Context**
- chokidar's `ignoreInitial: true` prevents the watcher from firing on startup.
- `spawnSync` with `stdio: 'inherit'` streams Bob output directly to the terminal in real time.
- The temp file approach keeps the prompt templates clean (no runtime placeholders baked in permanently).

---

### Sub-Task 6 — README and Demo Walk-Through

**Status:** `[x] done`

**Intent**
Write the root `README.md` and a `DEMO.md` that give any developer a complete picture of the project and a repeatable, step-by-step demo script for triggering and observing the full AI doc-sync loop.

**Expected Outcomes**
- `README.md` covers: project purpose, repository layout, prerequisites (Node.js, Bob CLI), how to install and run the backend and watcher, links to all docs.
- `DEMO.md` provides a numbered walk-through: start the backend, start the watcher, rename `title` → `productName` in the backend, observe Bob regenerating the docs, run `git diff` to see the changes.
- A `demo.sh` script performs the rename with `sed` so the developer does not have to edit files manually.

**Todo List**
1. Update `README.md`:
   - Project title and one-paragraph purpose.
   - Prerequisites section: Node.js ≥18, Bob CLI installed and on PATH.
   - Repository layout tree (copy from plan Top-Level Overview).
   - Quick-start section: `cd backend && npm install && npm run dev` | `cd watcher && npm install && node watch.js`.
   - Links: `docs/API.md`, `docs/openapi.json`, `docs/FRONTEND_GUIDE.md`, `DEMO.md`.
2. Create `DEMO.md`:
   - Numbered steps: prerequisites check → start backend → start watcher → run `demo.sh` → observe watcher output → open `docs/API.md` → run `git diff`.
   - Expected output snippets after each step.
   - Troubleshooting section (Bob not found on PATH, port 3001 already in use).
3. Create `demo.sh`:
   - `sed -i 's/"title"/"productName"/g' backend/routes/products.js`
   - `sed -i 's/"title"/"productName"/g' backend/data/products.json`
   - Print confirmation message: "Breaking change applied — watch the watcher terminal for Bob output."

**Relevant Context**
- `demo.sh` only touches backend files; the watcher + Bob handle docs automatically.
- The README is the first thing a new contributor reads — it must be accurate and complete.

---

## Dependency Order

Sub-tasks must be completed in this order. Sub-Tasks 2 and 3 can proceed in parallel once Sub-Task 1 is done.

```
Sub-Task 1 (Backend)
    ├── Sub-Task 2 (API Docs)       ─┐
    └── Sub-Task 3 (Frontend Guide) ─┤ parallel
                                     ↓
                              Sub-Task 4 (Bob Prompt)
                                     ↓
                              Sub-Task 5 (Watcher)
                                     ↓
                              Sub-Task 6 (README + Demo)
```
