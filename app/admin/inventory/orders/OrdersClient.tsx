"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  FileText, Plus, Trash2, CheckCircle2, XCircle, Send, Printer, MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id?: string;
  variantId: string;
  colorId: string;
  quantity: number;
  variant?: any;
  color?: any;
};

type Order = {
  id: string;
  orderNo: string;
  date: string;
  status: string;
  remarks: string | null;
  items: OrderItem[];
};

type Props = {
  orders: Order[];
  masters: any[];
};

export default function OrdersClient({ orders: initialOrders, masters }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  
  // Create Order State
  const [items, setItems] = useState<OrderItem[]>([{ variantId: "", colorId: "", quantity: 1 }]);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => setItems([...items, { variantId: "", colorId: "", quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    // If variant changes, reset color
    if (field === "variantId") newItems[index].colorId = "";
    setItems(newItems);
  };

  const getColorsForVariant = (variantId: string) => {
    const master = masters.find(m => m.variants.some((v: any) => v.id === variantId));
    return master ? master.colors : [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(i => i.variantId && i.colorId && i.quantity > 0);
    if (validItems.length === 0) {
      alert("Please add at least one valid item.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/inventory/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: validItems, remarks }),
      });
      if (res.ok) {
        const newOrder = await res.json();
        // Optimistic update - simplified for immediate feedback
        window.location.reload(); 
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create order");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const inputCls = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm";
  const btnCls = "bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const renderStatus = (status: string) => {
    switch (status) {
      case "PENDING": return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">PENDING</span>;
      case "SENT": return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">SENT</span>;
      case "DELIVERED": return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">DELIVERED</span>;
      case "CANCELLED": return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">CANCELLED</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-800">
        {[
          { key: "list", label: "Order History", icon: FileText },
          { key: "create", label: "Create Order", icon: Plus },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all -mb-px ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Order No</th>
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Items (Qty)</th>
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right sticky right-0 bg-gray-50/50 dark:bg-slate-900/50 z-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-gray-400">No orders found.</td></tr>
                ) : orders.map((order) => {
                  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
                  return (
                    <tr key={order.id} className="group hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-gray-900 dark:text-white">{order.orderNo}</td>
                      <td className="py-4 px-5 text-sm">{format(new Date(order.date), "MMM dd, yyyy")}</td>
                      <td className="py-4 px-5 text-sm">
                        <p className="font-bold">{totalQty} units</p>
                        <p className="text-xs text-gray-500">{order.items.length} variants</p>
                      </td>
                      <td className="py-4 px-5">{renderStatus(order.status)}</td>
                      <td className="py-4 px-5 text-right sticky right-0 bg-white/50 dark:bg-slate-900/50 group-hover:bg-gray-50/80 dark:group-hover:bg-slate-800/30 z-10 border-l border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => window.print()} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Print Order">
                            <Printer className="w-5 h-5" />
                          </button>
                          {order.status === 'PENDING' && (
                            <>
                              <button onClick={() => updateStatus(order.id, 'SENT')} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all" title="Mark as Sent">
                                <Send className="w-5 h-5" />
                              </button>
                              <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all" title="Cancel">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {order.status === 'SENT' && (
                            <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all" title="Mark as Delivered">
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 p-6 md:p-8 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                  <div className="md:col-span-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Model & Variant</label>
                    <select
                      required
                      value={item.variantId}
                      onChange={(e) => handleItemChange(index, "variantId", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select Variant</option>
                      {masters.map(m => (
                        <optgroup key={m.id} label={m.name}>
                          {m.variants.map((v: any) => (
                            <option key={v.id} value={v.id}>{m.name} - {v.variantName}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Color</label>
                    <select
                      required
                      value={item.colorId}
                      onChange={(e) => handleItemChange(index, "colorId", e.target.value)}
                      className={inputCls}
                      disabled={!item.variantId}
                    >
                      <option value="">Select Color</option>
                      {getColorsForVariant(item.variantId).map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end md:mt-5">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-30"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="text-sm font-bold text-primary flex items-center gap-2 hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Another Item
            </button>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Remarks (Optional)</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className={inputCls}
                placeholder="Any special instructions for STC..."
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
              <button type="submit" disabled={isSubmitting} className={btnCls}>
                {isSubmitting ? "Generating Order..." : "Generate Purchase Order"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .bg-white, .bg-white * { visibility: visible; }
          .bg-white { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
          button { display: none !important; }
        }
      `}} />
    </div>
  );
}
