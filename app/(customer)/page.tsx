import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Search, Menu, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import EmiCalculator from "@/components/EmiCalculator";
import HeroSlider from "@/components/HeroSlider";
import CategoryCarousel from "@/components/CategoryCarousel";
import AccessoriesSection from "@/components/AccessoriesSection";
import HondaBlogSection from "@/components/HondaBlogSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { prisma } from "@/lib/prisma";

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
