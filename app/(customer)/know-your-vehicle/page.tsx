"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home, ChevronRight, Wrench, Shield, Battery, Droplets,
  Activity, Settings, PenTool, X, ChevronRight as Arrow,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Character Definitions ────────────────────────────────────────────────────
const CHARACTERS = {
  benly: {
    name: "Ms. Benly",
    role: "Enthusiast Rider",
    avatar: "/characters/Benly.jpg",
    bg: "bg-orange-50 dark:bg-orange-900/10",
    border: "border-orange-200 dark:border-orange-700/30",
    nameColor: "text-orange-600 dark:text-orange-400",
    bubble: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/30",
    side: "left" as const,
  },
  dream: {
    name: "Dr. Dream",
    role: "Motorcycle Expert",
    avatar: "/characters/Dream.jpg",
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-700/30",
    nameColor: "text-blue-600 dark:text-blue-400",
    bubble: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/30",
    side: "right" as const,
  },
  cub: {
    name: "Mr. Cub",
    role: "Honda Technician",
    avatar: "/characters/cub.jpg",
    bg: "bg-green-50 dark:bg-green-900/10",
    border: "border-green-200 dark:border-green-700/30",
    nameColor: "text-green-600 dark:text-green-400",
    bubble: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/30",
    side: "right" as const,
  },
};

type CharacterKey = keyof typeof CHARACTERS;

// ─── Dialogue Types ───────────────────────────────────────────────────────────
interface DialogueLine {
  character: CharacterKey;
  text: string;
}

interface Component {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  iconBg: string;
  interval: string;
  cardImage?: string;
  dialogue: DialogueLine[];
}

// ─── Component Data with Character Dialogues ──────────────────────────────────
const COMPONENTS: Component[] = [
  {
    title: "Engine Oil",
    icon: Droplets,
    description: "Regularly checking and changing your engine oil ensures optimal performance, reduces friction, and extends the life of your engine.",
    color: "border-amber-200 dark:border-amber-900/30",
    iconBg: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400",
    interval: "Every 2,000–3,000 km or 3 months",
    cardImage: "/components/engine.png",
    dialogue: [
      { character: "benly", text: "Dr. Dream! My bike feels sluggish lately and makes a weird knocking sound. What could it be? 😟" },
      { character: "dream", text: "Ah, Ms. Benly! That sounds like it could be low or degraded engine oil. Engine oil is the lifeblood of your motorcycle — it lubricates every moving metal part and prevents heat buildup." },
      { character: "benly", text: "Ohh! So how do I know if my oil is okay? I never really checked it before..." },
      { character: "cub", text: "Easy! Look for the sight glass on the right side of the engine. With the bike upright on level ground, the oil should be between the upper and lower marks. Fresh oil is golden-amber. If it looks black and gritty — it needs changing immediately!" },
      { character: "dream", text: "Exactly! And Ms. Benly — always use Honda Genuine Motor Oil (HGMO). It's specifically formulated for your engine's tolerances. Never skip an oil change beyond 3,000 km or 3 months, whichever comes first." },
      { character: "benly", text: "Got it! Also replace the oil filter at the same time, right?" },
      { character: "cub", text: "That's right! ⭐ Pro tip: Change oil while the engine is warm — contaminants stay in suspension and drain completely. And if the oil smells burnt, your engine may be overheating!" },
    ],
  },
  {
    title: "Brake System",
    icon: Shield,
    description: "Brakes are critical for your safety. Periodic inspection of brake pads, fluids, and lines is essential to maintain responsive stopping power.",
    color: "border-red-200 dark:border-red-900/30",
    iconBg: "bg-red-50 dark:bg-red-900/10 text-primary",
    interval: "Every 6,000 km or before long trips",
    cardImage: "/components/brake.png",
    dialogue: [
      { character: "benly", text: "Mr. Cub! My brakes make a terrible squealing sound when I stop. Should I be worried? 😰" },
      { character: "cub", text: "Yes, Ms. Benly — never ignore brake noises! Squealing usually means your brake pads have worn down to the metal wear indicator. Look through the caliper — pads must be at least 2mm thick. When the wear groove disappears, replace immediately!" },
      { character: "dream", text: "The brake system is your most critical safety component. Worn pads, degraded hydraulic fluid, or air bubbles in the brake lines can drastically increase your stopping distance — sometimes by 30% or more!" },
      { character: "benly", text: "That's scary! My lever also feels a bit spongy sometimes. What does that mean?" },
      { character: "dream", text: "Spongy lever feel means air has entered your hydraulic brake line. This requires bleeding — removing the air bubbles. Visit an authorized Honda service centre immediately. Do not ride if brakes feel spongy!" },
      { character: "cub", text: "Also flush and replace your brake fluid every 2 years. Brake fluid absorbs moisture from the air over time, which lowers its boiling point and causes brake fade when the brakes heat up during hard stopping. Use only DOT 3 or DOT 4 fluid as specified." },
      { character: "benly", text: "I'll book a service right away! Thank you both! 🙏" },
    ],
  },
  {
    title: "Battery Health",
    icon: Battery,
    description: "A healthy battery ensures reliable starts and powers your vehicle's electrical systems. Check terminals for corrosion and monitor voltage.",
    color: "border-blue-200 dark:border-blue-900/30",
    iconBg: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
    interval: "Check monthly, replace every 2–3 years",
    cardImage: "/components/battery-icon.png",
    dialogue: [
      { character: "benly", text: "Why does my Honda sometimes struggle to start, especially on cold mornings? The engine cranks slowly... 😴" },
      { character: "dream", text: "That's a classic sign of a weak battery, Ms. Benly! Your 12V battery powers the starter motor, ignition, fuel injection system, and all electronics. Modern BS6 bikes with OBD2 sensors need stable voltage to function properly." },
      { character: "cub", text: "Use a multimeter to test it! A healthy battery reads 12.6–12.8V at rest. While the engine runs, you should see 13.5–14.5V — that's the alternator charging. Below 12.0V means your battery is discharged and needs attention." },
      { character: "benly", text: "What about that white powder I see on the battery terminals? 🤔" },
      { character: "cub", text: "That's corrosion — battery acid vapour oxidising the terminal. Clean it with a mixture of baking soda and water, rinse, and dry. Corroded terminals cause voltage drop and unreliable starting even when the battery is healthy!" },
      { character: "dream", text: "And if you park your bike for more than 2 weeks, use a battery tender or trickle charger. Motorcycle alternators are designed to maintain charge, not recover deeply discharged batteries. Neglected batteries sulfate and lose capacity permanently." },
      { character: "benly", text: "I had no idea! I'll get a battery tender for my garage. 💡" },
    ],
  },
  {
    title: "Tyres & Pressure",
    icon: Activity,
    description: "Maintaining proper tyre pressure and checking for wear improves handling, fuel efficiency, and prevents sudden blowouts on the road.",
    color: "border-green-200 dark:border-green-900/30",
    iconBg: "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400",
    interval: "Pressure weekly, tread depth monthly",
    dialogue: [
      { character: "benly", text: "My bike feels a bit wobbly when I go around corners. Could my tyres be the problem? 🤨" },
      { character: "cub", text: "Absolutely! Wobbly handling is a major tyre warning sign. First, check your tyre pressure. Honda recommends: Front 29 PSI, Rear 33 PSI for solo riding. With a pillion, inflate the rear to 36 PSI. Always check when tyres are cold — hot tyres give false high readings!" },
      { character: "dream", text: "Correct tyre pressure is crucial, Ms. Benly. Under-inflated tyres overheat, wear the edges faster, and can fail catastrophically at speed. Over-inflated tyres reduce grip and make the ride harsh. The tyre is literally your only contact with the road!" },
      { character: "benly", text: "What about the tread? How do I know when it's worn out? 😮" },
      { character: "cub", text: "Look for the Tyre Wear Indicator (TWI) moulded into the grooves. When the tread reaches that level, replace immediately. Also inspect the sidewalls for cracks or bulges — a bulge means internal damage and that tyre can blow out without warning!" },
      { character: "dream", text: "Also check this — if you can see the outer ring of a coin inserted into the tread groove, the tyres need replacing. And never repair a sidewall puncture — always replace the tyre. Tyre rubber also hardens with age, so replace every 5 years regardless of tread depth." },
      { character: "benly", text: "I never thought a tyre could be 'old' even if it looks okay! Learned something important today 🎓" },
    ],
  },
  {
    title: "Drive Chain",
    icon: Settings,
    description: "Clean, lubricate, and adjust your drive chain regularly to ensure smooth power delivery from the engine to the rear wheel.",
    color: "border-purple-200 dark:border-purple-900/30",
    iconBg: "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400",
    interval: "Lube every 500 km, adjust every 1,000 km",
    dialogue: [
      { character: "benly", text: "There's a clunking, slapping noise from the rear of my bike. It gets louder when I accelerate. What is it? 😟" },
      { character: "cub", text: "Sounds like your drive chain is either too loose or too dry, Ms. Benly! Check the chain slack — push it up at the midpoint between both sprockets. There should be exactly 25–35mm of vertical play. Too loose = chain slap. Too tight = premature bearing wear!" },
      { character: "dream", text: "The drive chain transmits ALL the engine power to your rear wheel. A neglected chain doesn't just fail itself — it rapidly wears out the front and rear sprockets too. Replacing all three together costs significantly more than regular chain maintenance!" },
      { character: "benly", text: "How often should I lubricate it? And can I use any oil I find in the garage? 🤔" },
      { character: "cub", text: "Lubricate every 500 km, or immediately after riding in rain or washing your bike. NEVER use WD-40 — it's a water displacer, not a lubricant, and it washes out proper chain lube. Use Honda Genuine Drive Chain Lubricant spray — it's O-ring compatible and stays on!" },
      { character: "dream", text: "To check if the chain needs replacing — measure 10 links from pin to pin. A new chain measures 127mm. If it measures more than 130mm, the chain is stretched and must be replaced together with both sprockets as a complete set. A new chain on worn sprockets wears out twice as fast!" },
      { character: "benly", text: "I'll never use WD-40 on my chain again! 😅 And I'll get a proper chain lube spray right away." },
    ],
  },
  {
    title: "Filters & Spark Plugs",
    icon: PenTool,
    description: "Air filters and spark plugs directly impact combustion efficiency. Replacing them as per schedule keeps the engine breathing right.",
    color: "border-gray-200 dark:border-gray-700",
    iconBg: "bg-background dark:bg-gray-800 text-gray-600 dark:text-gray-300",
    interval: "Air filter 10,000 km, spark plug 8,000 km",
    dialogue: [
      { character: "benly", text: "Dr. Dream, my bike is blowing black smoke from the exhaust and the fuel economy got much worse suddenly! 😱" },
      { character: "dream", text: "Sounds like a blocked air filter! A clogged filter starves the engine of oxygen, causing it to run 'rich' — too much fuel, not enough air. This causes black smoke, poor power, and can even wash oil off your cylinder walls, causing internal damage!" },
      { character: "cub", text: "Remove the air filter from the side panel and hold it up to a light. If you can't see light through it, it's time to replace. In dusty road conditions — common here in Nepal — check it every 5,000 km instead of the usual 10,000 km!" },
      { character: "benly", text: "Can I just clean it with compressed air? That's what my cousin does... 🤔" },
      { character: "cub", text: "Absolutely NOT for paper filters! High-pressure air creates microscopic tears that let abrasive dust particles slip through into the engine. Those tiny dust particles act like sandpaper on your cylinders. Always replace a dirty paper filter!" },
      { character: "dream", text: "And check your spark plug too, Ms. Benly! Remove it and look at the electrode colour. Light grey-tan means healthy combustion. Black and sooty means rich mixture — check the air filter. White or blistered means the engine is running too hot. The spark plug colour tells the complete story of engine health!" },
      { character: "benly", text: "So the spark plug is like a health report card for my engine! Replace the air filter every 10,000 km and the spark plug every 8,000 km. Got it! 📋" },
    ],
  },
];

// ─── Dialogue Bubble Component ────────────────────────────────────────────────
function DialogueBubble({
  line,
  index,
}: {
  line: DialogueLine;
  index: number;
}) {
  const char = CHARACTERS[line.character];
  const isLeft = char.side === "left";

  return (
    <motion.div
      className={`flex items-end gap-3 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div className={`w-14 h-14 rounded-full border-2 ${char.border} overflow-hidden bg-background shadow-sm`}>
          <Image src={char.avatar} alt={char.name} width={56} height={56} className="w-full h-full object-cover" />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wide ${char.nameColor} leading-tight text-center max-w-[56px]`}>
          {char.name.split(" ")[0]}
        </span>
      </div>

      {/* Speech bubble */}
      <div className={`relative max-w-[75%] px-4 py-3 rounded-2xl border text-sm leading-relaxed text-gray-700 dark:text-gray-200 shadow-sm ${char.bubble} ${isLeft ? "rounded-bl-sm" : "rounded-br-sm"}`}>
        <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${char.nameColor}`}>{char.name}</p>
        {line.text}
        {/* Tail */}
        <div
          className={`absolute bottom-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ${
            isLeft
              ? "left-[-8px] border-r-[8px] border-r-orange-200 dark:border-r-orange-700/30"
              : "right-[-8px] border-l-[8px] border-l-blue-200 dark:border-l-blue-700/30"
          }`}
          style={line.character === "cub" ? { borderLeftColor: "rgb(187 247 208 / 0.3)" } : {}}
        />
      </div>
    </motion.div>
  );
}

// ─── Modal Component ──────────────────────────────────────────────────────────
function ComponentModal({ comp, onClose }: { comp: Component; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <motion.div
          className="relative bg-background dark:bg-[#111] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-background/10 flex flex-col"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-background dark:bg-[#111] border-b border-gray-100 dark:border-background/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${comp.iconBg} ${comp.color}`}>
                <comp.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-primary-foreground">{comp.title}</h2>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {comp.interval}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e8dfd1] /10 hover:bg-gray-200 dark:hover:bg-background/20 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Component image if available */}
          {comp.cardImage && (
            <div className="mx-6 mt-5 rounded-2xl overflow-hidden bg-background /5 border border-gray-100 dark:border-background/10">
              <Image
                src={comp.cardImage}
                alt={comp.title}
                width={600}
                height={300}
                className="w-full object-contain max-h-52"
              />
            </div>
          )}

          {/* Character intro strip */}
          <div className="mx-6 mt-5 rounded-2xl bg-background /5 border border-gray-100 dark:border-background/5 px-4 py-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3 text-center">Meet the Experts</p>
            <div className="flex items-center justify-center gap-6">
              {(["benly", "dream", "cub"] as CharacterKey[]).map((key) => {
                const c = CHARACTERS[key];
                return (
                  <div key={key} className="flex flex-col items-center gap-1.5">
                    <div className={`w-12 h-12 rounded-full border-2 ${c.border} overflow-hidden bg-background shadow`}>
                      <Image src={c.avatar} alt={c.name} width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-black ${c.nameColor}`}>{c.name}</p>
                      <p className="text-[9px] text-gray-400">{c.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dialogue */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold text-center mb-2">💬 Their Conversation</p>
            {comp.dialogue.map((line, idx) => (
              <DialogueBubble key={idx} line={line} index={idx} />
            ))}
          </div>

          {/* CTA Footer */}
          <div className="sticky bottom-0 bg-background dark:bg-[#111] border-t border-gray-100 dark:border-background/10 px-6 py-4 flex gap-3 rounded-b-3xl">
            <Link
              href="/book-now"
              className="flex-1 bg-primary text-primary-foreground text-sm font-bold px-5 py-3 rounded-xl hover:bg-primary-hover transition-colors text-center"
            >
              Book a Service
            </Link>
            <Link
              href="/owners-manual?tab=schedule"
              className="flex-1 bg-[#e8dfd1] /10 text-gray-900 dark:text-primary-foreground text-sm font-bold px-5 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-background/20 transition-colors text-center"
            >
              View Schedule
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KnowYourVehiclePage() {
  const [activeModal, setActiveModal] = useState<Component | null>(null);

  return (
    <div className="min-h-screen bg-background dark:bg-[#0B0B0C] pt-28 pb-24">

      {/* Modal */}
      {activeModal && (
        <ComponentModal comp={activeModal} onClose={() => setActiveModal(null)} />
      )}

      {/* Hero */}
      <div className="bg-background dark:bg-[#111] border-b border-gray-100 dark:border-background/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-primary-foreground font-medium">Know Your Vehicle</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                <span className="w-6 h-0.5 bg-primary rounded-full" />
                Right to Repair &amp; Maintenance
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold lg:text-5xl font-black text-gray-900 dark:text-primary-foreground tracking-tight leading-tight">
                Periodic Maintenance for Safe, Reliable Riding
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
                Your safety and your vehicle's performance depend on regular upkeep. Learn from our expert characters about your Honda's critical components.
              </p>
            </div>

            {/* Character preview in hero */}
            <div className="hidden md:flex items-end gap-2 flex-shrink-0">
              {(["benly", "dream", "cub"] as CharacterKey[]).map((key, i) => {
                const c = CHARACTERS[key];
                return (
                  <motion.div
                    key={key}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <div className={`w-20 h-20 rounded-full border-2 ${c.border} overflow-hidden bg-background shadow-lg`}>
                      <Image src={c.avatar} alt={c.name} width={80} height={80} className="w-full h-full object-cover" />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-wide ${c.nameColor}`}>{c.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Characters intro banner */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-background/10 p-8">
          <h2 className="text-center text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-primary-foreground mb-2">Your Maintenance Guide Characters</h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">Click "Read More" on any component card to follow their conversation and learn about your Honda</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["benly", "dream", "cub"] as CharacterKey[]).map((key) => {
              const c = CHARACTERS[key];
              return (
                <motion.div
                  key={key}
                  whileHover={{ y: -4 }}
                  className={`flex flex-col items-center text-center gap-4 p-6 rounded-2xl border ${c.bg} ${c.border}`}
                >
                  <div className={`w-24 h-24 rounded-full border-2 ${c.border} overflow-hidden bg-background shadow-md`}>
                    <Image src={c.avatar} alt={c.name} width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className={`text-base font-black ${c.nameColor}`}>{c.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{c.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                      {key === "benly" && "A passionate rider who loves long trips but often neglects maintenance — until she learns the hard way!"}
                      {key === "dream" && "The wise motorcycle professor who explains complex mechanical concepts in a fun, easy-to-understand way."}
                      {key === "cub" && "A Honda-certified technician who knows every bolt and bearing — from vintage classics to the latest models."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Components Grid */}
      <div className="bg-background dark:bg-[#111] py-20 border-y border-gray-100 dark:border-background/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-black text-gray-900 dark:text-primary-foreground mb-4">Critical Components to Monitor</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Click <strong>"Read More"</strong> to follow Ms. Benly, Dr. Dream, and Mr. Cub as they walk you through each component in a fun conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPONENTS.map((comp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-background dark:bg-[#1A1A1A] rounded-3xl border border-gray-100 dark:border-background/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Card image */}
                {comp.cardImage ? (
                  <div className="h-44 bg-background /5 overflow-hidden">
                    <Image
                      src={comp.cardImage}
                      alt={comp.title}
                      width={480}
                      height={176}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className={`h-44 flex items-center justify-center ${comp.iconBg}`}>
                    <comp.icon className="w-20 h-20 opacity-20" />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${comp.iconBg} ${comp.color}`}>
                      <comp.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-primary-foreground">{comp.title}</h3>
                  </div>

                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                    <Clock className="w-3 h-3 flex-shrink-0" /> {comp.interval}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">
                    {comp.description}
                  </p>

                  {/* Character mini avatars + Read More */}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {(["benly", "dream", "cub"] as CharacterKey[]).map((key) => (
                        <div key={key} className={`w-7 h-7 rounded-full border-2 border-background dark:border-[#1A1A1A] overflow-hidden ${CHARACTERS[key].bg}`}>
                          <Image src={CHARACTERS[key].avatar} alt={CHARACTERS[key].name} width={28} height={28} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveModal(comp)}
                      className="flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-3 transition-all duration-200"
                    >
                      Read More <Arrow className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 dark:bg-[#161616] rounded-3xl p-10 flex flex-col justify-between items-start relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold font-black text-primary-foreground mb-4">Always Use Genuine Honda Parts</h3>
              <p className="text-gray-400 mb-8 max-w-md">
                Non-genuine parts can compromise your safety and vehicle performance. Insist on Honda Genuine Parts for guaranteed reliability and perfect fit.
              </p>
            </div>
            <Link href="/book-now" className="relative z-10 bg-background text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-[#e8dfd1] transition-colors">
              Book Service Now
            </Link>
            <Settings className="absolute -right-8 -bottom-8 w-48 h-48 text-primary-foreground/5 group-hover:rotate-45 transition-transform duration-700" />
          </div>

          <div className="bg-primary rounded-3xl p-10 flex flex-col justify-between items-start relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold font-black text-primary-foreground mb-4">Protect with Extended Warranty</h3>
              <p className="text-red-100 mb-8 max-w-md">
                Secure your peace of mind against unexpected repair costs. Our extended warranty packages cover major mechanical and electrical components.
              </p>
            </div>
            <Link href="/warranty" className="relative z-10 bg-black text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">
              Explore Warranty Plans
            </Link>
            <Shield className="absolute -right-4 -bottom-4 w-48 h-48 text-black/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
