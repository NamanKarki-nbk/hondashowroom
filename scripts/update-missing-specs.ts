import { PrismaClient } from '../app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const specsData = {
  "EG 1000": {
    "Body Dimensions": [
      { name: "Length", value: "395 mm" },
      { name: "Width", value: "320 mm" },
      { name: "Height", value: "390 mm" },
      { name: "Dry Weight", value: "22.6 kg" },
      { name: "Fuel Tank Capacity", value: "3.6 L" }
    ],
    "Engine": [
      { name: "Engine Type", value: "4 Stroke, OHV, Single Cylinder" },
      { name: "Displacement", value: "98 cc" },
      { name: "Ignition System", value: "Transistorized Magneto" },
      { name: "Starting System", value: "Recoil Start" },
      { name: "Fuel Type", value: "Petrol" }
    ],
    "Electricals": [
      { name: "Rated Output", value: "750 VA" },
      { name: "Max Output", value: "850 VA" },
      { name: "Voltage Regulator", value: "AVR" },
      { name: "Rated Voltage", value: "220 V" },
      { name: "Rated Frequency", value: "50 Hz" }
    ]
  },
  "CB Hornet 2.0": {
    "Body Dimensions": [
      { name: "Length", value: "2047 mm" },
      { name: "Width", value: "783 mm" },
      { name: "Height", value: "1064 mm" },
      { name: "Wheelbase", value: "1355 mm" },
      { name: "Ground Clearance", value: "167 mm" },
      { name: "Kerb Weight", value: "142 kg" },
      { name: "Seat Length", value: "590 mm" },
      { name: "Fuel Tank Capacity", value: "12 L" }
    ],
    "Engine": [
      { name: "Type", value: "4 Stroke, SI Engine, BS-VI" },
      { name: "Displacement", value: "184.4 cc" },
      { name: "Max Engine Output", value: "12.7 kW @ 8500 rpm" },
      { name: "Max Torque", value: "16.1 Nm @ 6000 rpm" },
      { name: "Fuel System", value: "PGM-FI" },
      { name: "Bore x Stroke", value: "61.0 x 63.09 mm" },
      { name: "Compression Ratio", value: "9.5:1" }
    ],
    "Transmission": [
      { name: "Clutch Type", value: "Multiplate Wet Clutch" },
      { name: "No. of Gears", value: "5" }
    ],
    "Tyres and Brakes": [
      { name: "Tyre Size (Front)", value: "110/70-17 M/C 54S (Tubeless)" },
      { name: "Tyre Size (Rear)", value: "140/70-17 M/C 66S (Tubeless)" },
      { name: "Brake Type & Size (Front)", value: "Disc 276 mm (1-Channel ABS)" },
      { name: "Brake Type & Size (Rear)", value: "Disc 220 mm" }
    ],
    "Frames & Suspension": [
      { name: "Frame Type", value: "Diamond" },
      { name: "Front Suspension", value: "Upside Down Fork (USD)" },
      { name: "Rear Suspension", value: "Monoshock" }
    ],
    "Electricals": [
      { name: "Battery", value: "12V, 5.0 Ah" },
      { name: "Head Lamp", value: "LED" },
      { name: "Tail Lamp", value: "LED" },
      { name: "Turn Signal Lamp", value: "LED" }
    ]
  },
  "Honda NX 200": {
    "Body Dimensions": [
      { name: "Length", value: "2035 mm" },
      { name: "Width", value: "843 mm" },
      { name: "Height", value: "1248 mm" },
      { name: "Wheelbase", value: "1355 mm" },
      { name: "Ground Clearance", value: "167 mm" },
      { name: "Kerb Weight", value: "147 kg" },
      { name: "Seat Height", value: "810 mm" },
      { name: "Fuel Tank Capacity", value: "12 L" }
    ],
    "Engine": [
      { name: "Type", value: "4 Stroke, SI Engine, BS-VI" },
      { name: "Displacement", value: "184.4 cc" },
      { name: "Max Engine Output", value: "12.7 kW @ 8500 rpm" },
      { name: "Max Torque", value: "16.1 Nm @ 6000 rpm" },
      { name: "Fuel System", value: "PGM-FI" },
      { name: "Bore x Stroke", value: "61.0 x 63.09 mm" },
      { name: "Compression Ratio", value: "9.5:1" }
    ],
    "Transmission": [
      { name: "Clutch Type", value: "Multiplate Wet Clutch" },
      { name: "No. of Gears", value: "5" }
    ],
    "Tyres and Brakes": [
      { name: "Tyre Size (Front)", value: "110/70-17 M/C 54S (Tubeless)" },
      { name: "Tyre Size (Rear)", value: "140/70-17 M/C 66S (Tubeless)" },
      { name: "Brake Type & Size (Front)", value: "Disc 276 mm (1-Channel ABS)" },
      { name: "Brake Type & Size (Rear)", value: "Disc 220 mm" }
    ],
    "Frames & Suspension": [
      { name: "Frame Type", value: "Diamond" },
      { name: "Front Suspension", value: "Upside Down Fork (USD)" },
      { name: "Rear Suspension", value: "Monoshock" }
    ],
    "Electricals": [
      { name: "Battery", value: "12V, 5.0 Ah" },
      { name: "Head Lamp", value: "LED" },
      { name: "Tail Lamp", value: "LED" },
      { name: "Turn Signal Lamp", value: "LED" }
    ]
  }
};

async function main() {
  console.log("Updating missing specifications...");
  for (const [modelName, specifications] of Object.entries(specsData)) {
    const product = await prisma.productCatalog.findFirst({
      where: { name: { contains: modelName, mode: 'insensitive' } }
    });
    
    if (product) {
      await prisma.productCatalog.update({
        where: { id: product.id },
        data: { specifications }
      });
      console.log(`✅ Updated specifications for ${modelName}`);
    } else {
      console.log(`❌ Product not found: ${modelName}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => pool.end());
