import CalendarClient from './CalendarClient';

export const metadata = {
  title: 'Sales Calendar - Admin Dashboard',
  description: 'View schedule of deliveries, test rides, and service bookings.',
};

export default function SalesCalendarPage() {
  return (
    <div className="flex-1 w-full min-h-screen bg-gray-50/50 dark:bg-slate-900/50">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Schedule Hub
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              SALES CALENDAR
            </h1>
            <p className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
              Track vehicle deliveries, upcoming test rides, and service bookings all in one unified schedule.
            </p>
          </div>
        </div>

        {/* Client Component */}
        <CalendarClient />
        
      </div>
    </div>
  );
}
