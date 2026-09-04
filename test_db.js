const { PrismaClient } = require('./app/generated/prisma/index.js');
const prisma = new PrismaClient();
async function run() {
  const sales = await prisma.salesTransaction.findMany({
    where: { paymentType: 'FINANCE' },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, customer: { select: { fullName: true } }, financePdfUrl: true }
  });
  console.log(JSON.stringify(sales, null, 2));
}
run();
