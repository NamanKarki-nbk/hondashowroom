import { PrismaClient } from '../app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const featuresData = {
  "EG 1000": [
    { title: "Fuel Efficiency", description: "Highly fuel-efficient 4-stroke engine ensures longer run time and cost savings.", image: "/models/hero-1.png" },
    { title: "Compact & Portable", description: "Lightweight design with a sturdy frame makes it easy to transport and store.", image: "/models/hero-2.png" },
    { title: "Recoil Start", description: "Easy-to-use recoil starting system for quick and reliable ignition.", image: "/models/hero-1.png" },
    { title: "Circuit Breaker", description: "Protects the generator from overload for safe and reliable power output.", image: "/models/hero-2.png" },
    { title: "Quiet Operation", description: "Designed for low noise levels, ensuring a peaceful environment.", image: "/models/hero-1.png" }
  ],
  "EZ6500CXS": [
    { title: "High Power Output", description: "Delivers a robust 5.5 kVA max output for demanding commercial and home applications.", image: "/models/hero-1.png" },
    { title: "Electric Start", description: "Convenient electric start system alongside recoil for effortless ignition.", image: "/models/hero-2.png" },
    { title: "Large Fuel Tank", description: "Equipped with a large capacity tank for extended continuous operation.", image: "/models/hero-1.png" },
    { title: "Sturdy Frame", description: "Heavy-duty full frame protection for durability in tough conditions.", image: "/models/hero-2.png" },
    { title: "AVR System", description: "Automatic Voltage Regulator ensures stable power for sensitive equipment.", image: "/models/hero-1.png" }
  ],
  "EZ3000CX": [
    { title: "Reliable Performance", description: "Provides consistent power output for home backup and light commercial use.", image: "/models/hero-1.png" },
    { title: "Oil Alert System", description: "Automatically shuts down the engine when oil levels are dangerously low.", image: "/models/hero-2.png" },
    { title: "Voltmeter Display", description: "Built-in voltmeter allows you to easily monitor the output voltage.", image: "/models/hero-1.png" },
    { title: "Long Run Time", description: "Optimized fuel consumption for longer uninterrupted operation.", image: "/models/hero-2.png" },
    { title: "Durable Build", description: "Constructed with high-quality materials to withstand regular use.", image: "/models/hero-1.png" }
  ],
  "CB Hornet 2.0": [
    { title: "Aggressive Design", description: "Muscular fuel tank, sharp edges, and a sporty aesthetic that stands out.", image: "/models/hero-1.png" },
    { title: "Powerful 184.4cc Engine", description: "PGM-FI HET engine delivering thrilling acceleration and superior performance.", image: "/models/hero-2.png" },
    { title: "USD Forks", description: "Premium golden USD front forks for advanced handling and shock absorption.", image: "/models/hero-1.png" },
    { title: "All-LED Lighting", description: "X-shaped LED tail lamp and bold LED headlamp for superior visibility.", image: "/models/hero-2.png" },
    { title: "Digital Meter", description: "Provides comprehensive information with a gear position indicator and battery voltmeter.", image: "/models/hero-1.png" }
  ],
  "Honda NX 200": [
    { title: "Adventure-Ready Stance", description: "Tall visor, knuckle guards, and robust fairing designed for urban exploration.", image: "/models/hero-1.png" },
    { title: "Upright Riding Posture", description: "Ergonomically designed for fatigue-free long rides on varied terrains.", image: "/models/hero-2.png" },
    { title: "Block Pattern Tyres", description: "Tough tires providing excellent grip on both tarmac and mild off-road trails.", image: "/models/hero-1.png" },
    { title: "Long Travel Suspension", description: "Engineered to absorb bumps effortlessly for a smooth ride.", image: "/models/hero-2.png" },
    { title: "PGM-FI Engine", description: "Responsive and efficient 184.4cc engine tailored for both city commutes and weekend getaways.", image: "/models/hero-1.png" }
  ]
};

async function main() {
  console.log("Updating missing features...");
  for (const [modelName, features] of Object.entries(featuresData)) {
    const product = await prisma.vehicleMaster.findFirst({
      where: { name: { contains: modelName, mode: 'insensitive' } }
    });
    
    if (product) {
      await prisma.vehicleMaster.update({
        where: { id: product.id },
        data: { features }
      });
      console.log(`✅ Updated features for ${modelName}`);
    } else {
      console.log(`❌ Product not found: ${modelName}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => pool.end());
