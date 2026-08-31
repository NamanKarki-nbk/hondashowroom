import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Since slug is ID for now based on how HondaBlogSection was built
  const { slug: blogId } = await params;
  
  const blog = await prisma.blog.findUnique({
    where: { id: blogId }
  });

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24">
      {/* Hero Banner */}
      <div className="w-full relative h-[400px] md:h-[500px] bg-slate-900 flex items-end">
        {blog.imageUrl && (
          <Image 
            src={blog.imageUrl} 
            alt={blog.title} 
            fill 
            className="object-cover opacity-50"
            priority
          />
        )}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-white/80 uppercase tracking-wider">
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><User className="w-5 h-5" /> {blog.author}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-a:text-primary">
            {/* Simple Markdown-like renderer without external packages */}
            {blog.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.includes('**', 2)) {
                const parts = paragraph.split('**');
                return (
                  <p key={index} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-white font-black">{part}</strong> : part)}
                  </p>
                );
              }
              return (
                <p key={index} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
