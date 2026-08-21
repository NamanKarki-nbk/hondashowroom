"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, Check, X, Filter } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  specs: any;
  colors: any[];
};

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ price: number; inStock: boolean }>({
    price: 0,
    inStock: true,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/products", window.location.origin);
      url.searchParams.append("category", category);
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [category, search]);

  const handleEditClick = (p: Product) => {
    setEditingId(p.id);
    setEditForm({ price: p.price, inStock: p.inStock });
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          price: editForm.price,
          inStock: editForm.inStock,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchProducts(); // refresh
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#CC0000] w-full md:w-48"
          >
            <option value="ALL">All Categories</option>
            <option value="MOTORCYCLE">Motorcycles</option>
            <option value="SCOOTER">Scooters</option>
            <option value="SPARE_PART">Spare Parts</option>
            <option value="ACCESSORY">Accessories</option>
            <option value="POWER_PRODUCT">Power Products</option>
          </select>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#CC0000]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price (NPR)</th>
              <th className="px-4 py-3">Stock Status</th>
              <th className="px-4 py-3 text-right sticky right-0 bg-gray-50 dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 z-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="group border-b border-gray-200 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-900">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {p.name}
                    {p.category === "SPARE_PART" && p.specs?.partNumber && (
                      <span className="ml-2 text-xs text-gray-400">({p.specs.partNumber})</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-full">
                      {p.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        className="w-24 bg-white dark:bg-black border border-gray-300 dark:border-white/20 rounded px-2 py-1 outline-none text-gray-900 dark:text-white"
                      />
                    ) : (
                      `Rs. ${p.price.toLocaleString("en-IN")}`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <select
                        value={editForm.inStock ? "true" : "false"}
                        onChange={(e) => setEditForm({ ...editForm, inStock: e.target.value === "true" })}
                        className="bg-white dark:bg-black border border-gray-300 dark:border-white/20 rounded px-2 py-1 outline-none text-gray-900 dark:text-white"
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${p.inStock ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right sticky right-0 bg-white dark:bg-slate-950 border-l border-gray-200 dark:border-slate-800 z-10 transition-colors group-hover:bg-gray-50 dark:group-hover:bg-zinc-900">
                    {editingId === p.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleSave(p.id)} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(p)} className="p-1.5 text-gray-500 hover:text-[#cd302b] hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
