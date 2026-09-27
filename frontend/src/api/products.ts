import { Product, ProductInput } from '../types';

// Base path resolved through the Vite proxy to http://localhost:3001
const BASE = '/api/products';

// Fallback in-memory cache in case backend is offline
let fallbackProducts: Product[] = [
  { id: 'mock-1', title: 'Widget A', productName: 'Widget A', price: 9.99 },
  { id: 'mock-2', title: 'Widget B', productName: 'Widget B', price: 19.99 }
];

/**
 * Fetch all products from GET /api/products
 */
export async function getProducts(): Promise<{ products: Product[]; isLiveBackend: boolean; activeKey: 'title' | 'productName' | 'unknown' }> {
  try {
    const res = await fetch(BASE, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data: any[] = await res.json();
    
    // Detect which field key the backend is currently using
    let activeKey: 'title' | 'productName' | 'unknown' = 'unknown';
    if (data.length > 0) {
      if ('productName' in data[0] && data[0].productName !== undefined) {
        activeKey = 'productName';
      } else if ('title' in data[0] && data[0].title !== undefined) {
        activeKey = 'title';
      }
    }

    return {
      products: data,
      isLiveBackend: true,
      activeKey
    };
  } catch (err) {
    console.warn('[BridgeForge] Backend unreachable, falling back to local simulation:', err);
    return {
      products: fallbackProducts,
      isLiveBackend: false,
      activeKey: 'productName'
    };
  }
}

/**
 * Create a new product via POST /api/products
 */
export async function createProduct(data: ProductInput): Promise<Product> {
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to create product: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('[BridgeForge] Creating via fallback mock:', err);
    const mockCreated: Product = {
      id: `local-${Date.now()}`,
      title: data.title || data.productName || 'New Product',
      productName: data.productName || data.title || 'New Product',
      price: data.price
    };
    fallbackProducts = [...fallbackProducts, mockCreated];
    return mockCreated;
  }
}

/**
 * Update an existing product via PUT /api/products/:id
 */
export async function updateProduct(id: string, data: ProductInput): Promise<Product> {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to update product: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('[BridgeForge] Updating via fallback mock:', err);
    const updated: Product = {
      id,
      title: data.title || data.productName,
      productName: data.productName || data.title,
      price: data.price
    };
    fallbackProducts = fallbackProducts.map((p) => (p.id === id ? updated : p));
    return updated;
  }
}

/**
 * Delete a product via DELETE /api/products/:id
 */
export async function deleteProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Failed to delete product: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('[BridgeForge] Deleting via fallback mock:', err);
    const target = fallbackProducts.find((p) => p.id === id) || null;
    fallbackProducts = fallbackProducts.filter((p) => p.id !== id);
    return target;
  }
}
