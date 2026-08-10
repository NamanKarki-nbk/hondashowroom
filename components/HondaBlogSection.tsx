"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Tag, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const BLOGS = [
  {
    id: 1,
    slug: "honda-dio-125-review",
    category: "Review",
    categoryColor: "bg-blue-500",
    title: "Honda Dio 125 — The Urban Commuter Reimagined",
    excerpt:
      "The all-new Honda Dio 125 brings sporty styling, LED lighting, and a refined 125cc engine to your daily commute. We take a deep dive into what makes it stand out.",
    date: "Aug 5, 2026",
    readTime: "5 min read",
    image: "/inventory/honda-dio-125.png",
    featured: true,
  },
  {
    id: 2,
    slug: "cb-hornet-2-riding-tips",
    category: "Tips",
    categoryColor: "bg-green-500",
    title: "5 Essential Riding Tips for CB Hornet 2.0 Owners",
    excerpt:
      "Maximise your performance and safety with these expert tips tailored for CB Hornet 2.0 riders. From throttle control to cornering — we've got you covered.",
    date: "Aug 1, 2026",
    readTime: "4 min read",
    image: "/inventory/cb-hornet-2-0.png",
    featured: false,
  },
  {
    id: 3,
    slug: "honda-sp125-maintenance",
    category: "Maintenance",
    categoryColor: "bg-amber-500",
    title: "SP 125 Maintenance Guide: Keep Your Honda Running Like New",
    excerpt:
      "A comprehensive maintenance checklist for your Honda SP 125 — oil changes, brake inspection, tyre pressure, and more to extend your bike's life.",
    date: "Jul 28, 2026",
    readTime: "6 min read",
    image: "/inventory/honda-sp-125-.png",
    featured: false,
  },
  {
    id: 4,
    slug: "honda-finance-from-home-guide",
    category: "Finance",
    categoryColor: "bg-purple-500",
    title: "How to Finance Your Honda From Home in Nepal",
    excerpt:
      "A step-by-step guide to getting your Honda financed without stepping out — documents needed, EMI calculations, and which banks offer the best rates.",
    date: "Jul 22, 2026",
    readTime: "7 min read",
    image: "/images/finance-hero.jpg",
    featured: false,
  },
];

const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function HondaBlogSection() {
  const [featured, ...rest] = BLOGS;

  return (
    <section className="py-20 px-6 bg-[#f3ebdd] dark:bg-[#0D0D0E]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c1291A] mb-3">
              <span className="w-6 h-0.5 bg-[#c1291A] rounded-full" />
              Honda Blog
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-[#f3ebdd] leading-tight">
              News, Tips &amp; Stories
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-md">
              Stay up to date with the latest Honda news, riding guides, and ownership tips from Society Enterprises.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#c1291A] hover:gap-3 transition-all group"
          >
            View all posts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Grid — Featured + 3 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Featured Post */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="lg:col-span-5"
          >
            <Link href={`/blog/${featured.slug}`} className="group block h-full">
              <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-200 dark:border-[#f3ebdd]/8 hover:shadow-2xl hover:border-red-200 dark:hover:border-red-900/40 transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-64 bg-[#e8dfd1] dark:bg-[#1A1A1A] overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#c1291A] text-[#f3ebdd] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Featured
                    </span>
                    <span className={`${featured.categoryColor} text-[#f3ebdd] text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                      {featured.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-[#f3ebdd] leading-snug mb-3 group-hover:text-[#c1291A] transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 mt-5 text-[#c1291A] text-sm font-bold">
                    Read More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Secondary Cards */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {rest.map((post, i) => (
              <motion.div
                key={post.id}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/8 hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/40 transition-all duration-300 flex gap-5 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="w-36 flex-shrink-0 bg-[#e8dfd1] dark:bg-[#1A1A1A] overflow-hidden relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "0.1";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col justify-center py-5 pr-5 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${post.categoryColor} text-[#f3ebdd] text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{post.readTime}
                        </span>
                        <span className="text-xs text-gray-400">· {post.date}</span>
                      </div>
                      <h3 className="text-base font-black text-gray-900 dark:text-[#f3ebdd] leading-snug mb-1.5 group-hover:text-[#c1291A] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-[#c1291A] text-xs font-bold">
                        Read More <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="flex justify-center mt-8 sm:hidden">
          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 bg-[#c1291A] text-[#f3ebdd] rounded-full text-sm font-bold hover:bg-[#a02014] transition-colors"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
