import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') + "?sslmode=require" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const dio125Features = [
  {
    title: "Bold Graphics & Dual-Tone Colour",
    description: "Makes you stand out in the crowd with bold new styling.",
    image: "bold-graphics-and-dual-tone-colour.png"
  },
  {
    title: "Headlamp & Split LED Position Lamp",
    description: "Striking headlamp design for superior visibility and style.",
    image: "split-led-position-lamp-and-headlamp.png"
  },
  {
    title: "Sporty Tail Light",
    description: "Aggressive tail lamp design that leaves a lasting impression.",
    image: "sporty-tail-light.png"
  },
  {
    title: "Dual-Tip Muffler",
    description: "Sporty exhaust design producing a refined sound.",
    image: "dual-tip-muffler.png"
  },
  {
    title: "Intelligent Meter",
    description: "Fully digital console keeping you informed on the go.",
    image: "smart-digital-meter.png"
  },
  {
    title: "PGM-FI System",
    description: "Sensor-based fuel injection for optimum performance and mileage.",
    image: "pgm-fi-system.png"
  },
  {
    title: "Silent Start with ACG",
    description: "Starts silently by removing gear meshing noise.",
    image: "silent-start-with-acg.png"
  },
  {
    title: "Idling Stop System",
    description: "Automatically switches off the engine at traffic lights to save fuel.",
    image: "idling-stop-system.png"
  },
  {
    title: "Smart Key",
    description: "Honda Smart Key with Smart Find, Unlock, Start, and Safe features.",
    image: "smart-key-only-in-dlx-variant.png"
  },
  {
    title: "Side Stand Engine Cut Off",
    description: "Prevents engine start when side stand is engaged.",
    image: "side-stand-engine-cut-off.png"
  },
  {
    title: "External Fuel Lid",
    description: "Convenient fueling without opening the seat.",
    image: "external-fuel-lid.png"
  },
  {
    title: "Front Glove Box",
    description: "Easily accessible storage space for small items.",
    image: "front-glove-box.png"
  },
  {
    title: "Integrated Pass Switch",
    description: "Convenient passing switch for overtaking safely.",
    image: "integrated-pass-switch.png"
  },
  {
    title: "Under-Seat Storage",
    description: "Generous storage space for your everyday essentials.",
    image: "under-seat-storage.png"
  }
];

async function main() {
  console.log("Updating Dio 125 features with images...");
  const product = await prisma.vehicleMaster.findFirst({
    where: { name: { contains: "Dio BS6 125", mode: 'insensitive' } }
  });
  
  if (product) {
    await prisma.vehicleMaster.update({
      where: { id: product.id },
      data: { features: dio125Features }
    });
    console.log(`✅ Updated features for Dio 125`);
  } else {
    console.log(`❌ Product not found for Dio 125`);
  }
}

main()
  .catch(console.error)
  .finally(() => pool.end());
