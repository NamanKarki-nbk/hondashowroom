import { prisma } from './lib/prisma';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const sales = await prisma.salesTransaction.findMany({
    where: { paymentType: 'FINANCE' },
    orderBy: { createdAt: 'desc' },
    take: 1,
    select: { id: true, customer: { select: { fullName: true } }, financePdfUrl: true }
  });
  console.log(JSON.stringify(sales, null, 2));
}
run().catch(console.error).finally(() => process.exit(0));
