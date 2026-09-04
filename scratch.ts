import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const receipts = await prisma.paymentReceipt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: {
      transaction: true
    }
  });
  console.dir(receipts, { depth: null });
}
main();
