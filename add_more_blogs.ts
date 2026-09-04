import 'dotenv/config';
import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-divine-king-aznw5hiw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const blogs = [
  {
    "title": "15 Most Unbelievable Motorcycle Myths and Misconceptions",
    "author": "Honda Nepal",
    "imageUrl": "https://honda.com.np/wp-content/uploads/2026/02/Motorcycle-Myths.jpg",
    "createdAt": new Date("2026-06-15T00:00:00.000Z"),
    "updatedAt": new Date("2026-06-15T00:00:00.000Z"),
    "content": "**Separating Fact from Fiction for Every Rider**\nRiding culture is full of folklore passed down through generations. While some advice is harmless, common motorcycle myths can lead to bad habits, expensive mechanical failures, or dangerous situations on the road. Replacing these rumors with reality allows you to ride with confidence and clarity.\n\n**Myth 1: \"Loud Pipes Save Lives\"**\nReality: Sound travels backward out of the exhaust. Modern car cabins are soundproofed, and drivers usually listen to music. Exhaust noise projects away from the vehicle in front of you—where the majority of dangerous collisions occur. Dynamic visibility, proper positioning, and bright gear protect you much more effectively than noise.\n\n**Myth 2: \"Laying the Bike Down is Safer Than Braking\"**\nReality: Intentionally sliding loses control. Modern rubber tires on asphalt provide a far higher coefficient of friction and deceleration under maximum upright braking than sliding on metal and plastic engine guards.\n\n**Myth 3: \"Never Use the Front Brake\"**\nReality: Up to 70% to 80% of stopping power comes from the front brake. Use progressive squeezing rather than sudden grabbing to safely manage weight transfer and shorten stopping distance.\n\n**Myth 4: \"You Must Flat-Foot Both Feet at a Stop\"**\nReality: Sliding slightly off the seat to plant your left foot while keeping your right foot on the rear brake gives complete stability on any size motorcycle.\n\n**Myth 5: \"ABS Braking Isn't Safe or Necessary\"**\nReality: Anti-lock Braking Systems prevent wheel lockup during emergency stops, preserving steerability and reducing stopping distances dramatically on wet or dusty roads.\n\n**Myth 6: \"Revving the Engine in the Morning Warms It Up Faster\"**\nReality: Aggressively revving a cold engine causes accelerated wear because oil hasn't fully circulated. Modern engines only require 30 seconds of quiet idling before riding gently.\n\n**Myth 7: \"Helmets Restrict Your Vision and Hearing\"**\nReality: DOT/ECE certified helmets are engineered to preserve full peripheral vision (over 210 degrees) while filtering out wind noise, making critical traffic sounds easier to hear."
  },
  {
    "title": "Disk Brakes: Everything You Need To Know",
    "author": "Honda Nepal",
    "imageUrl": "https://honda.com.np/wp-content/uploads/2026/06/Disc-Brakes-Guide.jpg",
    "createdAt": new Date("2026-06-03T00:00:00.000Z"),
    "updatedAt": new Date("2026-06-03T00:00:00.000Z"),
    "content": "**Why Disk Brakes Are the Gold Standard for Stopping Power**\nStopping power is the single most critical safety feature on any vehicle. Unlike legacy drum brakes that operate inside an enclosed hub, a disc brake system isolates the stopping action to an exposed metal rotor. This open architecture dissipates thermal buildup quickly, preventing brake fade and providing consistent stopping power regardless of weather.\n\n**Topic 1: \"How Disc Brakes Operate\"**\nMechanics: Pulling the brake lever transmits mechanical or hydraulic force into internal caliper pistons. These pistons force sacrificial brake pads directly against both sides of the rapidly spinning rotor, converting kinetic energy into thermal energy to slow the wheel safely.\n\n**Topic 2: \"Mechanical vs. Hydraulic Systems\"**\nComparison: Mechanical disc brakes use steel cables and are easy to maintain with basic tools, but they require higher hand force. Hydraulic systems use fluid lines to multiply hand pressure effortlessly, providing superior brake modulation and instant lever response.\n\n**Topic 3: \"ABS and CBS Integration\"**\nAssist Technologies: ABS (Anti-lock Braking System) monitors wheel speed to prevent lockup during sudden stops. CBS (Combined Braking System) automatically balances force between front and rear wheels to keep the chassis stable during braking.\n\n**Topic 4: \"Signs Your Disc Brakes Need Replacement\"**\nMaintenance Warnings: High-pitched squealing or metal-on-metal grinding indicates worn brake pads. Pulsing through the lever indicates a warped rotor, and a soft, spongy lever signals air trapped in hydraulic lines."
  },
  {
    "title": "Why Lubricating Your Motorcycle Chain Is Essential: The Ultimate Maintenance Guide",
    "author": "Honda Nepal",
    "imageUrl": "https://honda.com.np/wp-content/uploads/2026/02/Necessity-of-Motorcycle-chain-lubrication-1024x576.png",
    "createdAt": new Date("2026-02-11T00:00:00.000Z"),
    "updatedAt": new Date("2026-02-11T00:00:00.000Z"),
    "content": "**The Critical Lifeline of Your Drivetrain**\nYour motorcycle chain transfers rotational power directly from the gearbox output shaft to the rear wheel. Because it operates exposed to rain, dust, and debris, routine chain care is vital for maintaining performance and preventing catastrophic failures.\n\n**Reason 1: \"Reduces Friction and Component Wear\"**\nFunction: Hundreds of metal pins, rollers, and side plates slide against each other thousands of times per minute. Regular lubrication prevents metal-on-metal friction from stretching the chain and wearing down sprocket teeth.\n\n**Reason 2: \"Prevents Rust and Corrosion\"**\nFunction: Chains made of carbon steel rust quickly when exposed to rain and atmospheric humidity. Chain lube creates a hydrophobic, water-resistant protective barrier over all metal surfaces.\n\n**Reason 3: \"Improves Fuel Efficiency and Power Delivery\"**\nFunction: A dry, stiff, or kinked chain creates parasitic friction drag, forcing the engine to burn more fuel to transfer power to the rear wheel.\n\n**Reason 4: \"Best Practices for Chain Care\"**\nMaintenance Routine: Clean and lube your chain every 500–700 km. Spray O-ring safe lube on the inner loop of the chain after a ride while the chain is warm, and let it set for 15 minutes before riding."
  },
  {
    "title": "How to Improve Your Bike's Mileage and Performance",
    "author": "Honda Nepal",
    "imageUrl": "https://honda.com.np/wp-content/uploads/2026/01/Improve-Bike-Mileage.jpg",
    "createdAt": new Date("2026-01-19T00:00:00.000Z"),
    "updatedAt": new Date("2026-01-19T00:00:00.000Z"),
    "content": "**Maximizing Fuel Efficiency in Urban Commutes**\nNavigating congested city streets, heavy stop-and-go traffic, and variable road conditions places high demands on your engine. Adopting fuel-efficient habits and staying on top of maintenance keeps running costs low while preserving engine responsiveness.\n\n**Habit 1: \"Smooth Throttle Control\"**\nAction: Avoid sudden, aggressive throttle twists. Smooth, progressive throttle application saves significant amounts of fuel during urban commuting.\n\n**Habit 2: \"Optimal Gear Selection\"**\nAction: Shift gears at the manufacturer's recommended RPM. Avoid lugging the engine in high gears at low speeds or over-revving in lower gears.\n\n**Habit 3: \"Engine Idling Management\"**\nAction: Turn off your ignition if stuck at long traffic lights or railway signals exceeding 30 seconds to stop unnecessary fuel consumption.\n\n**Maintenance 1: \"Tire Pressure and Air Filter Care\"**\nAction: Low tire pressure increases rolling resistance and forces the engine to work harder. Clogged air filters starve the engine of oxygen, resulting in rich fuel mixture and wasted petrol. Inspect both weekly."
  }
];

async function main() {
  console.log('Inserting blogs...');
  for (const blog of blogs) {
    const created = await prisma.blog.create({
      data: blog
    });
    console.log(`Inserted: ${created.title} (${created.id})`);
  }
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
