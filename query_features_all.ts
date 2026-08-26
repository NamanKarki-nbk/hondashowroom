import { PrismaClient } from './app/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const p110 = await prisma.productCatalog.findFirst({ where: { name: { contains: 'Dio BS6 110', mode: 'insensitive' } }, select: { features: true } });
  const p125 = await prisma.productCatalog.findFirst({ where: { name: { contains: 'Dio BS6 125', mode: 'insensitive' } }, select: { features: true } });
  console.log("DIO 110 images:", (p110?.features as any[])?.map((f:any) => f.image));
  console.log("DIO 125 images:", (p125?.features as any[])?.map((f:any) => f.image));
}
main().catch(console.error);
