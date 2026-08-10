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
  const [popularTab, setPopularTab] = useState<'BIKES' | 'SCOOTERS'>('BIKES');

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
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] text-gray-900 dark:text-[#f3ebdd] pt-28 pb-20 font-sans transition-colors duration-300">
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
              <div className="bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/5 rounded-2xl p-8 mb-8 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                  {slots.map((slotId, idx) => {
                    const vehicle = slotId ? vehicles.find(v => v.id === slotId) : null;
                    return (
                      <React.Fragment key={idx}>
                        <div 
                          onClick={() => {
                            setActiveSlotIdx(idx);
                            setIsModalOpen(true);
                          }}
                          className={`relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-[#f3ebdd]/10 rounded-2xl p-6 h-64 cursor-pointer hover:border-[#c1291A] dark:hover:border-[#c1291A] hover:bg-[#f3ebdd] dark:hover:bg-[#f3ebdd]/5 transition-all duration-300 ${vehicle ? 'border-none bg-[#f3ebdd] dark:bg-[#1d273a]/60 shadow-inner' : ''}`}
                        >
                          {vehicle ? (
                            <div className="relative w-full h-full flex flex-col justify-between items-center text-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveVehicle(idx);
                                }}
                                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-[#f3ebdd] rounded-full p-1.5 transition-colors z-20 shadow-md"
                              >
                                <X className="w-4.5 h-4.5" />
                              </button>
                              
                              <div className="w-full h-32 relative flex items-center justify-center p-4">
                                <img 
                                  src={vehicle.imageUrl || '/honda-logo.svg'} 
                                  alt={vehicle.name} 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="mt-2">
                                <span className="text-[10px] tracking-widest text-[#5b8cff] dark:text-[#5b8cff] uppercase font-bold block mb-1">{vehicle.brand || 'Honda'}</span>
                                <h3 className="font-bold text-sm text-gray-900 dark:text-[#f3ebdd] line-clamp-1">{vehicle.name}</h3>
                                <p className="text-[#c1291A] font-semibold text-xs mt-1">NPR {vehicle.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-[#c1291A]">
                              {/* Custom motorcycle line icon */}
                              <svg className="w-14 h-14 mb-4 stroke-current opacity-60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="18" r="3" strokeWidth="1.5" />
                                <circle cx="19" cy="18" r="3" strokeWidth="1.5" />
                                <path d="M19 18V13.5L16.5 9H11.5L9 13.5H5V18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 9V5H14.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-sm font-semibold flex items-center gap-1 text-gray-700 dark:text-gray-300 group-hover:text-[#c1291A]">
                                <Plus className="w-4 h-4" /> Add Bike
                              </span>
                            </div>
                          )}
                        </div>
                        {idx < 3 && (
                          <div className="absolute top-1/2 left-[calc((idx+1)*25%)] -translate-x-1/2 -translate-y-1/2 hidden lg:flex bg-gray-200 dark:bg-[#0d111b] border border-gray-300 dark:border-[#f3ebdd]/5 text-gray-600 dark:text-[#5b8cff] font-bold text-xs p-1.5 rounded-full z-10 w-7 h-7 items-center justify-center shadow-sm">
                            vs
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Compare Trigger Button */}
              <div className="mb-14">
                <button
                  disabled={selectedCount < 2}
                  onClick={() => setIsComparing(true)}
                  className={`w-64 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                    selectedCount >= 2
                      ? 'bg-[#c1291A] hover:bg-red-700 text-[#f3ebdd] shadow-red-500/20 cursor-pointer'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Compare
                </button>
              </div>

              {/* Popular Comparisons Frame */}
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-6">Popular Comparisons</h2>
                
                {/* Popular Tabs */}
                <div className="flex border-b border-gray-200 dark:border-[#f3ebdd]/10 gap-6 mb-8 text-sm">
                  {(['BIKES', 'SCOOTERS'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setPopularTab(tab)}
                      className={`pb-3 font-semibold transition-all relative ${popularTab === tab ? 'text-[#c1291A]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#f3ebdd]'}`}
                    >
                      {tab}
                      {popularTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c1291A]"></span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularComparisons[popularTab].map((item, idx) => (
                    <div key={idx} className="bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/5 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-300 dark:hover:border-[#f3ebdd]/10 transition-colors shadow-sm">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        {/* Vehicle 1 */}
                        <div className="flex flex-col items-center flex-1">
                          <img src={item.v1.imageUrl || '/honda-logo.svg'} className="h-16 object-contain mb-2" />
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold block">{item.v1.brand}</span>
                          <h4 className="text-xs font-semibold text-center mt-1 line-clamp-1 text-gray-900 dark:text-[#f3ebdd]">{item.v1.name}</h4>
                          <span className="text-red-500 text-[11px] font-medium mt-1">NPR {item.v1.price.toLocaleString('en-IN')}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 bg-[#e8dfd1] dark:bg-[#0d111b] w-6 h-6 rounded-full flex items-center justify-center border border-gray-200 dark:border-[#f3ebdd]/5 flex-shrink-0">vs</span>
                        {/* Vehicle 2 */}
                        <div className="flex flex-col items-center flex-1">
                          <img src={item.v2.imageUrl || '/honda-logo.svg'} className="h-16 object-contain mb-2" />
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold block">{item.v2.brand}</span>
                          <h4 className="text-xs font-semibold text-center mt-1 line-clamp-1 text-gray-900 dark:text-[#f3ebdd]">{item.v2.name}</h4>
                          <span className="text-red-500 text-[11px] font-medium mt-1">NPR {item.v2.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => startPopularCompare(item.v1.id, item.v2.id)}
                        className="w-full py-2 bg-transparent border border-gray-200 dark:border-[#f3ebdd]/10 rounded-lg text-xs font-semibold text-gray-700 dark:text-[#f3ebdd] hover:bg-[#f3ebdd] dark:hover:bg-[#f3ebdd]/5 transition-colors"
                      >
                        {item.label}
                      </button>
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
                  className="bg-[#f3ebdd] dark:bg-[#141b2b] border border-gray-200 dark:border-[#f3ebdd]/5 hover:bg-[#e8dfd1] dark:hover:bg-[#f3ebdd]/5 p-2 rounded-lg transition-colors text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#f3ebdd] shadow-sm"
                >
                  Back
                </button>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-[#f3ebdd]">
                  {activeNonNullVehicles.map(v => v.name).join(" vs ")}
                </h1>
              </div>

              {/* Compare Slots Header */}
              <div className="bg-[#f3ebdd] dark:bg-[#141b2b] border border-gray-200 dark:border-[#f3ebdd]/5 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                  
                  {/* Left Controls */}
                  <div className="flex flex-col gap-3 justify-center">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-[#f3ebdd]">
                      <input 
                        type="checkbox" 
                        checked={hideCommon} 
                        onChange={() => setHideCommon(!hideCommon)} 
                        className="rounded accent-[#c1291A] bg-[#e8dfd1] dark:bg-gray-900 border-gray-300 dark:border-[#f3ebdd]/10"
                      />
                      Hide common features
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-[#f3ebdd]">
                      <input 
                        type="checkbox" 
                        checked={highlightDiff} 
                        onChange={() => setHighlightDiff(!highlightDiff)}
                        className="rounded accent-[#c1291A] bg-[#e8dfd1] dark:bg-gray-900 border-gray-300 dark:border-[#f3ebdd]/10"
                      />
                      Highlight differences
                    </label>
                  </div>

                  {/* Active Comparison slots */}
                  {slots.map((slotId, idx) => {
                    const vehicle = slotId ? vehicles.find(v => v.id === slotId) : null;
                    return (
                      <div key={idx} className="relative bg-[#f3ebdd] dark:bg-[#1d273a]/40 border border-gray-200 dark:border-[#f3ebdd]/5 rounded-xl p-4 flex flex-col justify-between h-52">
                        {vehicle ? (
                          <>
                            <button 
                              onClick={() => handleRemoveVehicle(idx)}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-[#f3ebdd] rounded-full p-1 transition-colors shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="h-24 w-full flex items-center justify-center p-2">
                              <img src={vehicle.imageUrl || '/honda-logo.svg'} className="h-full object-contain" />
                            </div>
                            <div className="mt-2 text-center">
                              <h3 className="font-bold text-xs line-clamp-1 text-gray-900 dark:text-[#f3ebdd]">{vehicle.name}</h3>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">{vehicle.brand}</span>
                              <span className="text-[#c1291A] font-bold text-xs block mt-1">NPR {vehicle.price.toLocaleString('en-IN')}</span>
                            </div>
                          </>
                        ) : (
                          <div 
                            onClick={() => {
                              setActiveSlotIdx(idx);
                              setIsModalOpen(true);
                            }}
                            className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-[#f3ebdd] cursor-pointer border border-dashed border-gray-300 dark:border-[#f3ebdd]/10 rounded-xl hover:bg-[#e8dfd1] dark:hover:bg-[#f3ebdd]/5 transition-all duration-300"
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
              <div className="flex border-b border-gray-200 dark:border-[#f3ebdd]/10 gap-6 mb-8 text-sm">
                {(['SPECIFICATIONS', 'FEATURES'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-semibold transition-all relative ${activeTab === tab ? 'text-[#c1291A]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#f3ebdd]'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c1291A]"></span>
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
                  className="w-full bg-[#f3ebdd] dark:bg-[#141b2b] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl py-3 pl-10 pr-4 text-xs text-gray-900 dark:text-[#f3ebdd] placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors shadow-sm"
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
                      <div key={cat.title} className="bg-[#f3ebdd] dark:bg-[#141b2b] border border-gray-200 dark:border-[#f3ebdd]/5 rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleAccordion(cat.title)}
                          className="w-full flex items-center justify-between p-5 bg-[#f3ebdd] dark:bg-[#1c2438]/50 hover:bg-[#e8dfd1] dark:hover:bg-[#1c2438] transition-colors text-left"
                        >
                          <span className="font-bold text-sm tracking-wide text-gray-900 dark:text-[#f3ebdd]">{cat.title}</span>
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
                                          className={`p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5 text-center text-xs font-medium ${highlightDiff && isDifferent ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 font-bold' : 'text-gray-900 dark:text-[#f3ebdd]'}`}
                                        >
                                          {specVal}
                                        </div>
                                      );
                                    } else {
                                      return <div key={`empty-${idx}`} className="p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5 text-center text-gray-400 dark:text-gray-500">—</div>;
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
                <div className="bg-[#f3ebdd] dark:bg-[#141b2b] border border-gray-200 dark:border-[#f3ebdd]/5 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Class Features</h3>
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    <div className="grid grid-cols-1 lg:grid-cols-5 p-4 items-center">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Digital Console</div>
                      <div className="p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5"></div>
                      {slots.map((slotId, idx) => {
                        if (slotId) {
                          return <div key={idx} className="p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5 text-center text-xs text-gray-900 dark:text-[#f3ebdd]">Yes</div>;
                        }
                        return <div key={idx} className="p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5 text-center text-xs text-gray-400 dark:text-gray-500">—</div>;
                      })}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 p-4 items-center">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Bluetooth Connectivity</div>
                      <div className="p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5"></div>
                      {slots.map((slotId, idx) => {
                        if (slotId) {
                          const vehicle = vehicles.find(v => v.id === slotId)!;
                          return <div key={idx} className="p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5 text-center text-xs text-gray-900 dark:text-[#f3ebdd]">{vehicle.name.toLowerCase().includes('xsr') || vehicle.name.toLowerCase().includes('hornet') || vehicle.name.toLowerCase().includes('ntorq') ? 'Yes' : 'No'}</div>;
                        }
                        return <div key={idx} className="p-2 border-l border-gray-100 dark:border-[#f3ebdd]/5 text-center text-xs text-gray-400 dark:text-gray-500">—</div>;
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#f3ebdd] dark:bg-[#141b2b] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setActiveSlotIdx(null);
                setSearchQuery('');
              }}
              className="absolute top-4 right-4 bg-[#e8dfd1] dark:bg-[#f3ebdd]/5 hover:bg-gray-250 dark:hover:bg-[#f3ebdd]/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#f3ebdd] rounded-full p-2 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-[#f3ebdd]/5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#f3ebdd] mb-4 text-left">Select Your Brand or Model</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input 
                  type="text"
                  placeholder="Type to Select Brand or Model"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f3ebdd] dark:bg-[#0d111b] border border-gray-250 dark:border-[#f3ebdd]/10 rounded-xl py-3 pl-10 pr-4 text-xs text-gray-900 dark:text-[#f3ebdd] placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-left">
              
              {/* Recently Visited */}
              {searchQuery === '' && (
                <div>
                  <h3 className="text-[10px] tracking-wider font-extrabold uppercase text-gray-500 dark:text-gray-400 mb-3">Recently Visited</h3>
                  <div className="flex gap-4">
                    <div 
                      onClick={() => handleAddVehicle(vehicles[0].id)}
                      className="bg-[#f3ebdd] dark:bg-[#1d273a]/40 border border-gray-200 dark:border-[#f3ebdd]/5 hover:border-gray-300 dark:hover:border-[#f3ebdd]/10 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors w-full sm:w-auto shadow-sm"
                    >
                      <img src={vehicles[0].imageUrl || '/honda-logo.svg'} className="h-10 w-12 object-contain" />
                      <div>
                        <span className="text-[9px] tracking-wide text-gray-500 dark:text-gray-400 font-semibold block">{vehicles[0].brand}</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-[#f3ebdd]">{vehicles[0].name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Popular Brands Accordion */}
              <div>
                <h3 className="text-[10px] tracking-wider font-extrabold uppercase text-gray-500 dark:text-gray-400 mb-3">Popular Brands</h3>
                
                {searchQuery !== '' ? (
                  <div className="flex flex-col gap-2">
                    {filteredVehicles.map(v => (
                      <div 
                        key={v.id}
                        onClick={() => handleAddVehicle(v.id)}
                        className="p-3 bg-[#f3ebdd] dark:bg-[#0d111b] border border-gray-200 dark:border-[#f3ebdd]/5 hover:border-[#c1291A] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">{v.brand}</span>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-[#f3ebdd] mt-0.5">{v.name}</h4>
                        </div>
                        <span className="text-xs text-red-500 font-semibold">NPR {v.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-4">No matching models found.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {brands.map(brand => {
                      const isExpanded = expandedBrand === brand;
                      const brandVehicles = vehicles.filter(v => v.brand === brand);
                      return (
                        <div key={brand} className="border border-gray-200 dark:border-[#f3ebdd]/5 rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => setExpandedBrand(isExpanded ? null : brand)}
                            className="w-full flex items-center justify-between p-3.5 bg-[#f3ebdd] dark:bg-[#0d111b] hover:bg-[#e8dfd1] dark:hover:bg-[#1a2335]/40 transition-colors text-left"
                          >
                            <span className="font-bold text-sm text-gray-900 dark:text-[#f3ebdd]">{brand}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                          </button>
                          
                          {isExpanded && (
                            <div className="p-3 bg-[#f3ebdd] dark:bg-[#0d111b]/80 border-t border-gray-200 dark:border-[#f3ebdd]/5 divide-y divide-gray-100 dark:divide-white/5 max-h-48 overflow-y-auto">
                              {brandVehicles.map(v => (
                                <div
                                  key={v.id}
                                  onClick={() => handleAddVehicle(v.id)}
                                  className="py-2.5 px-1.5 hover:bg-[#f3ebdd] dark:hover:bg-[#f3ebdd]/5 rounded cursor-pointer transition-colors flex items-center justify-between"
                                >
                                  <span className="text-xs text-gray-800 dark:text-[#f3ebdd] font-medium">{v.name}</span>
                                  <span className="text-[10px] text-red-500 font-bold">NPR {v.price.toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
