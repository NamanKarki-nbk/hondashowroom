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
      fullName: { contains: 'SUCCESS', mode: 'insensitive' }
    },
    include: { documents: true }
  });

  for (const c of customers) {
    console.log(`Customer: ${c.fullName} | isVerified: ${c.isVerified}`);
    for (const d of c.documents) {
      console.log(`  Doc: ${d.docType} | number: ${d.docNumber} | isVerified: ${d.isVerified} | front: ${d.frontUrl ? 'yes' : 'no'}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
