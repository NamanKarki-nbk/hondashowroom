import { PrismaClient } from '../app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const mockSales = {
  4: 74, // April
  5: 79, // May
  6: 70, // June
  7: 76, // July
  8: 77, // August
};

async function main() {
  console.log("Seeding Mock Sales...");

  // 1. Create a dummy customer
  const dummyCustomer = await prisma.customer.upsert({
    where: { phone: "0000000000" },
    update: {},
    create: {
      fullName: "Demo Mock Customer",
      phone: "0000000000",
      address: "Mock Address"
    }
  });

  let totalSeeded = 0;

  for (const [monthStr, count] of Object.entries(mockSales)) {
    const month = parseInt(monthStr);
    const year = 2026;
    
    for (let i = 0; i < count; i++) {
      // Create date spread somewhat evenly across the month
      const day = (i % 28) + 1; 
      const createdAt = new Date(year, month - 1, day, 12, 0, 0); // month is 0-indexed in JS Date
      
      const uniqueId = Math.floor(Math.random() * 1000000000);
      
      // 2. Create a dummy vehicle
      const vehicle = await prisma.vehicleInventory.create({
        data: {
          vin: `MOCKVIN${uniqueId}`,
          engineNo: `MOCKENG${uniqueId}`,
          category: "MOTORCYCLE",
          modelName: "Mock Model",
          cc: 125,
          color: "Mock Color",
          purchasePrice: 100000,
          purchaseDate: new Date(year, month - 2, 1),
          purchaseMethod: "Cash",
          status: "SOLD",
          createdAt: createdAt
        }
      });

      // 3. Create the sale transaction
      await prisma.salesTransaction.create({
        data: {
          invoiceNo: `INV-MOCK-${uniqueId}`,
          vehicleId: vehicle.id,
          customerId: dummyCustomer.id,
          saleType: "Retail",
          paymentType: "CASH",
          finalAmount: 150000,
          commission: 1500,
          createdAt: createdAt,
          updatedAt: createdAt
        }
      });
      totalSeeded++;
    }
    console.log(`Seeded ${count} sales for ${year}-${month}`);
  }

  console.log(`✅ Seeded ${totalSeeded} mock sales successfully.`);
}

main()
  .catch(console.error)
  .finally(() => pool.end());
