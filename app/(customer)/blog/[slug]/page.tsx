import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { getBlogPostBySlug } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const blog = await getBlogPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24">
      {/* Simple Header */}
      <div className="w-full bg-slate-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-white/80 uppercase tracking-wider">
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><User className="w-5 h-5" /> {blog.author || 'Admin'}</span>
            <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {blog.readingTime} min read</span>
            <span className="flex items-center gap-2"><Tag className="w-5 h-5" /> {blog.category}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-slate-800">
          {blog.imageUrl && (
            <div className="w-full rounded-2xl overflow-hidden mb-12 bg-gray-100 dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-800">
              <Image 
                src={blog.imageUrl} 
                alt={blog.title} 
                width={1200}
                height={675}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          )}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-a:text-primary">
            {blog.isStructured ? (
              <div className="flex flex-col gap-8 not-prose">
                <div className="bg-gray-50 dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                    {blog.summary}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {blog.category && <span>• {blog.category}</span>}
                    {blog.readingTime && <span>• {blog.readingTime} min read</span>}
                  </div>
                </div>
                
                {blog.sections?.map((section: any, idx: number) => (
                  <div key={idx} className="mt-8">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg md:text-xl">
                      {section.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              blog.rawContent.split('\n\n').map((paragraph, index) => {
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
