"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true })
      });
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications?id=${id}`, {
        method: "DELETE",
      });
      fetchNotifications();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Notification Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all system alerts and customer requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchNotifications}
            className="p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:text-primary rounded-xl shadow-sm transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="p-12 flex justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary opacity-50" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">All caught up!</h3>
            <p className="text-gray-500 dark:text-gray-400">There are no notifications to display right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`
                  p-4 md:p-6 transition-colors flex flex-col md:flex-row gap-4 md:items-center justify-between group
                  ${!n.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}
                `}
              >
                <div className="flex-1 flex gap-4 items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? 'bg-primary shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-transparent'}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {n.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-medium text-gray-400">{formatDate(n.createdAt)}</span>
                    </div>
                    <h3 className={`text-base ${!n.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                      {n.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {n.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-6 md:ml-0">
                  {n.link && (
                    <Link href={n.link}>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:text-primary hover:border-primary/50 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-semibold transition-colors">
                        View <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  )}
                  {!n.isRead && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="p-1.5 text-gray-500 hover:text-emerald-600 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-600 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
