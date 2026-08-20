import { prisma } from "@/lib/prisma";
import { Users, Mail, Phone, Calendar, Search, ShieldCheck, AlertCircle } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Admin | User Management",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#0B0B0C] p-8 text-primary-foreground font-sans h-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              User Management
            </h1>
            <p className="text-gray-400 mt-2">View and manage all registered customers and administrators.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-transparent border-none outline-none text-sm placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">KYC Status</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-800 object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-primary-foreground font-bold border border-slate-700">
                            {user.fullName ? user.fullName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{user.fullName || "Unnamed User"}</div>
                          <div className="text-xs text-gray-500">{user.gender ? `${user.gender.charAt(0)}${user.gender.slice(1).toLowerCase()}` : 'Unknown'} • ID: {user.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      {user.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail className="w-3.5 h-3.5 text-gray-500" /> {user.email}
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="w-3.5 h-3.5 text-gray-500" /> {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                           <ShieldCheck className="w-3.5 h-3.5" /> Verified
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                           <AlertCircle className="w-3.5 h-3.5" /> Pending
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.email === "successbhattarai1998@gmail.com" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-gray-300">
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-primary hover:text-white transition-colors font-medium">View Details</button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No users found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
