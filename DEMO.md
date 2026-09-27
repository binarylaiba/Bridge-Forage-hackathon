# Breaking-Change Demo Walk-Through

This demo simulates the real-world scenario of a backend engineer renaming a field — `title` → `productName` — in the product data model. It shows how the watcher and IBM Bob Shell detect the change and automatically regenerate `docs/API.md` and `docs/openapi.json` to reflect the new field name, with no manual documentation work required.

---

## Demo scripts

| Script | Purpose |
|---|---|
| [`demo.sh`](demo.sh) | Applies the breaking change — renames `title` → `productName` in both `backend/routes/products.js` and `backend/data/products.json` |
| [`demo-reset.sh`](demo-reset.sh) | Restores `productName` → `title` so the demo can be run again from a clean baseline |

### What `demo.sh` does

```bash
# Replace quoted "title" in JSON strings and JS object keys
sed -i 's/"title"/"productName"/g' backend/routes/products.js
sed -i 's/"title"/"productName"/g' backend/data/products.json

# Replace bare JS identifiers (destructuring, shorthand props, spreads)
sed -i 's/\btitle\b/productName/g' backend/routes/products.js
```

This covers every occurrence — string literals in comments/curl examples, JSON data keys, **and** the JS destructuring inside the route handlers (`const { title, price }` → `const { productName, price }`).

### What `demo-reset.sh` does

The inverse of the above — substitutes `productName` back to `title` in both files. Run this any time you want to repeat the demo from scratch.

---

## Prerequisites

| Requirement | Check |
|---|---|
| Docker + Docker Compose v2 | `docker compose version` |
| IBM Bob Shell (inside watcher image) | installed automatically at build time |
| `watcher/.env` with `BOBSHELL_API_KEY` set | `cat watcher/.env` |

---

## Running with Docker (recommended)

### Start all services

```bash
docker compose up --build -d
```

### Tail live logs from both containers

```bash
docker compose logs -f
```

Expected startup output:

```
product-catalog-backend  | 2026-..Z [backend] [INFO] Server running on http://localhost:3001
product-catalog-backend  | 2026-..Z [backend] [INFO] Swagger UI:  http://localhost:3001/api-docs
product-catalog-watcher  | [entrypoint] BOBSHELL_API_KEY is set. Starting watcher...
product-catalog-watcher  | [entrypoint] Bob Shell will be invoked on backend file changes.
product-catalog-watcher  | 2026-..Z [watcher] [INFO] Watching backend/routes/ for changes. Press Ctrl+C to stop.
```

### Useful Docker commands during the demo

```bash
# Check container health
docker compose ps

# Logs for one service only
docker compose logs -f backend
docker compose logs -f watcher

# Live CPU/memory usage
docker stats product-catalog-backend product-catalog-watcher

# Open a shell inside a container
docker compose exec backend sh
docker compose exec watcher sh

# Verify Bob Shell version inside the watcher container
docker compose exec watcher bob --version

# Restart a single service after a code change
docker compose restart watcher

# Stop everything
docker compose down
```

---

## Running without Docker (local dev)

```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev

# Terminal 2 — watcher
cd watcher && npm install && node watch.js
```

---

## Step 0 — Reset to baseline (if demo was already run)

If `backend/data/products.json` already shows `productName` instead of `title`, restore the original state first:

```bash
bash demo-reset.sh
```

Expected output:
```
Resetting demo: renaming 'productName' → 'title' in backend files...
Done. Backend files restored to original 'title' field name.
You can now run  bash demo.sh  again to trigger the full AI sync loop.
```

---

## Step 1 — Confirm the baseline

Query the products endpoint and confirm the response uses `"title"`:

```bash
curl -s http://localhost:3001/api/products | jq
```

**Expected output:**

```json
[
  { "id": "...", "title": "Widget A", "price": 9.99 },
  { "id": "...", "title": "Widget B", "price": 19.99 }
]
```

Also confirm via Swagger UI at **http://localhost:3001/api-docs** — execute `GET /api/products` from the browser.

Open `docs/API.md` and confirm the **Data Model** table and all curl examples reference `title`.

---

## Step 2 — Apply the breaking change

Run from the **repository root**:

```bash
bash demo.sh
```

Expected output:
```
Applying breaking change: renaming 'title' → 'productName' in backend files...

Done. Changes applied to:
  backend/routes/products.js
  backend/data/products.json

The watcher should detect the change to backend/routes/products.js and trigger Bob Shell.
Watch the watcher logs:  docker compose logs -f watcher
See what changed:        git diff
```

**What changes in `backend/routes/products.js`:**

```js
// Before
const { title, price } = req.body;
const newProduct = { id: uuidv4(), title, price };

// After
const { productName, price } = req.body;
const newProduct = { id: uuidv4(), productName, price };
```

The watcher is monitoring `backend/routes/`. The moment `products.js` is saved, chokidar fires and kicks off the Bob Shell pipeline.

> **Docker note:** `backend/routes/` is bind-mounted into the watcher container as read-only — changes on the host are visible inside the container instantly, no restart needed.

---

## Step 3 — Watch the watcher logs

```bash
docker compose logs -f watcher
```

Within a second or two you should see:

```
2026-..Z [watcher] [INFO] Change detected: /app/../backend/routes/products.js
2026-..Z [watcher] [INFO] Running Bob Shell to regenerate docs...
... (Bob Shell output) ...
2026-..Z [watcher] [INFO] Docs regenerated successfully.
```

Bob Shell reads the updated `backend/routes/products.js`, identifies the new field name, and overwrites both `docs/openapi.json` and `docs/API.md`.

---

## Step 4 — Verify the API still works

```bash
curl -s http://localhost:3001/api/products | jq
```

**Expected output (field is now `productName`):**

```json
[
  { "id": "...", "productName": "Widget A", "price": 9.99 },
  { "id": "...", "productName": "Widget B", "price": 19.99 }
]
```

You can also re-execute `GET /api/products` in Swagger UI at **http://localhost:3001/api-docs** — the spec will reflect `productName` once the page is refreshed.

---

## Step 5 — Inspect the regenerated docs

**`docs/API.md`** — All previous references to `title` (in tables, request/response examples, and curl commands) now say `productName`.

**`docs/openapi.json`** — Locate `components/schemas/Product`. The property is now `productName`:

```json
"Product": {
  "type": "object",
  "properties": {
    "id":          { "type": "string", "readOnly": true },
    "productName": { "type": "string" },
    "price":       { "type": "number" }
  }
}
```

---

## Step 6 — See the git diff

```bash
git diff docs/
```

You will see a diff that removes every `title` reference and adds `productName` in its place across both `docs/API.md` and `docs/openapi.json`. This is the complete, auditable record of the doc update triggered by a single backend field rename.

---

## Troubleshooting

### Watcher crashes immediately — `BOBSHELL_API_KEY must be set`

The `watcher/.env` file is missing or the variable is blank.

```bash
cat watcher/.env           # should show BOBSHELL_API_KEY=<your key>
docker compose down
docker compose up -d       # picks up the updated .env
docker compose logs -f watcher
```

### Bob Shell quota exhausted

If the watcher logs show `Time to go beyond the trial` or a similar quota error, your Bob Shell trial has run out. The watcher itself keeps running — only the doc regeneration step fails. Upgrade at [bob.ibm.com](https://bob.ibm.com) to restore quota.

### Port 3001 already in use

```bash
lsof -i :3001              # find the process holding the port
kill <PID>
docker compose up -d       # bring the backend back up
```

### Backend logs show no requests

Confirm the backend container is healthy:

```bash
docker compose ps
# STATUS column should show "(healthy)"
```

If it shows `(unhealthy)` or `Exit`:

```bash
docker compose logs backend    # read the error
docker compose restart backend
```

### Changes to backend code not detected by watcher

The `backend/routes/` directory is bind-mounted. Confirm the mount is live:

```bash
docker compose exec watcher ls /app/../backend/routes/
# should list products.js
```

If it's empty, bring the stack down and back up:

```bash
docker compose down && docker compose up -d
```
