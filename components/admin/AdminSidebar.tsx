"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  FileText, LogOut, ChevronLeft, ChevronRight, Settings, X, 
  DollarSign, CreditCard, Globe, ChevronDown, BellDot, Briefcase, Bell
} from "lucide-react";
import Logo from "@/components/Logo";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

const navCategories = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    items: []
  },
  {
    name: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
    items: []
  },
  {
    name: "Front Website (CMS)",
    icon: Globe,
    items: [
      { name: "Home Page", href: "/admin/cms/home" },
      { name: "Offers & Schemes", href: "/admin/cms/offers" },
      { name: "AMC Plans & Bookings", href: "/admin/cms/amc" },
      { name: "Branch Info", href: "/admin/cms/branches" },
      { name: "Blog Posts", href: "/admin/blogs" },
      { name: "Products Catalog", href: "/admin/products" },
      { name: "Accessories Catalog", href: "/admin/accessories" },
      { name: "PDF Brochures", href: "/admin/inventory/brochures" },
    ]
  },
  {
    name: "Inventory",
    icon: Package,
    items: [
      { name: "Vehicle Stock", href: "/admin/inventory" },
      { name: "Multi-Branch Transfer", href: "/admin/inventory/transfer" },
      { name: "Purchase Invoices", href: "/admin/inventory/purchase-invoices" },
      { name: "Spare Parts", href: "/admin/inventory/spare-parts" },
    ]
  },
  {
    name: "Sales & POS",
    icon: ShoppingCart,
    items: [
      { name: "New Sale / Invoice", href: "/admin/sales" },
      { name: "New Invoice (POS)", href: "/admin/pos" },
      { name: "Digital Quotation", href: "/admin/crm/quotations" },
      { name: "Sales Calendar", href: "/admin/sales-calendar" },
      { name: "Sales History", href: "/admin/sales-history" },
      { name: "Sales Analysis", href: "/admin/sales-analysis" },
      { name: "Vehicle Price List", href: "/admin/prices" },
      { name: "Finance Plans", href: "/admin/finance" },
    ]
  },
  {
    name: "Customer Hub (CRM)",
    icon: Users,
    items: [
      { name: "Customer Directory", href: "/admin/crm/customers" },
      { name: "Leads & Follow-ups", href: "/admin/crm/leads" },
      { name: "Test Ride Bookings", href: "/admin/crm/test-rides" },
      { name: "KYC Directory", href: "/admin/users" },
      { name: "Service Bookings", href: "/admin/crm/service" },
      { name: "Deliveries & Handover", href: "/admin/crm/deliveries" },
      { name: "Vehicle Valuations", href: "/admin/crm/valuations" },
      { name: "Referrals & Loyalty", href: "/admin/crm/referrals" },
    ]
  },
  {
    name: "Staff & HR",
    icon: Briefcase,
    items: [
      { name: "Staff Directory", href: "/admin/settings/staff" },
    ]
  },
  {
    name: "Official Documents",
    icon: FileText,
    items: [
      { name: "Letters & Claims", href: "/admin/letters" },
      { name: "Generate New", href: "/admin/letters/new" },
    ]
  },
  {
    name: "Settings",
    icon: Settings,
    items: [
      { name: "Roles & Permissions", href: "/admin/settings/roles" },
      { name: "WhatsApp API Config", href: "/admin/settings/whatsapp" },
      { name: "Branding & Invoice Setup", href: "/admin/settings/branding" },
      { name: "Service Charges", href: "/admin/settings/service-charges" },
    ]
  }
];

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(() => {
    const active = navCategories.find(cat => 
      cat.items.some(item => pathname.startsWith(item.href)) || (cat.href && pathname.startsWith(cat.href))
    );
    return active ? active.name : null;
  });

  const [actionStats, setActionStats] = useState({ pendingTestRides: 0, newLeads: 0, pendingQuotations: 0, pendingAmcBookings: 0, pendingServiceBookings: 0 });

  useEffect(() => {
    const fetchActionStats = async () => {
      try {
        const res = await fetch("/api/admin/action-needed");
        if (res.ok) {
          const data = await res.json();
            setActionStats({
              pendingTestRides: data.pendingTestRides || 0,
              newLeads: data.newLeads || 0,
              pendingQuotations: data.pendingQuotations || 0,
              pendingAmcBookings: data.pendingAmcBookings || 0,
              pendingServiceBookings: data.pendingServiceBookings || 0,
            });
        }
      } catch (error) {
        console.error("Failed to fetch action stats", error);
      }
    };
    fetchActionStats();
  }, [pathname]); // Refetch when navigating


  const toggleCategory = (name: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setExpandedCategory(prev => prev === name ? null : name);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col bg-[#1a1a1a] text-white
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
          <Link href="/" className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <Logo className="h-8 max-w-[120px] lg:max-w-[140px] text-primary shrink-0" />
            {!isCollapsed && <span className="font-black text-xl md:text-2xl uppercase tracking-tight whitespace-nowrap">Admin</span>}
          </Link>
          
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navCategories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.name && !isCollapsed;
            
            // Check if any sub-item is active
            const isAnySubActive = category.items.some(item => pathname.startsWith(item.href)) || (category.href && pathname.startsWith(category.href));

            if (category.items.length === 0 && category.href) {
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => {
                    setIsMobileOpen(false);
                    setExpandedCategory(null);
                  }}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-colors group
                    ${isCollapsed ? 'justify-center' : 'gap-3'}
                    ${isAnySubActive ? "bg-primary text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}
                  `}
                  title={isCollapsed ? category.name : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isAnySubActive ? 'text-white' : 'group-hover:text-white'}`} strokeWidth={1.5} />
                  {!isCollapsed && <span className="font-bold text-sm tracking-wide">{category.name}</span>}
                </Link>
              );
            }

            return (
              <div key={category.name} className="flex flex-col">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={`
                    flex items-center justify-between px-3 py-3 rounded-lg transition-colors group w-full text-left
                    ${isCollapsed ? 'justify-center' : 'gap-3'}
                    ${isAnySubActive && !isExpanded ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}
                  `}
                  title={isCollapsed ? category.name : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 shrink-0 ${isAnySubActive ? 'text-white' : 'group-hover:text-white'}`} strokeWidth={1.5} />
                    {!isCollapsed && <span className="font-bold text-sm tracking-wide">{category.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Accordion Sub-items */}
                <div 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                  `}
                >
                  {!isCollapsed && (
                    <div className="flex flex-col gap-1 pl-11 pr-2 py-1">
                      {category.items.map(item => {
                        const isSubActive = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`
                              py-2 px-3 rounded-md text-sm font-semibold transition-colors
                              ${isSubActive 
                                ? "bg-primary/20 text-primary" 
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}
                            `}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Needed Widget */}
        {!isCollapsed && (actionStats.pendingTestRides > 0 || actionStats.newLeads > 0 || actionStats.pendingQuotations > 0 || actionStats.pendingAmcBookings > 0 || actionStats.pendingServiceBookings > 0) && (
          <div className="px-4 py-4 shrink-0">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <BellDot className="w-5 h-5" strokeWidth={1.5} />
                <h4 className="font-bold text-sm">Action Needed</h4>
              </div>
              <div className="text-xs text-gray-400 font-medium mb-3 space-y-1">
                {actionStats.pendingTestRides > 0 && <p>&bull; {actionStats.pendingTestRides} pending test {actionStats.pendingTestRides === 1 ? 'ride' : 'rides'}</p>}
                {actionStats.newLeads > 0 && <p>&bull; {actionStats.newLeads} new contact {actionStats.newLeads === 1 ? 'inquiry' : 'inquiries'}</p>}
                {actionStats.pendingQuotations > 0 && <p>&bull; {actionStats.pendingQuotations} pending quotation {actionStats.pendingQuotations === 1 ? 'request' : 'requests'}</p>}
                {actionStats.pendingAmcBookings > 0 && <p>&bull; {actionStats.pendingAmcBookings} pending AMC {actionStats.pendingAmcBookings === 1 ? 'booking' : 'bookings'}</p>}
                {actionStats.pendingServiceBookings > 0 && <p>&bull; {actionStats.pendingServiceBookings} pending service {actionStats.pendingServiceBookings === 1 ? 'booking' : 'bookings'}</p>}
              </div>
              <Link href="/admin/crm/leads" className="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors px-3 py-2 rounded-lg block text-center">
                Review Now
              </Link>
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 shrink-0 flex flex-col gap-2">
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs text-gray-500 font-medium">
              Society Enterprises
            </div>
          )}
          <Link
            href="/"
            className={`
              flex items-center px-3 py-3 rounded-lg transition-colors group text-gray-400 hover:bg-white/10 hover:text-white
              ${isCollapsed ? 'justify-center' : 'gap-3'}
            `}
            title={isCollapsed ? "Back to Showroom" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            {!isCollapsed && <span className="font-bold text-sm">Exit Admin</span>}
          </Link>
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            if (!isCollapsed) setExpandedCategory(null);
          }}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-primary text-white rounded-full items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
