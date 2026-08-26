import { PrismaClient } from './app/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const p = await prisma.productCatalog.findFirst({ where: { name: { contains: 'Dio BS6 110', mode: 'insensitive' } }, select: { name: true, features: true } });
  console.log(JSON.stringify((p?.features as any)?.[0], null, 2));
}
main().catch(console.error);
