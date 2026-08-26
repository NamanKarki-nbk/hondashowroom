"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const fetchNotifications = async (showToast = false) => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        
        // Show toast for new notifications if count went up
        if (showToast && data.unreadCount > unreadCount && unreadCount !== 0) {
          toast.info("New notifications received", {
            description: "Check your notification center.",
          });
        }
        
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // Poll every 30 seconds and on route change
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(true), 30000);
    return () => clearInterval(interval);
  }, [pathname]);

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

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{unreadCount} New</span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <Bell className="w-8 h-8 opacity-20 mb-3" />
                  <p className="text-sm font-medium">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <div 
                    key={n.id} 
                    className={`
                      relative p-3 rounded-xl transition-colors group flex flex-col gap-1
                      ${!n.isRead ? 'bg-primary/5 border border-primary/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'}
                    `}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-sm ${!n.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {n.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.isRead && (
                          <button onClick={(e) => markAsRead(n.id, e)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-md" title="Mark read">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={(e) => deleteNotification(n.id, e)} className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-700 rounded-md" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {n.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-slate-800/50">
                      <span className="text-[10px] text-gray-400 font-medium">{formatDate(n.createdAt)}</span>
                      {n.link && (
                        <Link href={n.link} onClick={() => setIsOpen(false)} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
                          View details <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 text-center">
              <Link 
                href="/admin/notifications" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors inline-block"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
