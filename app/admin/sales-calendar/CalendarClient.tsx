"use client";

import { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { ChevronLeft, ChevronRight, Truck, Settings, Calendar as CalendarIcon, X } from 'lucide-react';

interface CalendarEvent {
  id: string;
  type: 'DELIVERY' | 'TEST_RIDE' | 'SERVICE';
  date: string;
  title: string;
  subtitle: string;
  status: string;
}

export default function CalendarClient() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchEvents = async (date: Date) => {
    setLoading(true);
    try {
      const year = format(date, 'yyyy');
      const month = format(date, 'M');
      const res = await fetch(`/api/admin/sales-calendar?year=${year}&month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Calendar Grid Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) => {
    return events.filter(e => isSameDay(new Date(e.date), day));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'DELIVERY': return <Truck className="w-3 h-3" />;
      case 'SERVICE': return <Settings className="w-3 h-3" />;
      default: return <CalendarIcon className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'DELIVERY': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'SERVICE': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case 'TEST_RIDE': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="flex flex-col xl:flex-row gap-6 relative">
      {/* Main Calendar View */}
      <div className={`flex-1 transition-all duration-300 ${selectedDate ? 'xl:w-2/3' : 'w-full'}`}>
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-sm rounded-3xl overflow-hidden">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800/80">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-3 relative">
              {loading && (
                <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              )}
              {days.map((day, idx) => {
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayEvents = getEventsForDay(day);

                return (
                  <div 
                    key={day.toString()}
                    onClick={() => setCurrentDate(day) || setSelectedDate(day)}
                    className={`
                      min-h-[120px] p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2
                      ${!isCurrentMonth ? 'opacity-40 bg-gray-50/50 dark:bg-slate-800/30 border-transparent' : 'bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-700'}
                      ${isSelected ? 'ring-2 ring-primary border-transparent dark:bg-slate-800' : 'hover:border-primary/30'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-bold ${isSelected ? 'text-primary' : (isSameDay(day, new Date()) ? 'text-red-500' : 'text-gray-700 dark:text-gray-300')}`}>
                        {format(day, dateFormat)}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div 
                          key={event.id}
                          className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border flex items-center gap-1.5 truncate ${getEventColor(event.type)}`}
                        >
                          {getEventIcon(event.type)}
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] font-bold text-gray-400 text-center pt-1">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Side Panel (Selected Date Details) */}
      {selectedDate && (
        <div className="xl:w-1/3 w-full animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-sm rounded-3xl p-6 sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {format(selectedDate, 'EEEE')}
                </h3>
                <p className="text-sm font-bold text-primary tracking-widest uppercase mt-1">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDate(null)}
                className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                <CalendarIcon className="w-8 h-8 mx-auto text-gray-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-bold text-gray-400">No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 hover:border-primary/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getEventColor(event.type)}`}>
                        {getEventIcon(event.type)}
                        {event.type.replace('_', ' ')}
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        {format(new Date(event.date), 'h:mm a')}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-gray-900 dark:text-white leading-tight">
                      {event.title}
                    </h4>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      {event.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
