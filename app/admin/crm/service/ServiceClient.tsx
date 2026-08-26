"use client";

import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle, Wrench, Loader2 } from 'lucide-react';

interface ServiceBooking {
  id: string;
  vehicleNo: string | null;
  chassisNo: string | null;
  serviceType: string;
  preferredDate: string;
  status: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
  };
}

export default function ServiceClient() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'reminders'>('bookings');
  
  // Bookings state
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [filterStatus, activeTab]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/service?status=${filterStatus}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch service bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/crm/service', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.customer.phone.includes(searchQuery) ||
    (b.vehicleNo && b.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Service Bookings
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'reminders' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Service Reminders (Coming Soon)
        </button>
      </div>

      {activeTab === 'bookings' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex gap-2">
              {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer or vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No service bookings found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Customer Info</th>
                      <th className="px-6 py-4">Vehicle Details</th>
                      <th className="px-6 py-4">Service Required</th>
                      <th className="px-6 py-4">Preferred Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-gray-100">{booking.customer.fullName}</div>
                          <div className="text-gray-500">{booking.customer.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-gray-100">{booking.vehicleNo || 'N/A'}</div>
                          {booking.chassisNo && <div className="text-xs text-gray-500">VIN: {booking.chassisNo}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                            <Wrench className="w-4 h-4 mr-2 text-gray-400" />
                            {booking.serviceType}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(booking.preferredDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative group">
                          <div className="flex justify-end items-center">
                            {updatingId === booking.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            ) : (
                              <div className="flex gap-2">
                                {booking.status === 'PENDING' && (
                                  <button onClick={() => updateStatus(booking.id, 'IN_PROGRESS')} className="text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg">Start Service</button>
                                )}
                                {booking.status === 'IN_PROGRESS' && (
                                  <button onClick={() => updateStatus(booking.id, 'COMPLETED')} className="text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg">Complete</button>
                                )}
                                {(booking.status === 'PENDING' || booking.status === 'IN_PROGRESS') && (
                                  <button onClick={() => updateStatus(booking.id, 'CANCELLED')} className="text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg">Cancel</button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'reminders' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-12 text-center">
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Service Reminders</h3>
           <p className="text-gray-500">This feature will allow you to track and send upcoming maintenance reminders to customers.</p>
        </div>
      )}
    </div>
  );
}
