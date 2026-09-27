import React from 'react';
import { Product, ActiveContractField } from '../types';
import { Edit2, Trash2, AlertTriangle, CheckCircle, Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  clientBindingField: ActiveContractField;
  backendField: 'title' | 'productName' | 'unknown';
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  clientBindingField,
  backendField,
  onEdit,
  onDelete,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
        <span className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono">Fetching /api/products from Express backend...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 rounded-xl border border-dashed border-slate-800 p-8">
        <Package className="w-10 h-10 mx-auto mb-2 text-slate-600" />
        <p className="text-sm font-medium">No products found in catalog.</p>
        <p className="text-xs text-slate-500 mt-1">Click "New Product" to seed the Express database.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px] tracking-wider">
            <th className="p-3 pl-4">Product Identifier</th>
            <th className="p-3">
              <div className="flex items-center space-x-1.5">
                <span>Display Name</span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                  JSX: {'{'}{clientBindingField === 'title' ? 'item.title' : 'item.productName'}{'}'}
                </span>
              </div>
            </th>
            <th className="p-3">Price</th>
            <th className="p-3">Contract Status</th>
            <th className="p-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {products.map((product) => {
            // Determine what the client will actually render based on its compiled binding
            const renderedName = clientBindingField === 'title' ? product.title : product.productName;
            const isBrokenBinding = renderedName === undefined;

            return (
              <tr 
                key={product.id}
                className={`hover:bg-slate-800/40 transition-colors ${
                  isBrokenBinding ? 'bg-red-950/10' : ''
                }`}
              >
                {/* ID */}
                <td className="p-3 pl-4 font-mono text-slate-400 text-[11px]">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800/80">
                    {product.id.substring(0, 13)}...
                  </span>
                </td>

                {/* Name */}
                <td className="p-3">
                  {isBrokenBinding ? (
                    <div className="space-y-0.5">
                      <span className="font-bold font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40 text-xs">
                        undefined
                      </span>
                      <span className="block text-[10px] text-red-400/80 font-mono">
                        (Backend sent <code>"{backendField}": "{product.productName || product.title}"</code>)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-100 text-sm">
                        {renderedName}
                      </span>
                      {clientBindingField === 'productName' && (
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                          v2.1
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* Price */}
                <td className="p-3 font-mono font-semibold text-emerald-400">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </td>

                {/* Contract Status */}
                <td className="p-3 font-mono text-[10px]">
                  {isBrokenBinding ? (
                    <span className="inline-flex items-center space-x-1 text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span>DRIFT MISMATCH</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>IN CONTRACT</span>
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 pr-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
