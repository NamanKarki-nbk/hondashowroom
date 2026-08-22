"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { VehiclePrice } from "@prisma/client";

interface PricesAdminClientProps {
  initialPrices: VehiclePrice[];
}

export default function PricesAdminClient({ initialPrices }: PricesAdminClientProps) {
  const [prices, setPrices] = useState<VehiclePrice[]>(initialPrices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    modelName: "",
    variant: "",
    category: "Motorcycle", // Default category
    exShowroomPriceNPR: "",
    onRoadPriceNPR: "",
  });

  const filteredPrices = prices.filter(
    (price) =>
      price.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.variant?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      modelName: "",
      variant: "",
      category: "Motorcycle",
      exShowroomPriceNPR: "",
      onRoadPriceNPR: "",
    });
    setEditingId(null);
  };

  const handleOpenModal = (price?: VehiclePrice) => {
    if (price) {
      setFormData({
        modelName: price.modelName,
        variant: price.variant || "",
        category: price.category,
        exShowroomPriceNPR: price.exShowroomPriceNPR.toString(),
        onRoadPriceNPR: price.onRoadPriceNPR.toString(),
      });
      setEditingId(price.id);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        exShowroomPriceNPR: Number(formData.exShowroomPriceNPR),
        onRoadPriceNPR: Number(formData.onRoadPriceNPR),
      };

      const res = await fetch("/api/admin/prices", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      if (!res.ok) throw new Error("Failed to save price");
      const savedPrice = await res.json();

      if (editingId) {
        setPrices((prev) =>
          prev.map((p) => (p.id === editingId ? savedPrice : p))
        );
      } else {
        setPrices((prev) => [savedPrice, ...prev]);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this price?")) return;
    try {
      const res = await fetch(`/api/admin/prices?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPrices((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete price");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search prices by model or variant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Price
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Model Name</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Variant</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Category</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Ex-Showroom (NPR)</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">On-Road (NPR)</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredPrices.length > 0 ? (
              filteredPrices.map((price) => (
                <tr key={price.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">{price.modelName}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{price.variant || "-"}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {price.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-900 dark:text-white font-medium">
                    Rs. {price.exShowroomPriceNPR.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-900 dark:text-white font-medium">
                    Rs. {price.onRoadPriceNPR.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(price)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Edit Price"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(price.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Price"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No pricing data found. Add some to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Price" : "Add New Price"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Model Name</label>
                <input
                  type="text"
                  required
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="e.g., Dio"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Variant (Optional)</label>
                  <input
                    type="text"
                    value={formData.variant}
                    onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="e.g., STD"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none"
                  >
                    <option value="Scooter">Scooter</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Power Product">Power Product</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ex-Showroom Price</label>
                  <input
                    type="number"
                    required
                    value={formData.exShowroomPriceNPR}
                    onChange={(e) => setFormData({ ...formData, exShowroomPriceNPR: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="NPR"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">On-Road Price</label>
                  <input
                    type="number"
                    required
                    value={formData.onRoadPriceNPR}
                    onChange={(e) => setFormData({ ...formData, onRoadPriceNPR: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="NPR"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Add Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
