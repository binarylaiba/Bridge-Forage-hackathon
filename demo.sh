#!/usr/bin/env bash
set -e

ROUTES_FILE="backend/routes/products.js"
DATA_FILE="backend/data/products.json"

echo "Applying breaking change: renaming 'title' → 'productName' in backend files..."

# Replace quoted "title" in JSON strings and object property names
sed -i 's/"title"/"productName"/g' "$ROUTES_FILE"
sed -i 's/"title"/"productName"/g' "$DATA_FILE"

# Replace bare JS identifiers: destructuring, shorthand properties, and object spreads
# Targets: `title` as a standalone word (not part of another identifier)
sed -i 's/\btitle\b/productName/g' "$ROUTES_FILE"

echo ""
echo "Done. Changes applied to:"
echo "  $ROUTES_FILE"
echo "  $DATA_FILE"
echo ""
echo "The watcher should detect the change to $ROUTES_FILE and trigger Bob Shell."
echo "Watch the watcher logs:  docker compose logs -f watcher"
echo "See what changed:        git diff"
