import DeliveriesClient from './DeliveriesClient';

export const metadata = {
  title: 'Deliveries | Admin Dashboard',
};

export default function DeliveriesPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DeliveriesClient />
    </div>
  );
}
