import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Calendar, User, Clock, Tag } from 'lucide-react';
import { parseBlogContent } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function BlogListingPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="w-full bg-slate-900 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Honda Blogs</h1>
        <p className="text-gray-400 text-lg">Latest news, tips, and stories from Honda.</p>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-500">No blogs found.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((rawBlog) => {
              const blog = parseBlogContent(rawBlog);
              return (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-slate-800">
                  {blog.imageUrl ? (
                    <Image 
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {blog.category && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                      {blog.category}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.readingTime} min</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                    {blog.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"><User className="w-4 h-4" /> {blog.author || 'Admin'}</span>
                    <div className="flex items-center text-primary font-bold uppercase tracking-wider text-sm gap-2 group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
