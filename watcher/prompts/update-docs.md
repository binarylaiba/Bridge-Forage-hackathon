> **Note:** `{{changedFile}}` is a runtime placeholder. The watcher script reads this file,
> replaces every occurrence of `{{changedFile}}` with the absolute path of the backend file that
> just changed, writes the result to a temporary file, and passes that temporary file to Bob.
> You will never see the literal string `{{changedFile}}` when Bob executes this prompt.

---

## Context

This project is an **Express + Node.js** backend for a simple product catalog. The backend exposes
a REST API and persists data in `backend/data/products.json`.

**Current data model** (defined in `backend/routes/products.js`):

```
{ id: string (uuid v4, read-only), <writable fields>... }
```

The writable fields — their names and types — are the ground truth that lives in
`backend/routes/products.js`. When a developer renames or adds a field there, the two
documentation artifacts listed below go out of date and must be regenerated.

**Documentation artifacts that must always mirror the backend:**

| File | Format | What must stay in sync |
|---|---|---|
| `docs/openapi.json` | OpenAPI 3.0.3 JSON | `components/schemas/Product` and `components/schemas/ProductInput` property names and types |
| `docs/API.md` | Markdown reference | Field names in every request/response table, curl example bodies, and the Data Model section |

**The backend file that just changed:** `{{changedFile}}`

---

## Task

Perform the following steps **in order**. Do not skip any step.

### Step 1 — Read the changed file

Read `{{changedFile}}`. Note what changed (e.g. a field was renamed, added, or removed).

### Step 2 — Read the route file to determine the current schema

Read `backend/routes/products.js`. Identify every field that the POST and PUT handlers
destructure from `req.body` — those are the current writable fields. Together with the
server-generated `id` field (string, uuid v4, read-only), they form the complete `Product`
schema.

The writable fields are the authoritative source of truth. Do not infer field names from
anywhere else.

### Step 3 — Rewrite `docs/openapi.json`

Open `docs/openapi.json` and update **only** the following two schema components inside
`components/schemas`:

- **`Product`** — update the `required` array and the `properties` object so they list exactly
  `id` plus every current writable field. Keep `id`'s existing property definition unchanged
  (`type: string`, `format: uuid`, `readOnly: true`). For each writable field, keep the type
  (`string`, `number`, etc.) that matches the JavaScript destructuring in the route file.
- **`ProductInput`** — update the `required` array and the `properties` object so they list
  exactly the current writable fields (no `id`). Mirror the same types.

**Preserve without any modification:**
- The `"openapi": "3.0.3"` version string
- The entire `info` block
- The entire `servers` array
- Every entry in `paths` — summaries, operationIds, parameters, `$ref` values, response
  descriptions, and HTTP status codes
- The `ErrorResponse` schema component
- All JSON formatting (2-space indentation, trailing newline)

### Step 4 — Rewrite `docs/API.md`

Open `docs/API.md` and update **only** field-name references to match the current schema:

- In every Markdown table that lists product fields (request body tables, response body tables,
  the Data Model section), replace old field names with the current ones. Keep all other table
  columns (`Type`, `Required`, `Read-only`, `Description`) exactly as they are.
- In every `curl` example body (the `-d '...'` argument), replace old field names with the
  current ones. Keep all other curl flags, URLs, and values exactly as they are.
- In inline code spans that reference a product field name (e.g. `` `title` ``), replace the old
  name with the current one only when the span refers to a schema field. Do not alter spans that
  refer to HTTP parameters, error fields, or anything else.

**Preserve without any modification:**
- Every H1 and H2 Markdown heading (lines that start with `#` or `##`)
- All section prose descriptions
- HTTP status codes and their descriptions
- Endpoint paths and HTTP method labels
- The `Error Response` section

---

## Constraints

- **Only modify `docs/openapi.json` and `docs/API.md`.** Do not read, create, or write any
  other file.
- **Do NOT touch any file under `backend/`, `frontend/`, or `watcher/`.**
- The `"openapi"` version string in `docs/openapi.json` must remain `"3.0.3"` after your edit.
- Every H1 (`#`) and H2 (`##`) heading in `docs/API.md` must be identical after your edit.
- Do NOT change operation descriptions, endpoint paths (`/api/products`, `/api/products/{id}`),
  HTTP methods, or HTTP status codes anywhere in either file.
- Do NOT rename or remove the `ErrorResponse` schema component or any of its properties.
- If a field's description mentions its display purpose (e.g. "Display name of the product."),
  keep that prose — only the JSON key / Markdown field-name cell changes.
