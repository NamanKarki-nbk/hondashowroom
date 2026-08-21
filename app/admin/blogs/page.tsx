import { Metadata } from 'next';
import BlogManager from './BlogManager';

export const metadata: Metadata = {
  title: 'Blog Management | Admin Dashboard',
};

export default function BlogsPage() {
  return (
    <div className="min-h-full bg-background dark:bg-zinc-950 p-6 lg:p-10 transition-colors">
      <div className="max-w-[1400px] mx-auto">
        <BlogManager />
      </div>
    </div>
  );
}
