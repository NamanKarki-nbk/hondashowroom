import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './app/generated/prisma/index.js';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL.replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const customers = await prisma.customer.findMany({
    where: {
      isVerified: false,
      documents: {
        some: {
          isVerified: true
        }
      }
    },
    include: { documents: true }
  });

  console.log(`Found ${customers.length} customers with verified documents but Customer.isVerified = false`);

  for (const c of customers) {
    await prisma.customer.update({
      where: { id: c.id },
      data: { isVerified: true }
    });
    console.log(`  ✅ Fixed: ${c.fullName} (${c.id})`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
