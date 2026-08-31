"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, Package } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  imageUrl: string;
  description: string | null;
  specs: any | null;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "SCOOTER",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setEditingImageUrl(product.imageUrl);
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.basePrice.toString(),
        description: product.description || "",
      });
    } else {
      setEditingId(null);
      setEditingImageUrl(null);
      setFormData({
        id: "",
        name: "",
        category: "SCOOTER",
        price: "",
        description: "",
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const isEditing = !!editingId;
    const url = '/api/admin/products';
    const method = isEditing ? 'PUT' : 'POST';

    const payload = new FormData();
    const finalId = isEditing ? editingId : formData.id || formData.name.toLowerCase().replace(/\s+/g, '-');
    
    payload.append('id', finalId);
    payload.append('name', formData.name);
    payload.append('category', formData.category);
    payload.append('price', formData.price.toString());
    payload.append('description', formData.description);
    
    if (selectedFile) {
      payload.append('image', selectedFile);
    } else if (!isEditing) {
      alert("Image is required for new products.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        body: payload,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        alert(`Operation failed: ${JSON.stringify(data.error || 'Unknown error')}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. See console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product catalog? This will not delete its vehicles.")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const categoryOrder = ["SCOOTER", "MOTORCYCLE", "POWER_PRODUCT"];
  const filteredProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const idxA = categoryOrder.indexOf(a.category);
      const idxB = categoryOrder.indexOf(b.category);
      const rankA = idxA === -1 ? 999 : idxA;
      const rankB = idxB === -1 ? 999 : idxB;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" /> Product Catalog
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage product models and categories for the website.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Base Price</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill sizes="64px" className="object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">NPR {product.basePrice.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mr-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingId && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Product ID (Slug)</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={e => setFormData({...formData, id: e.target.value})}
                    placeholder="e.g. honda-dio-110"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Honda Dio 110"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="SCOOTER">Scooters</option>
                    <option value="MOTORCYCLE">Motorcycles</option>
                    <option value="POWER_PRODUCT">Power Products</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Base Price</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="e.g. 264900"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Image File {editingId && '(Leave empty to keep existing image)'}
                </label>
                {editingImageUrl && (
                  <div className="mb-3">
                     <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                     <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                       <Image src={editingImageUrl} alt="Current product" fill sizes="128px" className="object-contain" />
                     </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Short marketing description..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
