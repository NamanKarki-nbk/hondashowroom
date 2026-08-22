import { PrismaClient } from '../app/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const imageMap: Record<string, string> = {
  'Honda Dio BS6 110': '/inventory/honda-dio-bs6.png',
  'Honda Dio BS6 125': '/inventory/honda-dio-125.png',
  'Honda Shine BS6': '/inventory/honda-shine-bs6.png',
  'Honda SP Shine 125': '/inventory/honda-sp-125-.png',
  'CB Hornet 2.0': '/inventory/cb-hornet-2-0.png',
  'Honda NX 200': '/inventory/honda-nx-200.png',
};

async function main() {
  const catalogs = await prisma.productCatalog.findMany();
  for (const c of catalogs) {
    if (imageMap[c.name]) {
      console.log(`Updating ${c.name} -> ${imageMap[c.name]}`);
      await prisma.productCatalog.update({
        where: { id: c.id },
        data: { imageUrl: imageMap[c.name] },
      });
    } else {
      console.log(`No mapping for ${c.name}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
