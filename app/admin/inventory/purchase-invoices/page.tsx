import PurchaseInvoiceClient from './PurchaseInvoiceClient';

export const metadata = {
  title: 'Purchase Invoices | Admin Dashboard',
};

export default function PurchaseInvoicesPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PurchaseInvoiceClient />
    </div>
  );
}
