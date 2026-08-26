import ServiceChargesClient from './ServiceChargesClient';

export const metadata = {
  title: 'Service Charges | Admin Dashboard',
};

export default function ServiceChargesPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ServiceChargesClient />
    </div>
  );
}
