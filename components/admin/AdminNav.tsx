"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package, ShoppingCart, FileText } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Accessories", href: "/admin/accessories", icon: Package },
    { name: "POS", href: "/admin/pos", icon: ShoppingCart },
    { name: "Letters", href: "/admin/letters", icon: FileText },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-2 xl:gap-4 text-[13px] xl:text-sm font-bold uppercase tracking-wide flex-1 justify-center">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? "bg-primary text-white shadow-md" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4" /> {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
