import ValuationsClient from './ValuationsClient';

export const metadata = {
  title: 'Valuations | Admin Dashboard',
};

export default function ValuationsPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ValuationsClient />
    </div>
  );
}
