import { FileDiffItem } from '../types';

export const CODE_DIFF_FILES: Record<string, FileDiffItem> = {
  'backend/routes/products.js': {
    id: 'backend-routes',
    filename: 'products.js',
    displayPath: 'backend/routes/products.js',
    language: 'javascript',
    layer: 'Backend',
    subagentName: 'Backend Dev (demo.sh)',
    impactLevel: 'Source',
    summary: 'API Contract change: renamed field `title` to `productName` in route destructuring and response objects.',
    linesAdded: 3,
    linesRemoved: 3,
    beforeCode: `// POST /api/products
router.post('/', (req, res) => {
  const { title, price } = req.body;
  const newProduct = { id: uuidv4(), title, price };
  const products = readProducts();
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const { title, price } = req.body;
  products[index] = { ...products[index], title, price };
  writeProducts(products);
  res.status(200).json(products[index]);
});`,
    afterCode: `// POST /api/products (demo.sh breaking change)
router.post('/', (req, res) => {
  const { productName, price } = req.body;
  const newProduct = { id: uuidv4(), productName, price };
  const products = readProducts();
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const { productName, price } = req.body;
  products[index] = { ...products[index], productName, price };
  writeProducts(products);
  res.status(200).json(products[index]);
});`
  },

  'frontend/src/api/products.ts': {
    id: 'frontend-api',
    filename: 'products.ts',
    displayPath: 'frontend/src/api/products.ts',
    language: 'typescript',
    layer: 'Frontend',
    subagentName: 'Subagent 1: React UI',
    impactLevel: 'High',
    summary: 'Autonomously synchronized Product interface and JSX bindings from `title` to `productName`.',
    linesAdded: 4,
    linesRemoved: 4,
    beforeCode: `export interface Product {
  id: string;
  title: string; // <-- Expected field in React component
  price: number;
}

export async function createProduct(data: { title: string; price: number }) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}`,
    afterCode: `export interface Product {
  id: string;
  productName: string; // [Bob Subagent 1] Auto-synced from products.js
  price: number;
}

export async function createProduct(data: { productName: string; price: number }) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}`
  },

  'docs/API.md': {
    id: 'docs-api',
    filename: 'API.md',
    displayPath: 'docs/API.md',
    language: 'markdown',
    layer: 'Documentation',
    subagentName: 'Subagent 2: API Docs',
    impactLevel: 'Medium',
    summary: 'Auto-regenerated Markdown technical reference tables and curl examples to match `productName`.',
    linesAdded: 5,
    linesRemoved: 5,
    beforeCode: `## GET /api/products
Returns the full list of products.

**Response body:** An array of \`Product\` objects.

| Field | Type | Description |
|---|---|---|
| \`id\` | string (uuid) | Auto-generated UUID v4 identifier. |
| \`title\` | string | Display name of the product. |
| \`price\` | number | Price of the product in dollars. |

**curl example**
\`\`\`bash
curl -s -X POST http://localhost:3001/api/products \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Widget C","price":29.99}'
\`\`\``,
    afterCode: `## GET /api/products
Returns the full list of products.

**Response body:** An array of \`Product\` objects.

| Field | Type | Description |
|---|---|---|
| \`id\` | string (uuid) | Auto-generated UUID v4 identifier. |
| \`productName\` | string | Display name of the product. (Updated) |
| \`price\` | number | Price of the product in dollars. |

**curl example**
\`\`\`bash
curl -s -X POST http://localhost:3001/api/products \\
  -H "Content-Type: application/json" \\
  -d '{"productName":"Widget C","price":29.99}'
\`\`\``
  },

  'docs/openapi.json': {
    id: 'docs-openapi',
    filename: 'openapi.json',
    displayPath: 'docs/openapi.json',
    language: 'json',
    layer: 'OpenAPI',
    subagentName: 'IBM Bob Shell (Watcher)',
    impactLevel: 'High',
    summary: 'Regenerated OpenAPI 3.0.3 specification components schema for Swagger UI at /api-docs.',
    linesAdded: 6,
    linesRemoved: 6,
    beforeCode: `{
  "components": {
    "schemas": {
      "Product": {
        "type": "object",
        "required": ["id", "title", "price"],
        "properties": {
          "id": { "type": "string", "format": "uuid", "readOnly": true },
          "title": { "type": "string" },
          "price": { "type": "number" }
        }
      }
    }
  }
}`,
    afterCode: `{
  "components": {
    "schemas": {
      "Product": {
        "type": "object",
        "required": ["id", "productName", "price"],
        "properties": {
          "id": { "type": "string", "format": "uuid", "readOnly": true },
          "productName": { "type": "string" },
          "price": { "type": "number" }
        }
      }
    }
  }
}`
  }
};
