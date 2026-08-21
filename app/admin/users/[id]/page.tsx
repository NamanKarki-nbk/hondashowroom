import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, ShieldCheck, AlertCircle, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Admin | User Details",
};

interface UserDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 text-gray-900 dark:text-gray-100 font-sans h-full transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
        
        <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm dark:shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar / Initials */}
            <div className="shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 object-cover shadow-sm" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-4xl font-bold shadow-md">
                  {user.fullName ? user.fullName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    {user.fullName || "Unnamed User"}
                  </h1>
                  {user.role === "ADMIN" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">User ID: <span className="font-mono text-xs">{user.id}</span></p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800/50">
                {user.email && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg"><Mail className="w-4 h-4 text-gray-500" /></div>
                    <span className="font-medium">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg"><Phone className="w-4 h-4 text-gray-500" /></div>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg"><Calendar className="w-4 h-4 text-gray-500" /></div>
                  <span className="font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.address && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg"><MapPin className="w-4 h-4 text-gray-500" /></div>
                    <span className="font-medium">{user.address}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status Card */}
            <div className="bg-gray-50 dark:bg-slate-900/80 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 min-w-[200px]">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</span>
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{user.role.toLowerCase()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
