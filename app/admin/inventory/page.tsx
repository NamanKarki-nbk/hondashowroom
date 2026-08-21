import { Metadata } from 'next';
import VehicleInventoryTable from './VehicleInventoryTable';

export const metadata: Metadata = {
  title: 'Vehicle Inventory | Admin Dashboard',
};

export default function InventoryPage() {
  return (
    <div className="min-h-full bg-background dark:bg-zinc-950 p-6 lg:p-10 transition-colors">
      <div className="max-w-[1400px] mx-auto">
        <VehicleInventoryTable />
      </div>
    </div>
  );
}
