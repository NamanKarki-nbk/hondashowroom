import { PrismaClient } from './app/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.productCatalog.findMany({
    select: { id: true, name: true }
  });
  console.log("DB Products:");
  products.forEach(p => console.log(`${p.name} -> ${p.id}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
