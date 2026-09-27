import { BlastRadiusNode } from '../types';

export const BOB_SYNC_PLAN_MD = `# [IBM Bob 2.0 Plan Mode] API Contract Drift Resolution Plan
**Target Repository:** \`Bridge-Forage-hackathon\`  
**Target Event:** Save detected on \`backend/routes/products.js\`  
**Delta Type:** Field Rename (\`title\` -> \`productName\`)  
**Blast Radius Severity:** HIGH (3 downstream files affected)

---

## 1. Executive Blast Radius Analysis
IBM Bob static AST analysis detected a breaking payload modification in Express endpoint \`POST & PUT /api/products\`.
- **Source File:** \`backend/routes/products.js\`
- **Symbol:** \`const { title, price } = req.body;\` migrated to \`const { productName, price } = req.body;\`
- **Impacted Consumers:**
  1. \`frontend/src/api/products.ts\` (React UI Client & TypeScript interface)
  2. \`docs/API.md\` (Human-readable technical Markdown specification)
  3. \`docs/openapi.json\` (Machine-readable OpenAPI 3.0.3 contract for Swagger UI)

---

## 2. Parallel Subagent Delegation Strategy
To eliminate build downtime and prevent serial bottlenecks, Bob orchestrates autonomous tasks concurrently:

| Subagent | Role | Target File | Action Required |
| :--- | :--- | :--- | :--- |
| **Subagent 1** | React UI Specialist | \`frontend/src/api/products.ts\` | Refactor \`Product\` interface & update JSX render binding to \`productName\` |
| **Subagent 2** | Tech Writer / Docs | \`docs/API.md\` | Update Markdown schema table & curl example payloads |
| **Subagent 3** | OpenAPI Spec Eng | \`docs/openapi.json\` | Rewrite \`Product\` & \`ProductInput\` schemas in Swagger specification |

---

## 3. Verification & Safety Guardrails
- [x] Backend file watcher (chokidar) captured file change on \`backend/routes/products.js\`.
- [x] Watcher prompt \`watcher/prompts/update-docs.md\` injected with file context.
- [x] Swagger UI at \`http://localhost:3001/api-docs\` verified compatible.
`;

export const BLAST_RADIUS_NODES: BlastRadiusNode[] = [
  {
    id: 'backend',
    label: 'products.js',
    type: 'source',
    layer: 'Express Backend',
    status: 'drift',
    details: 'Changed: "title" -> "productName"'
  },
  {
    id: 'frontend',
    label: 'products.ts (UI)',
    type: 'target',
    layer: 'React Frontend Client',
    status: 'drift',
    details: 'Breaks runtime: expects item.title'
  },
  {
    id: 'docs',
    label: 'API.md',
    type: 'target',
    layer: 'Markdown API Reference',
    status: 'drift',
    details: 'Stale schema documentation'
  },
  {
    id: 'openapi',
    label: 'openapi.json',
    type: 'target',
    layer: 'OpenAPI 3.0 Specification',
    status: 'drift',
    details: 'Swagger UI schema out of sync'
  }
];
