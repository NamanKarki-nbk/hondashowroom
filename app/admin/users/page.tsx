import { prisma } from "@/lib/prisma";
import { Users, Mail, Phone, Calendar, Search, ShieldCheck, AlertCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin | User Management",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-transparent p-4 md:p-8 text-gray-900 dark:text-slate-50 font-sans h-full transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black flex items-center gap-4 tracking-tight">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-2xl">
                <Users className="w-8 h-8 text-primary" />
              </div>
              User Management
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium tracking-wide">
              View and manage all registered customers and administrators.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="w-full md:w-auto bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-full px-5 py-3 flex items-center gap-3 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
            <Search className="w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="bg-transparent border-none outline-none text-sm w-full md:w-64 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 font-medium"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800/80 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800/80 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                  <th className="px-8 py-5">User</th>
                  <th className="px-6 py-5">Contact</th>
                  <th className="px-6 py-5">KYC Status</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Joined</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 object-cover shadow-sm border border-gray-200 dark:border-slate-700" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-gray-700 dark:text-white font-black text-lg shadow-sm border border-gray-200 dark:border-slate-700">
                            {user.fullName ? user.fullName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
                          </div>
                        )}
                        <div>
                          <div className="font-black text-gray-900 dark:text-white tracking-tight">{user.fullName || "Unnamed User"}</div>
                          <div className="text-xs font-bold text-gray-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">
                            {user.gender ? `${user.gender}` : 'Unknown'} • ID: {user.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 space-y-2">
                      {user.email && (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-300">
                          <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500" /> {user.email}
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-300">
                          <Phone className="w-4 h-4 text-gray-400 dark:text-slate-500" /> {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {user.isVerified ? (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                           <ShieldCheck className="w-3.5 h-3.5" /> Verified
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                           <AlertCircle className="w-3.5 h-3.5" /> Pending
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {user.email === "successbhattarai1998@gmail.com" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300 border border-gray-200 dark:border-slate-700 uppercase tracking-widest">
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link href={`/admin/users/${user.id}`}>
                        <button className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 text-gray-700 dark:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-md group-hover:bg-gray-50 dark:group-hover:bg-slate-700">
                          View
                          <MoreHorizontal className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 dark:text-slate-500">
                        <Users className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-lg">No users found in the database.</p>
                      </div>
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
