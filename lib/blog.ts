import { prisma } from '@/lib/prisma';

export interface BlogDbRecord {
  id: string;
  title: string;
  author: string | null;
  imageUrl: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedContent {
  slug?: string;
  summary?: string;
  postType?: string;
  category?: string;
  readingTime?: number;
  sections?: { title: string; description: string }[];
}

export interface BlogPost extends Omit<BlogDbRecord, 'content'> {
  slug: string;
  summary: string;
  postType: string;
  category: string;
  readingTime: number;
  sections: { title: string; description: string }[];
  isStructured: boolean;
  rawContent: string;
}

export function parseBlogContent(record: BlogDbRecord): BlogPost {
  let parsed: ParsedContent = {};
  let isStructured = false;

  try {
    if (record.content.trim().startsWith('{')) {
      parsed = JSON.parse(record.content);
      isStructured = true;
    }
  } catch (e) {
    // Fallback to unstructured parsing
  }

  return {
    ...record,
    slug: parsed.slug || record.id,
    summary: parsed.summary || record.content.replace(/[#*`]/g, '').substring(0, 150) + '...',
    postType: parsed.postType || 'ARTICLE',
    category: parsed.category || 'General',
    readingTime: parsed.readingTime || 5, // Default 5 min
    sections: parsed.sections || [],
    isStructured,
    rawContent: record.content,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const records = await prisma.blog.findMany();
  
  for (const record of records) {
    const parsed = parseBlogContent(record);
    if (parsed.slug === slug || record.id === slug) {
      return parsed;
    }
  }

  return null;
}
