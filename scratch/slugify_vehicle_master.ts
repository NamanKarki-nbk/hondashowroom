import { PrismaClient } from '../app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') + "?sslmode=require" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log("Slugifying VehicleMaster IDs...");
  
  const vehicles = await prisma.vehicleMaster.findMany();
  let count = 0;
  
  for (const vehicle of vehicles) {
    const slug = generateSlug(vehicle.name);
    
    // Only update if the id is not already the slug
    if (vehicle.id !== slug) {
      console.log(`Updating ${vehicle.name}: ${vehicle.id} -> ${slug}`);
      try {
        // We use raw SQL because Prisma might not handle ID primary key updates natively via update() easily
        await prisma.$executeRaw`UPDATE "VehicleMaster" SET id = ${slug} WHERE id = ${vehicle.id}`;
        count++;
      } catch (e) {
        console.error(`Failed to update ${vehicle.name}:`, e.message);
      }
    }
  }
  
  console.log(`Finished slugifying ${count} vehicles.`);
}

main().catch(console.error).finally(() => pool.end());
