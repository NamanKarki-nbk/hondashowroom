import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Search, Menu, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";

const EmiCalculator = dynamic(() => import("@/components/EmiCalculator"), { ssr: false });
const HeroSlider = dynamic(() => import("@/components/HeroSlider"), { ssr: false });
const CategoryCarousel = dynamic(() => import("@/components/CategoryCarousel"), { ssr: false });
const AccessoriesSection = dynamic(() => import("@/components/AccessoriesSection"), { ssr: false });
const HondaBlogSection = dynamic(() => import("@/components/HondaBlogSection"), { ssr: false });

export default async function CustomerLandingPage() {
  const products = await prisma.productCatalog.findMany();

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-background text-gray-900 dark:text-foreground font-sans selection:bg-[#c1291A] selection:text-[#f3ebdd] overflow-x-hidden transition-colors duration-300">
      


      {/* Hero Auto-Slider (TVS Style) */}
      <div className="pt-28">
        <HeroSlider />
      </div>

      {/* Choose Vehicle Carousel (Honda Data in TVS Tabs) */}
      <div id="products">
        <CategoryCarousel products={products} />
      </div>

      {/* Accessories Section */}
      <div id="accessories">
        <AccessoriesSection />
      </div>

      {/* Honda Blog Section */}
      <div id="blog">
        <HondaBlogSection />
      </div>

      {/* Utilities Section (EMI & OCR) */}
      <section id="ocr" className="py-24 px-6 relative z-10 bg-[#f3ebdd]">
        <div className="max-w-7xl mx-auto">
          <EmiCalculator />
        </div>
      </section>


    </div>
  );
}
