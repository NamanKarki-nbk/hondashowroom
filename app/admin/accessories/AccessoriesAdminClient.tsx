"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import Image from "next/image";

export type Accessory = {
  id: string;
  name: string;
  partNo: string;
  category: string;
  price: number;
  imageUrl: string;
  stockStatus: string;
  description: string | null;
  vehicleType: string;
  compatibility: string[];
};

interface AccessoriesAdminClientProps {
  initialAccessories: Accessory[];
}

export default function AccessoriesAdminClient({ initialAccessories }: AccessoriesAdminClientProps) {
  const [accessories, setAccessories] = useState<Accessory[]>(initialAccessories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState<Partial<Accessory> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [compatInput, setCompatInput] = useState("");

  const handleOpenModal = (accessory?: Accessory) => {
    if (accessory) {
      setCurrentAccessory({ ...accessory });
      setCompatInput(accessory.compatibility ? accessory.compatibility.join(", ") : "");
    } else {
      setCurrentAccessory({
        name: "",
        partNo: "",
        category: "",
        price: 0,
        imageUrl: "",
        description: "",
        stockStatus: "IN_STOCK",
        vehicleType: "Universal",
        compatibility: [],
      });
      setCompatInput("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAccessory(null);
    setCompatInput("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccessory) return;

    const payload = {
      ...currentAccessory,
      compatibility: compatInput.split(",").map(s => s.trim()).filter(s => s !== "")
    };

    setIsSaving(true);
    try {
      const method = payload.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/accessories", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save accessory");

      const savedAccessory = await res.json();

      if (method === "PUT") {
        setAccessories(accessories.map((a) => (a.id === savedAccessory.id ? savedAccessory : a)));
      } else {
        setAccessories([savedAccessory, ...accessories]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Error saving accessory");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this accessory?")) return;

    try {
      const res = await fetch(`/api/admin/accessories?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete accessory");

      setAccessories(accessories.filter((a) => a.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting accessory");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">Total Accessories: {accessories.length}</p>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Accessory
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#2a2a2a] border-b border-gray-200 dark:border-gray-700 text-sm">
                <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Image</th>
                <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Name & Part No</th>
                <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Category & Type</th>
                <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Price (NPR)</th>
                <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#222]">
                  <td className="p-4">
                    <div className="w-16 h-12 relative bg-gray-100 dark:bg-gray-800 rounded">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                     <p className="font-medium text-sm">{item.name}</p>
                     <p className="text-xs text-gray-500 mt-1">{item.partNo}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                     {item.category}
                     <span className="block text-xs mt-1 capitalize opacity-70">{item.vehicleType}</span>
                  </td>
                  <td className="p-4 font-semibold">₹ {item.price.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.stockStatus === "IN_STOCK" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {accessories.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No accessories found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentAccessory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold">
                {currentAccessory.id ? "Edit Accessory" : "Add New Accessory"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={currentAccessory.name}
                  onChange={(e) => setCurrentAccessory({ ...currentAccessory, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                  placeholder="e.g. Engine Guard"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-semibold mb-1">Part No</label>
                   <input
                     type="text"
                     value={currentAccessory.partNo || ""}
                     onChange={(e) => setCurrentAccessory({ ...currentAccessory, partNo: e.target.value })}
                     className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                     placeholder="e.g. 08R01K4FD00ZA"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold mb-1">Price (NPR)</label>
                   <input
                     type="number"
                     required
                     min="0"
                     value={currentAccessory.price}
                     onChange={(e) => setCurrentAccessory({ ...currentAccessory, price: Number(e.target.value) })}
                     className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                   />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={currentAccessory.category}
                    onChange={(e) => setCurrentAccessory({ ...currentAccessory, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                    placeholder="e.g. Leg Guard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Vehicle Type</label>
                  <select
                    value={currentAccessory.vehicleType}
                    onChange={(e) => setCurrentAccessory({ ...currentAccessory, vehicleType: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                  >
                    <option value="Universal">Universal</option>
                    <option value="scooter">Scooter</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Compatibility (Comma separated models)</label>
                <input
                  type="text"
                  value={compatInput}
                  onChange={(e) => setCompatInput(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                  placeholder="e.g. Activa 6G, Dio 125, CB350"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={currentAccessory.imageUrl}
                  onChange={(e) => setCurrentAccessory({ ...currentAccessory, imageUrl: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={currentAccessory.description || ""}
                  onChange={(e) => setCurrentAccessory({ ...currentAccessory, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Stock Status</label>
                <select
                  value={currentAccessory.stockStatus}
                  onChange={(e) => setCurrentAccessory({ ...currentAccessory, stockStatus: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-primary"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Saving..." : "Save Accessory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
