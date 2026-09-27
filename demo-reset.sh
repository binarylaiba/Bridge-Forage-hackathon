#!/usr/bin/env bash
set -e

ROUTES_FILE="backend/routes/products.js"
DATA_FILE="backend/data/products.json"

echo "Resetting demo: renaming 'productName' → 'title' in backend files..."

# Restore quoted "productName" → "title"
sed -i 's/"productName"/"title"/g' "$ROUTES_FILE"
sed -i 's/"productName"/"title"/g' "$DATA_FILE"

# Restore bare JS identifiers
sed -i 's/\bproductName\b/title/g' "$ROUTES_FILE"

echo ""
echo "Done. Backend files restored to original 'title' field name."
echo "  $ROUTES_FILE"
echo "  $DATA_FILE"
echo ""
echo "You can now run  bash demo.sh  again to trigger the full AI sync loop."
