import { Metadata } from 'next';
import ProductManager from './ProductManager';

export const metadata: Metadata = {
  title: 'Product Catalog | Admin Dashboard',
};

export default function ProductsPage() {
  return (
    <div className="min-h-full bg-background dark:bg-[#0B0B0C] p-6 lg:p-10 transition-colors">
      <div className="max-w-[1400px] mx-auto">
        <ProductManager />
      </div>
    </div>
  );
}
