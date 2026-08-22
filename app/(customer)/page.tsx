import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Search, Menu, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import ClientOnly from "@/components/ClientOnly";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import EmiCalculator from "@/components/EmiCalculator";
import HeroSlider from "@/components/HeroSlider";
import CategoryCarousel from "@/components/CategoryCarousel";
import AccessoriesSection from "@/components/AccessoriesSection";
import HondaBlogSection from "@/components/HondaBlogSection";
import ServicesGrid from "@/components/ServicesGrid";

import FAQSection from "@/components/GeneralFAQ";
import Reveal from "@/components/Reveal"; // We will create this component

export default async function CustomerLandingPage() {
  const catalogs = await prisma.productCatalog.findMany();
  const vehicles = await prisma.vehicle.findMany({
    select: { modelName: true, price: true }
  });

  // Map products to their STD/Starting variant price
  const products = catalogs.map((product) => {
    // Attempt to match by name (e.g. 'Honda Dio 110' matches 'Dio 110')
    const catalogKeywords = product.name.toLowerCase().replace('honda ', '').split(' ');
    
    const productVehicles = vehicles.filter(v => {
      const vNameLower = v.modelName.toLowerCase();
      // Basic heuristic: must contain all words from the catalog product (excluding "honda")
      return catalogKeywords.every(kw => vNameLower.includes(kw));
    });
    let startingPrice = product.price;

    if (productVehicles.length > 0) {
      // Find the minimum price among all matching variants to use as 'Starting at'
      const validPrices = productVehicles
        .map(v => v.price)
        .filter((p): p is number => p !== null && p > 0);
        
      if (validPrices.length > 0) {
        startingPrice = Math.min(...validPrices);
      }
    }

    return {
      ...product,
      price: startingPrice
    };
  });

  const rawBlogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4
  });

  const blogs = rawBlogs.map((b, i) => ({
    id: b.id,
    slug: b.id,
    title: b.title,
    excerpt: b.content.substring(0, 150) + '...',
    category: i === 0 ? "Featured" : "News",
    categoryColor: i === 0 ? "bg-red-500" : "bg-gray-500",
    date: new Date(b.createdAt).toLocaleDateString(),
    readTime: "5 min read",
    image: b.imageUrl || "/images/finance-hero.jpg",
    featured: i === 0,
  }));

  const homeAccessories = await prisma.accessory.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden transition-colors duration-300">
      {/* 1. Immersive Hero Section */}
      <div className="relative">
        <ClientOnly>
          <HeroSlider />
        </ClientOnly>
      </div>

      <Reveal>
        {/* 2. Choose Your Product / Category Carousel */}
        <CategoryCarousel products={products as any} />
      </Reveal>

      <Reveal>
        {/* 3. Honda Blog / News */}
        <HondaBlogSection blogs={blogs} />
      </Reveal>

      <Reveal>
        {/* Accessories Section */}
        <div id="accessories">
          <ClientOnly>
            <AccessoriesSection accessories={homeAccessories} />
          </ClientOnly>
        </div>
      </Reveal>

      <Reveal>
        {/* Services Grid */}
        <ServicesGrid />
      </Reveal>


      <Reveal>
        {/* FAQ Section */}
        <FAQSection />
      </Reveal>

    </div>
  );
}
