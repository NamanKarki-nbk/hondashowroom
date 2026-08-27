const { PrismaClient } = require('./app/generated/prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.productCatalog.findFirst({ where: { name: 'Honda Dio BS6 110' } });
  console.log(JSON.stringify(p, null, 2));
}
main().finally(() => prisma.$disconnect());
