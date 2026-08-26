import { PrismaClient } from '@/app/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`.replace(/^["']|["']$/g, '')
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma_v6: PrismaClient | undefined
  prisma_v7_temp: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma_v7_temp ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v7_temp = prisma
