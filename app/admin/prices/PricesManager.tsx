"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import type { Vehicle, ProductCatalog } from "@prisma/client";

interface PricesManagerProps {
  initialPrices: Vehicle[];
  initialPowerProducts: ProductCatalog[];
}

export default function PricesManager({ initialPrices, initialPowerProducts }: PricesManagerProps) {
  const [prices, setPrices] = useState<Vehicle[]>(initialPrices);
  const [powerProductsList, setPowerProductsList] = useState<ProductCatalog[]>(initialPowerProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<Partial<Vehicle> | null>(null);
  
  const [isPPModalOpen, setIsPPModalOpen] = useState(false);
  const [currentPP, setCurrentPP] = useState<Partial<ProductCatalog> | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Grouped and filtered
  const scootersAndMotorcycles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = prices.filter(
      (p) => 
        (p.category === 'SCOOTER' || p.category === 'MOTORCYCLE') && 
        p.modelName.toLowerCase().includes(q)
    );
    // Sort scooters first, then motorcycles
    return filtered.sort((a, b) => {
      if (a.category === 'SCOOTER' && b.category !== 'SCOOTER') return -1;
      if (a.category !== 'SCOOTER' && b.category === 'SCOOTER') return 1;
      return a.modelName.localeCompare(b.modelName);
    });
  }, [prices, searchQuery]);

  const powerProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return powerProductsList.filter(
      (p) => p.name.toLowerCase().includes(q)
    );
  }, [powerProductsList, searchQuery]);

  const handleOpenModal = (price?: Vehicle) => {
    if (price) {
      setCurrentPrice({ ...price });
    } else {
      setCurrentPrice({
        modelName: "",
        cc: 0,
        price: 0,
        thirdPartyInsurance: 0,
        fullInsurance: 0,
        category: "MOTORCYCLE"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPrice(null);
  };

  const handleOpenPPModal = (pp?: ProductCatalog) => {
    if (pp) {
      setCurrentPP({ ...pp });
    } else {
      setCurrentPP({
        name: "",
        category: "POWER_PRODUCTS",
        price: 0,
        imageUrl: "",
      });
    }
    setIsPPModalOpen(true);
  };

  const handleClosePPModal = () => {
    setIsPPModalOpen(false);
    setCurrentPP(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrice) return;

    setIsSaving(true);
    try {
      const method = currentPrice.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/prices", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPrice),
      });

      if (!res.ok) throw new Error("Failed to save price");

      const savedPrice = await res.json();

      if (method === "PUT") {
        setPrices(prices.map((p) => (p.id === savedPrice.id ? savedPrice : p)));
      } else {
        setPrices([savedPrice, ...prices]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Error saving price");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPP) return;

    setIsSaving(true);
    try {
      const method = currentPP.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/prices", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentPP, isPowerProduct: true }),
      });

      if (!res.ok) throw new Error("Failed to save power product");

      const savedPP = await res.json();

      if (method === "PUT") {
        setPowerProductsList(powerProductsList.map((p) => (p.id === savedPP.id ? savedPP : p)));
      } else {
        setPowerProductsList([savedPP, ...powerProductsList]);
      }
      
      handleClosePPModal();
    } catch (error) {
      console.error(error);
      alert("Error saving power product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, isPowerProduct: boolean = false) => {
    if (!confirm("Are you sure you want to delete this price entry?")) return;

    try {
      const res = await fetch(`/api/admin/prices?id=${id}&isPowerProduct=${isPowerProduct}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete price");

      if (isPowerProduct) {
        setPowerProductsList(powerProductsList.filter((p) => p.id !== id));
      } else {
        setPrices(prices.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting price");
    }
  };

  const renderTable = (data: Vehicle[]) => (
    <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 mb-8">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#2a2a2a] border-b border-gray-200 dark:border-gray-700 text-sm">
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Model Name</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">CC</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Ex-Showroom (NPR)</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">3rd PARTY Insurance</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">FULL INSURANCE</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No vehicles found.
                </td>
              </tr>
            ) : (
              data.map((price) => (
                <tr key={price.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-[#222] transition-colors">
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{price.modelName}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 capitalize">{price.category.toLowerCase().replace('_', ' ')}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{price.cc}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    Rs. {price.price.toLocaleString()}
                  </td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    Rs. {price.thirdPartyInsurance.toLocaleString()}
                  </td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    Rs. {price.fullInsurance.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenModal(price)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors mr-2 inline-flex"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(price.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors inline-flex"
                      title="Delete"
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
    </div>
  );

  const renderPPTable = (data: ProductCatalog[]) => (
    <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 mb-8">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#2a2a2a] border-b border-gray-200 dark:border-gray-700 text-sm">
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Name</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Price (NPR)</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No power products found.
                </td>
              </tr>
            ) : (
              data.map((pp) => (
                <tr key={pp.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-[#222] transition-colors">
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{pp.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 capitalize">{pp.category.toLowerCase().replace('_', ' ')}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    Rs. {pp.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenPPModal(pp)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors mr-2 inline-flex"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pp.id, true)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors inline-flex"
                      title="Delete"
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
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by model name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-red-600 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenPPModal()}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto font-medium"
          >
            <Plus className="w-5 h-5" /> Add Power Product
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto font-medium"
          >
            <Plus className="w-5 h-5" /> Add Vehicle
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Scooters & Motorcycles</h2>
      {renderTable(scootersAndMotorcycles)}

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-8">Power Products</h2>
      {renderPPTable(powerProducts)}

      {/* Modal */}
      {isModalOpen && currentPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentPrice.id ? "Edit Vehicle" : "Add Vehicle"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Model Name
                  </label>
                  <input
                    type="text"
                    required
                    value={currentPrice.modelName || ""}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, modelName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={currentPrice.category || "MOTORCYCLE"}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="SCOOTER">Scooter</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="POWER_PRODUCT">Power Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    CC
                  </label>
                  <input
                    type="number"
                    required
                    value={currentPrice.cc || ""}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, cc: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ex-Showroom Price (NPR)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentPrice.price || ""}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    3rd Party Insurance (NPR)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentPrice.thirdPartyInsurance || 0}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, thirdPartyInsurance: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Insurance (NPR)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentPrice.fullInsurance || 0}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, fullInsurance: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSaving ? "Saving..." : currentPrice.id ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Power Products Modal */}
      {isPPModalOpen && currentPP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentPP.id ? "Edit Power Product" : "Add Power Product"}
              </h2>
              <button
                onClick={handleClosePPModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSavePP} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={currentPP.name || ""}
                    onChange={(e) => setCurrentPP({ ...currentPP, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={currentPP.category || "POWER_PRODUCTS"}
                    onChange={(e) => setCurrentPP({ ...currentPP, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="POWER_PRODUCTS">Power Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Price (NPR)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentPP.price || ""}
                    onChange={(e) => setCurrentPP({ ...currentPP, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={currentPP.imageUrl || ""}
                    onChange={(e) => setCurrentPP({ ...currentPP, imageUrl: e.target.value })}
                    placeholder="/images/power-products/..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] focus:ring-2 focus:ring-red-600 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClosePPModal}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSaving ? "Saving..." : currentPP.id ? "Update Power Product" : "Add Power Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
