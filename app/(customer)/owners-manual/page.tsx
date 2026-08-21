import { prisma } from "@/lib/prisma";
import OwnersManualClient from "@/components/OwnersManualClient";
import Link from "next/link";
import Image from "next/image";
import { Home, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Owner's Manual & Brochures | Society Enterprises Honda",
  description: "Download the official Owner's Manual and product brochures for your Honda motorcycle, scooter, or power product. Quick access to all model documents in one place.",
};

export default async function OwnersManualPage() {
  const products = await prisma.productCatalog.findMany({
    select: { id: true, name: true, category: true, imageUrl: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <main className="min-h-screen bg-[#242938] pt-28 pb-24">

      {/* Hero Banner */}
      <div className="bg-[#242938]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-6 pb-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#868ea3] mb-4">
            <Link href="/" className="hover:text-primary-foreground flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary-foreground font-medium">Owner's Manual</span>
          </nav>
        </div>
        
        {/* Banner Image */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <img 
            src="/images/owner-manual-bg.jpg" 
            alt="Owners Manual Banner"
            width={1921}
            height={757}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12">
        <OwnersManualClient products={products} />
      </div>
    </main>
  );
}
