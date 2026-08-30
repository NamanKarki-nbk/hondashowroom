import { PrismaClient } from '../app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') + "?sslmode=require" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const oldModelNameToVariant = {
  "DIO BS6 STD": { master: "Honda Dio BS6 110", variant: "Standard (STD)" },
  "DIO BS6 DLX": { master: "Honda Dio BS6 110", variant: "Deluxe (DLX)" },
  "DIO 125 STD": { master: "Honda Dio BS6 125", variant: "Standard (STD)" },
  "DIO 125 DLX SMART": { master: "Honda Dio BS6 125", variant: "Deluxe (DLX / H-Smart)" },
  "SP 125 DRS BS6": { master: "Honda SP Shine BS6 125", variant: "Drum Brake (DRS)" },
  "SP 125 DSS BS6": { master: "Honda SP Shine BS6 125", variant: "Disc Brake (DSS)" },
  "Shine 125 DRS BS6": { master: "Honda CB Shine BS6 125", variant: "Drum Brake (DRS)" },
  "Shine 125 DSS BS6": { master: "Honda CB Shine BS6 125", variant: "Disc Brake (DSS)" },
};

async function main() {
  console.log("Seeding Finance Plans...");
  // Clear existing finance plans for these models just in case
  await prisma.financePlan.deleteMany({
    where: {
      variant: {
        vehicleMaster: {
          name: { in: Object.values(oldModelNameToVariant).map(v => v.master) }
        }
      }
    }
  });

  // Read the original plans from seed-finance.ts
  const fs = require('fs');
  const fileContent = fs.readFileSync('prisma/seed-finance.ts', 'utf-8');
  
  // Very hacky but effective extraction of the plans array
  const match = fileContent.match(/const plans = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error("Could not find plans array in seed-finance.ts");
    return;
  }
  
  const plans = eval(match[1]);
  console.log(`Found ${plans.length} plans to seed.`);
  
  for (const plan of plans) {
    const mapping = oldModelNameToVariant[plan.modelName];
    if (!mapping) {
      console.log(`No mapping for ${plan.modelName}, skipping.`);
      continue;
    }
    
    const dbVariant = await prisma.vehicleVariant.findFirst({
      where: {
        variantName: mapping.variant,
        vehicleMaster: {
          name: mapping.master
        }
      }
    });
    
    if (!dbVariant) {
      console.log(`Could not find DB variant for ${mapping.master} - ${mapping.variant}`);
      continue;
    }
    
    await prisma.financePlan.create({
      data: {
        variantId: dbVariant.id,
        tenureMonths: plan.tenureMonths,
        downPaymentPct: plan.downPaymentPct,
        interestRate: plan.interestRate,
        downPayment: plan.downPayment,
        loanAmount: plan.loanAmount,
        emi: plan.emi,
        totalInterest: plan.totalInterest,
        registration: plan.registration,
        insurance: plan.insurance,
        totalCost: plan.totalCost,
        insuranceTotal: plan.insuranceTotal
      }
    });
  }
  
  console.log("Finance plans seeded successfully!");
}

main().catch(console.error).finally(() => pool.end());
