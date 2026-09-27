import React, { useState, useEffect } from 'react';
import { Product, ProductInput, ActiveContractField } from '../types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { ContractDriftBanner } from './ContractDriftBanner';
import { 
  Package, 
  Plus, 
  RefreshCw, 
  Server, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Code2
} from 'lucide-react';

interface ProductCatalogAppProps {
  clientBindingField: ActiveContractField;
  setClientBindingField: (field: ActiveContractField) => void;
  onTriggerBobSync: () => void;
  isSyncing: boolean;
}

export const ProductCatalogApp: React.FC<ProductCatalogAppProps> = ({
  clientBindingField,
  setClientBindingField,
  onTriggerBobSync,
  isSyncing
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(true);
  const [backendField, setBackendField] = useState<'title' | 'productName' | 'unknown'>('unknown');
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);

  const fetchCatalog = async () => {
    setIsLoading(true);
    const result = await getProducts();
    setProducts(result.products);
    setIsLiveBackend(result.isLiveBackend);
    setBackendField(result.activeKey);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCreateOrUpdate = async (input: ProductInput) => {
    setIsSubmitting(true);
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, input);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createProduct(input);
      setProducts((prev) => [...prev, created]);
    }
    setIsSubmitting(false);
    setFormVisible(false);
    setEditingProduct(null);
    fetchCatalog();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormVisible(true);
  };

  const handleNewClick = () => {
    setEditingProduct(null);
    setFormVisible(true);
  };

  // Quick switch contract binding
  const handleToggleBinding = () => {
    setClientBindingField(clientBindingField === 'title' ? 'productName' : 'title');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d121f] text-slate-200 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* App Bar */}
      <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/30">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white">Product Catalog</span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                React 18 Client
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <span>Express Backend:</span>
              <span className="font-mono text-cyan-400">http://localhost:3001</span>
              {isLiveBackend ? (
                <span className="text-emerald-400 font-mono flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ONLINE</span>
                </span>
              ) : (
                <span className="text-amber-400 font-mono flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>FALLBACK MOCK</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Quick Drift Toggle for Demo */}
          <button
            onClick={handleToggleBinding}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
            title="Toggle client JSX binding between 'title' and 'productName'"
          >
            Client Expects: <strong className="text-cyan-400">{clientBindingField}</strong>
          </button>

          <button
            onClick={fetchCatalog}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              showJsonInspector
                ? 'bg-blue-950 border-blue-500/50 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1" />
            <span>JSON Inspector</span>
          </button>

          <button
            onClick={handleNewClick}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {/* Contract Drift Warning Banner */}
        <ContractDriftBanner
          clientBindingField={clientBindingField}
          backendField={backendField}
          onAutoSync={onTriggerBobSync}
          onReset={handleToggleBinding}
          isSyncing={isSyncing}
        />

        {/* Product Form Modal / Section */}
        {formVisible && (
          <div className="mb-4">
            <ProductForm
              initial={editingProduct}
              activeField={clientBindingField}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setFormVisible(false);
                setEditingProduct(null);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Product List Table */}
        <ProductList
          products={products}
          clientBindingField={clientBindingField}
          backendField={backendField}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* JSON Inspector Collapsible Panel */}
        {showJsonInspector && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Raw Response from GET /api/products</span>
              </span>
              <span className="text-[10px] text-slate-500">
                Count: {products.length}
              </span>
            </div>
            <pre className="bg-slate-900/80 p-3 rounded-lg overflow-x-auto text-slate-300 text-[11px] leading-relaxed max-h-56">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          <span>Persisted:</span>
          <span className="text-slate-300">backend/data/products.json</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <a
            href="http://localhost:3001/api-docs"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Swagger UI (/api-docs)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
