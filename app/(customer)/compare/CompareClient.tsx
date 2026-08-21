"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';

type Vehicle = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  specs: any;
  description: string | null;
  brand?: string;
};

// Default spec generator for vehicles with missing specs
function getSpecs(name: string, price: number) {
  const isScooter = name.toLowerCase().includes('dio') || name.toLowerCase().includes('iqube') || name.toLowerCase().includes('rizta') || name.toLowerCase().includes('jupiter') || name.toLowerCase().includes('ntorq') || name.toLowerCase().includes('activa');
  
  return {
    'Engine / Motor': isScooter ? '124.9 cc, Single Cylinder' : '149.5 cc, Single Cylinder',
    'Max Power': isScooter ? '8.14 PS @ 6500 rpm' : '14 PS @ 8000 rpm',
    'Max Torque': isScooter ? '10.9 Nm @ 5000 rpm' : '13.25 Nm @ 6000 rpm',
    'Mileage / Range': isScooter ? '50 kmpl' : '45 kmpl',
    'Fuel Tank / Battery': isScooter ? '5.3 L' : '12 L',
    'Kerb Weight': isScooter ? '109 kg' : '135 kg',
    'Fuel Type': isScooter && (name.toLowerCase().includes('iqube') || name.toLowerCase().includes('rizta')) ? 'Electric' : 'Petrol',
    'BS Standard': 'BS6 Phase 2',
    'Brakes (Front)': 'Disc',
    'Brakes (Rear)': 'Drum',
    'Tyres (Front)': '80/100-18',
    'Tyres (Rear)': '100/90-18',
    'Starting Price': `NPR ${price.toLocaleString('en-IN')}`,
  };
}

export default function CompareClient({ vehicles }: { vehicles: Vehicle[] }) {
  // 4 slots for comparisons (store vehicle IDs or null)
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  
  // Modal states
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBrand, setExpandedBrand] = useState<string | null>('Honda');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Results view states
  const [hideCommon, setHideCommon] = useState(false);
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [activeTab, setActiveTab] = useState<'SPECIFICATIONS' | 'FEATURES'>('SPECIFICATIONS');
  const [openAccordions, setOpenAccordions] = useState<string[]>([
    'Power & Performance', 'Brakes & Wheels', 'Suspensions & Chassis', 'Dimensions', 'Warranty and Services'
  ]);
  const [popularTab, setPopularTab] = useState<'BIKES' | 'SCOOTERS' | 'RECENT'>('BIKES');
  const [recentComparisons, setRecentComparisons] = useState<string[][]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('recentComparisons');
    if (saved) {
      try {
        setRecentComparisons(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleCompareNow = () => {
    const selectedIds = slots.filter(Boolean) as string[];
    if (selectedIds.length >= 2) {
      const newRecent = [selectedIds, ...recentComparisons.filter(arr => JSON.stringify(arr) !== JSON.stringify(selectedIds))].slice(0, 5);
      setRecentComparisons(newRecent);
      localStorage.setItem('recentComparisons', JSON.stringify(newRecent));
      setIsComparing(true);
    }
  };

  // Helper to check if slot count is sufficient
  const selectedCount = slots.filter(Boolean).length;

  const brands = useMemo(() => {
    const list = new Set<string>();
    vehicles.forEach(v => {
      if (v.brand) list.add(v.brand);
    });
    return Array.from(list);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.brand && v.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [vehicles, searchQuery]);

  const toggleAccordion = (title: string) => {
    if (openAccordions.includes(title)) {
      setOpenAccordions(openAccordions.filter(t => t !== title));
    } else {
      setOpenAccordions([...openAccordions, title]);
    }
  };

  const handleAddVehicle = (vehicleId: string) => {
    if (activeSlotIdx !== null) {
      const nextSlots = [...slots];
      nextSlots[activeSlotIdx] = vehicleId;
      setSlots(nextSlots);
      setIsModalOpen(false);
      setActiveSlotIdx(null);
    }
  };

  const handleRemoveVehicle = (idx: number) => {
    const nextSlots = [...slots];
    nextSlots[idx] = null;
    setSlots(nextSlots);
    if (nextSlots.filter(Boolean).length < 2) {
      setIsComparing(false);
    }
  };

  // Pre-configured popular comparisons
  const popularComparisons = {
    BIKES: [
      {
        v1: vehicles.find(v => v.name.toLowerCase().includes("hornet")) || vehicles[0],
        v2: vehicles.find(v => v.name.toLowerCase().includes("nx 200")) || vehicles[1],
        label: "Hornet 2.0 vs NX 200"
      },
      {
        v1: vehicles.find(v => v.name.toLowerCase().includes("sp 125")) || vehicles[0],
        v2: vehicles.find(v => v.name.toLowerCase().includes("xsr155")) || vehicles[1],
        label: "SP 125 vs XSR 155"
      }
    ],
    SCOOTERS: [
      {
        v1: vehicles.find(v => v.name.toLowerCase().includes("iqube")) || vehicles[0],
        v2: vehicles.find(v => v.name.toLowerCase().includes("rizta")) || vehicles[1],
        label: "iQube vs Rizta"
      },
      {
        v1: vehicles.find(v => v.name.toLowerCase().includes("activa")) || vehicles[0],
        v2: vehicles.find(v => v.name.toLowerCase().includes("jupiter")) || vehicles[1],
        label: "Activa vs Jupiter"
      },
      {
        v1: vehicles.find(v => v.name.toLowerCase().includes("ntorq")) || vehicles[0],
        v2: vehicles.find(v => v.name.toLowerCase().includes("ntorq150")) || vehicles[1],
        label: "Ntorq 125 vs Ntorq 150"
      }
    ]
  };

  const startPopularCompare = (v1Id: string, v2Id: string) => {
    setSlots([v1Id, v2Id, null, null]);
    setIsComparing(true);
  };

  // Build spec sheet mapping
  const getVehicleSpecsMap = (vehicle: Vehicle) => {
    const defaultSpecs = getSpecs(vehicle.name, vehicle.price);
    return { ...defaultSpecs, ...vehicle.specs };
  };

  const specCategories = [
    {
      title: 'Power & Performance',
      fields: ['Engine / Motor', 'Max Power', 'Max Torque', 'BS Standard', 'Fuel Type']
    },
    {
      title: 'Brakes & Wheels',
      fields: ['Brakes (Front)', 'Brakes (Rear)', 'Tyres (Front)', 'Tyres (Rear)']
    },
    {
      title: 'Dimensions',
      fields: ['Fuel Tank / Battery', 'Kerb Weight', 'Mileage / Range']
    }
  ];

  // Selected vehicle lists
  const activeVehicles = useMemo(() => {
    return slots.map(id => id ? vehicles.find(v => v.id === id) : null);
  }, [slots, vehicles]);

  const activeNonNullVehicles = useMemo(() => {
    return activeVehicles.filter(Boolean) as Vehicle[];
  }, [activeVehicles]);

  return (
    <div className="min-h-screen bg-background dark:bg-[#0B0B0C] text-gray-900 dark:text-primary-foreground pt-28 pb-20 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        <AnimatePresence mode="wait">
          {!isComparing ? (
            // Initial Selection View
            <motion.div
              key="selection-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-10 text-left">
                <h1 className="text-3xl font-extrabold mb-3">Compare Bikes</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-4xl leading-relaxed">
                  Are you confused between multiple bikes to choose from? Not sure what features should you compare? Don't worry, bike comparison was never so easy. Compare prices, mileage, power, performance, and 100s of other features at once to choose the one that suits your needs. Compare multiple bikes at once to find the best one.
                </p>
              </div>

              {/* Selection Slots Frame */}
              <div className="w-full mb-10 flex flex-col items-center">
                
                <div className="flex flex-row items-center justify-between w-full mb-8">
                  {slots.map((slotId, idx) => {
                    const vehicle = slotId ? vehicles.find(v => v.id === slotId) : null;
                    return (
                      <React.Fragment key={idx}>
                        <div className="flex-1 flex flex-col items-center justify-center">
                          {vehicle ? (
                            <div className="relative w-full flex flex-col items-center text-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveVehicle(idx);
                                }}
                                className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gray-100 hover:bg-red-100 dark:bg-gray-800 text-gray-500 hover:text-red-600 rounded-full p-1 transition-colors z-20 shadow-sm"
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              
                              <div className="w-16 h-16 sm:w-28 sm:h-28 relative flex items-center justify-center mb-2 sm:mb-4 bg-white dark:bg-[#111] rounded-full sm:rounded-none">
                                <img 
                                  src={vehicle.imageUrl || '/honda-logo.svg'} 
                                  alt={vehicle.name} 
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <div className="mt-auto hidden sm:block">
                                <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 line-clamp-1">{vehicle.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs mt-0.5">₹ {vehicle.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => {
                                setActiveSlotIdx(idx);
                                setIsModalOpen(true);
                              }}
                              className="flex flex-col items-center justify-center cursor-pointer group"
                            >
                              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-[1.5px] border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center mb-2 sm:mb-3 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-colors bg-transparent">
                                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-gray-500 transition-colors" strokeWidth={1} />
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
                                Add bike
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* VS Badge between slots */}
                        {idx < slots.length - 1 && (
                           <div className="flex-shrink-0 flex items-center justify-center -mx-2 sm:-mx-6 z-10">
                              <div className="bg-black text-white text-[9px] sm:text-[11px] font-bold rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center tracking-tighter shadow-md">
                                vs
                              </div>
                           </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Compare Trigger Button */}
                <button
                  disabled={selectedCount < 2}
                  onClick={handleCompareNow}
                  className={`w-full py-3.5 sm:py-4 rounded-lg font-semibold text-[15px] sm:text-base transition-all duration-300 ${
                    selectedCount >= 2
                      ? 'bg-[#cd302b] hover:bg-[#b32924] text-white cursor-pointer shadow-sm'
                      : 'bg-[#cd302b] text-white opacity-90 cursor-not-allowed'
                  }`}
                >
                  Compare Now
                </button>
              </div>

              {/* Popular Comparisons Frame */}
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Popular Comparisons</h2>
                
                {/* Popular Tabs */}
                <div className="flex border-b border-gray-300 dark:border-gray-800 gap-8 mb-8 text-sm font-bold uppercase tracking-wide">
                  {(['BIKES', 'SCOOTERS', ...(recentComparisons.length > 0 ? ['RECENT'] : [])] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setPopularTab(tab as typeof popularTab)}
                      className={`pb-3 transition-all relative ${
                        popularTab === tab 
                          ? 'text-[#cd302b] dark:text-[#cc0000]' 
                          : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab}
                      {popularTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#cd302b] dark:bg-[#cc0000] rounded-t-sm"></span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide">
                  {popularTab === 'RECENT' ? recentComparisons.map((itemIds, idx) => {
                    const v1 = vehicles.find(v => v.id === itemIds[0]);
                    const v2 = vehicles.find(v => v.id === itemIds[1]);
                    const extraCount = itemIds.length - 2;
                    if (!v1 || !v2) return null;
                    return (
                      <div key={idx} className="min-w-[320px] max-w-[350px] shrink-0 snap-start bg-white dark:bg-[#0B0B0C] border border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col hover:shadow-md transition-shadow relative">
                        {/* Top section: Vehicles side-by-side */}
                        <div className="flex relative p-4 pb-2">
                          {/* Vertical Divider */}
                          <div className="absolute top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-800 left-1/2 -translate-x-1/2"></div>
                          {/* VS Badge */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0B0B0C] border border-gray-300 dark:border-gray-600 text-gray-900 text-[10px] font-bold p-1 rounded-full z-10 w-7 h-7 flex items-center justify-center">
                            VS
                          </div>
                          
                          {/* Vehicle 1 */}
                          <div className="flex-1 flex flex-col items-start pr-4">
                            <img src={v1.imageUrl || '/honda-logo.svg'} className="w-full h-20 object-contain mb-3" />
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">{v1.brand}</span>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{v1.name}</h4>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₹ {v1.price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-400">Onwards</span>
                          </div>
                          
                          {/* Vehicle 2 */}
                          <div className="flex-1 flex flex-col items-start pl-4">
                            <img src={v2.imageUrl || '/honda-logo.svg'} className="w-full h-20 object-contain mb-3" />
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">{v2.brand}</span>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{v2.name}</h4>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₹ {v2.price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-400">Onwards</span>
                          </div>
                        </div>
                        
                        {extraCount > 0 && (
                          <div className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                            +{extraCount} more
                          </div>
                        )}

                        {/* Bottom section: Action button */}
                        <div className="p-4 pt-2 mt-auto">
                          <button
                            onClick={() => {
                              const newSlots = [null, null, null, null];
                              itemIds.forEach((id, i) => { if (i < 4) newSlots[i] = (id as any); });
                              setSlots(newSlots as any);
                              setIsComparing(true);
                            }}
                            className="w-full py-2.5 bg-white dark:bg-[#0B0B0C] border border-[#cd302b] rounded-md text-sm font-semibold text-[#cd302b] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            Compare {v1.name} & {v2.name} {extraCount > 0 ? `+${extraCount}` : ''}
                          </button>
                        </div>
                      </div>
                    );
                  }) : popularComparisons[popularTab].map((item, idx) => (
                    <div key={idx} className="min-w-[320px] max-w-[350px] shrink-0 snap-start bg-white dark:bg-[#0B0B0C] border border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col hover:shadow-md transition-shadow">
                      {/* Top section: Vehicles side-by-side */}
                      <div className="flex relative p-4 pb-2">
                        {/* Vertical Divider */}
                        <div className="absolute top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-800 left-1/2 -translate-x-1/2"></div>
                        {/* VS Badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0B0B0C] border border-gray-300 dark:border-gray-600 text-gray-900 text-[10px] font-bold p-1 rounded-full z-10 w-7 h-7 flex items-center justify-center">
                          VS
                        </div>
                        
                        {/* Vehicle 1 */}
                        <div className="flex-1 flex flex-col items-start pr-4">
                          <img src={item.v1.imageUrl || '/honda-logo.svg'} className="w-full h-20 object-contain mb-3" />
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.v1.brand}</span>
                          <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{item.v1.name}</h4>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₹ {item.v1.price.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-gray-400">Onwards</span>
                        </div>
                        
                        {/* Vehicle 2 */}
                        <div className="flex-1 flex flex-col items-start pl-4">
                          <img src={item.v2.imageUrl || '/honda-logo.svg'} className="w-full h-20 object-contain mb-3" />
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.v2.brand}</span>
                          <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{item.v2.name}</h4>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₹ {item.v2.price.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-gray-400">Onwards</span>
                        </div>
                      </div>
                      
                      {/* Bottom section: Action button */}
                      <div className="p-4 pt-2 mt-auto">
                        <button
                          onClick={() => startPopularCompare(item.v1.id, item.v2.id)}
                          className="w-full py-2.5 bg-white dark:bg-[#0B0B0C] border border-[#cd302b] rounded-md text-sm font-semibold text-[#cd302b] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          {item.label}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            // Results State View
            <motion.div
              key="results-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-left"
            >
              {/* Header Title dynamic */}
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setIsComparing(false)}
                  className="bg-background dark:bg-[#141b2b] border border-gray-200 dark:border-background/5 hover:bg-[#e8dfd1] dark:hover:bg-background/5 p-2 rounded-lg transition-colors text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-primary-foreground shadow-sm"
                >
                  Back
                </button>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-primary-foreground">
                  {activeNonNullVehicles.map(v => v.name).join(" vs ")}
                </h1>
              </div>

              {/* Compare Slots Header */}
              <div className="bg-background dark:bg-[#141b2b] border border-gray-200 dark:border-background/5 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                  
                  {/* Left Controls */}
                  <div className="flex flex-col gap-3 justify-center">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-primary-foreground">
                      <input 
                        type="checkbox" 
                        checked={hideCommon} 
                        onChange={() => setHideCommon(!hideCommon)} 
                        className="rounded accent-primary bg-[#e8dfd1] dark:bg-gray-900 border-gray-300 dark:border-background/10"
                      />
                      Hide common features
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-primary-foreground">
                      <input 
                        type="checkbox" 
                        checked={highlightDiff} 
                        onChange={() => setHighlightDiff(!highlightDiff)}
                        className="rounded accent-primary bg-[#e8dfd1] dark:bg-gray-900 border-gray-300 dark:border-background/10"
                      />
                      Highlight differences
                    </label>
                  </div>

                  {/* Active Comparison slots */}
                  {slots.map((slotId, idx) => {
                    const vehicle = slotId ? vehicles.find(v => v.id === slotId) : null;
                    return (
                      <div key={idx} className="relative bg-background dark:bg-[#1d273a]/40 border border-gray-200 dark:border-background/5 rounded-xl p-4 flex flex-col justify-between h-52">
                        {vehicle ? (
                          <>
                            <button 
                              onClick={() => handleRemoveVehicle(idx)}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-primary-foreground rounded-full p-1 transition-colors shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="h-24 w-full flex items-center justify-center p-2">
                              <img src={vehicle.imageUrl || '/honda-logo.svg'} className="h-full object-contain" />
                            </div>
                            <div className="mt-2 text-center">
                              <h3 className="font-bold text-xs line-clamp-1 text-gray-900 dark:text-primary-foreground">{vehicle.name}</h3>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">{vehicle.brand}</span>
                              <span className="text-primary font-bold text-xs block mt-1">NPR {vehicle.price.toLocaleString('en-IN')}</span>
                            </div>
                          </>
                        ) : (
                          <div 
                            onClick={() => {
                              setActiveSlotIdx(idx);
                              setIsModalOpen(true);
                            }}
                            className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-primary-foreground cursor-pointer border border-dashed border-gray-300 dark:border-background/10 rounded-xl hover:bg-[#e8dfd1] dark:hover:bg-background/5 transition-all duration-300"
                          >
                            <Plus className="w-6 h-6 mb-1" />
                            <span className="text-xs font-semibold">Add Bike</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Result specs Tabs */}
              <div className="flex border-b border-gray-200 dark:border-background/10 gap-6 mb-8 text-sm">
                {(['SPECIFICATIONS', 'FEATURES'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-semibold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-primary-foreground'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Spec search input */}
              <div className="relative mb-6 w-full lg:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Type a spec or a feature e.g. Engine"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-background dark:bg-[#141b2b] border border-gray-200 dark:border-background/10 rounded-xl py-3 pl-10 pr-4 text-xs text-gray-900 dark:text-primary-foreground placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                />
              </div>

              {/* Result spec sheets table accordions */}
              {activeTab === 'SPECIFICATIONS' ? (
                <div className="flex flex-col gap-4">
                  {specCategories.map((cat) => {
                    const matchedFields = cat.fields.filter(field => 
                      field.toLowerCase().includes(searchFilter.toLowerCase())
                    );
                    if (matchedFields.length === 0) return null;

                    const isOpen = openAccordions.includes(cat.title);
                    return (
                      <div key={cat.title} className="bg-background dark:bg-[#141b2b] border border-gray-200 dark:border-background/5 rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleAccordion(cat.title)}
                          className="w-full flex items-center justify-between p-5 bg-background dark:bg-[#1c2438]/50 hover:bg-[#e8dfd1] dark:hover:bg-[#1c2438] transition-colors text-left"
                        >
                          <span className="font-bold text-sm tracking-wide text-gray-900 dark:text-primary-foreground">{cat.title}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </button>
                        
                        {isOpen && (
                          <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {matchedFields.map(field => {
                              const values = activeNonNullVehicles.map(v => getVehicleSpecsMap(v)[field] || '—');
                              const isCommon = new Set(values).size === 1;
                              const isDifferent = new Set(values.filter(val => val !== '—')).size > 1;

                              if (hideCommon && isCommon) return null;

                              return (
                                <div key={field} className="grid grid-cols-1 lg:grid-cols-5 p-4 items-center">
                                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 p-2">{field}</div>
                                  {slots.map((slotId, idx) => {
                                    if (slotId) {
                                      const vehicle = vehicles.find(v => v.id === slotId)!;
                                      const specVal = getVehicleSpecsMap(vehicle)[field] || '—';
                                      return (
                                        <div 
                                          key={`${slotId}-${field}`}
                                          className={`p-2 border-l border-gray-100 dark:border-background/5 text-center text-xs font-medium ${highlightDiff && isDifferent ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 font-bold' : 'text-gray-900 dark:text-primary-foreground'}`}
                                        >
                                          {specVal}
                                        </div>
                                      );
                                    } else {
                                      return <div key={`empty-${idx}`} className="p-2 border-l border-gray-100 dark:border-background/5 text-center text-gray-400 dark:text-gray-500">—</div>;
                                    }
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Features
                <div className="bg-background dark:bg-[#141b2b] border border-gray-200 dark:border-background/5 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Class Features</h3>
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    <div className="grid grid-cols-1 lg:grid-cols-5 p-4 items-center">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Digital Console</div>
                      <div className="p-2 border-l border-gray-100 dark:border-background/5"></div>
                      {slots.map((slotId, idx) => {
                        if (slotId) {
                          return <div key={idx} className="p-2 border-l border-gray-100 dark:border-background/5 text-center text-xs text-gray-900 dark:text-primary-foreground">Yes</div>;
                        }
                        return <div key={idx} className="p-2 border-l border-gray-100 dark:border-background/5 text-center text-xs text-gray-400 dark:text-gray-500">—</div>;
                      })}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 p-4 items-center">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Bluetooth Connectivity</div>
                      <div className="p-2 border-l border-gray-100 dark:border-background/5"></div>
                      {slots.map((slotId, idx) => {
                        if (slotId) {
                          const vehicle = vehicles.find(v => v.id === slotId)!;
                          return <div key={idx} className="p-2 border-l border-gray-100 dark:border-background/5 text-center text-xs text-gray-900 dark:text-primary-foreground">{vehicle.name.toLowerCase().includes('xsr') || vehicle.name.toLowerCase().includes('hornet') || vehicle.name.toLowerCase().includes('ntorq') ? 'Yes' : 'No'}</div>;
                        }
                        return <div key={idx} className="p-2 border-l border-gray-100 dark:border-background/5 text-center text-xs text-gray-400 dark:text-gray-500">—</div>;
                      })}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selector Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-[#f0f0f0] dark:bg-[#0B0B0C] w-full max-w-xl h-full sm:h-auto sm:max-h-[85vh] sm:rounded-md overflow-hidden flex flex-col shadow-2xl relative">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setActiveSlotIdx(null);
                setSearchQuery('');
              }}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 text-gray-500 rounded-full p-1.5 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="p-4 pt-5 pb-0 bg-[#f0f0f0] dark:bg-[#0B0B0C]">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-left px-2">Select Your Brand or Model</h2>
              <div className="relative bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden flex items-center shadow-sm">
                <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Type to Select Brand or Model"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 bg-white dark:bg-[#111] mt-4">
              
              {searchQuery !== '' ? (
                <div className="flex flex-col">
                  {filteredVehicles.map(v => (
                    <div 
                      key={v.id}
                      onClick={() => handleAddVehicle(v.id)}
                      className="p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img src={v.imageUrl || '/honda-logo.svg'} className="w-12 h-8 object-contain" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{v.name}</h4>
                          <span className="text-[10px] uppercase text-gray-500">{v.brand}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-900 dark:text-white font-medium">₹ {v.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">No matching models found.</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">POPULAR BRANDS</span>
                  </div>
                  {brands.map(brand => {
                    const isExpanded = expandedBrand === brand;
                    const brandVehicles = vehicles.filter(v => v.brand === brand);
                    
                    const brandLower = brand.toLowerCase();
                    let brandLogo = `/brands/${brandLower.replace(/\s+/g, '')}.svg`;
                    if (brandLower === 'honda') brandLogo = '/honda-logo.svg';

                    return (
                      <div key={brand} className="border-b border-gray-200 dark:border-gray-800">
                        <button
                          onClick={() => setExpandedBrand(isExpanded ? null : brand)}
                          className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-8 flex justify-center items-center">
                               <img 
                                 src={brandLogo} 
                                 alt={brand}
                                 className="max-w-full max-h-full object-contain"
                                 onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                               />
                               <span className="hidden font-extrabold text-gray-800 dark:text-white text-sm">{brand}</span>
                            </div>
                            <span className="text-base text-gray-800 dark:text-white font-medium">{brand}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-900">
                            {brandVehicles.map(v => (
                              <div
                                key={v.id}
                                onClick={() => handleAddVehicle(v.id)}
                                className="py-3 px-10 border-b border-gray-100 dark:border-gray-900 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-700 dark:text-gray-300">{v.name}</span>
                                <span className="text-xs text-gray-900 dark:text-white font-medium">₹ {v.price.toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* OTHER BRANDS section placeholder as seen in image */}
                  <div className="p-4 pt-6 pb-2 bg-white dark:bg-[#111]">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">OTHER BRANDS</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
