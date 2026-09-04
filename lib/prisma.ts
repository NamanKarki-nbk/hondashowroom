import { PrismaClient } from '@/app/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`.replace(/^["']|["']$/g, '')
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma_8: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma_8 ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_8 = prisma
// force reload
