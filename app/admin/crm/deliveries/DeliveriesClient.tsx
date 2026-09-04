"use client";

import React, { useState, useEffect } from 'react';
import { Gift, Search, ChevronDown, CheckCircle2, Star, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function DeliveriesClient() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    keyNo: '',
    tyreMake: '',
    batteryNo: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter]);

  const fetchDeliveries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/deliveries?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (delivery: any, status: string) => {
    if (status === 'DELIVERED') {
      // Open modal to capture mandatory fields
      setSelectedDelivery(delivery);
      setFormData({
        keyNo: delivery.keyNo || '',
        tyreMake: delivery.tyreMake || '',
        batteryNo: delivery.batteryNo || ''
      });
      setErrorMsg('');
      setIsModalOpen(true);
      return;
    }

    // Direct update for other statuses
    try {
      const res = await fetch('/api/admin/crm/deliveries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: delivery.id, status })
      });
      if (res.ok) {
        fetchDeliveries();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keyNo || !formData.tyreMake || !formData.batteryNo) {
      setErrorMsg("Key No, Tyre Make, and Battery No are mandatory for delivery.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/crm/deliveries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedDelivery.id, 
          status: 'DELIVERED',
          keyNo: formData.keyNo,
          tyreMake: formData.tyreMake,
          batteryNo: formData.batteryNo
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchDeliveries();
      } else {
        setErrorMsg("Failed to mark as delivered. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDeliveries = deliveries.filter(d => 
    d.customer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.customer?.phone?.includes(searchQuery)
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      
      {/* Handover Modal */}
      {isModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Complete Handover
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitDelivery} className="p-6 space-y-4">
              <p className="text-sm text-gray-500 mb-2">
                Please provide the following details that were left blank in the PDI Check Sheet to finalize the delivery for <strong className="text-gray-900 dark:text-white">{selectedDelivery.customer.fullName}</strong>.
              </p>
              
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Key No. <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.keyNo}
                  onChange={e => setFormData({...formData, keyNo: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Enter Key Number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tyre Make <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.tyreMake}
                  onChange={e => setFormData({...formData, tyreMake: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. MRF, CEAT"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Battery No. <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.batteryNo}
                  onChange={e => setFormData({...formData, batteryNo: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Enter Battery Number"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Delivery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" /> Deliveries & Handover
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage scheduled vehicle deliveries and customer feedback.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DELIVERED">Delivered</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Invoice No</th>
              <th className="px-4 py-3 font-medium">Delivery Date</th>
              <th className="px-4 py-3 font-medium">Handover Info</th>
              <th className="px-4 py-3 font-medium">Feedback</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">Loading deliveries...</td>
              </tr>
            ) : filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No deliveries found.</td>
              </tr>
            ) : (
              filteredDeliveries.map(delivery => (
                <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{delivery.customer?.fullName}</p>
                    <p className="text-xs text-gray-500">{delivery.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900 dark:text-white">{delivery.vehicle?.variant?.vehicleMaster?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">VIN: {delivery.vehicle?.vin}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {delivery.invoiceNo || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {delivery.deliveryDate ? format(new Date(delivery.deliveryDate), 'MMM d, yyyy h:mm a') : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {delivery.deliveryStatus === 'DELIVERED' ? (
                      <div className="text-xs text-gray-500">
                        <div><span className="font-semibold">Key:</span> {delivery.keyNo || 'N/A'}</div>
                        <div><span className="font-semibold">Tyre:</span> {delivery.tyreMake || 'N/A'}</div>
                        <div><span className="font-semibold">Battery:</span> {delivery.batteryNo || 'N/A'}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {delivery.feedbackScore ? (
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < delivery.feedbackScore! ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No feedback</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative group inline-block">
                      <select
                        value={delivery.deliveryStatus}
                        onChange={(e) => handleStatusChange(delivery, e.target.value)}
                        className={`appearance-none pr-8 pl-3 py-1 text-xs font-semibold rounded-full outline-none cursor-pointer border ${
                          delivery.deliveryStatus === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                          delivery.deliveryStatus === 'SCHEDULED' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="RESCHEDULED">RESCHEDULED</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
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
