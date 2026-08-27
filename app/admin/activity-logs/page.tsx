"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity, Search, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface LogUser {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string;
  role: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  createdAt: string;
  user: LogUser;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/activity-logs");
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          throw new Error("You do not have permission to view activity logs. Only SUPERADMINs are allowed.");
        }
        throw new Error("Failed to fetch activity logs.");
      }
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
      case "UPDATE":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
      case "DELETE":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
      case "LOGIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">{error}</p>
        <Link href="/admin/dashboard" className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Activity className="w-7 h-7 text-primary" />
            System Activity Logs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Monitor all actions performed across the system (Super Admin Only).</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-5 px-6 whitespace-nowrap">Timestamp</th>
                <th className="py-5 px-6 whitespace-nowrap">User</th>
                <th className="py-5 px-6 whitespace-nowrap">Action</th>
                <th className="py-5 px-6 whitespace-nowrap">Entity</th>
                <th className="py-5 px-6 whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">
                    Loading activity logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm")}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {log.user?.fullName || log.user?.phone}
                        </p>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          {log.user?.role} • {log.user?.email || "No Email"}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{log.entity}</p>
                        {log.entityId && (
                          <p className="text-xs font-mono text-gray-500 truncate max-w-[150px]">{log.entityId}</p>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {log.details && Object.keys(log.details).length > 0 ? (
                          <button
                            onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-red-700 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg"
                          >
                            {expandedRow === log.id ? "Hide Details" : "View Details"}
                            {expandedRow === log.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium italic">No details</span>
                        )}
                      </td>
                    </tr>
                    {expandedRow === log.id && (
                      <tr className="bg-gray-50 dark:bg-slate-900/50 border-none">
                        <td colSpan={5} className="py-4 px-6">
                          <pre className="text-[11px] font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-950 p-4 rounded-xl border border-gray-200 dark:border-slate-800 overflow-x-auto shadow-inner">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
