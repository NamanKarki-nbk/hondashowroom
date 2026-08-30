import { PrismaClient } from './app/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const result = await prisma.vehicleMaster.deleteMany({
    where: { category: 'AUTOMOBILES' }
  });
  console.log('Deleted cars:', result.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
