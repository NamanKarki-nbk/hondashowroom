import SparePartsClient from './SparePartsClient';

export const metadata = {
  title: 'Spare Parts Inventory | Admin Dashboard',
};

export default function SparePartsPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SparePartsClient />
    </div>
  );
}
