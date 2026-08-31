import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3ZCKunbpOR8E@ep-divine-king-aznw5hiw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const v = await prisma.vehicleMaster.findFirst({
    include: { variants: true }
  });
  console.log(JSON.stringify(v, null, 2));
}
main();
