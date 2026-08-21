"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Fuel, TrendingDown, Calculator, Zap, Leaf, BarChart2, RefreshCw } from 'lucide-react';

type Vehicle = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

const MILEAGE_MAP: Record<string, number> = {
  'CB Hornet 2.0': 42,
  'Honda SP 125 ': 60,
  'Honda NX 200': 40,
  'Honda Shine BS6': 65,
  'Honda Dio 125': 50,
  'Honda Dio BS6': 50,
};

function getFallbackMileage(name: string) {
  if (name.toLowerCase().includes('scooter') || name.toLowerCase().includes('dio')) return 50;
  if (name.toLowerCase().includes('shine')) return 65;
  if (name.toLowerCase().includes('hornet')) return 42;
  if (name.toLowerCase().includes('nx')) return 40;
  return 55;
}

export default function FuelCalculatorClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [vehicleId, setVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [dailyDistance, setDailyDistance] = useState<number>(30);
  const [fuelPrice, setFuelPrice] = useState<number>(180);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(26);
  const [mileage, setMileage] = useState<number>(50);

  // Sync mileage when vehicle changes
  useEffect(() => {
    const v = vehicles.find(v => v.id === vehicleId);
    if (v) {
      const defaultMileage = MILEAGE_MAP[v.name] || getFallbackMileage(v.name);
      setMileage(defaultMileage);
    }
  }, [vehicleId, vehicles]);

  // Calculations
  const monthlyDistance = dailyDistance * daysPerMonth;
  const monthlyLitres = monthlyDistance / mileage;
  const monthlyCost = monthlyLitres * fuelPrice;
  const yearlyCost = monthlyCost * 12;
  const costPerKm = fuelPrice / mileage;

  // Average car comparison (12 kmpl)
  const carMonthlyLitres = monthlyDistance / 12;
  const carMonthlyCost = carMonthlyLitres * fuelPrice;
  const yearlySavings = (carMonthlyCost * 12) - yearlyCost;

  const handleReset = () => {
    setDailyDistance(30);
    setFuelPrice(180);
    setDaysPerMonth(26);
    if (vehicles.length > 0) {
      setVehicleId(vehicles[0].id);
    }
  };

  const chartData = useMemo(() => {
    return vehicles.map(v => {
      const vMileage = MILEAGE_MAP[v.name] || getFallbackMileage(v.name);
      const vCost = ((dailyDistance * daysPerMonth) / vMileage) * fuelPrice;
      return { ...v, cost: vCost, vMileage };
    }).sort((a, b) => b.cost - a.cost); // Sort highest to lowest cost
  }, [vehicles, dailyDistance, daysPerMonth, fuelPrice]);

  const maxCost = Math.max(...chartData.map(d => d.cost), 1);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background dark:bg-slate-950">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary"
          >
            <Gauge className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-bold text-gray-900 dark:text-primary-foreground mb-4"
          >
            Fuel Cost <span className="text-primary">Calculator</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Find out exactly how much you'll spend on fuel every month and see how much you can save with a new Honda.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-3xl p-8 shadow-xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 dark:text-primary-foreground flex items-center">
                <Calculator className="w-6 h-6 mr-3 text-primary" />
                Your Details
              </h2>
              <button 
                onClick={handleReset}
                className="text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 flex items-center transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Reset
              </button>
            </div>

            <div className="space-y-8">
              {/* Vehicle Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Vehicle
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-background dark:bg-[#1a1a1c] border border-gray-200 dark:border-background/10 text-gray-900 dark:text-primary-foreground rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Daily Distance */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Daily Distance (km)
                  </label>
                  <span className="text-xl md:text-2xl font-semibold font-bold text-primary">{dailyDistance} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={dailyDistance}
                  onChange={(e) => setDailyDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 km</span>
                  <span>150 km</span>
                </div>
              </div>

              {/* Days Per Month */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days Commuting Per Month
                  </label>
                  <span className="text-xl md:text-2xl font-semibold font-bold text-primary">{daysPerMonth} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="31"
                  value={daysPerMonth}
                  onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 day</span>
                  <span>31 days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Fuel Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fuel Price (NPR/L)
                  </label>
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(Number(e.target.value))}
                    className="w-full bg-background dark:bg-[#1a1a1c] border border-gray-200 dark:border-background/10 text-gray-900 dark:text-primary-foreground font-semibold rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                {/* Mileage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mileage (kmpl)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="80"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full bg-background dark:bg-[#1a1a1c] border border-gray-200 dark:border-background/10 text-gray-900 dark:text-primary-foreground font-semibold rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            {/* Primary Result */}
            <div className="bg-gradient-to-br from-primary to-red-800 rounded-3xl p-8 shadow-2xl text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
                <Fuel className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <h3 className="text-red-100 font-semibold mb-2 text-lg">Monthly Fuel Cost</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold font-bold">NPR</span>
                  <span className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-6xl font-bold tracking-tight md:text-7xl font-black tracking-tighter">
                    {monthlyCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="mt-8 pt-8 border-t border-red-500/30 grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-red-200 text-sm mb-1">Yearly Cost</p>
                    <p className="text-2xl md:text-3xl font-semibold font-bold">NPR {yearlyCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-red-200 text-sm mb-1">Cost Per Km</p>
                    <p className="text-2xl md:text-3xl font-semibold font-bold">NPR {costPerKm.toFixed(2)}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-red-200 text-sm mb-1">Fuel Consumed</p>
                    <p className="text-2xl md:text-3xl font-semibold font-bold">{monthlyLitres.toFixed(1)} Litres/mo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Widget */}
            <div className="bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-3xl p-6 shadow-lg flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-500" />
                  <h4 className="font-bold text-gray-900 dark:text-primary-foreground">Annual Savings</h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Compared to an average car (12 kmpl)</p>
              </div>
              <div className="text-right">
                <span className="block text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black text-green-500">
                  NPR {yearlySavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-green-600/70 dark:text-green-400/70">
                  Saved per year
                </span>
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-2xl p-4 flex items-start space-x-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-500">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-gray-900 dark:text-primary-foreground mb-1">Eco-riding</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Maintain a steady speed of 40-50 km/h for optimal mileage.</p>
                </div>
              </div>
              <div className="bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-2xl p-4 flex items-start space-x-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-gray-900 dark:text-primary-foreground mb-1">Tyre Pressure</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Check tyre pressure weekly. Low pressure increases fuel drag.</p>
                </div>
              </div>
              <div className="bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-2xl p-4 flex items-start space-x-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-purple-500">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-gray-900 dark:text-primary-foreground mb-1">Regular Service</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fresh engine oil and clean filters significantly improve efficiency.</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Comparison Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center space-x-3 mb-8">
            <BarChart2 className="w-6 h-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-primary-foreground">Monthly Cost Comparison</h3>
          </div>
          
          <div className="space-y-4">
            {chartData.map((v) => {
              const isSelected = v.id === vehicleId;
              const barWidth = `${(v.cost / maxCost) * 100}%`;
              return (
                <div key={v.id} className="relative flex items-center group">
                  <div className="w-1/4 pr-4 text-right">
                    <span className={`text-sm font-semibold truncate block ${isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                      {v.name}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase">{v.vMileage} kmpl</span>
                  </div>
                  <div className="w-3/4 h-8 bg-[#e8dfd1] dark:bg-gray-800 rounded-full overflow-hidden flex items-center relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: barWidth }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full flex items-center px-4 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-primary to-red-600 shadow-[0_0_15px_rgba(237,27,46,0.5)]' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                    </motion.div>
                    <span className={`absolute left-0 pl-4 text-xs font-bold whitespace-nowrap z-10 ${
                      isSelected ? 'text-primary-foreground' : 'text-gray-700 dark:text-primary-foreground'
                    }`} style={{ left: `calc(${barWidth} - 100px)`}}>
                      {/* Ensures text is visible even on small bars, positioned right after bar or inside if large enough. For simplicity just place it after the bar */}
                    </span>
                    <span className="absolute left-0 pl-4 text-xs font-bold z-10 text-primary-foreground mix-blend-difference">
                      NPR {v.cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
