import React, { useState, useEffect } from 'react';
import { Product, ProductInput, ActiveContractField } from '../types';
import { X, Save, PlusCircle } from 'lucide-react';

interface ProductFormProps {
  initial: Product | null;
  activeField: ActiveContractField;
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initial,
  activeField,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [nameValue, setNameValue] = useState<string>('');
  const [priceValue, setPriceValue] = useState<string>('9.99');

  useEffect(() => {
    if (initial) {
      setNameValue(initial.productName || initial.title || '');
      setPriceValue(String(initial.price));
    } else {
      setNameValue('');
      setPriceValue('9.99');
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameValue.trim()) return;

    const price = parseFloat(priceValue);
    if (isNaN(price)) return;

    const payload: ProductInput = {
      price
    };

    // Populate according to active schema
    if (activeField === 'productName') {
      payload.productName = nameValue.trim();
    } else {
      payload.title = nameValue.trim();
    }

    onSubmit(payload);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          {initial ? (
            <Save className="w-4 h-4 text-blue-400" />
          ) : (
            <PlusCircle className="w-4 h-4 text-emerald-400" />
          )}
          <h3 className="font-bold text-sm text-slate-100">
            {initial ? 'Edit Product' : 'Add New Product'}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Product Name / Title ({activeField})</span>
            <span className="text-[10px] text-blue-400">Payload Key: <code>"{activeField}"</code></span>
          </label>
          <input
            type="text"
            required
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="e.g. Widget C Quantum"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Price ($ USD)</span>
            <span className="text-[10px] text-slate-400">Min: 0.00</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isSubmitting && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            <span>{initial ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
