/*
 * Smoke-test curl commands
 * ========================
 *
 * GET all products:
 *   curl -s http://localhost:3001/api/products | jq
 *
 * POST a new product:
 *   curl -s -X POST http://localhost:3001/api/products \
 *     -H "Content-Type: application/json" \
 *     -d '{"productName":"Widget C","price":29.99}' | jq
 *
 * PUT (update) an existing product (replace <id> with a real id):
 *   curl -s -X PUT http://localhost:3001/api/products/<id> \
 *     -H "Content-Type: application/json" \
 *     -d '{"productName":"Widget C Updated","price":39.99}' | jq
 *
 * DELETE a product (replace <id> with a real id):
 *   curl -s -X DELETE http://localhost:3001/api/products/<id> | jq
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
}

// GET /api/products
router.get('/', (req, res) => {
  const products = readProducts();
  res.status(200).json(products);
});

// POST /api/products
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
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const [deleted] = products.splice(index, 1);
  writeProducts(products);
  res.status(200).json(deleted);
});

module.exports = router;
