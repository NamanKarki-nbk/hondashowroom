import { PrismaClient } from '../app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/^['"]|['"]$/g, '') });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const targets = [
  { year: 2026, month: 4, target: 78, monthName: "April 2026" },
  { year: 2026, month: 5, target: 88, monthName: "May 2026" },
  { year: 2026, month: 6, target: 85, monthName: "June 2026" },
  { year: 2026, month: 7, target: 95, monthName: "July 2026" },
  { year: 2026, month: 8, target: 99, monthName: "August 2026" },
  { year: 2026, month: 9, target: 103, monthName: "September 2026" },
  { year: 2026, month: 10, target: 154, monthName: "October 2026" },
  { year: 2026, month: 11, target: 147, monthName: "November 2026" },
  { year: 2026, month: 12, target: 82, monthName: "December 2026" },
  { year: 2027, month: 1, target: 102, monthName: "January 2027" },
  { year: 2027, month: 2, target: 100, monthName: "February 2027" },
  { year: 2027, month: 3, target: 118, monthName: "March 2027" },
];

async function main() {
  console.log("Seeding Sales Targets...");
  for (const t of targets) {
    await prisma.salesTarget.upsert({
      where: { year_month: { year: t.year, month: t.month } },
      update: { target: t.target, monthName: t.monthName },
      create: { year: t.year, month: t.month, target: t.target, monthName: t.monthName }
    });
  }
  console.log("✅ Seeded Sales Targets successfully.");
}

main()
  .catch(console.error)
  .finally(() => pool.end());
