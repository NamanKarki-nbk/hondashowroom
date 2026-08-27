"use client";

import React, { useState, useEffect } from "react";
import { Shield, Users, Check, X, Loader2, Search, ArrowRight, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

type SystemRole = "SUPERADMIN" | "ADMIN" | "MANAGER" | "STAFF" | "USER";

interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: SystemRole;
  createdAt: string;
}

export default function RolesClient({ currentUserRole }: { currentUserRole?: string }) {
  const [activeTab, setActiveTab] = useState<"matrix" | "manage">("matrix");
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "manage") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/roles/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: SystemRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/settings/roles/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });
      
      if (res.ok) {
        toast.success("User role updated successfully");
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        const errorText = await res.text();
        toast.error(`Update failed: ${errorText}`);
      }
    } catch (error) {
      toast.error("An error occurred while updating role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.phone && u.phone.includes(searchTerm)) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const permissionsMatrix = [
    { feature: "View Public Website", superadmin: true, admin: true, manager: true, staff: true, user: true },
    { feature: "Book Service & Test Rides", superadmin: true, admin: true, manager: true, staff: true, user: true },
    { feature: "View Basic Sales & CRM", superadmin: true, admin: true, manager: true, staff: true, user: false },
    { feature: "Generate POS Invoices", superadmin: true, admin: true, manager: true, staff: true, user: false },
    { feature: "Manage Vehicle Inventory", superadmin: true, admin: true, manager: true, staff: false, user: false },
    { feature: "Edit Sales Analysis Targets", superadmin: true, admin: true, manager: true, staff: false, user: false },
    { feature: "Access Finance Apps", superadmin: true, admin: true, manager: true, staff: false, user: false },
    { feature: "Delete Sales Records", superadmin: true, admin: true, manager: false, staff: false, user: false },
    { feature: "Manage User Roles", superadmin: true, admin: true, manager: false, staff: false, user: false },
    { feature: "Delete Database Tables", superadmin: true, admin: false, manager: false, staff: false, user: false },
  ];

  const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
      case "SUPERADMIN": return <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-purple-200 dark:border-purple-500/20">Superadmin</span>;
      case "ADMIN": return <span className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-500/20">Admin</span>;
      case "MANAGER": return <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-500/20">Manager</span>;
      case "STAFF": return <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">Staff</span>;
      default: return <span className="bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-gray-200 dark:border-zinc-700">User</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/50 text-gray-900 dark:text-gray-100">
      
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 pt-4 border-b border-gray-100 dark:border-zinc-800 shrink-0">
        <button 
          onClick={() => setActiveTab("matrix")}
          className={`pb-3 font-bold text-sm tracking-wide transition-colors border-b-2 ${
            activeTab === "matrix" 
              ? "border-primary text-primary" 
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Permission Matrix</span>
        </button>
        <button 
          onClick={() => setActiveTab("manage")}
          className={`pb-3 font-bold text-sm tracking-wide transition-colors border-b-2 ${
            activeTab === "manage" 
              ? "border-primary text-primary" 
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Manage Access</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "matrix" ? (
          <div className="p-6 h-full">
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-primary mb-1">System Architecture Note</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Roles are currently strictly enforced in the system logic (Middleware & API layer). 
                    To upgrade a regular user to a staff member, switch to the <strong>Manage Access</strong> tab.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/90 dark:bg-zinc-800/90 backdrop-blur-md">
                    <tr className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      <th className="px-6 py-4">Feature / Action</th>
                      <th className="px-4 py-4 text-center">Superadmin</th>
                      <th className="px-4 py-4 text-center">Admin</th>
                      <th className="px-4 py-4 text-center">Manager</th>
                      <th className="px-4 py-4 text-center">Staff</th>
                      <th className="px-4 py-4 text-center">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                    {permissionsMatrix.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm">{row.feature}</td>
                        <td className="px-4 py-4 text-center">
                          {row.superadmin ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {row.admin ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {row.manager ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {row.staff ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {row.user ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Search Bar for Manage Tab */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                {loading ? "Loading..." : `${filteredUsers.length} Users`}
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="sticky top-0 bg-gray-50/90 dark:bg-zinc-800/90 backdrop-blur-md z-10 shadow-sm border-b border-gray-200 dark:border-zinc-700">
                  <tr className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    <th className="px-6 py-4">User Info</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-center">Current Role</th>
                    <th className="px-6 py-4 text-right">Assign New Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 dark:text-white tracking-tight">{user.fullName || "Unnamed User"}</span>
                          <span className="text-xs font-bold text-gray-400 mt-0.5 uppercase">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">{user.phone}</div>
                          {user.email && <div className="text-xs text-gray-400">{user.email}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as SystemRole)}
                            disabled={updatingId === user.id || (user.role === "SUPERADMIN" && currentUserRole !== "SUPERADMIN")}
                            className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-50"
                          >
                            <option value="USER">User (No Admin Access)</option>
                            <option value="STAFF">Staff (POS & CRM)</option>
                            <option value="MANAGER">Manager (Inventory & Admin)</option>
                            <option value="ADMIN">Admin (Full Access)</option>
                            {(user.role === "SUPERADMIN" || currentUserRole === "SUPERADMIN") && (
                              <option value="SUPERADMIN">Superadmin (Supreme)</option>
                            )}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <p className="font-bold text-gray-500">No users found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
