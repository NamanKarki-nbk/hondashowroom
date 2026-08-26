import { PrismaClient } from '../app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Deleting Mock Sales...");

  // 1. Delete all mock SalesTransactions
  const deletedSales = await prisma.salesTransaction.deleteMany({
    where: {
      invoiceNo: {
        startsWith: "INV-MOCK-"
      }
    }
  });
  console.log(`Deleted ${deletedSales.count} mock SalesTransactions.`);

  // 2. Delete all mock VehicleInventory
  const deletedVehicles = await prisma.vehicleInventory.deleteMany({
    where: {
      vin: {
        startsWith: "MOCKVIN"
      }
    }
  });
  console.log(`Deleted ${deletedVehicles.count} mock VehicleInventory records.`);

  console.log("✅ Mock data cleanup completed.");
}

main()
  .catch(console.error)
  .finally(() => pool.end());
