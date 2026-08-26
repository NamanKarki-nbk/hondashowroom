"use client";

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, MoreVertical, Loader2 } from 'lucide-react';

interface TestRide {
  id: string;
  name: string;
  phone: string;
  modelName: string;
  preferredDate: string;
  timeSlot: string;
  status: string;
  notes: string;
  createdAt: string;
  branch: { name: string } | null;
}

export default function TestRidesClient() {
  const [testRides, setTestRides] = useState<TestRide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestRides();
  }, [filterStatus]);

  const fetchTestRides = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/test-rides?status=${filterStatus}`);
      if (res.ok) {
        const data = await res.json();
        setTestRides(data);
      }
    } catch (error) {
      console.error('Failed to fetch test rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/crm/test-rides', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchTestRides();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRides = testRides.filter(ride => 
    ride.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ride.phone.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or phone..."
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
        ) : filteredRides.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No test rides found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Customer Info</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredRides.map(ride => (
                  <tr key={ride.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{ride.name}</div>
                      <div className="text-gray-500">{ride.phone}</div>
                      {ride.notes && <div className="text-xs text-gray-400 mt-1 italic max-w-xs truncate">"{ride.notes}"</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{ride.modelName}</div>
                      {ride.branch && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" /> {ride.branch.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(ride.preferredDate).toLocaleDateString()}
                      </div>
                      {ride.timeSlot && (
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <Clock className="w-3 h-3 mr-2 text-gray-400" />
                          {ride.timeSlot}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(ride.status)}`}>
                        {ride.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative group">
                      <div className="flex justify-end items-center">
                        {updatingId === ride.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        ) : (
                          <div className="flex gap-2">
                            {ride.status === 'PENDING' && (
                              <button onClick={() => updateStatus(ride.id, 'CONFIRMED')} className="text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg">Confirm</button>
                            )}
                            {ride.status === 'CONFIRMED' && (
                              <button onClick={() => updateStatus(ride.id, 'COMPLETED')} className="text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg">Complete</button>
                            )}
                            {(ride.status === 'PENDING' || ride.status === 'CONFIRMED') && (
                              <button onClick={() => updateStatus(ride.id, 'CANCELLED')} className="text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg">Cancel</button>
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
    </div>
  );
}
