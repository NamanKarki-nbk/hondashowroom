import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Search, Menu, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import ClientOnly from "@/components/ClientOnly";
import EmiCalculator from "@/components/EmiCalculator";
import HeroSlider from "@/components/HeroSlider";
import CategoryCarousel from "@/components/CategoryCarousel";
import AccessoriesSection from "@/components/AccessoriesSection";
import HondaBlogSection from "@/components/HondaBlogSection";

export default async function CustomerLandingPage() {
  const products = await prisma.productCatalog.findMany();

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-background text-gray-900 dark:text-foreground font-sans selection:bg-[#c1291A] selection:text-[#f3ebdd] overflow-x-hidden transition-colors duration-300">
      
      {/* Hero Auto-Slider (TVS Style) */}
      <div className="pt-28">
        <ClientOnly>
          <HeroSlider />
        </ClientOnly>
      </div>

      {/* Choose Vehicle Carousel (Honda Data in TVS Tabs) */}
      <div id="products">
        <ClientOnly>
          <CategoryCarousel products={products} />
        </ClientOnly>
      </div>

      {/* Accessories Section */}
      <div id="accessories">
        <ClientOnly>
          <AccessoriesSection />
        </ClientOnly>
      </div>

      {/* Honda Blog Section */}
      <div id="blog">
        <ClientOnly>
          <HondaBlogSection />
        </ClientOnly>
      </div>

      {/* Utilities Section (EMI & OCR) */}
      <section id="ocr" className="py-24 px-6 relative z-10 bg-[#f3ebdd]">
        <div className="max-w-7xl mx-auto">
          <ClientOnly>
            <EmiCalculator />
          </ClientOnly>
        </div>
      </section>


    </div>
  );
}
